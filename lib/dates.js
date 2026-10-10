import { format, parseISO, isValid, differenceInCalendarDays } from "date-fns";

// The booking site stores check-in and check-out as "YYYY-MM-DD" strings; other places may
// use Firestore Timestamps. This turns any of them into a JS Date, or null.
export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value.toDate === "function") return value.toDate(); // Firestore Timestamp
  if (typeof value === "object" && typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }
  if (typeof value === "string") {
    const iso = parseISO(value.trim());
    if (isValid(iso)) return iso;
    const fallback = new Date(value);
    return isValid(fallback) ? fallback : null;
  }
  if (typeof value === "number") return new Date(value);
  return null;
}

export function fmtDate(value) {
  const d = toDate(value);
  return d ? format(d, "MMM d, yyyy") : "-";
}

export function fmtShort(value) {
  const d = toDate(value);
  return d ? format(d, "EEE, MMM d") : "-";
}

export function startOfDayLocal(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function sameDay(a, b) {
  if (!a || !b) return false;
  return startOfDayLocal(a).getTime() === startOfDayLocal(b).getTime();
}

export function nightsBetween(a, b) {
  if (!a || !b) return 0;
  const n = differenceInCalendarDays(b, a);
  return n > 0 ? n : 1;
}

// Booking site prices are in whole pesos (not centavos).
export function fmtMoney(n) {
  const v = Number(n) || 0;
  return "₱" + v.toLocaleString("en-PH", { maximumFractionDigits: 2 });
}
