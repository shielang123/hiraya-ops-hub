"use client";

import { useEffect, useMemo, useState } from "react";
import { listenToBookings, listenToRooms } from "@/lib/bookings";
import { DEFAULT_OWNER_UID } from "@/lib/config";
import { useAuth } from "@/components/AuthProvider";
import { sameDay, startOfDayLocal } from "@/lib/dates";

// Live bookings and rooms from the booking system, plus the groups the screens need.
export function useBookings() {
  const { profile } = useAuth();
  const ownerUid = profile?.ownerUid || DEFAULT_OWNER_UID || "";
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubB = listenToBookings(
      ownerUid,
      (list) => {
        setBookings(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Could not load bookings");
        setLoading(false);
      }
    );
    const unsubR = listenToRooms(ownerUid, setRooms, () => {});
    return () => {
      unsubB();
      unsubR();
    };
  }, [ownerUid]);

  const groups = useMemo(() => {
    const today = startOfDayLocal(new Date());
    const live = bookings.filter((b) => b.status === "approved" && b.stayStatus !== "checked-out");
    const staying = live.filter(
      (b) => b.stayStatus === "checked-in" || (b.checkIn && b.checkOut && b.checkIn <= today && b.checkOut > today)
    );
    return {
      arriving: live.filter((b) => b.stayStatus !== "checked-in" && sameDay(b.checkIn, today)),
      departing: live.filter((b) => sameDay(b.checkOut, today)),
      staying,
      upcoming: live.filter((b) => b.checkIn && b.checkIn > today),
      pending: bookings.filter((b) => b.status === "pending"),
      unpaid: live.filter((b) => b.paymentStatus !== "paid"),
    };
  }, [bookings]);

  const totalRooms = rooms.length;
  const occupancy =
    totalRooms > 0 ? Math.min(100, Math.round((groups.staying.length / totalRooms) * 100)) : null;

  return { bookings, rooms, groups, totalRooms, occupancy, loading, error };
}
