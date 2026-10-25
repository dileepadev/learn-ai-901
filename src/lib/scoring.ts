/**
 * Turns raw progress into the numbers the UI reports: per-topic mastery,
 * an overall readiness percentage, and streaks.
 *
 * Readiness deliberately blends *knowing* (lesson coverage) with *proving*
 * (question accuracy), and discounts accuracy that rests on a small sample -
 * three lucky guesses should not read as mastery.
 */
import type { Points, Progress, SessionResult, TopicId } from '../data/types';
import { TOPICS } from '../data/exam';
import { MASTERED_BOX } from './srs';

/** Anything with an id and a topic can be scored - a full question or a QuestionRef. */
export interface ScoredQuestion {
  id: string;
  topic: TopicId;
}

/** Anything with an id and the topics it teaches - a full module or a ModuleRef. */
export interface ScoredModule {
  id: string;
  topic: TopicId;
  alsoCovers?: TopicId[];
}

/** Attempts on a topic needed before its accuracy is trusted at face value. */
const CONFIDENCE_TARGET = 10;

/** Split between proven accuracy and lesson coverage in the readiness score. */
const ACCURACY_SHARE = 0.65;
const COVERAGE_SHARE = 0.35;

export interface TopicStats {
  topic: TopicId;
  label: string;
  weight: number;
  /** Questions in the bank for this topic. */
  bankSize: number;
  /** Distinct questions attempted at least once. */
  attempted: number;
  /** Total attempts (a question answered twice counts twice). */
  attempts: number;
  correct: number;
  /** correct / attempts, or null when never attempted. */
  accuracy: number | null;
  /** Distinct questions sitting in a mastered SRS box. */
  mastered: number;
  /** Sample-size-discounted accuracy, 0–1. */
  mastery: number;
  /** Fraction of this topic's modules completed, 0–1. */
  coverage: number;
  /** Blended 0–1 score used for ranking weak areas. */
  score: number;
  moduleCount: number;
  modulesComplete: number;
}

export interface ReadinessBreakdown {
  /** 0–100. */
  overall: number;
  fromAccuracy: number;
  fromCoverage: number;
  byTopic: TopicStats[];
  /** Topics with the most readiness left on the table, worst first. */
  weakest: TopicStats[];
  /** Topics scoring well, best first. */
  strongest: TopicStats[];
  label: ReadinessLabel;
}

export type ReadinessLabel =
  | 'Not started'
  | 'Getting started'
  | 'Building'
  | 'Almost there'
  | 'Exam ready';

export function readinessLabel(pct: number): ReadinessLabel {
  if (pct < 5) return 'Not started';
  if (pct < 35) return 'Getting started';
  if (pct < 65) return 'Building';
  if (pct < 80) return 'Almost there';
  return 'Exam ready';
}

export function computeTopicStats(
  p: Progress,
  questions: ScoredQuestion[],
  modules: ScoredModule[],
): TopicStats[] {
  return TOPICS.map((topic) => {
    const bank = questions.filter((q) => q.topic === topic.id);
    const mods = modules.filter(
      (m) => m.topic === topic.id || m.alsoCovers?.includes(topic.id),
    );

    let attempted = 0;
    let attempts = 0;
    let correct = 0;
    let mastered = 0;

    for (const q of bank) {
      const s = p.questions[q.id];
      if (!s || s.seen === 0) continue;
      attempted += 1;
      attempts += s.seen;
      correct += s.correct;
      if (s.box >= MASTERED_BOX) mastered += 1;
    }

    const accuracy = attempts > 0 ? correct / attempts : null;
    // Discount accuracy until enough distinct questions have been tried.
    const confidence = Math.min(1, attempted / CONFIDENCE_TARGET);
    const mastery = accuracy === null ? 0 : accuracy * confidence;

    const modulesComplete = mods.filter((m) => p.modules[m.id]?.completedAt).length;
    const coverage = mods.length > 0 ? modulesComplete / mods.length : 0;

    return {
      topic: topic.id,
      label: topic.label,
      weight: topic.weight,
      bankSize: bank.length,
      attempted,
      attempts,
      correct,
      accuracy,
      mastered,
      mastery,
      coverage,
      score: ACCURACY_SHARE * mastery + COVERAGE_SHARE * coverage,
      moduleCount: mods.length,
      modulesComplete,
    };
  });
}

export function computeReadiness(
  p: Progress,
  questions: ScoredQuestion[],
  modules: ScoredModule[],
): ReadinessBreakdown {
  const byTopic = computeTopicStats(p, questions, modules);
  const totalWeight = byTopic.reduce((sum, t) => sum + t.weight, 0) || 1;

  let acc = 0;
  let cov = 0;
  for (const t of byTopic) {
    acc += (t.weight / totalWeight) * t.mastery;
    cov += (t.weight / totalWeight) * t.coverage;
  }

  const overall = Math.round((ACCURACY_SHARE * acc + COVERAGE_SHARE * cov) * 100);

  // Rank by how much weighted readiness each topic is still leaving unearned,
  // so a heavily-weighted shaky topic outranks a tiny one you've ignored.
  const gap = (t: TopicStats) => (1 - t.score) * t.weight;
  const ranked = [...byTopic].sort((a, b) => gap(b) - gap(a));

  return {
    overall,
    fromAccuracy: Math.round(acc * 100),
    fromCoverage: Math.round(cov * 100),
    byTopic,
    weakest: ranked,
    strongest: [...byTopic].sort((a, b) => b.score - a.score),
    label: readinessLabel(overall),
  };
}

/* ------------------------------------------------------------------ *
 * Headline counters
 * ------------------------------------------------------------------ */

export interface OverallStats {
  questionsAnswered: number;
  distinctAnswered: number;
  bankSize: number;
  correct: number;
  accuracy: number | null;
  modulesComplete: number;
  moduleCount: number;
  mastered: number;
  /** Question ids currently sitting on a wrong answer. */
  mistakeIds: string[];
  streak: number;
  bestStreak: number;
  studyDays: number;
  examsTaken: number;
  bestExamScore: number | null;
}

export function computeOverall(
  p: Progress,
  questions: ScoredQuestion[],
  modules: ScoredModule[],
): OverallStats {
  let questionsAnswered = 0;
  let distinctAnswered = 0;
  let correct = 0;
  let mastered = 0;
  const mistakeIds: string[] = [];

  for (const q of questions) {
    const s = p.questions[q.id];
    if (!s || s.seen === 0) continue;
    distinctAnswered += 1;
    questionsAnswered += s.seen;
    correct += s.correct;
    if (s.box >= MASTERED_BOX) mastered += 1;
    if (s.last === 'wrong') mistakeIds.push(q.id);
  }

  const exams = p.sessions.filter((s) => s.mode === 'exam' || s.mode === 'mini-exam');
  const bestExamScore = exams.length ? Math.max(...exams.map(sessionPct)) : null;

  const { current, best } = streaks(p.activeDays);

  return {
    questionsAnswered,
    distinctAnswered,
    bankSize: questions.length,
    correct,
    accuracy: questionsAnswered > 0 ? correct / questionsAnswered : null,
    modulesComplete: modules.filter((m) => p.modules[m.id]?.completedAt).length,
    moduleCount: modules.length,
    mastered,
    mistakeIds,
    streak: current,
    bestStreak: best,
    studyDays: p.activeDays.length,
    examsTaken: exams.length,
    bestExamScore,
  };
}

/** Whole-day index of an ISO date, independent of the viewer's time zone. */
function dayNumber(iso: string): number {
  return Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
}

/** Today's local calendar date as YYYY-MM-DD. */
function localToday(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Consecutive-day streaks from a list of ISO dates. */
export function streaks(days: string[]): { current: number; best: number } {
  if (days.length === 0) return { current: 0, best: 0 };
  const sorted = [...new Set(days)].sort();
  const toDayNumber = dayNumber;

  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = toDayNumber(sorted[i]!) - toDayNumber(sorted[i - 1]!);
    run = diff === 1 ? run + 1 : 1;
    if (run > best) best = run;
  }

  // The streak is only "current" if it includes today or yesterday. Both sides
  // are calendar dates, so the comparison holds in every time zone.
  const today = toDayNumber(localToday());
  const lastDay = toDayNumber(sorted[sorted.length - 1]!);
  const current = today - lastDay <= 1 ? run : 0;

  return { current, best };
}

/** Whole days remaining until the exam, or null when no date is set. */
export function daysUntilExam(p: Progress): number | null {
  if (!p.examDate) return null;
  const target = Date.parse(`${p.examDate}T00:00:00`);
  if (Number.isNaN(target)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

/**
 * A session's score as a percentage. Practice exams are scored in points, one
 * per correct part, as the real exam is; other sessions count whole questions.
 */
export function sessionPct(s: SessionResult): number {
  if (s.points) return pointsPct(s.points);
  return s.total ? Math.round((s.correct / s.total) * 100) : 0;
}

export function pointsPct(p: Points): number {
  return p.possible ? Math.round((p.earned / p.possible) * 100) : 0;
}

/** "3 of 4 points". */
export function pointsText(p: Points): string {
  return `${p.earned} of ${p.possible} ${p.possible === 1 ? 'point' : 'points'}`;
}
