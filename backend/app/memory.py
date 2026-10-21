from app.config import claude


def update_context(existing_context: str, user_message: str, assistant_reply: str) -> str:
    """Fold a new exchange into a short, always-current summary of
    important facts about this conversation (names, preferences, details).

    This is intentionally separate from the sliding window in ask.py - this
    summary is NEVER truncated, so a fact survives even after the raw
    message that mentioned it has fallen outside the window. Claude rewrites
    the whole summary each time (not append-only), so corrections overwrite
    old values instead of leaving contradictions sitting side by side.
    """
    prompt = (
        f"Existing known facts about this conversation:\n{existing_context or '(none yet)'}\n\n"
        f"New exchange:\nUser: {user_message}\nAssistant: {assistant_reply}\n\n"
        "Update the known facts to include anything new worth permanently "
        "remembering (names, preferences, important details). Keep it short "
        "- a few bullet points at most. If nothing new is worth remembering, "
        "return the existing facts unchanged. Reply with ONLY the updated "
        "facts, no extra commentary."
    )

    response = claude.messages.create(
        model="claude-opus-5",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}],
    )
    return next((b.text for b in response.content if b.type == "text"), existing_context)
