import { fmtDate } from "@/lib/dates";
import { STATUS_LABELS } from "@/lib/config";

const STATUS_STYLES = {
  "checked-in": "bg-emerald-100 text-emerald-800",
  approved: "bg-sky-100 text-sky-800",
  confirmed: "bg-sky-100 text-sky-800",
  paid: "bg-sky-100 text-sky-800",
};

export default function BookingCard({ booking }) {
  const b = booking;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-800">{b.guestName}</p>
          <p className="text-sm text-slate-500">{b.roomLabel}</p>
        </div>
        <span
          className={
            "rounded-full px-2.5 py-0.5 text-xs font-medium " +
            (STATUS_STYLES[b.status] || "bg-slate-100 text-slate-700")
          }
        >
          {STATUS_LABELS[b.status] || b.status}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <dt className="text-slate-500">Check-in</dt>
        <dd className="text-slate-800">{fmtDate(b.checkIn)}</dd>
        <dt className="text-slate-500">Check-out</dt>
        <dd className="text-slate-800">{fmtDate(b.checkOut)}</dd>
        {b.guests ? (
          <>
            <dt className="text-slate-500">Guests</dt>
            <dd className="text-slate-800">{b.guests}</dd>
          </>
        ) : null}
        {b.phone ? (
          <>
            <dt className="text-slate-500">Phone</dt>
            <dd className="text-slate-800">{b.phone}</dd>
          </>
        ) : null}
      </dl>
    </div>
  );
}
