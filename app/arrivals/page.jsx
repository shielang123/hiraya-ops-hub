"use client";

import { useMemo, useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import BookingCard from "@/components/BookingCard";
import { useBookings } from "@/hooks/useBookings";

const TABS = [
  { key: "arriving", label: "Arriving today" },
  { key: "departing", label: "Departing today" },
  { key: "staying", label: "Staying" },
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Pending" },
];

export default function ArrivalsPage() {
  const { groups, loading, error } = useBookings();
  const [tab, setTab] = useState("arriving");
  const [search, setSearch] = useState("");

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups[tab].filter(
      (b) =>
        !q ||
        b.guestName.toLowerCase().includes(q) ||
        b.roomType.toLowerCase().includes(q) ||
        b.phone.includes(q)
    );
  }, [groups, tab, search]);

  return (
    <ProtectedPage roles={["admin", "frontdesk"]} title="Arrivals & departures">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "rounded-lg px-3 py-1.5 text-sm font-medium " +
                (tab === t.key
                  ? "bg-brand-600 text-white"
                  : "bg-white text-ink ring-1 ring-line hover:bg-sage-100")
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
          placeholder="Search guest, room or phone"
          className="w-full rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-500 sm:w-64"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}. If this mentions permissions, publish the Firestore rules in the README.
        </p>
      )}

      {loading ? (
        <p className="text-soft">Loading bookings...</p>
      ) : shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-soft">
          Nothing here.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </ProtectedPage>
  );
}
