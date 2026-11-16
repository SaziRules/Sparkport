import type { Store } from '@/lib/stores';

export default function HoursTable({ store }: { store: Store }) {
  const today = new Date().getDay();
  const h = store.structuredHours;
  const fridayLabel = h.friday ? 'Friday' : undefined;
  const weekdaysLabel = h.friday ? 'Mon – Thu' : 'Mon – Fri';

  const rows = [
    { label: weekdaysLabel, hours: h.weekdays, active: today >= 1 && today <= (h.friday ? 4 : 5) },
    ...(fridayLabel ? [{ label: fridayLabel, hours: h.friday!, active: today === 5 }] : []),
    { label: 'Saturday', hours: h.saturday, active: today === 6 },
    { label: 'Sunday', hours: h.sunday, active: today === 0 },
    ...(h.publicHolidays ? [{ label: 'Public Holidays', hours: h.publicHolidays, active: false }] : []),
  ];

  return (
    <div className="mt-4 rounded-md overflow-hidden border border-neutral-200">
      {rows.map(({ label, hours, active }) => (
        <div
          key={label}
          className={`flex items-center justify-between px-3.5 py-2 text-xs border-b border-neutral-100 last:border-0 ${
            active ? 'bg-[#009eb9]/8 text-[#184363]' : 'text-neutral-500'
          }`}
        >
          <span className={`font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
          <span className={active ? 'font-bold text-[#009eb9]' : ''}>{hours}</span>
        </div>
      ))}
      {h.fridayNote && (
        <p className="px-3.5 py-2 text-[10px] text-neutral-400 italic border-t border-neutral-100">
          * {h.fridayNote}
        </p>
      )}
    </div>
  );
}
