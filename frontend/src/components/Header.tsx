import { IconSparkle } from "./icons";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  badge?: string;
};

export function Header({
  title = "Operations Overview",
  subtitle = "Tickets, documents, and your AI assistant in one place.",
  badge = "Learning build",
}: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-5 md:px-10 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 flex items-center gap-2 md:hidden">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
            <IconSparkle />
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Cortex</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          </div>
          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
            {badge}
          </span>
        </div>
      </div>
    </header>
  );
}
