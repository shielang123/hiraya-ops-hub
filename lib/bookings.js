import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "./config";
import { nightsBetween, toDate } from "./dates";

function pick(data, names, fallback = "") {
  for (const n of names) {
    if (data[n] !== undefined && data[n] !== null && data[n] !== "") return data[n];
  }
  return fallback;
}

const clean = (s) => String(s ?? "").trim();

// Turns a `guestbooking` document into the shape the Hub screens use.
export function normalizeBooking(id, data) {
  const checkIn = toDate(pick(data, ["checkIn", "checkInDate"], null));
  const checkOut = toDate(pick(data, ["checkOut", "checkOutDate"], null));
  const nights = Number(data.nights) || nightsBetween(checkIn, checkOut);
  const pricePerNight = Number(data.pricePerNight) || 0;
  const total = Number(data.totalPrice) || (pricePerNight && nights ? pricePerNight * nights : 0);
  const paid = Number(data.paidAmount) || 0;
  const paymentStatus = clean(data.paymentStatus).toLowerCase() || (paid > 0 ? "paid" : "unpaid");

  return {
    id,
    guestName: clean(pick(data, ["name", "guestName", "fullName"], "Guest")),
    email: clean(data.email),
    phone: clean(data.phone),
    roomType: clean(pick(data, ["roomType", "roomName"])),
    guests: Number(data.guests) || null,
    checkIn,
    checkOut,
    nights,
    status: clean(data.status).toLowerCase() || "pending", // approved, pending, ...
    stayStatus: clean(data.stayStatus).toLowerCase(), // set by the Hub: checked-in / checked-out
    paymentStatus,
    total,
    paid,
    balance: Math.max(total - paid, 0),
    hasProofOfPayment: Boolean(data.proofOfPaymentUrl),
    ownerUid: clean(data.ownerUid),
    createdAt: toDate(data.createdAt),
    raw: data,
  };
}

// Live list of all guest bookings. Sorted and filtered in the browser, so Firestore does not
// need an index and "Approved " (trailing space) still matches.
export function listenToBookings(ownerUid, onData, onError) {
  const base = collection(db, COLLECTIONS.bookings);
  const q = ownerUid ? query(base, where("ownerUid", "==", ownerUid)) : base;
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

export function listenToRooms(ownerUid, onData, onError) {
  const base = collection(db, COLLECTIONS.rooms);
  const q = ownerUid ? query(base, where("ownerUid", "==", ownerUid)) : base;
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: clean(pick(data, ["name", "roomName", "title"], d.id)),
          type: clean(data.type),
          price: Number(data.price) || 0,
          ...data,
        };
      });
      onData(list);
    },
    onError
  );
}
