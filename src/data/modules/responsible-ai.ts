import type { Module } from '../types';

export const responsibleAi: Module = {
  id: 'responsible-ai',
  order: 3,
  title: 'Responsible AI: the six principles',
  summary:
    'Worth roughly 18% of the exam and almost entirely scenario-matching. Learn to map any situation to a principle in one read.',
  topic: 'responsible-ai',
  minutes: 21,
  priority: 'high',
  icon: '⚖️',
  outcomes: [
    'Name all six principles without hesitation',
    'Map a scenario to the right principle, including the pairs that get confused',
    'Name the standard mitigation for each principle',
  ],
  quiz: ['rai-003', 'rai-004', 'rai-007', 'rai-008', 'rai-010', 'rai-019', 'rai-020', 'sc-rai-06'],
  sections: [
    {
      id: 'six',
      title: 'The six, and what each one is really asking',
      blocks: [
        {
          t: 'p',
          md: 'The exam rarely asks you to *list* the principles. It gives you a situation and asks which principle applies. So learn each one as a **question you ask about a system**.',
        },
        {
          t: 'table',
          headers: ['Principle', 'The question it asks', 'Standard mitigation'],
          rows: [
            [
              '**Fairness**',
              'Does it work equally well for everyone?',
              'Audit data for representation; compare error rates *per group*, not in aggregate',
            ],
            [
              '**Reliability & safety**',
              'Does it behave correctly, including in conditions we did not plan for?',
              'Test adverse conditions, add guardrails and content filters, fall back to a human',
            ],
            [
              '**Privacy & security**',
              'Is personal and sensitive data protected?',
              'PII detection and redaction, RBAC, permission-aware retrieval, encryption',
            ],
            [
              '**Inclusiveness**',
              'Can everyone actually use it?',
              'Accessibility standards, multiple input/output modalities, language coverage',
            ],
            [
              '**Transparency**',
              'Do people know what this is and where answers came from?',
              'Disclose AI involvement, publish limitations, show citations, Content Credentials',
            ],
            [
              '**Accountability**',
              'Who is answerable, and can a person appeal?',
              'Named owners, governance sign-off, human oversight, an appeals route',
            ],
          ],
        },
        { t: 'check', qid: 'rai-011' },
      ],
    },
    {
      id: 'pairs',
      title: 'The four pairs that get confused',
      blocks: [
        {
          t: 'trap',
          title: 'Fairness vs. inclusiveness',
          body: '**Fairness** = people who use it get *equitable outcomes*. **Inclusiveness** = people can *use it at all*. A speech model that transcribes some accents worse is fairness. A voice-only interface a deaf user cannot use is inclusiveness.',
        },
        {
          t: 'trap',
          title: 'Transparency vs. accountability',
          body: '**Transparency** = the user *knows and understands*. **Accountability** = a human is *answerable and there is recourse*. "Users did not realise it was AI" ⇒ transparency. "Nobody can review or overturn the decision" ⇒ accountability.',
        },
        {
          t: 'trap',
          title: 'Reliability vs. fairness',
          body: 'Consistent bad behaviour for one group is **fairness**, not reliability. Unpredictable behaviour in unanticipated conditions - glare, weather, sensor noise, adversarial input - is **reliability and safety**.',
        },
        {
          t: 'trap',
          title: 'Privacy vs. reliability',
          body: 'When a model leaks another customer\'s data, the model *is* misbehaving - but the harm is data exposure, so the answer is **privacy and security**. Pick the principle that names the *harm*, not the malfunction.',
        },
        { t: 'check', qid: 'rai-013' },
      ],
    },
    {
      id: 'scenarios',
      title: 'Practice the mapping',
      blocks: [
        { t: 'check', qid: 'rai-005' },
        { t: 'check', qid: 'rai-016' },
        { t: 'check', qid: 'rai-021' },
      ],
    },
    {
      id: 'foundry',
      title: 'How Foundry implements these',
      blocks: [
        {
          t: 'p',
          md: 'Expect cross-topic questions that ask which **Foundry feature** serves which principle.',
        },
        {
          t: 'table',
          headers: ['Foundry capability', 'Principle it serves'],
          rows: [
            ['Guardrail controls for hate, sexual, violence and self-harm content', 'Reliability and safety'],
            ['Groundedness detection (preview), which flags answers the sources do not support', 'Reliability and safety'],
            ['Prompt shields against user prompt attacks and indirect attacks hidden in documents', 'Privacy and security'],
            ['Foundry IQ permission-aware retrieval and Purview sensitivity labels', 'Privacy and security'],
            ['Citations returned with grounded answers', 'Transparency'],
            ['Content Credentials (C2PA) in generated images', 'Transparency'],
            ['Evaluations, tracing and monitoring', 'Accountability, reliability and safety'],
            ['Limited Access gating on face identification', 'Privacy and security, fairness'],
          ],
        },
        {
          t: 'changed',
          title: 'Content filters now live inside guardrails',
          body: 'In Foundry, safety settings are configured as **guardrails**: named sets of controls. Each control pairs a **risk** (hate, violence, prompt attacks, PII and more) with an **intervention point** (user input, output, and for agents the tool call and tool response) and an **action** (annotate, or annotate and block). Models get the default `Microsoft.DefaultV2` guardrail; agent guardrails are in preview. Older notes say "content filters on a deployment" - same idea, older wording.',
        },
        { t: 'check', qid: 'rai-017' },
      ],
    },
    {
      id: 'memory',
      title: 'A 20-second memory routine',
      blocks: [
        {
          t: 'p',
          md: 'Two of the six are **governance** principles that sit above the rest: *Transparency* (tell people) and *Accountability* (own it). The other four are **system properties**: *Fairness*, *Reliability & safety*, *Privacy & security*, *Inclusiveness*.',
        },
        {
          t: 'key',
          title: 'Read the scenario for the harm',
          body: 'Someone treated worse ⇒ fairness. Something broke unexpectedly ⇒ reliability. Data got out ⇒ privacy. Someone could not participate ⇒ inclusiveness. Someone was misled ⇒ transparency. Nobody is answerable ⇒ accountability.',
          priority: 'high',
        },
      ],
    },
  ],
};
