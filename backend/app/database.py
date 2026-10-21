import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()  # called here too (not just config.py) so this module is safe to import first

# Falls back to local SQLite if DATABASE_URL isn't set, so the app still runs
# without PostgreSQL configured.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tickets.db")

# check_same_thread is a SQLite-only quirk; PostgreSQL doesn't need it.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency: yields a session, always closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
