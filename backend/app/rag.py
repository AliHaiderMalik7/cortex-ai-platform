def chunk_text(text: str, chunk_size: int = 200, overlap: int = 20) -> list[str]:
    """Split text into overlapping word-count chunks.

    The overlap means consecutive chunks share a few words, so meaning
    isn't lost for content that happens to fall right on a chunk boundary.
    """
    words = text.split()
    if not words:
        return []
    step = chunk_size - overlap
    return [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), step)
    ]
