import json

import anthropic
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.config import claude, documents_collection
from app.database import get_db
from app.db_models import ConversationDB, MessageDB, UserDB
from app.dependencies import get_current_user_optional
from app.memory import update_context
from app.models import AskRequest
from app.tools import TOOLS, execute_tool

router = APIRouter(tags=["ask"])

# Safety cap on the tool-call loop below - stops a pathological case (Claude
# requesting tool after tool forever) from hanging the request indefinitely.
MAX_TOOL_ROUNDS = 3

# Sliding window: only the most recent N messages get resent to Claude, so
# request size/cost stays bounded instead of growing forever. The database
# still keeps every message - this only limits what gets read back and sent.
# Tradeoff: anything said earlier than this window is genuinely forgotten
# by Claude, even though it's still sitting in the messages table.
MAX_HISTORY_MESSAGES = 10


def sse_event(data: dict) -> str:
    """Format one Server-Sent Events message - 'data: <json>\\n\\n' is the
    exact wire format a browser's streaming reader expects, one event per
    blank-line-terminated block."""
    return f"data: {json.dumps(data)}\n\n"


@router.post("/ask")
def ask_claude(
    request: AskRequest,
    db: Session = Depends(get_db),
    current_user: UserDB | None = Depends(get_current_user_optional),
):
    # --- Conversation memory --- (unchanged from before streaming)
    if request.conversation_id is not None:
        conversation = db.get(ConversationDB, request.conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = ConversationDB(user_id=current_user.id if current_user else None)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    db.add(MessageDB(conversation_id=conversation.id, role="user", content=request.question))
    db.commit()
    db.refresh(conversation)

    recent_messages = conversation.messages[-MAX_HISTORY_MESSAGES:]
    claude_messages = [{"role": m.role, "content": m.content} for m in recent_messages]

    system_prompt = "You are a helpful support assistant for Cortex, a ticketing platform."
    if conversation.context:
        system_prompt += f"\n\nKnown facts about this conversation:\n{conversation.context}"

    messages_for_api = list(claude_messages)

    # --- Document/RAG retrieval --- (unchanged)
    sources: list[str] = []
    if documents_collection.count() > 0:
        results = documents_collection.query(
            query_texts=[request.question],
            n_results=min(3, documents_collection.count()),
        )
        relevant_chunks = results["documents"][0]
        sources = [meta["filename"] for meta in results["metadatas"][0]]

        if relevant_chunks and messages_for_api and messages_for_api[-1]["role"] == "user":
            context = "\n\n".join(relevant_chunks)
            messages_for_api[-1] = {
                "role": "user",
                "content": (
                    f"Context from uploaded documents:\n{context}\n\n"
                    f"Question: {request.question}\n\n"
                    "Answer using the context above when it's relevant. If "
                    "the context doesn't contain the answer, say so and "
                    "answer generally or use an available tool instead."
                ),
            }

    def event_stream():
        full_answer = ""
        try:
            rounds = 0
            while True:
                # Streaming from the FIRST call (not just the final one) -
                # if this round ends in a tool_use, stream.text_stream simply
                # yields nothing (a tool-only turn has no text block), so
                # there's no wasted extra non-streaming call for the common
                # case where no tool is needed at all.
                with claude.messages.stream(
                    model="claude-opus-5",
                    max_tokens=1024,
                    system=system_prompt,
                    tools=TOOLS,
                    messages=messages_for_api,
                ) as stream:
                    for text in stream.text_stream:
                        full_answer += text
                        yield sse_event({"type": "text", "text": text})
                    final_message = stream.get_final_message()

                if final_message.stop_reason != "tool_use" or rounds >= MAX_TOOL_ROUNDS:
                    break

                # Same tool-execution mechanics as before, just feeding the
                # next iteration of this loop instead of a separate call.
                messages_for_api.append({"role": "assistant", "content": final_message.content})
                tool_results = []
                for block in final_message.content:
                    if block.type == "tool_use":
                        result_text = execute_tool(block.name, block.input, db)
                        tool_results.append(
                            {"type": "tool_result", "tool_use_id": block.id, "content": result_text}
                        )
                messages_for_api.append({"role": "user", "content": tool_results})
                rounds += 1
        except anthropic.AuthenticationError:
            yield sse_event({"type": "error", "detail": "Invalid or missing ANTHROPIC_API_KEY"})
            return
        except anthropic.RateLimitError:
            yield sse_event({"type": "error", "detail": "Rate limited by Anthropic API"})
            return
        except anthropic.APIStatusError as e:
            yield sse_event({"type": "error", "detail": f"Anthropic API error: {e.message}"})
            return

        # Now that streaming is done, we have the complete text - persist it
        # and update the rolling context exactly as before (non-streamed).
        db.add(MessageDB(conversation_id=conversation.id, role="assistant", content=full_answer))
        conversation.context = update_context(conversation.context, request.question, full_answer)
        db.commit()

        yield sse_event(
            {
                "type": "done",
                "conversation_id": conversation.id,
                "sources": list(dict.fromkeys(sources)),
            }
        )

    return StreamingResponse(event_stream(), media_type="text/event-stream")
