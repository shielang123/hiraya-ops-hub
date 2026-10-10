"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { NAV_ITEMS, ROLE_LABELS, canAccess } from "@/lib/roles";

// Same look as the booking site's admin portal: green sidebar, terracotta active item.
export default function Shell({ children }) {
  const { profile, role, logout } = useAuth();
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => canAccess(role, i.roles));

  return (
    <div className="min-h-screen bg-cream md:flex">
      <aside className="flex flex-col bg-brand-600 text-cream md:min-h-screen md:w-64 md:shrink-0">
        <div className="border-b border-white/15 px-6 py-5">
          <h1 className="font-display text-xl font-bold">Hiraya Ops Hub</h1>
          <p className="text-xs text-cream/60">Hiraya Farm Resort · Staff</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-visible md:p-4">
          {items.map((i) => {
            const active = pathname === i.href;
            return (
              <Link
                key={i.href}
                href={i.href}
                className={
                  "whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors " +
                  (active ? "bg-terra-500 text-white" : "text-cream hover:bg-white/10")
                }
              >
                {i.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-between gap-3 border-t border-white/15 p-4 md:block">
          <div className="text-sm md:mb-3">
            <p className="font-medium">{profile?.name || "Staff"}</p>
            <p className="text-xs text-cream/60">{ROLE_LABELS[role] || role}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-sage-200 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-sage-100 md:w-full"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
