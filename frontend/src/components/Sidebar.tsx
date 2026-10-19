import { AccountCard } from "./AccountCard";
import { IconSparkle } from "./icons";
import type { AuthUser } from "@/types";

const NAV_ITEMS = [
  { href: "#overview", label: "Overview" },
  { href: "#tickets", label: "Tickets" },
  { href: "#documents", label: "Documents" },
  { href: "#assistant", label: "Assistant" },
];

type SidebarProps = {
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onLogout: () => void;
};

export function Sidebar({ user, authLoading, authError, onLogin, onSignup, onLogout }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-100 bg-white px-5 py-7 md:flex dark:border-zinc-800/60 dark:bg-zinc-950">
      <div className="flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
          <IconSparkle />
        </div>
        <div>
          <p className="text-base font-bold leading-none text-zinc-900 dark:text-zinc-50">Cortex</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">AI Operations Platform</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:text-zinc-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <AccountCard
          user={user}
          authLoading={authLoading}
          authError={authError}
          onLogin={onLogin}
          onSignup={onSignup}
          onLogout={onLogout}
        />

        <div className="rounded-xl border border-zinc-100 bg-gradient-to-br from-zinc-50 to-white px-3.5 py-3 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Environment
          </p>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">Local development</p>
        </div>
      </div>
    </aside>
  );
}
