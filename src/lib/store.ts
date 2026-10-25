/**
 * Progress store: a tiny observable backed by localStorage.
 *
 * It implements Svelte's store contract, so components can subscribe directly.
 * Every notification carries a fresh shallow snapshot, which lets components
 * hold progress in `$state.raw` and recompute only when it actually changes.
 * All reads are SSR-safe: on the server the store reports empty progress and
 * never touches `localStorage`.
 */
import type {
  Answer,
  FlashcardState,
  ModuleState,
  Points,
  Progress,
  Question,
  QuestionState,
  SessionResult,
  TopicId,
} from '../data/types';
import { schedule } from './srs';

const STORAGE_KEY = 'ai901:progress';
const SCHEMA_VERSION = 1;

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export function emptyProgress(): Progress {
  const now = Date.now();
  return {
    v: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    modules: {},
    questions: {},
    flashcards: {},
    sessions: [],
    activeDays: [],
    achievements: [],
    planDone: [],
  };
}

let state: Progress = emptyProgress();
let snapshot: Progress = state;
let hydrated = false;
const subscribers = new Set<(p: Progress) => void>();

function todayISO(d = new Date()): string {
  // Local calendar date, so a study streak follows the learner's own day.
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ------------------------------------------------------------------ *
 * Loading and migration
 * ------------------------------------------------------------------ */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

/** Keep only entries whose values pass `ok`, so one bad record can't break a page. */
function filterRecord<T>(v: unknown, ok: (x: Record<string, unknown>) => boolean): Record<string, T> {
  if (!isRecord(v)) return {};
  const out: Record<string, T> = {};
  for (const [key, value] of Object.entries(v)) {
    if (isRecord(value) && ok(value)) out[key] = value as T;
  }
  return out;
}

function migrate(raw: unknown): Progress {
  const base = emptyProgress();
  if (!isRecord(raw)) return base;

  return {
    v: SCHEMA_VERSION,
    createdAt: isNum(raw.createdAt) ? raw.createdAt : base.createdAt,
    updatedAt: isNum(raw.updatedAt) ? raw.updatedAt : base.updatedAt,
    examDate:
      typeof raw.examDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.examDate)
        ? raw.examDate
        : undefined,
    lastVisited:
      isRecord(raw.lastVisited) &&
      typeof raw.lastVisited.path === 'string' &&
      typeof raw.lastVisited.label === 'string' &&
      isNum(raw.lastVisited.at)
        ? (raw.lastVisited as Progress['lastVisited'])
        : undefined,
    modules: filterRecord<ModuleState>(raw.modules, (m) => {
      m.sectionsSeen = strings(m.sectionsSeen);
      return true;
    }),
    questions: filterRecord<QuestionState>(
      raw.questions,
      (q) => isNum(q.seen) && isNum(q.correct) && isNum(q.wrong) && isNum(q.box) && isNum(q.due),
    ),
    flashcards: filterRecord<FlashcardState>(
      raw.flashcards,
      (c) => isNum(c.box) && isNum(c.due) && isNum(c.seen),
    ),
    sessions: Array.isArray(raw.sessions)
      ? (raw.sessions
          .filter((s) => isRecord(s) && typeof s.mode === 'string' && isNum(s.total) && isNum(s.correct))
          .map((s) => {
            const { points, ...rest } = s as Record<string, unknown>;
            return isRecord(points) && isNum(points.earned) && isNum(points.possible) && points.possible > 0
              ? { ...rest, points: { earned: points.earned, possible: points.possible } }
              : rest;
          }) as unknown as SessionResult[])
      : [],
    activeDays: strings(raw.activeDays),
    achievements: strings(raw.achievements),
    planDone: strings(raw.planDone),
  };
}

function hydrate(): void {
  if (hydrated || !isBrowser) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = migrate(JSON.parse(raw));
  } catch {
    // Corrupt or unreadable storage: start clean rather than crashing the app.
    state = emptyProgress();
  }
  snapshot = { ...state };
}

/* ------------------------------------------------------------------ *
 * Persistence
 * ------------------------------------------------------------------ */

let flushHandle: number | undefined;

function write(): void {
  flushHandle = undefined;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or private mode: keep the in-memory state working.
  }
}

/** Write any pending change now, rather than waiting for the debounce. */
function flush(): void {
  if (flushHandle === undefined) return;
  clearTimeout(flushHandle);
  write();
}

function persist(): void {
  if (!isBrowser) return;
  // Batch rapid updates (e.g. answering through a quiz) into one write.
  if (flushHandle !== undefined) clearTimeout(flushHandle);
  flushHandle = window.setTimeout(write, 120);
}

function notify(): void {
  snapshot = { ...state };
  for (const fn of subscribers) fn(snapshot);
}

/**
 * Apply a mutation, persist, and notify subscribers. Real study (answering,
 * reading, reviewing) also stamps today as a study day; bookkeeping such as
 * opening a page or setting the exam date does not.
 */
function update(fn: (draft: Progress) => void, studied = true): void {
  hydrate();
  fn(state);
  state.updatedAt = Date.now();
  if (studied) {
    const today = todayISO();
    if (!state.activeDays.includes(today)) state.activeDays.push(today);
  }
  persist();
  notify();
}

/** Svelte-store-compatible read interface. */
export const progress = {
  subscribe(fn: (p: Progress) => void): () => void {
    hydrate();
    fn(snapshot);
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  },
};

/** Snapshot the current progress. Returns empty progress during SSR. */
export function get(): Progress {
  hydrate();
  return snapshot;
}

/** True when this browser already holds some progress. */
export function hasStoredProgress(): boolean {
  if (!isBrowser) return false;
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

if (isBrowser) {
  // Keep multiple open tabs in sync.
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      state = migrate(e.newValue ? JSON.parse(e.newValue) : null);
      notify();
    } catch {
      /* ignore malformed cross-tab payloads */
    }
  });

  // A full navigation, a closed tab or a backgrounded phone must not lose the
  // last answer to the write debounce.
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

/* ------------------------------------------------------------------ *
 * Answer grading
 * ------------------------------------------------------------------ */

/** Grade a response without recording it. Pure, so it is safe to call in render. */
export function grade(question: Question, answer: Answer): boolean {
  const { earned, possible } = score(question, answer);
  return earned === possible;
}

/**
 * Points a question is worth. Microsoft gives one point for each correctly
 * answered part of a multi-part question, so a Yes/No set of three statements
 * is worth three. Single choice and build lists are worth one.
 */
export function pointsFor(question: Question): number {
  switch (question.type) {
    case 'single':
    case 'order':
      return 1;
    case 'multi':
      return question.options.filter((o) => o.correct).length;
    case 'match':
      return question.pairs.length;
    case 'yesno':
      return question.statements.length;
    case 'dropdown':
      return question.blanks.length;
  }
}

/**
 * Points earned by a response. No points are taken away for a wrong part. The one
 * exception is an invalid answer that picks more options than a multi-answer
 * question asks for: each extra cancels a right one, so picking every option
 * cannot collect every point. The card never allows it.
 */
export function score(question: Question, answer: Answer | undefined): Points {
  const possible = pointsFor(question);
  const earned = (n: number): Points => ({ earned: n, possible });
  if (!answer) return earned(0);

  switch (question.type) {
    case 'single': {
      if (answer.type !== 'single' || !answer.optionId) return earned(0);
      return earned(question.options.some((o) => o.id === answer.optionId && o.correct) ? 1 : 0);
    }
    case 'multi': {
      if (answer.type !== 'multi') return earned(0);
      const correct = new Set(question.options.filter((o) => o.correct).map((o) => o.id));
      const chosen = [...new Set(answer.optionIds)];
      const right = chosen.filter((id) => correct.has(id)).length;
      // The card stops at the number asked for. Without this, choosing every
      // option would collect every point.
      const extra = Math.max(0, chosen.length - possible);
      return earned(Math.max(0, right - extra));
    }
    case 'match': {
      if (answer.type !== 'match') return earned(0);
      return earned(question.pairs.filter((p) => answer.assignments[p.id] === p.right).length);
    }
    case 'order': {
      if (answer.type !== 'order') return earned(0);
      const expected = question.items.map((i) => i.id);
      const exact =
        answer.itemIds.length === expected.length && expected.every((id, i) => id === answer.itemIds[i]);
      return earned(exact ? 1 : 0);
    }
    case 'yesno': {
      if (answer.type !== 'yesno') return earned(0);
      return earned(question.statements.filter((s) => answer.values[s.id] === s.yes).length);
    }
    case 'dropdown': {
      if (answer.type !== 'dropdown') return earned(0);
      return earned(
        question.blanks.filter((b) => b.options.some((o) => o.correct && o.id === answer.choices[b.id])).length,
      );
    }
  }
}

/** Record an attempt and reschedule the question. */
export function recordAnswer(questionId: string, correct: boolean): void {
  update((p) => {
    const now = Date.now();
    const prev = p.questions[questionId];
    const next = schedule(prev, correct, now);
    const s: QuestionState = {
      seen: (prev?.seen ?? 0) + 1,
      correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
      wrong: (prev?.wrong ?? 0) + (correct ? 0 : 1),
      last: correct ? 'correct' : 'wrong',
      at: now,
      box: next.box,
      due: next.due,
    };
    p.questions[questionId] = s;
  });
}

/* ------------------------------------------------------------------ *
 * Modules
 * ------------------------------------------------------------------ */

export function markModuleStarted(moduleId: string): void {
  if (get().modules[moduleId]?.startedAt) return;
  update((p) => {
    const m = (p.modules[moduleId] ??= { sectionsSeen: [] });
    m.startedAt ??= Date.now();
  }, false);
}

export function markSectionSeen(moduleId: string, sectionId: string): void {
  const existing = get().modules[moduleId];
  if (existing?.sectionsSeen.includes(sectionId)) return;
  update((p) => {
    const m = (p.modules[moduleId] ??= { sectionsSeen: [] });
    m.startedAt ??= Date.now();
    if (!m.sectionsSeen.includes(sectionId)) m.sectionsSeen = [...m.sectionsSeen, sectionId];
  });
}

export function markModuleComplete(moduleId: string, complete = true): void {
  update((p) => {
    const m = (p.modules[moduleId] ??= { sectionsSeen: [] });
    m.startedAt ??= Date.now();
    if (complete) m.completedAt ??= Date.now();
    else delete m.completedAt;
  });
}

/* ------------------------------------------------------------------ *
 * Flashcards
 * ------------------------------------------------------------------ */

export function recordFlashcard(cardId: string, knewIt: boolean): void {
  update((p) => {
    const prev = p.flashcards[cardId];
    const next = schedule(prev, knewIt);
    p.flashcards[cardId] = {
      box: next.box,
      due: next.due,
      seen: (prev?.seen ?? 0) + 1,
    };
  });
}

/* ------------------------------------------------------------------ *
 * Sessions, plan and settings
 * ------------------------------------------------------------------ */

export function saveSession(result: Omit<SessionResult, 'id'>): SessionResult {
  const withId: SessionResult = { ...result, id: `s_${result.finishedAt.toString(36)}` };
  update((p) => {
    p.sessions = [...p.sessions, withId];
    // Keep history bounded; nothing charts more than the recent run.
    if (p.sessions.length > 120) p.sessions = p.sessions.slice(-120);
  });
  return withId;
}

export function setLastVisited(path: string, label: string): void {
  update((p) => {
    p.lastVisited = { path, label, at: Date.now() };
  }, false);
}

export function setExamDate(date: string | undefined): void {
  update((p) => {
    if (date) p.examDate = date;
    else delete p.examDate;
  }, false);
}

export function setPlanStepDone(stepId: string, done: boolean): void {
  update((p) => {
    const has = p.planDone.includes(stepId);
    if (done && !has) p.planDone = [...p.planDone, stepId];
    if (!done && has) p.planDone = p.planDone.filter((id) => id !== stepId);
  });
}

/** Record a one-off marker. Returns true the first time only. */
export function unlockAchievement(id: string): boolean {
  if (get().achievements.includes(id)) return false;
  update((p) => {
    if (!p.achievements.includes(id)) p.achievements = [...p.achievements, id];
  }, false);
  return true;
}

/** Wipe all stored progress. */
export function resetAll(): void {
  hydrate();
  if (flushHandle !== undefined) clearTimeout(flushHandle);
  flushHandle = undefined;
  state = emptyProgress();
  if (isBrowser) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing else to do */
    }
  }
  notify();
}

/** Export progress as a JSON string for backup. */
export function exportJSON(): string {
  hydrate();
  return JSON.stringify(state, null, 2);
}

/** Import a previously exported payload. Returns false if it isn't usable. */
export function importJSON(raw: string): boolean {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !isRecord(parsed.questions) || !isRecord(parsed.modules)) {
      return false;
    }
    hydrate();
    state = migrate(parsed);
    persist();
    flush();
    notify();
    return true;
  } catch {
    return false;
  }
}

export { todayISO };
export type { TopicId };
