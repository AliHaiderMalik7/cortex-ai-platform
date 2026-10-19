from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class UserDB(Base):
    """Agents/admins always have a real account; regular users are optional -
    see the nullable user_id on TicketDB/ConversationDB below."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")  # "user" | "agent" | "admin"
    created_at = Column(DateTime(timezone=True), server_default=func.now())


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
    # Nullable on purpose: a "user" role can file a ticket anonymously (no
    # account needed). NULL = anonymous visitor, a real id = logged-in user.
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)


class ConversationDB(Base):
    """One row per chat. Holds no message content itself - just groups
    the MessageDB rows that belong to it (see the relationship below)."""

    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Same anonymous-allowed pattern as TicketDB.user_id - a chat doesn't
    # require an account.
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # Rolling summary of important facts (name, preferences, etc.), rewritten
    # after every turn by app/memory.py. Unlike the message history, this is
    # NEVER truncated by the sliding window - it's how facts survive even
    # after the raw message that mentioned them falls outside the window.
    context = Column(Text, default="")

    # One-to-many: lets us write conversation.messages in Python and get
    # every MessageDB row with this conversation's id, already ordered.
    messages = relationship("MessageDB", back_populates="conversation", order_by="MessageDB.id")


class MessageDB(Base):
    """One row per message. conversation_id is the foreign key tying many
    messages back to a single ConversationDB row - the one-to-many link."""

    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False, index=True)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("ConversationDB", back_populates="messages")
