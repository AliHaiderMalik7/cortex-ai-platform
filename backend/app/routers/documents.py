import io

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pypdf import PdfReader

from app.config import documents_collection
from app.dependencies import require_role
from app.rag import chunk_text

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    _: object = Depends(require_role("agent", "admin")),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract any text from this PDF")

    chunks = chunk_text(text)
    pages = len(reader.pages)

    documents_collection.add(
        documents=chunks,
        ids=[f"{file.filename}-{i}" for i in range(len(chunks))],
        metadatas=[
            {"filename": file.filename, "chunk_index": i, "pages": pages}
            for i in range(len(chunks))
        ],
    )

    return {
        "filename": file.filename,
        "pages": pages,
        "chunks_stored": len(chunks),
    }


@router.get("")
def list_documents():
    """Group stored chunks back into a per-file summary (filename, pages, chunk count)."""
    all_data = documents_collection.get()

    summary: dict[str, dict] = {}
    for meta in all_data["metadatas"]:
        filename = meta["filename"]
        if filename not in summary:
            summary[filename] = {"filename": filename, "pages": meta.get("pages", 0), "chunks_stored": 0}
        summary[filename]["chunks_stored"] += 1

    return list(summary.values())
