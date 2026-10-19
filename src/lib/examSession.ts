/**
 * An in-progress practice exam, saved after every change so a reload, a
 * closed tab or a flat battery does not cost the attempt.
 *
 * The timer is a wall-clock deadline rather than a countdown, so it stays
 * honest while the tab sleeps - exactly like the real exam clock.
 */
import type { Answer } from '../data/types';

const KEY = 'ai901:exam';

export type ExamPreset = 'full' | 'mini' | 'custom';

export interface ExamAttempt {
  v: 1;
  preset: ExamPreset;
  /** Question ids, in paper order. */
  ids: string[];
  /** Seed for the option shuffle, so letters stay put on resume. */
  seed: number;
  answers: Record<string, Answer>;
  flagged: string[];
  index: number;
  startedAt: number;
  /** Epoch milliseconds when time runs out, or null when untimed. */
  deadline: number | null;
  limitSeconds: number | null;
}

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export function loadAttempt(): ExamAttempt | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Partial<ExamAttempt>;
    if (a.v !== 1 || !Array.isArray(a.ids) || a.ids.length === 0 || typeof a.startedAt !== 'number') {
      return null;
    }
    return {
      v: 1,
      preset: a.preset === 'mini' || a.preset === 'custom' ? a.preset : 'full',
      ids: a.ids.filter((id): id is string => typeof id === 'string'),
      seed: typeof a.seed === 'number' ? a.seed : 0,
      answers: a.answers && typeof a.answers === 'object' ? a.answers : {},
      flagged: Array.isArray(a.flagged) ? a.flagged.filter((id) => typeof id === 'string') : [],
      index: typeof a.index === 'number' ? a.index : 0,
      startedAt: a.startedAt,
      deadline: typeof a.deadline === 'number' ? a.deadline : null,
      limitSeconds: typeof a.limitSeconds === 'number' ? a.limitSeconds : null,
    };
  } catch {
    return null;
  }
}

export function saveAttempt(attempt: ExamAttempt): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(attempt));
  } catch {
    /* storage full or blocked: the attempt still works for this page view */
  }
}

export function clearAttempt(): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing else to do */
  }
}

/** Seconds left on the clock, or null when untimed. Never negative. */
export function secondsLeft(attempt: ExamAttempt, now = Date.now()): number | null {
  if (attempt.deadline === null) return null;
  return Math.max(0, Math.round((attempt.deadline - now) / 1000));
}

/** Questions with a complete answer. */
export function answeredCount(attempt: ExamAttempt): number {
  return attempt.ids.filter((id) => isComplete(attempt.answers[id])).length;
}

export function isComplete(answer: Answer | undefined): boolean {
  if (!answer) return false;
  switch (answer.type) {
    case 'single':
      return answer.optionId !== null;
    case 'multi':
      return answer.optionIds.length > 0;
    case 'match':
      return Object.values(answer.assignments).every(Boolean) && Object.keys(answer.assignments).length > 0;
    case 'order':
      return answer.itemIds.length > 0;
  }
}
