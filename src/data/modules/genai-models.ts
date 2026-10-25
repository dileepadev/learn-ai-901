import type { Module } from '../types';

export const genaiModels: Module = {
  id: 'genai-models',
  order: 4,
  title: 'Choosing and configuring models',
  summary:
    'Model selection, deployment options and inference parameters - small in weight, dense in testable facts, and full of stale-material traps.',
  topic: 'model-components',
  minutes: 24,
  priority: 'high',
  icon: '🎛️',
  outcomes: [
    'Choose between an LLM and an SLM, and pick a model by modality',
    'Explain temperature, top_p, max_tokens, stop and the two penalties - and which models ignore them',
    'Choose the right deployment option and deployment type, using current names',
  ],
  quiz: ['mc-007', 'mc-011', 'mc-015', 'mc-022', 'sc-mc-01', 'sc-mc-03', 'sc-mc-04', 'sc-mc-08', 'yn-mc-01', 'dd-mc-01'],
  sections: [
    {
      id: 'selection',
      title: 'Picking a model: modality first',
      blocks: [
        {
          t: 'p',
          md: 'Model selection questions look complicated but resolve in two steps: **what modality goes in and out**, then **how much capability do you actually need**.',
        },
        {
          t: 'table',
          headers: ['You need to…', 'Model type'],
          rows: [
            ['Chat, follow instructions, reason over text', 'Language / chat model'],
            ['Work through hard, multi-step problems', 'Reasoning model (for example the GPT-5 series)'],
            ['Reason about images or audio in a prompt', 'Multimodal model'],
            ['Hold a live spoken conversation', 'Realtime audio model (`gpt-realtime` family), or Voice Live'],
            ['Turn text into vectors for search or RAG', 'Embedding model'],
            ['Create an image from a description', 'Image generation model (GPT-image series)'],
            ['Create a video from a description', 'Video generation model (Sora 2, preview)'],
          ],
        },
        {
          t: 'table',
          headers: ['', 'Large language model (LLM)', 'Small language model (SLM)'],
          rows: [
            ['Parameters', 'Tens to hundreds of billions', 'Roughly 1–14 billion'],
            ['Runs on', 'Cloud GPU capacity', 'Modest hardware, edge devices, laptops'],
            ['Cost & latency', 'Higher', 'Much lower'],
            ['Best at', 'Complex multi-step reasoning, broad knowledge', 'Focused tasks, classification, high throughput, offline'],
          ],
          caption: 'Microsoft\'s Phi family is the SLM to name if asked for an example.',
        },
        { t: 'check', qid: 'mc-009' },
      ],
    },
    {
      id: 'catalog',
      title: 'The model catalog',
      blocks: [
        {
          t: 'p',
          md: 'The Foundry **model catalog** is where you browse and filter models by capability, modality, provider and deployment type, compare benchmarks, and then deploy one. It holds more than 10,000 models - from Microsoft, OpenAI, Anthropic, Meta, Mistral, Cohere, DeepSeek, Hugging Face and others - with roughly 50 new ones a month.',
        },
        {
          t: 'changed',
          title: 'Models sold by Azure vs. models from partners',
          body: '**Models sold by Azure** (all Azure OpenAI models plus selected others) are billed through your Azure subscription, covered by Azure SLAs and supported by Microsoft. **Models from partners and community** are billed via Azure Marketplace under the provider\'s terms.',
        },
      ],
    },
    {
      id: 'deployment',
      title: 'Deployment: options vs. types',
      blocks: [
        {
          t: 'key',
          title: 'Two levels, and the exam tests both',
          body: 'First choose a **deployment option**: *Serverless API* (preferred) or *managed compute* (preview). If you chose Serverless API, then choose a **deployment type**, which decides where data is processed and how you pay.',
          priority: 'high',
        },
        {
          t: 'table',
          headers: ['', 'Serverless API', 'Managed compute (preview)'],
          rows: [
            ['Which models', 'All Foundry Models, including those sold by Azure and select partner models', 'Open-source, partner and custom models, NVIDIA NIM, industry models'],
            ['Who hosts it', 'Microsoft', 'Dedicated GPU capacity Foundry manages for you'],
            ['Deployed into', 'The Foundry resource', 'A Foundry project - no AI hub needed'],
            ['Billing', 'Token usage, or reserved provisioned throughput units (PTUs)', 'Hourly, per accelerator SKU'],
            ['Data processing', 'Regional, data zone, or global', 'Global'],
            ['Content filtering', 'Built-in and customisable', 'Not available in public preview'],
            ['Verdict', '**The preferred option - use it whenever possible**', 'Only when the model requires it'],
          ],
        },
        {
          t: 'changed',
          title: 'PTU is not a third option',
          body: 'Older notes list "Serverless API / Managed compute / PTU" as three peers. **Provisioned throughput is a deployment *type* inside the Serverless API option**, not a separate option. Likewise, the "serverless API endpoints" and hub-based managed compute of the classic hub model are not the current options - and neither current option needs a hub.',
        },
        {
          t: 'p',
          md: 'Serverless API **deployment types** fall into three families - *standard* (pay per token), *provisioned* (reserved PTU capacity), and *batch* (asynchronous, at a 50% discount with a 24-hour target). Standard and provisioned come with Global, Data Zone or single-geography processing. A *Developer* type exists only for evaluating fine-tuned models: no SLA, and it deletes itself after 24 hours. Microsoft\'s advice is to **start with Global Standard** - it gets new models first, has the lowest price and the widest region coverage - and move only when you have a reason.',
        },
        {
          t: 'table',
          headers: ['Processing scope', 'Where inference happens', 'Choose it when'],
          rows: [
            ['**Global**', 'Any Azure region', 'You want the highest default quota and traffic is variable'],
            ['**Data Zone**', 'Only within a specified zone: US, EU, or APAC', 'Compliance requires regional confinement'],
            ['**Standard / Regional Provisioned**', 'Within your chosen Azure geography', 'Strictest residency requirements'],
          ],
          caption: 'Data at rest always stays in the designated geography; these types govern where *inference* runs.',
        },
        { t: 'demo', name: 'deployment-picker', caption: 'Answer three questions and get the deployment recommendation.' },
        { t: 'check', qid: 'mc-012' },
        { t: 'check', qid: 'mc-013' },
      ],
    },
    {
      id: 'instant',
      title: 'Instant access',
      blocks: [
        {
          t: 'changed',
          title: 'You do not always need a deployment',
          body: '**Instant access** (preview) lets you call supported models by name and start inferencing with no Serverless API or managed compute deployment at all - during the preview, from projects in West US 3. You still create a deployment when you need reserved throughput, data residency, custom guardrails or a fine-tuned model. Older material that insists a deployment is always required is out of date.',
        },
      ],
    },
    {
      id: 'parameters',
      title: 'Inference parameters',
      blocks: [
        {
          t: 'table',
          headers: ['Parameter', 'Controls', 'Exam-critical detail'],
          rows: [
            ['`temperature`', 'Randomness of token selection', '≈0 → focused, deterministic. ≈1+ → creative, varied.'],
            ['`top_p`', 'Probability mass of candidate tokens (nucleus sampling)', 'An **alternative** to temperature - tune one, not both.'],
            ['`max_tokens`', 'Maximum length of the **generated response**', 'It does **not** limit prompt length. That is the context window.'],
            ['`stop`', 'Sequences that halt generation immediately', 'Useful for clean structured output.'],
            ['`frequency_penalty`', 'Discourages tokens by **how often** they appeared', 'Reduces verbatim repetition.'],
            ['`presence_penalty`', 'Discourages tokens that appeared **at all**', 'Pushes the model towards new topics.'],
          ],
        },
        {
          t: 'demo',
          name: 'sampling',
          caption: 'Move the sliders and watch which token the model would pick.',
        },
        {
          t: 'changed',
          title: 'Reasoning models ignore the sampling knobs',
          body: 'Reasoning models such as the GPT-5 series reject `temperature`, `top_p` and the two penalties. You steer them with `reasoning_effort` (and `verbosity`), and cap length with `max_completion_tokens` in Chat Completions or `max_output_tokens` in the Responses API. The classic parameters still apply to non-reasoning models such as `gpt-4.1` - and the exam still expects you to know what each one does.',
        },
        {
          t: 'trap',
          title: 'The max_tokens trap',
          body: 'At least one question will offer "limits the size of the prompt you can send" as a plausible answer for `max_tokens`. It limits the **completion**. Prompt length is bounded separately by the model\'s **context window**, and prompt + completion together must fit inside it.',
        },
        { t: 'check', qid: 'mc-006' },
        { t: 'check', qid: 'mc-008' },
      ],
    },
    {
      id: 'rag-vs-ft',
      title: 'RAG or fine-tuning?',
      blocks: [
        {
          t: 'key',
          title: 'One sentence to memorise',
          body: '**RAG for knowledge. Fine-tuning for behaviour.** If the requirement is private or frequently changing facts, or citable answers, that is retrieval. If the requirement is a different style, format or task performance, that is fine-tuning.',
          priority: 'high',
        },
        { t: 'check', qid: 'mc-017' },
      ],
    },
  ],
};
