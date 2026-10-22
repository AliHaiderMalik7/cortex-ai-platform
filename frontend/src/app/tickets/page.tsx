"use client";

import { TicketsSection } from "@/components/TicketsSection";
import { useAppState } from "@/context/AppStateContext";

export default function TicketsPage() {
  const { ticketsState, isLoggedIn } = useAppState();
  return (
    <TicketsSection
      tickets={ticketsState.tickets}
      loadingTickets={ticketsState.loadingTickets}
      ticketsError={ticketsState.ticketsError}
      newTicketTitle={ticketsState.newTicketTitle}
      setNewTicketTitle={ticketsState.setNewTicketTitle}
      creatingTicket={ticketsState.creatingTicket}
      createTicketError={ticketsState.createTicketError}
      onCreateTicket={ticketsState.createTicket}
      isLoggedIn={isLoggedIn}
    />
  );
}
