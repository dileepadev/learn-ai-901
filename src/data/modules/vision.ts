import type { Module } from '../types';

export const vision: Module = {
  id: 'vision',
  order: 11,
  title: 'Vision and image generation',
  summary:
    'The five classic vision tasks, multimodal visual reasoning, and the current image and video generation models.',
  topic: 'foundry-vision',
  alsoCovers: ['ai-workloads'],
  minutes: 19,
  priority: 'high',
  icon: '👁️',
  outcomes: [
    'Distinguish classification, detection, segmentation, OCR and face detection by their output',
    'Say when a multimodal model beats a classic vision service',
    'Name the current image and video generation models and what they do',
  ],
  quiz: ['wl-030', 'fv-002', 'fv-003', 'fv-006', 'fv-011', 'sc-wl-05', 'sc-fv-04', 'sc-fv-09'],
  sections: [
    {
      id: 'tasks',
      title: 'Five tasks, five output shapes',
      blocks: [
        {
          t: 'demo',
          name: 'vision-tasks',
          caption: 'Same photo, five tasks. Switch between them to see what each returns.',
        },
        {
          t: 'table',
          headers: ['Task', 'Output', 'Answers the question'],
          rows: [
            ['**Image classification**', 'One label + confidence for the whole image', '"What is this a picture of?"'],
            ['**Object detection**', 'A label + bounding box per instance', '"What is in it, where, and how many?"'],
            ['**Image segmentation**', 'A per-pixel mask', '"What is the exact shape and area?"'],
            ['**OCR**', 'Text strings with coordinates', '"What does it say?"'],
            ['**Face detection**', 'A rectangle per face', '"Where are the faces?"'],
          ],
        },
        {
          t: 'key',
          title: 'Routing rule',
          body: 'Need to **count** or know **where**? Detection, not classification. Need an **exact boundary or area**? Segmentation. Need the **words**? OCR. Classification only ever gives you one label for the whole frame.',
          priority: 'high',
        },
        { t: 'check', qid: 'wl-031' },
      ],
    },
    {
      id: 'faces',
      title: 'Faces and Limited Access',
      blocks: [
        {
          t: 'trap',
          title: 'Detection is fine; identification is gated',
          body: 'Finding **where** faces are is broadly available. Deciding **who** a face belongs to - identification and verification - falls under Microsoft\'s **Limited Access** policy and requires registration with an eligible use case. Microsoft also **retired emotion and gender inference** and limited several other attributes on responsible AI grounds.',
        },
        { t: 'check', qid: 'fv-005' },
      ],
    },
    {
      id: 'multimodal',
      title: 'Multimodal visual reasoning',
      blocks: [
        {
          t: 'p',
          md: 'A classic vision service returns **structured findings**. A multimodal model **reasons in prose** about what it sees. That is the distinction the exam objective "interpret visual input in prompts" is testing.',
        },
        {
          t: 'table',
          headers: ['Multimodal model is right for…', 'A purpose-built service is right for…'],
          rows: [
            ['Explaining what a chart or diagram means', 'Bounding boxes and pixel masks'],
            ['Answering an open question about a photo', 'A guaranteed JSON schema with confidence scores'],
            ['Describing a scene in natural language', 'High-volume OCR over scanned documents'],
            ['Spotting an anomaly and explaining why it matters', 'Face identification against a registered set'],
          ],
        },
        {
          t: 'p',
          md: 'Mechanically, you send a **user message containing both a text content item and an image content item** - the image as a URL or base64 data. No pre-upload step, no separate vision API.',
        },
        { t: 'check', qid: 'fv-001' },
        { t: 'check', qid: 'wl-033' },
      ],
    },
    {
      id: 'generation',
      title: 'Generating images and video',
      blocks: [
        {
          t: 'changed',
          title: 'DALL·E 3 has been retired',
          body: '`dall-e-3` was **retired on 4 March 2026** and existing deployments no longer work. Image generation in Foundry is now the **GPT-image series**, and video generation is **Sora 2**, in preview. Notes that answer "DALL·E" are out of date.',
        },
        {
          t: 'table',
          headers: ['Model', 'Characteristic'],
          rows: [
            ['`gpt-image-2.5-sunburst`', 'The most capable for generation and precise editing'],
            ['`gpt-image-2.5-flare`', 'The fastest high-quality everyday option, tuned for speed and cost'],
            ['`gpt-image-2`', 'High-resolution and 4K output, improved editing, broad aspect ratios; higher latency and cost'],
            ['`gpt-image-1.5` / `gpt-image-1`', 'Realism and instruction-following with face preservation (limited access preview)'],
            ['`gpt-image-1-mini`', 'Cost-efficient and faster for bulk, iterative, non-portrait work (limited access preview)'],
            ['`sora-2`', 'Video from text or images, with audio and remix - in preview'],
          ],
          caption: 'The catalog also carries image models from other providers, such as FLUX.',
        },
        {
          t: 'list',
          items: [
            '**Diffusion**: generation starts from noise and iteratively denoises, conditioned on the prompt. Nothing is retrieved or looked up.',
            '**Editing (inpainting)**: supply a mask plus a prompt to change part of an image and leave the rest.',
            '**Variations**: produce alternatives of an existing image.',
            '**Content provenance**: images from Azure OpenAI models carry **Content Credentials (C2PA)**, cryptographically signed metadata saying the image is AI-generated, and Microsoft also embeds **invisible watermarks** that can survive when the metadata is stripped. Both are **transparency** controls.',
          ],
        },
        { t: 'check', qid: 'wl-032' },
        { t: 'check', qid: 'fv-008' },
      ],
    },
    {
      id: 'routing',
      title: 'Which vision capability?',
      blocks: [
        {
          t: 'changed',
          title: 'Image Analysis 4.0 is deprecated',
          body: 'Azure Vision\'s Image Analysis 4.0 is deprecated with a published retirement date of 25 September 2028. Microsoft directs **OCR** scenarios to **Document Intelligence**, **face** scenarios to the **Face** service, image embeddings to models such as Cohere Embed or SigLIP, and other image analysis to **GPT models** or **Content Understanding**. Do not build new work on it.',
        },
        {
          t: 'table',
          headers: ['Requirement', 'Reach for'],
          rows: [
            ['Explain or reason about an image in prose', '**Multimodal model**'],
            ['Named fields with confidence scores from an image', '**Content Understanding**'],
            ['Text and layout from a scanned document', '**Document Intelligence**'],
            ['Create a new image or video', '**Image / video generation model**'],
            ['Identify a specific person', '**Face service** (Limited Access)'],
          ],
        },
        { t: 'check', qid: 'fv-012' },
        { t: 'check', qid: 'fv-004' },
      ],
    },
  ],
};
