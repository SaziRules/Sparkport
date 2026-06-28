'use client';

import { useState, useEffect } from 'react';
import { calcTimeLeft } from '@/lib/deliveryTime';

export default function DeliveryEstimate() {
  const [timeLeft, setTimeLeft] = useState('');
  const [isSameDay, setIsSameDay] = useState(false);

  useEffect(() => {
    function update() {
      // SAST = UTC+2
      const now = new Date();
      const sast = new Date(now.getTime() + (2 * 60 * 60 * 1000));
      const day = sast.getUTCDay(); // 0=Sun, 6=Sat
      const hours = sast.getUTCHours();
      const minutes = sast.getUTCMinutes();

      const isWeekday = day >= 1 && day <= 5;
      const result = calcTimeLeft(hours, minutes);

      if (isWeekday && result) {
        setIsSameDay(true);
        setTimeLeft(`${result.hoursLeft}h ${result.minutesLeft}m`);
      } else {
        setIsSameDay(false);
        setTimeLeft('');
      }
    }

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-[#e8f5f7] rounded-xl border border-[#009eb9]/20">
      <svg className="w-5 h-5 text-[#009eb9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        {isSameDay ? (
          <>
            <p className="text-sm font-bold! text-[#184363]">
              Order within <span className="text-[#009eb9]">{timeLeft}</span> for same-day dispatch
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">Nationwide delivery 3–5 working days</p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold! text-[#184363]">Order today — dispatches next business day</p>
            <p className="text-xs text-neutral-500 mt-0.5">Nationwide delivery 3–5 working days</p>
          </>
        )}
      </div>
    </div>
  );
}
