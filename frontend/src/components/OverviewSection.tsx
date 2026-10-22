import { IconTicket } from "./icons";
import type { Ticket } from "@/types";

const CARD =
  "animate-fade-in-up relative overflow-hidden rounded-md border border-zinc-700 bg-zinc-800 p-4 shadow-lg shadow-black/20 transition-colors hover:border-zinc-600";

function AccentBar({ color }: { color: string }) {
  return <span className={`absolute inset-x-0 top-0 h-0.5 ${color}`} />;
}

type OverviewSectionProps = {
  tickets: Ticket[];
  isLoggedIn: boolean;
};

export function OverviewSection({ tickets, isLoggedIn }: OverviewSectionProps) {
  const highCount = tickets.filter((t) => t.priority === "high").length;
  const openCount = tickets.filter((t) => t.status === "open").length;

  // GET /tickets returns [] for an anonymous caller (see app/routers/tickets.py),
  // so these would always read 0/0/0 while logged out - not because the system
  // is empty, but because there's nothing scoped to "your" account to count.
  // Showing "-" instead of a flat 0 makes that honest instead of misleading.
  const display = (value: number) => (isLoggedIn ? value : "–");

  return (
    <section>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={CARD} style={{ animationDelay: "0ms" }}>
          <AccentBar color="bg-violet-500" />
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Total tickets</p>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
              <IconTicket />
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">{display(tickets.length)}</p>
        </div>
        <div className={CARD} style={{ animationDelay: "40ms" }}>
          <AccentBar color="bg-rose-500" />
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">High priority</p>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-rose-400">{display(highCount)}</p>
        </div>
        <div className={CARD} style={{ animationDelay: "80ms" }}>
          <AccentBar color="bg-emerald-500" />
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Open</p>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-emerald-400">{display(openCount)}</p>
        </div>
      </div>

      {!isLoggedIn && (
        <p className="mt-3 text-xs text-zinc-400">Sign in to see your ticket stats - these are scoped to your account.</p>
      )}
    </section>
  );
}
