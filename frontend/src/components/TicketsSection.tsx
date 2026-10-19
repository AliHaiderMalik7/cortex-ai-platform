import { IconPlus, IconTicket } from "./icons";
import { priorityBadge, priorityDot } from "@/lib/styles";
import { API_URL } from "@/lib/api";
import type { Ticket } from "@/types";

type TicketsSectionProps = {
  tickets: Ticket[];
  loadingTickets: boolean;
  ticketsError: string | null;
  newTicketTitle: string;
  setNewTicketTitle: (value: string) => void;
  creatingTicket: boolean;
  createTicketError: string | null;
  onCreateTicket: (e: React.FormEvent) => void;
};

export function TicketsSection({
  tickets,
  loadingTickets,
  ticketsError,
  newTicketTitle,
  setNewTicketTitle,
  creatingTicket,
  createTicketError,
  onCreateTicket,
}: TicketsSectionProps) {
  return (
    <section id="tickets" className="scroll-mt-20">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <IconTicket />
        </span>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Tickets</h2>
        {tickets.length > 0 && (
          <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {tickets.length}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <form
          onSubmit={onCreateTicket}
          className="flex flex-col gap-2 border-b border-zinc-200 p-3 sm:flex-row sm:items-center dark:border-zinc-800"
        >
          <input
            type="text"
            value={newTicketTitle}
            onChange={(e) => setNewTicketTitle(e.target.value)}
            placeholder="Describe a new ticket… (priority set by AI)"
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={creatingTicket || !newTicketTitle.trim()}
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            <IconPlus />
            {creatingTicket ? "Classifying…" : "Add ticket"}
          </button>
        </form>

        {createTicketError && (
          <p className="px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400">{createTicketError}</p>
        )}

        {loadingTickets && <p className="px-4 py-5 text-sm text-zinc-500">Loading tickets…</p>}

        {ticketsError && (
          <p className="px-4 py-5 text-sm text-rose-600 dark:text-rose-400">
            Couldn&apos;t load tickets: {ticketsError}. Is the backend running at {API_URL}?
          </p>
        )}

        {!loadingTickets && !ticketsError && tickets.length === 0 && (
          <p className="px-4 py-5 text-sm text-zinc-500">No tickets yet.</p>
        )}

        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDot[ticket.priority] ?? priorityDot.low}`}
              />
              <span className="min-w-0 flex-1 truncate text-sm text-zinc-800 dark:text-zinc-200">
                {ticket.title}
              </span>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {ticket.topic}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {ticket.status}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${priorityBadge[ticket.priority] ?? priorityBadge.low}`}
              >
                {ticket.priority}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
