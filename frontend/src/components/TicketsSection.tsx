import { IconPlus, IconTicket } from "./icons";
import { Skeleton } from "./Skeleton";
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
  isLoggedIn: boolean;
};

const GRID_COLS = "grid-cols-[14px_1fr_130px_100px_90px]";

export function TicketsSection({
  tickets,
  loadingTickets,
  ticketsError,
  newTicketTitle,
  setNewTicketTitle,
  creatingTicket,
  createTicketError,
  onCreateTicket,
  isLoggedIn,
}: TicketsSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
          <IconTicket />
        </span>
        <h2 className="text-sm font-semibold text-zinc-100">Tickets</h2>
        {tickets.length > 0 && (
          <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-xs font-semibold text-zinc-400">
            {tickets.length}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-700 bg-zinc-800 shadow-lg shadow-black/20">
        <form
          onSubmit={onCreateTicket}
          className="flex flex-col gap-2.5 border-b border-zinc-700 p-4 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={newTicketTitle}
            onChange={(e) => setNewTicketTitle(e.target.value)}
            placeholder="Describe a new ticket… (priority set by AI)"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-50 outline-none transition-shadow placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
          <button
            type="submit"
            disabled={creatingTicket || !newTicketTitle.trim()}
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-md active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100"
          >
            <IconPlus />
            {creatingTicket ? "Classifying…" : "Add ticket"}
          </button>
        </form>

        {createTicketError && (
          <p className="animate-fade-in-up px-5 py-3 text-sm text-rose-400">{createTicketError}</p>
        )}

        {ticketsError && (
          <p className="px-5 py-6 text-sm text-rose-400">
            Couldn&apos;t load tickets: {ticketsError}. Is the backend running at {API_URL}?
          </p>
        )}

        {!loadingTickets && !ticketsError && tickets.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400">
              <IconTicket />
            </span>
            <p className="max-w-xs text-sm text-zinc-400">
              {isLoggedIn
                ? "No tickets yet - create one above to get started."
                : "Sign in to see tickets you've created - anonymous tickets aren't tied to any account, so there's nothing to list here yet."}
            </p>
          </div>
        )}

        {(loadingTickets || (!ticketsError && tickets.length > 0)) && (
          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <div
                className={`grid ${GRID_COLS} items-center gap-4 border-b border-zinc-700 bg-zinc-900/40 px-5 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500`}
              >
                <span />
                <span>Title</span>
                <span>Topic</span>
                <span>Status</span>
                <span>Priority</span>
              </div>

              {loadingTickets && (
                <div className="flex flex-col divide-y divide-zinc-700">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`grid ${GRID_COLS} items-center gap-4 px-5 py-4`}>
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-14" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  ))}
                </div>
              )}

              {!loadingTickets && !ticketsError && (
                <ul className="divide-y divide-zinc-700">
                  {tickets.map((ticket, i) => (
                    <li
                      key={ticket.id}
                      style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
                      className={`animate-fade-in-up grid ${GRID_COLS} items-center gap-4 px-5 py-3.5 transition-colors hover:bg-zinc-700/30`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${priorityDot[ticket.priority] ?? priorityDot.low}`}
                      />
                      <span className="min-w-0 truncate text-sm font-medium text-zinc-200">{ticket.title}</span>
                      <span className="w-fit rounded-md bg-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-400">
                        {ticket.topic}
                      </span>
                      <span className="inline-flex w-fit items-center gap-1.5 text-xs text-zinc-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {ticket.status}
                      </span>
                      <span
                        className={`w-fit rounded-md px-2.5 py-1 text-xs font-semibold ${priorityBadge[ticket.priority] ?? priorityBadge.low}`}
                      >
                        {ticket.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
