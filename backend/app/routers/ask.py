import anthropic
from fastapi import APIRouter, HTTPException

from app.config import claude, documents_collection
from app.models import AskRequest

router = APIRouter(tags=["ask"])


@router.post("/ask")
def ask_claude(request: AskRequest):
    # Retrieval step: search Chroma for chunks relevant to the question,
    # so Claude can answer grounded in uploaded documents instead of
    # relying only on its general training knowledge.
    user_content = request.question
    sources: list[str] = []

    if documents_collection.count() > 0:
        results = documents_collection.query(
            query_texts=[request.question],
            n_results=min(3, documents_collection.count()),
        )
        relevant_chunks = results["documents"][0]
        sources = [meta["filename"] for meta in results["metadatas"][0]]

        if relevant_chunks:
            # Inject the retrieved chunks as context ahead of the question
            context = "\n\n".join(relevant_chunks)
            user_content = (
                f"Context from uploaded documents:\n{context}\n\n"
                f"Question: {request.question}\n\n"
                "Answer using the context above when it's relevant. "
                "If the context doesn't contain the answer, say so and answer generally."
            )

    try:
        response = claude.messages.create(
            model="claude-opus-5",
            max_tokens=1024,
            system="You are a helpful support assistant for Cortex, a ticketing platform.",
            messages=[{"role": "user", "content": user_content}],
        )
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=500, detail="Invalid or missing ANTHROPIC_API_KEY")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limited by Anthropic API")
    except anthropic.APIStatusError as e:
        raise HTTPException(status_code=502, detail=f"Anthropic API error: {e.message}")

    answer = next((b.text for b in response.content if b.type == "text"), "")
    # dict.fromkeys() dedupes while preserving order (unlike set())
    return {"answer": answer, "sources": list(dict.fromkeys(sources))}
