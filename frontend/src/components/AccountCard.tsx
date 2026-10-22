"use client";

import { useState } from "react";

import { IconChevronDown, IconLogout } from "./icons";
import type { AuthUser } from "@/types";

const roleBadge: Record<string, string> = {
  admin: "bg-violet-500/15 text-violet-400",
  agent: "bg-emerald-500/15 text-emerald-400",
  user: "bg-zinc-600 text-zinc-300",
};

type AccountCardProps = {
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onLogout: () => void;
};

export function AccountCard({ user, authLoading, authError, onLogin, onSignup, onLogout }: AccountCardProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    if (mode === "login") {
      onLogin(email.trim(), password);
    } else {
      onSignup(email.trim(), password);
    }
  }

  if (user) {
    const initial = user.email.charAt(0).toUpperCase();
    return (
      <div className="flex items-center gap-2.5 rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-400">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-zinc-200">{user.email}</p>
          <span
            className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${roleBadge[user.role] ?? roleBadge.user}`}
          >
            {user.role}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Log out"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-600 hover:text-zinc-200"
        >
          <IconLogout />
        </button>
      </div>
    );
  }

  // Collapsed by default - the full form is the "big login panel" the
  // redesign set out to declutter; it only appears once asked for.
  if (!formOpen) {
    return (
      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="flex w-full items-center justify-between rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
      >
        Sign in
        <IconChevronDown />
      </button>
    );
  }

  return (
    <div className="animate-fade-in-up rounded-md border border-zinc-600 bg-zinc-700 p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex gap-1 rounded-md bg-zinc-900 p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded px-2.5 py-1 transition-colors ${
              mode === "login" ? "bg-zinc-600 text-zinc-50" : "text-zinc-500"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded px-2.5 py-1 transition-colors ${
              mode === "signup" ? "bg-zinc-600 text-zinc-50" : "text-zinc-500"
            }`}
          >
            Sign up
          </button>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(false)}
          aria-label="Collapse"
          className="rotate-180 text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <IconChevronDown />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-50 outline-none transition-shadow placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-50 outline-none transition-shadow placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
        <button
          type="submit"
          disabled={authLoading || !email.trim() || !password}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-violet-600 py-1.5 text-xs font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-sm active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100"
        >
          {authLoading && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {authLoading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      {authError && <p className="animate-fade-in-up mt-2 text-xs text-rose-400">{authError}</p>}
    </div>
  );
}
