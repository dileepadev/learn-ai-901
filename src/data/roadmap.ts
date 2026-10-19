import type { TopicId } from './types';

/**
 * A three-day sprint plan. Each day is a sequence of steps the learner works
 * through. A learn step completes itself when its modules are done; any step
 * can also be ticked off by hand.
 *
 * Deliberately front-loaded with the heaviest-weighted topics, and every day
 * ends with retrieval practice rather than more reading.
 */

export type PlanStepKind = 'learn' | 'practice' | 'exam' | 'review' | 'cram';

export interface PlanStep {
  /** Stable id. Ticked-off steps are stored against it, so never reuse one. */
  id: string;
  kind: PlanStepKind;
  label: string;
  /** Module ids, when kind is 'learn'. Reading time comes from the modules. */
  moduleIds?: string[];
  /** Topics a practice step drills. */
  topics?: TopicId[];
  /** Which practice set a practice step opens. Defaults to 'topics'. */
  practice?: 'topics' | 'weak' | 'mistakes';
  /** Which paper an exam step opens. */
  exam?: 'full' | 'mini';
  /** Time for steps that are not reading. Learn steps add up their modules. */
  minutes?: number;
  /** Why this step earns its place, in one line. */
  why: string;
}

export interface PlanDay {
  id: string;
  title: string;
  goal: string;
  steps: PlanStep[];
}

export const SPRINT_PLAN: PlanDay[] = [
  {
    id: 'day-1',
    title: 'Day 1: concepts and the platform',
    goal: 'Cover the whole of the first domain and understand what Microsoft Foundry actually is.',
    steps: [
      {
        id: 'd1-workloads',
        kind: 'learn',
        label: 'AI workloads and how models work',
        moduleIds: ['foundations', 'ml-and-transformers'],
        why: 'Routing a scenario to the right workload is the most common question shape on the paper.',
      },
      {
        id: 'd1-rai',
        kind: 'learn',
        label: 'Responsible AI',
        moduleIds: ['responsible-ai'],
        why: 'Six principles and a lot of scenario-matching: the best marks per minute on the syllabus.',
      },
      {
        id: 'd1-models',
        kind: 'learn',
        label: 'Models, deployment and parameters',
        moduleIds: ['genai-models'],
        why: 'Dense with testable facts, and full of traps from out-of-date material.',
      },
      {
        id: 'd1-platform',
        kind: 'learn',
        label: 'The Foundry platform',
        moduleIds: ['foundry-platform'],
        why: 'Everything in the second domain assumes you know a Foundry resource from a project.',
      },
      {
        id: 'd1-practice',
        kind: 'practice',
        label: 'Practice set on the first domain',
        topics: ['responsible-ai', 'model-components', 'ai-workloads'],
        minutes: 20,
        why: 'Answering questions beats re-reading. Find the gaps while there is time to fix them.',
      },
    ],
  },
  {
    id: 'day-2',
    title: 'Day 2: building with Foundry',
    goal: 'Cover prompts, agents, grounding and the text, speech and vision tools.',
    steps: [
      {
        id: 'd2-prompts',
        kind: 'learn',
        label: 'Prompts and a chat client',
        moduleIds: ['prompts-and-chat'],
        why: 'Message roles and prompting techniques come up again and again.',
      },
      {
        id: 'd2-agents',
        kind: 'learn',
        label: 'Agents',
        moduleIds: ['agents'],
        why: 'Prompt, voice-based and hosted agents are new terms that older notes do not use.',
      },
      {
        id: 'd2-rag',
        kind: 'learn',
        label: 'RAG and Foundry IQ',
        moduleIds: ['rag-foundry-iq'],
        why: 'Grounding, agentic retrieval and permission-aware answers.',
      },
      {
        id: 'd2-modalities',
        kind: 'learn',
        label: 'Text, speech and vision',
        moduleIds: ['text-analysis', 'speech', 'vision'],
        why: 'Two sub-areas of the second domain, and the retirements most notes miss.',
      },
      {
        id: 'd2-practice',
        kind: 'practice',
        label: 'Practice set on building with Foundry',
        topics: ['foundry-genai-agents', 'foundry-text-speech', 'foundry-vision'],
        minutes: 20,
        why: 'Consolidate while the material is fresh.',
      },
    ],
  },
  {
    id: 'day-3',
    title: 'Day 3: extraction, a full exam, weak areas',
    goal: 'Finish the syllabus, then find out honestly where you stand.',
    steps: [
      {
        id: 'd3-extraction',
        kind: 'learn',
        label: 'Content Understanding',
        moduleIds: ['information-extraction'],
        why: 'A sub-area of its own, with vocabulary you need to know cold: analyzers, field schemas, confidence scores.',
      },
      {
        id: 'd3-exam',
        kind: 'exam',
        exam: 'full',
        label: 'Full timed practice exam',
        minutes: 55,
        why: '45 questions in 45 minutes, then ten minutes with the report. The only honest read on whether you would pass today.',
      },
      {
        id: 'd3-weak',
        kind: 'practice',
        practice: 'weak',
        label: 'Drill your weakest topics',
        minutes: 25,
        why: 'The exam report tells you exactly where the remaining time should go.',
      },
      {
        id: 'd3-review',
        kind: 'review',
        label: 'Rapid review: flashcards and comparisons',
        minutes: 20,
        why: 'High-density facts and the distinctions that get confused.',
      },
    ],
  },
  {
    id: 'exam-day',
    title: 'Exam day',
    goal: 'Consolidate. Do not start new material.',
    steps: [
      {
        id: 'ed-cram',
        kind: 'cram',
        label: 'The cram sheet',
        minutes: 25,
        why: 'Every key fact, trap and comparison in one pass.',
      },
      {
        id: 'ed-mistakes',
        kind: 'practice',
        practice: 'mistakes',
        label: 'Questions you got wrong',
        minutes: 15,
        why: 'Close the last gaps. Nothing new this close in.',
      },
      {
        id: 'ed-mini',
        kind: 'exam',
        exam: 'mini',
        label: 'A mini exam to warm up',
        minutes: 15,
        why: 'Arrive already in exam rhythm.',
      },
    ],
  },
];

/** Sitting-the-exam advice, shown on the plan page and in cram mode. */
export const EXAM_DAY_TIPS: { title: string; body: string }[] = [
  {
    title: 'Try the exam sandbox first',
    body: 'Microsoft’s exam sandbox lets you click through the real interface - navigation, the timer, marking for review and each question type - so nothing about the screen is new on the day.',
  },
  {
    title: 'Know the clock',
    body: 'Fundamentals exams give you 45 minutes, inside about 65 minutes of seat time. Most Microsoft exams have 40 to 60 questions. That is under a minute each, so budget accordingly.',
  },
  {
    title: 'There is no Microsoft Learn to look things up',
    body: 'Role-based exams let you open Microsoft Learn in a side panel. Fundamentals exams, AI-901 included, do not. Everything has to be in your head.',
  },
  {
    title: 'A break locks what you have already seen',
    body: 'You can take a break without asking in advance, but the exam clock keeps running and you cannot go back to any question you saw before it. Answer and review what you have seen first.',
  },
  {
    title: 'Never leave a question blank',
    body: 'There is no penalty for guessing: a wrong answer simply earns nothing. Rule out what you can, then commit to the best remaining option.',
  },
  {
    title: 'Read the last line of the question first',
    body: 'Scenario questions bury the actual ask under a paragraph of setup. Find what is being asked, then read the scenario for the details that matter.',
  },
  {
    title: 'Name the workload before you read the options',
    body: 'Decide whether it is generative, agentic, text, speech, vision or extraction first. That usually rules out two options straight away.',
  },
  {
    title: 'Be wary of absolutes',
    body: '"Always", "never" and "the only way" are usually wrong. Microsoft documentation rarely speaks in absolutes.',
  },
  {
    title: 'Prefer the narrowest tool that meets the requirement',
    body: 'If a prebuilt feature answers the question, "train a custom model" and "fine-tune it" are usually distractors.',
  },
  {
    title: 'Trust current naming',
    body: 'Foundry Tools, Foundry resource and project, prompt agents, Content Understanding. An option that says "Cognitive Services" or insists on an AI hub deserves suspicion.',
  },
  {
    title: 'Mark and move',
    body: 'Do not lose four minutes on one question. Mark it for review, answer everything else, and come back with the time you have left.',
  },
];
