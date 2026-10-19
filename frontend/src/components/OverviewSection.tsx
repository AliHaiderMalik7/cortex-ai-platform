import { IconTicket } from "./icons";
import type { Ticket } from "@/types";

export function OverviewSection({ tickets }: { tickets: Ticket[] }) {
  const highCount = tickets.filter((t) => t.priority === "high").length;
  const openCount = tickets.filter((t) => t.status === "open").length;

  // Priority is an ordered severity scale, so it uses the same status colors
  // (rose/amber/emerald) as the priority dots/badges elsewhere - not a fresh
  // categorical palette, which would make two different "reds" mean different
  // things in the same app.
  const priorityCounts = [
    { label: "High", count: tickets.filter((t) => t.priority === "high").length, color: "bg-rose-500" },
    { label: "Medium", count: tickets.filter((t) => t.priority === "medium").length, color: "bg-amber-500" },
    { label: "Low", count: tickets.filter((t) => t.priority === "low").length, color: "bg-emerald-500" },
  ];
  const maxPriorityCount = Math.max(1, ...priorityCounts.map((p) => p.count));

  // Topic is a magnitude comparison ("how many tickets per topic"), not an
  // identity/series job, so it gets a single sequential hue rather than a
  // categorical rainbow - sorted descending, largest first.
  const topicCounts = Object.entries(
    tickets.reduce<Record<string, number>>((acc, t) => {
      acc[t.topic] = (acc[t.topic] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
  const maxTopicCount = Math.max(1, ...topicCounts.map((t) => t.count));

  return (
    <section id="overview" className="scroll-mt-20">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">Total tickets</p>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <IconTicket />
            </span>
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {tickets.length}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">High priority</p>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-rose-600 dark:text-rose-400">
            {highCount}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">Open</p>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
            {openCount}
          </p>
        </div>
      </div>

      {tickets.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Priority distribution - status severity, so status colors */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">By priority</p>
            <div className="mt-3 flex flex-col gap-2.5">
              {priorityCounts.map((p) => (
                <div key={p.label} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-xs text-zinc-600 dark:text-zinc-400">{p.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-r-full ${p.color}`}
                      style={{ width: `${(p.count / maxPriorityCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right text-xs font-medium tabular-nums text-zinc-700 dark:text-zinc-300">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic distribution - pure magnitude comparison, one sequential hue */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">By topic</p>
            <div className="mt-3 flex flex-col gap-2.5">
              {topicCounts.map((t) => (
                <div key={t.topic} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 truncate text-xs text-zinc-600 dark:text-zinc-400">
                    {t.topic}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-r-full bg-indigo-500"
                      style={{ width: `${(t.count / maxTopicCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right text-xs font-medium tabular-nums text-zinc-700 dark:text-zinc-300">
                    {t.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
