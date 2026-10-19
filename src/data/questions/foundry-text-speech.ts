import type { AuthoredQuestion } from '../types';

/**
 * Topic: Implement AI solutions for text and speech by using Foundry (~11%).
 */
export const foundryTextSpeechQuestions: AuthoredQuestion[] = [
  {
    id: 'ts-001',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A retailer receives 20,000 product reviews per week and wants an overall mood label per review plus the recurring themes across all of them.',
    prompt: 'Which combination of Azure Language features should the app call?',
    options: [
      { id: 'a', text: 'Sentiment analysis and key phrase extraction', correct: true },
      {
        id: 'b',
        text: 'Language detection and entity linking',
        correct: false,
        why: 'Language detection tells you what language a review is in; entity linking maps mentions to knowledge base entries. Neither gives mood or themes.',
      },
      {
        id: 'c',
        text: 'Summarization and PII detection',
        correct: false,
        why: 'Summarization condenses individual reviews rather than labelling mood, and PII detection is about sensitive data.',
      },
      {
        id: 'd',
        text: 'Custom text classification only',
        correct: false,
        why: 'It could work but requires labelling training data and training a model - unnecessary when prebuilt features already answer both questions.',
      },
    ],
    explanation:
      'Mood ⇒ sentiment analysis. Recurring themes ⇒ key phrase extraction. Both are prebuilt: no training data, one API call each.',
    reference: {
      label: 'Get started with text analysis in Azure - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-text-analysis-azure/',
    },
    tags: ['language', 'routing'],
  },
  {
    id: 'ts-002',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which service does the exam expect you to name for prebuilt text analysis in Foundry?',
    options: [
      { id: 'a', text: 'Azure Language in Foundry Tools', correct: true },
      {
        id: 'b',
        text: 'Azure Cognitive Services Text Analytics',
        correct: false,
        why: 'The old name. "Cognitive Services" became Azure AI services and is now presented as Foundry Tools.',
      },
      {
        id: 'c',
        text: 'Language Understanding (LUIS)',
        correct: false,
        why: 'LUIS is retired; its successor is conversational language understanding inside Azure Language.',
      },
      {
        id: 'd',
        text: 'Azure Machine Learning designer',
        correct: false,
        why: 'A classical ML tool, not a prebuilt NLP service - and largely out of scope for AI-901.',
      },
    ],
    explanation:
      'Current naming matters on this exam: Azure **Language** in Foundry Tools, Azure **Speech** in Foundry Tools, Azure **Vision** in Foundry Tools, Azure **Content Understanding** in Foundry Tools.',
    reference: {
      label: 'What is Azure Language in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/overview',
    },
    tags: ['language', 'naming', 'currency'],
  },
  {
    id: 'ts-003',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A team must decide between calling a prebuilt sentiment API and prompting a deployed generative model to classify sentiment.',
    prompt: 'Which consideration most favours the prebuilt API?',
    options: [
      {
        id: 'a',
        text: 'Predictable structured output at a lower cost per document, at very high volume',
        correct: true,
      },
      {
        id: 'b',
        text: 'It is the only option that can handle text in more than one language',
        correct: false,
        why: 'Both handle many languages.',
      },
      {
        id: 'c',
        text: 'It can also draft a personalised reply to each customer',
        correct: false,
        why: 'That is exactly what a generative model does and a prebuilt classifier does not.',
      },
      {
        id: 'd',
        text: 'It never needs an Azure resource, an endpoint or a key',
        correct: false,
        why: 'It does require a resource and endpoint.',
      },
    ],
    explanation:
      'Prebuilt features return a fixed, well-typed result at a low per-document cost - ideal for high-volume classification. Reach for a generative model when the task needs flexible reasoning or free-form output.',
    reference: {
      label: 'Get started with text analysis in Azure - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-text-analysis-azure/',
    },
    tags: ['language', 'prebuilt-vs-generative'],
  },
  {
    id: 'ts-004',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A Python app must transcribe a WAV file. Which pieces of configuration are required at minimum?',
    options: [
      {
        id: 'a',
        text: 'Credentials and region, an audio input configuration, and a recognizer',
        correct: true,
      },
      {
        id: 'b',
        text: 'A vector index and an embedding model to store the transcript for search',
        correct: false,
        why: 'Those belong to RAG, not speech.',
      },
      {
        id: 'c',
        text: 'A trained custom voice for the speaker in the recording',
        correct: false,
        why: 'Custom voice is for synthesis, and even then it is optional.',
      },
      {
        id: 'd',
        text: 'A Content Understanding analyzer schema for audio',
        correct: false,
        why: 'Analyzer schemas belong to Content Understanding.',
      },
    ],
    explanation:
      'Speech-to-text needs three things: how to authenticate (credential + region), where the audio comes from (file or microphone), and a recognizer to run. Text-to-speech mirrors it: credential + region, a voice, and an audio output target.',
    reference: {
      label: 'Speech to text quickstart',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/get-started-speech-to-text',
    },
    tags: ['speech', 'sdk'],
  },
  {
    id: 'ts-005',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: 'Respond to spoken prompts by using a deployed multimodal model',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A hands-free assistant for drivers must accept a spoken question and answer out loud, as quickly and naturally as possible, picking up on urgency in the speaker\'s voice.',
    prompt: 'Which architecture best meets this?',
    options: [
      {
        id: 'a',
        text: 'A deployed multimodal model that takes audio in and speaks its reply',
        correct: true,
      },
      {
        id: 'b',
        text: 'Speech to text, then a text model, then text to speech',
        correct: false,
        why: 'This works, but transcription discards tone and urgency, and three sequential hops add latency - both of which the scenario explicitly cares about.',
      },
      {
        id: 'c',
        text: 'Batch transcription of each question, followed by summarization',
        correct: false,
        why: 'Batch is asynchronous and offline - unusable for a live assistant.',
      },
      {
        id: 'd',
        text: 'A custom voice with SSML to make the replies sound natural',
        correct: false,
        why: 'That improves how the reply sounds but does nothing about understanding the spoken question.',
      },
    ],
    explanation:
      '"Respond to spoken prompts by using a deployed multimodal model" is a named exam objective. Prefer the native multimodal path when latency and acoustic nuance matter; the cascaded pipeline remains valid when you need control over each stage or a specific branded voice.',
    reference: {
      label: 'Agents in Microsoft Foundry: how voice-based agents work',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview#how-voice-based-agents-work',
    },
    tags: ['speech', 'multimodal', 'hard'],
  },
  {
    id: 'ts-006',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'learn',
    type: 'multi',
    prompt: 'Which two can SSML control? (Choose two.)',
    options: [
      { id: 'a', text: 'Speaking rate and pitch', correct: true },
      { id: 'b', text: 'The length of pauses between phrases', correct: true },
      {
        id: 'c',
        text: 'The accuracy of speech recognition',
        correct: false,
        why: 'SSML is a synthesis format. It never touches recognition.',
      },
      {
        id: 'd',
        text: 'The number of speakers detected in a recording',
        correct: false,
        why: 'That is speaker diarization, part of transcription.',
      },
      {
        id: 'e',
        text: 'Which language a piece of text is written in',
        correct: false,
        why: 'That is language detection.',
      },
    ],
    explanation:
      'SSML tags: `<voice>` picks the voice, `<prosody>` sets rate/pitch/volume, `<break>` inserts pauses, `<emphasis>` adds stress, `<phoneme>` fixes pronunciation.',
    reference: {
      label: 'Speech Synthesis Markup Language (SSML) overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/speech-synthesis-markup',
    },
    tags: ['speech', 'ssml', 'multi-select'],
  },
  {
    id: 'ts-007',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A global brand wants its assistant to speak with a unique, recognisable voice that is not available in the standard catalogue. What do they need?',
    options: [
      { id: 'a', text: 'A professional custom voice, trained on a voice talent\'s recordings', correct: true },
      {
        id: 'b',
        text: 'SSML with an unusual prosody setting on a standard voice',
        correct: false,
        why: 'SSML can bend an existing voice, but it cannot create a new voice identity.',
      },
      {
        id: 'c',
        text: 'A higher audio sample rate for the synthesized speech',
        correct: false,
        why: 'Audio fidelity, not voice identity.',
      },
      {
        id: 'd',
        text: 'A fine-tuned language model that writes in the brand\'s tone',
        correct: false,
        why: 'That changes what the assistant says, not how it sounds.',
      },
    ],
    explanation:
      'Standard voices cover more than 150 locales and are the default. A professional custom voice (once called custom neural voice) is the option when a distinct branded voice is required - and because synthetic voices can be misused, custom voice is Limited Access: you need an approved use case and the voice talent\'s recorded consent.',
    reference: {
      label: 'Custom voice overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/custom-neural-voice',
    },
    tags: ['speech', 'custom-voice'],
  },
  {
    id: 'ts-008',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A healthcare provider must pull medications, dosages and conditions out of unstructured clinical notes.',
    prompt: 'Which capability is purpose-built for this?',
    options: [
      { id: 'a', text: 'Text analytics for health', correct: true },
      {
        id: 'b',
        text: 'Prebuilt named entity recognition',
        correct: false,
        why: 'General NER recognises people, places, organisations and dates - not medications, dosages, or clinical relations and assertions.',
      },
      {
        id: 'c',
        text: 'Key phrase extraction',
        correct: false,
        why: 'It surfaces topics without typing them as clinical entities.',
      },
      {
        id: 'd',
        text: 'Sentiment analysis',
        correct: false,
        why: 'Irrelevant to extracting clinical facts.',
      },
    ],
    explanation:
      'Text analytics for health is a prebuilt Azure Language feature that extracts and labels medical entities, relations and assertions from clinical text. Domain-specific requirements usually have a domain-specific prebuilt answer.',
    reference: {
      label: 'What is Text analytics for health?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/text-analytics-for-health/overview',
    },
    tags: ['language', 'health', 'hard'],
  },
  {
    id: 'ts-009',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A conference needs live English captions of a talk delivered in Spanish. Which capability handles this in one step?',
    options: [
      { id: 'a', text: 'Speech translation', correct: true },
      {
        id: 'b',
        text: 'Speech to text only',
        correct: false,
        why: 'It would produce Spanish captions. A separate translation step would still be required.',
      },
      {
        id: 'c',
        text: 'Text to speech',
        correct: false,
        why: 'Wrong direction - no captions are produced.',
      },
      {
        id: 'd',
        text: 'Language detection',
        correct: false,
        why: 'It identifies the language but does not transcribe or translate.',
      },
    ],
    explanation:
      'Speech translation takes audio in one language and returns text (or synthesized speech) in another, in real time - the standard answer for live multilingual captioning or interpretation.',
    reference: {
      label: 'Speech translation overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/speech-translation',
    },
    tags: ['speech', 'translation'],
  },
  {
    id: 'ts-010',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'An app must route incoming messages into the company\'s own five support categories, which no prebuilt model knows about.',
    options: [
      { id: 'a', text: 'Custom text classification, trained on labelled examples', correct: true },
      {
        id: 'b',
        text: 'Prebuilt named entity recognition with a category filter',
        correct: false,
        why: 'NER extracts entities; it does not assign a document to one of your categories.',
      },
      {
        id: 'c',
        text: 'Key phrase extraction, which returns each message\'s topics',
        correct: false,
        why: 'It returns topics, leaving the routing decision unsolved.',
      },
      {
        id: 'd',
        text: 'Language detection, which returns an ISO language code',
        correct: false,
        why: 'Unrelated to category routing.',
      },
    ],
    explanation:
      'Categories specific to your business ⇒ custom text classification (single-label or multi-label), which requires labelled training data. A generative model with a well-written few-shot prompt is a legitimate alternative when you have no labelled data.',
    reference: {
      label: 'What is custom text classification?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/custom-text-classification/overview',
    },
    tags: ['language', 'custom-classification'],
  },
  {
    id: 'ts-011',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: 'Identify features and capabilities of speech recognition and speech synthesis',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'What is a phoneme?',
    options: [
      {
        id: 'a',
        text: 'The smallest unit of sound that distinguishes words',
        correct: true,
      },
      {
        id: 'b',
        text: 'A single written character, such as a letter',
        correct: false,
        why: 'That is a grapheme. Converting graphemes to phonemes is a step in speech synthesis.',
      },
      {
        id: 'c',
        text: 'One digital sample of an audio waveform',
        correct: false,
        why: 'A sample is one amplitude measurement taken during digitisation.',
      },
      {
        id: 'd',
        text: 'A synthesized voice model for one language',
        correct: false,
        why: 'That is a neural voice.',
      },
    ],
    explanation:
      '"Cat" is three phonemes: /k/ /æ/ /t/. Recognition maps acoustic features to phonemes and then to words; synthesis goes the other way, grapheme to phoneme to waveform.',
    reference: {
      label: 'Pronunciation with SSML',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation',
    },
    tags: ['speech', 'definition'],
  },
  {
    id: 'ts-012',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'hard',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Requirement',
    rightLabel: 'Azure Language feature',
    prompt: 'Match each requirement to the right Azure Language feature.',
    pairs: [
      { id: 'l1', left: 'Mask national ID numbers before storing a transcript', right: 'PII detection' },
      { id: 'l2', left: 'Understand a user\'s intent and slots in a chat utterance', right: 'Conversational language understanding' },
      { id: 'l3', left: 'Answer FAQs from a curated question-and-answer source', right: 'Question answering' },
      { id: 'l4', left: 'Link "Mars" in a document to the correct encyclopedia entry', right: 'Entity linking' },
      { id: 'l5', left: 'Condense a long call into notes using new wording', right: 'Abstractive summarization' },
    ],
    explanation:
      'Azure Language bundles many distinct features. The exam tests whether you pick the narrowest one that satisfies the requirement rather than reaching for a generative model every time.',
    reference: {
      label: 'What is Azure Language in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/overview',
    },
    tags: ['language', 'matching', 'hard', 'cram'],
  },
];
