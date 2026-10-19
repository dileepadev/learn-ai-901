/**
 * Build-time views of the catalogue that several pages hand to islands.
 * Server-only: importing this pulls in the full bank and every lesson.
 */
import { ALL_QUESTIONS } from '../data/questions';
import { MODULES } from '../data/modules';
import { encodeQuestionRefs, toModuleRef, type ModuleRef } from './catalog';
import type { ScoredModule } from './scoring';

export const questionRefs: string = encodeQuestionRefs(ALL_QUESTIONS);

export const moduleRefs: ModuleRef[] = MODULES.map(toModuleRef);

/** Just enough of each lesson to score coverage. */
export const moduleCoverage: ScoredModule[] = MODULES.map((m) => ({
  id: m.id,
  topic: m.topic,
  ...(m.alsoCovers ? { alsoCovers: m.alsoCovers } : {}),
}));
