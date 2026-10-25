import type { AuthoredQuestion } from '../types';

/**
 * Yes/No statement sets and sentence completions, the two formats Microsoft's
 * practice assessment uses alongside multiple choice. Each statement and each
 * blank earns its own point, as on the real exam.
 *
 * Every statement is checked against the Microsoft Learn page in its reference.
 */
export const examFormatQuestions: AuthoredQuestion[] = [
  /* ---------------- Responsible AI ---------------- */
  {
    id: 'yn-rai-01',
    type: 'yesno',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for accountability in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'A bank is preparing to launch an AI-based loan approval app. Which of these statements about responsible AI are true?',
    statements: [
      {
        id: 's1',
        text: 'Telling applicants that AI is used, and describing the data it was trained on, supports transparency.',
        yes: true,
        why: 'Transparency means making people aware of how a system works and what its limits are. Microsoft Learn uses this very example: a bank should disclose its use of AI and describe features of its training data.',
      },
      {
        id: 's2',
        text: 'Because the model makes each decision, the model is accountable for the outcome, not the bank.',
        yes: false,
        why: 'Accountability always rests with people. The organisations that build and distribute AI solutions are accountable for them, backed by a governance framework.',
      },
      {
        id: 's3',
        text: 'Testing whether the app approves similar applicants from different demographic groups at similar rates helps check it for fairness.',
        yes: true,
        why: 'Bias can creep in through the training data, so developers test AI systems for fairness: similar people should get similar outcomes.',
      },
    ],
    explanation:
      'Disclosure is **transparency**, testing across groups is **fairness**, and a model is never the accountable party: **accountability** stays with the people and organisations behind it.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        'Ultimately, the people and organizations that develop and distribute AI solutions are accountable for their actions.',
    },
    tags: ['principles', 'yes-no'],
  },
  {
    id: 'yn-rai-02',
    type: 'yesno',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for privacy and security in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'Which of these statements about the principles of responsible AI are true?',
    statements: [
      {
        id: 's1',
        text: 'Reliability and safety starts from the fact that AI is based on probabilistic models, so an AI system can be wrong and its risks must be mitigated.',
        yes: true,
        why: 'AI is not infallible. Reliability and safety asks you to plan for that and mitigate the risks.',
      },
      {
        id: 's2',
        text: 'Privacy and security covers only the data a model processes after it is deployed, not the data it was trained on.',
        yes: false,
        why: 'Training data can hold personal information too. Developers must keep it secure, and make sure the trained model cannot be used to reveal private details.',
      },
      {
        id: 's3',
        text: 'Adding text captions to a speech-based agent, so people with a hearing impairment can use it, is an example of inclusiveness.',
        yes: true,
        why: 'Inclusiveness means a solution should not exclude some users. Captions keep a voice agent usable for people who cannot hear it.',
      },
    ],
    explanation:
      'Privacy and security reaches back to **training data**, not just live data. Reliability and safety exists because models are probabilistic, and inclusiveness is about not shutting anyone out.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        "Models are trained using data, which may include personal information. AI developers have a responsibility to ensure that the training data is kept secure, and that the trained models themselves can't be used to reveal private personal or organizational details.",
    },
    tags: ['principles', 'yes-no'],
  },
  {
    id: 'dd-rai-01',
    type: 'dropdown',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for reliability and safety in an AI solution',
    difficulty: 'easy',
    kind: 'exam',
    prompt:
      'A warehouse robot uses computer vision to pick up parcels, and it only acts when its confidence in an identification is above a set threshold. This practice mainly supports the principle of ___.',
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'reliability and safety', correct: true },
          {
            id: 'b',
            text: 'transparency',
            correct: false,
            why: 'Transparency is about making people aware of how the system works. The threshold explains nothing to anyone; it prevents harm.',
          },
          {
            id: 'c',
            text: 'fairness',
            correct: false,
            why: 'Fairness is about bias and discriminatory outcomes for groups of people, not about a robot avoiding damage.',
          },
          {
            id: 'd',
            text: 'inclusiveness',
            correct: false,
            why: 'Inclusiveness is about making sure a solution does not exclude some users.',
          },
        ],
      },
    ],
    explanation:
      'Refusing to act on a low-confidence prediction is a classic **reliability and safety** control: the model can be wrong, so the system avoids unintentional harm when it is unsure.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        'An AI-powered robotic solution that uses computer vision to detect objects should avoid unintentional harm or damage. One way to accomplish this goal is to use probability values to determine "confidence" in object identification before interacting with physical objects, and avoid any action if the confidence level is below a specific threshold.',
    },
    tags: ['principles', 'dropdown'],
  },

  /* ---------------- Models and configuration ---------------- */
  {
    id: 'yn-mc-01',
    type: 'yesno',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'You are tuning a chat model deployed in Microsoft Foundry. Which of these statements about its parameters are true?',
    statements: [
      {
        id: 's1',
        text: 'Lowering the temperature makes responses more focused and deterministic.',
        yes: true,
        why: 'Temperature controls randomness. Low values such as 0.2 give focused, repeatable output; high values such as 0.8 give more varied output.',
      },
      {
        id: 's2',
        text: 'To get the effect you want, you should normally change temperature and top_p together.',
        yes: false,
        why: 'Both control randomness, in different ways. The guidance is to change one or the other, not both.',
      },
      {
        id: 's3',
        text: 'Setting a maximum number of tokens for the response caps how long the generated answer can be.',
        yes: true,
        why: 'The max tokens setting (max_tokens, or max_completion_tokens on newer models) is an upper bound on the tokens the model generates.',
      },
    ],
    explanation:
      'Temperature and top_p both shape randomness, so you adjust **one** of them. The token limit caps the length of the response.',
    reference: {
      label: 'Azure OpenAI in Microsoft Foundry Models REST API reference',
      url: 'https://learn.microsoft.com/azure/foundry/openai/reference',
      quote:
        'What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.',
    },
    tags: ['parameters', 'yes-no'],
  },
  {
    id: 'dd-mc-01',
    type: 'dropdown',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Describe how generative AI models work',
    difficulty: 'easy',
    kind: 'exam',
    prompt:
      'Language models do not work with whole words. They break their vocabulary into ___, which include words, parts of words and punctuation.',
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'tokens', correct: true },
          {
            id: 'b',
            text: 'embeddings',
            correct: false,
            why: 'Embeddings are the vectors a transformer later builds for each token to capture its meaning. They are not the units text is split into.',
          },
          {
            id: 'c',
            text: 'prompts',
            correct: false,
            why: 'A prompt is the input you send to a trained model to start a completion.',
          },
          {
            id: 'd',
            text: 'parameters',
            correct: false,
            why: 'Parameters are the learned weights inside the model, not pieces of text.',
          },
        ],
      },
    ],
    explanation:
      'Text becomes **tokens** first: words, sub-words such as "un", and punctuation, each with an integer id. Only then are tokens turned into vectors.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        'While we tend to think of language in terms of words, LLMs break down their vocabulary into tokens. Tokens include words, but also sub-words (like the "un" in "unbelievable" and "unlikely"), punctuation, and other commonly used sequences of characters.',
    },
    tags: ['tokens', 'dropdown'],
  },
  {
    id: 'dd-mc-02',
    type: 'dropdown',
    topic: 'model-components',
    moduleId: 'ml-and-transformers',
    objective: 'Describe how generative AI models work',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'Embeddings for tokens used in similar contexts point in similar directions, so you can measure how close two tokens are in meaning by calculating the ___ of their vectors.',
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'cosine similarity', correct: true },
          {
            id: 'b',
            text: 'token count',
            correct: false,
            why: 'A token count says how long a piece of text is, nothing about what two tokens mean.',
          },
          {
            id: 'c',
            text: 'positional encoding',
            correct: false,
            why: 'Positional encoding records where a token sits in a sequence. It is an input to the transformer, not a way to compare meanings.',
          },
          {
            id: 'd',
            text: 'temperature',
            correct: false,
            why: 'Temperature is a generation setting that controls randomness. It does not compare vectors.',
          },
        ],
      },
    ],
    explanation:
      'Embeddings are vectors, and similar meanings give similar directions. **Cosine similarity** measures how closely two directions match, which is also how vector search finds related content.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        'We can measure how close tokens are to one another semantically by calculating the cosine similarity of their vectors.',
    },
    tags: ['embeddings', 'dropdown'],
  },

  /* ---------------- AI workloads ---------------- */
  {
    id: 'yn-wl-01',
    type: 'yesno',
    topic: 'ai-workloads',
    moduleId: 'speech',
    objective: 'Identify features and capabilities of speech recognition and speech synthesis',
    difficulty: 'easy',
    kind: 'exam',
    prompt: 'A museum is adding voice features to its visitor guide app. Which of these statements are true?',
    statements: [
      {
        id: 's1',
        text: "Turning a visitor's spoken question into text is speech recognition.",
        yes: true,
        why: 'Speech recognition is AI "hearing" speech. It usually takes the form of speech to text.',
      },
      {
        id: 's2',
        text: 'Reading an exhibit description aloud to a visitor is speech synthesis.',
        yes: true,
        why: 'Speech synthesis vocalises words as spoken language, usually as text to speech.',
      },
      {
        id: 's3',
        text: "Speech synthesis is the capability that turns recordings of the guides' talks into written transcripts.",
        yes: false,
        why: 'Turning audio into text is speech recognition. Synthesis goes the other way, from text to audio.',
      },
    ],
    explanation:
      'Two directions, two names: audio to text is **speech recognition**, text to audio is **speech synthesis**.',
    reference: {
      label: 'Speech - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/4-speech',
      quote:
        'Speech recognition is the ability of AI to "hear" and interpret speech. Usually this capability takes the form of speech-to-text (where the audio signal for the speech is transcribed into text).',
    },
    tags: ['speech', 'yes-no'],
  },
  {
    id: 'dd-wl-01',
    type: 'dropdown',
    topic: 'ai-workloads',
    moduleId: 'foundations',
    objective: 'Identify features and capabilities of computer vision and image-generation models',
    difficulty: 'easy',
    kind: 'exam',
    prompt:
      'A self-checkout camera that finds every item on the counter and returns a rectangular bounding box around each one is using ___.',
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'object detection', correct: true },
          {
            id: 'b',
            text: 'image classification',
            correct: false,
            why: 'Image classification predicts one label for the main subject of an image. It does not find several items or say where they are.',
          },
          {
            id: 'c',
            text: 'semantic segmentation',
            correct: false,
            why: 'Semantic segmentation classifies individual pixels to give a precise outline of each object, not rectangular boxes.',
          },
          {
            id: 'd',
            text: 'optical character recognition (OCR)',
            correct: false,
            why: 'OCR reads text in an image. It does not locate products.',
          },
        ],
      },
    ],
    explanation:
      'Several items, each with a location given as a **bounding box**, is the signature of **object detection**. One label for the whole image would be classification; pixel-level outlines would be segmentation.',
    reference: {
      label: 'Computer vision tasks and techniques - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/introduction-computer-vision/2-overview',
      quote:
        'Object detection models examine multiple regions in an image to find individual objects and their locations. The resulting prediction from the model includes which objects were detected, and the specific regions of the image in which they appear - indicated by the coordinates of the rectangular bounding box.',
    },
    tags: ['vision', 'dropdown'],
  },
  {
    id: 'dd-wl-02',
    type: 'dropdown',
    topic: 'ai-workloads',
    moduleId: 'text-analysis',
    objective:
      'Describe common text analysis techniques, including keyword extraction, entity detection, sentiment analysis, and summarization',
    difficulty: 'easy',
    kind: 'exam',
    prompt:
      'A contact centre wants customer names and phone numbers in its call transcripts replaced with placeholders before analysts read them. The Azure Language in Foundry Tools feature for this is ___.',
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'PII detection', correct: true },
          {
            id: 'b',
            text: 'key phrase extraction',
            correct: false,
            why: 'Key phrase extraction pulls out the main talking points. It does not find or mask personal data.',
          },
          {
            id: 'c',
            text: 'sentiment analysis',
            correct: false,
            why: 'Sentiment analysis labels text as positive, neutral or negative and leaves personal data in place.',
          },
          {
            id: 'd',
            text: 'language detection',
            correct: false,
            why: 'Language detection only identifies which language the text is written in.',
          },
        ],
      },
    ],
    explanation:
      '**PII detection** identifies, classifies and redacts sensitive data such as names and phone numbers, in plain text, conversations and documents.',
    reference: {
      label: 'What is PII detection in Azure Language?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/personally-identifiable-information/overview',
      quote:
        'Personally Identifiable Information (PII) detection is an Azure Language core capability that helps you identify, classify, and redact sensitive data across text, conversations, and native documents.',
    },
    tags: ['text-analysis', 'pii', 'dropdown'],
  },

  /* ---------------- Generative AI apps and agents ---------------- */
  {
    id: 'yn-fg-01',
    type: 'yesno',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create effective system and user prompts for generative AI models',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'You are writing the prompts for a travel booking assistant built on a model deployed in Microsoft Foundry. Which of these statements are true?',
    statements: [
      {
        id: 's1',
        text: "The system message is where you define the assistant's role, its tone, and the boundaries of what it will answer.",
        yes: true,
        why: "Defining the role and boundaries, setting tone and style, and specifying output formats are exactly what a system message is for. It acts as the conversation's highest-level instructions.",
      },
      {
        id: 's2',
        text: 'A well-written system message guarantees that the model always follows its rules.',
        yes: false,
        why: 'A system message influences the model but does not guarantee compliance. Test it, and layer it with other mitigations such as content filtering and evaluation.',
      },
      {
        id: 's3',
        text: 'Adding example user and assistant exchanges to the messages, after the system message, is few-shot learning.',
        yes: true,
        why: 'Examples of the desired behaviour condition the model for the current request. In chat, they go in the messages after the system message.',
      },
    ],
    explanation:
      'The system message steers role, tone, boundaries and format; few-shot examples show the model what good looks like. Neither is a guarantee, so you still test and add other safeguards.',
    reference: {
      label: 'System message design',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/advanced-prompt-engineering',
      quote:
        'A system message influences the model, but it doesn’t guarantee compliance. You still need to test and iterate, and you should layer system messages with other mitigations (for example, filtering and evaluation).',
    },
    tags: ['prompts', 'system-message', 'yes-no'],
  },
  {
    id: 'yn-fg-02',
    type: 'yesno',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'Your team is choosing how to build its first agent with Foundry Agent Service. Which of these statements are true?',
    statements: [
      {
        id: 's1',
        text: 'A prompt agent is defined through configuration: instructions, a model and tools, with no application code or containers for you to manage.',
        yes: true,
        why: 'Prompt agents are defined entirely through configuration, and Foundry runs them for you.',
      },
      {
        id: 's2',
        text: 'A hosted agent is the option with the least to manage, because Foundry writes the agent code for you.',
        yes: false,
        why: 'Hosted agents give the most control: you bring your own code and framework, and Foundry runs it as a container. The least to manage is a prompt agent.',
      },
      {
        id: 's3',
        text: 'You can test a prompt agent in the playground in the Foundry portal before you call it from application code.',
        yes: true,
        why: 'The portal-first path is to create the agent in the portal, test it in the playground, then call it from your application.',
      },
    ],
    explanation:
      '**Prompt agents** are configuration only and the quickest start; **hosted agents** run your own code in a container Foundry manages. Either way, the portal playground is where you try an agent out.',
    reference: {
      label: 'Agents in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
      quote:
        'You define prompt agents entirely through configuration, including instructions, model selection, and tools. Author them in the Foundry portal for a quick start, or define them programmatically with the SDKs or REST API to integrate with your CI/CD workflows.',
    },
    tags: ['agents', 'yes-no'],
  },
  {
    id: 'dd-fg-01',
    type: 'dropdown',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create a lightweight client application for an agent',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      "An app keeps an agent's instructions, tools and model in its own source code and calls the Responses API on each request, so nothing is saved as an agent in Foundry. This is ___ agent.",
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'an ephemeral', correct: true },
          {
            id: 'b',
            text: 'a prompt',
            correct: false,
            why: 'A prompt agent is a persisted resource in Foundry, defined by configuration in the portal, SDK or REST API.',
          },
          {
            id: 'c',
            text: 'a hosted',
            correct: false,
            why: 'A hosted agent is your own code packaged as a container that Foundry runs with a managed endpoint.',
          },
          {
            id: 'd',
            text: 'a voice-based prompt',
            correct: false,
            why: 'A voice-based prompt agent is a managed agent for real-time spoken conversations, reached through Voice Live.',
          },
        ],
      },
    ],
    explanation:
      'With an **ephemeral agent** the definition lives in your application code and is assembled on every Responses API call. There is no agent resource to create, update or delete in Foundry.',
    reference: {
      label: 'Agents in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
      quote:
        "When you call the Responses API directly from your own code, you build an ephemeral agent: the agent's definition (instructions, tools, and model) lives in your application code instead of as a persisted resource in Foundry.",
    },
    tags: ['agents', 'responses-api', 'dropdown'],
  },
  {
    id: 'dd-fg-02',
    type: 'dropdown',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create a lightweight chat client application by using the Foundry SDK',
    difficulty: 'easy',
    kind: 'exam',
    prompt:
      "Retrieving relevant content from your company's own documents and adding it to the model input, so that responses are grounded in that content, is called ___.",
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'retrieval augmented generation (RAG)', correct: true },
          {
            id: 'b',
            text: 'fine-tuning',
            correct: false,
            why: "Fine-tuning changes a model's behaviour, style or task performance. It does not fetch fresh content at request time.",
          },
          {
            id: 'c',
            text: 'few-shot learning',
            correct: false,
            why: 'Few-shot learning adds examples of the desired behaviour to the prompt, not content retrieved from your data.',
          },
          {
            id: 'd',
            text: 'content filtering',
            correct: false,
            why: 'Content filtering screens prompts and responses for harmful content. It retrieves nothing.',
          },
        ],
      },
    ],
    explanation:
      '**RAG** retrieves relevant content, often from an index, adds it to the prompt as grounding data, and lets the model answer from it. Use it when answers depend on private or frequently changing data.',
    reference: {
      label: 'Retrieval augmented generation (RAG) and indexes',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/retrieval-augmented-generation',
      quote:
        'RAG addresses this by retrieving relevant content from your data and including it in the model input. The model can then generate responses grounded in the retrieved content.',
    },
    tags: ['rag', 'grounding', 'dropdown'],
  },

  /* ---------------- Text and speech ---------------- */
  {
    id: 'yn-ts-01',
    type: 'yesno',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Your app sends product reviews to the sentiment analysis feature of Azure Language in Foundry Tools. Which of these statements are true?',
    statements: [
      {
        id: 's1',
        text: 'It returns a sentiment label, such as positive, neutral or negative, for each review and for each sentence within it.',
        yes: true,
        why: 'Sentiment is evaluated at both the document level and the sentence level, and each gets the label with the highest confidence score.',
      },
      {
        id: 's2',
        text: 'It returns confidence scores between 0 and 1 for positive, neutral and negative sentiment.',
        yes: true,
        why: 'Each document and each sentence gets a confidence score between 0 and 1 for each of the three sentiments.',
      },
      {
        id: 's3',
        text: 'To find out which product feature a review praises or criticises, you must train a custom model.',
        yes: false,
        why: 'Opinion mining, a prebuilt part of sentiment analysis, links opinions to specific aspects such as product features. No training is needed.',
      },
    ],
    explanation:
      'Sentiment analysis gives **labels plus confidence scores** at document and sentence level, and its **opinion mining** option ties each opinion to the aspect it is about.',
    reference: {
      label: 'What are sentiment analysis and opinion mining?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/sentiment-opinion-mining/overview',
      quote:
        'The sentiment analysis feature assigns sentiment labels, such as "negative," "neutral," and "positive." The service determines these labels using the highest confidence score.',
    },
    tags: ['text-analysis', 'sentiment', 'yes-no'],
  },
  {
    id: 'yn-ts-02',
    type: 'yesno',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'You are adding speech to text to a meetings app with Azure Speech in Foundry Tools. Which of these statements are true?',
    statements: [
      {
        id: 's1',
        text: 'Real-time transcription can return intermediate results while a person is still speaking.',
        yes: true,
        why: 'Real-time transcription is built for live audio and gives instant transcription with intermediate results.',
      },
      {
        id: 's2',
        text: 'Batch transcription is the right choice for live captions during a webinar.',
        yes: false,
        why: 'Batch transcription processes large amounts of stored audio asynchronously. Live captions need real-time transcription.',
      },
      {
        id: 's3',
        text: 'Diarization separates the different speakers in a recording, so a transcript can show who said what.',
        yes: true,
        why: 'Diarization distinguishes and separates the speakers in an audio recording.',
      },
    ],
    explanation:
      'Match the mode to the audio: **real-time** for live speech, **fast** for a quick synchronous transcript of a file, and **batch** for large volumes of recordings. Diarization adds who said what.',
    reference: {
      label: 'What is speech to text?',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/speech-to-text',
      quote: 'Batch transcription is designed for transcribing large amounts of audio stored in files.',
    },
    tags: ['speech', 'transcription', 'yes-no'],
  },
  {
    id: 'dd-ts-01',
    type: 'dropdown',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'To make a synthesised voice speak more slowly and pronounce a product name in a particular way, you mark up the input text with ___.',
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'Speech Synthesis Markup Language (SSML)', correct: true },
          {
            id: 'b',
            text: 'a phrase list',
            correct: false,
            why: 'A phrase list helps speech recognition transcribe specific words. It does not change how synthesised speech sounds.',
          },
          {
            id: 'c',
            text: 'a custom speech model',
            correct: false,
            why: 'Custom speech improves recognition accuracy for speech to text, not the voice output of text to speech.',
          },
          {
            id: 'd',
            text: 'diarization',
            correct: false,
            why: 'Diarization separates speakers in a recording that is being transcribed.',
          },
        ],
      },
    ],
    explanation:
      '**SSML** is XML markup for text to speech: it controls pitch, pronunciation, speaking rate, volume, pauses and voice.',
    reference: {
      label: 'Speech Synthesis Markup Language (SSML) overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/speech-synthesis-markup',
      quote:
        'Speech Synthesis Markup Language (SSML) is an XML-based markup language that you can use to fine-tune your text to speech output attributes such as pitch, pronunciation, speaking rate, volume, and more.',
    },
    tags: ['speech', 'ssml', 'dropdown'],
  },

  /* ---------------- Vision ---------------- */
  {
    id: 'yn-fv-01',
    type: 'yesno',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Interpret visual input in prompts by using a deployed multimodal model',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'Your app sends photos of damaged parcels to a vision-enabled chat model deployed in Microsoft Foundry. Which of these statements are true?',
    statements: [
      {
        id: 's1',
        text: 'The model can analyse each photo and answer questions about it in text.',
        yes: true,
        why: 'Vision-enabled chat models are multimodal: they analyse images and give text answers to questions about them.',
      },
      {
        id: 's2',
        text: 'Setting the image detail level to low gives quicker responses and uses fewer tokens, but can make small text in a photo harder to read accurately.',
        yes: true,
        why: 'Low detail processes a 512 x 512 version of the image. It is faster and cheaper, which can cost accuracy on fine detail such as text.',
      },
      {
        id: 's3',
        text: 'A single chat request can include as many images as you like.',
        yes: false,
        why: 'There is a limit of 10 images per chat request.',
      },
    ],
    explanation:
      'A vision-enabled model takes images in the prompt and answers in **text**. The detail level trades accuracy for speed and tokens, and each request is limited to 10 images.',
    reference: {
      label: 'Use vision-enabled chat models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision',
      quote:
        'Vision-enabled chat models are large multimodal models (LMM) developed by OpenAI that can analyze images and provide textual responses to questions about them.',
    },
    tags: ['vision', 'multimodal', 'yes-no'],
  },
  {
    id: 'dd-fv-01',
    type: 'dropdown',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Build a lightweight application that includes vision capabilities',
    difficulty: 'easy',
    kind: 'exam',
    prompt:
      'A delivery app reads the printed and handwritten text on photographed shipping labels so nobody has to type it in. The technique it relies on is ___.',
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'optical character recognition (OCR)', correct: true },
          {
            id: 'b',
            text: 'object detection',
            correct: false,
            why: 'Object detection finds objects and draws bounding boxes around them, but does not read the text on them.',
          },
          {
            id: 'c',
            text: 'image classification',
            correct: false,
            why: 'Image classification predicts one label for the main subject of an image.',
          },
          {
            id: 'd',
            text: 'semantic segmentation',
            correct: false,
            why: 'Semantic segmentation labels each pixel by the object it belongs to. It does not turn text into characters.',
          },
        ],
      },
    ],
    explanation:
      '**OCR** extracts printed or handwritten text from images and documents as machine-readable characters, removing the need for manual data entry.',
    reference: {
      label: 'OCR - Optical Character Recognition',
      url: 'https://learn.microsoft.com/azure/ai-services/computer-vision/overview-ocr',
      quote:
        'Machine-learning-based OCR techniques allow you to extract printed or handwritten text from images such as posters, street signs, and product labels, as well as from documents like articles, reports, forms, and invoices.',
    },
    tags: ['vision', 'ocr', 'dropdown'],
  },

  /* ---------------- Information extraction ---------------- */
  {
    id: 'yn-fe-01',
    type: 'yesno',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'An insurer plans to process claim files with Azure Content Understanding in Foundry Tools. Which of these statements are true?',
    statements: [
      {
        id: 's1',
        text: 'Content Understanding can process documents, images, video and audio.',
        yes: true,
        why: 'It is multimodal: documents, images, video and audio all go through the same analyse process.',
      },
      {
        id: 's2',
        text: 'Extracted field values can come with confidence scores from 0 to 1, so high-confidence values can flow straight through while the rest go to a person.',
        yes: true,
        why: 'Confidence scores estimate the reliability of each value, which is what makes straight-through processing possible.',
      },
      {
        id: 's3',
        text: 'To get structured fields out, you must write and tune your own prompts for the generative model.',
        yes: false,
        why: 'You define a schema of the fields you want. Field extraction needs no complex prompt engineering.',
      },
    ],
    explanation:
      'Content Understanding takes **any modality**, extracts the fields your **schema** describes, and returns **confidence scores** so you only review what needs reviewing.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
      quote:
        "Content Understanding's field extraction makes it easier to generate structured output from unstructured content. Define a schema to extract, classify, or generate field values with no complex prompt engineering.",
    },
    tags: ['content-understanding', 'yes-no'],
  },
  {
    id: 'dd-fe-01',
    type: 'dropdown',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Build a lightweight application with information extraction capabilities by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'In Azure Content Understanding in Foundry Tools, ___ identifies the region of the source content each extracted value came from, so a reviewer can check it quickly.',
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'grounding', correct: true },
          {
            id: 'b',
            text: 'segmentation',
            correct: false,
            why: 'Segmentation divides a document or video into logical sections, such as by document type or by scene.',
          },
          {
            id: 'c',
            text: 'classification',
            correct: false,
            why: 'Classification sorts content into predefined categories, for example to route it to the right analyzer.',
          },
          {
            id: 'd',
            text: 'optical character recognition (OCR)',
            correct: false,
            why: 'OCR extracts the text itself. It does not trace a field value back to where it came from.',
          },
        ],
      },
    ],
    explanation:
      '**Grounding** points each field value back to its origin in the source, and **confidence scores** say how reliable it is. Together they keep human review short.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
      quote:
        'Identifies the specific regions in the content where each value was extracted or generated. Source grounding allows users in automation scenarios to quickly verify the correctness of field values by tracing them back to their origin in the source content.',
    },
    tags: ['content-understanding', 'grounding', 'dropdown'],
  },
];
