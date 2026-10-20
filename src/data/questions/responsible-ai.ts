import type { AuthoredQuestion } from '../types';

/**
 * Topic: Describe principles of responsible AI (~18% of the exam).
 *
 * The exam almost never asks "list the six principles". It gives you a
 * scenario and asks which principle it maps to - so most of these questions
 * are scenario-to-principle mappings, including the pairs people confuse.
 */
export const responsibleAiQuestions: AuthoredQuestion[] = [
  {
    id: 'rai-001',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for fairness in an AI solution',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'A bank\'s loan-approval model approves applicants from one postal code at half the rate of equally qualified applicants elsewhere. Which responsible AI principle is most directly at risk?',
    options: [
      { id: 'a', text: 'Fairness', correct: true },
      {
        id: 'b',
        text: 'Reliability and safety',
        correct: false,
        why: 'The model is behaving consistently - it is consistently biased. Reliability is about performing correctly and predictably, including in unexpected conditions.',
      },
      {
        id: 'c',
        text: 'Transparency',
        correct: false,
        why: 'Nothing here says applicants were misled about how the system works. Transparency would be the issue if they could not learn that AI made the decision or how.',
      },
      {
        id: 'd',
        text: 'Privacy and security',
        correct: false,
        why: 'No personal data was exposed or misused; the problem is unequal treatment across groups.',
      },
    ],
    explanation:
      'Fairness means an AI system treats all people equitably and does not produce different quality of service for different groups. Unequal approval rates for equally qualified people is the textbook fairness failure.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        'AI systems should treat everyone fairly and avoid affecting similar groups differently. For example, when AI systems provide guidance on medical treatment, loan applications, or employment, they should make the same recommendations to people with similar symptoms, financial circumstances, or qualifications.',
    },
    tags: ['fairness', 'scenario'],
  },
  {
    id: 'rai-002',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for transparency in an AI solution',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'A hospital deploys a symptom-triage chatbot. Patients assume they are chatting with a nurse. Which principle is being violated?',
    options: [
      { id: 'a', text: 'Transparency', correct: true },
      {
        id: 'b',
        text: 'Inclusiveness',
        correct: false,
        why: 'Inclusiveness is about whether everyone *can use* the system, regardless of ability or background - not about whether they know it is AI.',
      },
      {
        id: 'c',
        text: 'Accountability',
        correct: false,
        why: 'Accountability asks who is answerable for the system. It becomes the issue when no human owns the outcome or there is no appeal path.',
      },
      {
        id: 'd',
        text: 'Fairness',
        correct: false,
        why: 'There is no indication that some group is treated worse than another.',
      },
    ],
    explanation:
      'Transparency requires that people know when they are interacting with an AI system and can understand its capabilities and limitations. "Users did not know it was AI" is always transparency.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        'AI can sometimes seem like "magic", but it\'s important to make users aware of how the system works and any potential limitations it may have.',
    },
    tags: ['transparency', 'scenario'],
  },
  {
    id: 'rai-003',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for inclusiveness in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A city rolls out a voice-only assistant as the sole way to book appointments with public services.',
    prompt: 'Which responsible AI principle does this design most clearly fail?',
    options: [
      { id: 'a', text: 'Inclusiveness', correct: true },
      {
        id: 'b',
        text: 'Transparency',
        correct: false,
        why: 'Citizens can tell it is an automated assistant; the issue is that some of them cannot use it at all.',
      },
      {
        id: 'c',
        text: 'Privacy and security',
        correct: false,
        why: 'Voice input raises privacy questions in general, but nothing here describes data being exposed or misused.',
      },
      {
        id: 'd',
        text: 'Reliability and safety',
        correct: false,
        why: 'The system may work perfectly - for people who can speak to it. Exclusion is not the same as unreliability.',
      },
    ],
    explanation:
      'Inclusiveness means AI should empower everyone and engage people across abilities, languages and backgrounds. A voice-only channel excludes users who are deaf, non-speaking, or have atypical speech. The fix is offering multiple modalities, not a better microphone.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        'An AI agent that offers speech-based interaction should also generate text captions to avoid making the system unusable for users with a hearing impairment.',
    },
    tags: ['inclusiveness', 'scenario'],
  },
  {
    id: 'rai-004',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for reliability and safety in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'An autonomous warehouse robot navigates well in testing but behaves erratically when sunlight glares off a wet floor, occasionally driving toward staff.',
    prompt: 'Which principle should the team address first?',
    options: [
      { id: 'a', text: 'Reliability and safety', correct: true },
      {
        id: 'b',
        text: 'Accountability',
        correct: false,
        why: 'Accountability matters for governance of the project, but the immediate defect is unpredictable behaviour in conditions outside the test set.',
      },
      {
        id: 'c',
        text: 'Fairness',
        correct: false,
        why: 'No group of people is being treated differently.',
      },
      {
        id: 'd',
        text: 'Inclusiveness',
        correct: false,
        why: 'This is not about who can use the system.',
      },
    ],
    explanation:
      'Reliability and safety means an AI system performs consistently and safely under both expected conditions and unexpected ones. Failing on an edge case that endangers people - glare, weather, sensor noise - is the canonical example. Mitigations: rigorous testing across adverse conditions, guardrails, and human fallback.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        'To build trust, AI systems must operate reliably, safely, and consistently. They should function as designed, respond safely to unexpected conditions, and resist harmful manipulation.',
    },
    tags: ['reliability', 'scenario'],
  },
  {
    id: 'rai-005',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for accountability in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'An insurer automatically denies claims using a model. When a customer disputes a denial, staff reply that "the system decided" and there is no way to escalate or review.',
    prompt: 'Which principle is violated?',
    options: [
      { id: 'a', text: 'Accountability', correct: true },
      {
        id: 'b',
        text: 'Transparency',
        correct: false,
        why: 'Close, and often paired - but the customer clearly knows a system made the decision. What is missing is a human answerable for it and a route to appeal.',
      },
      {
        id: 'c',
        text: 'Reliability and safety',
        correct: false,
        why: 'Nothing says the model is malfunctioning; the governance around it is the problem.',
      },
      {
        id: 'd',
        text: 'Privacy and security',
        correct: false,
        why: 'No data exposure is described.',
      },
    ],
    explanation:
      'Accountability means the people who design and deploy an AI system remain answerable for how it operates. Hallmarks: named human owners, governance and oversight, and a way for affected people to seek review. "The algorithm decided, nobody can change it" is always accountability.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        "People who design and deploy AI systems must be accountable for how those systems operate. Organizations should use industry standards to develop accountability norms. These norms help ensure that AI systems are not the final authority on decisions that affect people's lives and that humans maintain meaningful control over highly autonomous systems.",
    },
    tags: ['accountability', 'scenario', 'trap'],
  },
  {
    id: 'rai-006',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for privacy and security in an AI solution',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'A support chatbot occasionally quotes another customer\'s order details, including their address, in its replies. Which principle is violated?',
    options: [
      { id: 'a', text: 'Privacy and security', correct: true },
      {
        id: 'b',
        text: 'Reliability and safety',
        correct: false,
        why: 'The model is misbehaving, but the specific harm is exposure of personal data, which maps to privacy and security.',
      },
      {
        id: 'c',
        text: 'Fairness',
        correct: false,
        why: 'All customers are equally at risk - there is no differential treatment by group.',
      },
      {
        id: 'd',
        text: 'Accountability',
        correct: false,
        why: 'Accountability is about ownership and oversight, not about the leak itself.',
      },
    ],
    explanation:
      'Privacy and security means AI systems must protect personal and sensitive data and resist misuse. Any leak of PII, cross-tenant data bleed, or exposure of confidential content lands here. Mitigations include RBAC, PII detection and redaction, and encryption.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        'As AI becomes more common, protecting privacy and securing personal and business information is more important and complex. Privacy and data security require close attention because AI systems need data to make accurate predictions and decisions.',
    },
    tags: ['privacy', 'scenario'],
  },
  {
    id: 'rai-007',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe principles of responsible AI',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Situation',
    rightLabel: 'Principle',
    prompt: 'Match each situation to the responsible AI principle it most directly concerns.',
    pairs: [
      {
        id: 'p1',
        left: 'A speech model transcribes regional accents far less accurately than standard accents',
        right: 'Fairness',
      },
      {
        id: 'p2',
        left: 'The app shows an "AI-generated - may be inaccurate" banner and cites its sources',
        right: 'Transparency',
      },
      {
        id: 'p3',
        left: 'Chat logs containing customer PII are encrypted and access-controlled',
        right: 'Privacy and security',
      },
      {
        id: 'p4',
        left: 'The UI supports screen readers, captions and keyboard-only navigation',
        right: 'Inclusiveness',
      },
      {
        id: 'p5',
        left: 'A named review board signs off on the model before release and owns incidents',
        right: 'Accountability',
      },
      {
        id: 'p6',
        left: 'The model is load-tested and fails over to a human agent when confidence is low',
        right: 'Reliability and safety',
      },
    ],
    explanation:
      'Unequal quality of service across groups is fairness (note: an accent gap is fairness, not reliability). Disclosure and citations are transparency. Protecting data is privacy and security. Accessibility is inclusiveness. Human ownership and sign-off is accountability. Graceful degradation and testing is reliability and safety.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        'Microsoft created a Responsible AI Standard, a framework for building AI systems based on six principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.',
    },
    tags: ['all-principles', 'matching'],
  },
  {
    id: 'rai-008',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for fairness in an AI solution',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A recruiting model is trained on ten years of the company\'s past hiring decisions. Those decisions favoured one demographic.',
    prompt: 'What is the most accurate description of the risk, and the right first mitigation?',
    options: [
      {
        id: 'a',
        text: 'It will learn the historical bias; audit the data and compare error rates per group',
        correct: true,
      },
      {
        id: 'b',
        text: 'It will be unreliable; add more years of the same hiring data to the training set',
        correct: false,
        why: 'More of the same biased data amplifies the problem rather than fixing it. Volume is not the issue - representativeness is.',
      },
      {
        id: 'c',
        text: 'It will leak candidate data; encrypt the training set before the next training run',
        correct: false,
        why: 'Encryption addresses privacy and security, which is not the risk described here.',
      },
      {
        id: 'd',
        text: 'It will be opaque; publish the model weights so anyone can inspect them',
        correct: false,
        why: 'Publishing weights does not make outcomes fair, and transparency in the responsible AI sense means disclosure and explanation to affected people, not open-sourcing.',
      },
    ],
    explanation:
      'Models learn the patterns in their training data, including discriminatory ones. The fairness mitigation is to examine the data for demographic representation and to evaluate model performance separately across sub-populations, so a gap in error rates is visible before deployment.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        "AI models are trained using data, which is generally sourced and selected by humans. There's substantial risk that the data selection criteria, or the data itself reflects unconscious bias that may cause a model to produce discriminatory outputs. AI developers need to take care to minimize bias in training data and test AI systems for fairness.",
    },
    tags: ['fairness', 'bias', 'hard'],
  },
  {
    id: 'rai-009',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for privacy and security in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    type: 'multi',
    prompt:
      'Which two measures most directly support the privacy and security principle in a generative AI application? (Choose two.)',
    options: [
      {
        id: 'a',
        text: 'Detect and redact personally identifiable information before sending text to the model',
        correct: true,
      },
      {
        id: 'b',
        text: 'Apply role-based access control so users only retrieve documents they are authorised to see',
        correct: true,
      },
      {
        id: 'c',
        text: 'Add a visible disclosure that responses are AI-generated',
        correct: false,
        why: 'That is transparency. Useful, but it protects nobody\'s data.',
      },
      {
        id: 'd',
        text: 'Provide captions and screen-reader support in the chat UI',
        correct: false,
        why: 'That is inclusiveness.',
      },
      {
        id: 'e',
        text: 'Publish a model card describing intended use and limitations',
        correct: false,
        why: 'That is transparency (and supports accountability), not privacy.',
      },
    ],
    explanation:
      'Privacy and security is about controlling who can see what and keeping sensitive data out of places it should not go. PII redaction and permission-aware retrieval are the two classic controls; in Foundry, permission-aware retrieval is exactly what Foundry IQ provides for grounded agents.',
    reference: {
      label: 'What is PII detection in Azure Language?',
      url: 'https://learn.microsoft.com/azure/ai-services/language-service/personally-identifiable-information/overview',
      quote:
        'PII detection is useful when you need to apply privacy controls before storage, analytics, sharing, or downstream AI processing.',
    },
    tags: ['privacy', 'multi-select'],
  },
  {
    id: 'rai-010',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for transparency in an AI solution',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'Which pair of features in a RAG-based assistant most directly serves the transparency principle?',
    options: [
      {
        id: 'a',
        text: 'Citations to source documents, plus a note that answers are AI-generated',
        correct: true,
      },
      {
        id: 'b',
        text: 'Vector search over embeddings, plus semantic reranking of the results',
        correct: false,
        why: 'Those improve retrieval relevance - an accuracy benefit, not a transparency one.',
      },
      {
        id: 'c',
        text: 'Content filters for hate and violence, plus per-user rate limiting',
        correct: false,
        why: 'Those serve reliability and safety.',
      },
      {
        id: 'd',
        text: 'Encryption at rest, plus a private endpoint for the search index',
        correct: false,
        why: 'Those serve privacy and security.',
      },
    ],
    explanation:
      'Transparency is about the user being able to understand what the system is and where its answers came from. Citations are the single most important transparency feature of a grounded assistant - and returning grounded answers with citations is a headline capability of Foundry IQ.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        'AI can sometimes seem like "magic", but it\'s important to make users aware of how the system works and any potential limitations it may have.',
    },
    tags: ['transparency', 'rag', 'hard'],
  },
  {
    id: 'rai-011',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe principles of responsible AI',
    difficulty: 'easy',
    kind: 'learn',
    prompt: 'How many principles are in Microsoft\'s responsible AI framework?',
    options: [
      { id: 'a', text: 'Six', correct: true },
      { id: 'b', text: 'Four', correct: false, why: 'Four leaves out two of the six.' },
      { id: 'c', text: 'Five', correct: false, why: 'A common miscount - usually by folding privacy and security into reliability.' },
      { id: 'd', text: 'Seven', correct: false, why: 'There is no seventh principle; "safety" is part of reliability and safety.' },
    ],
    explanation:
      'Six: Fairness, Reliability and safety, Privacy and security, Inclusiveness, Transparency, and Accountability. A memory hook: **FRPITA** - or remember that Accountability and Transparency are the two "governance" principles that sit over the other four.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        'Microsoft created a Responsible AI Standard, a framework for building AI systems based on six principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.',
    },
    tags: ['definition'],
  },
  {
    id: 'rai-012',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for reliability and safety in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A team enables content filters on a deployed model so that hateful, violent, sexual and self-harm content is blocked in both prompts and responses. Which principle does this most directly serve?',
    options: [
      { id: 'a', text: 'Reliability and safety', correct: true },
      {
        id: 'b',
        text: 'Fairness',
        correct: false,
        why: 'Content filtering does not equalise quality of service across demographic groups.',
      },
      {
        id: 'c',
        text: 'Transparency',
        correct: false,
        why: 'Filtering changes what the system does; it does not explain the system to users.',
      },
      {
        id: 'd',
        text: 'Inclusiveness',
        correct: false,
        why: 'Inclusiveness concerns who can use the system, not what content is blocked.',
      },
    ],
    explanation:
      'Content safety controls keep the system behaving safely across expected and adversarial inputs, which is reliability and safety. In Foundry these controls live in **guardrails**: models get the default `Microsoft.DefaultV2` guardrail, and you can assign a custom guardrail to a deployment or an agent.',
    reference: {
      label: 'Guardrails and controls overview in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/guardrails/guardrails-overview',
      quote:
        'Microsoft Foundry provides safety and security guardrails that you can apply to core models and agents. Agent guardrails are in preview. Guardrails consist of a set of controls. The controls define a risk to be detected, intervention points to scan for the risk, and the response action to take in the model or agent when the risk is detected.',
    },
    tags: ['reliability', 'content-safety'],
  },
  {
    id: 'rai-013',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for inclusiveness in an AI solution',
    difficulty: 'hard',
    kind: 'exam',
    prompt:
      'A translation feature supports 12 languages, all European. Leadership calls this "inclusive enough". Which statement best reflects the inclusiveness principle?',
    options: [
      {
        id: 'a',
        text: 'It asks whether people across abilities, languages and cultures can benefit - one region is not enough',
        correct: true,
      },
      {
        id: 'b',
        text: 'It is satisfied as long as the model is accurate for every language it does support',
        correct: false,
        why: 'That is a reliability argument. Accuracy for the included group says nothing about the excluded one.',
      },
      {
        id: 'c',
        text: 'It only covers physical accessibility, such as screen readers and keyboard navigation',
        correct: false,
        why: 'Accessibility is part of inclusiveness, but the principle explicitly covers language and cultural reach as well.',
      },
      {
        id: 'd',
        text: 'It is a subset of fairness, so a fair system is automatically inclusive',
        correct: false,
        why: 'They are distinct principles. Fairness is about equitable treatment of those who use the system; inclusiveness is about whether people can participate at all.',
      },
    ],
    explanation:
      'Inclusiveness means AI should empower everyone and engage people. It spans disability and accessibility, language coverage, and cultural context. The distinction to hold onto: fairness = equitable outcomes for users; inclusiveness = everyone can be a user.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        "The potential of AI to improve lives and drive success should be open to everyone. AI developers should strive to ensure that their solutions don't exclude some users.",
    },
    tags: ['inclusiveness', 'fairness-vs-inclusiveness', 'hard'],
  },
  {
    id: 'rai-014',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for accountability in an AI solution',
    difficulty: 'medium',
    kind: 'learn',
    type: 'multi',
    prompt:
      'Which two practices are hallmarks of the accountability principle? (Choose two.)',
    options: [
      {
        id: 'a',
        text: 'A named owner and governance process signs off on the system before and after release',
        correct: true,
      },
      {
        id: 'b',
        text: 'Affected people have a documented route to contest an automated decision',
        correct: true,
      },
      {
        id: 'c',
        text: 'The system uses the smallest model that meets the quality bar',
        correct: false,
        why: 'That is a cost and latency decision, not a responsible AI control.',
      },
      {
        id: 'd',
        text: 'Prompts and responses are stored in an encrypted database',
        correct: false,
        why: 'That serves privacy and security.',
      },
      {
        id: 'e',
        text: 'The chat window says "You are talking to a bot"',
        correct: false,
        why: 'That is transparency.',
      },
    ],
    explanation:
      'Accountability puts humans in charge of the system: clear ownership, governance and oversight, and meaningful recourse for people affected by its decisions.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        "Ultimately, the people and organizations that develop and distribute AI solutions are accountable for their actions. It's important for organizations developing AI models and applications to define and apply a framework of governance to help ensure that they apply responsible AI principles to their work.",
    },
    tags: ['accountability', 'multi-select'],
  },
  {
    id: 'rai-015',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe principles of responsible AI',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A generative AI product team publishes a transparency note describing what the model can and cannot do, adds "AI-generated" labels to outputs, and embeds Content Credentials (C2PA) metadata in generated images.',
    prompt: 'Which principle do all three measures serve?',
    options: [
      { id: 'a', text: 'Transparency', correct: true },
      {
        id: 'b',
        text: 'Accountability',
        correct: false,
        why: 'Transparency notes support accountability indirectly, but all three measures are about disclosure and provenance - telling people what they are looking at.',
      },
      {
        id: 'c',
        text: 'Reliability and safety',
        correct: false,
        why: 'None of these change how the system behaves; they describe it.',
      },
      {
        id: 'd',
        text: 'Privacy and security',
        correct: false,
        why: 'No data protection measure is described.',
      },
    ],
    explanation:
      'Transparency covers disclosure that AI is involved, communicating capabilities and limitations, and provenance. Content Credentials (C2PA) cryptographically mark an image as AI-generated, which is a provenance/transparency control - a favourite exam detail.',
    reference: {
      label: 'Content provenance for Foundry models',
      url: 'https://learn.microsoft.com/azure/foundry/responsible-ai/content-safety/provenance-disclosure',
      quote:
        'For supported Foundry Models sold by Azure, customers can leverage available content provenance capabilities to help provide transparency about AI-generated content and support their own transparency objectives.',
    },
    tags: ['transparency', 'c2pa', 'hard'],
  },
  {
    id: 'rai-016',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for fairness in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'Which question best tests whether a deployed model meets the fairness principle?',
    options: [
      {
        id: 'a',
        text: 'Does the model perform equally well for each demographic group it serves?',
        correct: true,
      },
      {
        id: 'b',
        text: 'Does the model achieve high overall accuracy on the test set?',
        correct: false,
        why: 'Aggregate accuracy can hide a large gap: a model can be 95% accurate overall while being 70% accurate for a minority group.',
      },
      {
        id: 'c',
        text: 'Does the model respond within the latency target?',
        correct: false,
        why: 'Performance in the engineering sense, not the fairness sense.',
      },
      {
        id: 'd',
        text: 'Are the model weights stored securely?',
        correct: false,
        why: 'That is privacy and security.',
      },
    ],
    explanation:
      'Fairness is measured by comparing performance *across sub-populations*, not by a single aggregate metric. The classic trap on this exam is a distractor offering overall accuracy as evidence of fairness.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        'The fairness assessment component of the Responsible AI dashboard helps assess model fairness across sensitive groups, such as gender, ethnicity, age, and other characteristics.',
    },
    tags: ['fairness', 'trap'],
  },
  {
    id: 'rai-017',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe principles of responsible AI',
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'A retailer builds an internal agent that answers staff questions from company documents. Some documents are restricted to HR.',
    prompt:
      'The agent must never surface HR-only content to a warehouse employee. Which principle drives this requirement, and which Foundry capability implements it?',
    options: [
      {
        id: 'a',
        text: 'Privacy and security - Foundry IQ enforces each caller\'s permissions at query time',
        correct: true,
      },
      {
        id: 'b',
        text: 'Transparency - citations show which document each answer came from',
        correct: false,
        why: 'Citations tell the user where an answer came from, but they do not prevent unauthorised content being retrieved in the first place.',
      },
      {
        id: 'c',
        text: 'Fairness - every employee gets exactly the same answer to the same question',
        correct: false,
        why: 'The requirement is the opposite: different employees must legitimately get different answers based on their permissions.',
      },
      {
        id: 'd',
        text: 'Reliability and safety - content filters block sensitive document categories',
        correct: false,
        why: 'Content filters block harmful content categories such as hate or violence. They have no concept of who is allowed to see which document.',
      },
    ],
    explanation:
      'Permission-aware retrieval is a privacy and security control. Foundry IQ synchronises access control lists from supported sources, honours Microsoft Purview sensitivity labels, and can run queries under the caller\'s Microsoft Entra identity so authorisation is enforced at query time.',
    reference: {
      label: 'What is Foundry IQ?',
      url: 'https://learn.microsoft.com/azure/foundry/agents/concepts/what-is-foundry-iq',
      quote:
        'Synchronize access control lists (ACLs) for supported sources and honor Microsoft Purview sensitivity labels. Enforce permissions at query time so agents return only authorized content.',
    },
    tags: ['privacy', 'foundry-iq', 'cross-topic'],
  },
  {
    id: 'rai-018',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for reliability and safety in an AI solution',
    difficulty: 'easy',
    kind: 'learn',
    prompt:
      'Which of these is the best example of a reliability and safety mitigation for a customer-facing AI assistant?',
    options: [
      {
        id: 'a',
        text: 'Hand over to a human when confidence is low or the topic is high-risk',
        correct: true,
      },
      {
        id: 'b',
        text: 'Translate the interface into more languages for international customers',
        correct: false,
        why: 'That is inclusiveness.',
      },
      {
        id: 'c',
        text: 'Add a footer naming the team that owns and maintains the system',
        correct: false,
        why: 'That leans towards accountability and transparency.',
      },
      {
        id: 'd',
        text: 'Reduce the model\'s temperature to zero for every request',
        correct: false,
        why: 'Lower temperature makes output more deterministic, but deterministic wrong answers are still wrong. It is a tuning choice, not a safety control.',
      },
    ],
    explanation:
      'Human-in-the-loop fallback is the standard reliability and safety pattern: the system degrades gracefully instead of confidently producing something harmful.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        'An AI-powered robotic solution that uses computer vision to detect objects should avoid unintentional harm or damage. One way to accomplish this goal is to use probability values to determine "confidence" in object identification before interacting with physical objects, and avoid any action if the confidence level is below a specific threshold.',
    },
    tags: ['reliability'],
  },
  {
    id: 'rai-019',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe principles of responsible AI',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'A team is documenting risks for a new AI feature. They list: (1) the model may confidently state incorrect facts; (2) users may not realise the answer is AI-generated; (3) there is no owner for handling complaints.',
    prompt: 'Map risks 1, 2 and 3 to principles, in order.',
    options: [
      {
        id: 'a',
        text: 'Reliability and safety; Transparency; Accountability',
        correct: true,
      },
      {
        id: 'b',
        text: 'Transparency; Accountability; Reliability and safety',
        correct: false,
        why: 'Confidently wrong output is a behaviour defect (reliability), not a disclosure one.',
      },
      {
        id: 'c',
        text: 'Fairness; Transparency; Privacy and security',
        correct: false,
        why: 'Nothing here describes unequal treatment or data exposure.',
      },
      {
        id: 'd',
        text: 'Reliability and safety; Accountability; Transparency',
        correct: false,
        why: 'Risks 2 and 3 are swapped: "users do not know it is AI" is transparency; "nobody owns complaints" is accountability.',
      },
    ],
    explanation:
      'Hallucination is a reliability and safety risk. Undisclosed AI involvement is transparency. Missing ownership and recourse is accountability. Being able to run this mapping quickly is most of what the responsible AI section of the exam asks for.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        'Microsoft created a Responsible AI Standard, a framework for building AI systems based on six principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.',
    },
    tags: ['all-principles', 'hard'],
  },
  {
    id: 'rai-020',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for privacy and security in an AI solution',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'An attacker crafts input designed to override an agent\'s system instructions and make it reveal internal data. What is this called, and which principle does defending against it serve?',
    options: [
      {
        id: 'a',
        text: 'Prompt injection - privacy and security',
        correct: true,
      },
      {
        id: 'b',
        text: 'Hallucination - reliability and safety',
        correct: false,
        why: 'Hallucination is the model inventing content on its own. This is a deliberate attack by a third party.',
      },
      {
        id: 'c',
        text: 'Overfitting - fairness',
        correct: false,
        why: 'Overfitting is a training problem where a model memorises its training data instead of generalising.',
      },
      {
        id: 'd',
        text: 'Data drift - accountability',
        correct: false,
        why: 'Data drift is production data diverging from training data over time.',
      },
    ],
    explanation:
      'Prompt injection (including indirect injection through retrieved documents) is an adversarial attack on the instructions given to a model. Defending against it protects data and system integrity, which is privacy and security. Foundry provides prompt shields as part of its content safety guardrails.',
    reference: {
      label: 'Prompt Shields in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/openai/concepts/content-filter-prompt-shields',
      quote:
        'User prompt attacks - Malicious prompts that attempt to bypass system instructions or safety training. Prompt Shields scan these attacks at the user input intervention point.',
    },
    tags: ['privacy', 'prompt-injection'],
  },
  {
    id: 'rai-021',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe principles of responsible AI',
    difficulty: 'medium',
    kind: 'exam',
    type: 'match',
    leftLabel: 'Mitigation',
    rightLabel: 'Principle it primarily serves',
    prompt: 'Match each mitigation to the principle it primarily serves.',
    pairs: [
      { id: 'm1', left: 'Evaluate error rates separately for each demographic group', right: 'Fairness' },
      { id: 'm2', left: 'Redact PII from prompts before they reach the model', right: 'Privacy and security' },
      { id: 'm3', left: 'Publish a transparency note listing known limitations', right: 'Transparency' },
      { id: 'm4', left: 'Escalate to a human when the model is uncertain', right: 'Reliability and safety' },
      { id: 'm5', left: 'Support screen readers and multiple input modalities', right: 'Inclusiveness' },
      { id: 'm6', left: 'Assign an executive owner and a formal incident process', right: 'Accountability' },
    ],
    explanation:
      'Each mitigation is the canonical control for its principle. If you can produce this table from memory, the responsible AI portion of the exam is largely handled.',
    reference: {
      label: 'What is Responsible AI? - Azure Machine Learning',
      url: 'https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai',
      quote:
        'Microsoft created a Responsible AI Standard, a framework for building AI systems based on six principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.',
    },
    tags: ['all-principles', 'matching', 'cram'],
  },
  {
    id: 'rai-022',
    topic: 'responsible-ai',
    moduleId: 'responsible-ai',
    objective: 'Describe considerations for transparency in an AI solution',
    difficulty: 'medium',
    kind: 'learn',
    prompt:
      'Which statement about transparency is correct for the AI-901 exam?',
    options: [
      {
        id: 'a',
        text: 'People should know they are using AI and understand what it can and cannot do',
        correct: true,
      },
      {
        id: 'b',
        text: 'It requires publishing the model\'s source code and its training data',
        correct: false,
        why: 'Open-sourcing is not what the principle asks for. Transparency is about meaningful disclosure to the people affected.',
      },
      {
        id: 'c',
        text: 'It requires the model to explain its reasoning token by token, every time',
        correct: false,
        why: 'Explainability helps, but the principle is about clear communication of what the system is and does, not a mechanical trace of every inference.',
      },
      {
        id: 'd',
        text: 'It only applies to models that make legally binding decisions about people',
        correct: false,
        why: 'It applies broadly, not only to regulated decisions.',
      },
    ],
    explanation:
      'Transparency = intelligibility and disclosure: users know AI is involved, and stakeholders understand what the system can and cannot do, plus where its information comes from.',
    reference: {
      label: 'Responsible AI - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/7-responsible-ai',
      quote:
        'AI can sometimes seem like "magic", but it\'s important to make users aware of how the system works and any potential limitations it may have.',
    },
    tags: ['transparency', 'definition'],
  },
  {
    id: 'rai-023',
    topic: 'responsible-ai',
    objective: 'Describe considerations for privacy and security in an AI solution',
    difficulty: 'hard',
    kind: 'exam',
    scenario:
      'An agent can call an external shipping API. The team must stop it from ever sending customers\' personal data to that API.',
    prompt: 'Where should the personal-data control in the agent\'s guardrail apply?',
    options: [
      {
        id: 'a',
        text: 'At the tool call, which scans what the agent proposes to send to a tool',
        correct: true,
      },
      {
        id: 'b',
        text: 'On user input only, checking each message before the agent ever sees it',
        correct: false,
        why: 'Personal data can come from a retrieved document or an earlier lookup, not just the user\'s message. Checking input alone leaves the tool call unguarded.',
      },
      {
        id: 'c',
        text: 'On the final output only, before the reply reaches the user',
        correct: false,
        why: 'By the time the reply is checked, the tool call has already happened.',
      },
      {
        id: 'd',
        text: 'Through a lower temperature on the agent\'s model',
        correct: false,
        why: 'Temperature controls randomness. It has nothing to do with what data reaches a tool.',
      },
    ],
    explanation:
      'Foundry guardrails apply controls at intervention points: user input, output, and - for agents, in preview - the tool call and the tool response. To keep personal data away from a tool, scan the tool call. That is privacy and security in practice.',
    reference: {
      label: 'Guardrails and controls overview in Microsoft Foundry',
      url: 'https://learn.microsoft.com/azure/foundry/guardrails/guardrails-overview',
      quote:
        'Tool call (Preview) - The action and data the agent proposes to send to a tool. Agents only.',
    },
    tags: ['privacy', 'guardrails', 'agents', 'currency'],
  },
];
