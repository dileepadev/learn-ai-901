import type { AuthoredQuestion } from '../types';

/**
 * Topic: Identify AI model components and configurations (~9% of the exam).
 *
 * Small weight, but dense and very testable: tokenization/embeddings, LLM vs
 * SLM, picking a model by capability, and - the highest-yield part - deployment
 * options and inference parameters.
 */
export const modelComponentQuestions: AuthoredQuestion[] = [
  {
    id: 'mc-001',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Describe how generative AI models work',
    difficulty: 'easy',
    kind: 'learn',
    type: 'order',
    prompt: 'Put the stages of generating a response from a language model in order.',
    items: [
      { id: 's1', text: 'Tokenization - the prompt is split into tokens' },
      { id: 's2', text: 'Embedding - each token becomes a vector' },
      { id: 's3', text: 'Attention - the transformer weighs every token against every other' },
      { id: 's4', text: 'Prediction - a probability distribution over the next token' },
      { id: 's5', text: 'Sampling - one token is selected and appended, then repeat' },
    ],
    explanation:
      'Text → tokens → vectors → attention → next-token probabilities → sample → repeat. The loop is what makes generation *autoregressive*: each new token is produced with all previous tokens in context.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        'For example, given the sequence "When my dog was a ...", the model will evaluate the tokens in the sequence so far, use attention to assign weights, and predict that the next most probable token is "puppy" rather than, say, "cat" or "skateboard".',
    },
    tags: ['generative', 'pipeline'],
  },
  {
    id: 'mc-002',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Describe how generative AI models work',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'What is a token, in the context of a language model?',
    options: [
      {
        id: 'a',
        text: 'A chunk of text - often a word or part of a word - that the model treats as one unit',
        correct: true,
      },
      {
        id: 'b',
        text: 'An authentication credential that your app sends each time it calls the model endpoint',
        correct: false,
        why: 'That is an API key or access token - a different meaning of the same word, and a deliberate distractor.',
      },
      {
        id: 'c',
        text: 'One character of input text, so a 400-character prompt costs exactly 400 tokens',
        correct: false,
        why: 'Tokens are usually larger than a character; roughly four characters of English on average.',
      },
      {
        id: 'd',
        text: 'A single neuron in the neural network',
        correct: false,
        why: 'Neurons are parameters inside the model, not units of input text.',
      },
    ],
    explanation:
      'Tokens are the unit models read, generate and bill in. A rough rule of thumb for English: 1 token ≈ 4 characters ≈ ¾ of a word.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        'While we tend to think of language in terms of words, LLMs break down their vocabulary into tokens. Tokens include words, but also sub-words (like the "un" in "unbelievable" and "unlikely"), punctuation, and other commonly used sequences of characters.',
    },
    tags: ['generative', 'tokens', 'definition'],
  },
  {
    id: 'mc-003',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Describe how generative AI models work',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'What does an embedding represent?',
    options: [
      {
        id: 'a',
        text: 'A vector of numbers that captures meaning, so similar meanings sit close together',
        correct: true,
      },
      {
        id: 'b',
        text: 'A compressed copy of the original text that can be decoded back exactly',
        correct: false,
        why: 'Embeddings are lossy semantic representations, not reversible compression.',
      },
      {
        id: 'c',
        text: 'The model\'s confidence score that its answer is correct',
        correct: false,
        why: 'Confidence is a score attached to a prediction, not a vector representation of input.',
      },
      {
        id: 'd',
        text: 'The number of tokens the prompt uses, stored for billing',
        correct: false,
        why: 'That is just a count.',
      },
    ],
    explanation:
      'Embeddings turn text (or images) into dense vectors positioned by meaning. That property is what makes vector search work: "annual leave" and "holiday allowance" land near each other even with no words in common - which is why RAG uses embeddings rather than keyword matching alone.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        'Because the dimensions are calculated based on how the tokens relate linguistically to one another, tokens that are used in similar contexts (and therefore have similar meanings) result in vectors with similar directions.',
    },
    tags: ['generative', 'embeddings'],
  },
  {
    id: 'mc-004',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Describe how generative AI models work',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'What does the transformer architecture\'s self-attention mechanism make possible?',
    options: [
      {
        id: 'a',
        text: 'Weighing how every token relates to every other token at once, capturing long-range context',
        correct: true,
      },
      {
        id: 'b',
        text: 'Processing words strictly one at a time, in order, the way earlier recurrent networks did',
        correct: false,
        why: 'That describes RNNs - exactly what transformers replaced. Parallel processing of the whole sequence is the transformer\'s advantage.',
      },
      {
        id: 'c',
        text: 'Storing the entire training corpus for retrieval at inference time',
        correct: false,
        why: 'Models do not retrieve their training data. Adding retrieval is what RAG is for.',
      },
      {
        id: 'd',
        text: 'Eliminating the need for training data',
        correct: false,
        why: 'Transformers are still trained on very large corpora.',
      },
    ],
    explanation:
      'Self-attention scores how much each token should attend to every other token, so context from far back in the sequence still influences the next prediction - and because it is computed in parallel rather than sequentially, it trains efficiently on large hardware.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        "An attention layer considers each token in turn, within the context of the sequence of tokens in which it appears. The tokens around the current one are weighted to reflect their influence and the weights are used to calculate the element values for the current token's embedding vector.",
    },
    tags: ['generative', 'transformer'],
  },
  {
    id: 'mc-005',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'A summarisation feature keeps producing slightly different wording for the same input, and the team needs it to be as consistent and factual as possible. Which change helps most?',
    options: [
      { id: 'a', text: 'Lower the temperature towards 0', correct: true },
      {
        id: 'b',
        text: 'Raise the temperature towards 1',
        correct: false,
        why: 'Higher temperature increases randomness and creativity - the opposite of what is wanted.',
      },
      {
        id: 'c',
        text: 'Increase max tokens',
        correct: false,
        why: 'That only allows a longer response; it has no effect on consistency.',
      },
      {
        id: 'd',
        text: 'Increase the frequency penalty',
        correct: false,
        why: 'That discourages repeating the same words, which if anything pushes wording to vary more.',
      },
    ],
    explanation:
      'Temperature controls randomness in token selection. Near 0 the model repeatedly picks the highest-probability token, giving focused, near-deterministic output. Near 1+ it samples more widely, giving creative and varied output.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
      quote:
        "A fictional story could be generated using a higher temperature. Whereas to generate a legal document it's recommended to use a much lower temperature.",
    },
    tags: ['parameters', 'temperature'],
  },
  {
    id: 'mc-006',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'What does `max_tokens` limit?',
    options: [
      { id: 'a', text: 'The length of the model\'s generated response', correct: true },
      {
        id: 'b',
        text: 'The length of the prompt you may send',
        correct: false,
        why: 'This is the classic trap. Prompt length is bounded by the model\'s *context window*, not by max tokens.',
      },
      {
        id: 'c',
        text: 'The total number of requests per minute',
        correct: false,
        why: 'That is rate limiting / quota.',
      },
      {
        id: 'd',
        text: 'The vocabulary size the model can draw from',
        correct: false,
        why: 'Vocabulary size is fixed by the model\'s tokenizer.',
      },
    ],
    explanation:
      'max_tokens caps the *completion*. The prompt is constrained separately by the context window, and prompt + completion together must fit inside it. Reasoning models use `max_completion_tokens` (Chat Completions) or `max_output_tokens` (Responses API) for the same job.',
    reference: {
      label: 'Azure OpenAI chat REST reference (request parameters)',
      url: 'https://learn.microsoft.com/rest/api/microsoft-foundry/azureopenai/chat',
      quote:
        'The maximum number of tokens that can be generated in the chat completion. This value can be used to control costs for text generated via API.',
    },
    tags: ['parameters', 'max-tokens', 'trap'],
  },
  {
    id: 'mc-007',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Parameter',
    rightLabel: 'What it controls',
    prompt: 'Match each inference parameter to what it controls.',
    pairs: [
      { id: 'p1', left: 'temperature', right: 'How random vs. focused token selection is' },
      { id: 'p2', left: 'top_p', right: 'The probability mass of candidate tokens considered' },
      { id: 'p3', left: 'max_tokens', right: 'The maximum length of the generated response' },
      { id: 'p4', left: 'stop', right: 'Sequences that make generation halt immediately' },
      { id: 'p5', left: 'frequency_penalty', right: 'Discourages reusing tokens in proportion to how often they already appeared' },
      { id: 'p6', left: 'presence_penalty', right: 'Discourages reusing any token that has appeared at all, encouraging new topics' },
    ],
    explanation:
      'Two randomness knobs (temperature and top_p - tune one, not both), one length cap, one halt condition, and two repetition penalties that differ in whether they count *how often* a token appeared or merely *whether* it appeared.',
    reference: {
      label: 'Azure OpenAI chat REST reference (request parameters)',
      url: 'https://learn.microsoft.com/rest/api/microsoft-foundry/azureopenai/chat',
      quote:
        'Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.',
    },
    tags: ['parameters', 'matching', 'cram'],
  },
  {
    id: 'mc-008',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'hard',
    kind: 'exam',
    prompt: 'What is the standard guidance about temperature and top_p?',
    options: [
      {
        id: 'a',
        text: 'They are alternatives for controlling randomness - adjust one, not both',
        correct: true,
      },
      {
        id: 'b',
        text: 'Always set both to the same value so they reinforce each other',
        correct: false,
        why: 'They interact, and tuning both at once makes results hard to reason about.',
      },
      {
        id: 'c',
        text: 'top_p controls response length, while temperature controls randomness',
        correct: false,
        why: 'Length is max_tokens. top_p is nucleus sampling - it restricts candidates to the smallest set whose probabilities sum to p.',
      },
      {
        id: 'd',
        text: 'temperature applies to the prompt, while top_p applies to the output',
        correct: false,
        why: 'Both apply to how output tokens are selected.',
      },
    ],
    explanation:
      'temperature reshapes the whole probability distribution; top_p truncates it to the most likely candidates whose cumulative probability reaches p. Both dial the same underlying thing, so change one at a time.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
      quote:
        'Top_probability is another parameter and is similar to Temperature in that it also controls the randomness of the model response, but it does so in a different way. The general recommendation is to alter one of these two parameters at a time, not both',
    },
    tags: ['parameters', 'temperature-vs-topp', 'trap', 'hard'],
  },
  {
    id: 'mc-009',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify an appropriate AI model, based on capabilities',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A handheld scanner used in warehouses with intermittent connectivity needs on-device classification of short text notes. Cost and latency matter far more than nuanced reasoning.',
    prompt: 'Which type of model fits best?',
    options: [
      { id: 'a', text: 'A small language model (SLM) such as the Phi family', correct: true },
      {
        id: 'b',
        text: 'A frontier-scale large language model with a very large context window',
        correct: false,
        why: 'Too large for constrained hardware, higher latency and cost, and its extra reasoning ability is not needed for short-text classification.',
      },
      {
        id: 'c',
        text: 'An embedding model',
        correct: false,
        why: 'Embedding models produce vectors; they do not classify or generate on their own.',
      },
      {
        id: 'd',
        text: 'An image generation model',
        correct: false,
        why: 'Wrong modality entirely.',
      },
    ],
    explanation:
      'SLMs have far fewer parameters, so they run on modest hardware or at the edge with low latency and cost. Pick an SLM when the task is narrow and the constraints are compute, cost, latency or offline operation; pick an LLM when the task needs broad knowledge or complex multi-step reasoning.',
    reference: {
      label: 'Generative AI and agents - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/2-generative-ai',
      quote:
        'LLMs are powerful and generalize well, but can be more costly to train and use. SLMs tend to work well in scenarios that are more focused on specific topic areas or that require easily deployed small models for local applications and agents on devices.',
    },
    tags: ['model-selection', 'slm-vs-llm'],
  },
  {
    id: 'mc-010',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify an appropriate AI model, based on capabilities',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Requirement',
    rightLabel: 'Model capability needed',
    prompt: 'Match each requirement to the model capability it needs.',
    pairs: [
      { id: 'c1', left: 'Answer questions about an uploaded photograph', right: 'Multimodal (vision) model' },
      { id: 'c2', left: 'Power semantic search over a document set', right: 'Embedding model' },
      { id: 'c3', left: 'Produce a marketing illustration from a description', right: 'Image generation model' },
      { id: 'c4', left: 'Hold a text conversation and follow instructions', right: 'Chat / language model' },
      { id: 'c5', left: 'Respond to a spoken question with spoken audio', right: 'Multimodal (audio) model' },
    ],
    explanation:
      'Model selection on this exam is almost always a modality question first: what goes in, what must come out. Only then do size, cost and reasoning depth matter.',
    reference: {
      label: 'Overview of Microsoft Foundry Models',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/foundry-models-overview',
      quote:
        'These models range from foundation models, reasoning models, small language models, multimodal models, domain-specific models, and industry models.',
    },
    tags: ['model-selection', 'matching', 'cram'],
  },
  {
    id: 'mc-011',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'In Microsoft Foundry, which deployment option is the preferred, most capable path for models including those sold by Azure and selected partner models?',
    options: [
      { id: 'a', text: 'Serverless API', correct: true },
      {
        id: 'b',
        text: 'Managed compute',
        correct: false,
        why: 'Managed compute exists for open-source, partner and custom models that need dedicated GPU capacity. It is billed hourly per accelerator and is not the default path.',
      },
      {
        id: 'c',
        text: 'A local Docker container',
        correct: false,
        why: 'Containers exist for some Foundry Tools features, but they are not a Foundry Models deployment option.',
      },
      {
        id: 'd',
        text: 'An Azure Machine Learning pipeline',
        correct: false,
        why: 'Not a model deployment option in Foundry.',
      },
    ],
    explanation:
      'Foundry offers two deployment options: **Serverless API** (preferred - Microsoft hosts the model, you are billed per token or for reserved PTUs, and it supports the full range of deployment types, content filtering and private networking) and **managed compute**, in preview (dedicated GPUs for open-source and custom models, billed by the hour).',
    reference: {
      label: 'Deployment overview for Microsoft Foundry Models',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/deployments-overview',
      quote:
        'Serverless API is the preferred deployment option in Foundry. It supports the widest range of capabilities and deployment types.',
    },
    tags: ['deployment', 'currency'],
  },
  {
    id: 'mc-012',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A production chat service has steady, high, predictable traffic and a strict p95 latency requirement.',
    prompt: 'Which deployment type suits it best?',
    options: [
      {
        id: 'a',
        text: 'A provisioned type, using reserved PTUs',
        correct: true,
      },
      {
        id: 'b',
        text: 'Global Standard, paying per token',
        correct: false,
        why: 'Global Standard gives the highest default quota and is ideal for variable traffic, but customers with high consistent volume can see greater latency variability.',
      },
      {
        id: 'c',
        text: 'Global Batch, at the batch discount',
        correct: false,
        why: 'Batch is discounted asynchronous processing for offline workloads - unsuitable for an interactive chat service.',
      },
      {
        id: 'd',
        text: 'The Developer type, for evaluation',
        correct: false,
        why: 'Developer deployments exist for evaluating fine-tuned models, not for production traffic.',
      },
    ],
    explanation:
      'Provisioned deployments reserve capacity in PTUs, giving predictable throughput and lower, more consistent latency than pay-per-token. The trade-off is that you pay for the reservation whether or not you use it. Steady high volume + latency guarantees ⇒ provisioned; spiky or unpredictable ⇒ standard.',
    reference: {
      label: 'Deployment types for Microsoft Foundry Models',
      url: 'https://learn.microsoft.com/azure/foundry/foundry-models/concepts/deployment-types',
      quote:
        'With provisioned throughput, you purchase a fixed number of provisioned throughput units (PTUs) that guarantee a specific level of processing capacity. This deployment type provides lower and more consistent latency than Global Standard.',
    },
    tags: ['deployment', 'ptu', 'hard'],
  },
  {
    id: 'mc-013',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'An organisation must guarantee that inference data is processed only inside the European Union. Which deployment type category should it choose?',
    options: [
      { id: 'a', text: 'A Data Zone deployment type', correct: true },
      {
        id: 'b',
        text: 'A Global deployment type',
        correct: false,
        why: 'Global types may process inference data in any Azure region - the opposite of the requirement.',
      },
      {
        id: 'c',
        text: 'Managed compute',
        correct: false,
        why: 'Managed compute uses global data processing.',
      },
      {
        id: 'd',
        text: 'Any type - data residency is identical across all of them',
        correct: false,
        why: 'Data *at rest* stays in the chosen geography for all types, but *inference* processing differs sharply between global, data zone and standard.',
      },
    ],
    explanation:
      'Deployment types differ in where inference is processed: **Global** may use any Azure region; **Data Zone** stays within a Microsoft-specified zone (US, EU, or APAC); **Standard / Regional Provisioned** stay within the customer-specified Azure geography. Data at rest always remains in the designated geography.',
    reference: {
      label: 'Deployment types for Microsoft Foundry Models',
      url: 'https://learn.microsoft.com/azure/foundry/foundry-models/concepts/deployment-types',
      quote:
        'For Global deployment types, the service can process prompts and responses in any geography where the model is deployed. For Data Zone deployment types, the service processes prompts and responses only within the specified data zone',
    },
    tags: ['deployment', 'data-residency', 'hard'],
  },
  {
    id: 'mc-014',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'medium',
    kind: 'learn',
    prompt: 'How is each deployment option billed?',
    options: [
      {
        id: 'a',
        text: 'Serverless API by tokens (or reserved PTUs); managed compute by the hour',
        correct: true,
      },
      {
        id: 'b',
        text: 'Both are billed per token, at the same rate for every model',
        correct: false,
        why: 'Managed compute runs on dedicated VMs you keep alive, so you pay for uptime whether or not requests arrive.',
      },
      {
        id: 'c',
        text: 'Both are billed by the hour for the capacity you reserve',
        correct: false,
        why: 'Serverless API pay-as-you-go is metered on input and output tokens.',
      },
      {
        id: 'd',
        text: 'Serverless API is free; you pay only for the storage it uses',
        correct: false,
        why: 'Inference is always metered.',
      },
    ],
    explanation:
      'The billing model is the fastest way to tell the options apart: tokens consumed (serverless) versus compute time reserved (managed compute).',
    reference: {
      label: 'Deployment overview for Microsoft Foundry Models',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/deployments-overview',
      quote:
        'Managed compute billing is hourly per accelerator SKU, with throughput per GPU as the underlying billing unit.',
    },
    tags: ['deployment', 'billing'],
  },
  {
    id: 'mc-015',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify an appropriate AI model, based on capabilities',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'What is the Foundry model catalog, and what should you use it for?',
    options: [
      {
        id: 'a',
        text: 'A catalog of models from many providers, to compare and deploy',
        correct: true,
      },
      {
        id: 'b',
        text: 'A store that holds only your own fine-tuned models',
        correct: false,
        why: 'Your fine-tuned models live in your project; the catalog is the discovery surface for the wider model ecosystem.',
      },
      {
        id: 'c',
        text: 'A billing dashboard showing token usage by model',
        correct: false,
        why: 'Cost management is elsewhere in the portal.',
      },
      {
        id: 'd',
        text: 'A list of prebuilt agents you can install in a project',
        correct: false,
        why: 'Agents are built in Agent Service; the catalog is about models.',
      },
    ],
    explanation:
      'The catalog is where you browse and filter models by capability, modality, provider and deployment support, compare benchmarks, then deploy the one that fits. It holds more than 10,000 models across first-party, partner and open-source publishers, with roughly 50 new ones each month.',
    reference: {
      label: 'Overview of Microsoft Foundry Models',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/foundry-models-overview',
      quote:
        'Search and discover models that meet your needs through keyword search and filters. The model catalog also offers the model performance leaderboard and benchmark metrics for select models.',
    },
    tags: ['model-catalog'],
  },
  {
    id: 'mc-016',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Describe how generative AI models work',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Why can a language model state something false with complete confidence?',
    options: [
      {
        id: 'a',
        text: 'It predicts the most plausible next token, and plausible is not the same as true',
        correct: true,
      },
      {
        id: 'b',
        text: 'Its training data is encrypted, so it cannot read its sources accurately',
        correct: false,
        why: 'Training data is not stored in the model at all, encrypted or otherwise.',
      },
      {
        id: 'c',
        text: 'Temperature is always set too high by default on deployed models',
        correct: false,
        why: 'Temperature affects variability. A model at temperature 0 can still be confidently wrong.',
      },
      {
        id: 'd',
        text: 'Its context window is too small to hold the facts it needs',
        correct: false,
        why: 'A larger window helps with long inputs, but does not add facts the model never learned.',
      },
    ],
    explanation:
      'This is *hallucination*, and understanding its cause explains the whole rationale for RAG: give the model retrieved, authoritative content in the prompt so its next-token prediction is anchored to real source material - and cite it so a human can check.',
    reference: {
      label: 'RAG and indexes in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/retrieval-augmented-generation',
      quote:
        'Hallucination despite grounding: Even with retrieved content, models can still generate inaccurate responses. Enable citations and use clear system messages and prompts to instruct the model to stick to retrieved content.',
    },
    tags: ['generative', 'hallucination'],
  },
  {
    id: 'mc-017',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify an appropriate AI model, based on capabilities',
    difficulty: 'hard',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two statements about choosing between RAG and fine-tuning are correct? (Choose two.)',
    options: [
      {
        id: 'a',
        text: 'Use RAG when answers must reflect private or frequently changing data',
        correct: true,
      },
      {
        id: 'b',
        text: 'Use fine-tuning to change a model\'s behaviour, style or task performance',
        correct: true,
      },
      {
        id: 'c',
        text: 'Fine-tuning is the best way to keep a model up to date with new documents',
        correct: false,
        why: 'Every document change would require retraining, and the model still cannot cite sources. Retrieval is the right mechanism for fresh knowledge.',
      },
      {
        id: 'd',
        text: 'RAG changes the model\'s weights',
        correct: false,
        why: 'RAG changes what is in the prompt, not the model. The weights are untouched.',
      },
      {
        id: 'e',
        text: 'RAG removes the possibility of hallucination',
        correct: false,
        why: 'It substantially reduces it, but a model can still misuse retrieved passages - which is why citations and clear system prompts still matter.',
      },
    ],
    explanation:
      'Knowledge problem ⇒ retrieval. Behaviour problem ⇒ fine-tuning. This split is stated directly in Microsoft\'s Foundry guidance and is a reliable exam question.',
    reference: {
      label: 'RAG and indexes in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/retrieval-augmented-generation',
      quote:
        'Use RAG when you need answers grounded in private or frequently changing data. Use fine-tuning when you need to change model behavior, style, or task performance, rather than add fresh knowledge.',
    },
    tags: ['rag-vs-finetune', 'hard', 'multi-select'],
  },
  {
    id: 'mc-018',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'What is a stop sequence used for?',
    options: [
      {
        id: 'a',
        text: 'To end the response as soon as a specified string appears',
        correct: true,
      },
      {
        id: 'b',
        text: 'To block unsafe content categories in the model\'s output',
        correct: false,
        why: 'That is content filtering, configured on the deployment.',
      },
      {
        id: 'c',
        text: 'To cancel an in-flight request from the client application',
        correct: false,
        why: 'That is client-side cancellation, not a model parameter.',
      },
      {
        id: 'd',
        text: 'To limit how many requests per minute the client may send',
        correct: false,
        why: 'That is rate limiting.',
      },
    ],
    explanation:
      'Stop sequences are useful when you want structured output to terminate cleanly - for example stopping at `\\n\\n` or at a marker like `END` so the model does not continue past the part you need.',
    reference: {
      label: 'Azure OpenAI chat REST reference (request parameters)',
      url: 'https://learn.microsoft.com/rest/api/microsoft-foundry/azureopenai/chat',
      quote:
        'Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.',
    },
    tags: ['parameters', 'stop'],
  },
  {
    id: 'mc-019',
    topic: 'model-components',
    moduleId: 'ml-and-transformers',
    objective: 'Describe how generative AI models work',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A language model writes its reply one token at a time, adding each new token to the sequence before predicting the next. What is this behaviour called?',
    options: [
      { id: 'a', text: 'Autoregressive generation', correct: true },
      {
        id: 'b',
        text: 'Retrieval-augmented generation',
        correct: false,
        why: 'RAG adds retrieved passages to the prompt. It changes what the model reads, not how it produces tokens.',
      },
      {
        id: 'c',
        text: 'Fine-tuning',
        correct: false,
        why: 'Fine-tuning adjusts the weights before the model is used. It does not describe how a reply is produced.',
      },
      {
        id: 'd',
        text: 'Diffusion',
        correct: false,
        why: 'Diffusion builds an image by repeatedly removing noise. It is not how a language model writes text.',
      },
    ],
    explanation:
      'The decoder predicts the most probable next token, the token is added to the sequence, and the whole process repeats until the model predicts the end. That loop is what *autoregressive* means - and why replies stream in word by word.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        'The predicted value is then added to the sequence, and the whole process repeats to predict the next token; and so on, until the decoder predicts that the sequence has ended.',
    },
    tags: ['how-llms-work', 'tokens'],
  },
  {
    id: 'mc-020',
    topic: 'model-components',
    moduleId: 'ml-and-transformers',
    objective: 'Describe how generative AI models work',
    difficulty: 'easy',
    kind: 'exam',
    prompt: 'Which statement about tokens is correct?',
    options: [
      {
        id: 'a',
        text: 'A token can be a whole word, part of a word such as "un", or punctuation',
        correct: true,
      },
      {
        id: 'b',
        text: 'A token is always exactly one whole word',
        correct: false,
        why: 'Vocabularies also hold sub-words, punctuation and other common character sequences, so long or rare words split into several tokens.',
      },
      {
        id: 'c',
        text: 'Only generated tokens are billed, because prompt tokens are always free',
        correct: false,
        why: 'Serverless deployments bill for inputs and outputs, so prompt tokens count too.',
      },
      {
        id: 'd',
        text: 'Tokens are assigned at random each time you call the model, so counts vary',
        correct: false,
        why: 'Each token gets a fixed ID when the vocabulary is built from training data. The same text always tokenizes the same way for a given model.',
      },
    ],
    explanation:
      'Models break text into tokens - words, sub-words, punctuation - and each has a fixed ID in the vocabulary. Tokens are the unit models read, generate and bill in; in English, a token averages roughly four characters.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        'Tokens include words, but also sub-words (like the "un" in "unbelievable" and "unlikely"), punctuation, and other commonly used sequences of characters.',
    },
    tags: ['tokens', 'how-llms-work'],
  },
  {
    id: 'mc-021',
    topic: 'model-components',
    moduleId: 'ml-and-transformers',
    objective: 'Describe how generative AI models work',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'The embeddings for "dog" and "puppy" point in almost the same direction in vector space. What does that tell you?',
    options: [
      {
        id: 'a',
        text: 'The two words are used in similar contexts, so their meanings are close',
        correct: true,
      },
      {
        id: 'b',
        text: 'The two words always appear next to each other in the training text',
        correct: false,
        why: 'Embeddings capture how tokens are used across many contexts, not whether they sit side by side.',
      },
      {
        id: 'c',
        text: 'The two words have the same number of characters',
        correct: false,
        why: 'Spelling and length play no part in an embedding. "Dog" and "puppy" are different lengths anyway.',
      },
      {
        id: 'd',
        text: 'The model will treat the two words as the same token',
        correct: false,
        why: 'They remain separate tokens with separate IDs. Similar direction means similar meaning, not identity.',
      },
    ],
    explanation:
      'Embeddings encode meaning as direction in a many-dimensional space, learned from the contexts words appear in. Similar meanings point in similar directions, which you can measure with cosine similarity - the property that powers semantic search and RAG.',
    reference: {
      label: 'Large language models (LLMs) - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/fundamentals-generative-ai/3-language-models',
      quote:
        'For example, the embeddings for "dog" and "puppy" point in more or less the same direction, which isn\'t too different from the embedding for "cat"; but very different from the embedding for "skateboard" or "car". We can measure how close tokens are to one another semantically by calculating the cosine similarity of their vectors.',
    },
    tags: ['embeddings', 'how-llms-work'],
  },
  {
    id: 'mc-022',
    topic: 'model-components',
    moduleId: 'genai-models',
    objective: 'Identify appropriate model deployment options and configuration parameters',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A team moves a summarisation feature from gpt-4.1 to a GPT-5 series reasoning model. Requests that set `temperature=0.2` and `max_tokens=400` now fail.',
    prompt: 'What should they change?',
    options: [
      {
        id: 'a',
        text: 'Drop temperature, and use max_completion_tokens or max_output_tokens instead',
        correct: true,
      },
      {
        id: 'b',
        text: 'Keep both parameters, but set temperature to 0, the most deterministic value',
        correct: false,
        why: 'Reasoning models do not accept temperature at all - any value is rejected.',
      },
      {
        id: 'c',
        text: 'Move the deployment to a provisioned type so that every parameter is honoured',
        correct: false,
        why: 'The deployment type changes capacity and billing, not which request parameters a model accepts.',
      },
      {
        id: 'd',
        text: 'Raise max_tokens well above 400 to leave room for the model\'s hidden reasoning',
        correct: false,
        why: 'Reasoning models reject max_tokens. The length cap has a different name.',
      },
    ],
    explanation:
      'Reasoning models do not support `temperature`, `top_p`, the penalties or `max_tokens`. Cap length with `max_completion_tokens` in Chat Completions or `max_output_tokens` in the Responses API, and use `reasoning_effort` to trade depth of thinking for speed.',
    reference: {
      label: 'Work with chat completion models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/chatgpt',
      quote:
        "Reasoning models, such as the GPT-5 series, behave differently on this API. They use max_completion_tokens instead of max_tokens, and they don't support temperature, top_p, or the penalty parameters.",
    },
    tags: ['parameters', 'reasoning-models', 'currency'],
  },
];
