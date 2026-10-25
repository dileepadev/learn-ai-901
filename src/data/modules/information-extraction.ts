import type { Module } from '../types';

export const informationExtraction: Module = {
  id: 'information-extraction',
  order: 12,
  title: 'Content Understanding',
  summary:
    'Azure Content Understanding across documents, images, audio and video - analyzers, field methods, and confidence-driven automation.',
  topic: 'foundry-extraction',
  alsoCovers: ['ai-workloads'],
  minutes: 23,
  priority: 'high',
  icon: '📄',
  outcomes: [
    'Explain what an analyzer is and how to build a custom one',
    'Choose between Extract, Classify and Generate for a field',
    'Say what confidence scores unlock, and when to use Document Intelligence instead',
  ],
  quiz: ['fe-004', 'fe-010', 'fe-011', 'fe-018', 'sc-fe-01', 'sc-fe-03', 'sc-fe-05', 'sc-fe-06', 'sc-fe-09', 'yn-fe-01', 'dd-fe-01', 'code-cu-01'],
  sections: [
    {
      id: 'why',
      title: 'Why this topic is heavily weighted',
      blocks: [
        {
          t: 'p',
          md: 'Content Understanding is genuinely new since AI-900 - it has no predecessor to remember - and it carries roughly **15% of the exam**, with four dedicated skills-measured bullets. It uses generative AI to process documents, images, video and audio into an output format **you define**.',
        },
        {
          t: 'key',
          title: 'One sentence',
          body: 'You declare a **schema**; the service fills it in from any of four modalities, with **confidence scores** on each field.',
          priority: 'high',
        },
      ],
    },
    {
      id: 'analyzers',
      title: 'Analyzers are the building block',
      blocks: [
        {
          t: 'p',
          md: 'An **analyzer** is a reusable configuration that defines what content to process, what to extract, how to structure the output, and which models to use. Configure it once and it applies the same settings consistently to everything you send.',
        },
        {
          t: 'table',
          headers: ['Analyzer type', 'What it is', 'Example'],
          rows: [
            ['**Content extraction**', 'OCR and layout only - no language model involved', '`prebuilt-read`, `prebuilt-layout`'],
            ['**Base**', 'Core processing per content type; the only analyzers a custom analyzer can derive from', '`prebuilt-document`, `prebuilt-image`, `prebuilt-audio`, `prebuilt-video`'],
            ['**RAG**', 'Extract content with semantic understanding, optimised for search and AI apps', '`prebuilt-documentSearch`, `prebuilt-imageSearch`, `prebuilt-audioSearch`, `prebuilt-videoSearch`'],
            ['**Domain-specific**', 'Preconfigured for an industry document type, with a tuned schema', '`prebuilt-invoice`, `prebuilt-receipt`, `prebuilt-idDocument`'],
            ['**Custom**', 'A base analyzer extended with your own field schema', 'Your damage-report analyzer'],
          ],
        },
        {
          t: 'p',
          md: 'Domain-specific analyzers cover procurement documents, US tax forms, legal contracts, identity documents, financial documents and US mortgage documents - the last including a composed analyzer that classifies and routes automatically.',
        },
        {
          t: 'key',
          title: 'Always check prebuilt first',
          body: 'A common exam pattern offers "build a custom analyzer from scratch" when a domain-specific prebuilt already targets exactly that document type. Start prebuilt; go custom only when fields are missing.',
          priority: 'high',
        },
        {
          t: 'key',
          title: 'It runs on your model deployments',
          body: 'Content Understanding uses **your own Foundry model deployments** - for example `gpt-4.1` and `text-embedding-3-large` - set once per Foundry resource as defaults. Only `prebuilt-read` and `prebuilt-layout` work with no model at all. Use the generally available API (`2025-11-01`) for production.',
          priority: 'medium',
        },
        { t: 'check', qid: 'fe-001' },
        { t: 'check', qid: 'fe-007' },
      ],
    },
    {
      id: 'stages',
      title: 'What happens inside an analyze call',
      blocks: [
        {
          t: 'steps',
          title: 'The processing stages',
          steps: [
            {
              label: 'Inputs',
              detail: 'Documents, images, audio or video. One API, four modalities - this is the service\'s defining feature.',
            },
            {
              label: 'Content extraction',
              detail:
                'Turn the raw file into normalised text and metadata: OCR, selection marks, barcodes, formulas, layout elements like paragraphs, sections and tables. For audio and video, transcribe speech and identify key visual elements.',
            },
            {
              label: 'Segmentation',
              detail:
                'Optionally divide content into logical sections - split a multi-document PDF by type, or a video into scenes - so each section is processed on its own.',
            },
            {
              label: 'Field extraction',
              detail:
                'Produce the structured key–value pairs defined by your schema, using Extract, Classify or Generate for each field.',
            },
            {
              label: 'Confidence scores',
              detail:
                'A reliability estimate from 0 to 1 per field, so high-confidence values can flow straight through and only doubtful ones reach a human.',
            },
          ],
        },
        {
          t: 'trap',
          title: 'Two meanings of "segmentation"',
          body: 'In **computer vision**, segmentation means per-pixel masks. In **Content Understanding**, segmentation means splitting content into logical sections. Same word, unrelated concepts - and a deliberate distractor.',
        },
        { t: 'check', qid: 'fe-017' },
        { t: 'check', qid: 'fe-013' },
      ],
    },
    {
      id: 'field-methods',
      title: 'Three ways to produce a field',
      blocks: [
        {
          t: 'table',
          headers: ['Method', 'What it does', 'Example'],
          rows: [
            ['**Extract**', 'Take the value exactly as it appears (documents only)', 'The invoice total printed on the page'],
            ['**Classify**', 'Choose from a predefined set of categories', 'Call sentiment; chart type; which document type this is, for routing'],
            ['**Generate**', 'Freely produce a value from the input', 'A summary of a conversation; a description of a video scene'],
          ],
        },
        {
          t: 'key',
          title: 'How to pick',
          body: 'Is the value **literally printed** in the source? Extract. Is it **one of a fixed set you defined**? Classify. Does it need **writing**? Generate.',
          priority: 'high',
        },
        { t: 'check', qid: 'fe-002' },
        { t: 'check', qid: 'fe-003' },
      ],
    },
    {
      id: 'modalities',
      title: 'What each modality returns',
      blocks: [
        {
          t: 'table',
          headers: ['Modality', 'Typical output'],
          rows: [
            ['**Documents**', 'Key–value fields, tables, layout, plus confidence scores'],
            ['**Images**', 'Descriptions and your defined fields - damaged parts, chart type, visible text'],
            ['**Audio**', 'Transcript, speaker labels, summary, sentiment classification'],
            ['**Video**', 'Automatic segments on scene or topic change, transcript, per-segment descriptions of people, places and actions'],
          ],
        },
        { t: 'demo', name: 'analyzer-builder', caption: 'Build a field schema and see the JSON it produces.' },
        { t: 'check', qid: 'fe-005' },
        { t: 'check', qid: 'fe-006' },
      ],
    },
    {
      id: 'custom',
      title: 'Building a custom analyzer',
      blocks: [
        {
          t: 'steps',
          title: 'The workflow',
          steps: [
            { label: 'Pick a base', detail: 'Start from the base analyzer for your content type, or copy a prebuilt analyzer as a template.' },
            { label: 'Define the field schema', detail: 'Name each field, give it a type and a method, and describe it in natural language so the model knows what to look for. Labelled examples are optional extras that can improve accuracy - not a requirement.' },
            { label: 'Create the analyzer', detail: 'Register the schema as a named custom analyzer.' },
            { label: 'Analyze', detail: 'Submit a file - often a blob URL with a SAS token - to the analyze operation.' },
            { label: 'Consume the result', detail: 'Read the structured JSON and the per-field confidence scores.' },
          ],
        },
        {
          t: 'code',
          lang: 'json',
          caption: 'A field schema - descriptions do the work that prompt engineering would otherwise do',
          code: `{
  "baseAnalyzerId": "prebuilt-document",
  "fieldSchema": {
    "fields": {
      "VendorName": {
        "type": "string",
        "method": "extract",
        "description": "Legal company name issuing the document"
      },
      "TotalAmount": {
        "type": "number",
        "method": "extract",
        "description": "Final amount due including taxes"
      },
      "DocumentType": {
        "type": "string",
        "method": "classify",
        "enum": ["invoice", "receipt", "purchase order"]
      },
      "Summary": {
        "type": "string",
        "method": "generate",
        "description": "One sentence describing what this document is for"
      }
    }
  }
}`,
        },
        { t: 'check', qid: 'fe-008' },
      ],
    },
    {
      id: 'vs-di',
      title: 'Content Understanding or Document Intelligence?',
      blocks: [
        {
          t: 'table',
          headers: ['', 'Content Understanding', 'Document Intelligence'],
          rows: [
            ['Modalities', 'Documents, images, audio, video', 'Documents only'],
            ['Approach', 'Generative, schema-driven - you declare the fields', 'Specialist document models: read, layout, prebuilt, custom'],
            ['Strength', 'Breadth across modalities, custom schemas with no training', 'OCR, tables, selection marks, reading order, high document fidelity'],
            ['AI-901 emphasis', '**Primary** - four dedicated objectives', 'Background; know it exists and what it is best at'],
          ],
        },
        { t: 'check', qid: 'fe-009' },
      ],
    },
    {
      id: 'automation',
      title: 'Confidence-driven automation',
      blocks: [
        {
          t: 'p',
          md: 'Confidence scores are what make extraction *operational* rather than a demo. The intended pattern is **straight-through processing**: auto-accept values above your threshold, and queue anything below it for a human.',
        },
        {
          t: 'key',
          title: 'A quiet responsible AI answer',
          body: 'Confidence-threshold routing keeps a human in the loop **exactly where the system is least certain**. That is reliability and safety, and accountability, expressed as a design pattern.',
          priority: 'medium',
        },
        { t: 'check', qid: 'fe-016' },
        { t: 'check', qid: 'fe-014' },
      ],
    },
  ],
};
