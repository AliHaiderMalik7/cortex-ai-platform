import anthropic
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import claude, documents_collection
from app.database import get_db
from app.db_models import ConversationDB, MessageDB
from app.memory import update_context
from app.models import AskRequest

router = APIRouter(tags=["ask"])

# Sliding window: only the most recent N messages get resent to Claude, so
# request size/cost stays bounded instead of growing forever. The database
# still keeps every message - this only limits what gets read back and sent.
# Tradeoff: anything said earlier than this window is genuinely forgotten
# by Claude, even though it's still sitting in the messages table.
MAX_HISTORY_MESSAGES = 10


@router.post("/ask")
def ask_claude(request: AskRequest, db: Session = Depends(get_db)):
    # --- Conversation memory ---
    # Claude's API is stateless - it remembers nothing between calls. The
    # only way a reply can be aware of earlier turns is if WE resend the
    # whole conversation every time. So: find (or start) this chat's row,
    # load every message already stored under it, and send that full list
    # to Claude - not just the one new question.
    if request.conversation_id is not None:
        conversation = db.get(ConversationDB, request.conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = ConversationDB()
        db.add(conversation)
        db.commit()
        db.refresh(conversation)  # loads the auto-generated id

    # Save the new user message BEFORE calling Claude, so it's included
    # when we read back conversation.messages below.
    db.add(MessageDB(conversation_id=conversation.id, role="user", content=request.question))
    db.commit()
    db.refresh(conversation)

    # Turn the stored rows into the {"role": ..., "content": ...} shape the
    # Anthropic API expects - this IS the "resend the transcript" step we
    # discussed conceptually. [-MAX_HISTORY_MESSAGES:] is the sliding window:
    # take only the last N rows, oldest-of-those-N first (order is preserved
    # since conversation.messages is already sorted by id).
    recent_messages = conversation.messages[-MAX_HISTORY_MESSAGES:]
    claude_messages = [{"role": m.role, "content": m.content} for m in recent_messages]

    sources: list[str] = []

    # --- Document/RAG retrieval (commented out while focusing on the core
    #     LLM call + conversation memory - this is the Chroma search +
    #     context-injection step from the Document Intelligence feature) ---
    # if documents_collection.count() > 0:
    #     results = documents_collection.query(
    #         query_texts=[request.question],
    #         n_results=min(3, documents_collection.count()),
    #     )
    #     relevant_chunks = results["documents"][0]
    #     sources = [meta["filename"] for meta in results["metadatas"][0]]
    #
    #     if relevant_chunks:
    #         # Inject the retrieved chunks as context ahead of the question
    #         context = "\n\n".join(relevant_chunks)
    #         user_content = (
    #             f"Context from uploaded documents:\n{context}\n\n"
    #             f"Question: {request.question}\n\n"
    #             "Answer using the context above when it's relevant. "
    #             "If the context doesn't contain the answer, say so and answer generally."
    #         )

    # The rolling context is prepended unconditionally - unlike claude_messages
    # above, it's never affected by the sliding window, so facts survive even
    # once the raw message that mentioned them has aged out of it.
    system_prompt = "You are a helpful support assistant for Cortex, a ticketing platform."
    if conversation.context:
        system_prompt += f"\n\nKnown facts about this conversation:\n{conversation.context}"

    try:
        response = claude.messages.create(
            model="claude-opus-5",
            max_tokens=1024,
            system=system_prompt,
            messages=claude_messages,
        )
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=500, detail="Invalid or missing ANTHROPIC_API_KEY")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limited by Anthropic API")
    except anthropic.APIStatusError as e:
        raise HTTPException(status_code=502, detail=f"Anthropic API error: {e.message}")

    answer = next((b.text for b in response.content if b.type == "text"), "")

    # Save Claude's reply too, so the NEXT request's history includes it.
    db.add(MessageDB(conversation_id=conversation.id, role="assistant", content=answer))

    # Fold this exchange into the rolling context summary (a second Claude
    # call - see app/memory.py for why this can't just be a fixed schema).
    conversation.context = update_context(conversation.context, request.question, answer)
    db.commit()

    # dict.fromkeys() dedupes while preserving order (unlike set())
    return {
        "answer": answer,
        "sources": list(dict.fromkeys(sources)),
        "conversation_id": conversation.id,
    }
