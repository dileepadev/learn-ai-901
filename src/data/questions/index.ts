import type { AuthoredQuestion, Question, TopicId } from '../types';
import { BLANK, blankText, normalizeQuestion } from '../types';
import { TOPIC_BY_ID } from '../exam';

import { responsibleAiQuestions } from './responsible-ai';
import { aiWorkloadQuestions } from './ai-workloads';
import { modelComponentQuestions } from './model-components';
import { foundryGenAiQuestions } from './foundry-genai-agents';
import { foundryTextSpeechQuestions } from './foundry-text-speech';
import { foundryVisionQuestions } from './foundry-vision';
import { foundryExtractionQuestions } from './foundry-extraction';
import { scenarioQuestions } from './scenarios';
import { foundryScenarioQuestions } from './scenarios-foundry';
import { examFormatQuestions } from './exam-formats';
import { codeQuestions } from './code';

const authored: AuthoredQuestion[] = [
  ...responsibleAiQuestions,
  ...aiWorkloadQuestions,
  ...modelComponentQuestions,
  ...foundryGenAiQuestions,
  ...foundryTextSpeechQuestions,
  ...foundryVisionQuestions,
  ...foundryExtractionQuestions,
  ...scenarioQuestions,
  ...foundryScenarioQuestions,
  ...examFormatQuestions,
  ...codeQuestions,
];

/**
 * Fails the build rather than shipping a bank with duplicate ids, a question
 * that can never be answered correctly, or one the learner cannot verify.
 */
function validate(questions: Question[]): Question[] {
  const seen = new Set<string>();
  const fail = (id: string, message: string): never => {
    throw new Error(`Question ${id}: ${message}`);
  };

  for (const q of questions) {
    if (seen.has(q.id)) fail(q.id, 'duplicate id');
    seen.add(q.id);
    // Ids travel in a compact "id.topic.kind" encoding, so keep them simple.
    if (!/^[a-z0-9-]+$/.test(q.id)) fail(q.id, 'ids may only contain a-z, 0-9 and hyphens');
    // The skills-measured wording, exactly - or the heading, for a question that spans the whole area.
    const topic = TOPIC_BY_ID[q.topic];
    if (!topic) fail(q.id, `unknown topic "${q.topic}"`);
    if (!topic.objectives.includes(q.objective) && q.objective !== topic.officialName) {
      fail(q.id, `objective "${q.objective}" is not a skill measured under ${q.topic}`);
    }
    if (!q.reference?.url.startsWith('https://')) fail(q.id, 'needs a reference with an https URL');
    if (!q.reference.url.startsWith('https://learn.microsoft.com/')) fail(q.id, 'reference must be a Microsoft Learn page');
    if (q.reference.quote.trim().length < 20) fail(q.id, 'needs a quote from its Microsoft Learn page');
    if (q.reference.quote.includes('\u2014')) fail(q.id, 'set em dashes in quotes as spaced hyphens');

    if (q.type === 'single' || q.type === 'multi') {
      const ids = new Set(q.options.map((o) => o.id));
      if (ids.size !== q.options.length) fail(q.id, 'option ids must be unique');
      const correct = q.options.filter((o) => o.correct).length;
      if (q.type === 'single' && correct !== 1) {
        fail(q.id, `single-answer but has ${correct} correct options`);
      }
      if (q.type === 'multi' && correct < 2) {
        fail(q.id, `multi-answer but has ${correct} correct options`);
      }
      if (q.options.length - correct < 1) fail(q.id, 'needs at least one wrong option');
      for (const o of q.options) {
        if (!o.correct && !o.why) fail(q.id, `wrong option "${o.id}" needs a "why"`);
      }
    }
    if (q.type === 'match' && q.pairs.length < 2) fail(q.id, 'needs at least two pairs');
    if (q.type === 'order' && q.items.length < 3) fail(q.id, 'needs at least three items to order');
    if (q.type === 'yesno') {
      if (q.statements.length < 2) fail(q.id, 'needs at least two statements');
      if (new Set(q.statements.map((s) => s.id)).size !== q.statements.length) fail(q.id, 'statement ids must be unique');
      for (const s of q.statements) {
        if (!s.why) fail(q.id, `statement "${s.id}" needs a "why"`);
      }
    }
    if (q.code?.includes('—')) fail(q.id, 'no em dashes in code');
    if (q.code?.includes(BLANK) && q.type !== 'dropdown') fail(q.id, `only dropdown questions may put ${BLANK} in code`);
    if (q.type === 'dropdown') {
      const gaps = blankText(q).split(BLANK).length - 1;
      if (gaps === 0) fail(q.id, `the prompt or code needs a ${BLANK} for each blank`);
      if (gaps !== q.blanks.length) fail(q.id, `prompt has ${gaps} blanks but ${q.blanks.length} are defined`);
      for (const b of q.blanks) {
        if (new Set(b.options.map((o) => o.id)).size !== b.options.length) fail(q.id, `blank "${b.id}" option ids must be unique`);
        const correct = b.options.filter((o) => o.correct).length;
        if (correct !== 1) fail(q.id, `blank "${b.id}" has ${correct} correct options, not one`);
        if (b.options.length < 3) fail(q.id, `blank "${b.id}" needs at least three options`);
        for (const o of b.options) {
          if (!o.correct && !o.why) fail(q.id, `wrong option "${o.id}" in blank "${b.id}" needs a "why"`);
        }
      }
    }
  }
  return questions;
}

/** The full question bank. */
export const ALL_QUESTIONS: Question[] = validate(authored.map(normalizeQuestion));

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  ALL_QUESTIONS.map((q) => [q.id, q]),
);

/** Exam-style questions only - the ones that count towards a practice exam. */
export const EXAM_QUESTIONS: Question[] = ALL_QUESTIONS.filter((q) => q.kind === 'exam');

/** Inline knowledge checks used inside lessons. */
export const LEARN_QUESTIONS: Question[] = ALL_QUESTIONS.filter((q) => q.kind === 'learn');

export function questionsForTopic(topic: TopicId): Question[] {
  return ALL_QUESTIONS.filter((q) => q.topic === topic);
}

export function questionsForModule(moduleId: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.moduleId === moduleId);
}

export function getQuestions(ids: string[]): Question[] {
  return ids.map((id) => QUESTION_BY_ID[id]).filter((q): q is Question => Boolean(q));
}
