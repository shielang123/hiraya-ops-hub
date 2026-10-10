"use client";

import { useEffect, useState } from "react";
import { listenToActiveBookings, listenToRooms } from "@/lib/bookings";

// Live bookings plus a room lookup, each with loading and error state.
export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubBookings = listenToActiveBookings(
      (list) => {
        setBookings(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Could not load bookings");
        setLoading(false);
      }
    );
    const unsubRooms = listenToRooms(setRooms, () => {});
    return () => {
      unsubBookings();
      unsubRooms();
    };
  }, []);

  // Fill in the room name from the rooms collection when the booking has only an ID
  const withRooms = bookings.map((b) => ({
    ...b,
    roomLabel: (b.roomId && rooms[b.roomId]?.name) || b.roomName || "-",
  }));

  return { bookings: withRooms, rooms, loading, error };
}
