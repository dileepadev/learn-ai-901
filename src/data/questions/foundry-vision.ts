import type { AuthoredQuestion } from '../types';

/**
 * Topic: Implement AI solutions with computer vision and image-generation
 * capabilities by using Foundry (~12%).
 */
export const foundryVisionQuestions: AuthoredQuestion[] = [
  {
    id: 'fv-001',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Interpret visual input in prompts by using a deployed multimodal model',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'How do you send an image to a deployed multimodal model in a chat request?',
    options: [
      {
        id: 'a',
        text: 'An image content item (URL or base64) next to a text item in one user message',
        correct: true,
      },
      {
        id: 'b',
        text: 'Upload the image to the model deployment first, then reference it by its ID',
        correct: false,
        why: 'No pre-upload step is needed for a chat request; the image travels with the message.',
      },
      {
        id: 'c',
        text: 'Run OCR on the image and send only the extracted text',
        correct: false,
        why: 'That defeats the purpose. A multimodal model reasons about the image itself, including layout, charts and objects that OCR would miss.',
      },
      {
        id: 'd',
        text: 'Put the image in the system message, outside the user turn',
        correct: false,
        why: 'Visual input belongs in the user message with the question about it.',
      },
    ],
    explanation:
      'A multimodal user message carries a list of content items: text plus one or more images. That single request shape is what "interpret visual input in prompts" means in practice.',
    reference: {
      label: 'How to use vision-enabled chat models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision',
      quote:
        'The format is the same as the chat completions API for GPT-4o, except that the message content can be an array containing text and images (either a valid publicly accessible HTTP or HTTPS URL to an image, or a base-64-encoded image).',
    },
    tags: ['vision', 'multimodal', 'sdk'],
  },
  {
    id: 'fv-002',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A team is choosing an OpenAI model in Foundry to generate marketing images from text prompts. Which family should they look at?',
    options: [
      {
        id: 'a',
        text: 'The GPT-image series, such as gpt-image-2 or gpt-image-2.5-flare',
        correct: true,
      },
      {
        id: 'b',
        text: 'DALL·E 3, still the flagship OpenAI image model in Foundry',
        correct: false,
        why: 'dall-e-3 was retired on 4 March 2026, and existing deployments no longer work. Notes that answer "DALL·E" are out of date.',
      },
      {
        id: 'c',
        text: 'text-embedding-3-large, an OpenAI model in the catalog',
        correct: false,
        why: 'That is an embedding model - it produces vectors, not images.',
      },
      {
        id: 'd',
        text: 'gpt-4o-transcribe, another OpenAI model in the catalog',
        correct: false,
        why: 'That is a speech-to-text model. It turns audio into text and produces no images.',
      },
    ],
    explanation:
      'Image generation in Foundry is the GPT-image series - gpt-image-1, gpt-image-1-mini, gpt-image-1.5, gpt-image-2 and the gpt-image-2.5 models - which also support editing with a mask (inpainting). Sora 2 is the video model, in preview. DALL·E 3 was retired in March 2026.',
    reference: {
      label: 'How to use image generation models from OpenAI',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/dall-e',
      quote:
        'The DALL-E image generation model dall-e-3 was retired on March 4, 2026, and is no longer available for new deployments. Existing deployments are non-functional. Use a gpt-image- series model for image generation instead.',
    },
    tags: ['vision', 'image-generation', 'currency'],
  },
  {
    id: 'fv-003',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A marketing team needs a short generated video clip from a text description. Which Foundry model handles that?',
    options: [
      { id: 'a', text: 'Sora 2 (video generation, in preview)', correct: true },
      {
        id: 'b',
        text: 'gpt-image-2, generating a sequence of stills',
        correct: false,
        why: 'It produces still images, however high-resolution.',
      },
      {
        id: 'c',
        text: 'Azure Vision in Foundry Tools',
        correct: false,
        why: 'Vision analyses existing images; it does not generate anything.',
      },
      {
        id: 'd',
        text: 'Azure Content Understanding',
        correct: false,
        why: 'Content Understanding extracts structure *from* video. Opposite direction.',
      },
    ],
    explanation:
      'Sora creates video scenes from text instructions and is in public preview. Keep the direction straight: generation creates media, Content Understanding and Vision consume it.',
    reference: {
      label: 'Sora 2 video generation overview (preview)',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/video-generation',
      quote:
        'Sora 2 is an AI model from OpenAI that creates realistic and imaginative video scenes from text instructions and/or input images or video.',
    },
    tags: ['vision', 'video-generation', 'currency'],
  },
  {
    id: 'fv-004',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Build a lightweight application that includes vision capabilities',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'An insurer wants to process photos of damaged vehicles and produce, for each photo, a structured record: damaged parts, severity, and the visible licence plate.',
    prompt: 'What is the most appropriate Foundry capability?',
    options: [
      {
        id: 'a',
        text: 'Content Understanding with a custom image analyzer for those fields',
        correct: true,
      },
      {
        id: 'b',
        text: 'Azure Vision Image Analysis, using its tags and captions',
        correct: false,
        why: 'Generic tags and a caption do not produce your named fields - and Image Analysis 4.0 is deprecated, with a retirement date announced.',
      },
      {
        id: 'c',
        text: 'An image generation model that redraws the damaged vehicle',
        correct: false,
        why: 'Wrong direction: generation creates images, it does not analyse them.',
      },
      {
        id: 'd',
        text: 'Azure Speech batch transcription of the claim call',
        correct: false,
        why: 'Wrong modality entirely.',
      },
    ],
    explanation:
      'When the requirement is "structured fields I define, out of an image", that is Content Understanding: define a field schema, build a custom analyzer on the prebuilt image analyzer, and get typed JSON back with confidence scores.',
    reference: {
      label: 'Create a custom analyzer',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/tutorial/create-custom-analyzer',
      quote:
        'To create a custom analyzer, define a field schema that describes the structured data you want to extract. In the following example, you create an analyzer based on a prebuilt image analyzer for processing images of charts and graphs.',
    },
    tags: ['vision', 'content-understanding', 'hard', 'currency'],
  },
  {
    id: 'fv-005',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Identify features and capabilities of computer vision and image-generation models',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which statement about face capabilities is correct for the current exam?',
    options: [
      {
        id: 'a',
        text: 'Detection is broadly available; identification and verification are Limited Access',
        correct: true,
      },
      {
        id: 'b',
        text: 'All face capabilities, including emotion inference, are freely available',
        correct: false,
        why: 'Microsoft retired emotion and gender inference, and limited several other attributes, on responsible AI grounds.',
      },
      {
        id: 'c',
        text: 'Face detection is not offered on Azure at all any more',
        correct: false,
        why: 'Detection is offered; it is recognition that is gated.',
      },
      {
        id: 'd',
        text: 'Identification needs no approval as long as you own the images',
        correct: false,
        why: 'Limited Access applies regardless of image ownership.',
      },
    ],
    explanation:
      'Locating faces is routine. Deciding *who* a face belongs to is a Limited Access scenario requiring registration and an eligible use case - and emotion and gender inference were retired outright. This is a favourite responsible-AI-flavoured vision question.',
    reference: {
      label: 'Limited Access features of Face',
      url: 'https://learn.microsoft.com/azure/foundry/responsible-ai/computer-vision/limited-access-identity',
      quote:
        'Customers and partners who wish to use Limited Access features of the Face API, including Face identification and Face verification, are required to register for access by submitting a registration form.',
    },
    tags: ['vision', 'face', 'responsible-ai'],
  },
  {
    id: 'fv-006',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Build a lightweight application that includes vision capabilities',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'A team\'s existing app calls Azure Vision Image Analysis 4.0 for OCR. What should they know?',
    options: [
      {
        id: 'a',
        text: 'It is deprecated and retiring; move OCR to Document Intelligence',
        correct: true,
      },
      {
        id: 'b',
        text: 'It is the recommended service for all new OCR work',
        correct: false,
        why: 'It is deprecated. Building new work on it is exactly what the migration guidance advises against.',
      },
      {
        id: 'c',
        text: 'It has already been removed from Azure and no longer works',
        correct: false,
        why: 'It still functions; a retirement date has been announced, after which calls will fail.',
      },
      {
        id: 'd',
        text: 'It was renamed Content Understanding, with no other change',
        correct: false,
        why: 'Content Understanding is a separate, newer, generative multimodal service - not a rename.',
      },
    ],
    explanation:
      'For AI-901, the practical takeaway is where new work should go: multimodal models for visual reasoning, Content Understanding for structured extraction across modalities, Document Intelligence for document OCR and layout, and the Face service for face scenarios.',
    reference: {
      label: 'Migrate from Azure Vision Image Analysis',
      url: 'https://learn.microsoft.com/azure/ai-services/computer-vision/migration-options',
      quote:
        'The Azure Vision in Foundry Tools - Image Analysis API will be retired on September 25, 2028. After that date, calls to the service fail.',
    },
    tags: ['vision', 'currency', 'hard', 'trap'],
  },
  {
    id: 'fv-007',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'medium',
    kind: 'learn',
    prompt:
      'Which capability lets an image model modify part of an existing image while leaving the rest intact?',
    options: [
      { id: 'a', text: 'Inpainting, using a mask plus a prompt', correct: true },
      {
        id: 'b',
        text: 'Segmentation',
        correct: false,
        why: 'Segmentation identifies regions in an existing image; it does not generate new content into them.',
      },
      {
        id: 'c',
        text: 'Object detection',
        correct: false,
        why: 'Detection locates objects and generates nothing.',
      },
      {
        id: 'd',
        text: 'Increasing the resolution parameter',
        correct: false,
        why: 'That affects output size, not selective editing.',
      },
    ],
    explanation:
      'The GPT-image models support editing with a mask and a prompt (inpainting) as well as variations. Some also offer face preservation for consistent portraits.',
    reference: {
      label: 'How to use image generation models from OpenAI',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/dall-e',
      quote:
        'Supports inpainting and variations with mask + prompt',
    },
    tags: ['vision', 'image-generation', 'inpainting'],
  },
  {
    id: 'fv-008',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Microsoft embeds Content Credentials (C2PA) metadata in AI-generated images. Which responsible AI principle does this support?',
    options: [
      { id: 'a', text: 'Transparency', correct: true },
      {
        id: 'b',
        text: 'Fairness',
        correct: false,
        why: 'Provenance metadata does not equalise outcomes across groups.',
      },
      {
        id: 'c',
        text: 'Inclusiveness',
        correct: false,
        why: 'It has nothing to do with who can use the system.',
      },
      {
        id: 'd',
        text: 'Reliability and safety',
        correct: false,
        why: 'It does not change how the model behaves.',
      },
    ],
    explanation:
      'Content Credentials cryptographically mark an asset as AI-generated so downstream viewers can verify its origin. Provenance is a transparency control - a reliable cross-topic exam question.',
    reference: {
      label: 'Content provenance for Foundry models',
      url: 'https://learn.microsoft.com/azure/foundry/responsible-ai/content-safety/provenance-disclosure',
      quote:
        "Content provenance technologies can improve transparency around AI-generated content, but it's important to understand their limitations.",
    },
    tags: ['vision', 'c2pa', 'responsible-ai', 'cross-topic'],
  },
  {
    id: 'fv-009',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Interpret visual input in prompts by using a deployed multimodal model',
    difficulty: 'medium',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two tasks are well suited to a multimodal model given an image? (Choose two.)',
    options: [
      { id: 'a', text: 'Explaining what a diagram in a slide is communicating', correct: true },
      { id: 'b', text: 'Answering a free-text question about the contents of a photo', correct: true },
      {
        id: 'c',
        text: 'Returning exact pixel masks for every object',
        correct: false,
        why: 'Precise pixel-level segmentation is a specialised vision task, not what a chat model is designed to return.',
      },
      {
        id: 'd',
        text: 'Producing a guaranteed-format JSON record of invoice fields with confidence scores',
        correct: false,
        why: 'That is Content Understanding\'s job - schema-driven extraction with confidence scores.',
      },
      {
        id: 'e',
        text: 'Generating a new image from scratch',
        correct: false,
        why: 'That needs an image generation model, not a vision-understanding one.',
      },
    ],
    explanation:
      'Multimodal models excel at open-ended reasoning and explanation about visual input. When you need a strict schema with confidence scores, or precise geometry, use the purpose-built service instead.',
    reference: {
      label: 'How to use vision-enabled chat models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision',
      quote:
        'Vision-enabled chat models are large multimodal models (LMM) developed by OpenAI that can analyze images and provide textual responses to questions about them.',
    },
    tags: ['vision', 'multimodal', 'multi-select'],
  },
  {
    id: 'fv-010',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Identify features and capabilities of computer vision and image-generation models',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'What output does image classification produce?',
    options: [
      { id: 'a', text: 'One label, with a confidence score, for the whole image', correct: true },
      {
        id: 'b',
        text: 'A label and a bounding box for each object it finds',
        correct: false,
        why: 'That is object detection.',
      },
      {
        id: 'c',
        text: 'A pixel-level mask outlining each region of interest',
        correct: false,
        why: 'That is segmentation.',
      },
      {
        id: 'd',
        text: 'The text that is visible anywhere in the image',
        correct: false,
        why: 'That is OCR.',
      },
    ],
    explanation:
      'Classification answers "what is this a picture of?" - one label for the whole frame. If the question needs *where* or *how many*, classification is not enough.',
    reference: {
      label: 'Computer vision tasks and techniques - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/introduction-computer-vision/2-overview',
      quote:
        "One of the oldest computer vision solutions is a technique called image classification, in which a model that has been trained with a large number of images is used to predict a text label based on an image's contents.",
    },
    tags: ['vision', 'definition'],
  },
  {
    id: 'fv-011',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A team generating product imagery must keep costs down while iterating through hundreds of drafts, and the images are landscapes rather than portraits.',
    prompt: 'Which model choice is most appropriate?',
    options: [
      {
        id: 'a',
        text: 'gpt-image-1-mini, which is cheaper and faster for bulk drafts',
        correct: true,
      },
      {
        id: 'b',
        text: 'gpt-image-2 at high quality, for every draft in the series',
        correct: false,
        why: 'It is the realism-optimised model with higher latency and cost - sensible for final renders, wasteful for hundreds of drafts.',
      },
      {
        id: 'c',
        text: 'Sora 2, generating a short clip and sampling frames from it',
        correct: false,
        why: 'A video model, not an image model.',
      },
      {
        id: 'd',
        text: 'An embedding model, comparing drafts in vector space',
        correct: false,
        why: 'Produces vectors, not images.',
      },
    ],
    explanation:
      'The mini variant trades dedicated face preservation for lower cost and faster generation, which makes it a good fit for high-volume, non-portrait iteration. The pattern generalises: match model tier to the job rather than always reaching for the largest.',
    reference: {
      label: 'How to use image generation models from OpenAI',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/dall-e',
      quote:
        'Cost-efficient and faster for large-scale or iterative generation',
    },
    tags: ['vision', 'image-generation', 'model-selection', 'hard'],
  },
  {
    id: 'fv-012',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Build a lightweight application that includes vision capabilities',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Requirement',
    rightLabel: 'Right capability',
    prompt: 'Match each vision requirement to the capability you would reach for.',
    pairs: [
      { id: 'x1', left: 'Explain, in prose, what a chart in a screenshot shows', right: 'Multimodal model' },
      { id: 'x2', left: 'Create a new illustration from a written description', right: 'Image generation model' },
      { id: 'x3', left: 'Return named fields with confidence scores from a photo of a form', right: 'Content Understanding' },
      { id: 'x4', left: 'Extract text and layout from a scanned multi-page PDF', right: 'Document Intelligence' },
      { id: 'x5', left: 'Identify which registered employee a face belongs to', right: 'Face service (Limited Access)' },
    ],
    explanation:
      'Five different jobs, five different tools. Getting this routing right is most of the vision section.',
    reference: {
      label: 'Multimodal models for image analysis - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-vision-azure/2-vision-enabled-models',
      quote:
        'Multimodal models are AI models that can understand and work with more than one type of data at the same time, such as text, images, audio, or video. For instance, the multimodal model could describe an image in natural language or answer a question about a photo.',
    },
    tags: ['vision', 'matching', 'cram'],
  },
];
