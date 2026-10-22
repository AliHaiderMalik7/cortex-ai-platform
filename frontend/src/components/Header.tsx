import { IconMenu, IconSparkle } from "./icons";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  onMenuClick: () => void;
};

export function Header({
  title = "Operations Overview",
  subtitle = "Tickets, documents, and your AI assistant in one place.",
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-700 bg-zinc-900/95 px-6 py-3.5 backdrop-blur-sm md:px-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-600 text-white md:hidden">
            <IconSparkle />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-zinc-100">{title}</h1>
            <span className="hidden truncate text-xs text-zinc-500 md:inline">{subtitle}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:bg-zinc-800 md:hidden"
        >
          <IconMenu />
        </button>
      </div>
    </header>
  );
}
