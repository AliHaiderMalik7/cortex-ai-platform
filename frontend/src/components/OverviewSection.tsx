import { IconTicket } from "./icons";
import type { Ticket } from "@/types";

const CARD = "rounded-xl border border-zinc-100 bg-white p-5 shadow-md shadow-zinc-200/40 dark:border-zinc-800/60 dark:bg-zinc-900 dark:shadow-none";

export function OverviewSection({ tickets }: { tickets: Ticket[] }) {
  const highCount = tickets.filter((t) => t.priority === "high").length;
  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <section id="overview" className="scroll-mt-20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={CARD}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total tickets</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <IconTicket />
            </span>
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {tickets.length}
          </p>
        </div>
        <div className={CARD}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">High priority</p>
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {highCount}
          </p>
        </div>
        <div className={CARD}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Open</p>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {openCount}
          </p>
        </div>
      </div>
    </section>
  );
}
