/** Gregorian day identifiers. Timezone selection belongs to the caller. */
export function isCalendarDay(value: unknown): value is string {
  if (typeof value !== 'string' || value.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number) as [number, number, number];
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]!;
}

/** Noon UTC is only an ordinal conversion; it does not choose the game's day. */
export function calendarDayIndex(day: string): number {
  if (!isCalendarDay(day)) throw new RangeError('Invalid calendar day');
  return Math.floor(Date.parse(`${day}T12:00:00Z`) / 86_400_000);
}

/** Explicit device-local policy for games which choose it. Never silently uses UTC. */
export function localCalendarDay(date: Date = new Date()): string {
  if (!Number.isFinite(date.getTime())) throw new RangeError('Invalid date');
  const value = `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  if (!isCalendarDay(value)) throw new RangeError('Calendar year must be in 0001..9999');
  return value;
}
