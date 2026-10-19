/**
 * Compact, serialisable views of the content catalogue.
 *
 * Readiness, recommendations and progress counts only need to know which
 * questions exist and which topic each belongs to. Pages build these views at
 * build time and pass them to islands as props, so the browser does not have
 * to download the full question bank just to draw a progress bar. The bank is
 * loaded on demand, when a practice session or exam actually starts.
 */
import type { Module, Priority, Question, QuestionKind, TopicId } from '../data/types';
import { TOPICS } from '../data/exam';

/** The minimum a question needs for scoring: its id, topic and kind. */
export interface QuestionRef {
  id: string;
  topic: TopicId;
  kind: QuestionKind;
}

/** The parts of a lesson that lists, plans and recommendations display. */
export interface ModuleRef {
  id: string;
  order: number;
  title: string;
  summary: string;
  topic: TopicId;
  alsoCovers?: TopicId[];
  minutes: number;
  priority: Priority;
  icon: string;
  sections: number;
  checks: string[];
  quiz: string[];
}

const TOPIC_IDS = TOPICS.map((t) => t.id);

/**
 * Pack question refs into one short string ("id.t.k,id.t.k,...") - a few KB,
 * where an array of objects would cost several times that once serialised.
 */
export function encodeQuestionRefs(questions: Question[]): string {
  return questions
    .map((q) => `${q.id}.${TOPIC_IDS.indexOf(q.topic)}.${q.kind === 'exam' ? 'e' : 'l'}`)
    .join(',');
}

export function decodeQuestionRefs(encoded: string): QuestionRef[] {
  if (!encoded) return [];
  return encoded.split(',').map((entry) => {
    const [id = '', topic = '0', kind = 'e'] = entry.split('.');
    return {
      id,
      topic: TOPIC_IDS[Number(topic)] ?? TOPIC_IDS[0]!,
      kind: kind === 'l' ? 'learn' : 'exam',
    };
  });
}

/** Every inline knowledge-check question id used by a module, in order. */
export function checkIdsOf(module: Module): string[] {
  const ids: string[] = [];
  for (const section of module.sections) {
    for (const block of section.blocks) {
      if (block.t === 'check') ids.push(block.qid);
    }
  }
  return ids;
}

export function toModuleRef(module: Module): ModuleRef {
  return {
    id: module.id,
    order: module.order,
    title: module.title,
    summary: module.summary,
    topic: module.topic,
    ...(module.alsoCovers ? { alsoCovers: module.alsoCovers } : {}),
    minutes: module.minutes,
    priority: module.priority,
    icon: module.icon,
    sections: module.sections.length,
    checks: checkIdsOf(module),
    quiz: module.quiz,
  };
}
