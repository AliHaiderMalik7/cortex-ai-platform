from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.db_models import TicketDB
from app.models import TicketCreate, TicketOut

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("", response_model=list[TicketOut])
def list_tickets(db: Session = Depends(get_db)):
    return db.query(TicketDB).all()


@router.get("/{ticket_id}", response_model=TicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(TicketDB).filter(TicketDB.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.post("", response_model=TicketOut)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    new_ticket = TicketDB(title=ticket.title, priority=ticket.priority, status="open")
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)  # loads the auto-generated id back onto the object
    return new_ticket


@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(TicketDB).filter(TicketDB.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
    return {"message": f"Ticket {ticket_id} deleted"}
