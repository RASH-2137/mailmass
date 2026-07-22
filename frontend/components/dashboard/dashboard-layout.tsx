"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden text-foreground">
      <aside className="hidden lg:flex w-64 border-r border-border bg-background p-6 shrink-0 h-full">
        <Sidebar className="w-full" />
      </aside>
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="h-full p-4 sm:p-5 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}