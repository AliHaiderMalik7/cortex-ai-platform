"use client";

import { useEffect, useState } from "react";

import { API_URL } from "@/lib/api";
import type { Ticket } from "@/types";

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [createTicketError, setCreateTicketError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/tickets`)
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
        return res.json();
      })
      .then((data: Ticket[]) => setTickets(data))
      .catch((err) => setTicketsError(err.message))
      .finally(() => setLoadingTickets(false));
  }, []);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newTicketTitle.trim();
    if (!trimmed) return;

    setCreatingTicket(true);
    setCreateTicketError(null);

    try {
      // Only the title is sent - the backend calls Claude to decide
      // priority and topic automatically (see app/classify.py).
      const res = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Request failed with ${res.status}`);
      }

      const newTicket: Ticket = await res.json();
      setTickets((prev) => [newTicket, ...prev]);
      setNewTicketTitle("");
    } catch (err) {
      setCreateTicketError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreatingTicket(false);
    }
  }

  return {
    tickets,
    loadingTickets,
    ticketsError,
    newTicketTitle,
    setNewTicketTitle,
    creatingTicket,
    createTicketError,
    createTicket,
  };
}
