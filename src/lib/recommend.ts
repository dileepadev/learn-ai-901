/**
 * "What should I do next?" - the scheduling brain behind the dashboard.
 *
 * Given how much time the learner has right now, it returns a ranked list of
 * concrete actions. The first item is always the single highest-value thing to
 * do with that much time.
 */
import type { Progress, TopicId } from '../data/types';
import type { ModuleRef, QuestionRef } from './catalog';
import { computeOverall, computeReadiness, daysUntilExam } from './scoring';
import { dueQuestions, unseenQuestions } from './queue';

export type ActionKind =
  | 'learn'
  | 'practice'
  | 'weak'
  | 'mistakes'
  | 'exam'
  | 'review'
  | 'cram'
  | 'flashcards';

export interface Recommendation {
  kind: ActionKind;
  title: string;
  /** One sentence on why this is worth the learner's next minutes. */
  why: string;
  href: string;
  minutes: number;
  /** Higher sorts first. */
  score: number;
  cta: string;
}

export interface RecommendInput {
  progress: Progress;
  modules: ModuleRef[];
  questions: QuestionRef[];
  /** Minutes available right now. */
  budget: number;
  /** Prefix for internal links (Astro's `import.meta.env.BASE_URL`). */
  base: string;
}

function join(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${path}`;
}

export function recommend(input: RecommendInput): Recommendation[] {
  const { progress: p, modules, questions, budget, base } = input;
  const readiness = computeReadiness(p, questions, modules);
  const overall = computeOverall(p, questions, modules);
  const daysLeft = daysUntilExam(p);
  const due = dueQuestions(questions, p).length;
  const unseen = unseenQuestions(questions, p).length;

  const out: Recommendation[] = [];

  // --- Next unfinished module, in recommended study order ------------------
  const ordered = [...modules].sort((a, b) => a.order - b.order);
  const inProgress = ordered.find(
    (m) => p.modules[m.id]?.startedAt && !p.modules[m.id]?.completedAt,
  );
  const nextNew = ordered.find((m) => !p.modules[m.id]?.startedAt);
  const nextModule = inProgress ?? nextNew;

  if (nextModule) {
    const resuming = Boolean(inProgress);
    out.push({
      kind: 'learn',
      title: resuming ? `Finish “${nextModule.title}”` : `Start lesson ${nextModule.order}: ${nextModule.title}`,
      why: resuming
        ? 'You already started this one - finishing it closes a gap in your coverage score.'
        : nextModule.summary,
      href: join(base, `/learn/${nextModule.id}/`),
      minutes: nextModule.minutes,
      cta: resuming ? 'Resume' : 'Start',
      // Coverage is the fastest way to move readiness early on.
      score: 90 - nextModule.order + (resuming ? 12 : 0) + (readiness.overall < 40 ? 25 : 0),
    });
  }

  // --- Mistakes: cheapest accuracy gains available -------------------------
  if (overall.mistakeIds.length >= 3) {
    out.push({
      kind: 'mistakes',
      title: `Retry the ${overall.mistakeIds.length} question${overall.mistakeIds.length === 1 ? '' : 's'} you got wrong`,
      why: 'Re-answering a miss while the explanation is fresh is the highest-yield minute you can spend.',
      href: join(base, '/practice/mistakes/'),
      minutes: Math.min(20, Math.max(4, Math.round(overall.mistakeIds.length * 0.8))),
      cta: 'Retry',
      score: 78 + Math.min(20, overall.mistakeIds.length),
    });
  }

  // --- Weakest weighted topic ---------------------------------------------
  const weakest = readiness.weakest[0];
  if (weakest && overall.distinctAnswered >= 8 && weakest.score < 0.75) {
    out.push({
      kind: 'weak',
      title: `Drill your weakest topic: ${weakest.label}`,
      why: `${weakest.label} is worth about ${weakest.weight}% of the exam and you're scoring ${
        weakest.accuracy === null ? 'nothing yet' : `${Math.round(weakest.accuracy * 100)}%`
      } on it.`,
      href: join(base, `/practice/weak/?topic=${weakest.topic}`),
      minutes: 12,
      cta: 'Drill',
      score: 70 + weakest.weight * 0.6,
    });
  }

  // --- Spaced repetition backlog ------------------------------------------
  if (due >= 8) {
    out.push({
      kind: 'review',
      title: `${due} questions are due for review`,
      why: 'These are scheduled to resurface right as you would start to forget them.',
      href: join(base, '/practice/?start=due'),
      minutes: Math.min(25, Math.round(due * 0.7)),
      cta: 'Review',
      score: 62 + Math.min(20, due / 3),
    });
  }

  // --- Practice exam -------------------------------------------------------
  if (readiness.overall >= 45 || overall.distinctAnswered >= 40) {
    const first = overall.examsTaken === 0;
    out.push({
      kind: 'exam',
      title: first ? 'Take your first full practice exam' : 'Take another timed practice exam',
      why: first
        ? 'A timed run under exam conditions is the only honest read on whether you would pass today.'
        : 'Re-testing under time pressure confirms the gains and exposes what is still shaky.',
      href: join(base, '/exam/'),
      minutes: 50,
      cta: 'Start exam',
      score: (first ? 74 : 55) + (readiness.overall >= 65 ? 15 : 0),
    });
  }

  // --- Rapid review / flashcards ------------------------------------------
  out.push({
    kind: 'flashcards',
    title: 'Rapid review: flashcards and service comparisons',
    why: 'High-density facts, comparisons and exam traps - ideal when you have a spare few minutes.',
    href: join(base, '/review/'),
    minutes: 10,
    cta: 'Review',
    score: 45 + (readiness.overall >= 60 ? 18 : 0),
  });

  // --- Fresh questions you have never seen --------------------------------
  if (unseen > 20 && overall.distinctAnswered > 0) {
    out.push({
      kind: 'practice',
      title: `${unseen} questions you haven't tried yet`,
      why: 'Breadth first: seeing every question once beats perfecting a small slice of the bank.',
      href: join(base, '/practice/?start=quick'),
      minutes: 15,
      cta: 'Practice',
      score: 58,
    });
  }

  // --- Final-day cram ------------------------------------------------------
  if (daysLeft !== null && daysLeft <= 1) {
    out.unshift({
      kind: 'cram',
      title: daysLeft <= 0 ? 'Exam day: one pass through the cram sheet' : 'Exam tomorrow: switch to the cram sheet',
      why: 'Every "know this" fact, trap and comparison in one pass. No new material this close in.',
      href: join(base, '/cram/'),
      minutes: 25,
      cta: 'Open cram sheet',
      score: 200,
    });
  }

  // Prefer actions that actually fit the time available, then by score.
  const fits = (r: Recommendation) => r.minutes <= budget * 1.15;
  return out
    .sort((a, b) => {
      const af = fits(a) ? 1 : 0;
      const bf = fits(b) ? 1 : 0;
      if (af !== bf) return bf - af;
      return b.score - a.score;
    })
    .slice(0, 5);
}

/** Time presets offered on the dashboard. */
export const TIME_BUDGETS = [
  { minutes: 10, label: '10 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1 hour' },
  { minutes: 180, label: '3 hours' },
] as const;

/** Topics sorted worst-first, for the weak-area picker. */
export function weakTopicIds(
  p: Progress,
  questions: QuestionRef[],
  modules: ModuleRef[],
  limit = 3,
): TopicId[] {
  return computeReadiness(p, questions, modules)
    .weakest.slice(0, limit)
    .map((t) => t.topic);
}
