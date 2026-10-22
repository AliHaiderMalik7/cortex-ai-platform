"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./SidebarContent";
import { Sidebar } from "./Sidebar";
import { useAppState } from "@/context/AppStateContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { authState } = useAppState();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activePage = NAV_ITEMS.find((item) => item.href === pathname) ?? NAV_ITEMS[0];

  // Only the backend's actual enforced permission (POST /documents/upload
  // requires agent/admin - see app/dependencies.py) is reflected here. We
  // don't fake-restrict anything the backend doesn't really check.
  const authProps = {
    user: authState.user,
    authLoading: authState.authLoading,
    authError: authState.authError,
    onLogin: authState.login,
    onSignup: authState.signup,
    onLogout: authState.logout,
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 font-sans">
      <Sidebar {...authProps} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} {...authProps} />

      <div className="min-w-0 flex-1">
        <Header title={activePage.title} subtitle={activePage.subtitle} onMenuClick={() => setMobileNavOpen(true)} />

        <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10 md:px-10 md:py-12">{children}</main>
      </div>
    </div>
  );
}
