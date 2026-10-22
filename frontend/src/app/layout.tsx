import type { Metadata } from "next";
import "./globals.css";

import { AppShell } from "@/components/AppShell";
import { AppStateProvider } from "@/context/AppStateContext";

export const metadata: Metadata = {
  title: "Cortex",
  description: "AI Operations Platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppStateProvider>
          <AppShell>{children}</AppShell>
        </AppStateProvider>
      </body>
    </html>
  );
}
