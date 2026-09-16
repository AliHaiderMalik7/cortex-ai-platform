import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()  # reads .env and puts its values into os.environ

# Reads ANTHROPIC_API_KEY from the environment automatically
claude = anthropic.Anthropic()

app = FastAPI(title="Cortex Backend - Learning Demo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # the Next.js frontend's origin
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketCreate(BaseModel):
    title: str
    priority: str = "medium"


class AskRequest(BaseModel):
    question: str

# In-memory "database" just for this demo (resets every time you restart the server)
tickets = [
    {"id": 1, "title": "Login page broken", "priority": "high", "status": "open"},
    {"id": 2, "title": "Typo on homepage", "priority": "low", "status": "open"},
]


@app.get("/")
def read_root():
    return {"message": "Cortex backend is running"}


@app.get("/tickets")
def list_tickets():
    return tickets


@app.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: int):
    for ticket in tickets:
        if ticket["id"] == ticket_id:
            return ticket
    raise HTTPException(status_code=404, detail="Ticket not found")


@app.post("/tickets")
def create_ticket(ticket: TicketCreate):
    new_ticket = {
        "id": len(tickets) + 1,
        "title": ticket.title,
        "priority": ticket.priority,
        "status": "open",
    }
    tickets.append(new_ticket)
    return new_ticket


@app.post("/ask")
def ask_claude(request: AskRequest):
    try:
        response = claude.messages.create(
            model="claude-opus-5",
            max_tokens=1024,
            system="You are a helpful support assistant for Cortex, a ticketing platform.",
            messages=[{"role": "user", "content": request.question}],
        )
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=500, detail="Invalid or missing ANTHROPIC_API_KEY")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limited by Anthropic API")
    except anthropic.APIStatusError as e:
        raise HTTPException(status_code=502, detail=f"Anthropic API error: {e.message}")

    answer = next((b.text for b in response.content if b.type == "text"), "")
    return {"answer": answer}


@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id: int):
    for i, ticket in enumerate(tickets):
        if ticket["id"] == ticket_id:
            tickets.pop(i)
            return {"message": f"Ticket {ticket_id} deleted"}
    raise HTTPException(status_code=404, detail="Ticket not found")
