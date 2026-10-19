"use client";

import { useState } from "react";

import type { AuthUser } from "@/types";

const roleBadge: Record<string, string> = {
  admin: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  agent: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  user: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
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
    return (
      <div className="rounded-xl border border-zinc-100 bg-gradient-to-br from-zinc-50 to-white px-3.5 py-3 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{user.email}</p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadge[user.role] ?? roleBadge.user}`}>
            {user.role}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-100 bg-gradient-to-br from-zinc-50 to-white p-3.5 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mb-2.5 flex gap-1 rounded-lg bg-zinc-100 p-0.5 text-xs font-semibold dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md py-1 transition-colors ${
            mode === "login"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-md py-1 transition-colors ${
            mode === "signup"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={authLoading || !email.trim() || !password}
          className="w-full rounded-md bg-indigo-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {authLoading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      {authError && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{authError}</p>}
    </div>
  );
}
