import { SidebarContent } from "./SidebarContent";
import type { AuthUser } from "@/types";

type SidebarProps = {
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onLogout: () => void;
};

// Desktop-only (>=md) - below that, MobileNav (a drawer) takes over, sharing
// the exact same content via SidebarContent so nothing drifts between them.
export function Sidebar(props: SidebarProps) {
  return (
    <aside className="scrollbar-thin sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-zinc-700 bg-zinc-800 px-5 py-7 md:flex">
      <SidebarContent {...props} />
    </aside>
  );
}
