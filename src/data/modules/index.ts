import type { Block, Module } from '../types';
import { QUESTION_BY_ID } from '../questions';

import { foundations } from './foundations';
import { mlAndTransformers } from './ml-and-transformers';
import { responsibleAi } from './responsible-ai';
import { genaiModels } from './genai-models';
import { foundryPlatform } from './foundry-platform';
import { promptsAndChat } from './prompts-and-chat';
import { agents } from './agents';
import { ragFoundryIq } from './rag-foundry-iq';
import { textAnalysis } from './text-analysis';
import { speech } from './speech';
import { vision } from './vision';
import { informationExtraction } from './information-extraction';

const modules: Module[] = [
  foundations,
  mlAndTransformers,
  responsibleAi,
  genaiModels,
  foundryPlatform,
  promptsAndChat,
  agents,
  ragFoundryIq,
  textAnalysis,
  speech,
  vision,
  informationExtraction,
];

/**
 * Catch broken content at build time rather than in the browser: duplicate
 * modules, references to questions that do not exist, and end-of-lesson
 * quizzes that repeat the knowledge checks the learner just answered.
 */
function validate(list: Module[]): Module[] {
  const ids = new Set<string>();
  for (const m of list) {
    if (ids.has(m.id)) throw new Error(`Duplicate module id: ${m.id}`);
    ids.add(m.id);

    const checks = new Set<string>();
    for (const section of m.sections) {
      for (const block of section.blocks as Block[]) {
        if (block.t !== 'check') continue;
        if (!QUESTION_BY_ID[block.qid]) {
          throw new Error(
            `Module "${m.id}" section "${section.id}" references missing question "${block.qid}"`,
          );
        }
        checks.add(block.qid);
      }
    }

    for (const qid of m.quiz) {
      if (!QUESTION_BY_ID[qid]) {
        throw new Error(`Module "${m.id}" quiz references missing question "${qid}"`);
      }
      if (checks.has(qid)) {
        throw new Error(`Module "${m.id}" quiz repeats its own knowledge check "${qid}"`);
      }
    }
  }
  return list;
}

export const MODULES: Module[] = validate(modules).sort((a, b) => a.order - b.order);

export const MODULE_BY_ID: Record<string, Module> = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
);

/** Total estimated study time across all lessons, in minutes. */
export const TOTAL_LESSON_MINUTES = MODULES.reduce((sum, m) => sum + m.minutes, 0);

