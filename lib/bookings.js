import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { ACTIVE_STATUSES, COLLECTIONS } from "./config";
import { toDate } from "./dates";

// Read the first field that has a value. The booking site may name fields differently,
// so each Hub field lists the names it will try, in order.
function pick(data, names, fallback = "") {
  for (const n of names) {
    if (data[n] !== undefined && data[n] !== null && data[n] !== "") return data[n];
  }
  return fallback;
}

export function normalizeBooking(id, data) {
  return {
    id,
    guestName: pick(data, ["guestName", "name", "fullName", "customerName"], "Guest"),
    email: pick(data, ["email", "guestEmail"]),
    phone: pick(data, ["phone", "contactNumber", "guestPhone", "mobile"]),
    roomId: pick(data, ["roomId", "room_id"]),
    roomName: pick(data, ["roomName", "roomType", "room", "accommodation"]),
    guests: pick(data, ["guests", "guestCount", "pax", "numberOfGuests"], null),
    checkIn: toDate(pick(data, ["checkIn", "checkInDate", "startDate", "arrivalDate"], null)),
    checkOut: toDate(pick(data, ["checkOut", "checkOutDate", "endDate", "departureDate"], null)),
    status: pick(data, ["status"], "pending"),
    total: pick(data, ["totalAmount", "total", "totalPrice", "amount"], 0),
    raw: data,
  };
}

// Live list of bookings that are approved or in house. Sorted in the browser,
// so Firestore does not ask for a composite index.
export function listenToActiveBookings(onData, onError) {
  const q = query(
    collection(db, COLLECTIONS.bookings),
    where("status", "in", ACTIVE_STATUSES)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => normalizeBooking(d.id, d.data()));
      list.sort((a, b) => (a.checkIn?.getTime() ?? 0) - (b.checkIn?.getTime() ?? 0));
      onData(list);
    },
    onError
  );
}

export function listenToRooms(onData, onError) {
  return onSnapshot(
    collection(db, COLLECTIONS.rooms),
    (snap) => {
      const map = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        map[d.id] = { id: d.id, name: pick(data, ["name", "roomName", "title"], d.id), ...data };
      });
      onData(map);
    },
    onError
  );
}
