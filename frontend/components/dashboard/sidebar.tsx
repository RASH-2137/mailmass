"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contacts", href: "/contacts" },
    { name: "Templates", href: "/templates" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
      <h1 className="text-2xl font-bold">
        MailMass
      </h1>

      <p className="text-sm text-zinc-400 mt-1">
        Email Marketing Platform
      </p>

      <nav className="mt-10 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 ${
                isActive 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}