"use client";

import { createContext, useContext } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import { useTickets } from "@/hooks/useTickets";

type AppState = {
  authState: ReturnType<typeof useAuth>;
  ticketsState: ReturnType<typeof useTickets>;
  documentsState: ReturnType<typeof useDocuments>;
  chatState: ReturnType<typeof useChat>;
  isLoggedIn: boolean;
  canUploadDocuments: boolean;
};

const AppStateContext = createContext<AppState | null>(null);

// One instance of every hook, held here instead of inside each route's
// page.tsx - now that Overview/Tickets/Documents/Assistant are real routes,
// this is what keeps auth, tickets, uploaded docs, and chat history alive
// when you switch tabs instead of resetting on every navigation.
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuth();
  const ticketsState = useTickets(authState.token);
  const documentsState = useDocuments(authState.token);
  const chatState = useChat(authState.token);

  const isLoggedIn = authState.user !== null;
  const canUploadDocuments = authState.user?.role === "agent" || authState.user?.role === "admin";

  return (
    <AppStateContext.Provider
      value={{ authState, ticketsState, documentsState, chatState, isLoggedIn, canUploadDocuments }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
