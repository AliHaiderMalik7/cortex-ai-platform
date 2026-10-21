from app.config import claude
from app.models import TicketClassification


def classify_ticket(title: str) -> TicketClassification:
    """Ask Claude to classify a ticket's priority and topic.

    This is a structured output call, not a normal chat call: Claude isn't
    free to reply with a sentence like "this seems fairly urgent" - the
    output_format=TicketClassification argument constrains the API response
    itself to valid JSON matching that schema. Compare this to app/routers/ask.py,
    where Claude's reply IS free-form prose - that's the difference between
    "answer a question for a human to read" and "return data my code can use."
    """
    result = claude.messages.parse(
        model="claude-opus-5",
        max_tokens=200,
        system="You triage support tickets for Cortex, a ticketing platform.",
        messages=[{"role": "user", "content": f"Classify this support ticket title: {title}"}],
        output_format=TicketClassification,
    )
    # parsed_output is already a real TicketClassification object (validated,
    # typed) - not a raw string we'd need to json.loads() and check ourselves.
    return result.parsed_output
