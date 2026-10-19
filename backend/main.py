from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import hash_password
from app.database import SessionLocal, init_db
from app.db_models import TicketDB, UserDB
from app.routers import ask, auth, documents, tickets

init_db()

# Seed the two demo tickets on first run only (empty table)
with SessionLocal() as db:
    if db.query(TicketDB).count() == 0:
        db.add_all([
            TicketDB(title="Login page broken", priority="high", topic="bug", status="open"),
            TicketDB(title="Typo on homepage", priority="low", topic="bug", status="open"),
        ])
        db.commit()

# Seed one admin account on first run - there's no self-service way to become
# an admin (see UserSignup), so without this nobody could ever manage
# documents or reach any agent/admin-only route.
with SessionLocal() as db:
    if not db.query(UserDB).filter(UserDB.role == "admin").first():
        db.add(
            UserDB(
                email="admin@cortex.local",
                hashed_password=hash_password("admin123"),
                role="admin",
            )
        )
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


app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(ask.router)
app.include_router(documents.router)
