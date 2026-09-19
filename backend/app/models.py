from pydantic import BaseModel


class TicketCreate(BaseModel):
    title: str
    priority: str = "medium"


class TicketOut(BaseModel):
    id: int
    title: str
    priority: str
    status: str

    model_config = {"from_attributes": True}  # lets this read straight from a TicketDB row


class AskRequest(BaseModel):
    question: str
