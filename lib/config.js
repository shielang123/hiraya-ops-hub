// Collection names, matched to the Resort Booking system (Resort-Booking repo).
export const COLLECTIONS = {
  bookings: "guestbooking", // the booking site saves guest bookings here
  rooms: "rooms",
  staff: "staff",
};

// Optional: limit the Hub to one resort owner's bookings (the booking site is multi-tenant
// and stores `ownerUid` on each booking and room). Leave empty to show everything.
// A staff document can also carry its own `ownerUid`, which takes priority.
export const DEFAULT_OWNER_UID = process.env.NEXT_PUBLIC_RESORT_OWNER_UID || "";

// The booking site writes these exact words (see its update-status API), sometimes with
// stray spaces, so the Hub always trims and lowercases before comparing.
export const BOOKING_STATUS = {
  pending: "pending",
  approved: "approved",
  completed: "completed",
  declined: "declined",
  cancelled: "cancelled",
};

export const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
};

export const PAYMENT_LABELS = {
  paid: "Paid",
  unpaid: "Unpaid",
  partial: "Partially paid",
};
