import type { Module } from '../types';

export const foundations: Module = {
  id: 'foundations',
  order: 1,
  title: 'AI workloads: what to use when',
  summary:
    'Learn the six AI workloads and how to route any scenario to the right one - the single most tested skill on this exam.',
  topic: 'ai-workloads',
  minutes: 18,
  priority: 'high',
  icon: '🧭',
  outcomes: [
    'Name the six AI workloads AI-901 uses and give an example of each',
    'Route a business scenario to the correct workload in one read',
    'Tell generative AI apart from agentic AI, and text analysis apart from information extraction',
  ],
  quiz: ['wl-002', 'wl-003', 'wl-004', 'wl-042', 'sc-wl-02', 'sc-wl-10', 'sc-wl-13'],
  sections: [
    {
      id: 'why',
      title: 'Why this module comes first',
      blocks: [
        {
          t: 'p',
          md: 'A large share of AI-901 questions are the same shape: *a company needs to do X - which capability should they use?* If you can classify the scenario, you have usually eliminated three of the four options before reading them properly.',
        },
        {
          t: 'key',
          title: 'The one habit that pays for itself',
          body: 'Read the scenario for **what goes in and what must come out**. Modality in (text / audio / pixels / documents) plus output shape (a label, new content, structured fields, an action taken) determines the workload almost every time.',
          priority: 'high',
        },
      ],
    },
    {
      id: 'workloads',
      title: 'The six workloads',
      blocks: [
        {
          t: 'table',
          headers: ['Workload', 'Signature in a question', 'Typical example'],
          rows: [
            [
              '**Generative AI**',
              'Output is *new content* whose wording is not in the input',
              'Draft a product description, write a reply, summarise into fresh prose',
            ],
            [
              '**Agentic AI**',
              'A *goal*, multiple steps, and calls into other systems',
              'Resolve a ticket: look up the order, issue a refund, email the customer',
            ],
            [
              '**Text analysis (NLP)**',
              'Text in, a *label or list* out',
              'Sentiment, key phrases, entities, PII, language detection',
            ],
            [
              '**Speech**',
              'Audio in, or audio out',
              'Live captions, call transcription, a spoken assistant reply',
            ],
            [
              '**Computer vision**',
              'Pixels in',
              'Defect detection, object counting, OCR, face detection',
            ],
            [
              '**Information extraction**',
              'Unstructured media in, *your schema* out',
              'Invoice fields, damage report from a photo, call transcript + summary',
            ],
          ],
        },
        {
          t: 'demo',
          name: 'workload-router',
          caption: 'Read each scenario and pick the workload. Instant feedback.',
        },
      ],
    },
    {
      id: 'confusions',
      title: 'The three confusions that cost marks',
      blocks: [
        {
          t: 'trap',
          title: 'Generative AI vs. agentic AI',
          body: 'A generative model **produces content**. An agent **pursues a goal and acts**. The deciding question: does the system have to *do* something in another system - call an API, place an order, update a record? If yes, it is agentic. An agent is a model **plus instructions plus tools**; remove the tools and it is just a chatbot.',
        },
        {
          t: 'trap',
          title: 'Text analysis vs. information extraction',
          body: 'Text analysis answers **fixed questions about text you already have** (what is the sentiment? what are the key phrases?). Information extraction takes **unstructured media of any modality** and fills in **a schema you defined**. "Give me vendor, date and total as JSON" is extraction, even though the source is a document full of text.',
        },
        {
          t: 'trap',
          title: 'Computer vision vs. multimodal models',
          body: 'Classic computer vision returns **structured findings** - labels, bounding boxes, masks, text, scores. A multimodal model **reasons in prose** about what it sees. "Return coordinates of every car" is vision. "Explain why this chart dips in Q3" needs a multimodal model.',
        },
        { t: 'check', qid: 'wl-005' },
      ],
    },
    {
      id: 'practice',
      title: 'Route these',
      blocks: [
        { t: 'check', qid: 'wl-001' },
        { t: 'check', qid: 'wl-043' },
        {
          t: 'p',
          md: 'Some scenarios need **more than one** workload. A hands-free assistant that listens, answers aloud and places an order is speech (or a multimodal audio model) *plus* agentic AI. Case-style questions on the exam often combine two.',
        },
        { t: 'check', qid: 'wl-044' },
      ],
    },
    {
      id: 'naming',
      title: 'Names Microsoft uses now',
      blocks: [
        {
          t: 'changed',
          title: 'Cognitive Services → Azure AI services → Foundry Tools',
          body: 'The prebuilt AI capabilities are now presented as **Foundry Tools**: Azure **Language** in Foundry Tools, Azure **Speech** in Foundry Tools, Azure **Vision** in Foundry Tools, Azure **Content Understanding** in Foundry Tools. Expect the current names in exam wording; older AI-900 material uses "Cognitive Services".',
        },
        {
          t: 'key',
          title: 'Where each workload lands in Foundry',
          body: 'Generative + agentic ⇒ **Foundry Models and Foundry Agent Service**. Text analysis ⇒ **Azure Language**, or a model. Speech ⇒ **Azure Speech** (including Voice Live), or a model that accepts audio. Vision ⇒ a **multimodal model** to reason about images, **Content Understanding** for structured fields, **Document Intelligence** for document OCR. Information extraction ⇒ **Azure Content Understanding**.',
          priority: 'high',
        },
      ],
    },
  ],
};
