import asyncio
import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()  # reads .env and puts its values into os.environ

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

# In-memory "database" just for this demo (resets every time you restart the server)
tickets = [
    {"id": 1, "title": "Login page broken", "priority": "high", "status": "open"},
    {"id": 2, "title": "Typo on homepage", "priority": "low", "status": "open"},
]


@app.get("/")
def read_root():
    return {"message": "Cortex backend is running"}


@app.get("/config-check")
def config_check():
    return {"app_name": os.getenv("APP_NAME")}


@app.get("/bad-async-wait")
async def bad_async_wait():
    # WRONG: time.sleep() is a BLOCKING call with no await.
    # Inside an async def, this freezes the entire event loop —
    # every other request (even to unrelated routes) has to wait too.
    time.sleep(3)
    return {"message": "done (blocked the whole server for 3s)"}


@app.get("/good-async-wait")
async def good_async_wait():
    # RIGHT: asyncio.sleep() is awaitable — it yields control back
    # to the event loop, so other requests get handled concurrently.
    await asyncio.sleep(3)
    return {"message": "done (server stayed free for other requests)"}


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


@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id: int):
    for i, ticket in enumerate(tickets):
        if ticket["id"] == ticket_id:
            tickets.pop(i)
            return {"message": f"Ticket {ticket_id} deleted"}
    raise HTTPException(status_code=404, detail="Ticket not found")
