import { IconSparkle } from "./icons";

type HeaderProps = {
  title?: string;
  badge?: string;
};

export function Header({ title = "Operations Overview", badge = "Learning build" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 px-6 py-3.5 backdrop-blur-sm md:px-10 dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
            <IconSparkle />
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Cortex</span>
        </div>
        <h1 className="hidden text-sm font-medium text-zinc-500 md:block dark:text-zinc-400">{title}</h1>
        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
          {badge}
        </span>
      </div>
    </header>
  );
}
