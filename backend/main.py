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

# Seed one test account per role on first run - there's no self-service way
# to become an agent or admin (see UserSignup), so without this nobody could
# ever reach an agent/admin-only route. See DEV_ACCOUNTS.md for these creds.
with SessionLocal() as db:
    seed_accounts = [
        ("user@cortex.local", "user123", "user"),
        ("agent@cortex.local", "agent123", "agent"),
        ("admin@cortex.local", "admin123", "admin"),
    ]
    for email, password, role in seed_accounts:
        if not db.query(UserDB).filter(UserDB.email == email).first():
            db.add(UserDB(email=email, hashed_password=hash_password(password), role=role))
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
