import { describe, it, expect } from 'vitest';
import { calcTimeLeft } from '@/lib/deliveryTime';

describe('calcTimeLeft', () => {
  it('at 13:00 shows 1h 0m', () => {
    expect(calcTimeLeft(13, 0)).toEqual({ hoursLeft: 1, minutesLeft: 0 });
  });

  it('at 13:30 shows 0h 30m', () => {
    expect(calcTimeLeft(13, 30)).toEqual({ hoursLeft: 0, minutesLeft: 30 });
  });

  it('at 13:59 shows 0h 1m', () => {
    expect(calcTimeLeft(13, 59)).toEqual({ hoursLeft: 0, minutesLeft: 1 });
  });

  it('at 12:00 shows 2h 0m', () => {
    expect(calcTimeLeft(12, 0)).toEqual({ hoursLeft: 2, minutesLeft: 0 });
  });

  it('at 14:00 returns null (cutoff reached)', () => {
    expect(calcTimeLeft(14, 0)).toBeNull();
  });

  it('after 14:00 returns null', () => {
    expect(calcTimeLeft(15, 30)).toBeNull();
  });
});
