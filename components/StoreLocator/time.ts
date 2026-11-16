import type { Store, StructuredHours } from '@/lib/stores';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toMins(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function hoursForDay(hours: StructuredHours, day: number): string {
  if (day === 0) return hours.sunday;
  if (day === 6) return hours.saturday;
  if (day === 5 && hours.friday) return hours.friday;
  return hours.weekdays;
}

export function isOpenNow(store: Store, now: Date = new Date()): boolean {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const raw = hoursForDay(store.structuredHours, day);
  if (!raw || raw.toLowerCase() === 'closed') return false;
  const match = raw.match(/(\d{1,2}:\d{2})\s*[–\-]\s*(\d{1,2}:\d{2})/);
  if (!match) return false;
  return mins >= toMins(match[1]) && mins < toMins(match[2]);
}

export function todayLabel(now: Date = new Date()): string {
  return DAY_NAMES[now.getDay()];
}

export function todayHours(store: Store, now: Date = new Date()): string {
  return hoursForDay(store.structuredHours, now.getDay());
}

export function directionsUrl(store: Store): string {
  const q = `${store.coordinates.lat},${store.coordinates.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}
