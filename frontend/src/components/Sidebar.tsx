import { IconSparkle } from "./icons";

const NAV_ITEMS = [
  { href: "#overview", label: "Overview" },
  { href: "#tickets", label: "Tickets" },
  { href: "#documents", label: "Documents" },
  { href: "#assistant", label: "Assistant" },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-6 md:flex dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2.5 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
          <IconSparkle />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-50">Cortex</p>
          <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">AI Operations Platform</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:text-zinc-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto rounded-md border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white px-3 py-2.5 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Environment
        </p>
        <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300">Local development</p>
      </div>
    </aside>
  );
}
