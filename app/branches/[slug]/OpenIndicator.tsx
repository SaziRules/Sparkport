'use client';

import { useEffect, useState } from 'react';

interface Props {
  hours: string;
}

function isOpenNow(hours: string): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;

  const lower = hours.toLowerCase();

  let openStr: string | null = null;
  let closeStr: string | null = null;

  if (day === 0) {
    const sunMatch = lower.match(/sun[^:]*:\s*([^\s•]+)\s*[-–]\s*([^\s•]+)/);
    if (!sunMatch) return false;
    openStr = sunMatch[1];
    closeStr = sunMatch[2];
  } else if (day === 6) {
    const satMatch = lower.match(/sat[^:]*:\s*([^\s•]+)\s*[-–]\s*([^\s•]+)/);
    if (!satMatch) return false;
    openStr = satMatch[1];
    closeStr = satMatch[2];
  } else if (day === 5) {
    const friMatch = lower.match(/fri[^:]*:\s*([^\s•]+)\s*[-–]\s*([^\s•]+)/);
    if (!friMatch) return false;
    openStr = friMatch[1];
    closeStr = friMatch[2];
  } else {
    const monMatch = lower.match(/mon[^:]*:\s*([^\s•]+)\s*[-–]\s*([^\s•]+)/);
    if (!monMatch) return false;
    openStr = monMatch[1];
    closeStr = monMatch[2];
  }

  function parseTime(t: string): number {
    const clean = t.toLowerCase().replace(/\s/g, '');
    const pm = clean.includes('pm');
    const am = clean.includes('am');
    const digits = clean.replace(/[^0-9:]/g, '');
    const [hStr, mStr] = digits.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr ? parseInt(mStr, 10) : 0;
    if (pm && h !== 12) h += 12;
    if (am && h === 12) h = 0;
    return h * 60 + m;
  }

  const open = parseTime(openStr);
  const close = parseTime(closeStr);
  return currentMinutes >= open && currentMinutes < close;
}

export default function OpenIndicator({ hours }: Props) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isOpenNow(hours));
    const id = setInterval(() => setOpen(isOpenNow(hours)), 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (open === null) return null;

  return open ? (
    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      Open Now
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-neutral-400 text-sm font-medium">
      <span className="w-2 h-2 rounded-full bg-neutral-500" />
      Closed
    </span>
  );
}
