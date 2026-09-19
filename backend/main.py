from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import SessionLocal, init_db
from app.db_models import TicketDB
from app.routers import ask, documents, tickets

init_db()

# Seed the two demo tickets on first run only (empty table)
with SessionLocal() as db:
    if db.query(TicketDB).count() == 0:
        db.add_all([
            TicketDB(title="Login page broken", priority="high", status="open"),
            TicketDB(title="Typo on homepage", priority="low", status="open"),
        ])
        db.commit()

app = FastAPI(title="Cortex Backend - Learning Demo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # the Next.js frontend's origin
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Cortex backend is running"}


app.include_router(tickets.router)
app.include_router(ask.router)
app.include_router(documents.router)
