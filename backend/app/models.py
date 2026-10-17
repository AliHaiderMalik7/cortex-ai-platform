from typing import Literal

from pydantic import BaseModel


class TicketCreate(BaseModel):
    # Only the title comes from the user now. priority/topic used to be typed
    # in here too, but they're now decided automatically by classify_ticket()
    # in app/classify.py, so we removed them from what the client sends.
    title: str


class TicketClassification(BaseModel):
    """The exact shape Claude's answer is forced into (see app/classify.py).

    Literal[...] here isn't just a type hint - it's what gets turned into a
    JSON schema and sent to the Claude API, so Claude is technically
    incapable of returning any value outside these lists (e.g. it can't
    answer "urgent" instead of "high" - only these exact strings are valid).
    """

    priority: Literal["high", "medium", "low"]
    topic: Literal["billing", "bug", "feature_request", "other"]


class TicketOut(BaseModel):
    id: int
    title: str
    priority: str
    topic: str
    status: str

    model_config = {"from_attributes": True}  # lets this read straight from a TicketDB row


class AskRequest(BaseModel):
    question: str
