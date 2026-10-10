"use client";

import Link from "next/link";
import { useMemo } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import { useBookings } from "@/hooks/useBookings";
import { sameDay, startOfDayLocal } from "@/lib/dates";

function Card({ label, value, href }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-500"
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-slate-800">{value}</p>
    </Link>
  );
}

export default function DashboardPage() {
  const { bookings, rooms, loading, error } = useBookings();

  const stats = useMemo(() => {
    const today = startOfDayLocal(new Date());
    const inHouse = bookings.filter((b) => b.status === "checked-in").length;
    return {
      arriving: bookings.filter((b) => b.status !== "checked-in" && sameDay(b.checkIn, today)).length,
      departing: bookings.filter((b) => sameDay(b.checkOut, today)).length,
      inHouse,
      totalRooms: Object.keys(rooms).length,
    };
  }, [bookings, rooms]);

  const occupancy =
    stats.totalRooms > 0 ? Math.round((stats.inHouse / stats.totalRooms) * 100) + "%" : "-";

  return (
    <ProtectedPage roles={["admin", "frontdesk"]} title="Today at Hiraya Farm Resort">
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card label="Arriving today" value={stats.arriving} href="/arrivals" />
          <Card label="Departing today" value={stats.departing} href="/arrivals" />
          <Card label="Guests in house" value={stats.inHouse} href="/arrivals" />
          <Card label="Occupancy" value={occupancy} href="/arrivals" />
        </div>
      )}
      <p className="mt-6 text-sm text-slate-500">
        Check-in and check-out buttons arrive in Phase 2. For now, this page reads live data from
        the booking system.
      </p>
    </ProtectedPage>
  );
}
