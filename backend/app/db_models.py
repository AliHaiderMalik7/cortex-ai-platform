from sqlalchemy import Column, Integer, String

from app.database import Base


class TicketDB(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    priority = Column(String, default="medium")
    status = Column(String, default="open")
