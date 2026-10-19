<script lang="ts">
  /**
   * Rapid-fire scenario routing. This is the single most transferable skill on
   * the exam, so it gets its own drill rather than another table to read.
   */
  interface Item {
    scenario: string;
    answer: string;
    why: string;
  }

  const WORKLOADS = [
    'Generative AI',
    'Agentic AI',
    'Text analysis',
    'Speech',
    'Computer vision',
    'Information extraction',
  ];

  const ITEMS: Item[] = [
    {
      scenario: 'Score 50,000 app reviews as positive, neutral or negative.',
      answer: 'Text analysis',
      why: 'Text in, a label out. Sentiment analysis - a prebuilt feature, no training needed.',
    },
    {
      scenario: 'Pull vendor, date and total from a folder of scanned invoices into JSON.',
      answer: 'Information extraction',
      why: 'Unstructured source, a schema you defined coming out. Content Understanding.',
    },
    {
      scenario: 'Draft a personalised apology email in the customer\'s language.',
      answer: 'Generative AI',
      why: 'The output is new content whose wording is not in the input.',
    },
    {
      scenario: 'Resolve a support ticket: look up the order, issue a refund, email the customer.',
      answer: 'Agentic AI',
      why: 'A goal, multiple steps, and calls into other systems. That needs tools - an agent.',
    },
    {
      scenario: 'Produce live captions during an all-hands meeting.',
      answer: 'Speech',
      why: 'Audio in, text out, in real time. Real-time speech to text.',
    },
    {
      scenario: 'Count how many of each product are on a shelf from one photo.',
      answer: 'Computer vision',
      why: 'Pixels in. Counting instances specifically needs object detection, not classification.',
    },
    {
      scenario: 'Turn 4,000 hours of archived interviews into transcripts with chapters and summaries.',
      answer: 'Information extraction',
      why: 'Audio to structured output with segments and summaries - a Content Understanding audio or video analyzer.',
    },
    {
      scenario: 'Find and mask every credit card number in a chat transcript.',
      answer: 'Text analysis',
      why: 'PII detection and redaction, a prebuilt Azure Language feature.',
    },
    {
      scenario: 'Explain, in prose, why the chart in this screenshot dips in Q3.',
      answer: 'Computer vision',
      why: 'Visual input - but reasoning about it needs a multimodal model, not a classic vision service.',
    },
    {
      scenario: 'Summarise a 40-page report into an executive brief.',
      answer: 'Generative AI',
      why: 'Abstractive summarization: new wording capturing the meaning.',
    },
  ];

  let index = $state(0);
  let picked = $state<string | null>(null);
  let score = $state(0);
  let attempts = $state(0);
  let done = $state(false);

  const current = $derived(ITEMS[index]!);
  const correct = $derived(picked === current.answer);

  function pick(workload: string) {
    if (picked) return;
    picked = workload;
    attempts += 1;
    if (workload === current.answer) score += 1;
  }

  function next() {
    picked = null;
    if (index + 1 >= ITEMS.length) done = true;
    else index += 1;
  }

  function restart() {
    index = 0;
    picked = null;
    score = 0;
    attempts = 0;
    done = false;
  }
</script>

<div class="demo">
  {#if done}
    <div class="finished">
      <p class="big">{score} / {ITEMS.length}</p>
      <p class="muted">
        {score === ITEMS.length
          ? 'Perfect. Routing is the skill that carries the most questions on this exam.'
          : score >= ITEMS.length * 0.7
            ? 'Solid. Re-run it until the routing is automatic.'
            : 'Worth another pass - read each scenario for what goes in and what must come out.'}
      </p>
      <button type="button" class="btn btn-primary" onclick={restart}>Run it again</button>
    </div>
  {:else}
    <div class="head">
      <span class="tiny subtle">Scenario {index + 1} of {ITEMS.length}</span>
      <span class="chip chip-success">{score} correct</span>
    </div>

    <p class="scenario">{current.scenario}</p>

    <div class="choices">
      {#each WORKLOADS as workload (workload)}
        <button
          type="button"
          class="choice"
          class:right={picked && workload === current.answer}
          class:wrong={picked === workload && workload !== current.answer}
          disabled={Boolean(picked)}
          onclick={() => pick(workload)}
        >
          {workload}
        </button>
      {/each}
    </div>

    {#if picked}
      <div class="feedback rise-in" class:ok={correct}>
        <strong>{correct ? 'Correct' : `Not quite: it is ${current.answer}`}</strong>
        <p>{current.why}</p>
        <button type="button" class="btn btn-sm btn-primary" onclick={next}>
          {index + 1 >= ITEMS.length ? 'See score' : 'Next scenario'}
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .scenario {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.45;
    padding: 0.75rem 0.9rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.4rem;
  }

  .choice {
    font: inherit;
    font-size: 0.87rem;
    font-weight: 600;
    padding: 0.6rem 0.5rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink);
    cursor: pointer;
    transition:
      background 0.13s,
      border-color 0.13s;
  }
  .choice:hover:not(:disabled) {
    border-color: var(--accent);
    background: var(--hover);
  }
  .choice:disabled {
    cursor: default;
    opacity: 0.55;
  }
  .choice.right {
    border-color: var(--success);
    background: var(--success-soft);
    color: var(--success);
    opacity: 1;
  }
  .choice.wrong {
    border-color: var(--danger);
    background: var(--danger-soft);
    color: var(--danger);
    opacity: 1;
  }

  .feedback {
    border-radius: var(--radius);
    border: 1px solid var(--danger-edge);
    background: var(--danger-soft);
    padding: 0.7rem 0.85rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }
  .feedback.ok {
    border-color: var(--success-edge);
    background: var(--success-soft);
  }
  .feedback p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.5;
  }

  .finished {
    text-align: center;
    padding: 1.2rem 0.5rem;
  }
  .big {
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0 0 0.2rem;
    letter-spacing: -0.02em;
  }
  .finished p.muted {
    max-width: 44ch;
    margin: 0 auto 0.9rem;
    font-size: 0.9rem;
  }
</style>
