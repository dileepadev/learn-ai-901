import type { Module } from '../types';

export const agents: Module = {
  id: 'agents',
  order: 7,
  title: 'AI agents in Foundry',
  summary:
    'Prompt, voice and hosted agents, tools and toolboxes, and how a client application talks to an agent. Heavily updated since AI-900.',
  topic: 'foundry-genai-agents',
  minutes: 24,
  priority: 'high',
  icon: '🤖',
  outcomes: [
    'Define an agent as model + instructions + tools',
    'Choose between a prompt agent, a voice-based prompt agent, a hosted agent, and the Responses API',
    'Pick the right tools for a scenario and explain what a toolbox is',
  ],
  quiz: ['fg-027', 'fg-043', 'sc-fg-01', 'sc-fg-02', 'sc-fg-06', 'sc-fg-11'],
  sections: [
    {
      id: 'what',
      title: 'What makes something an agent',
      blocks: [
        {
          t: 'key',
          title: 'The definition to memorise',
          body: 'An agent = **a model** (the reasoning engine) + **instructions** (who it is, what it may do) + **tools** (how it acts on the world). Remove the tools and you have a chatbot.',
          priority: 'high',
        },
        {
          t: 'table',
          headers: ['', 'Chat completion', 'Agent'],
          rows: [
            ['Input', 'A question', 'A goal'],
            ['Process', 'One prompt, one answer', 'A loop of reasoning and tool calls'],
            ['Can act on other systems', 'No', 'Yes, through tools'],
            ['State', 'You manage the history', 'The service manages conversation state'],
          ],
        },
        { t: 'check', qid: 'fg-020' },
      ],
    },
    {
      id: 'types',
      title: 'Three agent types, plus one escape hatch',
      blocks: [
        {
          t: 'changed',
          title: 'This terminology is new and very likely to be tested',
          body: 'Foundry Agent Service now offers **prompt agents**, **voice-based prompt agents** and **hosted agents**. If your notes only describe "creating an agent with instructions and tools" without naming the types, they predate this.',
        },
        {
          t: 'table',
          headers: ['', 'Prompt agent', 'Voice-based prompt agent', 'Hosted agent', 'Responses API directly'],
          rows: [
            ['What you provide', 'Configuration: instructions, model, tools', 'The same, plus voice, audio and greeting settings', 'Your own code and framework', 'Your own code, running anywhere'],
            ['Authoring surface', 'Portal, SDK or REST', 'Portal, SDK or REST', 'Agent Framework, LangGraph, OpenAI or Anthropic Agent SDKs, GitHub Copilot SDK, custom code', 'Any client'],
            ['Runtime code to maintain', 'None', 'None - Voice Live runs the speech side', 'Yes - your agent logic', 'Yes'],
            ['Compute to manage', 'None, fully managed', 'None, fully managed', 'Container compute, Foundry-managed', 'Yours'],
            ['Agent resource in Foundry', 'Yes, named and versioned', 'Yes, named and versioned', 'Yes', '**No** - the agent is ephemeral'],
            ['Cost model', 'Inference + tool usage', 'Voice Live + model usage', 'Inference + tool usage + container compute', 'Inference + tool usage'],
            ['Best for', 'Fast start, production agents with no custom orchestration', 'Real-time spoken conversations, call centres', 'Agents that call into your own code or custom orchestration', 'Code you already run elsewhere'],
          ],
        },
        {
          t: 'p',
          md: 'Every agent type gets a **managed endpoint**, **automatic scaling**, a **Microsoft Entra identity**, and access to Foundry models and platform tools. The differences are about who writes the runtime logic, who pays for compute, and whether people type or talk. A hosted agent ships as a container image or a .zip of source code that Foundry builds for you.',
        },
        { t: 'check', qid: 'fg-021' },
        { t: 'check', qid: 'fg-022' },
      ],
    },
    {
      id: 'tools',
      title: 'Tools and toolboxes',
      blocks: [
        {
          t: 'p',
          md: 'Tools are what let an agent do more than talk. Read the verbs in a scenario and the tool list writes itself.',
        },
        {
          t: 'table',
          headers: ['The scenario says…', 'Tool you need'],
          rows: [
            ['"answer from our documents / policies / knowledge base"', 'File search or a knowledge tool (Foundry IQ)'],
            ['"calculate", "analyse this spreadsheet", "produce a chart"', 'Code interpreter'],
            ['"current", "today\'s", "latest news"', 'Web search'],
            ['"create a ticket", "update the CRM", "place an order"', 'Custom function or OpenAPI tool'],
            ['"remember what this user told us last week"', 'Memory (preview)'],
            ['"use the tools another team already exposes"', 'An MCP server, or a toolbox'],
            ['"reason over our Microsoft 365 content"', 'Work IQ (preview)'],
            ['"reason over our Fabric data"', 'Fabric IQ (preview)'],
          ],
        },
        {
          t: 'changed',
          title: 'Toolboxes',
          body: 'A **toolbox** curates a set of tools once - web search, file search, code interpreter, MCP servers, custom functions - and shares them across many agents through a single managed MCP endpoint with centralised authentication, governance and versioning. It is the governance answer to "every team configured their own tools differently".',
        },
        { t: 'check', qid: 'fg-023' },
        { t: 'check', qid: 'fg-026' },
      ],
    },
    {
      id: 'build',
      title: 'Building and testing a single agent',
      blocks: [
        {
          t: 'steps',
          title: 'In the Foundry portal',
          steps: [
            { label: 'Name the agent', detail: 'Pick carefully - the name cannot be changed later, and code refers to the agent as `<name>:<version>`.' },
            { label: 'Choose a model', detail: 'Any supported model from the catalog. You can swap models later without changing your client code.' },
            { label: 'Write the instructions', detail: 'This is the agent\'s system prompt: persona, scope, rules, and what to do when it is unsure.' },
            { label: 'Attach tools and knowledge', detail: 'Enable code interpreter, file search, web search, or connect a Foundry IQ knowledge base.' },
            { label: 'Test in the playground', detail: 'Chat with it, inspect the tool calls it makes, and iterate on the instructions until the behaviour is right.' },
            { label: 'Take the code', detail: 'The playground\'s Code tab gives you a preconfigured snippet to drop into your application.' },
            { label: 'Publish when ready', detail: 'Publish the agent version as an Agent Application with a stable endpoint, and optionally share it to Microsoft Teams and Microsoft 365 Copilot.' },
          ],
        },
        { t: 'check', qid: 'fg-025' },
      ],
    },
    {
      id: 'client',
      title: 'A client application for an agent',
      blocks: [
        {
          t: 'code',
          lang: 'python',
          caption: 'Current shape: project endpoint, agent version, conversation, response',
          code: `import os
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition
from azure.identity import DefaultAzureCredential

# pip install "azure-ai-projects>=2.3.0" azure-identity
project = AIProjectClient(
    endpoint=os.environ["PROJECT_ENDPOINT"],
    credential=DefaultAzureCredential(),
)

# Define the agent in code - or create it in the portal and skip this step.
project.agents.create_version(
    agent_name="triage-agent",
    definition=PromptAgentDefinition(
        model=os.environ["MODEL_DEPLOYMENT_NAME"],
        instructions="You are a tier-1 support triage agent. Be concise.",
    ),
)

# An OpenAI client bound to the agent, and a conversation that keeps history.
openai = project.get_openai_client(agent_name="triage-agent")
conversation = openai.conversations.create()

response = openai.responses.create(
    conversation=conversation.id,
    input="A customer reports the app crashes on launch. What should I ask them?",
)

print(response.output_text)`,
        },
        {
          t: 'changed',
          title: 'Threads and runs are the older API',
          body: 'Samples that call `create_thread()`, `create_message()` and `create_and_process_run()` against a connection string come from the earlier Assistants-style API and version 1.x of the SDK. The current pattern (version 2.x) uses a **project endpoint**, **agent versions**, **conversations** and the **Responses API**. You may be asked to recognise which is current.',
        },
        { t: 'check', qid: 'fg-024' },
        { t: 'check', qid: 'fg-037' },
      ],
    },
  ],
};
