"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { NAV_ITEMS, ROLE_LABELS, canAccess } from "@/lib/roles";

export default function Shell({ children }) {
  const { profile, role, logout } = useAuth();
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => canAccess(role, i.roles));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-brand-700">Hiraya Ops Hub</span>
            <nav className="flex gap-1">
              {items.map((i) => {
                const active = pathname === i.href;
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={
                      "rounded-md px-3 py-1.5 text-sm " +
                      (active
                        ? "bg-brand-50 font-medium text-brand-700"
                        : "text-slate-600 hover:bg-slate-100")
                    }
                  >
                    {i.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">
              {profile?.name || "Staff"}
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {ROLE_LABELS[role] || role}
              </span>
            </span>
            <button
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
