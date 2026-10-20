import type { AuthoredQuestion } from '../types';

/**
 * Topic: Identify AI workloads (~15% of the exam).
 *
 * This section is dominated by "company needs X - which capability?" routing
 * questions, plus the text-analysis technique vocabulary (key phrases vs
 * entities vs sentiment vs summarization) and the speech / vision / extraction
 * capability lists.
 */
export const aiWorkloadQuestions: AuthoredQuestion[] = [
  /* ---------------- Workload routing ---------------- */
  {
    id: 'wl-001',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify scenarios for common AI workloads',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'A logistics company wants to read scanned delivery notes - many of them photographed at an angle - and push the reference number, date and total into its ERP system. Which AI workload is this?',
    options: [
      { id: 'a', text: 'Information extraction', correct: true },
      {
        id: 'b',
        text: 'Generative AI',
        correct: false,
        why: 'The goal is structured data out of existing documents, not new content. Generative models power the extraction under the hood, but the workload is extraction.',
      },
      {
        id: 'c',
        text: 'Natural language processing',
        correct: false,
        why: 'NLP analyses text that you already have. Here the text must first be lifted off an image and mapped into named fields.',
      },
      {
        id: 'd',
        text: 'Agentic AI',
        correct: false,
        why: 'No multi-step goal is being pursued autonomously with tools.',
      },
    ],
    explanation:
      'Turning unstructured or semi-structured source material (scans, forms, photos, audio, video) into structured fields is the information extraction workload. In Foundry this is Azure Content Understanding.',
    reference: {
      label: 'Introduction to AI-powered information extraction concepts - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/introduction-information-extraction/',
      quote:
        'AI information extraction enables you to extract data values from documents, images, and other unstructured data sources.',
    },
    tags: ['routing', 'extraction'],
  },
  {
    id: 'wl-002',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify scenarios for common AI workloads',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A travel firm wants a system that, given "rebook me on the next flight and tell my hotel", looks up the booking, calls the airline API, changes the reservation, emails the hotel, and reports back.',
    prompt: 'Which workload best describes this?',
    options: [
      { id: 'a', text: 'Agentic AI', correct: true },
      {
        id: 'b',
        text: 'Generative AI',
        correct: false,
        why: 'Generative AI produces content. Here the system must plan a sequence of actions and actually call external systems - that is what makes it agentic.',
      },
      {
        id: 'c',
        text: 'Natural language processing',
        correct: false,
        why: 'NLP would understand the request, but would not carry out multi-step actions against APIs.',
      },
      {
        id: 'd',
        text: 'Information extraction',
        correct: false,
        why: 'Nothing is being converted from unstructured media into structured records.',
      },
    ],
    explanation:
      'An agent = a model for reasoning + instructions + tools. The tell-tale signs are a goal rather than a question, multiple steps, and calls out to external systems.',
    reference: {
      label: 'AI agents - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/7-agents',
      quote:
        'Agents are software applications built on generative AI that can reason over and generate natural language, automate tasks by using tools, and respond to contextual conditions to take appropriate action.',
    },
    tags: ['routing', 'agents'],
  },
  {
    id: 'wl-003',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify scenarios for common AI workloads',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Business need',
    rightLabel: 'AI workload',
    prompt: 'Match each business need to the AI workload that addresses it.',
    pairs: [
      { id: 'w1', left: 'Draft product descriptions from a set of bullet points', right: 'Generative AI' },
      { id: 'w2', left: 'Score 50,000 app reviews as positive, neutral or negative', right: 'Text analysis (NLP)' },
      { id: 'w3', left: 'Produce live captions during a company all-hands meeting', right: 'Speech' },
      { id: 'w4', left: 'Flag scratched components on a production line from camera images', right: 'Computer vision' },
      { id: 'w5', left: 'Pull vendor, date and total from a folder of PDF invoices', right: 'Information extraction' },
      { id: 'w6', left: 'Resolve a support ticket end to end by querying systems and issuing a refund', right: 'Agentic AI' },
    ],
    explanation:
      'Six workloads, six signatures. Generative = create content. Text analysis = understand text you already have. Speech = audio in or out. Vision = pixels in. Extraction = unstructured media becomes structured fields. Agentic = a goal, multiple steps, tools.',
    reference: {
      label: 'Generative AI and agents - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/2-generative-ai',
      quote:
        'Generative AI is a branch of AI that enables software applications to generate new content; often natural language dialogs, but also images, video, code, and other formats.',
    },
    tags: ['routing', 'matching', 'cram'],
  },
  {
    id: 'wl-004',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify scenarios for common AI workloads',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A media company has 4,000 hours of archived interviews. It wants a searchable index where each recording has a transcript, speaker labels, chapter breaks and a short summary per chapter.',
    prompt: 'Which capability handles the whole requirement in one service?',
    options: [
      {
        id: 'a',
        text: 'Azure Content Understanding, using a video or audio analyzer',
        correct: true,
      },
      {
        id: 'b',
        text: 'Azure Speech in Foundry Tools, using batch transcription',
        correct: false,
        why: 'Batch transcription produces the transcript and can diarize speakers, but it does not produce chapter segmentation or per-chapter summaries. You would have to bolt on a second service.',
      },
      {
        id: 'c',
        text: 'Azure Language in Foundry Tools, using summarization',
        correct: false,
        why: 'Language works on text. It cannot ingest audio, so you would need transcription first.',
      },
      {
        id: 'd',
        text: 'Azure Vision in Foundry Tools',
        correct: false,
        why: 'Vision analyses images; it has no audio capability.',
      },
    ],
    explanation:
      'Content Understanding is the multimodal extraction service: one API across documents, images, audio and video. Its audio and video analyzers transcribe, label speakers, segment content and generate summaries in a single analyze call, returning structured output.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
      quote:
        'It uses generative AI to process and ingest many types of content, including documents, images, videos, and audio, into a user-defined output format.',
    },
    tags: ['routing', 'content-understanding', 'hard'],
  },
  {
    id: 'wl-005',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify scenarios for common AI workloads',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which scenario is best solved by a *generative* model rather than a classic text-analysis feature?',
    options: [
      {
        id: 'a',
        text: 'Write a personalised apology for a late order, in the customer\'s language and brand tone',
        correct: true,
      },
      {
        id: 'b',
        text: 'Return the list of main topics mentioned across a batch of support tickets',
        correct: false,
        why: 'That is key phrase extraction - a prebuilt text-analysis feature, cheaper and more predictable than a generative call.',
      },
      {
        id: 'c',
        text: 'Detect whether each product review is positive, neutral or negative',
        correct: false,
        why: 'That is sentiment analysis.',
      },
      {
        id: 'd',
        text: 'Find every credit card number in a chat transcript and mask it before storage',
        correct: false,
        why: 'That is PII detection and redaction.',
      },
    ],
    explanation:
      'Generative AI is the right answer when the output is *new content* whose exact wording is not present in the input. When the task is labelling, extracting or scoring existing text, a prebuilt text-analysis feature is the better fit.',
    reference: {
      label: 'Understand text analysis in Foundry - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-text-analysis-azure/2-azure-language',
      quote:
        'While a large language model trained for general generative AI workloads can often do a great job of text analysis, sometimes a more specialized tool gets more predictable results.',
    },
    tags: ['routing', 'generative-vs-nlp', 'trap'],
  },

  /* ---------------- Text analysis techniques ---------------- */
  {
    id: 'wl-010',
    topic: 'ai-workloads',
    moduleId: 'text-analysis',
    objective: 'Describe common text analysis techniques',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'Which technique returns "Seattle data center", "cloud latency" and "system reliability" from a paragraph - an unordered list of the main talking points?',
    options: [
      { id: 'a', text: 'Key phrase extraction', correct: true },
      {
        id: 'b',
        text: 'Named entity recognition',
        correct: false,
        why: 'NER returns *typed* entities - Person, Location, Organization, DateTime, Quantity. "cloud latency" is a topic, not an entity of a known category.',
      },
      {
        id: 'c',
        text: 'Summarization',
        correct: false,
        why: 'Summarization returns sentences or a condensed narrative, not a list of phrases.',
      },
      {
        id: 'd',
        text: 'Entity linking',
        correct: false,
        why: 'Entity linking disambiguates a mention and links it to a knowledge base entry such as a Wikipedia article.',
      },
    ],
    explanation:
      'Key phrase extraction = "what is this text about?" as a bag of phrases. If the expected output is an untyped list of topics, it is key phrases.',
    reference: {
      label: 'What is key phrase extraction in Azure Language?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/key-phrase-extraction/overview',
      quote:
        'Use key phrase extraction to quickly identify the main concepts in text. For example, in the text "The food was delicious and the staff were wonderful.", key phrase extraction returns the main topics: "food" and "wonderful staff."',
    },
    tags: ['text-analysis', 'definition'],
  },
  {
    id: 'wl-011',
    topic: 'ai-workloads',
    moduleId: 'text-analysis',
    objective: 'Describe common text analysis techniques',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Desired output',
    rightLabel: 'Technique',
    prompt: 'Match each desired output to the text analysis technique that produces it.',
    pairs: [
      { id: 't1', left: 'A list of the main topics in a document', right: 'Key phrase extraction' },
      { id: 't2', left: '"Satya Nadella" tagged as Person, "Redmond" as Location', right: 'Named entity recognition' },
      { id: 't3', left: 'Positive / neutral / negative labels with confidence scores', right: 'Sentiment analysis' },
      { id: 't4', left: 'A short version of a long article', right: 'Summarization' },
      { id: 't5', left: 'The ISO code "fr" with a confidence score', right: 'Language detection' },
      { id: 't6', left: 'Credit card numbers located and masked', right: 'PII detection' },
    ],
    explanation:
      'These six prebuilt capabilities in Azure Language in Foundry Tools need no training data. The exam tests whether you can pick the one whose *output shape* matches the requirement.',
    reference: {
      label: 'What is Azure Language in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/overview',
      quote:
        'Key phrase extraction is a preconfigured feature that evaluates and returns the main concepts in unstructured text, and returns them as a list.',
    },
    tags: ['text-analysis', 'matching', 'cram'],
  },
  {
    id: 'wl-012',
    topic: 'ai-workloads',
    moduleId: 'text-analysis',
    objective: 'Describe common text analysis techniques',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A hotel chain wants to know, for each review, not just the overall mood but which *aspect* drove it: "the room was spotless but the wifi was unusable".',
    prompt: 'Which capability produces target-and-assessment pairs like this?',
    options: [
      { id: 'a', text: 'Opinion mining (aspect-based sentiment analysis)', correct: true },
      {
        id: 'b',
        text: 'Document-level sentiment analysis (one label per review)',
        correct: false,
        why: 'It would return a single mixed or neutral label for the whole review and lose the fact that cleanliness scored well and wifi scored badly.',
      },
      {
        id: 'c',
        text: 'Key phrase extraction',
        correct: false,
        why: 'It would return "room" and "wifi" but attach no sentiment to either.',
      },
      {
        id: 'd',
        text: 'Custom text classification',
        correct: false,
        why: 'That assigns whole documents to categories you defined and trained, which is more work and still not per-aspect.',
      },
    ],
    explanation:
      'Opinion mining drills into sentiment analysis to link each *target* (room, wifi) with its *assessment* (spotless, unusable) and a sentiment. Whenever a question says "which specific aspect", the answer is opinion mining.',
    reference: {
      label: 'What are sentiment analysis and opinion mining?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/sentiment-opinion-mining/overview',
      quote:
        'Opinion mining is a feature of sentiment analysis, also known as aspect-based sentiment analysis in Natural Language Processing (NLP). This feature provides more granular information about the opinions related to words (such as the attributes of products or services) in text.',
    },
    tags: ['text-analysis', 'opinion-mining', 'trap'],
  },
  {
    id: 'wl-013',
    topic: 'ai-workloads',
    moduleId: 'text-analysis',
    objective: 'Describe common text analysis techniques',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A legal team needs summaries of contracts where every sentence appears verbatim in the original document, for evidentiary reasons. Which approach fits?',
    options: [
      { id: 'a', text: 'Extractive summarization', correct: true },
      {
        id: 'b',
        text: 'Abstractive summarization',
        correct: false,
        why: 'Abstractive summarization *generates* new wording. That is usually more readable, but it breaks the verbatim requirement.',
      },
      {
        id: 'c',
        text: 'Key phrase extraction',
        correct: false,
        why: 'It returns phrases, not sentences, and would not read as a summary.',
      },
      {
        id: 'd',
        text: 'Entity linking',
        correct: false,
        why: 'Unrelated to summarising.',
      },
    ],
    explanation:
      'Extractive summarization selects the most important sentences *unchanged* from the source. Abstractive summarization writes new sentences that capture the meaning. Verbatim / legal / compliance ⇒ extractive; readability / meeting notes / call recaps ⇒ abstractive.',
    reference: {
      label: 'What is summarization in Azure Language?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/summarization/overview',
      quote:
        'Extractive summarization: Produces a summary by extracting salient sentences within the source text, together the positioning information of these sentences.',
    },
    tags: ['text-analysis', 'summarization', 'trap'],
  },
  {
    id: 'wl-014',
    topic: 'ai-workloads',
    moduleId: 'text-analysis',
    objective: 'Describe common text analysis techniques',
    difficulty: 'hard',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two capabilities of Azure Language in Foundry Tools require you to supply labelled training data? (Choose two.)',
    options: [
      { id: 'a', text: 'Custom named entity recognition', correct: true },
      { id: 'b', text: 'Conversational language understanding (CLU)', correct: true },
      {
        id: 'c',
        text: 'Sentiment analysis',
        correct: false,
        why: 'Prebuilt - call the API and get labels back with no training.',
      },
      {
        id: 'd',
        text: 'Key phrase extraction',
        correct: false,
        why: 'Prebuilt.',
      },
      {
        id: 'e',
        text: 'Language detection',
        correct: false,
        why: 'Prebuilt.',
      },
    ],
    explanation:
      'The customizable Language features are custom NER, custom text classification, conversational language understanding, question answering and orchestration workflow. Everything else - sentiment and opinion mining, key phrases, prebuilt NER and PII, language detection, summarization, text analytics for health - is prebuilt and needs no training data.',
    reference: {
      label: 'What is Azure Language in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/overview',
      quote:
        'Custom named entity recognition (CNER) enables you to build custom AI models to extract custom entity categories (labels for words or phrases), using unstructured text that you provide.',
    },
    tags: ['text-analysis', 'prebuilt-vs-custom', 'hard'],
  },

  /* ---------------- Speech ---------------- */
  {
    id: 'wl-020',
    topic: 'ai-workloads',
    moduleId: 'speech',
    objective: 'Identify features and capabilities of speech recognition and speech synthesis',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'Which pairing is correct?',
    options: [
      {
        id: 'a',
        text: 'Speech recognition converts audio to text; speech synthesis converts text to audio',
        correct: true,
      },
      {
        id: 'b',
        text: 'Speech recognition converts text to audio; speech synthesis converts audio to text',
        correct: false,
        why: 'Reversed. Recognition = recognising what was said (audio in). Synthesis = synthesising a voice (audio out).',
      },
      {
        id: 'c',
        text: 'Both convert audio to text; they differ only in latency',
        correct: false,
        why: 'They are opposite directions, not two speeds of the same thing.',
      },
      {
        id: 'd',
        text: 'Speech recognition identifies who is speaking; speech synthesis identifies the language',
        correct: false,
        why: 'Identifying who is speaking is speaker diarization; identifying the language is language identification. Both are separate features.',
      },
    ],
    explanation:
      'Speech-to-text (STT / ASR) = recognition. Text-to-speech (TTS) = synthesis. Every speech question starts by resolving which direction the audio flows.',
    reference: {
      label: 'What is Azure Speech in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/overview',
      quote:
        'With text to speech, you can convert input text into humanlike synthesized speech.',
    },
    tags: ['speech', 'definition'],
  },
  {
    id: 'wl-021',
    topic: 'ai-workloads',
    moduleId: 'speech',
    objective: 'Identify features and capabilities of speech recognition and speech synthesis',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A team needs to control pauses, speaking rate and pronunciation of a synthesized voice. What should they use?',
    options: [
      { id: 'a', text: 'Speech Synthesis Markup Language (SSML)', correct: true },
      {
        id: 'b',
        text: 'A custom voice trained on the brand\'s recordings',
        correct: false,
        why: 'A custom voice gives you a distinct branded voice identity. It does not, by itself, control prosody in a specific utterance.',
      },
      {
        id: 'c',
        text: 'A higher audio sample rate',
        correct: false,
        why: 'Sample rate affects audio fidelity, not phrasing or emphasis.',
      },
      {
        id: 'd',
        text: 'Batch transcription',
        correct: false,
        why: 'That is a speech-to-text feature.',
      },
    ],
    explanation:
      'SSML is an XML format for fine-grained control of synthesis: `<voice>` selects the neural voice, `<prosody>` sets rate, pitch and volume, `<break>` inserts pauses, and `<phoneme>` fixes pronunciation.',
    reference: {
      label: 'Speech Synthesis Markup Language (SSML) overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/speech-synthesis-markup',
      quote:
        'Speech Synthesis Markup Language (SSML) is an XML-based markup language that you can use to fine-tune your text to speech output attributes such as pitch, pronunciation, speaking rate, volume, and more. It gives you more control and flexibility than plain text input.',
    },
    tags: ['speech', 'ssml'],
  },
  {
    id: 'wl-022',
    topic: 'ai-workloads',
    moduleId: 'speech',
    objective: 'Identify features and capabilities of speech recognition and speech synthesis',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A contact centre must transcribe 200,000 archived call recordings stored in Azure Blob Storage. Results are needed within a day; nothing is live.',
    prompt: 'Which speech-to-text mode is appropriate?',
    options: [
      { id: 'a', text: 'Batch transcription', correct: true },
      {
        id: 'b',
        text: 'Real-time speech to text',
        correct: false,
        why: 'Real-time is for streaming audio as it happens - live captions, voice assistants. Running 200,000 files through it one stream at a time is the wrong tool.',
      },
      {
        id: 'c',
        text: 'Speech translation',
        correct: false,
        why: 'Translation is only needed if the output language differs from the spoken one.',
      },
      {
        id: 'd',
        text: 'Text to speech',
        correct: false,
        why: 'Wrong direction.',
      },
    ],
    explanation:
      'Batch transcription processes large volumes of pre-recorded audio asynchronously from storage. Real-time is for interactive or streaming scenarios. "Archived files in storage" ⇒ batch; "live captions / assistant" ⇒ real-time.',
    reference: {
      label: 'Batch transcription overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/batch-transcription',
      quote:
        'Use batch transcription to transcribe a large amount of audio data in storage.',
    },
    tags: ['speech', 'batch-vs-realtime'],
  },
  {
    id: 'wl-023',
    topic: 'ai-workloads',
    moduleId: 'speech',
    objective: 'Identify features and capabilities of speech recognition and speech synthesis',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'What advantage does a natively multimodal model that accepts audio directly have over a cascaded speech-to-text → language model → text-to-speech pipeline?',
    options: [
      {
        id: 'a',
        text: 'Lower latency, and tone and emphasis survive instead of being lost in transcription',
        correct: true,
      },
      {
        id: 'b',
        text: 'It removes the need for content safety guardrails on both the questions and the answers',
        correct: false,
        why: 'Guardrails are still required regardless of how audio reaches the model.',
      },
      {
        id: 'c',
        text: 'It runs entirely offline on the client device, with no network calls',
        correct: false,
        why: 'Deployed multimodal models are called over the network like any other deployment.',
      },
      {
        id: 'd',
        text: 'It guarantees perfect transcription accuracy for every accent',
        correct: false,
        why: 'No model guarantees perfect recognition.',
      },
    ],
    explanation:
      'A cascade throws away everything the waveform carried that is not words - tone, hesitation, emphasis - and pays the latency of three sequential services. A native multimodal model reasons over the audio itself, so it can respond to *how* something was said and reply fast enough for natural turn-taking.',
    reference: {
      label: 'Agents in Microsoft Foundry: how voice-based agents work',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview#how-voice-based-agents-work',
      quote:
        'This architecture is optimized for natural, low-latency conversation. The realtime model handles spoken input and output directly.',
    },
    tags: ['speech', 'multimodal', 'hard'],
  },

  /* ---------------- Vision ---------------- */
  {
    id: 'wl-030',
    topic: 'ai-workloads',
    moduleId: 'vision',
    objective: 'Identify features and capabilities of computer vision and image-generation models',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Required output',
    rightLabel: 'Computer vision task',
    prompt: 'Match each required output to the computer vision task that produces it.',
    pairs: [
      { id: 'v1', left: 'One label for the whole image: "defective" or "pass"', right: 'Image classification' },
      { id: 'v2', left: 'Labels plus bounding-box coordinates for every item on a shelf', right: 'Object detection' },
      { id: 'v3', left: 'A pixel-accurate mask outlining a tumour in an MRI scan', right: 'Image segmentation' },
      { id: 'v4', left: 'The handwritten text written on a delivery note', right: 'Optical character recognition' },
      { id: 'v5', left: 'The location of each human face in a photo', right: 'Face detection' },
    ],
    explanation:
      'The distinction is entirely about output shape. One label for the image = classification. Labels + boxes = detection. Per-pixel mask = segmentation. Characters = OCR. Face rectangles = face detection.',
    reference: {
      label: 'Computer vision tasks and techniques - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/introduction-computer-vision/2-overview',
      quote:
        "One of the oldest computer vision solutions is a technique called image classification, in which a model that has been trained with a large number of images is used to predict a text label based on an image's contents.",
    },
    tags: ['vision', 'matching', 'cram'],
  },
  {
    id: 'wl-031',
    topic: 'ai-workloads',
    moduleId: 'vision',
    objective: 'Identify features and capabilities of computer vision and image-generation models',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A supermarket wants to count how many of each product are on a shelf, from a single photo.',
    prompt: 'Which task is required?',
    options: [
      { id: 'a', text: 'Object detection', correct: true },
      {
        id: 'b',
        text: 'Image classification',
        correct: false,
        why: 'Classification gives one label for the whole photo. It cannot tell you there are seven of one product and three of another.',
      },
      {
        id: 'c',
        text: 'Optical character recognition',
        correct: false,
        why: 'OCR reads text such as price labels; it does not count physical items.',
      },
      {
        id: 'd',
        text: 'Image segmentation',
        correct: false,
        why: 'Segmentation would work but is overkill - you need instances and counts, not exact pixel boundaries.',
      },
    ],
    explanation:
      'Counting multiple instances requires each instance to be located separately, which is object detection: a class label plus a bounding box per detected item.',
    reference: {
      label: 'Computer vision tasks and techniques - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/introduction-computer-vision/2-overview',
      quote:
        'Object detection models examine multiple regions in an image to find individual objects and their locations. The resulting prediction from the model includes which objects were detected, and the specific regions of the image in which they appear - indicated by the coordinates of the rectangular bounding box.',
    },
    tags: ['vision', 'routing'],
  },
  {
    id: 'wl-032',
    topic: 'ai-workloads',
    moduleId: 'vision',
    objective: 'Identify features and capabilities of computer vision and image-generation models',
    difficulty: 'medium',
    kind: 'learn',
    prompt: 'How do diffusion-based text-to-image models, such as the MAI image models in Microsoft Foundry, generate an image?',
    options: [
      {
        id: 'a',
        text: 'They start from random noise and refine it step by step into an image, guided by the prompt',
        correct: true,
      },
      {
        id: 'b',
        text: 'They search a large library of licensed stock images and return the one that best matches the prompt',
        correct: false,
        why: 'Nothing is retrieved. The image is synthesised, which is why a prompt for an implausible scene still produces an image.',
      },
      {
        id: 'c',
        text: 'They build a 3D model of the scene described in the prompt and render it from one angle',
        correct: false,
        why: 'No 3D scene is constructed; generation happens in the image/latent space.',
      },
      {
        id: 'd',
        text: 'They apply filters to an uploaded reference photo',
        correct: false,
        why: 'That describes image editing, which some models also support - but generation from a text prompt alone needs no input image.',
      },
    ],
    explanation:
      'Diffusion models are trained by progressively adding noise to images, then learning to reverse it. At generation time they start from noise and refine it step by step, conditioned on the prompt. Not every image model works this way, so the exam asks about the approach, not a vendor.',
    reference: {
      label: 'Deploy and use MAI image models in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/foundry-models/how-to/use-foundry-models-mai-image',
      quote:
        'MAI image models are diffusion-based generative models designed for both high-quality text-to-image generation and precise, controllable image-to-image editing. Each model uses a diffusion-based approach to progressively refine images from a natural language prompt, enabling strong alignment between the input text and the generated output.',
    },
    tags: ['vision', 'image-generation', 'diffusion'],
  },
  {
    id: 'wl-033',
    topic: 'ai-workloads',
    moduleId: 'vision',
    objective: 'Identify features and capabilities of computer vision and image-generation models',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'Which task requires a *multimodal* model rather than a classic computer vision service?',
    options: [
      {
        id: 'a',
        text: 'Reading a sales chart in a slide deck and explaining, in prose, why Q3 underperformed',
        correct: true,
      },
      {
        id: 'b',
        text: 'Returning bounding boxes and labels for every car visible in a car park photo',
        correct: false,
        why: 'Object detection is a classic vision task with a structured output.',
      },
      {
        id: 'c',
        text: 'Extracting the printed text from a scanned page',
        correct: false,
        why: 'OCR is a classic vision / document task.',
      },
      {
        id: 'd',
        text: 'Detecting whether an uploaded image contains adult or racy content before publishing it',
        correct: false,
        why: 'Content moderation classification is a classic vision capability.',
      },
    ],
    explanation:
      'Classic vision services return structured findings - labels, boxes, text, scores. A multimodal model *reasons* about what it sees and answers in natural language, which is what "interpret visual input in prompts" means on the exam.',
    reference: {
      label: 'How to use vision-enabled chat models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision',
      quote:
        'Vision-enabled chat models are large multimodal models (LMM) developed by OpenAI that can analyze images and provide textual responses to questions about them. They incorporate both natural language processing and visual understanding.',
    },
    tags: ['vision', 'multimodal', 'hard'],
  },

  /* ---------------- Extraction techniques ---------------- */
  {
    id: 'wl-040',
    topic: 'ai-workloads',
    moduleId: 'information-extraction',
    objective: 'Identify techniques to extract information from text, images, audio, and videos',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Source material',
    rightLabel: 'Extraction output you would expect',
    prompt: 'Match each source to what an extraction analyzer would typically return for it.',
    pairs: [
      { id: 'e1', left: 'A scanned invoice', right: 'Key–value fields: vendor, date, line items, total' },
      { id: 'e2', left: 'A photo of collision damage', right: 'A structured description of the damaged parts and severity' },
      { id: 'e3', left: 'A recorded support call', right: 'A transcript with speaker labels and a summary' },
      { id: 'e4', left: 'A product demo video', right: 'Segments with timestamps, transcript and per-segment descriptions' },
    ],
    explanation:
      'Content Understanding applies the same analyze-and-return-structured-output model across all four modalities. Knowing the expected output shape per modality is the fastest way to answer these.',
    reference: {
      label: 'Field extraction and mapping - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/introduction-information-extraction/4-form-extraction',
      quote:
        'In many cases, data fields in a document or form are discrete values that can be mapped to keys - for example, the vendor name, date, and total amount in a receipt or invoice.',
    },
    tags: ['extraction', 'matching', 'cram'],
  },
  {
    id: 'wl-041',
    topic: 'ai-workloads',
    moduleId: 'information-extraction',
    objective: 'Identify techniques to extract information from text, images, audio, and videos',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which statement best distinguishes information extraction from text analysis?',
    options: [
      {
        id: 'a',
        text: 'Extraction fills a schema you define from any modality; text analysis interprets existing text',
        correct: true,
      },
      {
        id: 'b',
        text: 'Extraction only works on PDF files, whereas text analysis works on any kind of text',
        correct: false,
        why: 'Extraction spans documents, images, audio and video - the modality breadth is one of its defining features.',
      },
      {
        id: 'c',
        text: 'Extraction always requires training a custom model; text analysis never needs training',
        correct: false,
        why: 'Both have prebuilt options. Content Understanding ships prebuilt analyzers; Language ships prebuilt features.',
      },
      {
        id: 'd',
        text: 'They are the same workload, sold under two different product names',
        correct: false,
        why: 'The study guide lists them as separate workloads with separate objectives.',
      },
    ],
    explanation:
      'The defining question for extraction is "what schema do I want out?" - you declare fields and the service fills them. Text analysis answers fixed questions (sentiment, key phrases, entities) about text that is already text.',
    reference: {
      label: 'Field extraction and mapping - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/introduction-information-extraction/4-form-extraction',
      quote:
        'Prompt-based extraction in which you provide the LLM with document text and a schema definition, and it matches the text to the fields in the schema.',
    },
    tags: ['extraction', 'routing'],
  },
  {
    id: 'wl-042',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify scenarios for common AI workloads',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A bank wants an internal assistant that answers policy questions using its own 12,000 internal documents, and cites the source paragraph for each answer.',
    prompt: 'Which approach fits, and why?',
    options: [
      {
        id: 'a',
        text: 'RAG, because answers must come from private, changing content and cite a source',
        correct: true,
      },
      {
        id: 'b',
        text: 'Fine-tune a model on the 12,000 documents so the knowledge lives in its weights',
        correct: false,
        why: 'Fine-tuning changes *behaviour, style and task performance*, not factual currency. It also cannot produce citations, and every document update would need retraining.',
      },
      {
        id: 'c',
        text: 'Raise the model\'s max tokens so all 12,000 documents fit into a single prompt',
        correct: false,
        why: 'No context window holds 12,000 documents, and max tokens limits the *output* length, not the input.',
      },
      {
        id: 'd',
        text: 'Use a small language model, because it is cheaper to run at this volume',
        correct: false,
        why: 'Model size is unrelated to whether the assistant has access to private content.',
      },
    ],
    explanation:
      'RAG retrieves relevant passages at query time and passes them to the model as grounding data, so answers reflect current private content and can carry citations. Microsoft\'s guidance is explicit: RAG for private or changing knowledge; fine-tuning to change behaviour or style.',
    reference: {
      label: 'RAG and indexes in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/retrieval-augmented-generation',
      quote:
        'Use RAG when you need answers grounded in private or frequently changing data.',
    },
    tags: ['routing', 'rag-vs-finetune', 'trap'],
  },
  {
    id: 'wl-043',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify scenarios for common AI workloads',
    difficulty: 'easy',
    kind: 'learn',
    type: 'multi',
    prompt: 'Which two are examples of the computer vision workload? (Choose two.)',
    options: [
      { id: 'a', text: 'Detecting cracked welds in photographs from a production line', correct: true },
      { id: 'b', text: 'Reading the licence plate in a car park camera frame', correct: true },
      {
        id: 'c',
        text: 'Classifying support emails by urgency',
        correct: false,
        why: 'Text in, text out - that is text analysis.',
      },
      {
        id: 'd',
        text: 'Generating live subtitles for a webinar',
        correct: false,
        why: 'Audio in - that is speech recognition.',
      },
      {
        id: 'e',
        text: 'Summarising a 40-page report',
        correct: false,
        why: 'Text analysis / generative AI.',
      },
    ],
    explanation:
      'Computer vision means the *input* is pixels. If the input is text it is NLP, if it is a waveform it is speech.',
    reference: {
      label: 'Computer vision tasks and techniques - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/introduction-computer-vision/2-overview',
      quote:
        'The term "computer vision" refers to a range of tasks and techniques in which AI software processes visual input; typically from images, videos, or live camera streams.',
    },
    tags: ['vision', 'routing'],
  },
  {
    id: 'wl-044',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify scenarios for common AI workloads',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A field-service company wants technicians to speak a fault description into a phone. The system should reply out loud with the likely cause and, if a part is needed, place the order in the parts system.',
    prompt: 'Which combination of workloads does this require?',
    options: [
      {
        id: 'a',
        text: 'Speech (or a multimodal audio model) plus agentic AI for the ordering',
        correct: true,
      },
      {
        id: 'b',
        text: 'Computer vision plus information extraction from the technician\'s photos',
        correct: false,
        why: 'Nothing visual is involved and no document is being converted to structured data.',
      },
      {
        id: 'c',
        text: 'Text analysis only, run over a transcript of the call',
        correct: false,
        why: 'Text analysis cannot take audio in, speak back, or place an order.',
      },
      {
        id: 'd',
        text: 'Generative AI only, with a model that writes the spoken reply',
        correct: false,
        why: 'A generative model alone can produce a spoken-sounding answer but cannot take an action in an external system - that requires tools, which makes it an agent.',
      },
    ],
    explanation:
      'Two signals to read: audio in and out ⇒ speech or a multimodal model that accepts audio; taking a real action in another system ⇒ agentic AI with a tool. Multi-workload scenarios are common in the case-style questions.',
    reference: {
      label: 'Speech - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/4-speech',
      quote:
        'Speech recognition is the ability of AI to "hear" and interpret speech. Usually this capability takes the form of speech-to-text (where the audio signal for the speech is transcribed into text).',
    },
    tags: ['routing', 'multi-workload', 'hard'],
  },
  {
    id: 'wl-045',
    topic: 'ai-workloads',
    moduleId: 'text-analysis',
    objective: 'Describe common text analysis techniques',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'A compliance team must find and mask national ID numbers, phone numbers and email addresses in chat transcripts. Which capability is designed for this?',
    options: [
      { id: 'a', text: 'PII detection and redaction', correct: true },
      {
        id: 'b',
        text: 'Key phrase extraction with a custom stop list',
        correct: false,
        why: 'It surfaces topics, not sensitive identifiers, and cannot redact.',
      },
      {
        id: 'c',
        text: 'Sentiment analysis',
        correct: false,
        why: 'Unrelated to identifying sensitive data.',
      },
      {
        id: 'd',
        text: 'Language detection',
        correct: false,
        why: 'It only reports which language the text is written in.',
      },
    ],
    explanation:
      'PII detection is a specialised form of entity recognition that identifies sensitive personal identifiers and can return a redacted copy of the text. It is the standard answer for any "mask sensitive data" scenario.',
    reference: {
      label: 'What is PII detection in Azure Language?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/personally-identifiable-information/overview',
      quote:
        'Personally Identifiable Information (PII) detection is an Azure Language core capability that helps you identify, classify, and redact sensitive data across text, conversations, and native documents.',
    },
    tags: ['text-analysis', 'pii'],
  },
];
