/**
 * Leitner-style spaced repetition, tuned for a **few-day sprint** rather than
 * the usual multi-week schedule. Intervals top out at four days, so everything
 * in the bank can resurface at least once before exam day.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Interval before an item in each box is due again. Index === box. */
export const BOX_INTERVALS = [
  8 * MINUTE, // 0 - just missed: come back this session
  45 * MINUTE, // 1 - shaky
  3 * HOUR, // 2 - getting there
  DAY, // 3 - probably solid
  2 * DAY, // 4 - solid
  4 * DAY, // 5 - mastered
] as const;

export const MAX_BOX = BOX_INTERVALS.length - 1;

/** Box at which an item counts as "learned" for progress reporting. */
export const MASTERED_BOX = 4;

export interface Schedulable {
  box: number;
  due: number;
}

/** Advance or reset an item's box after an attempt, and compute its next due time. */
export function schedule(prev: Schedulable | undefined, correct: boolean, now = Date.now()): Schedulable {
  const currentBox = prev?.box ?? 0;
  // A miss drops the item two boxes rather than straight to zero, so a single
  // slip on a well-known item doesn't flood the queue. Anything shaky (box 0-2)
  // still lands back in box 0 and returns within minutes.
  const box = correct ? Math.min(MAX_BOX, currentBox + 1) : Math.max(0, currentBox - 2);
  return { box, due: now + BOX_INTERVALS[box]! };
}

/** True when an item is ready to be shown again. */
export function isDue(item: Schedulable | undefined, now = Date.now()): boolean {
  if (!item) return true;
  return item.due <= now;
}

/**
 * Priority for the practice queue. Higher comes first.
 *
 * Unseen items rank above overdue ones so breadth builds before depth - with
 * only a few days available, seeing every question once matters more than
 * perfecting a subset.
 */
export function queuePriority(item: Schedulable | undefined, now = Date.now()): number {
  if (!item) return 1000;
  const overdueMs = now - item.due;
  if (overdueMs < 0) return -1; // not due yet
  // Lower boxes first, then most overdue.
  return 500 - item.box * 50 + Math.min(400, overdueMs / HOUR);
}
