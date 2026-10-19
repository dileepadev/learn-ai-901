/**
 * Builds the question set for each study mode.
 *
 * Selection is deterministic per session seed so a reload mid-quiz doesn't
 * reshuffle the paper, but varies between sessions.
 */
import type { Progress, Question, SessionMode, TopicId } from '../data/types';
import { TOPICS } from '../data/exam';
import { queuePriority } from './srs';

/** Small, fast, seeded PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export interface QueueOptions {
  mode: SessionMode;
  /** Number of questions requested. */
  size: number;
  /** Restrict to these topics. */
  topics?: TopicId[];
  /** Restrict to a module. */
  moduleId?: string;
  seed?: number;
}

/**
 * Pick questions for a session.
 *
 * `exam` and `mini-exam` sample exam-style questions in proportion to the
 * published domain weights so the paper mirrors the real blueprint. Every other
 * mode prioritises what the learner most needs to see next.
 */
export function buildQueue(
  all: Question[],
  p: Progress,
  opts: QueueOptions,
): Question[] {
  const seed = opts.seed ?? Date.now();
  const rand = rng(seed);
  const now = Date.now();

  let pool = all;
  if (opts.topics?.length) pool = pool.filter((q) => opts.topics!.includes(q.topic));
  if (opts.moduleId) pool = pool.filter((q) => q.moduleId === opts.moduleId);

  switch (opts.mode) {
    case 'exam':
    case 'mini-exam':
      return sampleByExamWeight(pool.filter((q) => q.kind === 'exam'), opts.size, rand);

    case 'mistakes': {
      const missed = pool.filter((q) => p.questions[q.id]?.last === 'wrong');
      return shuffle(missed, rand).slice(0, opts.size);
    }

    case 'rapid-fire': {
      // Fast recall: favour short, lower-difficulty items that are due.
      const ranked = pool
        .filter((q) => q.type === 'single' || q.type === 'multi')
        .map((q) => ({
          q,
          score:
            queuePriority(p.questions[q.id], now) +
            (q.difficulty === 'easy' ? 60 : q.difficulty === 'medium' ? 30 : 0) +
            rand() * 40,
        }))
        .sort((a, b) => b.score - a.score);
      return ranked.slice(0, opts.size).map((r) => r.q);
    }

    case 'weak-areas':
    case 'practice':
    case 'module-quiz':
    default: {
      const ranked = pool
        .map((q) => ({
          q,
          // Blend spaced-repetition urgency with exam weight and a little noise.
          score:
            queuePriority(p.questions[q.id], now) +
            weightOf(q.topic) * 0.8 +
            rand() * 35,
        }))
        // queuePriority returns -1 for items that aren't due yet; keep them as
        // filler so a session always reaches the requested size.
        .sort((a, b) => b.score - a.score);
      return ranked.slice(0, opts.size).map((r) => r.q);
    }
  }
}

function weightOf(topic: TopicId): number {
  return TOPICS.find((t) => t.id === topic)?.weight ?? 10;
}

/**
 * Draw `size` questions distributed across topics in proportion to exam weight,
 * topping up from the remaining pool when a topic runs short.
 */
export function sampleByExamWeight(
  pool: Question[],
  size: number,
  rand: () => number,
): Question[] {
  const byTopic = new Map<TopicId, Question[]>();
  for (const q of pool) {
    const list = byTopic.get(q.topic) ?? [];
    list.push(q);
    byTopic.set(q.topic, list);
  }

  const picked: Question[] = [];
  const used = new Set<string>();

  // Largest-remainder allocation keeps the paper's shape honest at small sizes.
  const quotas = TOPICS.map((t) => ({ topic: t.id, exact: (t.weight / 100) * size }));
  const base = quotas.map((q) => ({ ...q, n: Math.floor(q.exact) }));
  let remaining = size - base.reduce((s, q) => s + q.n, 0);
  base
    .slice()
    .sort((a, b) => b.exact - Math.floor(b.exact) - (a.exact - Math.floor(a.exact)))
    .forEach((q) => {
      if (remaining > 0) {
        q.n += 1;
        remaining -= 1;
      }
    });

  for (const quota of base) {
    const available = shuffle(byTopic.get(quota.topic) ?? [], rand);
    for (const q of available.slice(0, quota.n)) {
      picked.push(q);
      used.add(q.id);
    }
  }

  // Top up if some topic had fewer questions than its quota.
  if (picked.length < size) {
    for (const q of shuffle(pool, rand)) {
      if (picked.length >= size) break;
      if (!used.has(q.id)) {
        picked.push(q);
        used.add(q.id);
      }
    }
  }

  return shuffle(picked, rand).slice(0, size);
}

/** Questions currently due for review. */
export function dueQuestions<T extends { id: string }>(all: T[], p: Progress, now = Date.now()): T[] {
  return all.filter((q) => {
    const s = p.questions[q.id];
    return s ? s.due <= now : false;
  });
}

/** Questions never attempted. */
export function unseenQuestions<T extends { id: string }>(all: T[], p: Progress): T[] {
  return all.filter((q) => !p.questions[q.id]?.seen);
}
