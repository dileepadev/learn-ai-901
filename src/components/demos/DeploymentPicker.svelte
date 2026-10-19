<script lang="ts">
  /** Three questions, one recommendation. Mirrors how the exam frames these. */
  let modelKind = $state<'foundry' | 'oss'>('foundry');
  let traffic = $state<'variable' | 'steady' | 'offline'>('variable');
  let residency = $state<'any' | 'zone' | 'geo'>('any');

  const result = $derived.by(() => {
    if (modelKind === 'oss') {
      return {
        option: 'Managed compute (preview)',
        type: '-',
        billing: 'Hourly, per accelerator SKU',
        note: 'Open-source, partner and custom models that need dedicated GPU capacity use managed compute. Data processing is global, and content filtering is not available in public preview.',
        tone: 'warn',
      };
    }

    if (traffic === 'offline' && residency === 'geo') {
      return {
        option: 'Serverless API',
        type: 'Standard',
        billing: 'Pay per token, no batch discount',
        note: 'Batch only comes as Global Batch or Data Zone Batch. If processing must stay inside one Azure geography, use Standard and send the jobs yourself - you give up the batch discount to keep the residency.',
        tone: 'info',
      };
    }

    if (traffic === 'offline') {
      return {
        option: 'Serverless API',
        type: residency === 'zone' ? 'Data Zone Batch' : 'Global Batch',
        billing: 'Discounted, per token',
        note: 'Batch types process asynchronously at a discount. Right for bulk offline jobs, wrong for anything interactive.',
        tone: 'info',
      };
    }

    const provisioned = traffic === 'steady';
    const scope =
      residency === 'geo'
        ? provisioned
          ? 'Regional Provisioned'
          : 'Standard'
        : residency === 'zone'
          ? provisioned
            ? 'Data Zone Provisioned'
            : 'Data Zone Standard'
          : provisioned
            ? 'Global Provisioned'
            : 'Global Standard';

    return {
      option: 'Serverless API',
      type: scope,
      billing: provisioned ? 'Reserved provisioned throughput units (PTUs)' : 'Pay per token',
      note: provisioned
        ? 'Provisioned reserves capacity for predictable throughput and lower, more consistent latency than pay-per-token - at the cost of paying for the reservation whether you use it or not.'
        : 'Standard is pay-per-token. Global Standard gives the highest default quota and handles variable traffic well; very high consistent volume can see more latency variability.',
      tone: 'success',
    };
  });

  const residencyNote: Record<string, string> = {
    any: 'Global: inference may be processed in any Azure region.',
    zone: 'Data Zone: processing stays within a Microsoft-specified zone (US, EU or APAC).',
    geo: 'Standard / Regional: processing stays within your chosen Azure geography.',
  };
</script>

<div class="demo">
  <fieldset>
    <legend>Which model?</legend>
    <div class="opts">
      <label class:sel={modelKind === 'foundry'}>
        <input type="radio" bind:group={modelKind} value="foundry" />
        <span>A Foundry Model (sold by Azure, or a supported partner model)</span>
      </label>
      <label class:sel={modelKind === 'oss'}>
        <input type="radio" bind:group={modelKind} value="oss" />
        <span>An open-source, NVIDIA NIM or custom model needing dedicated GPUs</span>
      </label>
    </div>
  </fieldset>

  <fieldset disabled={modelKind === 'oss'}>
    <legend>What does the traffic look like?</legend>
    <div class="opts">
      <label class:sel={traffic === 'variable'}>
        <input type="radio" bind:group={traffic} value="variable" />
        <span>Variable or unpredictable - prototypes, spiky usage</span>
      </label>
      <label class:sel={traffic === 'steady'}>
        <input type="radio" bind:group={traffic} value="steady" />
        <span>Steady and high, with a strict latency requirement</span>
      </label>
      <label class:sel={traffic === 'offline'}>
        <input type="radio" bind:group={traffic} value="offline" />
        <span>Offline bulk processing - nothing interactive</span>
      </label>
    </div>
  </fieldset>

  <fieldset disabled={modelKind === 'oss'}>
    <legend>Where may inference be processed?</legend>
    <div class="opts">
      <label class:sel={residency === 'any'}>
        <input type="radio" bind:group={residency} value="any" />
        <span>Anywhere</span>
      </label>
      <label class:sel={residency === 'zone'}>
        <input type="radio" bind:group={residency} value="zone" />
        <span>Within a data zone (US / EU / APAC)</span>
      </label>
      <label class:sel={residency === 'geo'}>
        <input type="radio" bind:group={residency} value="geo" />
        <span>Within a specific Azure geography</span>
      </label>
    </div>
  </fieldset>

  <div class="result {result.tone}">
    <dl>
      <div><dt>Deployment option</dt><dd>{result.option}</dd></div>
      <div><dt>Deployment type</dt><dd>{result.type}</dd></div>
      <div><dt>Billing</dt><dd>{result.billing}</dd></div>
    </dl>
    <p>{result.note}</p>
    {#if modelKind !== 'oss'}
      <p class="tiny subtle">{residencyNote[residency]} Data at rest always stays in the designated geography.</p>
    {/if}
    <p class="tiny subtle">
      Only trying out a supported model? Instant access (preview) lets you call it by name with no
      deployment at all.
    </p>
  </div>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;
  }
  fieldset:disabled {
    opacity: 0.45;
  }

  legend {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--ink-2);
    padding: 0;
    margin-bottom: 0.35rem;
  }

  .opts {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  label {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    font-size: 0.88rem;
    padding: 0.45rem 0.6rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface);
    cursor: pointer;
    transition: border-color 0.13s;
  }
  label:hover {
    border-color: var(--border-strong);
  }
  label.sel {
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  input[type='radio'] {
    margin-top: 0.22rem;
    accent-color: var(--accent);
    flex-shrink: 0;
  }

  .result {
    border: 1px solid var(--success-edge);
    border-radius: var(--radius-lg);
    padding: 0.95rem 1.05rem;
    background: var(--success-soft);
  }
  .result.warn {
    border-color: var(--warn-edge);
    background: var(--warn-soft);
  }
  .result.info {
    border-color: var(--accent-edge);
    background: var(--accent-soft);
  }

  dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.55rem;
    margin: 0 0 0.6rem;
  }
  dt {
    font-size: 0.8rem;
    color: var(--ink-3);
  }
  dd {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 650;
  }

  .result p {
    margin: 0 0 0.4rem;
    font-size: 0.87rem;
    line-height: 1.55;
  }
  .result p:last-child {
    margin-bottom: 0;
  }
</style>
