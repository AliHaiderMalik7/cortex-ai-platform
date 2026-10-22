"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AccountCard } from "./AccountCard";
import { IconFile, IconGrid, IconLock, IconSparkle, IconTicket } from "./icons";
import type { AuthUser } from "@/types";

// The single source of truth for the app's tabs - each entry is both a
// sidebar link and a real route (app/<href>/page.tsx). Adding or removing a
// page is: add/remove an entry here, then add/remove the matching page file.
// requiresAuth marks pages whose content is scoped to "your" account (not
// pages with a role-gated action, like Documents' upload button, which
// already explains itself inline) - the sidebar shows a lock on these while
// signed out, so it's clear before you even click.
export const NAV_ITEMS = [
  {
    href: "/",
    label: "Assistant",
    icon: IconSparkle,
    title: "Assistant",
    subtitle: "Ask Cortex anything about your tickets or documents.",
    requiresAuth: false,
  },
  {
    href: "/overview",
    label: "Overview",
    icon: IconGrid,
    title: "Operations Overview",
    subtitle: "Tickets, documents, and your AI assistant in one place.",
    requiresAuth: true,
  },
  {
    href: "/tickets",
    label: "Tickets",
    icon: IconTicket,
    title: "Tickets",
    subtitle: "Create and track support tickets.",
    requiresAuth: true,
  },
  {
    href: "/documents",
    label: "Documents",
    icon: IconFile,
    title: "Documents",
    subtitle: "Manage the knowledge base Cortex retrieves from.",
    requiresAuth: false,
  },
];

type SidebarContentProps = {
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onLogout: () => void;
  onNavClick?: () => void;
};

// The shared body (logo, nav, account widget, environment card) used by both
// the desktop Sidebar (always visible, >=md) and MobileNav (a drawer, <md) -
// one definition so the two surfaces can never drift out of sync.
export function SidebarContent({
  user,
  authLoading,
  authError,
  onLogin,
  onSignup,
  onLogout,
  onNavClick,
}: SidebarContentProps) {
  const pathname = usePathname();
  const isLoggedIn = user !== null;

  return (
    <>
      <div className="flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shadow-md shadow-violet-600/20">
          <IconSparkle />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-zinc-50">Cortex</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500">AI Operations Platform</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === pathname;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-700 text-zinc-50 ring-1 ring-inset ring-zinc-600"
                  : "text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200"
              }`}
            >
              <span className={isActive ? "text-violet-400" : "text-zinc-500"}>
                <item.icon />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.requiresAuth && !isLoggedIn && (
                <span className="text-zinc-600" title="Sign in to see your own data here">
                  <IconLock />
                </span>
              )}
            </Link>
          );
        })}
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

        <div className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900/40 px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          Local development
        </div>
      </div>
    </>
  );
}
