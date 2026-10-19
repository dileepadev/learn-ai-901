/**
 * Content + progress model for the AI-901 study app.
 *
 * Everything here is plain data so lessons and questions can be edited without
 * touching application logic. Topic ids mirror the official "Skills measured"
 * groupings from the Exam AI-901 study guide (as of April 15, 2026).
 */

/* ------------------------------------------------------------------ *
 * Exam taxonomy
 * ------------------------------------------------------------------ */

/** Sub-areas of the two scored domains, straight from the study guide. */
export type TopicId =
  | 'responsible-ai'
  | 'model-components'
  | 'ai-workloads'
  | 'foundry-genai-agents'
  | 'foundry-text-speech'
  | 'foundry-vision'
  | 'foundry-extraction';

export type DomainId = 'concepts' | 'implement';

export interface Topic {
  id: TopicId;
  domain: DomainId;
  /** Short label for chips and charts. */
  label: string;
  /** Full wording used by Microsoft. */
  officialName: string;
  /** Share of the exam, in percent. Sums to 100 across all topics. */
  weight: number;
  /** Individual "skills measured" bullets under this heading. */
  objectives: string[];
}

export interface Domain {
  id: DomainId;
  label: string;
  /** Official range printed on the study guide, e.g. "40–45%". */
  weightLabel: string;
}

export type Priority = 'high' | 'medium' | 'low';
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * `learn` questions are inline knowledge checks: they teach, and they show
 * feedback immediately. `exam` questions are exam-style and are the only ones
 * used to score the practice exam and drive readiness.
 */
export type QuestionKind = 'learn' | 'exam';

/* ------------------------------------------------------------------ *
 * Questions
 * ------------------------------------------------------------------ */

interface QuestionBase {
  id: string;
  topic: TopicId;
  /** Module this question belongs to, when it is an inline check. */
  moduleId?: string;
  /** The skills-measured bullet this question maps to. */
  objective: string;
  difficulty: Difficulty;
  kind: QuestionKind;
  /** Optional case/scenario setup rendered above the prompt. */
  scenario?: string;
  prompt: string;
  /** Why the correct answer is correct. Always shown after answering. */
  explanation: string;
  /** Microsoft Learn (or other official) page that backs up the answer. */
  reference: { label: string; url: string };
  /** Short tags used by Rapid Review and weak-area drilling. */
  tags?: string[];
}

export interface ChoiceOption {
  id: string;
  text: string;
  correct: boolean;
  /** Why this distractor is wrong. Shown after answering when present. */
  why?: string;
}

/** Single-answer multiple choice (includes true/false). */
export interface SingleChoiceQuestion extends QuestionBase {
  type: 'single';
  options: ChoiceOption[];
}

/** Multi-answer: "Select all that apply" / "Choose two". */
export interface MultiChoiceQuestion extends QuestionBase {
  type: 'multi';
  options: ChoiceOption[];
}

/** Match each item on the left to the correct item on the right. */
export interface MatchQuestion extends QuestionBase {
  type: 'match';
  /** Label above the left column, e.g. "Scenario". */
  leftLabel: string;
  /** Label above the right column, e.g. "Service". */
  rightLabel: string;
  pairs: { id: string; left: string; right: string; why?: string }[];
}

/** Put the steps in the correct order. `items` are given in correct order. */
export interface OrderQuestion extends QuestionBase {
  type: 'order';
  items: { id: string; text: string }[];
}

export type Question =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | MatchQuestion
  | OrderQuestion;

export type QuestionType = Question['type'];

/** A learner's response, normalised across question types. */
export type Answer =
  | { type: 'single'; optionId: string | null }
  | { type: 'multi'; optionIds: string[] }
  | { type: 'match'; assignments: Record<string, string | null> }
  | { type: 'order'; itemIds: string[] };

/* ------------------------------------------------------------------ *
 * Lessons
 * ------------------------------------------------------------------ */

/** Blocks a lesson is built from. Prose is deliberately kept short. */
export type Block =
  /** One short paragraph. Supports `code`, **bold**, *italic*, [links](url). */
  | { t: 'p'; md: string }
  /** Section heading inside a lesson. */
  | { t: 'h'; text: string; id?: string }
  | { t: 'list'; items: string[]; ordered?: boolean }
  /** "Know this for the exam" callout. */
  | { t: 'key'; title: string; body: string; priority?: Priority }
  /** A distinction people reliably get wrong on the exam. */
  | { t: 'trap'; title: string; body: string }
  /** Something Microsoft renamed or replaced. Flags stale study material. */
  | { t: 'changed'; title: string; body: string }
  | { t: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { t: 'code'; lang: string; code: string; caption?: string }
  /** Click-through pipeline: each step reveals its detail. */
  | { t: 'steps'; title?: string; steps: { label: string; detail: string }[] }
  /** Inline knowledge check referencing a question by id. */
  | { t: 'check'; qid: string }
  /** An interactive demo widget, addressed by name. */
  | { t: 'demo'; name: DemoName; caption?: string }
  /** Renders a named comparison from `comparisons.ts` as a flip-card drill. */
  | { t: 'compare'; id: string };

export type DemoName =
  | 'tokenizer'
  | 'sampling'
  | 'vision-tasks'
  | 'rag-pipeline'
  | 'prompt-roles'
  | 'deployment-picker'
  | 'workload-router'
  | 'analyzer-builder';

export interface LessonSection {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Module {
  id: string;
  /** Order in the recommended study path. */
  order: number;
  title: string;
  /** One line describing the payoff of this module. */
  summary: string;
  topic: TopicId;
  /**
   * Other exam topics this module also teaches. A module about speech, for
   * example, also covers the "identify features and capabilities of speech
   * recognition and synthesis" bullet under AI workloads. Coverage scoring
   * counts these too.
   */
  alsoCovers?: TopicId[];
  /** Realistic focused reading time, in minutes. */
  minutes: number;
  priority: Priority;
  /** Emoji used as the module glyph. */
  icon: string;
  /** 3–5 bullets: what you will be able to answer after this module. */
  outcomes: string[];
  sections: LessonSection[];
  /** Ordered ids of exam-style questions used for this module's end quiz. */
  quiz: string[];
}

/* ------------------------------------------------------------------ *
 * Rapid review
 * ------------------------------------------------------------------ */

export interface Flashcard {
  id: string;
  topic: TopicId;
  front: string;
  back: string;
  priority: Priority;
  tags?: string[];
}

/** A "this vs that" table rendered as an interactive drill. */
export interface Comparison {
  id: string;
  title: string;
  topic: TopicId;
  /** Why this comparison matters on the exam. */
  hook: string;
  /** Column headers: [dimension, optionA, optionB, ...]. */
  headers: string[];
  rows: string[][];
  /** The single sentence to memorise. */
  bottomLine: string;
}

/** A one-line fact worth memorising verbatim. */
export interface QuickFact {
  id: string;
  topic: TopicId;
  fact: string;
  priority: Priority;
}

/* ------------------------------------------------------------------ *
 * Progress (persisted to localStorage)
 * ------------------------------------------------------------------ */

/** Per-question spaced-repetition state. */
export interface QuestionState {
  /** Times answered. */
  seen: number;
  correct: number;
  wrong: number;
  /** Result of the most recent attempt. */
  last: 'correct' | 'wrong';
  /** Timestamp of the most recent attempt. */
  at: number;
  /** Leitner box, 0 (just missed) … 5 (solid). */
  box: number;
  /** Timestamp when this question should resurface. */
  due: number;
}

export interface ModuleState {
  startedAt?: number;
  completedAt?: number;
  /** Ids of sections the learner has scrolled through. */
  sectionsSeen: string[];
}

export type SessionMode =
  | 'module-quiz'
  | 'practice'
  | 'weak-areas'
  | 'mistakes'
  | 'rapid-fire'
  | 'exam'
  | 'mini-exam';

export interface SessionResult {
  id: string;
  mode: SessionMode;
  /** Module or topic this session focused on, when applicable. */
  scope?: string;
  startedAt: number;
  finishedAt: number;
  total: number;
  correct: number;
  /** Question ids answered incorrectly, for review. */
  missed: string[];
  /** Seconds allowed, for timed modes. */
  limitSeconds?: number;
  /** Per-topic tally for the results breakdown. */
  byTopic: Partial<Record<TopicId, { total: number; correct: number }>>;
}

export interface FlashcardState {
  box: number;
  due: number;
  seen: number;
}

export interface Progress {
  /** Schema version, for forward-compatible migrations. */
  v: number;
  createdAt: number;
  updatedAt: number;
  /** Target exam date as an ISO date string (YYYY-MM-DD), if set. */
  examDate?: string;
  lastVisited?: { path: string; label: string; at: number };
  modules: Record<string, ModuleState>;
  questions: Record<string, QuestionState>;
  flashcards: Record<string, FlashcardState>;
  sessions: SessionResult[];
  /** ISO dates (YYYY-MM-DD) on which the learner studied. */
  activeDays: string[];
  /** One-off markers such as "opened the cram sheet". */
  achievements: string[];
  /** Study-plan steps the learner ticked off by hand. */
  planDone: string[];
}

/* ------------------------------------------------------------------ *
 * Authoring convenience
 * ------------------------------------------------------------------ */

/**
 * Shape used inside the `questions/` files. `type` may be omitted for ordinary
 * single-answer multiple choice, which is the most common case by far;
 * `normalizeQuestion` fills it in.
 */
export type AuthoredQuestion =
  | (Omit<SingleChoiceQuestion, 'type'> & { type?: 'single' })
  | MultiChoiceQuestion
  | MatchQuestion
  | OrderQuestion;

export function normalizeQuestion(q: AuthoredQuestion): Question {
  if (!('type' in q) || q.type === undefined) {
    return { ...(q as Omit<SingleChoiceQuestion, 'type'>), type: 'single' };
  }
  return q as Question;
}
