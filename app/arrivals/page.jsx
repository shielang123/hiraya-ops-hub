"use client";

import { useMemo, useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import BookingCard from "@/components/BookingCard";
import { useBookings } from "@/hooks/useBookings";
import { sameDay, startOfDayLocal } from "@/lib/dates";

const TABS = [
  { key: "arriving", label: "Arriving today" },
  { key: "departing", label: "Departing today" },
  { key: "inhouse", label: "In house" },
  { key: "upcoming", label: "Upcoming" },
];

export default function ArrivalsPage() {
  const { bookings, loading, error } = useBookings();
  const [tab, setTab] = useState("arriving");
  const [search, setSearch] = useState("");

  const groups = useMemo(() => {
    const today = startOfDayLocal(new Date());
    return {
      arriving: bookings.filter((b) => b.status !== "checked-in" && sameDay(b.checkIn, today)),
      departing: bookings.filter((b) => sameDay(b.checkOut, today)),
      inhouse: bookings.filter((b) => b.status === "checked-in"),
      upcoming: bookings.filter((b) => b.status !== "checked-in" && b.checkIn && b.checkIn > today && !sameDay(b.checkIn, today)),
    };
  }, [bookings]);

  const shown = groups[tab].filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      b.guestName.toLowerCase().includes(q) ||
      String(b.roomLabel).toLowerCase().includes(q)
    );
  });

  return (
    <ProtectedPage roles={["admin", "frontdesk"]} title="Arrivals & departures">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "rounded-md px-3 py-1.5 text-sm " +
                (tab === t.key
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100")
              }
            >
              {t.label}
              <span className="ml-2 text-xs opacity-80">{groups[t.key].length}</span>
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guest or room"
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-brand-500 sm:w-64"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}. If this mentions permissions, update the Firestore rules (see README).
        </p>
      )}

      {loading ? (
        <p className="text-slate-500">Loading bookings...</p>
      ) : shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Nothing here.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </ProtectedPage>
  );
}
