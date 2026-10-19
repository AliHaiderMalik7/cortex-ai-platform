"use client";

import { useEffect, useState } from "react";

import { API_URL } from "@/lib/api";
import type { AuthUser } from "@/types";

const TOKEN_KEY = "cortex_token";
const USER_KEY = "cortex_user";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore a saved session on page load, so refreshing doesn't log you out.
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // localStorage can throw in some browser contexts (private mode, etc.) -
      // just fall back to "logged out" rather than crashing the page.
    }
  }, []);

  function persistSession(newToken: string, newUser: AuthUser) {
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } catch {
      // Same as above - persistence is best-effort, not required to function.
    }
    setToken(newToken);
    setUser(newUser);
  }

  async function submitAuth(path: "login" | "signup", email: string, password: string) {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API_URL}/auth/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Request failed with ${res.status}`);
      }

      const data: { access_token: string; user: AuthUser } = await res.json();
      persistSession(data.access_token, data.user);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  }

  function login(email: string, password: string) {
    return submitAuth("login", email, password);
  }

  function signup(email: string, password: string) {
    return submitAuth("signup", email, password);
  }

  function logout() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // best-effort, same as above
    }
    setToken(null);
    setUser(null);
  }

  return { user, token, authLoading, authError, login, signup, logout };
}
