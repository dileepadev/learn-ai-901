import type { Module } from '../types';

export const mlAndTransformers: Module = {
  id: 'ml-and-transformers',
  order: 2,
  title: 'How models actually work',
  summary:
    'Tokens, embeddings, attention and next-token prediction - the minimum mental model that makes everything else on the exam make sense.',
  topic: 'model-components',
  alsoCovers: ['ai-workloads'],
  minutes: 15,
  priority: 'medium',
  icon: '⚙️',
  outcomes: [
    'Explain what a token and an embedding are',
    'Say what self-attention buys you over older sequential models',
    'Explain why models hallucinate - and why that motivates RAG',
  ],
  quiz: ['mc-019', 'mc-020', 'mc-021', 'sc-mc-05', 'sc-wl-08', 'sc-mc-07', 'dd-mc-02'],
  sections: [
    {
      id: 'pipeline',
      title: 'From prompt to answer, in five steps',
      blocks: [
        {
          t: 'steps',
          title: 'The generation loop',
          steps: [
            {
              label: 'Tokenize',
              detail:
                'Your text is split into tokens - roughly 4 characters or ¾ of a word in English. "Understanding" might become "Under" + "standing". Tokens are the unit models read, generate and bill in.',
            },
            {
              label: 'Embed',
              detail:
                'Each token becomes a dense vector of numbers. Position in that vector space encodes meaning, so semantically similar text lands close together - the property that makes vector search work.',
            },
            {
              label: 'Attend',
              detail:
                'Self-attention scores how much every token should attend to every other token, all at once. This is what captures long-range context: a pronoun near the end can still be linked to a name near the start.',
            },
            {
              label: 'Predict',
              detail:
                'The model outputs a probability distribution over its entire vocabulary for the single next token. Not an answer - a distribution.',
            },
            {
              label: 'Sample and repeat',
              detail:
                'One token is chosen (temperature and top_p decide how adventurously), appended to the sequence, and the whole thing runs again. This loop is what "autoregressive" means.',
            },
          ],
        },
        {
          t: 'demo',
          name: 'tokenizer',
          caption: 'Type something and watch it split into tokens.',
        },
        { t: 'check', qid: 'mc-002' },
      ],
    },
    {
      id: 'embeddings',
      title: 'Embeddings: meaning as coordinates',
      blocks: [
        {
          t: 'p',
          md: 'An **embedding** is a numeric vector that represents meaning. "Annual leave" and "holiday allowance" share no words but sit close together in vector space - which is exactly why retrieval for RAG uses embeddings rather than keyword matching alone.',
        },
        {
          t: 'key',
          title: 'Know this',
          body: 'Embedding models (for example `text-embedding-3-small` and `text-embedding-3-large`) are a **separate model type** in the catalog. They produce vectors, not text. If a question needs semantic search, clustering or a RAG index, the answer involves an embedding model.',
          priority: 'high',
        },
        { t: 'check', qid: 'mc-003' },
      ],
    },
    {
      id: 'transformer',
      title: 'Why transformers won',
      blocks: [
        {
          t: 'table',
          headers: ['', 'Older recurrent networks (RNNs)', 'Transformers'],
          rows: [
            ['Processing', 'One token at a time, in order', 'Whole sequence in parallel'],
            ['Long-range context', 'Fades over distance', 'Attention links any two tokens directly'],
            ['Training on large hardware', 'Hard to parallelise', 'Scales across GPU clusters'],
          ],
          caption: 'Self-attention plus parallelism is the whole story.',
        },
        {
          t: 'p',
          md: 'Encoder-style transformers (BERT-like) are good at understanding and embeddings. Decoder-style transformers (GPT-like) generate text autoregressively. You do not need the internals - you need to know that **self-attention weighs all tokens against each other simultaneously**.',
        },
        { t: 'check', qid: 'mc-004' },
      ],
    },
    {
      id: 'ml-basics',
      title: 'The classical ML vocabulary you still need',
      blocks: [
        {
          t: 'p',
          md: 'AI-901 dropped most of AI-900\'s classical machine learning content, but a handful of terms still appear as background vocabulary.',
        },
        {
          t: 'list',
          items: [
            '**Features** are the inputs; the **label** is what you are predicting.',
            '**Training** fits the model to data; **inferencing** is using the trained model on new input.',
            '**Supervised** learning uses labelled data - *regression* predicts a number, *classification* predicts a category.',
            '**Unsupervised** learning finds structure in unlabelled data - *clustering* groups similar items.',
            '**Deep learning** uses neural networks with many layers; transformers are a deep learning architecture.',
          ],
        },
        {
          t: 'trap',
          title: 'Do not over-study this',
          body: 'AI-900 tested AutoML, the ML designer, and evaluation metrics in depth. **AI-901 does not.** If your notes have a long section on regression metrics or Azure ML Studio, that time is better spent on Foundry, agents and Content Understanding.',
        },
      ],
    },
    {
      id: 'hallucination',
      title: 'Why models make things up',
      blocks: [
        {
          t: 'p',
          md: 'A language model predicts the **most plausible next token**, learned from patterns in training data. Plausible is not the same as true, and the model has no fact lookup. That is hallucination - and understanding its cause explains the entire rationale for retrieval.',
        },
        {
          t: 'key',
          title: 'The chain to remember',
          body: 'Models predict plausibility → plausible ≠ true → so give the model real source text in the prompt (**RAG**) → and cite it so a human can check (**transparency**). Three exam topics, one causal chain.',
          priority: 'high',
        },
        { t: 'check', qid: 'mc-016' },
      ],
    },
  ],
};
