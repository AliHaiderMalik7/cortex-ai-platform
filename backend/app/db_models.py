from sqlalchemy import Column, Integer, String

from app.database import Base


class TicketDB(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    # priority and topic are set by app/classify.py (Claude's classification),
    # not sent by the client - the defaults here only apply to the fallback
    # path in create_ticket() if that Claude call fails.
    priority = Column(String, default="medium")
    topic = Column(String, default="other")
    status = Column(String, default="open")
