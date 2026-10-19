import type { AuthoredQuestion } from '../types';

/**
 * Topic: Implement generative AI apps and agents by using Foundry (~20%).
 *
 * The single heaviest topic. Covers prompts, deploying and testing models in
 * the portal, the Foundry SDK chat client, building a single agent, agent
 * client code, and RAG / Foundry IQ grounding.
 */
export const foundryGenAiQuestions: AuthoredQuestion[] = [
  /* ---------------- Prompts ---------------- */
  {
    id: 'fg-001',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create effective system and user prompts for generative AI models',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'What belongs in the system message rather than the user message?',
    options: [
      {
        id: 'a',
        text: 'The assistant\'s persona, rules, tone and output format',
        correct: true,
      },
      {
        id: 'b',
        text: 'The end user\'s current question, exactly as typed',
        correct: false,
        why: 'That is the user message by definition.',
      },
      {
        id: 'c',
        text: 'The model\'s previous replies in the conversation',
        correct: false,
        why: 'Those are assistant messages, replayed to give the model conversation history.',
      },
      {
        id: 'd',
        text: 'The API key the client uses to authenticate',
        correct: false,
        why: 'Credentials go in the request header, never in message content.',
      },
    ],
    explanation:
      'System message = standing instructions from the developer. User message = what the person asked right now. Assistant message = what the model said before. Keeping them straight is the foundation of every prompt question on this exam.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
    },
    tags: ['prompts', 'roles'],
  },
  {
    id: 'fg-002',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create effective system and user prompts for generative AI models',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A prompt includes three worked examples of input and the desired labelled output before the real input. What is this technique called?',
    options: [
      { id: 'a', text: 'Few-shot prompting', correct: true },
      {
        id: 'b',
        text: 'Zero-shot prompting',
        correct: false,
        why: 'Zero-shot means no examples are provided - you simply state the task.',
      },
      {
        id: 'c',
        text: 'Fine-tuning',
        correct: false,
        why: 'Fine-tuning retrains model weights on a dataset. Examples inside a prompt change nothing about the model.',
      },
      {
        id: 'd',
        text: 'Chain-of-thought prompting',
        correct: false,
        why: 'Chain-of-thought asks the model to reason step by step before answering; it is about *reasoning*, not about supplying examples.',
      },
    ],
    explanation:
      'Few-shot prompting demonstrates the pattern you want - useful for enforcing an exact output format or a labelling scheme. It is an inference-time technique, so it costs prompt tokens but requires no training.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
    },
    tags: ['prompts', 'few-shot'],
  },
  {
    id: 'fg-003',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create effective system and user prompts for generative AI models',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A support assistant sometimes answers questions about competitors and occasionally replies in a chatty tone that does not match the brand.',
    prompt: 'What is the most appropriate first fix?',
    options: [
      {
        id: 'a',
        text: 'Add explicit scope and tone rules to the system message',
        correct: true,
      },
      {
        id: 'b',
        text: 'Lower the temperature to 0 so replies stay consistent',
        correct: false,
        why: 'That makes off-topic answers more consistent, not fewer. Temperature does not encode scope.',
      },
      {
        id: 'c',
        text: 'Fine-tune the model on the company\'s brand documents',
        correct: false,
        why: 'Expensive and slow for something a well-written system message solves. Prompt first, fine-tune only if prompting genuinely cannot achieve it.',
      },
      {
        id: 'd',
        text: 'Reduce max_tokens so that replies are shorter',
        correct: false,
        why: 'Shorter off-brand answers are still off-brand.',
      },
    ],
    explanation:
      'Behavioural boundaries - what the assistant will and will not discuss, and how it should sound - belong in the system message. It is the cheapest, fastest and most maintainable control surface.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
    },
    tags: ['prompts', 'system-message', 'trap'],
  },
  {
    id: 'fg-004',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create effective system and user prompts for generative AI models',
    difficulty: 'hard',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two practices make a system prompt more effective? (Choose two.)',
    options: [
      {
        id: 'a',
        text: 'State the output format explicitly, including an example of it',
        correct: true,
      },
      {
        id: 'b',
        text: 'Tell the model what to do when it does not know the answer',
        correct: true,
      },
      {
        id: 'c',
        text: 'Keep instructions vague so the model can be creative',
        correct: false,
        why: 'Ambiguity is the main cause of inconsistent output. Specificity is the point of a system prompt.',
      },
      {
        id: 'd',
        text: 'Put the instructions in the user message instead so they are easier to change',
        correct: false,
        why: 'Instructions in user messages are easily overridden by subsequent user input and are the weaker position for standing rules.',
      },
      {
        id: 'e',
        text: 'Include the API key so the model can authenticate itself',
        correct: false,
        why: 'Never put credentials in prompt content.',
      },
    ],
    explanation:
      'Good system prompts are specific about role, scope, format and failure behaviour. "If the answer is not in the provided context, say you do not know" is one of the highest-value sentences you can add to a grounded assistant.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
    },
    tags: ['prompts', 'hard', 'multi-select'],
  },

  /* ---------------- Foundry platform / portal ---------------- */
  {
    id: 'fg-010',
    topic: 'foundry-genai-agents',
    moduleId: 'foundry-platform',
    objective: 'Deploy a model and interact with it in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'In current Microsoft Foundry, what is the relationship between a Foundry resource and a Foundry project?',
    options: [
      {
        id: 'a',
        text: 'The project is a child of the resource and inherits its security and governance settings',
        correct: true,
      },
      {
        id: 'b',
        text: 'The project is the parent, and Foundry resources are created inside it',
        correct: false,
        why: 'Reversed. The resource is the Azure-level container; projects are subresources of it.',
      },
      {
        id: 'c',
        text: 'They are unrelated - you choose one or the other for each workload',
        correct: false,
        why: 'You work inside a project, and that project belongs to a resource.',
      },
      {
        id: 'd',
        text: 'A project needs its own Azure Storage account and Key Vault before it can exist',
        correct: false,
        why: 'That was the hub-based model. Foundry projects do not require you to provision separate storage and key vault resources.',
      },
    ],
    explanation:
      'Foundry projects are child resources of a Foundry resource. Admins configure security, connectivity and governance once at the resource level; developers then create projects as folders to organise their work, inheriting those settings by default.',
    reference: {
      label: 'What is Microsoft Foundry?',
      url: 'https://learn.microsoft.com/azure/foundry/what-is-foundry',
    },
    tags: ['foundry', 'architecture', 'currency'],
  },
  {
    id: 'fg-011',
    topic: 'foundry-genai-agents',
    moduleId: 'foundry-platform',
    objective: 'Deploy a model and interact with it in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'Older study material describes creating an "AI hub" before you can create a project. What is the current guidance?',
    options: [
      {
        id: 'a',
        text: 'Hubs are now the classic model; Foundry projects need none, and hubs remain for a few cases',
        correct: true,
      },
      {
        id: 'b',
        text: 'A hub is still required, with Storage and Key Vault, before you can create any project',
        correct: false,
        why: 'They are not. Serverless API deployments and Foundry projects explicitly do not require an AI Hub.',
      },
      {
        id: 'c',
        text: 'Hubs have been deleted from Azure entirely and cannot be used',
        correct: false,
        why: 'They still exist and are still supported for specific scenarios - they are simply no longer the default.',
      },
      {
        id: 'd',
        text: 'Hubs and projects are two names for the same Azure object',
        correct: false,
        why: 'They are distinct resource types with different capabilities.',
      },
    ],
    explanation:
      'Microsoft moved most hub capabilities under the Foundry resource type. Hubs remain for prompt flow, Azure Machine Learning capabilities and some open-source hosting. If a practice question or older note insists on hubs, storage accounts and key vaults as prerequisites, it predates the current model.',
    reference: {
      label: 'Migrate from hub-based to Foundry projects',
      url: 'https://learn.microsoft.com/azure/foundry-classic/how-to/migrate-project',
    },
    tags: ['foundry', 'currency', 'hard', 'trap'],
  },
  {
    id: 'fg-012',
    topic: 'foundry-genai-agents',
    moduleId: 'foundry-platform',
    objective: 'Deploy a model and interact with it in the Foundry portal',
    difficulty: 'easy',
    kind: 'learn',
    type: 'order',
    prompt: 'Put the steps for deploying and trying a model in the Foundry portal in order.',
    items: [
      { id: 'd1', text: 'Open your project in the Foundry portal' },
      { id: 'd2', text: 'Browse the model catalog and choose a model' },
      { id: 'd3', text: 'Create a deployment, choosing the deployment type' },
      { id: 'd4', text: 'Open the playground and chat with the deployment' },
      { id: 'd5', text: 'Copy the project endpoint and deployment name into your app' },
    ],
    explanation:
      'Portal flow: project → catalog → deploy → playground → wire into code. The playground is the fastest way to sanity-check a system prompt before writing any client code.',
    reference: {
      label: 'Deploy Microsoft Foundry Models in the Foundry portal',
      url: 'https://learn.microsoft.com/azure/foundry/foundry-models/how-to/deploy-foundry-models',
    },
    tags: ['foundry', 'portal', 'workflow'],
  },
  {
    id: 'fg-013',
    topic: 'foundry-genai-agents',
    moduleId: 'foundry-platform',
    objective: 'Deploy a model and interact with it in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'What are Foundry Tools?',
    options: [
      {
        id: 'a',
        text: 'Azure AI services such as Language, Speech, Vision and Content Understanding',
        correct: true,
      },
      {
        id: 'b',
        text: 'The command-line utilities you use to manage Azure subscriptions',
        correct: false,
        why: 'That is the Azure CLI.',
      },
      {
        id: 'c',
        text: 'Third-party plugins installed from the Azure Marketplace',
        correct: false,
        why: 'Foundry Tools are first-party Azure AI capabilities, not community add-ons.',
      },
      {
        id: 'd',
        text: 'The debugging and tracing panel in the Foundry portal',
        correct: false,
        why: 'Observability and tracing are separate features.',
      },
    ],
    explanation:
      'The services once called Azure AI services (and before that Cognitive Services) are now presented as Foundry Tools: Azure Language in Foundry Tools, Azure Speech in Foundry Tools, Azure Vision in Foundry Tools, Azure Content Understanding in Foundry Tools. Expect the exam to use the new names.',
    reference: {
      label: 'Microsoft Foundry architecture',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/architecture',
    },
    tags: ['foundry', 'naming', 'currency'],
  },
  {
    id: 'fg-014',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create a lightweight chat client application by using the Foundry SDK',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which two values does a lightweight Foundry chat client typically need in order to call a deployed model?',
    options: [
      {
        id: 'a',
        text: 'The project endpoint and the model deployment name, plus a credential',
        correct: true,
      },
      {
        id: 'b',
        text: 'The Azure subscription ID, the resource group name and the region',
        correct: false,
        why: 'Those identify resources for management operations. Inference calls go to an endpoint.',
      },
      {
        id: 'c',
        text: 'The model\'s parameter count and context window size',
        correct: false,
        why: 'Useful to know, but not required to make a call.',
      },
      {
        id: 'd',
        text: 'The URI of the dataset the model was trained on',
        correct: false,
        why: 'Irrelevant to calling a hosted model.',
      },
    ],
    explanation:
      'Endpoint + deployment name + credential. In current samples the endpoint is the project endpoint (`https://<resource>.services.ai.azure.com/api/projects/<project>`), usually read from configuration, and Microsoft Entra credentials are preferred over keys. With instant access (preview), a model name can stand in for the deployment name.',
    reference: {
      label: 'Quickstart: Get started with Microsoft Foundry SDK',
      url: 'https://learn.microsoft.com/azure/foundry/quickstarts/get-started-code',
    },
    tags: ['sdk', 'chat-client'],
  },
  {
    id: 'fg-015',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create a lightweight chat client application by using the Foundry SDK',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which authentication approach does Microsoft recommend for a Foundry client application?',
    options: [
      {
        id: 'a',
        text: 'Microsoft Entra ID (keyless) credentials such as a managed identity',
        correct: true,
      },
      {
        id: 'b',
        text: 'An API key embedded in the client source code, so no secrets store is needed',
        correct: false,
        why: 'Keys in source are a leak waiting to happen. Even when keys are used, they belong in configuration or a secret store.',
      },
      {
        id: 'c',
        text: 'Anonymous access with IP allow-listing',
        correct: false,
        why: 'Inference endpoints always require authentication.',
      },
      {
        id: 'd',
        text: 'A shared user password stored in the repository',
        correct: false,
        why: 'Not a supported authentication mechanism, and a serious security failure.',
      },
    ],
    explanation:
      'Both Serverless API and managed compute support keys and Microsoft Entra authentication; Entra (keyless) is the recommendation, with `DefaultAzureCredential` for development and a specific credential such as a managed identity in production.',
    reference: {
      label: 'Role-based access control for Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/rbac-foundry',
    },
    tags: ['sdk', 'auth', 'security'],
  },

  /* ---------------- Agents ---------------- */
  {
    id: 'fg-020',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'What are the three building blocks of an AI agent?',
    options: [
      { id: 'a', text: 'A model, instructions, and tools', correct: true },
      {
        id: 'b',
        text: 'A model, a database, and a web front end',
        correct: false,
        why: 'Storage and UI are implementation details around an agent, not what defines one.',
      },
      {
        id: 'c',
        text: 'Training data, weights, and a tokenizer',
        correct: false,
        why: 'Those are components of a model, one level down.',
      },
      {
        id: 'd',
        text: 'A prompt, a temperature, and a stop sequence',
        correct: false,
        why: 'Those are inference settings for a single call.',
      },
    ],
    explanation:
      'Model = the reasoning engine. Instructions = who it is and what it may do. Tools = how it acts on the world. Remove tools and you have a chatbot, not an agent.',
    reference: {
      label: 'Agents in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
    },
    tags: ['agents', 'definition', 'cram'],
  },
  {
    id: 'fg-021',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Foundry Agent Service offers prompt agents, voice-based prompt agents and hosted agents. Which describes a **prompt agent**?',
    options: [
      {
        id: 'a',
        text: 'A declarative agent - instructions, model and tools - that Foundry runs for you',
        correct: true,
      },
      {
        id: 'b',
        text: 'An agent you package as a container, which Foundry runs with a managed endpoint',
        correct: false,
        why: 'That is a *hosted* agent - the type you use when you bring your own code and framework.',
      },
      {
        id: 'c',
        text: 'An agent that runs entirely in the user\'s browser, with no service involved',
        correct: false,
        why: 'Neither agent type runs client-side.',
      },
      {
        id: 'd',
        text: 'A one-off agent whose definition lives only in your application code',
        correct: false,
        why: 'That is the ephemeral pattern you get by calling the Responses API directly - no agent resource is created in Foundry at all.',
      },
    ],
    explanation:
      'Prompt agents are configuration-only and the recommended starting point: author them in the portal or with the SDK/REST, and Foundry runs them. Voice-based prompt agents are the same idea for real-time spoken conversations, running on Voice Live. Hosted agents let you bring code built with Agent Framework, LangGraph, the OpenAI or Anthropic Agent SDKs, or your own, shipped as a container or zip.',
    reference: {
      label: 'Agents in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
    },
    tags: ['agents', 'currency', 'prompt-vs-hosted'],
  },
  {
    id: 'fg-022',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Requirement',
    rightLabel: 'Best approach',
    prompt: 'Match each requirement to the way you should build the agent.',
    pairs: [
      {
        id: 'a1',
        left: 'Ship an internal assistant quickly with no runtime code to maintain',
        right: 'Prompt agent',
      },
      {
        id: 'a2',
        left: 'Run custom orchestration logic written with LangGraph, with Foundry handling hosting and scaling',
        right: 'Hosted agent',
      },
      {
        id: 'a3',
        left: 'Call Foundry models and tools from code you already run elsewhere, with no agent resource in Foundry',
        right: 'Responses API directly',
      },
      {
        id: 'p4',
        left: 'Answer customer phone calls in real time, with no voice orchestration code to host',
        right: 'Voice-based prompt agent',
      },
    ],
    explanation:
      'Least to manage (prompt agent, or a voice-based prompt agent when people talk rather than type) → your code, Foundry-hosted (hosted agent) → your code, your host (Responses API). Prompt, voice-based prompt and hosted agents are the three *agent types*; the Responses API path creates an ephemeral agent with no persisted resource.',
    reference: {
      label: 'Agents in Microsoft Foundry - choose how to build',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
    },
    tags: ['agents', 'currency', 'matching', 'hard'],
  },
  {
    id: 'fg-023',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'An agent must answer questions about company policy, run numerical calculations on an uploaded spreadsheet, and look up today\'s exchange rate.',
    prompt: 'Which combination of tools does it need?',
    options: [
      {
        id: 'a',
        text: 'A knowledge/file search tool, code interpreter, and a web search tool',
        correct: true,
      },
      {
        id: 'b',
        text: 'Only a larger model with a bigger context window',
        correct: false,
        why: 'Context size does not give a model the ability to execute code or reach live data.',
      },
      {
        id: 'c',
        text: 'Only a fine-tuned model',
        correct: false,
        why: 'Fine-tuning changes behaviour, not the ability to act on external systems or compute exact results.',
      },
      {
        id: 'd',
        text: 'Only a higher temperature so the model is more resourceful',
        correct: false,
        why: 'Temperature affects randomness, nothing else.',
      },
    ],
    explanation:
      'Read the verbs. "Answer from our documents" ⇒ retrieval/knowledge. "Calculate on a file" ⇒ code interpreter. "Today\'s rate" ⇒ live web search. In Foundry, tools can be curated into a **toolbox** and shared across agents through a single managed endpoint with central governance.',
    reference: {
      label: 'Foundry Toolbox overview',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/toolbox-overview',
    },
    tags: ['agents', 'tools'],
  },
  {
    id: 'fg-024',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create a lightweight client application for an agent',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'In the current Foundry SDK, what does a client application do to have a conversation with an existing prompt agent?',
    options: [
      {
        id: 'a',
        text: 'Get a client bound to the agent, create a conversation, and send responses',
        correct: true,
      },
      {
        id: 'b',
        text: 'Download the agent definition and run the agent locally in the app',
        correct: false,
        why: 'A prompt agent runs in Foundry Agent Service. The client calls it; it does not execute the agent itself.',
      },
      {
        id: 'c',
        text: 'Send raw SQL queries to the agent\'s endpoint and parse the rows',
        correct: false,
        why: 'Not how any of this works.',
      },
      {
        id: 'd',
        text: 'Redeploy the underlying model on every call so it picks up the agent',
        correct: false,
        why: 'Deployment happens once; inference calls reuse it.',
      },
    ],
    explanation:
      'The shape is: authenticate → `AIProjectClient(endpoint, credential)` → `get_openai_client(agent_name=...)` for an OpenAI-compatible client bound to the agent → `conversations.create()` → `responses.create(conversation=..., input=...)` → read `output_text`. The conversation keeps history across turns.',
    reference: {
      label: 'Quickstart: Create a prompt agent',
      url: 'https://learn.microsoft.com/azure/foundry/agents/quickstarts/prompt-agent',
    },
    tags: ['agents', 'sdk', 'currency'],
  },
  {
    id: 'fg-025',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'learn',
    prompt:
      'Where do you test an agent interactively before wiring it into an application?',
    options: [
      { id: 'a', text: 'The agents playground in the Foundry portal', correct: true },
      {
        id: 'b',
        text: 'The Azure portal\'s resource blade',
        correct: false,
        why: 'The Azure portal manages the resource; agent authoring and testing happen in the Foundry portal.',
      },
      {
        id: 'c',
        text: 'Azure Monitor',
        correct: false,
        why: 'Monitor shows telemetry after the fact.',
      },
      {
        id: 'd',
        text: 'You cannot test an agent until it is deployed to production',
        correct: false,
        why: 'Interactive testing before release is a core part of the workflow.',
      },
    ],
    explanation:
      'The playground lets you chat with the agent, inspect tool calls, iterate on instructions, and then take a preconfigured code snippet straight into your development environment.',
    reference: {
      label: 'Agent development lifecycle',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/development-lifecycle',
    },
    tags: ['agents', 'portal'],
  },
  {
    id: 'fg-026',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    prompt: 'What is a Foundry **toolbox**?',
    options: [
      {
        id: 'a',
        text: 'A governed set of tools shared across agents through one managed endpoint',
        correct: true,
      },
      {
        id: 'b',
        text: 'The local SDK package you install before you can start building agents',
        correct: false,
        why: 'That is just the SDK.',
      },
      {
        id: 'c',
        text: 'A folder of sample notebooks that ships with the portal',
        correct: false,
        why: 'Samples are documentation, not a platform concept.',
      },
      {
        id: 'd',
        text: 'A UI panel in the portal that lists an agent\'s most recent tool calls',
        correct: false,
        why: 'That is observability/tracing.',
      },
    ],
    explanation:
      'Toolboxes solve the governance problem of tools: define them once, then share them across many agents with consistent authentication, governance and versioning instead of reconfiguring per agent.',
    reference: {
      label: 'Toolbox overview',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/toolbox-overview',
    },
    tags: ['agents', 'toolbox', 'currency', 'hard'],
  },
  {
    id: 'fg-027',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two are genuine advantages of a prompt agent over a hosted agent? (Choose two.)',
    options: [
      { id: 'a', text: 'There is no runtime code to maintain', correct: true },
      { id: 'b', text: 'There is no container compute to manage or pay for', correct: true },
      {
        id: 'c',
        text: 'It can run arbitrary custom orchestration logic you wrote',
        correct: false,
        why: 'That is precisely what hosted agents are for. Prompt agents are declarative.',
      },
      {
        id: 'd',
        text: 'Only prompt agents get a managed endpoint',
        correct: false,
        why: 'Both agent types get a managed endpoint and Foundry-managed autoscaling.',
      },
      {
        id: 'e',
        text: 'Only prompt agents can use Foundry models and platform tools',
        correct: false,
        why: 'Hosted agents reach the same models and tools through the Responses API on the project endpoint.',
      },
    ],
    explanation:
      'Prompt agents trade flexibility for simplicity: no code, no compute, fastest start. Hosted agents cost container compute on top of inference and tool usage, in exchange for running your own logic.',
    reference: {
      label: 'Compare agent types',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
    },
    tags: ['agents', 'prompt-vs-hosted', 'multi-select'],
  },

  /* ---------------- RAG / Foundry IQ ---------------- */
  {
    id: 'fg-030',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'easy',
    kind: 'learn',
    type: 'order',
    prompt: 'Put the stages of a retrieval-augmented generation pipeline in order.',
    items: [
      { id: 'r1', text: 'Ingest source documents' },
      { id: 'r2', text: 'Chunk them into passages' },
      { id: 'r3', text: 'Generate embeddings and build an index' },
      { id: 'r4', text: 'At query time, retrieve the most relevant passages' },
      { id: 'r5', text: 'Add the retrieved passages to the prompt as grounding data' },
      { id: 'r6', text: 'The model generates an answer with citations' },
    ],
    explanation:
      'Everything up to indexing happens ahead of time; retrieval and generation happen per query. The exam mostly tests that you know retrieval happens *before* generation and that grounding data goes into the prompt.',
    reference: {
      label: 'RAG and indexes in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/retrieval-augmented-generation',
    },
    tags: ['rag', 'pipeline', 'cram'],
  },
  {
    id: 'fg-031',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'What is Foundry IQ?',
    options: [
      {
        id: 'a',
        text: 'A managed knowledge layer that gives agents permission-aware, cited answers',
        correct: true,
      },
      {
        id: 'b',
        text: 'A benchmark suite that scores how intelligent each model in the catalog is',
        correct: false,
        why: 'The name suggests it, but IQ here refers to the knowledge layer, not a model score.',
      },
      {
        id: 'c',
        text: 'A fine-tuning service that teaches models your company\'s private data',
        correct: false,
        why: 'It does not modify models at all.',
      },
      {
        id: 'd',
        text: 'A monitoring dashboard that tracks agent quality and cost',
        correct: false,
        why: 'That is Foundry Observability.',
      },
    ],
    explanation:
      'A Foundry IQ **knowledge base** is made of **knowledge sources** - Azure Blob Storage, SharePoint, OneLake, public web - plus retrieval parameters. It automates chunking, embedding and metadata extraction, enforces permissions at query time, and returns grounded answers with citations. Multiple agents can share one knowledge base.',
    reference: {
      label: 'What is Foundry IQ?',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/what-is-foundry-iq',
    },
    tags: ['rag', 'foundry-iq', 'currency'],
  },
  {
    id: 'fg-032',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'How does *agentic retrieval* differ from classic RAG?',
    options: [
      {
        id: 'a',
        text: 'It plans parallel subqueries, reranks the results and returns cited grounding data',
        correct: true,
      },
      {
        id: 'b',
        text: 'It skips the index and sends the whole document corpus to the model',
        correct: false,
        why: 'No corpus of any size fits in a context window; retrieval is still essential.',
      },
      {
        id: 'c',
        text: 'It replaces embeddings with keyword search, so it only matches exact words',
        correct: false,
        why: 'It can issue keyword, vector or hybrid queries - it adds capability rather than removing it.',
      },
      {
        id: 'd',
        text: 'It runs the model on the client device to keep retrieval private',
        correct: false,
        why: 'Nothing about where inference runs changes.',
      },
    ],
    explanation:
      'Classic RAG usually issues one query per question. Agentic retrieval plans: it uses conversation history for context, splits the question into subqueries, executes them in parallel, applies semantic ranking, and returns structured results with citations - better for conversational, multi-part questions. Foundry IQ uses agentic retrieval.',
    reference: {
      label: 'Agentic RAG in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/retrieval-augmented-generation',
    },
    tags: ['rag', 'agentic-retrieval', 'hard', 'currency'],
  },
  {
    id: 'fg-033',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Why is chunking necessary when building a knowledge base for RAG?',
    options: [
      {
        id: 'a',
        text: 'Focused passages match precisely and fit the token budget; whole documents do not',
        correct: true,
      },
      {
        id: 'b',
        text: 'Because language models cannot read PDF or Word files directly, only plain text',
        correct: false,
        why: 'Extraction handles the file format. Chunking is about passage size, not file type.',
      },
      {
        id: 'c',
        text: 'To encrypt each part of the document separately before it is indexed',
        correct: false,
        why: 'Chunking has nothing to do with encryption.',
      },
      {
        id: 'd',
        text: 'Because embeddings can only be created from single words',
        correct: false,
        why: 'Embeddings are created from passages of text, not individual words.',
      },
    ],
    explanation:
      'A 90-page handbook embedded as one vector represents everything and therefore nothing. Chunked passages give precise matches and fit comfortably in the prompt. Foundry IQ automates chunking and embedding for indexed knowledge sources.',
    reference: {
      label: 'RAG in Azure AI Search',
      url: 'https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview',
    },
    tags: ['rag', 'chunking'],
  },
  {
    id: 'fg-034',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A grounded assistant returns an answer that is not supported by any of the retrieved passages.',
    prompt: 'Which two responses address the problem most directly?',
    type: 'multi',
    options: [
      {
        id: 'a',
        text: 'Instruct the model in the system prompt to answer only from the provided context and to say it does not know otherwise',
        correct: true,
      },
      {
        id: 'b',
        text: 'Review chunking and retrieval configuration so the right passages are actually being returned',
        correct: true,
      },
      {
        id: 'c',
        text: 'Increase max_tokens',
        correct: false,
        why: 'A longer answer is not a better-grounded one.',
      },
      {
        id: 'd',
        text: 'Switch to a larger model and change nothing else',
        correct: false,
        why: 'A bigger model still cannot cite what retrieval never gave it.',
      },
      {
        id: 'e',
        text: 'Disable citations so users cannot tell',
        correct: false,
        why: 'That hides the failure and undermines transparency.',
      },
    ],
    explanation:
      'Grounding failures come from two places: the model was not told to stay within the context, or retrieval did not supply the right context. Microsoft\'s own troubleshooting guidance names both - enable citations and use clear system messages, and revisit chunking, embedding quality and search configuration.',
    reference: {
      label: 'RAG and indexes in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/retrieval-augmented-generation',
    },
    tags: ['rag', 'hallucination', 'hard', 'multi-select'],
  },
  {
    id: 'fg-035',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which statement about a Foundry IQ knowledge base is correct?',
    options: [
      {
        id: 'a',
        text: 'One knowledge base can be shared by multiple agents',
        correct: true,
      },
      {
        id: 'b',
        text: 'Each agent must have its own dedicated knowledge base',
        correct: false,
        why: 'Sharing one knowledge base across agents is an explicit capability - it is the point of a managed knowledge *layer*.',
      },
      {
        id: 'c',
        text: 'A knowledge base can only connect to a single data source',
        correct: false,
        why: 'A knowledge base is deliberately multi-source: Blob Storage, SharePoint, OneLake and public web can all be knowledge sources in the same base.',
      },
      {
        id: 'd',
        text: 'Knowledge bases cannot return citations',
        correct: false,
        why: 'Returning extractive data with citations so answers can be traced to source documents is one of its headline capabilities.',
      },
    ],
    explanation:
      'Knowledge base = knowledge sources + retrieval parameters, shareable across agents, permission-aware, citation-returning.',
    reference: {
      label: 'What is Foundry IQ?',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/what-is-foundry-iq',
    },
    tags: ['rag', 'foundry-iq'],
  },
  {
    id: 'fg-036',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'What is a vector index used for in a RAG solution?',
    options: [
      {
        id: 'a',
        text: 'Finding passages close in meaning to the query, even with no shared words',
        correct: true,
      },
      {
        id: 'b',
        text: 'Storing the model\'s weights so they load faster at inference time',
        correct: false,
        why: 'Weights live in the model, not in your search index.',
      },
      {
        id: 'c',
        text: 'Caching previous answers so repeated questions cost nothing',
        correct: false,
        why: 'That would be a response cache - a different thing entirely.',
      },
      {
        id: 'd',
        text: 'Compressing documents so the knowledge base uses less storage',
        correct: false,
        why: 'Embeddings are not a storage optimisation; the original text is still needed to build the prompt.',
      },
    ],
    explanation:
      'Vector search matches on semantics rather than exact words, so "how much holiday do I get" retrieves a passage titled "Annual leave entitlement". Hybrid search combines vector and keyword matching for the best of both.',
    reference: {
      label: 'Vector search overview - Azure AI Search',
      url: 'https://learn.microsoft.com/azure/search/vector-search-overview',
    },
    tags: ['rag', 'vector-search'],
  },
  {
    id: 'fg-037',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create a lightweight client application for an agent',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'A sample from an older tutorial calls `create_thread()`, `create_message()` and `create_and_process_run()` against a connection string. What should you know about this for the current exam?',
    options: [
      {
        id: 'a',
        text: 'It is the older Assistants-style API; current samples use agent versions and the Responses API',
        correct: true,
      },
      {
        id: 'b',
        text: 'It is the current recommended pattern for every new agent client, in every SDK language',
        correct: false,
        why: 'It is the older pattern. Current quickstarts set `PROJECT_ENDPOINT`, create agent versions, and use conversations plus responses.',
      },
      {
        id: 'c',
        text: 'Threads and runs are concepts borrowed from Azure Machine Learning training pipelines',
        correct: false,
        why: 'They came from the Assistants API, not Azure ML.',
      },
      {
        id: 'd',
        text: 'Connection strings are the only authentication method Foundry supports',
        correct: false,
        why: 'Microsoft Entra credentials against a project endpoint are the current recommendation.',
      },
    ],
    explanation:
      'You are unlikely to be asked to write this code from memory, but you may be asked to recognise the current shape. Modern flow (azure-ai-projects 2.x): `AIProjectClient(endpoint, credential)` → `agents.create_version(...)` with a `PromptAgentDefinition` → `conversations.create()` → `responses.create()`.',
    reference: {
      label: 'Quickstart: Create a prompt agent',
      url: 'https://learn.microsoft.com/azure/foundry/agents/quickstarts/prompt-agent',
    },
    tags: ['agents', 'sdk', 'currency', 'hard'],
  },
  {
    id: 'fg-038',
    topic: 'foundry-genai-agents',
    moduleId: 'foundry-platform',
    objective: 'Deploy a model and interact with it in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A team wants to try a supported model immediately without creating a deployment. What does Foundry offer?',
    options: [
      {
        id: 'a',
        text: 'Instant access (preview), which calls supported models by name',
        correct: true,
      },
      {
        id: 'b',
        text: 'Nothing - a deployment is always required before the first call',
        correct: false,
        why: 'This used to be true and is a good example of stale study material.',
      },
      {
        id: 'c',
        text: 'You download the model weights and run them locally first',
        correct: false,
        why: 'Not an option for hosted models.',
      },
      {
        id: 'd',
        text: 'You open a support ticket to request temporary model access',
        correct: false,
        why: 'No ticket is involved.',
      },
    ],
    explanation:
      'Instant access (preview) removes the deployment step for trying supported models - during the preview, from projects in West US 3. You still deploy when you need reserved throughput, data residency, custom guardrails or a fine-tuned model. The exam concentrates on GA behaviour but may include commonly used preview features.',
    reference: {
      label: 'Deployment overview for Microsoft Foundry Models',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/deployments-overview',
    },
    tags: ['foundry', 'deployment', 'currency'],
  },
  {
    id: 'fg-039',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'What distinguishes an AI agent from a plain chat completion call?',
    options: [
      {
        id: 'a',
        text: 'It pursues a goal over several steps and can call tools to act',
        correct: true,
      },
      {
        id: 'b',
        text: 'It always uses a larger model than a plain chat call would',
        correct: false,
        why: 'Model size is unrelated; agents can and often do run on small models.',
      },
      {
        id: 'c',
        text: 'It runs on the client device rather than in the cloud',
        correct: false,
        why: 'Foundry agents run in Agent Service.',
      },
      {
        id: 'd',
        text: 'It never uses a system prompt or any other instructions',
        correct: false,
        why: 'An agent\'s instructions play exactly that role.',
      },
    ],
    explanation:
      'Chat completion: one prompt, one answer. Agent: a goal, a loop of reasoning and tool calls, and a result. Tools are what make the difference.',
    reference: {
      label: 'Agents in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
    },
    tags: ['agents', 'definition'],
  },
  {
    id: 'fg-040',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create effective system and user prompts for generative AI models',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which prompting technique most improves a model\'s performance on a multi-step arithmetic or logic problem?',
    options: [
      { id: 'a', text: 'Chain-of-thought - ask the model to reason step by step', correct: true },
      {
        id: 'b',
        text: 'Raising temperature so it explores more possibilities',
        correct: false,
        why: 'More randomness on a problem with one right answer makes things worse.',
      },
      {
        id: 'c',
        text: 'Shortening the prompt to save tokens',
        correct: false,
        why: 'Removing the information needed to reason does not help.',
      },
      {
        id: 'd',
        text: 'Setting a stop sequence',
        correct: false,
        why: 'Stop sequences control where output ends, not how the model reasons.',
      },
    ],
    explanation:
      'Asking for intermediate steps gives the model room to work the problem out in tokens rather than leaping to an answer. For exact arithmetic, better still: give the agent a code interpreter tool.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
    },
    tags: ['prompts', 'chain-of-thought'],
  },
  {
    id: 'fg-041',
    topic: 'foundry-genai-agents',
    moduleId: 'foundry-platform',
    objective: 'Deploy a model and interact with it in the Foundry portal',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'A developer needs to build and test agents in an existing Foundry project. Which built-in role gives them that with least privilege?',
    options: [
      { id: 'a', text: 'Foundry User', correct: true },
      {
        id: 'b',
        text: 'Foundry Account Owner',
        correct: false,
        why: 'It manages resources, projects and model deployments, but it cannot build in a project - it has no data actions there.',
      },
      {
        id: 'c',
        text: 'Owner on the subscription',
        correct: false,
        why: 'Far broader than needed - and even Owner lacks the project data actions needed to build agents.',
      },
      {
        id: 'd',
        text: 'Azure AI Developer',
        correct: false,
        why: 'Despite the name, it is scoped to Azure Machine Learning workspaces and hubs, not to Foundry projects.',
      },
    ],
    explanation:
      'Foundry User (formerly Azure AI User) grants reader access plus the data actions needed to build and test in a project, and nothing more. Foundry Agent Consumer is narrower still: it can only call agent endpoints.',
    reference: {
      label: 'Role-based access control for Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/rbac-foundry',
    },
    tags: ['rbac', 'foundry', 'currency'],
  },
  {
    id: 'fg-042',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create a lightweight chat client application by using the Foundry SDK',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A chat client uses the current Foundry SDK and has created an `AIProjectClient` for the project endpoint. Which call sends the user\'s prompt to a deployed model?',
    options: [
      {
        id: 'a',
        text: '`get_openai_client()`, then `responses.create(model=..., input=...)`',
        correct: true,
      },
      {
        id: 'b',
        text: '`from_connection_string(...)`, then `create_and_process_run()`',
        correct: false,
        why: 'That is the older 1.x, Assistants-style pattern. Current samples use a project endpoint and the Responses API.',
      },
      {
        id: 'c',
        text: '`agents.create_version()` for every message the user sends',
        correct: false,
        why: 'That creates a new agent version. A plain chat client does not need an agent at all.',
      },
      {
        id: 'd',
        text: 'A request to `management.azure.com` with the deployment name',
        correct: false,
        why: 'That is the Azure Resource Manager control plane for managing resources. Inference goes to the project endpoint.',
      },
    ],
    explanation:
      'With azure-ai-projects 2.x, you get an OpenAI-compatible client from the project and call the Responses API, passing the deployment name as `model`, optional `instructions` for the system prompt, and the user `input`. The reply is in `response.output_text`.',
    reference: {
      label: 'Quickstart: Get started with Microsoft Foundry SDK',
      url: 'https://learn.microsoft.com/azure/foundry/quickstarts/get-started-code',
    },
    tags: ['sdk', 'chat-client', 'responses-api', 'currency'],
  },
  {
    id: 'fg-043',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A utility company wants an assistant that answers customer phone calls in real time, using its own instructions and tools. The team does not want to host or maintain any speech orchestration code.',
    prompt: 'What should they build in Foundry Agent Service?',
    options: [
      { id: 'a', text: 'A voice-based prompt agent, which runs on Voice Live', correct: true },
      {
        id: 'b',
        text: 'A hosted agent that chains speech to text, a model and text to speech in its own code',
        correct: false,
        why: 'That can work, but it means writing and maintaining the voice orchestration - exactly what the team wants to avoid.',
      },
      {
        id: 'c',
        text: 'A text prompt agent, plus batch transcription of each call afterwards',
        correct: false,
        why: 'Batch transcription processes recordings after the fact. It cannot hold a live conversation.',
      },
      {
        id: 'd',
        text: 'Content Understanding with an audio analyzer',
        correct: false,
        why: 'Content Understanding extracts structure from recordings. It does not talk to callers.',
      },
    ],
    explanation:
      'Voice-based prompt agents (preview) are managed agents for spoken conversations: you configure the model, instructions, voice, audio settings and tools, and Foundry runs the agent over Voice Live, which handles speech recognition, turn-taking and speech synthesis. Phone channels such as Teams Phone and Twilio can connect to it.',
    reference: {
      label: 'Agents in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
    },
    tags: ['agents', 'voice', 'currency'],
  },
  {
    id: 'fg-044',
    topic: 'foundry-genai-agents',
    moduleId: 'rag-foundry-iq',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'A Foundry IQ knowledge base must draw on a SharePoint site without copying its content into a search index. Which kind of knowledge source fits?',
    options: [
      { id: 'a', text: 'A remote knowledge source, queried live at retrieval time', correct: true },
      {
        id: 'b',
        text: 'An indexed knowledge source, refreshed on a schedule',
        correct: false,
        why: 'Indexed sources ingest content into a search index - the copying the requirement rules out.',
      },
      {
        id: 'c',
        text: 'A model fine-tuned on the SharePoint documents',
        correct: false,
        why: 'Fine-tuning changes behaviour, not knowledge, and gives no citations or permission checks.',
      },
      {
        id: 'd',
        text: 'A larger context window, with the site pasted into every prompt',
        correct: false,
        why: 'No context window holds a whole site, and permissions could not be enforced per user.',
      },
    ],
    explanation:
      'Knowledge sources are either **indexed** - ingested into a search index with automatic chunking, vectorising and permission sync (Blob Storage, OneLake, SharePoint, an existing index) - or **remote**, queried live with nothing stored (SharePoint through the Copilot Retrieval API, the web through Grounding with Bing).',
    reference: {
      label: 'What is a knowledge source? - Azure AI Search',
      url: 'https://learn.microsoft.com/azure/search/agentic-knowledge-source-overview',
    },
    tags: ['foundry-iq', 'rag', 'currency'],
  },
  {
    id: 'fg-045',
    topic: 'foundry-genai-agents',
    moduleId: 'foundry-platform',
    objective: 'Create a lightweight client application for an agent',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A web app\'s managed identity needs to send requests to one published agent. It must not be able to create or change agents, or reach any other agent in the project.',
    prompt: 'Which role assignment fits?',
    options: [
      { id: 'a', text: 'Foundry Agent Consumer, scoped to that agent', correct: true },
      {
        id: 'b',
        text: 'Foundry User, scoped to the Foundry resource',
        correct: false,
        why: 'That also grants the data actions to build and change things in projects - more than calling one agent needs.',
      },
      {
        id: 'c',
        text: 'Foundry Owner, scoped to the project',
        correct: false,
        why: 'A highly privileged role with full management rights. The opposite of least privilege.',
      },
      {
        id: 'd',
        text: 'Cognitive Services User, scoped to the resource',
        correct: false,
        why: 'Microsoft advises against Cognitive Services roles for Foundry work; they are designed for direct access to AI Services resources.',
      },
    ],
    explanation:
      'Foundry Agent Consumer is the least-privilege role for principals that only interact with agents. At agent scope it covers that one agent\'s endpoint; at project scope it covers every agent in the project.',
    reference: {
      label: 'Role-based access control for Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/rbac-foundry',
    },
    tags: ['rbac', 'agents', 'currency'],
  },
];
