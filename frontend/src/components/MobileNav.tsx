"use client";

import { useEffect } from "react";

import { SidebarContent } from "./SidebarContent";
import type { AuthUser } from "@/types";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onLogout: () => void;
};

export function MobileNav({ isOpen, onClose, ...sidebarProps }: MobileNavProps) {
  // Lock page scroll while the drawer is open, and restore it on close/unmount
  // so a drawer left open never permanently disables scrolling.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <aside
        className={`absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-zinc-700 bg-zinc-800 px-5 py-7 shadow-2xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent {...sidebarProps} onNavClick={onClose} />
      </aside>
    </div>
  );
}
