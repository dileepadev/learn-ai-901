import type { Domain, Topic, TopicId } from './types';

/**
 * Exam metadata, verified against the official study guide
 * (https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901),
 * skills measured as of April 15, 2026.
 */
export const EXAM = {
  code: 'AI-901',
  title: 'Microsoft Azure AI Fundamentals',
  credential: 'Microsoft Certified: Azure AI Fundamentals',
  passingScore: 700,
  scoreScale: 1000,
  /** Microsoft says most exams have 40-60 questions; the exact count varies. */
  questionCountLabel: '40–60',
  /** Exam time for Fundamentals exams; seat time adds instructions and comments. */
  durationMinutes: 45,
  seatMinutes: 65,
  skillsMeasuredDate: 'April 15, 2026',
  studyGuideUrl:
    'https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901',
  examPageUrl: 'https://learn.microsoft.com/credentials/certifications/exams/ai-901/',
  examExperienceUrl:
    'https://learn.microsoft.com/credentials/support/exam-duration-exam-experience',
  learningPathUrl: 'https://learn.microsoft.com/training/paths/get-started-ai-apps-agents/',
  practiceAssessmentUrl:
    'https://aiskillsnavigator.microsoft.com/credentials/cert-83587e0a0754cfee561ade3e27d9fa1cdaf15ae03be52d2413b2b858d1b4eda4',
  sandboxUrl: 'https://aka.ms/examdemo',
  portalUrl: 'https://ai.azure.com',
} as const;

export const DOMAINS: Domain[] = [
  { id: 'concepts', label: 'Identify AI concepts and capabilities', weightLabel: '40–45%' },
  { id: 'implement', label: 'Implement AI solutions by using Microsoft Foundry', weightLabel: '55–60%' },
];

/**
 * Weights are the midpoints of the published domain ranges, distributed across
 * each domain's sub-areas in proportion to how many skills-measured bullets
 * each one lists. They sum to 100 and drive the readiness score.
 */
export const TOPICS: Topic[] = [
  {
    id: 'responsible-ai',
    domain: 'concepts',
    label: 'Responsible AI',
    officialName: 'Describe principles of responsible AI',
    weight: 18,
    objectives: [
      'Describe considerations for fairness in an AI solution',
      'Describe considerations for reliability and safety in an AI solution',
      'Describe considerations for privacy and security in an AI solution',
      'Describe considerations for inclusiveness in an AI solution',
      'Describe considerations for transparency in an AI solution',
      'Describe considerations for accountability in an AI solution',
    ],
  },
  {
    id: 'model-components',
    domain: 'concepts',
    label: 'Models & configuration',
    officialName: 'Identify AI model components and configurations',
    weight: 9,
    objectives: [
      'Describe how generative AI models work',
      'Identify an appropriate AI model, based on capabilities',
      'Identify appropriate model deployment options and configuration parameters',
    ],
  },
  {
    id: 'ai-workloads',
    domain: 'concepts',
    label: 'AI workloads',
    officialName: 'Identify AI workloads',
    weight: 15,
    objectives: [
      'Identify scenarios for common AI workloads, including generative and agentic AI, text analysis, speech, computer vision, and information extraction',
      'Describe common text analysis techniques, including keyword extraction, entity detection, sentiment analysis, and summarization',
      'Identify features and capabilities of speech recognition and speech synthesis',
      'Identify features and capabilities of computer vision and image-generation models',
      'Identify techniques to extract information from text, images, audio, and videos',
    ],
  },
  {
    id: 'foundry-genai-agents',
    domain: 'implement',
    label: 'Gen AI apps & agents',
    officialName: 'Implement generative AI apps and agents by using Foundry',
    weight: 20,
    objectives: [
      'Create effective system and user prompts for generative AI models',
      'Deploy a model and interact with it in the Foundry portal',
      'Create a lightweight chat client application by using the Foundry SDK',
      'Create and test a single-agent solution in the Foundry portal',
      'Create a lightweight client application for an agent',
    ],
  },
  {
    id: 'foundry-text-speech',
    domain: 'implement',
    label: 'Text & speech',
    officialName: 'Implement AI solutions for text and speech by using Foundry',
    weight: 11,
    objectives: [
      'Build a lightweight application that includes text analysis',
      'Respond to spoken prompts by using a deployed multimodal model',
      'Build a lightweight application by using Azure Speech in Foundry Tools',
    ],
  },
  {
    id: 'foundry-vision',
    domain: 'implement',
    label: 'Vision & image generation',
    officialName:
      'Implement AI solutions with computer vision and image-generation capabilities by using Foundry',
    weight: 12,
    objectives: [
      'Interpret visual input in prompts by using a deployed multimodal model',
      'Create new visual outputs by using generative models',
      'Build a lightweight application that includes vision capabilities',
    ],
  },
  {
    id: 'foundry-extraction',
    domain: 'implement',
    label: 'Information extraction',
    officialName: 'Implement AI solutions for information extraction by using Foundry',
    weight: 15,
    objectives: [
      'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
      'Extract information from images by using Content Understanding',
      'Extract information from audio and video by using Content Understanding',
      'Build a lightweight application with information extraction capabilities by using Content Understanding',
    ],
  },
];

export const TOPIC_BY_ID: Record<TopicId, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t]),
) as Record<TopicId, Topic>;

export function topicLabel(id: TopicId): string {
  return TOPIC_BY_ID[id]?.label ?? id;
}

export function topicWeight(id: TopicId): number {
  return TOPIC_BY_ID[id]?.weight ?? 0;
}
