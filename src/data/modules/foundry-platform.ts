import type { Module } from '../types';

export const foundryPlatform: Module = {
  id: 'foundry-platform',
  order: 5,
  title: 'The Microsoft Foundry platform',
  summary:
    'Resources, projects, the portal and Foundry Tools. This is where most outdated study material goes wrong - the hub model is now "classic".',
  topic: 'foundry-genai-agents',
  minutes: 17,
  priority: 'high',
  icon: '🏗️',
  outcomes: [
    'Explain the Foundry resource → project relationship',
    'Recognise hub-based material as the classic model',
    'Name what lives in the Foundry portal and what Foundry Tools are',
    'Pick the least-privilege role for someone who builds in a project',
  ],
  quiz: ['fg-012', 'fg-045', 'sc-fg-04', 'sc-fg-14', 'sc-mc-06'],
  sections: [
    {
      id: 'what',
      title: 'What Microsoft Foundry is',
      blocks: [
        {
          t: 'p',
          md: 'Microsoft Foundry unifies **agents, models and tools** under one management grouping, with enterprise features built in - role-based access control, networking, policy, tracing, monitoring and evaluations under a single Azure resource provider namespace. The portal is at [ai.azure.com](https://ai.azure.com).',
        },
        {
          t: 'table',
          headers: ['You can build…', 'Using…'],
          rows: [
            ['Agents', 'Declarative **prompt agents** (text or voice), or code-based **hosted agents**'],
            ['Model-powered apps', 'Models from the catalog, deployed or via instant access'],
            ['Grounded answers', 'Toolboxes, knowledge and retrieval - including Foundry IQ'],
          ],
        },
      ],
    },
    {
      id: 'resource-project',
      title: 'Resource and project',
      blocks: [
        {
          t: 'steps',
          title: 'The hierarchy, top down',
          steps: [
            {
              label: 'Azure subscription',
              detail: 'Billing and identity boundary, as with any Azure workload.',
            },
            {
              label: 'Foundry resource',
              detail:
                'The Azure resource that scopes design, deployment, governance and runtime access. Admins set security, networking, connectivity and policy here, once. It is the default resource type for projects built in the Foundry portal.',
            },
            {
              label: 'Foundry project',
              detail:
                'A child resource of the Foundry resource. Developers create projects as folders to organise their work - agents, evaluations, data and files. Projects inherit the parent\'s settings by default, can have their own RBAC, and expose the **project endpoint** your code calls: `https://<resource>.services.ai.azure.com/api/projects/<project>`.',
            },
          ],
        },
        {
          t: 'key',
          title: 'The distinction that gets tested',
          body: 'Security, networking, governance and connectivity are configured **at the resource level** and inherited. Individual deployments, agents and experiments live **in the project**. The design goal is to take IT admins out of the day-to-day loop.',
          priority: 'high',
        },
        { t: 'check', qid: 'fg-010' },
      ],
    },
    {
      id: 'hubs',
      title: 'Hubs are now the classic model',
      blocks: [
        {
          t: 'changed',
          title: 'This is the biggest currency trap on the exam',
          body: 'Older material says you must create an **AI hub** - with its own Azure Storage account, Key Vault and container registry - before you can create a project. Microsoft has moved most hub capabilities under the **Foundry resource** type. Hub-based projects are now accessible in the **Foundry (classic)** portal, and new investment is in Foundry projects.',
        },
        {
          t: 'list',
          items: [
            '**Foundry projects do not require an AI hub.** Serverless API deployments explicitly do not need one.',
            'Hubs still exist for **selected use cases** - prompt flow, Azure Machine Learning capabilities, and some open-source model hosting and fine-tuning. Managed compute (preview) now also runs directly in Foundry projects.',
            'Under the covers: a Foundry resource is `Microsoft.CognitiveServices/accounts` of kind `AIServices`; a Foundry project is a **subresource** of it (`.../accounts/projects`).',
            'A hub is `Microsoft.MachineLearningServices/workspaces` of kind `hub` - a different resource provider entirely.',
          ],
        },
        { t: 'check', qid: 'fg-011' },
      ],
    },
    {
      id: 'tools',
      title: 'Foundry Tools',
      blocks: [
        {
          t: 'p',
          md: '**Foundry Tools** are the first-party Azure AI capabilities available alongside models. The Foundry resource itself supports agents, evaluations, Azure OpenAI, Speech, Vision, Language and Content Understanding.',
        },
        {
          t: 'table',
          headers: ['Current name', 'Older name you may see', 'Use it for'],
          rows: [
            ['Azure **Language** in Foundry Tools', 'Text Analytics / Cognitive Services Language', 'Sentiment, key phrases, NER, PII, summarization, CLU'],
            ['Azure **Speech** in Foundry Tools', 'Speech Services', 'Speech to text, text to speech, translation'],
            ['Azure **Vision** in Foundry Tools', 'Computer Vision', 'Image analysis, OCR, Face (identification is Limited Access)'],
            ['Azure **Content Understanding** in Foundry Tools', '(new - no AI-900 equivalent)', 'Multimodal extraction across documents, images, audio, video'],
          ],
        },
        { t: 'check', qid: 'fg-013' },
      ],
    },
    {
      id: 'portal',
      title: 'Getting something running in the portal',
      blocks: [
        {
          t: 'steps',
          title: 'Deploy and try a model',
          steps: [
            { label: 'Open your project', detail: 'Sign in to the Foundry portal and select or create a project.' },
            { label: 'Browse the model catalog', detail: 'Filter by capability, modality or provider to find a model that fits.' },
            { label: 'Create a deployment', detail: 'Choose the deployment type - Global Standard is the usual default - and name the deployment. The name is what your code will reference. To just try a supported model, instant access (preview) skips this step.' },
            { label: 'Test in the playground', detail: 'Chat with the deployment, iterate on the system prompt, and check the behaviour before writing any code.' },
            { label: 'Wire it into your app', detail: 'Copy the project endpoint and deployment name. The playground can also hand you a preconfigured code snippet.' },
          ],
        },
        { t: 'check', qid: 'fg-038' },
      ],
    },
    {
      id: 'roles',
      title: 'Who can do what',
      blocks: [
        {
          t: 'p',
          md: 'Access to a project is Azure RBAC, assigned at the resource, project or even single-agent scope. The built-in Foundry roles map cleanly onto the people involved.',
        },
        {
          t: 'table',
          headers: ['Role', 'Use it for'],
          rows: [
            ['**Foundry User**', 'Developers who build and test agents in a project - the least-privilege building role'],
            ['**Foundry Agent Consumer**', 'People and apps that only call an agent\'s endpoint'],
            ['**Foundry Project Manager**', 'Team leads who manage projects, publish agents and give others Foundry User'],
            ['**Foundry Account Owner**', 'Admins who create and manage resources and deploy models, without building in projects'],
            ['**Foundry Owner**', 'Full access to manage and to build - a highly privileged self-serve role'],
          ],
        },
        {
          t: 'changed',
          title: 'The roles were renamed',
          body: 'Foundry User, Foundry Owner, Foundry Account Owner and Foundry Project Manager used to be **Azure AI User**, **Azure AI Owner**, **Azure AI Account Owner** and **Azure AI Project Manager** - same permissions, new names. Note too that an API key bypasses these roles entirely and grants full access, which is one more reason to prefer Microsoft Entra ID.',
        },
        { t: 'check', qid: 'fg-041' },
      ],
    },
  ],
};
