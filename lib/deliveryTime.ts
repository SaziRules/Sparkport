export function calcTimeLeft(hours: number, minutes: number): { hoursLeft: number; minutesLeft: number } | null {
  const totalLeft = 14 * 60 - (hours * 60 + minutes);
  if (totalLeft <= 0) return null;
  return {
    hoursLeft: Math.floor(totalLeft / 60),
    minutesLeft: totalLeft % 60,
  };
}
