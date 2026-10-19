import type { TopicId } from './types';

/**
 * Official links for AI-901. Every URL here was checked against Microsoft Learn
 * (or the publisher's own site) before it was added - keep it that way.
 */

export type ResourceCategoryId = 'exam' | 'learn' | 'foundry' | 'tools' | 'responsible-ai' | 'community';

export interface OfficialResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: ResourceCategoryId;
  /** Short type label shown on the card. */
  badge: string;
  featured?: boolean;
  relatedTopicId?: TopicId;
  tags: string[];
}

export interface ResourceCategory {
  id: ResourceCategoryId;
  title: string;
  description: string;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'exam',
    title: 'Exam and certification',
    description: 'The study guide, practice assessment, exam sandbox and the rules of the exam itself.',
  },
  {
    id: 'learn',
    title: 'Training and labs',
    description: 'Microsoft Learn training, the official course and the hands-on exercises.',
  },
  {
    id: 'foundry',
    title: 'Microsoft Foundry',
    description: 'The portal, the platform documentation, models, agents and Foundry IQ.',
  },
  {
    id: 'tools',
    title: 'Foundry Tools',
    description: 'Documentation for Language, Speech, Vision, Content Understanding and the services around them.',
  },
  {
    id: 'responsible-ai',
    title: 'Responsible AI',
    description: 'Microsoft principles, guardrails, content safety and open-source fairness tooling.',
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Where to ask questions and keep up with product changes.',
  },
];

export const OFFICIAL_RESOURCES: OfficialResource[] = [
  /* ---- Exam and certification ---- */
  {
    id: 'study-guide',
    title: 'Study guide for Exam AI-901',
    description:
      'The source of truth for what the exam covers: every skill measured as of April 15, 2026, with the domain weights.',
    url: 'https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901',
    category: 'exam',
    badge: 'Study guide',
    featured: true,
    tags: ['skills measured', 'syllabus', 'weights'],
  },
  {
    id: 'exam-page',
    title: 'Exam AI-901: Microsoft Azure AI Fundamentals',
    description:
      'The exam page: schedule through Pearson VUE, see the languages it is offered in, and check the price for your country.',
    url: 'https://learn.microsoft.com/credentials/certifications/exams/ai-901/',
    category: 'exam',
    badge: 'Exam page',
    tags: ['schedule', 'pearson vue', 'languages', 'price'],
  },
  {
    id: 'practice-assessment',
    title: 'Official practice assessment',
    description:
      'Microsoft’s free practice questions for this certification, on AI Skills Navigator. Sign in to launch it.',
    url: 'https://aiskillsnavigator.microsoft.com/credentials/cert-83587e0a0754cfee561ade3e27d9fa1cdaf15ae03be52d2413b2b858d1b4eda4',
    category: 'exam',
    badge: 'Practice test',
    featured: true,
    tags: ['practice questions', 'ai skills navigator', 'free'],
  },
  {
    id: 'exam-sandbox',
    title: 'Exam sandbox',
    description:
      'Click through the real exam interface - navigation, the timer, marking for review and the question types - before exam day.',
    url: 'https://aka.ms/examdemo',
    category: 'exam',
    badge: 'Sandbox',
    featured: true,
    tags: ['exam interface', 'question types', 'demo'],
  },
  {
    id: 'exam-experience',
    title: 'Exam duration and exam experience',
    description:
      'Fundamentals exams give you 45 minutes. Also covers unscheduled breaks, and confirms Microsoft Learn is not available during Fundamentals exams.',
    url: 'https://learn.microsoft.com/credentials/support/exam-duration-exam-experience',
    category: 'exam',
    badge: 'Exam rules',
    tags: ['45 minutes', 'breaks', 'question count'],
  },
  {
    id: 'scoring-reports',
    title: 'Exam scoring and score reports',
    description: 'How the scaled score works, why 700 is the pass mark, and how to read your score report.',
    url: 'https://learn.microsoft.com/credentials/certifications/exam-scoring-reports',
    category: 'exam',
    badge: 'Scoring',
    tags: ['700', 'scaled score', 'score report'],
  },
  {
    id: 'exam-accommodations',
    title: 'Request exam accommodations',
    description: 'Ask for extra time, assistive technology or other changes to the exam experience.',
    url: 'https://learn.microsoft.com/credentials/certifications/request-accommodations',
    category: 'exam',
    badge: 'Accessibility',
    tags: ['extra time', 'assistive technology'],
  },
  {
    id: 'credential-expiration',
    title: 'Credential expiration policies',
    description:
      'Fundamentals certifications, Azure AI Fundamentals included, do not expire - there is nothing to renew.',
    url: 'https://learn.microsoft.com/credentials/support/credential-expiration-policy',
    category: 'exam',
    badge: 'Policy',
    tags: ['expiry', 'renewal'],
  },

  /* ---- Training and labs ---- */
  {
    id: 'learning-path',
    title: 'Get started with AI applications and agents on Azure',
    description:
      'The self-paced Microsoft Learn path for this exam: generative AI and agents, text analysis, speech, computer vision, information extraction and Foundry IQ.',
    url: 'https://learn.microsoft.com/training/paths/get-started-ai-apps-agents/',
    category: 'learn',
    badge: 'Learning path',
    featured: true,
    tags: ['training', 'self-paced', 'modules'],
  },
  {
    id: 'ai-concepts-module',
    title: 'Introduction to AI concepts',
    description: 'A short Microsoft Learn module on the AI workloads and responsible AI - the conceptual half of the exam.',
    url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/',
    category: 'learn',
    badge: 'Module',
    relatedTopicId: 'ai-workloads',
    tags: ['workloads', 'responsible ai', 'concepts'],
  },
  {
    id: 'genai-module',
    title: 'Introduction to generative AI and agents',
    description: 'How language models work - tokens, embeddings, transformers - and how prompts and agents build on them.',
    url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/',
    category: 'learn',
    badge: 'Module',
    relatedTopicId: 'model-components',
    tags: ['tokens', 'embeddings', 'transformers', 'prompts'],
  },
  {
    id: 'course-ai901t00',
    title: 'Course AI-901T00-A: Introduction to AI in Azure',
    description: 'The official one-day, instructor-led course for this exam.',
    url: 'https://learn.microsoft.com/training/courses/ai-901t00',
    category: 'learn',
    badge: 'Course',
    tags: ['instructor-led', 'one day'],
  },
  {
    id: 'labs',
    title: 'Hands-on exercises for AI-901',
    description: 'The lab instructions used in the AI-901 course, published by Microsoft Learning on GitHub.',
    url: 'https://microsoftlearning.github.io/mslearn-ai-fundamentals/',
    category: 'learn',
    badge: 'Labs',
    featured: true,
    tags: ['labs', 'exercises', 'hands-on'],
  },
  {
    id: 'foundry-samples',
    title: 'Microsoft Foundry samples',
    description: 'Official code samples for models, agents and tools in Microsoft Foundry.',
    url: 'https://github.com/microsoft-foundry/foundry-samples',
    category: 'learn',
    badge: 'Code samples',
    relatedTopicId: 'foundry-genai-agents',
    tags: ['github', 'python', 'samples'],
  },
  {
    id: 'python-sdk',
    title: 'Azure AI Projects client library for Python',
    description: 'Reference for `azure-ai-projects`, the Foundry SDK used for chat clients and agents.',
    url: 'https://learn.microsoft.com/python/api/overview/azure/ai-projects-readme',
    category: 'learn',
    badge: 'SDK reference',
    relatedTopicId: 'foundry-genai-agents',
    tags: ['python', 'azure-ai-projects', 'sdk'],
  },

  /* ---- Microsoft Foundry ---- */
  {
    id: 'foundry-portal',
    title: 'Microsoft Foundry portal',
    description: 'ai.azure.com: browse the model catalog, try models in the playgrounds, build agents and run evaluations.',
    url: 'https://ai.azure.com',
    category: 'foundry',
    badge: 'Portal',
    featured: true,
    relatedTopicId: 'foundry-genai-agents',
    tags: ['portal', 'playground', 'model catalog'],
  },
  {
    id: 'foundry-docs',
    title: 'What is Microsoft Foundry?',
    description: 'The platform overview: resources and projects, models, agents, tools, and the enterprise features around them.',
    url: 'https://learn.microsoft.com/azure/foundry/what-is-foundry',
    category: 'foundry',
    badge: 'Documentation',
    relatedTopicId: 'foundry-genai-agents',
    tags: ['resources', 'projects', 'overview'],
  },
  {
    id: 'sdk-quickstart',
    title: 'Quickstart: Get started with the Microsoft Foundry SDK',
    description: 'Chat with a model, create an agent, and hold a multi-turn conversation - the current code shapes, in several languages.',
    url: 'https://learn.microsoft.com/azure/foundry/quickstarts/get-started-code',
    category: 'foundry',
    badge: 'Quickstart',
    relatedTopicId: 'foundry-genai-agents',
    tags: ['sdk', 'responses api', 'chat client'],
  },
  {
    id: 'deployment-overview',
    title: 'Deployment overview for Foundry Models',
    description: 'Serverless API versus managed compute (preview), the deployment types, and when instant access (preview) lets you skip deploying.',
    url: 'https://learn.microsoft.com/azure/foundry/concepts/deployments-overview',
    category: 'foundry',
    badge: 'Documentation',
    relatedTopicId: 'model-components',
    tags: ['serverless api', 'managed compute', 'deployment types'],
  },
  {
    id: 'models-overview',
    title: 'Overview of Microsoft Foundry Models',
    description: 'The model catalog: more than 10,000 models, how models sold by Azure differ from partner models, and how to choose.',
    url: 'https://learn.microsoft.com/azure/foundry/concepts/foundry-models-overview',
    category: 'foundry',
    badge: 'Documentation',
    relatedTopicId: 'model-components',
    tags: ['model catalog', 'gpt-5', 'phi-4', 'llama', 'mistral'],
  },
  {
    id: 'agents-overview',
    title: 'Agents in Microsoft Foundry',
    description: 'Foundry Agent Service: prompt agents, voice-based prompt agents, hosted agents, tools and toolboxes.',
    url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
    category: 'foundry',
    badge: 'Documentation',
    featured: true,
    relatedTopicId: 'foundry-genai-agents',
    tags: ['agents', 'prompt agents', 'hosted agents', 'toolbox'],
  },
  {
    id: 'foundry-iq',
    title: 'What is Foundry IQ?',
    description: 'Knowledge bases, knowledge sources and agentic retrieval: grounded, permission-aware answers with citations.',
    url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/what-is-foundry-iq',
    category: 'foundry',
    badge: 'Documentation',
    relatedTopicId: 'foundry-genai-agents',
    tags: ['rag', 'knowledge base', 'agentic retrieval'],
  },
  {
    id: 'azure-portal',
    title: 'Azure portal',
    description: 'portal.azure.com: create and manage Foundry resources, networking, access control and keys.',
    url: 'https://portal.azure.com',
    category: 'foundry',
    badge: 'Portal',
    tags: ['resources', 'access control', 'keys'],
  },

  /* ---- Foundry Tools ---- */
  {
    id: 'doc-language',
    title: 'Azure Language in Foundry Tools',
    description: 'Sentiment, key phrases, entities, PII, summarization and more. Several of these features retire on 31 March 2029.',
    url: 'https://learn.microsoft.com/azure/ai-services/language-service/overview',
    category: 'tools',
    badge: 'Documentation',
    featured: true,
    relatedTopicId: 'foundry-text-speech',
    tags: ['sentiment', 'key phrases', 'ner', 'pii', 'summarization'],
  },
  {
    id: 'doc-speech',
    title: 'Azure Speech in Foundry Tools',
    description: 'Speech to text, text to speech, speech translation, custom voice and the Voice Live API.',
    url: 'https://learn.microsoft.com/azure/ai-services/speech-service/overview',
    category: 'tools',
    badge: 'Documentation',
    relatedTopicId: 'foundry-text-speech',
    tags: ['speech to text', 'text to speech', 'ssml', 'voice live'],
  },
  {
    id: 'doc-vision',
    title: 'Azure Vision in Foundry Tools',
    description: 'Image analysis, OCR and Face. Image Analysis 4.0 is deprecated and retires on 25 September 2028.',
    url: 'https://learn.microsoft.com/azure/ai-services/computer-vision/overview',
    category: 'tools',
    badge: 'Documentation',
    relatedTopicId: 'foundry-vision',
    tags: ['image analysis', 'ocr', 'face'],
  },
  {
    id: 'doc-image-generation',
    title: 'Image generation models in Foundry',
    description: 'How to generate and edit images with the GPT-image series. DALL·E 3 was retired in March 2026.',
    url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/dall-e',
    category: 'tools',
    badge: 'Documentation',
    relatedTopicId: 'foundry-vision',
    tags: ['gpt-image', 'inpainting', 'image generation'],
  },
  {
    id: 'doc-content-understanding',
    title: 'Azure Content Understanding in Foundry Tools',
    description: 'Schema-driven extraction from documents, images, audio and video, with confidence scores and grounding.',
    url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
    category: 'tools',
    badge: 'Documentation',
    featured: true,
    relatedTopicId: 'foundry-extraction',
    tags: ['analyzers', 'field extraction', 'confidence scores'],
  },
  {
    id: 'doc-doc-intelligence',
    title: 'Azure Document Intelligence in Foundry Tools',
    description: 'Specialist document OCR and layout - text, tables, selection marks and structure - plus prebuilt models for common documents.',
    url: 'https://learn.microsoft.com/azure/ai-services/document-intelligence/overview',
    category: 'tools',
    badge: 'Documentation',
    relatedTopicId: 'foundry-extraction',
    tags: ['ocr', 'layout', 'forms'],
  },
  {
    id: 'doc-ai-search',
    title: 'Azure AI Search',
    description: 'Vector and hybrid search, semantic ranking and agentic retrieval - the engine underneath Foundry IQ.',
    url: 'https://learn.microsoft.com/azure/search/',
    category: 'tools',
    badge: 'Documentation',
    relatedTopicId: 'foundry-genai-agents',
    tags: ['vector search', 'hybrid search', 'rag'],
  },

  /* ---- Responsible AI ---- */
  {
    id: 'rai-principles',
    title: 'Microsoft responsible AI principles and approach',
    description:
      'Fairness, reliability and safety, privacy and security, inclusiveness, transparency and accountability - and how Microsoft applies them.',
    url: 'https://www.microsoft.com/ai/principles-and-approach',
    category: 'responsible-ai',
    badge: 'Principles',
    featured: true,
    relatedTopicId: 'responsible-ai',
    tags: ['six principles', 'fairness', 'transparency', 'accountability'],
  },
  {
    id: 'rai-foundry',
    title: 'Responsible AI for Microsoft Foundry',
    description: 'Microsoft\u2019s Discover, Protect and Govern approach, applied to the agents and apps you build in Foundry.',
    url: 'https://learn.microsoft.com/azure/foundry/responsible-use-of-ai-overview',
    category: 'responsible-ai',
    badge: 'Documentation',
    relatedTopicId: 'responsible-ai',
    tags: ['governance', 'risk', 'mitigation'],
  },
  {
    id: 'guardrails',
    title: 'Guardrails and controls in Microsoft Foundry',
    description: 'Controls checked at four points: user input, tool call, tool response and output. The two tool points apply to agents and are in preview.',
    url: 'https://learn.microsoft.com/azure/foundry/guardrails/guardrails-overview',
    category: 'responsible-ai',
    badge: 'Documentation',
    relatedTopicId: 'responsible-ai',
    tags: ['content filters', 'prompt shields', 'guardrails'],
  },
  {
    id: 'content-safety',
    title: 'Azure AI Content Safety',
    description: 'The service behind Foundry’s safety classifiers: harm categories, severity levels and prompt shields.',
    url: 'https://learn.microsoft.com/azure/ai-services/content-safety/overview',
    category: 'responsible-ai',
    badge: 'Documentation',
    relatedTopicId: 'responsible-ai',
    tags: ['harm categories', 'severity', 'jailbreaks'],
  },
  {
    id: 'hax-toolkit',
    title: 'Guidelines for Human-AI Interaction',
    description: 'Eighteen design guidelines from Microsoft Research for AI experiences people can understand and trust.',
    url: 'https://www.microsoft.com/research/project/guidelines-for-human-ai-interaction/',
    category: 'responsible-ai',
    badge: 'Guidelines',
    relatedTopicId: 'responsible-ai',
    tags: ['ux', 'transparency', 'design'],
  },
  {
    id: 'fairlearn',
    title: 'Fairlearn',
    description: 'An open-source toolkit for assessing and mitigating unfairness in machine learning models.',
    url: 'https://fairlearn.org',
    category: 'responsible-ai',
    badge: 'Open source',
    relatedTopicId: 'responsible-ai',
    tags: ['fairness', 'metrics', 'mitigation'],
  },
  {
    id: 'interpretml',
    title: 'InterpretML',
    description: 'An open-source toolkit for explaining how a model reaches its predictions.',
    url: 'https://interpret.ml',
    category: 'responsible-ai',
    badge: 'Open source',
    relatedTopicId: 'responsible-ai',
    tags: ['explainability', 'transparency'],
  },

  /* ---- Community ---- */
  {
    id: 'qna-foundry-tools',
    title: 'Microsoft Q&A: Foundry Tools',
    description: 'Ask technical questions about Foundry Tools and read answers from Microsoft engineers and the community.',
    url: 'https://learn.microsoft.com/answers/tags/1580/foundry-tools',
    category: 'community',
    badge: 'Forum',
    tags: ['questions', 'support'],
  },
  {
    id: 'tech-community',
    title: 'Microsoft Foundry on the Microsoft Community Hub',
    description: 'Product announcements and engineering posts - the fastest way to hear about renames and retirements.',
    url: 'https://techcommunity.microsoft.com/category/azure-ai-foundry',
    category: 'community',
    badge: 'Blog',
    tags: ['announcements', 'blog'],
  },
  {
    id: 'ai-show',
    title: 'The AI Show',
    description: 'Microsoft Learn video show with demos of new AI features.',
    url: 'https://learn.microsoft.com/shows/ai-show/',
    category: 'community',
    badge: 'Video',
    tags: ['videos', 'demos'],
  },
];
