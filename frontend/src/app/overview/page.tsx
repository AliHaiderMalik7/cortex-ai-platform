"use client";

import { OverviewSection } from "@/components/OverviewSection";
import { useAppState } from "@/context/AppStateContext";

export default function OverviewPage() {
  const { ticketsState, isLoggedIn } = useAppState();
  return <OverviewSection tickets={ticketsState.tickets} isLoggedIn={isLoggedIn} />;
}
