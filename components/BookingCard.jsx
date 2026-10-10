import { fmtShort, fmtMoney } from "@/lib/dates";
import { STATUS_LABELS, PAYMENT_LABELS } from "@/lib/config";

const STATUS_STYLES = {
  approved: "bg-sage-100 text-brand-600",
  pending: "bg-amber-100 text-amber-800",
  completed: "bg-slate-100 text-slate-700",
  declined: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAY_STYLES = {
  paid: "bg-sage-100 text-brand-600",
  unpaid: "bg-terra-100 text-terra-600",
  partial: "bg-amber-100 text-amber-800",
};

function Row({ label, children }) {
  return (
    <>
      <dt className="text-soft">{label}</dt>
      <dd className="text-right font-medium text-ink">{children}</dd>
    </>
  );
}

export default function BookingCard({ booking }) {
  const b = booking;
  const label = b.stayStatus === "checked-in" ? "Checked in" : STATUS_LABELS[b.status] || b.status;
  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-ink">{b.guestName}</p>
          <p className="truncate text-sm text-soft">{b.roomType || "Room not set"}</p>
        </div>
        <span
          className={
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold " +
            (STATUS_STYLES[b.status] || "bg-slate-100 text-slate-700")
          }
        >
          {label}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <Row label="Check-in">{fmtShort(b.checkIn)}</Row>
        <Row label="Check-out">{fmtShort(b.checkOut)}</Row>
        <Row label="Nights">{b.nights || "-"}</Row>
        {b.guests ? <Row label="Guests">{b.guests}</Row> : null}
        {b.phone ? <Row label="Phone">{b.phone}</Row> : null}
        {b.total ? <Row label="Total">{fmtMoney(b.total)}</Row> : null}
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3 text-xs">
        <span
          className={
            "rounded-full px-2.5 py-0.5 font-semibold " +
            (PAY_STYLES[b.paymentStatus] || "bg-slate-100 text-slate-700")
          }
        >
          {PAYMENT_LABELS[b.paymentStatus] || b.paymentStatus}
        </span>
        {b.balance > 0 && b.total > 0 ? (
          <span className="text-soft">Balance {fmtMoney(b.balance)}</span>
        ) : null}
        {b.paymentStatus !== "paid" && b.hasProofOfPayment ? (
          <span className="text-soft">· Proof uploaded</span>
        ) : null}
      </div>
    </div>
  );
}
