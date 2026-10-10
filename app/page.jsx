"use client";

import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";
import BookingCard from "@/components/BookingCard";
import { useBookings } from "@/hooks/useBookings";
import { fmtMoney } from "@/lib/dates";

function Card({ label, value, hint, href, tone }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-terra-500"
    >
      <p className="text-sm text-soft">{label}</p>
      <p className={"mt-1 font-display text-3xl font-bold " + (tone || "text-brand-600")}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-soft">{hint}</p> : null}
    </Link>
  );
}

export default function DashboardPage() {
  const { groups, occupancy, totalRooms, loading, error } = useBookings();
  const outstanding = groups.unpaid.reduce((s, b) => s + b.balance, 0);

  return (
    <ProtectedPage roles={["admin", "frontdesk"]} title="Today at Hiraya Farm Resort">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}. If this mentions permissions, publish the Firestore rules in the README.
        </p>
      )}
      {loading ? (
        <p className="text-soft">Loading...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Arriving today" value={groups.arriving.length} href="/arrivals" />
            <Card label="Departing today" value={groups.departing.length} href="/arrivals" />
            <Card label="Staying tonight" value={groups.staying.length} href="/arrivals" />
            <Card
              label="Occupancy"
              value={occupancy === null ? "-" : occupancy + "%"}
              hint={totalRooms ? `${totalRooms} rooms` : "No rooms found"}
              href="/arrivals"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card
              label="Awaiting approval"
              value={groups.pending.length}
              hint="Approve these in the booking admin"
              href="/arrivals"
              tone="text-terra-600"
            />
            <Card
              label="Approved, not fully paid"
              value={groups.unpaid.length}
              hint={outstanding ? `${fmtMoney(outstanding)} outstanding` : undefined}
              href="/arrivals"
              tone="text-terra-600"
            />
          </div>

          <h2 className="mb-3 mt-8 font-display text-lg font-semibold text-brand-600">Arriving today</h2>
          {groups.arriving.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-white p-6 text-center text-soft">
              No arrivals today.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {groups.arriving.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </>
      )}
      <p className="mt-8 text-sm text-soft">
        Live from the booking system. Check-in and check-out buttons arrive in Phase 2.
      </p>
    </ProtectedPage>
  );
}
