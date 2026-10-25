import type { AuthoredQuestion } from '../types';

/**
 * Scenario bank, part two: the Domain 2 implementation topics.
 *
 * These lean hard on the details that changed after AI-900 - Foundry resources
 * and projects, prompt vs. hosted agents, Foundry IQ, current model families,
 * and Content Understanding.
 */
export const foundryScenarioQuestions: AuthoredQuestion[] = [
  /* =================================================================
   * Gen AI apps and agents
   * ================================================================= */
  {
    id: 'sc-fg-01',
    topic: 'foundry-genai-agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A small team wants an internal HR assistant live by Friday. Nobody wants to maintain a container, and the behaviour is simple: answer from the handbook, escalate anything about pay.',
    prompt: 'What should they build?',
    options: [
      {
        id: 'a',
        text: 'A prompt agent with instructions and a knowledge tool, authored in the Foundry portal',
        correct: true,
      },
      {
        id: 'b',
        text: 'A hosted agent built with Agent Framework and shipped as a container image',
        correct: false,
        why: 'That gives control they do not need, and adds container compute plus runtime code to maintain - the opposite of the stated requirement.',
      },
      {
        id: 'c',
        text: 'A fine-tuned model trained on the handbook',
        correct: false,
        why: 'Fine-tuning does not add citable knowledge, and every handbook update would mean retraining.',
      },
      {
        id: 'd',
        text: 'A custom orchestration service that calls the Responses API on a schedule',
        correct: false,
        why: 'More infrastructure for no benefit here.',
      },
    ],
    explanation:
      'Prompt agents are the recommended starting point: define instructions, a model and tools, and Foundry runs it with no code or infrastructure. Escalation behaviour goes in the instructions.',
    reference: {
      label: 'Agents in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview',
      quote:
        'You define prompt agents entirely through configuration, including instructions, model selection, and tools. Author them in the Foundry portal for a quick start, or define them programmatically with the SDKs or REST API to integrate with your CI/CD workflows.',
    },
    tags: ['agents', 'prompt-vs-hosted'],
  },
  {
    id: 'sc-fg-02',
    topic: 'foundry-genai-agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A platform team has an existing multi-agent orchestration built with LangGraph. They want Azure to host it with a managed endpoint, autoscaling and its own Entra identity, without rewriting it.',
    prompt: 'Which approach fits?',
    options: [
      { id: 'a', text: 'Deploy it as a hosted agent', correct: true },
      {
        id: 'b',
        text: 'Rebuild it as a prompt agent',
        correct: false,
        why: 'Prompt agents are declarative. Custom orchestration logic cannot be expressed as configuration, and the requirement explicitly rules out a rewrite.',
      },
      {
        id: 'c',
        text: 'Run it on their own VMs and call Foundry models over the network',
        correct: false,
        why: 'Possible, but it forfeits the managed endpoint, autoscaling and per-agent identity they asked for.',
      },
      {
        id: 'd',
        text: 'Convert it into a Foundry IQ knowledge base',
        correct: false,
        why: 'Foundry IQ is a knowledge layer, not an agent runtime.',
      },
    ],
    explanation:
      'Hosted agents exist for exactly this: bring code built with Agent Framework, LangGraph, the OpenAI or Anthropic Agent SDKs, or your own, as a container or zip, and Foundry runs it with a managed endpoint, scaling, a dedicated Entra identity and end-to-end observability.',
    reference: {
      label: 'Hosted agents in Foundry Agent Service',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents',
      quote:
        "Every Hosted agent deployed to a Foundry project gets its own dedicated Microsoft Entra ID (agent identity) and dedicated endpoint - both created automatically at deploy time. You don't need to configure managed identities or routing manually.",
    },
    tags: ['agents', 'hosted', 'currency', 'hard'],
  },
  {
    id: 'sc-fg-03',
    topic: 'foundry-genai-agents',
    objective: 'Create effective system and user prompts for generative AI models',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'An assistant must always return JSON with exactly the keys `summary`, `sentiment` and `nextAction`, but it keeps adding prose around the JSON.',
    prompt: 'What is the most effective fix?',
    options: [
      {
        id: 'a',
        text: 'State the format in the system message, with an example of it',
        correct: true,
      },
      {
        id: 'b',
        text: 'Raise the temperature so the model is more flexible',
        correct: false,
        why: 'More randomness makes format adherence worse, not better.',
      },
      {
        id: 'c',
        text: 'Fine-tune the model on 10,000 examples of the JSON',
        correct: false,
        why: 'Enormously more expensive than a format instruction that usually solves it outright. Prompt first.',
      },
      {
        id: 'd',
        text: 'Reduce max_tokens so there is no room left for prose',
        correct: false,
        why: 'That truncates the JSON instead of removing the prose.',
      },
    ],
    explanation:
      'Format problems are prompt problems first. State the schema explicitly, show one example of it, and - if the model supports it - use structured output. Few-shot examples are the cheapest reliable way to pin down a format.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
      quote:
        'When using the Chat Completions API, a series of messages between the User and Assistant (written in the new prompt format), can serve as examples for few-shot learning.',
    },
    tags: ['prompts', 'format', 'trap'],
  },
  {
    id: 'sc-fg-04',
    topic: 'foundry-genai-agents',
    objective: 'Deploy a model and interact with it in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A developer has followed an older tutorial. It tells them to create an Azure Storage account, a Key Vault and an AI hub before they can create a project and deploy a model.',
    prompt: 'What should they conclude?',
    options: [
      {
        id: 'a',
        text: 'It describes the classic hub model; Foundry projects need none of them',
        correct: true,
      },
      {
        id: 'b',
        text: 'Those resources are still mandatory for every Foundry project',
        correct: false,
        why: 'They were mandatory for hub-based projects. Foundry projects do not require them.',
      },
      {
        id: 'c',
        text: 'Storage and Key Vault are still needed, but the hub is optional',
        correct: false,
        why: 'The dependent-resource requirement came with the hub. Without a hub, it does not apply.',
      },
      {
        id: 'd',
        text: 'The tutorial is about Azure Machine Learning, not about Foundry',
        correct: false,
        why: 'Hubs are an implementation of Azure Machine Learning, so the confusion is understandable - but the tutorial genuinely is about Foundry, in its earlier form.',
      },
    ],
    explanation:
      'Hub-based projects are the classic path; new investment is in Foundry projects, which are child resources of a Foundry resource and need no separate storage or key vault.',
    reference: {
      label: 'Migrate from hub-based to Foundry projects',
      url: 'https://learn.microsoft.com/azure/foundry-classic/how-to/migrate-project',
      quote:
        'Projects are now child resources; they might be assigned their own admin controls like Azure RBAC, but by default share common settings from their parent resource.',
    },
    tags: ['foundry', 'currency', 'trap'],
  },
  {
    id: 'sc-fg-05',
    topic: 'foundry-genai-agents',
    objective: 'Create a lightweight client application for an agent',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A web app calls a Foundry agent. Security review rejects the design because the API key is read from an environment variable on a shared host.',
    prompt: 'What should the team change?',
    options: [
      {
        id: 'a',
        text: 'Authenticate with Microsoft Entra ID using a managed identity instead of a key',
        correct: true,
      },
      {
        id: 'b',
        text: 'Move the key into the source code so it is not in the environment',
        correct: false,
        why: 'Strictly worse - the key ends up in version control.',
      },
      {
        id: 'c',
        text: 'Rotate the key every 24 hours and keep the current design',
        correct: false,
        why: 'Rotation reduces exposure time but does not remove the shared secret, which is what the review objected to.',
      },
      {
        id: 'd',
        text: 'Disable authentication and restrict by IP address',
        correct: false,
        why: 'Inference endpoints always require authentication, and IP allow-listing is not an identity control.',
      },
    ],
    explanation:
      'Keyless authentication is the recommendation. `DefaultAzureCredential` is convenient in development; in production prefer a specific credential such as a managed identity, which avoids unintended credential probing.',
    reference: {
      label: 'Role-based access control for Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/rbac-foundry',
      quote:
        'Microsoft recommends using Entra ID authentication for improved security and granular access control.',
    },
    tags: ['sdk', 'auth', 'security'],
  },
  {
    id: 'sc-fg-06',
    topic: 'foundry-genai-agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'Five teams have each configured their own copies of the same tools - a web search, an internal API and a code interpreter - with different credentials and versions. Security wants one governed set.',
    prompt: 'What does Foundry provide for this?',
    options: [
      {
        id: 'a',
        text: 'A toolbox, shared by all agents through one governed endpoint',
        correct: true,
      },
      {
        id: 'b',
        text: 'A Foundry IQ knowledge base that every team connects to',
        correct: false,
        why: 'That is the shared *knowledge* layer. Tools are a different concern.',
      },
      {
        id: 'c',
        text: 'One shared model deployment that all five teams call',
        correct: false,
        why: 'Sharing a deployment does nothing about tool configuration.',
      },
      {
        id: 'd',
        text: 'An AI hub, so that all five teams share security settings',
        correct: false,
        why: 'Hubs share security configuration across projects; they do not curate tools.',
      },
    ],
    explanation:
      'Toolboxes are the governance answer for tools, exactly as Foundry IQ knowledge bases are for knowledge: define once, share across agents, manage authentication and versioning centrally.',
    reference: {
      label: 'What is Toolbox in Microsoft Foundry?',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/toolbox-overview',
      quote:
        'Toolbox addresses these challenges by allowing teams to define and manage tools centrally and expose them through a single MCP-compatible endpoint.',
    },
    tags: ['agents', 'toolbox', 'currency', 'hard'],
  },
  {
    id: 'sc-fg-07',
    topic: 'foundry-genai-agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A grounded assistant answers correctly but users complain they cannot tell where the answers came from and do not trust it.',
    prompt: 'Which change addresses the complaint, and which principle does it serve?',
    options: [
      { id: 'a', text: 'Return citations with each answer - transparency', correct: true },
      {
        id: 'b',
        text: 'Lower the temperature - reliability and safety',
        correct: false,
        why: 'The answers are already correct. Consistency is not the issue; traceability is.',
      },
      {
        id: 'c',
        text: 'Add a content filter - reliability and safety',
        correct: false,
        why: 'Filters block harmful content. They do not show sources.',
      },
      {
        id: 'd',
        text: 'Enable permission-aware retrieval - privacy and security',
        correct: false,
        why: 'Important for authorisation, but it does not tell the reader where an answer came from.',
      },
    ],
    explanation:
      'Citations are a key transparency feature of a grounded assistant, and returning extractive data with citations so answers trace back to source documents is a headline Foundry IQ capability.',
    reference: {
      label: 'What is Foundry IQ?',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/what-is-foundry-iq',
      quote:
        'Return extractive data with citations so agents can reason over raw content and trace answers to source documents.',
    },
    tags: ['rag', 'transparency', 'cross-topic'],
  },
  {
    id: 'sc-fg-08',
    topic: 'foundry-genai-agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A knowledge base spans Blob Storage, SharePoint and a set of public web pages. Two different agents need to query it, and answers must respect each caller\'s permissions.',
    prompt: 'Which statement about this design is correct?',
    options: [
      {
        id: 'a',
        text: 'One knowledge base can hold all three, serve both agents, and check permissions',
        correct: true,
      },
      {
        id: 'b',
        text: 'Each source needs its own knowledge base, and each agent its own copy',
        correct: false,
        why: 'A knowledge base is deliberately multi-source and shareable across agents. Duplicating it is exactly what the managed knowledge layer removes.',
      },
      {
        id: 'c',
        text: 'Permissions must be checked in the app, because retrieval cannot do it',
        correct: false,
        why: 'Foundry IQ synchronises access control lists, honours Purview sensitivity labels, and can run queries under the caller\'s Entra identity.',
      },
      {
        id: 'd',
        text: 'Public web pages cannot be used as a knowledge source at all',
        correct: false,
        why: 'Public web is a supported knowledge source alongside Blob Storage, SharePoint and OneLake.',
      },
    ],
    explanation:
      'Knowledge base = knowledge sources + retrieval parameters. Multi-source, shareable across agents, permission-aware at query time, and citation-returning.',
    reference: {
      label: 'What is Foundry IQ?',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/what-is-foundry-iq',
      quote:
        'A knowledge base consists of knowledge sources (connections to internal and external data stores) and parameters that control retrieval behavior. Multiple agents can share the same knowledge base.',
    },
    tags: ['rag', 'foundry-iq', 'hard'],
  },
  {
    id: 'sc-fg-09',
    topic: 'foundry-genai-agents',
    objective: 'Create effective system and user prompts for generative AI models',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A model is asked "If a train leaves at 14:20 and the journey takes 2h 47m, when does it arrive, and is that before the 17:00 meeting?" It gets the arithmetic wrong.',
    prompt: 'Which two responses are most likely to help? (Choose two.)',
    type: 'multi',
    options: [
      { id: 'a', text: 'Ask the model to reason step by step before answering', correct: true },
      { id: 'b', text: 'Give the agent a code interpreter tool to compute the result exactly', correct: true },
      {
        id: 'c',
        text: 'Raise the temperature so it explores more possibilities',
        correct: false,
        why: 'There is one right answer. More randomness makes it less likely to be found.',
      },
      {
        id: 'd',
        text: 'Increase max_tokens to 8000',
        correct: false,
        why: 'Length is not the constraint.',
      },
      {
        id: 'e',
        text: 'Add the question to the system message instead of the user message',
        correct: false,
        why: 'The role of the message does not change the model\'s arithmetic.',
      },
    ],
    explanation:
      'Chain-of-thought gives the model room to work rather than leaping to an answer. For exact computation, a code interpreter tool is better still - it does not estimate, it calculates.',
    reference: {
      label: 'Prompt engineering techniques',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/prompt-engineering',
      quote:
        'Instead of splitting a task into smaller steps, in this approach, the model response is instructed to proceed step-by-step and present all the steps involved.',
    },
    tags: ['prompts', 'chain-of-thought', 'agents', 'multi-select'],
  },
  {
    id: 'sc-fg-10',
    topic: 'foundry-genai-agents',
    objective: 'Create a lightweight chat client application by using the Foundry SDK',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A chat client works in the playground but returns "model not found" from code.',
    prompt: 'What is the most likely cause?',
    options: [
      {
        id: 'a',
        text: 'The code passes the model name, not the deployment name',
        correct: true,
      },
      {
        id: 'b',
        text: 'The model was retired between the playground test and the call',
        correct: false,
        why: 'It just worked in the playground against the same project.',
      },
      {
        id: 'c',
        text: 'The temperature value is outside the allowed range',
        correct: false,
        why: 'An invalid parameter produces a different error.',
      },
      {
        id: 'd',
        text: 'The prompt is too large for the model\'s context window',
        correct: false,
        why: 'That would produce a token-limit error, not "model not found".',
      },
    ],
    explanation:
      'Client code references the **deployment name** you chose when you deployed, which need not match the model name. Endpoint plus deployment name plus credential is the trio to check whenever a call fails to resolve.',
    reference: {
      label: 'Work with chat completion models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/chatgpt',
      quote:
        '400/404 (deployment not found): Confirm that model matches your deployment name.',
    },
    tags: ['sdk', 'troubleshooting'],
  },
  {
    id: 'sc-fg-11',
    topic: 'foundry-genai-agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    type: 'order',
    prompt: 'Put the steps for building and shipping a prompt agent in order.',
    items: [
      { id: 'a1', text: 'Deploy a model in your Foundry project' },
      { id: 'a2', text: 'Create the agent and name it' },
      { id: 'a3', text: 'Write its instructions: persona, scope, rules, escalation' },
      { id: 'a4', text: 'Attach tools and knowledge' },
      { id: 'a5', text: 'Test in the agents playground and inspect the tool calls' },
      { id: 'a6', text: 'Take the code snippet into your application' },
    ],
    explanation:
      'Note that the name is chosen early and cannot be changed afterwards - in code the agent is referenced as `<name>:<version>`.',
    reference: {
      label: 'Agent development lifecycle',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/development-lifecycle',
      quote:
        'If you already know what kind of agent you want to create, name it and then start configuring its model instructions and tools.',
    },
    tags: ['agents', 'workflow', 'cram'],
  },
  {
    id: 'sc-fg-12',
    topic: 'foundry-genai-agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'An assistant grounded on a 900-page manual gives vague answers. Logs show retrieval returns whole chapters.',
    prompt: 'What is the most likely problem?',
    options: [
      {
        id: 'a',
        text: 'Chunks are far too large, so passages are unfocused',
        correct: true,
      },
      {
        id: 'b',
        text: 'The temperature is too low for a large manual',
        correct: false,
        why: 'Low temperature makes answers focused, not vague. This is a retrieval problem.',
      },
      {
        id: 'c',
        text: 'The model is too small to read a 900-page manual',
        correct: false,
        why: 'A larger model given an entire chapter still has to find the relevant sentence in it.',
      },
      {
        id: 'd',
        text: 'Citations are disabled, so answers lose precision',
        correct: false,
        why: 'Citations affect traceability, not answer quality.',
      },
    ],
    explanation:
      'Chunking is the most common cause of poor RAG quality. Microsoft\'s own troubleshooting guidance points first at chunking strategy, embedding model quality, and search configuration when retrieval returns irrelevant or unfocused passages.',
    reference: {
      label: 'RAG in Azure AI Search',
      url: 'https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview',
      quote:
        'During indexing, use chunking to subdivide large documents so that portions can be matched on independently.',
    },
    tags: ['rag', 'chunking', 'troubleshooting', 'hard'],
  },
  {
    id: 'sc-fg-13',
    topic: 'foundry-genai-agents',
    objective: 'Create and test a single-agent solution in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A support agent must answer multi-part conversational questions like "what changed since the version I asked about earlier, and does it affect our contract?"',
    prompt: 'Which retrieval approach suits this best?',
    options: [
      { id: 'a', text: 'Agentic retrieval', correct: true },
      {
        id: 'b',
        text: 'Classic single-query RAG',
        correct: false,
        why: 'One query cannot easily cover a multi-part question that also depends on earlier conversation context.',
      },
      {
        id: 'c',
        text: 'Keyword search only',
        correct: false,
        why: 'It would miss semantically related passages and has no notion of conversation history.',
      },
      {
        id: 'd',
        text: 'Fine-tuning on the contract corpus',
        correct: false,
        why: 'Fine-tuning does not retrieve, cannot cite, and goes stale the moment a document changes.',
      },
    ],
    explanation:
      'Microsoft\'s guidance is explicit: use agentic retrieval when the client is an agent or chatbot, queries are complex or conversational, and you want structured responses with citations. It uses conversation history for context and decomposes the question into parallel subqueries.',
    reference: {
      label: 'Agentic retrieval overview - Azure AI Search',
      url: 'https://learn.microsoft.com/azure/search/agentic-retrieval-overview',
      quote:
        'Use agentic retrieval when you want to provide agents and apps with the most relevant content for answering harder questions, drawing on chat context, your proprietary content, and external sources.',
    },
    tags: ['rag', 'agentic-retrieval', 'currency'],
  },
  {
    id: 'sc-fg-14',
    topic: 'foundry-genai-agents',
    objective: 'Deploy a model and interact with it in the Foundry portal',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'An organisation wants security, networking and policy configured once by its platform team, while each product team organises its own work independently.',
    prompt: 'How does Foundry support this?',
    options: [
      {
        id: 'a',
        text: 'Set it once on the Foundry resource; team projects inherit it',
        correct: true,
      },
      {
        id: 'b',
        text: 'Give every product team its own Azure subscription',
        correct: false,
        why: 'Heavy-handed, and it multiplies the governance work rather than centralising it.',
      },
      {
        id: 'c',
        text: 'Configure security separately in each team\'s project',
        correct: false,
        why: 'That is exactly the duplication the resource-and-project model removes.',
      },
      {
        id: 'd',
        text: 'Use one shared project for every team in the organisation',
        correct: false,
        why: 'It gives no separation of work at all.',
      },
    ],
    explanation:
      'The stated design goal is to take IT admins out of the day-to-day loop: establish security, connectivity and governance once at the resource, and let developers create projects as folders to organise their own work.',
    reference: {
      label: 'Microsoft Foundry architecture',
      url: 'https://learn.microsoft.com/azure/foundry/concepts/architecture',
      quote:
        'Foundry resource: Top-level Azure resource where you manage governance settings such as networking, security, and model deployments.',
    },
    tags: ['foundry', 'architecture', 'rbac'],
  },

  /* =================================================================
   * Text and speech
   * ================================================================= */
  {
    id: 'sc-ts-01',
    topic: 'foundry-text-speech',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'An app must show a call-centre supervisor, per call: the overall mood, the topics raised, and any personal data that needs masking before archiving.',
    prompt: 'Which three prebuilt Azure Language features does this need?',
    options: [
      {
        id: 'a',
        text: 'Sentiment analysis, key phrase extraction, and PII detection',
        correct: true,
      },
      {
        id: 'b',
        text: 'Custom text classification, custom NER, and CLU',
        correct: false,
        why: 'All three require labelled training data for capabilities that already exist prebuilt.',
      },
      {
        id: 'c',
        text: 'Language detection, entity linking, and summarization',
        correct: false,
        why: 'None of these three give mood, topics, or masked personal data.',
      },
      {
        id: 'd',
        text: 'Question answering, orchestration workflow, and CLU',
        correct: false,
        why: 'Those are conversational capabilities, not analysis of a completed call.',
      },
    ],
    explanation:
      'Three requirements, three prebuilt features, no training data. Reach for custom capabilities only when the categories or entities are specific to that business.',
    reference: {
      label: 'Understand text analysis in Foundry - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-text-analysis-azure/2-azure-language',
      quote:
        'Key phrase extraction lists the main concepts from unstructured text.',
    },
    tags: ['language', 'routing'],
  },
  {
    id: 'sc-ts-02',
    topic: 'foundry-text-speech',
    objective: 'Respond to spoken prompts by using a deployed multimodal model',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A wellbeing helpline prototype must notice when a caller sounds distressed and adapt its tone, replying aloud within about a second.',
    prompt: 'Which architecture is appropriate, and why?',
    options: [
      {
        id: 'a',
        text: 'A multimodal model that takes audio directly: tone survives and there is one hop',
        correct: true,
      },
      {
        id: 'b',
        text: 'Speech to text, then a text model, then text to speech, because each stage can be tuned',
        correct: false,
        why: 'Transcription discards exactly the signal the scenario depends on - how the caller sounds - and three sequential services will not hit a one-second budget comfortably.',
      },
      {
        id: 'c',
        text: 'Batch transcription followed by sentiment analysis',
        correct: false,
        why: 'Batch is asynchronous and offline. Unusable for a live call.',
      },
      {
        id: 'd',
        text: 'Text to speech with a custom voice',
        correct: false,
        why: 'It shapes the reply but does nothing to understand the caller.',
      },
    ],
    explanation:
      'Two clues point the same way: acoustic nuance must be preserved, and latency is tight. Both are the standard arguments for a native multimodal audio model over a cascade.',
    reference: {
      label: 'Agents in Microsoft Foundry: how voice-based agents work',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview#how-voice-based-agents-work',
      quote:
        'This architecture is optimized for natural, low-latency conversation. The realtime model handles spoken input and output directly.',
    },
    tags: ['speech', 'multimodal', 'hard'],
  },
  {
    id: 'sc-ts-03',
    topic: 'foundry-text-speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A museum wants audio guides in twelve languages, all spoken in the museum\'s own established brand voice.',
    prompt: 'What does this require?',
    options: [
      {
        id: 'a',
        text: 'Text to speech with a professional custom voice (Limited Access)',
        correct: true,
      },
      {
        id: 'b',
        text: 'Speech translation alone, using a standard multilingual voice',
        correct: false,
        why: 'Translation handles the languages but not a specific brand voice identity.',
      },
      {
        id: 'c',
        text: 'SSML prosody adjustments that reshape a standard voice',
        correct: false,
        why: 'SSML bends an existing voice; it cannot create a new voice identity.',
      },
      {
        id: 'd',
        text: 'Batch transcription of the museum\'s existing audio guides',
        correct: false,
        why: 'Wrong direction - that is speech to text.',
      },
    ],
    explanation:
      'A professional custom voice is fine-tuned from studio recordings of a voice talent and is the way to get a distinctive branded voice in any of the languages it supports. Because voice cloning is sensitive, custom voice is Limited Access, and the voice talent must record a consent statement before training.',
    reference: {
      label: 'Custom voice overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/custom-neural-voice',
      quote:
        'Custom voice access is limited based on eligibility and usage criteria.',
    },
    tags: ['speech', 'custom-voice', 'responsible-ai'],
  },
  {
    id: 'sc-ts-04',
    topic: 'foundry-text-speech',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A team must classify incoming messages into their own eight internal product areas. They have 2,000 historical messages already labelled by staff.',
    prompt: 'What is the appropriate approach?',
    options: [
      { id: 'a', text: 'Custom text classification, trained on the labelled data', correct: true },
      {
        id: 'b',
        text: 'Prebuilt sentiment analysis on each incoming message',
        correct: false,
        why: 'It returns mood, not product area.',
      },
      {
        id: 'c',
        text: 'Key phrase extraction to surface each message\'s topics',
        correct: false,
        why: 'It surfaces topics but does not assign a message to one of eight defined categories.',
      },
      {
        id: 'd',
        text: 'Entity linking against the product catalogue',
        correct: false,
        why: 'It disambiguates mentions against a knowledge base - a different job entirely.',
      },
    ],
    explanation:
      'Categories specific to the business plus labelled examples available is the textbook case for custom text classification. With no labelled data, a generative model with a good few-shot prompt is the pragmatic alternative.',
    reference: {
      label: 'What is custom text classification?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/custom-text-classification/overview',
      quote:
        "It's a cloud-based API service that applies machine-learning intelligence to enable you to build custom models for text classification tasks.",
    },
    tags: ['language', 'custom-classification'],
  },
  {
    id: 'sc-ts-05',
    topic: 'foundry-text-speech',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A team wants an agent to be able to run sentiment analysis and PII detection as tools during a conversation, rather than the application calling those APIs beforehand.',
    prompt: 'What makes that possible?',
    options: [
      {
        id: 'a',
        text: 'Azure Language\'s MCP server (preview), which an agent can call as a tool',
        correct: true,
      },
      {
        id: 'b',
        text: 'It is not possible; Language features can only be called directly by application code',
        correct: false,
        why: 'Azure Language offers an MCP server (preview), either as a remote endpoint on your Foundry resource or self-hosted.',
      },
      {
        id: 'c',
        text: 'The agent must be fine-tuned on sentiment data',
        correct: false,
        why: 'Fine-tuning does not give an agent the ability to call a service.',
      },
      {
        id: 'd',
        text: 'Only Content Understanding can be used as an agent tool',
        correct: false,
        why: 'Agents can use many tools, including MCP servers.',
      },
    ],
    explanation:
      'Prebuilt capabilities are increasingly reachable as *tools an agent can call*, not just APIs your code calls. Toolboxes then govern which agents get which tools.',
    reference: {
      label: 'Azure Language in Foundry Tools: tools and agents',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/concepts/foundry-tools-agents',
      quote:
        'The Azure Language MCP server in the Foundry portal connects agents to Azure Language services through the Model Context Protocol (MCP). This integration helps you build conversational applications that can call Azure Language capabilities as tools.',
    },
    tags: ['language', 'agents', 'mcp', 'hard', 'currency'],
  },
  {
    id: 'sc-ts-06',
    topic: 'foundry-text-speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A live webinar needs on-screen captions as the speaker talks, in the same language.',
    prompt: 'Which capability and mode?',
    options: [
      { id: 'a', text: 'Real-time speech to text', correct: true },
      {
        id: 'b',
        text: 'Batch transcription of the session recording',
        correct: false,
        why: 'Batch is asynchronous and processes stored files. Captions must appear as the speaker talks.',
      },
      {
        id: 'c',
        text: 'Speech translation',
        correct: false,
        why: 'Only needed if the captions must be in a different language.',
      },
      {
        id: 'd',
        text: 'Text to speech',
        correct: false,
        why: 'Wrong direction.',
      },
    ],
    explanation:
      'Live and streaming means real-time. Files sitting in storage means batch. The scenario always tells you which.',
    reference: {
      label: 'Speech to text overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/speech-to-text',
      quote:
        "Real-time speech to text transcribes audio as it's recognized from a microphone or file.",
    },
    tags: ['speech', 'batch-vs-realtime'],
  },
  {
    id: 'sc-ts-07',
    topic: 'foundry-text-speech',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A regulator requires that summaries of medical discharge notes use only sentences that appear in the original document.',
    prompt: 'Which summarization approach is compliant?',
    options: [
      { id: 'a', text: 'Extractive summarization', correct: true },
      {
        id: 'b',
        text: 'Abstractive summarization',
        correct: false,
        why: 'It generates new wording, which is exactly what the regulator has ruled out.',
      },
      {
        id: 'c',
        text: 'A generative model asked to summarise faithfully',
        correct: false,
        why: 'An instruction to be faithful is not a guarantee of verbatim wording.',
      },
      {
        id: 'd',
        text: 'Key phrase extraction',
        correct: false,
        why: 'Phrases are not sentences, and the result would not read as a summary.',
      },
    ],
    explanation:
      'Verbatim, evidentiary or compliance requirements always point to extractive summarization, which selects source sentences unchanged.',
    reference: {
      label: 'What is summarization in Azure Language?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/summarization/overview',
      quote:
        'Extractive summarization: Produces a summary by extracting salient sentences within the source text, together the positioning information of these sentences.',
    },
    tags: ['language', 'summarization', 'trap'],
  },
  {
    id: 'sc-ts-08',
    topic: 'foundry-text-speech',
    objective: 'Respond to spoken prompts by using a deployed multimodal model',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A team must decide between a cascade and a native multimodal audio model for a kiosk assistant. The kiosk must speak in the company\'s licensed brand voice, and the transcript must be logged for audit.',
    prompt: 'Which architecture fits better, and why?',
    options: [
      {
        id: 'a',
        text: 'The cascade: it yields a transcript and lets you pick the voice',
        correct: true,
      },
      {
        id: 'b',
        text: 'The native multimodal model, because it is always the better choice',
        correct: false,
        why: 'It is better for latency and acoustic nuance, but it constrains you to the model\'s voices and does not naturally yield a separate transcript.',
      },
      {
        id: 'c',
        text: 'Neither - meeting both requirements needs fine-tuning',
        correct: false,
        why: 'Nothing here calls for changing model behaviour.',
      },
      {
        id: 'd',
        text: 'The cascade, because multimodal models cannot accept audio input',
        correct: false,
        why: 'They can. The right reason is voice control and the audit transcript, not a capability gap.',
      },
    ],
    explanation:
      'A useful counterweight to the usual answer: the cascade wins when you need stage-by-stage control - a specific licensed voice, and a transcript you can log and audit.',
    reference: {
      label: 'Agents in Microsoft Foundry: how voice-based agents work',
      url: 'https://learn.microsoft.com/azure/foundry/agents/overview#how-voice-based-agents-work',
      quote:
        'This architecture provides broader text-model and Azure voice choices. It also provides explicit control over transcription, phrase lists, turn detection, and interim responses, but each stage contributes to end-to-end latency.',
    },
    tags: ['speech', 'multimodal', 'architecture'],
  },
  {
    id: 'sc-ts-09',
    topic: 'foundry-text-speech',
    objective: 'Build a lightweight application that includes text analysis',
    difficulty: 'easy',
    kind: 'exam',
    scenario:
      'An app shows a confidence score of 0.94 alongside a "negative" label for a review.',
    prompt: 'What does that score mean?',
    options: [
      {
        id: 'a',
        text: 'How confident the model is that the negative label is correct',
        correct: true,
      },
      {
        id: 'b',
        text: 'How negative the review is, on a scale from 0 to 1',
        correct: false,
        why: 'A common misreading. Sentiment analysis returns confidence scores per category, not an intensity rating.',
      },
      {
        id: 'c',
        text: 'The proportion of words in the review that are negative',
        correct: false,
        why: 'It is a model confidence, not a word count.',
      },
      {
        id: 'd',
        text: 'The percentage of human reviewers who agreed with the label',
        correct: false,
        why: 'No human agreement is involved.',
      },
    ],
    explanation:
      'Sentiment analysis returns confidence scores for positive, neutral and negative, at both document and sentence level. The scores express certainty about the classification.',
    reference: {
      label: 'What are sentiment analysis and opinion mining?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/sentiment-opinion-mining/overview',
      quote:
        'The sentiment analysis feature assigns sentiment labels, such as "negative," "neutral," and "positive." The service determines these labels using the highest confidence score.',
    },
    tags: ['language', 'sentiment', 'trap'],
  },
  {
    id: 'sc-ts-10',
    topic: 'foundry-text-speech',
    objective: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two are true of speech recognition in Azure Speech in Foundry Tools? (Choose two.)',
    options: [
      { id: 'a', text: 'Real-time mode transcribes streaming audio as it is spoken', correct: true },
      {
        id: 'b',
        text: 'Batch mode processes large volumes of pre-recorded audio asynchronously',
        correct: true,
      },
      {
        id: 'c',
        text: 'It requires SSML to configure the input audio',
        correct: false,
        why: 'SSML is a synthesis format. It has no role in recognition.',
      },
      {
        id: 'd',
        text: 'It can only process audio from a microphone, not from files',
        correct: false,
        why: 'Both file and microphone input are supported.',
      },
      {
        id: 'e',
        text: 'It generates images describing the audio',
        correct: false,
        why: 'Not a speech capability.',
      },
    ],
    explanation:
      'Two modes, one distinction: is the audio arriving live, or already sitting in storage?',
    reference: {
      label: 'Speech to text overview',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/speech-to-text',
      quote:
        'Batch transcription is designed for transcribing large amounts of audio stored in files.',
    },
    tags: ['speech', 'multi-select'],
  },

  /* =================================================================
   * Vision
   * ================================================================= */
  {
    id: 'sc-fv-01',
    topic: 'foundry-vision',
    objective: 'Interpret visual input in prompts by using a deployed multimodal model',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A support tool lets users upload a screenshot of an error and asks the assistant what went wrong and how to fix it.',
    prompt: 'What does the application send to the model?',
    options: [
      {
        id: 'a',
        text: 'One user message with the question and the image as separate content items',
        correct: true,
      },
      {
        id: 'b',
        text: 'The image only, with the question moved into the system message',
        correct: false,
        why: 'The question belongs with the image in the user message; the system message carries standing instructions.',
      },
      {
        id: 'c',
        text: 'The text extracted from the screenshot by OCR, as plain text',
        correct: false,
        why: 'That throws away layout, highlighting and everything else visual that helps diagnose the error.',
      },
      {
        id: 'd',
        text: 'A vector embedding of the screenshot, generated beforehand',
        correct: false,
        why: 'Embeddings power search, not visual question answering.',
      },
    ],
    explanation:
      'Multimodal prompting is one request: a user message whose content is a list of items - text plus one or more images, supplied as a URL or base64 data.',
    reference: {
      label: 'How to use vision-enabled chat models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision',
      quote:
        'The format is the same as the chat completions API for GPT-4o, except that the message content can be an array containing text and images (either a valid publicly accessible HTTP or HTTPS URL to an image, or a base-64-encoded image).',
    },
    tags: ['vision', 'multimodal', 'sdk'],
  },
  {
    id: 'sc-fv-02',
    topic: 'foundry-vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A designer has an approved product photo but needs the background changed to a beach scene, leaving the product untouched.',
    prompt: 'Which capability does this?',
    options: [
      { id: 'a', text: 'Image editing with a mask and a prompt (inpainting)', correct: true },
      {
        id: 'b',
        text: 'Generating a brand new image from a text prompt',
        correct: false,
        why: 'That would produce a different product, not the approved one on a new background.',
      },
      {
        id: 'c',
        text: 'Image segmentation',
        correct: false,
        why: 'Segmentation identifies regions but generates nothing to fill them with.',
      },
      {
        id: 'd',
        text: 'Video generation',
        correct: false,
        why: 'Wrong output type.',
      },
    ],
    explanation:
      'The GPT-image models support editing with a mask plus a prompt, and variations. The mask says what may change; the prompt says what it should become.',
    reference: {
      label: 'How to use image generation models from OpenAI',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/dall-e',
      quote:
        'Supports inpainting and variations with mask + prompt',
    },
    tags: ['vision', 'image-generation', 'inpainting'],
  },
  {
    id: 'sc-fv-03',
    topic: 'foundry-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A team needs the text, paragraphs and tables from scanned multi-page contracts. They do not need any fields extracted or generated, and they do not want to deploy a language model for this step.',
    prompt: 'Which Azure Content Understanding analyzer should they use?',
    options: [
      { id: 'a', text: '`prebuilt-layout`', correct: true },
      {
        id: 'b',
        text: '`prebuilt-read`',
        correct: false,
        why: 'It extracts words and paragraphs, but without layout analysis, so tables are not returned as tables.',
      },
      {
        id: 'c',
        text: '`prebuilt-contract`',
        correct: false,
        why: 'A domain-specific analyzer that extracts contract fields, which the team does not need.',
      },
      {
        id: 'd',
        text: '`prebuilt-documentSearch`',
        correct: false,
        why: 'A RAG analyzer that also writes figure descriptions and a summary of the document, which is more than the team needs.',
      },
    ],
    explanation:
      'The content extraction analyzers do OCR and layout without any model: `prebuilt-read` for plain text, and `prebuilt-layout` when you also need structure such as tables and sections.',
    reference: {
      label: 'Prebuilt analyzers in Azure Content Understanding in Foundry Tools',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/prebuilt-analyzers',
      quote: 'Extracts content and layout elements such as words, figures, paragraphs, and tables from documents.',
    },
    tags: ['content-understanding', 'layout'],
  },
  {
    id: 'sc-fv-04',
    topic: 'foundry-vision',
    objective: 'Build a lightweight application that includes vision capabilities',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A building wants touchless access control that recognises which registered employee is at the door.',
    prompt: 'What is the relevant constraint?',
    options: [
      {
        id: 'a',
        text: 'Face identification is Limited Access and needs an approved use case',
        correct: true,
      },
      {
        id: 'b',
        text: 'Face detection is Limited Access, so this cannot be built at all',
        correct: false,
        why: 'Detection - finding faces - is broadly available. It is identification and verification that are gated.',
      },
      {
        id: 'c',
        text: 'There is no constraint; face recognition is generally available',
        correct: false,
        why: 'Recognition is gated precisely because of the misuse risk.',
      },
      {
        id: 'd',
        text: 'Emotion inference must be enabled for the feature first',
        correct: false,
        why: 'Emotion inference was retired on responsible AI grounds, and it is unrelated to identification.',
      },
    ],
    explanation:
      'Touchless access control is one of the use cases Microsoft names for the Face service, but identification is Limited Access. Detection is not.',
    reference: {
      label: 'Limited Access features of Face',
      url: 'https://learn.microsoft.com/azure/foundry/responsible-ai/computer-vision/limited-access-identity',
      quote:
        'Customers and partners who wish to use Limited Access features of the Face API, including Face identification and Face verification, are required to register for access by submitting a registration form. Note that these features are only available with Standard (S0) and Enterprise (E0) pricing tiers and are not supported in the Free (F0) tier. The Face Detection operation is available without registration.',
    },
    tags: ['vision', 'face', 'responsible-ai'],
  },
  {
    id: 'sc-fv-05',
    topic: 'foundry-vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A campaign needs a short generated video from a written treatment, for internal review only.',
    prompt: 'What should the team know before planning around it?',
    options: [
      {
        id: 'a',
        text: 'Sora 2 is in preview, so preview terms and availability apply',
        correct: true,
      },
      {
        id: 'b',
        text: 'Video generation is generally available, with a full SLA',
        correct: false,
        why: 'It is in preview.',
      },
      {
        id: 'c',
        text: 'Video generation is not available on Azure in any form',
        correct: false,
        why: 'It is available, in preview.',
      },
      {
        id: 'd',
        text: 'gpt-image-2 can produce a short clip as well as stills',
        correct: false,
        why: 'The GPT-image models produce still images, however high the resolution.',
      },
    ],
    explanation:
      'The study guide says most questions cover generally available features, but preview features may appear when they are commonly used. Previews come without a service-level agreement.',
    reference: {
      label: 'Sora 2 video generation overview (preview)',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/video-generation',
      quote:
        'Sora 2 video generation is currently in preview.',
    },
    tags: ['vision', 'video-generation', 'currency'],
  },
  {
    id: 'sc-fv-06',
    topic: 'foundry-vision',
    objective: 'Build a lightweight application that includes vision capabilities',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A retailer wants every catalogue photo indexed so shoppers can search "blue linen shirt with a mandarin collar" in natural language.',
    prompt: 'Which approach best supports this?',
    options: [
      {
        id: 'a',
        text: 'Index rich image descriptions, or use multimodal embeddings',
        correct: true,
      },
      {
        id: 'b',
        text: 'Image classification, assigning one category label per photo',
        correct: false,
        why: 'A single label like "shirt" cannot support a query about fabric, colour and collar style.',
      },
      {
        id: 'c',
        text: 'OCR over every photo, indexing the text it finds',
        correct: false,
        why: 'There is no text on the garments to read.',
      },
      {
        id: 'd',
        text: 'An image generation model to redraw each product',
        correct: false,
        why: 'Wrong direction - the images already exist.',
      },
    ],
    explanation:
      'Two routes to the same end: describe the images and index the text (Content Understanding\'s image-for-search analyzers do exactly this), or embed images and text into a shared vector space with a multimodal embedding model such as Cohere Embed.',
    reference: {
      label: 'Migrate from Azure Vision Image Analysis',
      url: 'https://learn.microsoft.com/azure/ai-services/computer-vision/migration-options',
      quote:
        'Features: A multilingual multimodal embedding model supported in the Microsoft Foundry portal. It transforms different modalities such as images, texts, and interleaved images and texts into a single vector representation.',
    },
    tags: ['vision', 'embeddings', 'search', 'hard'],
  },
  {
    id: 'sc-fv-07',
    topic: 'foundry-vision',
    objective: 'Interpret visual input in prompts by using a deployed multimodal model',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'An accessibility feature must describe photographs aloud for blind users, in natural language, with enough detail to be useful.',
    prompt: 'Which capability fits, and which responsible AI principle does the feature serve?',
    options: [
      {
        id: 'a',
        text: 'A multimodal model\'s description, read out by text to speech - inclusiveness',
        correct: true,
      },
      {
        id: 'b',
        text: 'Object detection returning labelled bounding boxes - serving inclusiveness',
        correct: false,
        why: 'Coordinates are not a useful spoken description. The capability is wrong even though the principle is right.',
      },
      {
        id: 'c',
        text: 'An image generation model - serving transparency',
        correct: false,
        why: 'Both halves are wrong: nothing is being generated, and this is not about disclosure.',
      },
      {
        id: 'd',
        text: 'OCR - serving privacy and security',
        correct: false,
        why: 'OCR reads text in images and has no bearing on privacy here.',
      },
    ],
    explanation:
      'Accessibility features are the canonical inclusiveness example, and this one chains two capabilities: multimodal visual understanding for the description, then speech synthesis to deliver it.',
    reference: {
      label: 'How to use vision-enabled chat models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision',
      quote:
        'Vision-enabled chat models are large multimodal models (LMM) developed by OpenAI that can analyze images and provide textual responses to questions about them.',
    },
    tags: ['vision', 'multimodal', 'inclusiveness', 'cross-topic'],
  },
  {
    id: 'sc-fv-08',
    topic: 'foundry-vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'medium',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two statements about diffusion-based image generation are correct? (Choose two.)',
    options: [
      { id: 'a', text: 'Generation begins from random noise and progressively denoises', correct: true },
      { id: 'b', text: 'The text prompt conditions the denoising at every step', correct: true },
      {
        id: 'c',
        text: 'The model retrieves the closest matching training image and edits it',
        correct: false,
        why: 'Nothing is retrieved. That is why a prompt for a scene that has never existed still returns an image.',
      },
      {
        id: 'd',
        text: 'The model renders a 3D scene described by the prompt',
        correct: false,
        why: 'No 3D geometry is constructed.',
      },
      {
        id: 'e',
        text: 'Diffusion requires an input image to start from',
        correct: false,
        why: 'Text-to-image needs no input image. Supplying one is the separate editing workflow.',
      },
    ],
    explanation:
      'Training adds noise progressively; generation reverses it. The prompt embedding steers each denoising step, which is how the text ends up controlling what appears.',
    reference: {
      label: 'Deploy and use MAI image models in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/foundry-models/how-to/use-foundry-models-mai-image',
      quote:
        'Each model uses a diffusion-based approach to progressively refine images from a natural language prompt, enabling strong alignment between the input text and the generated output.',
    },
    tags: ['vision', 'diffusion', 'multi-select'],
  },
  {
    id: 'sc-fv-09',
    topic: 'foundry-vision',
    objective: 'Build a lightweight application that includes vision capabilities',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A team must choose between a multimodal model and Content Understanding for reading damage-assessment photos into their claims system.',
    prompt: 'Which factor should decide it?',
    options: [
      {
        id: 'a',
        text: 'Whether output must fit a fixed schema with confidence scores',
        correct: true,
      },
      {
        id: 'b',
        text: 'Which service supports the higher image resolution',
        correct: false,
        why: 'Not the deciding factor for either service in this scenario.',
      },
      {
        id: 'c',
        text: 'Whether the photos are taken in colour or greyscale',
        correct: false,
        why: 'Both handle either.',
      },
      {
        id: 'd',
        text: 'Whether the development team writes Python or C#',
        correct: false,
        why: 'Both offer SDKs across languages.',
      },
    ],
    explanation:
      'This is the deciding question every time. A downstream system that ingests fields needs guaranteed structure and per-field confidence, which is Content Understanding. Open-ended explanation for a human reader is the multimodal model.',
    reference: {
      label: 'Content Understanding image overview',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/image/overview',
      quote:
        'Azure Content Understanding standardizes the extraction of data from images, making it easier to analyze large volumes of unstructured image data.',
    },
    tags: ['vision', 'content-understanding', 'architecture', 'hard'],
  },

  /* =================================================================
   * Information extraction
   * ================================================================= */
  {
    id: 'sc-fe-01',
    topic: 'foundry-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A logistics firm processes delivery notes in a proprietary layout no prebuilt analyzer covers. They need six named fields out of each one.',
    prompt: 'What is the correct approach?',
    options: [
      {
        id: 'a',
        text: 'A custom analyzer: the document base plus a schema for the six fields',
        correct: true,
      },
      {
        id: 'b',
        text: 'Label several hundred delivery notes and train a model on them',
        correct: false,
        why: 'Content Understanding analyzers are *configured* from a schema. You describe the fields in natural language; labelled examples are optional rather than the starting point.',
      },
      {
        id: 'c',
        text: 'Prompt a chat model with each note and parse its prose reply',
        correct: false,
        why: 'No schema guarantee, no confidence scores, and fragile parsing at scale.',
      },
      {
        id: 'd',
        text: 'Use the prebuilt invoice analyzer and ignore the mismatched fields',
        correct: false,
        why: 'A delivery note is not an invoice; the tuned schema would not capture what they need.',
      },
    ],
    explanation:
      'Custom analyzers are the answer when no prebuilt covers the document type. The key insight is that field *descriptions* do the work labelled training data would otherwise do.',
    reference: {
      label: 'Create a custom analyzer with Content Understanding',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/tutorial/create-custom-analyzer',
      quote:
        'To create a custom analyzer, define a field schema that describes the structured data you want to extract. In the following example, you create an analyzer based on the prebuilt document analyzer for processing a receipt.',
    },
    tags: ['content-understanding', 'custom-analyzer'],
  },
  {
    id: 'sc-fe-02',
    topic: 'foundry-extraction',
    objective: 'Extract information from audio and video by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A training department wants each recorded course split into chapters, with a description of what each chapter covers, so learners can jump to the right part.',
    prompt: 'Which analyzer capability produces this?',
    options: [
      {
        id: 'a',
        text: 'A video analyzer, which segments by scene or topic and describes each part',
        correct: true,
      },
      {
        id: 'b',
        text: 'An image analyzer applied to frames sampled every few seconds',
        correct: false,
        why: 'Individual frame descriptions do not produce chapters, and they lose the spoken content entirely.',
      },
      {
        id: 'c',
        text: 'A document analyzer applied to the course transcript after it is exported',
        correct: false,
        why: 'It could summarise text, but it has no notion of timestamps or scene changes.',
      },
      {
        id: 'd',
        text: 'Text to speech that narrates a summary of each chapter',
        correct: false,
        why: 'Wrong direction.',
      },
    ],
    explanation:
      'Video analyzers segment on topic shifts, scene changes and visual cues, then return transcripts plus per-segment descriptions covering people, places and actions - exactly the chapter structure described.',
    reference: {
      label: 'Content Understanding video overview',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/video/overview',
      quote:
        'Segmentation: Automatic scene segmentation breaking the video into logical chunks based on categories you define',
    },
    tags: ['content-understanding', 'video', 'segmentation'],
  },
  {
    id: 'sc-fe-03',
    topic: 'foundry-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'An analyzer must output a field called `RiskLevel` with one of exactly three values: low, medium or high.',
    prompt: 'Which generation method should the field use?',
    options: [
      { id: 'a', text: 'Classify', correct: true },
      {
        id: 'b',
        text: 'Extract',
        correct: false,
        why: 'Extract takes a value that literally appears in the source. "Risk level: medium" is rarely printed on the document, and Extract is supported for documents only.',
      },
      {
        id: 'c',
        text: 'Generate',
        correct: false,
        why: 'Generate produces free-form values. Nothing constrains it to your three options, which is what the requirement needs.',
      },
      {
        id: 'd',
        text: 'None - this requires a separate custom model',
        correct: false,
        why: 'Classify handles it inside the same analyzer.',
      },
    ],
    explanation:
      'Choosing from a predefined set of categories is Classify, by definition. Extract for values literally present, Classify for a fixed set you defined, Generate for something that needs writing.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
      quote:
        'Classify: Classify content from a predefined set of categories, such as call sentiment or chart type, and route it to the correct analyzer for analysis.',
    },
    tags: ['content-understanding', 'field-methods', 'hard'],
  },
  {
    id: 'sc-fe-04',
    topic: 'foundry-extraction',
    objective: 'Build a lightweight application with information extraction capabilities by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A finance team asks how many invoices will need a human to look at them.',
    prompt: 'What determines the answer?',
    options: [
      {
        id: 'a',
        text: 'The confidence threshold they set for routing to review',
        correct: true,
      },
      {
        id: 'b',
        text: 'The number of fields defined in the analyzer schema',
        correct: false,
        why: 'More fields means more values, but the review decision is driven by confidence, not count.',
      },
      {
        id: 'c',
        text: 'The temperature setting on the analyzer\'s model',
        correct: false,
        why: 'Not a parameter of analyzer-based extraction.',
      },
      {
        id: 'd',
        text: 'Whether the analyzer they use is prebuilt or custom',
        correct: false,
        why: 'Both provide confidence scores.',
      },
    ],
    explanation:
      'Confidence scores from 0 to 1 per field are what make straight-through processing viable. The threshold is the business dial: raise it for more human review and fewer errors, lower it for more automation.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
      quote:
        'Provides reliability estimates from 0 to 1 for each extracted field value. High scores indicate accurate data extraction, enabling straight-through processing in automation workflows.',
    },
    tags: ['content-understanding', 'confidence'],
  },
  {
    id: 'sc-fe-05',
    topic: 'foundry-extraction',
    objective: 'Extract information from images by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A utilities company photographs meters in the field and needs the reading, the meter serial number and whether the seal is intact.',
    prompt: 'How should the analyzer be configured?',
    options: [
      {
        id: 'a',
        text: 'An image analyzer: reading and serial generated, seal condition classified',
        correct: true,
      },
      {
        id: 'b',
        text: 'A document analyzer that uses the Extract method for all three fields',
        correct: false,
        why: 'These are photographs, not documents, and Extract is supported for documents only.',
      },
      {
        id: 'c',
        text: 'OCR alone, reading the digits printed on each meter',
        correct: false,
        why: 'OCR would read the digits but cannot judge whether a seal is intact.',
      },
      {
        id: 'd',
        text: 'An audio analyzer run over the field engineer\'s notes',
        correct: false,
        why: 'Wrong modality.',
      },
    ],
    explanation:
      'Two things to notice: the modality decides the base analyzer, and the method is chosen per field. A judgement from a fixed set of options is Classify; reading values off an image is Generate, because Extract is a document-only method.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
      quote:
        'Extract: Directly extract values as they appear in the input content (supported for documents only), such as dates from receipts or item details from invoices.',
    },
    tags: ['content-understanding', 'image', 'field-methods'],
  },
  {
    id: 'sc-fe-06',
    topic: 'foundry-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A mortgage processor receives bundles containing appraisals, employment verifications and closing disclosures in one PDF, in no fixed order.',
    prompt: 'Which Content Understanding capabilities handle this?',
    options: [
      {
        id: 'a',
        text: 'Segmentation to split the bundle, and classification to route each part',
        correct: true,
      },
      {
        id: 'b',
        text: 'One large schema containing every field from every document type',
        correct: false,
        why: 'Most fields would be empty for any given section, accuracy would suffer, and the output would be awkward to consume.',
      },
      {
        id: 'c',
        text: 'Manual pre-sorting by a human before processing',
        correct: false,
        why: 'It works, but classification and routing is a supported feature - and there is a composed prebuilt analyzer for exactly this domain.',
      },
      {
        id: 'd',
        text: 'Processing the whole bundle with the invoice analyzer',
        correct: false,
        why: 'Wrong document type for all three.',
      },
    ],
    explanation:
      'Segmentation divides content into logical sections; classification routes each to the appropriate analyzer. Microsoft ships a composed mortgage analyzer that classifies and routes a wide range of US mortgage documents automatically.',
    reference: {
      label: 'Content Understanding classification and segmentation',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/classifier',
      quote:
        'Classify, segment, and analyze: Once the segments are classified, route each segment to the desired extraction analyzer for further field extraction.',
    },
    tags: ['content-understanding', 'segmentation', 'classification', 'hard'],
  },
  {
    id: 'sc-fe-07',
    topic: 'foundry-extraction',
    objective: 'Extract information from audio and video by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two outputs would you expect from a Content Understanding audio analyzer? (Choose two.)',
    options: [
      { id: 'a', text: 'A transcript of the conversation', correct: true },
      { id: 'b', text: 'Speaker labels indicating who said what', correct: true },
      {
        id: 'c',
        text: 'Bounding boxes around detected objects',
        correct: false,
        why: 'A computer vision output, and audio has no visual content.',
      },
      {
        id: 'd',
        text: 'A newly synthesized audio file',
        correct: false,
        why: 'That is text to speech. Analyzers consume media; they do not produce it.',
      },
      {
        id: 'e',
        text: 'A vector index of the audio',
        correct: false,
        why: 'Indexing is a separate downstream step.',
      },
    ],
    explanation:
      'Audio analyzers transcribe, label speakers, and can generate summaries and classify things like call sentiment - all in one analyze call, which is why they beat stitching Speech and Language together.',
    reference: {
      label: 'Content Understanding audio overview',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/audio/overview',
      quote:
        'Diarization. Distinguishes between speakers in a conversation, attributing parts of the transcript to specific speakers.',
    },
    tags: ['content-understanding', 'audio', 'multi-select'],
  },
  {
    id: 'sc-fe-08',
    topic: 'foundry-extraction',
    objective: 'Build a lightweight application with information extraction capabilities by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A developer asks whether they need to train anything before their custom analyzer will work.',
    prompt: 'What is the correct answer?',
    options: [
      {
        id: 'a',
        text: 'No - a field schema with good descriptions works immediately',
        correct: true,
      },
      {
        id: 'b',
        text: 'Yes - at least 50 labelled examples for every field',
        correct: false,
        why: 'That is the workflow for custom models in older document-processing services, not Content Understanding.',
      },
      {
        id: 'c',
        text: 'Yes - a model must be fine-tuned on your documents first',
        correct: false,
        why: 'No fine-tuning is involved.',
      },
      {
        id: 'd',
        text: 'Only for audio and video analyzers, not for documents',
        correct: false,
        why: 'None of the modalities require training.',
      },
    ],
    explanation:
      'This is the headline benefit: schema-driven field extraction with no complex prompt engineering and no labelled training set required. Describe the field well, and the service does the rest - labelled examples are an optional extra for improving accuracy, not a prerequisite.',
    reference: {
      label: 'What is Azure Content Understanding in Foundry Tools?',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/overview',
      quote:
        "Simplify field extraction. Content Understanding's field extraction makes it easier to generate structured output from unstructured content. Define a schema to extract, classify, or generate field values with no complex prompt engineering.",
    },
    tags: ['content-understanding', 'custom-analyzer', 'trap'],
  },
  {
    id: 'sc-fe-09',
    topic: 'foundry-extraction',
    objective: 'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A team indexes contracts for a RAG assistant and wants extraction tuned for retrieval quality rather than a specific business schema.',
    prompt: 'Which analyzer type should they start from?',
    options: [
      { id: 'a', text: 'A RAG analyzer, such as the document-for-search variant', correct: true },
      {
        id: 'b',
        text: 'A domain-specific analyzer, such as the invoice analyzer',
        correct: false,
        why: 'Wrong document type, and a tuned invoice schema is not what a retrieval pipeline needs.',
      },
      {
        id: 'c',
        text: 'An audio analyzer',
        correct: false,
        why: 'Wrong modality.',
      },
      {
        id: 'd',
        text: 'No analyzer at all - index the raw PDF files directly',
        correct: false,
        why: 'Raw PDFs are not retrievable text. Extraction has to happen first.',
      },
    ],
    explanation:
      'Content Understanding ships analyzer types for different jobs: base analyzers as building blocks, RAG analyzers optimised for search and AI applications, domain-specific analyzers for particular document types, and custom analyzers built on top of a base.',
    reference: {
      label: 'Prebuilt analyzers in Azure Content Understanding',
      url: 'https://learn.microsoft.com/azure/ai-services/content-understanding/concepts/prebuilt-analyzers',
      quote:
        'RAG analyzers - Optimized for retrieval-augmented generation scenarios with semantic analysis and markdown extraction for document ingestion, search applications, and knowledge bases.',
    },
    tags: ['content-understanding', 'rag', 'analyzer-types'],
  },
];
