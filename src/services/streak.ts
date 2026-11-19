/** Local calendar day key, yyyy-mm-dd. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Consecutive days of self-care ending today. If today has no check-in yet the
 * streak is still alive from yesterday (it only breaks after a full missed day).
 */
export function computeStreak(checkIns: string[], today = new Date()): number {
  const set = new Set(checkIns);
  const cursor = new Date(today);
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(dayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export const WEEK_LABELS = ["L", "M", "M", "J", "V", "S", "D"] as const;

/** Monday-first days of the current week with their check-in status. */
export function currentWeek(checkIns: string[], today = new Date()) {
  const set = new Set(checkIns);
  const monday = new Date(today);
  const offset = (today.getDay() + 6) % 7; // 0 = Monday
  monday.setDate(today.getDate() - offset);
  return WEEK_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = dayKey(d);
    return { label, key, date: d, done: set.has(key), isToday: key === dayKey(today), isFuture: i > offset };
  });
}
