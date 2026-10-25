<script lang="ts">
  /** Click through a real question moving along the RAG pipeline. */
  let step = $state(0);

  const QUESTION = 'How many days of holiday do I get after five years?';

  const STAGES = [
    {
      label: 'Ingest',
      when: 'Ahead of time',
      what: 'Source documents are connected. In Foundry IQ these are knowledge sources: Blob Storage, SharePoint, OneLake, public web.',
      detail: 'handbook.pdf, benefits-2026.docx, policy-leave.md and 11,997 more',
      kind: 'pre',
    },
    {
      label: 'Chunk',
      when: 'Ahead of time',
      what: 'Documents are split into focused passages. A whole handbook as one unit would match everything and nothing.',
      detail:
        '"§4.2 Annual leave. Employees receive 25 days per year, rising to 28 days after five years of continuous service…"',
      kind: 'pre',
    },
    {
      label: 'Embed & index',
      when: 'Ahead of time',
      what: 'Each passage becomes a vector and goes into an index. Foundry IQ automates chunking, embedding and metadata extraction.',
      detail: '[0.021, −0.184, 0.337, … 1533 more dimensions]',
      kind: 'pre',
    },
    {
      label: 'Retrieve',
      when: 'At query time',
      what: 'The question is embedded and matched by meaning. The best passage is headed "Annual leave", although the user asked about "holiday" - a plain keyword search would have missed it. That is what vectors buy you.',
      detail:
        '1. §4.2 Annual leave (score 0.91)\n2. §4.5 Carry-over rules (score 0.78)\n3. §9.1 Long-service awards (score 0.64)',
      kind: 'query',
    },
    {
      label: 'Augment',
      when: 'At query time',
      what: 'The retrieved passages are inserted into the prompt as grounding data, alongside a system message telling the model to answer only from them.',
      detail:
        'system: Answer only from the context. If it is not there, say you do not know.\ncontext: §4.2 … §4.5 …\nuser: How many days of holiday do I get after five years?',
      kind: 'query',
    },
    {
      label: 'Generate',
      when: 'At query time',
      what: 'The model answers from the context and returns citations, so a human can verify every claim.',
      detail:
        '"After five years of continuous service you get 28 days of annual leave a year. [handbook.pdf §4.2]"',
      kind: 'query',
    },
  ];

  const current = $derived(STAGES[step]!);
</script>

<div class="demo">
  <p class="q">
    <span class="tiny subtle">User asks</span>
    <span class="q-text">{QUESTION}</span>
  </p>

  <ol class="track" aria-label="RAG pipeline stages">
    {#each STAGES as stage, i (stage.label)}
      <li>
        <button
          type="button"
          class="node"
          class:active={i === step}
          class:done={i < step}
          class:query={stage.kind === 'query'}
          aria-current={i === step ? 'step' : undefined}
          onclick={() => (step = i)}
        >
          <span class="node-num">{i + 1}</span>
          <span class="node-label">{stage.label}</span>
        </button>
      </li>
    {/each}
  </ol>

  <div class="panel" class:query={current.kind === 'query'}>
    <div class="panel-head">
      <strong>{current.label}</strong>
      <span class="chip" class:chip-accent={current.kind === 'query'}>{current.when}</span>
    </div>
    <p class="what">{current.what}</p>
    <pre class="detail">{current.detail}</pre>
  </div>

  <div class="nav">
    <button type="button" class="btn btn-sm" disabled={step === 0} onclick={() => (step -= 1)}>
      Previous stage
    </button>
    <button
      type="button"
      class="btn btn-sm btn-primary"
      disabled={step === STAGES.length - 1}
      onclick={() => (step += 1)}
    >
      Next stage
    </button>
  </div>

  <p class="tiny subtle note">
    The first three stages happen <strong>ahead of time</strong>. Only the last three run when a user
    asks something - which is why a question about "what happens when the user asks" always starts at
    retrieval.
  </p>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .q {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .q-text {
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.5rem 0.7rem;
    background: var(--accent-soft);
    border-radius: var(--radius);
  }

  .track {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0.3rem;
    overflow-x: auto;
    scrollbar-width: thin;
    padding-bottom: 0.2rem;
  }

  .node {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.3rem 0.6rem 0.3rem 0.3rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink-2);
    cursor: pointer;
    white-space: nowrap;
    transition:
      background 0.13s,
      border-color 0.13s;
  }
  .node:hover {
    background: var(--hover);
  }
  .node.done {
    color: var(--ink);
    border-color: var(--border-strong);
  }
  .node.active {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-accent);
  }

  .node-num {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: var(--surface-2);
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--ink-2);
  }
  .node.active .node-num {
    background: var(--on-accent);
    color: var(--accent);
  }

  .panel {
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 0.9rem 1rem;
    background: var(--surface);
    box-shadow: var(--shadow-xs);
  }
  .panel.query {
    border-color: var(--accent-edge);
  }

  .panel-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }

  .what {
    margin: 0 0 0.5rem;
    font-size: 0.9rem;
    line-height: 1.55;
  }

  .detail {
    font-size: 0.75rem;
    padding: 0.55rem 0.65rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .nav {
    display: flex;
    gap: 0.4rem;
  }

  .note {
    margin: 0;
    line-height: 1.5;
  }
</style>
