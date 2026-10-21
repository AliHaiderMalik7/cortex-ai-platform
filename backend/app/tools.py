from sqlalchemy.orm import Session

from app.db_models import TicketDB

# What we describe TO Claude - name, a plain-English description of what it
# does and when to use it, and a JSON schema for its arguments (the same
# schema mechanism behind structured outputs/classify_ticket, reused here
# to describe a FUNCTION's inputs instead of a final answer's shape).
TOOLS = [
    {
        "name": "get_ticket",
        "description": (
            "Look up a single support ticket by its numeric ID. Returns its "
            "title, priority, topic, and status. Use this whenever the user "
            "asks about a specific ticket by number."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "ticket_id": {
                    "type": "integer",
                    "description": "The numeric ID of the ticket to look up, e.g. 5",
                }
            },
            "required": ["ticket_id"],
        },
    }
]


def execute_tool(name: str, tool_input: dict, db: Session) -> str:
    """Claude only ever REQUESTS a tool call (a name + arguments) - this
    function is the part that actually runs real code and returns a real
    result, exactly the distinction covered conceptually before building this.
    """
    if name == "get_ticket":
        ticket_id = tool_input["ticket_id"]
        ticket = db.query(TicketDB).filter(TicketDB.id == ticket_id).first()
        if not ticket:
            return f"No ticket found with id {ticket_id}."
        return (
            f'Ticket #{ticket.id}: "{ticket.title}" - '
            f"priority={ticket.priority}, topic={ticket.topic}, status={ticket.status}"
        )

    return f"Unknown tool: {name}"
