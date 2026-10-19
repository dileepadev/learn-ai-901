import type { AuthoredQuestion } from '../types';

/**
 * Topic: Implement AI solutions for information extraction by using Foundry
 * (~15%). Dominated by Azure Content Understanding: analyzers, field
 * extraction methods, confidence scores, and the four modalities.
 */
export const foundryExtractionQuestions: AuthoredQuestion[] = [
  {
    id: 'fe-001',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'What is an *analyzer* in Azure Content Understanding?',
    options: [
      {
        id: 'a',
        text: 'A reusable configuration of what to process, what to extract and how to output it',
        correct: true,
      },
      {
        id: 'b',
        text: 'A trained neural network that you build yourself and upload to the service',
        correct: false,
        why: 'You configure an analyzer; you do not supply model weights.',
      },
      {
        id: 'c',
        text: 'A dashboard that shows extraction accuracy over time',
        correct: false,
        why: 'That would be monitoring, not the core building block.',
      },
      {
        id: 'd',
        text: 'A connection string to the storage account that holds the files you analyze',
        correct: false,
        why: 'Storage connections are separate configuration.',
      },
    ],
    explanation:
      'Analyzers are the core building block of Content Understanding. Once configured, an analyzer applies the same settings consistently to everything you send it, so results stay comparable across a whole corpus.',
    reference: {
      label: 'What is a Content Understanding analyzer?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/analyzer-reference',
    },
    tags: ['content-understanding', 'definition'],
  },
  {
    id: 'fe-002',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Content Understanding can generate field values by three methods. Which two of the following are among them? (Choose two.)',
    options: [
      {
        id: 'a',
        text: 'Extract - take the value as it literally appears in the content',
        correct: true,
      },
      {
        id: 'b',
        text: 'Generate - produce a value freely from the input, such as a summary',
        correct: true,
      },
      {
        id: 'c',
        text: 'Translate - return the value in another language',
        correct: false,
        why: 'Not one of the three field generation methods.',
      },
      {
        id: 'd',
        text: 'Encrypt - return a hashed value',
        correct: false,
        why: 'Not a field generation method.',
      },
      {
        id: 'e',
        text: 'Index - add the value to a search index',
        correct: false,
        why: 'Indexing is downstream of extraction, not a field method.',
      },
    ],
    explanation:
      'The three methods are **Extract** (value appears verbatim - documents only), **Classify** (choose from a predefined set of categories, such as call sentiment or chart type), and **Generate** (freely produce a value, such as a summary or scene description). Knowing which method a requirement needs is a common exam question.',
    reference: {
      label: 'Content Understanding overview - field extraction',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
    },
    tags: ['content-understanding', 'field-methods', 'multi-select'],
  },
  {
    id: 'fe-003',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Field requirement',
    rightLabel: 'Generation method',
    prompt: 'Match each field requirement to the Content Understanding generation method it needs.',
    pairs: [
      { id: 'f1', left: 'The invoice total, exactly as printed on the page', right: 'Extract' },
      { id: 'f2', left: 'Whether a support call ended positively, neutrally or negatively', right: 'Classify' },
      { id: 'f3', left: 'A one-paragraph summary of a recorded conversation', right: 'Generate' },
      { id: 'f4', left: 'Which of five document types this file is, so it can be routed', right: 'Classify' },
      { id: 'f5', left: 'A description of what happens in each video scene', right: 'Generate' },
    ],
    explanation:
      'Verbatim value present in the source ⇒ Extract. Choose from a fixed set you defined ⇒ Classify. Write something new ⇒ Generate. Note that Extract is supported for documents only.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
    },
    tags: ['content-understanding', 'field-methods', 'matching', 'cram'],
  },
  {
    id: 'fe-004',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Build a lightweight application with information extraction capabilities',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'What do confidence scores in Content Understanding enable?',
    options: [
      {
        id: 'a',
        text: 'Straight-through processing: auto-accept confident values, review the rest',
        correct: true,
      },
      {
        id: 'b',
        text: 'Faster processing of large files, by skipping pages with little useful content',
        correct: false,
        why: 'They report reliability; they do not affect throughput.',
      },
      {
        id: 'c',
        text: 'Automatic correction of values the model got wrong',
        correct: false,
        why: 'A score tells you how much to trust a value, not what the right value is.',
      },
      {
        id: 'd',
        text: 'Encryption of extracted fields that contain personal data',
        correct: false,
        why: 'Unrelated to security.',
      },
    ],
    explanation:
      'Each extracted field can carry a reliability estimate from 0 to 1. That is what makes automation economically viable: most documents flow through untouched, and human review is spent only where the model is unsure.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
    },
    tags: ['content-understanding', 'confidence'],
  },
  {
    id: 'fe-005',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from audio and video by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A company wants each recorded sales call turned into: a transcript, who said what, and a short summary.',
    prompt: 'What should they use?',
    options: [
      {
        id: 'a',
        text: 'A Content Understanding audio analyzer',
        correct: true,
      },
      {
        id: 'b',
        text: 'Azure Language summarization on its own',
        correct: false,
        why: 'Language works on text only. There is no transcript yet.',
      },
      {
        id: 'c',
        text: 'An image analyzer',
        correct: false,
        why: 'Wrong modality.',
      },
      {
        id: 'd',
        text: 'Text to speech',
        correct: false,
        why: 'Wrong direction: that generates audio rather than analysing it.',
      },
    ],
    explanation:
      'Audio analyzers transcribe conversations, label speakers, and generate summaries in one analyze call - with prebuilt options tuned for call-centre scenarios. That single-call breadth is why Content Understanding beats stitching Speech and Language together for this requirement.',
    reference: {
      label: 'Content Understanding audio overview',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/audio/overview',
    },
    tags: ['content-understanding', 'audio'],
  },
  {
    id: 'fe-006',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from audio and video by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which outputs would you expect from a Content Understanding *video* analyzer?',
    options: [
      {
        id: 'a',
        text: 'Segments on scene or topic changes, a transcript, and per-segment descriptions',
        correct: true,
      },
      {
        id: 'b',
        text: 'A single label that describes the whole video from start to finish',
        correct: false,
        why: 'That is closer to classification of one image. Video analyzers work over time and return per-segment structure.',
      },
      {
        id: 'c',
        text: 'A newly generated video that summarises the original',
        correct: false,
        why: 'Generation is Sora\'s job.',
      },
      {
        id: 'd',
        text: 'Only the audio track\'s transcript, with no visual analysis',
        correct: false,
        why: 'Video analyzers analyse visual content as well as speech.',
      },
    ],
    explanation:
      'Video analyzers segment automatically on topic shifts, scene changes and visual cues, then return transcripts and detailed per-segment descriptions covering people, places and actions.',
    reference: {
      label: 'Prebuilt analyzers',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/prebuilt-analyzers',
    },
    tags: ['content-understanding', 'video'],
  },
  {
    id: 'fe-007',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A finance team processes invoices in a standard commercial format and needs vendor, dates, line items and totals.',
    prompt: 'What is the fastest route to a working solution?',
    options: [
      {
        id: 'a',
        text: 'Use a prebuilt invoice analyzer, and only build a custom analyzer if fields are missing',
        correct: true,
      },
      {
        id: 'b',
        text: 'Build a custom analyzer from scratch, with a full field schema for every invoice field',
        correct: false,
        why: 'Unnecessary work when a domain-specific prebuilt analyzer already targets exactly this document type with a tuned schema.',
      },
      {
        id: 'c',
        text: 'Fine-tune a language model on invoice images',
        correct: false,
        why: 'Far more expensive and slower, with no confidence scores or grounding.',
      },
      {
        id: 'd',
        text: 'Prompt a chat model with each invoice and parse the prose reply',
        correct: false,
        why: 'Fragile: no schema guarantee, no confidence scores, and difficult to validate at scale.',
      },
    ],
    explanation:
      'Content Understanding ships domain-specific analyzers for common industry documents - procurement (invoices, receipts, purchase orders), US tax forms, legal contracts, identity documents, financial statements and US mortgage documents. Always check for a prebuilt before building custom.',
    reference: {
      label: 'Prebuilt analyzers',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/prebuilt-analyzers',
    },
    tags: ['content-understanding', 'prebuilt-vs-custom', 'hard'],
  },
  {
    id: 'fe-008',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    type: 'order',
    prompt: 'Put the steps for building a custom Content Understanding analyzer in order.',
    items: [
      { id: 'c1', text: 'Choose the base or prebuilt analyzer for your content type' },
      { id: 'c2', text: 'Define a field schema: the fields, their types, and a description of each' },
      { id: 'c3', text: 'Create the custom analyzer from that schema' },
      { id: 'c4', text: 'Submit a file to the analyze operation' },
      { id: 'c5', text: 'Read the structured result and its confidence scores' },
    ],
    explanation:
      'The schema is the heart of it: you declare the fields you want and describe each in natural language, and the service fills them. No prompt engineering, and no labelled training set required - labelled examples are an optional way to improve accuracy later.',
    reference: {
      label: 'Create a custom analyzer with Content Understanding',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/tutorial/create-custom-analyzer',
    },
    tags: ['content-understanding', 'workflow', 'cram'],
  },
  {
    id: 'fe-009',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'When would you choose Azure Document Intelligence over Azure Content Understanding?',
    options: [
      {
        id: 'a',
        text: 'When you need specialist document OCR, layout, tables and selection marks',
        correct: true,
      },
      {
        id: 'b',
        text: 'When you need to process audio and video recordings alongside the documents',
        correct: false,
        why: 'Document Intelligence handles documents only. Multimodal breadth is Content Understanding\'s defining advantage.',
      },
      {
        id: 'c',
        text: 'When you want a confidence score for each extracted value',
        correct: false,
        why: 'Both provide confidence information.',
      },
      {
        id: 'd',
        text: 'Never - Document Intelligence has been retired',
        correct: false,
        why: 'It is current, and Microsoft explicitly points OCR scenarios towards it.',
      },
    ],
    explanation:
      'Document Intelligence is the specialist for documents: read (OCR), layout (tables, selection marks, reading order), prebuilt document models, and custom models. Content Understanding is the generalist across documents, images, audio and video with a schema you define. AI-901 emphasises Content Understanding, but the distinction is fair game.',
    reference: {
      label: 'What is Azure Document Intelligence?',
      url: 'https://learn.microsoft.com/azure/ai-services/document-intelligence/overview',
    },
    tags: ['content-understanding', 'document-intelligence', 'hard'],
  },
  {
    id: 'fe-010',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from images by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A retailer wants a one-paragraph description of each product photo to power search. Which prebuilt analyzer fits?',
    options: [
      { id: 'a', text: 'The image search analyzer, prebuilt-imageSearch', correct: true },
      {
        id: 'b',
        text: 'The audio search analyzer, prebuilt-audioSearch',
        correct: false,
        why: 'Wrong modality.',
      },
      {
        id: 'c',
        text: 'The invoice analyzer, prebuilt-invoice',
        correct: false,
        why: 'A domain-specific document analyzer, not applicable to product photography.',
      },
      {
        id: 'd',
        text: 'The video search analyzer, prebuilt-videoSearch',
        correct: false,
        why: 'Wrong modality - these are still images.',
      },
    ],
    explanation:
      'The RAG-oriented prebuilt analyzers (document, image, audio and video "search" variants) are tuned to produce content suitable for retrieval - for images that means a descriptive paragraph that indexes well.',
    reference: {
      label: 'Prebuilt analyzers in Azure Content Understanding',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/prebuilt-analyzers',
    },
    tags: ['content-understanding', 'image'],
  },
  {
    id: 'fe-011',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A pipeline receives a mixed stream of invoices, receipts and contracts in one folder, and each type needs a different set of fields.',
    prompt: 'What is the right way to handle this in Content Understanding?',
    options: [
      {
        id: 'a',
        text: 'Classify each file\'s document type first, then route it to that type\'s analyzer',
        correct: true,
      },
      {
        id: 'b',
        text: 'Build one giant schema that holds every field from all three document types',
        correct: false,
        why: 'Most fields would be empty on any given file, accuracy would suffer, and the output would be hard to consume.',
      },
      {
        id: 'c',
        text: 'Process everything with the receipt analyzer and ignore failures',
        correct: false,
        why: 'Silently discarding two thirds of the corpus is not a solution.',
      },
      {
        id: 'd',
        text: 'Ask a person to sort the folder by document type before anything is processed',
        correct: false,
        why: 'It works, but it defeats the automation the service exists to provide - and classification-then-routing is a supported feature.',
      },
    ],
    explanation:
      'Content Understanding supports classifying content types and routing to the correct analyzer, now unified in the Analyze API. Composed analyzers do this for common cases - the mortgage document analyzer, for instance, classifies and routes a wide range of documents automatically.',
    reference: {
      label: 'Content Understanding classification and segmentation',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/classifier',
    },
    tags: ['content-understanding', 'classification', 'routing'],
  },
  {
    id: 'fe-012',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Build a lightweight application with information extraction capabilities',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which sequence describes calling Content Understanding from an application?',
    options: [
      {
        id: 'a',
        text: 'Authenticate, call analyze with an analyzer id and the file, read the JSON',
        correct: true,
      },
      {
        id: 'b',
        text: 'Upload the file to a vector index, then query the index for fields',
        correct: false,
        why: 'That is a RAG pipeline, not extraction.',
      },
      {
        id: 'c',
        text: 'Train a model on your documents, wait for it to finish, then classify',
        correct: false,
        why: 'No training step is required - an analyzer is configured from a schema. Labelled examples can optionally improve a custom analyzer, but they are never a prerequisite.',
      },
      {
        id: 'd',
        text: 'Convert the document to speech, then transcribe the recording',
        correct: false,
        why: 'Nonsensical round trip.',
      },
    ],
    explanation:
      'The shape is consistent across all four modalities: pick an analyzer id (prebuilt or your custom one), submit the content, read back structured fields. A publicly reachable URL, such as a blob with a SAS token, is a common way to pass the file.',
    reference: {
      label: 'Quickstart: Content Understanding REST API',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/quickstart/use-rest-api',
    },
    tags: ['content-understanding', 'sdk'],
  },
  {
    id: 'fe-013',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'What does enabling segmentation on an analyzer do?',
    options: [
      {
        id: 'a',
        text: 'Splits a document or video into logical sections to process separately',
        correct: true,
      },
      {
        id: 'b',
        text: 'Produces pixel-level masks around each object in an image',
        correct: false,
        why: 'That is image segmentation in computer vision - same word, different concept. A classic distractor.',
      },
      {
        id: 'c',
        text: 'Splits the JSON result into a separate output file per page',
        correct: false,
        why: 'It structures the analysis, not the file delivery.',
      },
      {
        id: 'd',
        text: 'Encrypts each section of the document with its own key',
        correct: false,
        why: 'Nothing to do with security.',
      },
    ],
    explanation:
      'In Content Understanding, segmentation means breaking content into meaningful chunks - splitting a multi-document PDF by document type, or a video into scenes - so each section gets its own targeted extraction.',
    reference: {
      label: 'Content Understanding classification and segmentation',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/classifier',
    },
    tags: ['content-understanding', 'segmentation', 'hard', 'trap'],
  },
  {
    id: 'fe-014',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Build a lightweight application with information extraction capabilities',
    difficulty: 'medium',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two are genuine advantages of Content Understanding over prompting a general multimodal model for extraction? (Choose two.)',
    options: [
      { id: 'a', text: 'Output conforms to a schema you defined, rather than free-form prose', correct: true },
      { id: 'b', text: 'Per-field confidence scores support automated review thresholds', correct: true },
      {
        id: 'c',
        text: 'It is the only way to process PDF files on Azure',
        correct: false,
        why: 'Several services read PDFs.',
      },
      {
        id: 'd',
        text: 'It requires no Azure resource',
        correct: false,
        why: 'It runs on a Microsoft Foundry resource like any other Foundry Tool.',
      },
      {
        id: 'e',
        text: 'It can generate new images',
        correct: false,
        why: 'It analyses content; it does not generate media.',
      },
    ],
    explanation:
      'Schema conformance and confidence scores are what make extraction *operational*. A chat model can describe an invoice; Content Understanding gives you a typed record you can post into an ERP system with a review threshold.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
    },
    tags: ['content-understanding', 'multi-select'],
  },
  {
    id: 'fe-015',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'easy',
    kind: 'learn',
    type: 'multi',
    prompt: 'Which kinds of content can Content Understanding analyze? (Choose all that apply.)',
    options: [
      { id: 'a', text: 'Documents', correct: true },
      { id: 'b', text: 'Images', correct: true },
      { id: 'c', text: 'Audio', correct: true },
      { id: 'd', text: 'Video', correct: true },
      {
        id: 'e',
        text: 'Live rows in a SQL database',
        correct: false,
        why: 'Content Understanding analyzes files and media. Structured database rows are already structured - there is nothing to extract.',
      },
      {
        id: 'f',
        text: '3D CAD models',
        correct: false,
        why: 'Not a supported input. The four modalities are documents, images, audio and video.',
      },
    ],
    explanation:
      'All four media types. One service, one analyze pattern, four modalities - that unification is the reason AI-901 features it so heavily.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
    },
    tags: ['content-understanding', 'modalities', 'cram'],
  },
  {
    id: 'fe-016',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Build a lightweight application with information extraction capabilities',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'An operations team wants extracted invoice data to flow automatically into their ERP, with humans reviewing only doubtful cases.',
    prompt: 'Which design uses Content Understanding correctly?',
    options: [
      {
        id: 'a',
        text: 'Set a confidence threshold: auto-post values above it, send the rest for review',
        correct: true,
      },
      {
        id: 'b',
        text: 'Post everything automatically, then correct any errors after the fact',
        correct: false,
        why: 'Wastes the confidence signal the service provides and pushes errors downstream into financial records.',
      },
      {
        id: 'c',
        text: 'Have a person review every document, using the extraction only as a hint',
        correct: false,
        why: 'Safe but forfeits the straight-through processing that justifies the automation.',
      },
      {
        id: 'd',
        text: 'Retrain the analyzer after each document',
        correct: false,
        why: 'Analyzers are not trained per document; they are configured once.',
      },
    ],
    explanation:
      'Confidence-threshold routing is the intended pattern. It is also a quiet responsible AI answer: humans stay in the loop exactly where the system is least certain.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
    },
    tags: ['content-understanding', 'confidence', 'hard', 'cross-topic'],
  },
  {
    id: 'fe-017',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'What does content extraction do inside a Content Understanding analyzer?',
    options: [
      {
        id: 'a',
        text: 'Turns the raw file into text and layout - OCR, tables, transcripts and the like',
        correct: true,
      },
      {
        id: 'b',
        text: 'Assigns each document to one of the business categories you defined',
        correct: false,
        why: 'That is classification, a separate field generation method.',
      },
      {
        id: 'c',
        text: 'Writes the extracted results straight to your database or ERP system',
        correct: false,
        why: 'Persisting the output is your application\'s job.',
      },
      {
        id: 'd',
        text: 'Generates a one-paragraph summary of the whole document for the index',
        correct: false,
        why: 'That is field extraction using the Generate method.',
      },
    ],
    explanation:
      'Content extraction is the first stage: get everything readable out of the raw file. Field extraction is the second stage: map that into the schema you defined. Keeping the two stages straight makes the analyzer documentation much easier to read.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
    },
    tags: ['content-understanding', 'pipeline'],
  },
  {
    id: 'fe-018',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective:
      'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'Which pair of prebuilt Content Understanding analyzers works without any language model or embedding deployment?',
    options: [
      { id: 'a', text: '`prebuilt-read` and `prebuilt-layout`', correct: true },
      {
        id: 'b',
        text: '`prebuilt-invoice` and `prebuilt-receipt`',
        correct: false,
        why: 'Domain-specific analyzers fill their schemas with generative models, such as gpt-4.1 plus text-embedding-3-large.',
      },
      {
        id: 'c',
        text: '`prebuilt-documentSearch` and `prebuilt-videoSearch`',
        correct: false,
        why: 'The RAG analyzers write descriptions and summaries, so they need model deployments too.',
      },
      {
        id: 'd',
        text: 'Any custom analyzer built on `prebuilt-document`',
        correct: false,
        why: 'Custom analyzers fill fields with Extract, Classify or Generate, all of which run on a language model.',
      },
    ],
    explanation:
      'The content extraction analyzers - `prebuilt-read` for OCR and `prebuilt-layout` for layout, tables and figures - need no model at all. Everything that fills fields or writes descriptions runs on the Foundry model deployments you connect, set once per resource as defaults.',
    reference: {
      label: 'Prebuilt analyzers in Azure Content Understanding',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/prebuilt-analyzers',
    },
    tags: ['content-understanding', 'analyzers', 'currency'],
  },
];
