// Collection names used by the Resort Booking system and the Hub.
// If the booking repo uses different names, change them here only.
export const COLLECTIONS = {
  bookings: "bookings",
  rooms: "rooms",
  staff: "staff",
};

// Booking statuses the Hub treats as "will stay or is staying".
// Add any extra status word your booking system uses for approved bookings.
export const ACTIVE_STATUSES = ["approved", "confirmed", "paid", "checked-in"];

export const STATUS_LABELS = {
  approved: "Approved",
  confirmed: "Confirmed",
  paid: "Paid",
  "checked-in": "Checked in",
  "checked-out": "Checked out",
  pending: "Pending",
  declined: "Declined",
  cancelled: "Cancelled",
};
