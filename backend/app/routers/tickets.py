from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.classify import classify_ticket
from app.database import get_db
from app.db_models import TicketDB, UserDB
from app.dependencies import get_current_user, get_current_user_optional
from app.models import TicketCreate, TicketOut

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("", response_model=list[TicketOut])
def list_tickets(
    db: Session = Depends(get_db),
    current_user: UserDB | None = Depends(get_current_user_optional),
):
    # Realistic support-system scoping:
    # - agent/admin handle tickets across every customer, so they see all of them
    # - a logged-in "user" (customer) should only see their OWN tickets - seeing
    #   other customers' support tickets would be a real privacy leak
    # - an anonymous caller has no identity to scope "their" tickets to, so
    #   there's nothing correct to return except an empty list
    if current_user is None:
        return []
    if current_user.role in ("agent", "admin"):
        return db.query(TicketDB).all()
    return db.query(TicketDB).filter(TicketDB.user_id == current_user.id).all()


@router.get("/{ticket_id}", response_model=TicketOut)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: UserDB | None = Depends(get_current_user_optional),
):
    ticket = db.query(TicketDB).filter(TicketDB.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Same scoping as the list route - a "user" can't view another
    # customer's ticket by guessing its id.
    is_owner = current_user is not None and ticket.user_id == current_user.id
    is_staff = current_user is not None and current_user.role in ("agent", "admin")
    if not (is_owner or is_staff):
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket


@router.post("", response_model=TicketOut)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db),
    current_user: UserDB | None = Depends(get_current_user_optional),
):
    # The client only sends a title (see TicketCreate) - priority and topic
    # are filled in here by asking Claude, not typed by the user.
    try:
        classification = classify_ticket(ticket.title)
        priority, topic = classification.priority, classification.topic
    except Exception:
        # If the Claude call fails (bad API key, network issue, rate limit -
        # classify_ticket doesn't catch these itself), fall back to safe
        # defaults instead of failing the whole ticket creation. A ticket
        # with a guessed priority is better than no ticket at all.
        priority, topic = "medium", "other"

    # current_user is None for an anonymous caller (no/invalid token) - that's
    # allowed by design, so user_id just stays NULL on the row in that case.
    new_ticket = TicketDB(
        title=ticket.title,
        priority=priority,
        topic=topic,
        status="open",
        user_id=current_user.id if current_user else None,
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)  # loads the auto-generated id back onto the object
    return new_ticket


@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user),
):
    ticket = db.query(TicketDB).filter(TicketDB.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Anonymous can't reach here at all (get_current_user requires login).
    # A "user" may only delete a ticket they own; agent/admin can delete any.
    is_owner = ticket.user_id == current_user.id
    if current_user.role not in ("agent", "admin") and not is_owner:
        raise HTTPException(status_code=403, detail="You can only delete your own tickets")

    db.delete(ticket)
    db.commit()
    return {"message": f"Ticket {ticket_id} deleted"}
