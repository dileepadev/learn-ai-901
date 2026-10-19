<script lang="ts">
  /**
   * Shows how temperature and top_p reshape a next-token distribution.
   *
   * The base distribution is fixed and illustrative; the maths (softmax over
   * logits scaled by temperature, then nucleus truncation) is the real thing,
   * which is what makes the behaviour convincing rather than hand-waved.
   */
  const PROMPT = 'The support ticket was resolved';

  const BASE: { token: string; logit: number }[] = [
    { token: ' quickly', logit: 3.2 },
    { token: ' yesterday', logit: 2.5 },
    { token: ' by', logit: 2.1 },
    { token: ' after', logit: 1.4 },
    { token: ' without', logit: 0.7 },
    { token: ' triumphantly', logit: -0.4 },
    { token: ' sideways', logit: -1.6 },
  ];

  let temperature = $state(0.7);
  let topP = $state(1);

  const distribution = $derived.by(() => {
    const t = Math.max(0.01, temperature);
    const scaled = BASE.map((b) => b.logit / t);
    const max = Math.max(...scaled);
    const exps = scaled.map((s) => Math.exp(s - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    const probs = BASE.map((b, i) => ({ token: b.token, p: exps[i]! / sum }));

    // Nucleus (top_p) truncation: keep the smallest set reaching p.
    const sorted = [...probs].sort((a, b) => b.p - a.p);
    let cumulative = 0;
    const kept = new Set<string>();
    for (const entry of sorted) {
      kept.add(entry.token);
      cumulative += entry.p;
      if (cumulative >= topP) break;
    }
    const keptMass = sorted
      .filter((e) => kept.has(e.token))
      .reduce((a, b) => a + b.p, 0);

    return probs.map((entry) => ({
      ...entry,
      included: kept.has(entry.token),
      // Renormalised probability after truncation.
      effective: kept.has(entry.token) ? entry.p / keptMass : 0,
    }));
  });

  const maxEffective = $derived(Math.max(...distribution.map((d) => d.effective), 0.0001));
  const includedCount = $derived(distribution.filter((d) => d.included).length);

  const verdict = $derived.by(() => {
    if (temperature <= 0.2) return { tone: 'focus', text: 'Near-deterministic: it will almost always pick the top token. Right for extraction, classification and factual summarization.' };
    if (temperature <= 0.8) return { tone: 'balanced', text: 'Balanced: mostly predictable with some variation. A sensible default for assistants.' };
    return { tone: 'creative', text: 'Creative: unlikely tokens get a real chance. Right for brainstorming and copywriting, wrong for facts.' };
  });

  const presets = [
    { label: 'Factual', temperature: 0.1, topP: 1 },
    { label: 'Balanced', temperature: 0.7, topP: 1 },
    { label: 'Creative', temperature: 1.2, topP: 1 },
    { label: 'Nucleus 0.5', temperature: 0.7, topP: 0.5 },
  ];
</script>

<div class="demo">
  <p class="prompt">
    <span class="tiny subtle">Prompt</span>
    <span class="prompt-text">{PROMPT}<span class="caret">▌</span></span>
  </p>

  <div class="controls">
    <label>
      <span class="ctl-head">
        <span>temperature</span>
        <strong>{temperature.toFixed(2)}</strong>
      </span>
      <input type="range" min="0.01" max="2" step="0.01" bind:value={temperature} />
    </label>
    <label>
      <span class="ctl-head">
        <span>top_p</span>
        <strong>{topP.toFixed(2)}</strong>
      </span>
      <input type="range" min="0.05" max="1" step="0.05" bind:value={topP} />
    </label>
  </div>

  <div class="presets">
    {#each presets as preset (preset.label)}
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        onclick={() => {
          temperature = preset.temperature;
          topP = preset.topP;
        }}>{preset.label}</button
      >
    {/each}
  </div>

  <ul class="dist">
    {#each distribution as entry (entry.token)}
      <li class:excluded={!entry.included}>
        <code class="tok">{entry.token.trim()}</code>
        <span class="tbar">
          <span style:width={`${(entry.effective / maxEffective) * 100}%`}></span>
        </span>
        <span class="pct">{(entry.effective * 100).toFixed(1)}%</span>
      </li>
    {/each}
  </ul>

  <p class="verdict {verdict.tone}">
    <strong>{includedCount} of {BASE.length} tokens in play.</strong>
    {verdict.text}
    {#if topP < 1}
      <br /><strong>top_p {topP.toFixed(2)}</strong> cuts the tail: only the most likely tokens whose probabilities
      sum to {topP.toFixed(2)} can be chosen at all.
    {/if}
  </p>

  <p class="tiny subtle note">
    Both knobs control the same thing - how adventurously the next token is chosen. Tune one and
    leave the other at its default.
  </p>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .prompt {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .prompt-text {
    font-family: var(--mono);
    font-size: 0.9rem;
    padding: 0.55rem 0.7rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .caret {
    color: var(--accent);
    animation: blink 1.1s steps(2) infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  .controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.8rem;
  }
  .controls label {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .ctl-head {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    font-size: 0.78rem;
    color: var(--ink-2);
  }
  .ctl-head strong {
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }

  input[type='range'] {
    width: 100%;
    accent-color: var(--accent);
  }

  .presets {
    display: flex;
    gap: 0.3rem;
    flex-wrap: wrap;
  }
  .presets .btn {
    border: 1px solid var(--border);
    font-size: 0.75rem;
  }

  .dist {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .dist li {
    display: grid;
    grid-template-columns: 8.5rem 1fr 3.4rem;
    align-items: center;
    gap: 0.55rem;
    transition: opacity 0.2s;
  }
  .dist li.excluded {
    opacity: 0.28;
  }

  .tok {
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tbar {
    display: block;
    height: 14px;
    border-radius: 4px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .tbar > span {
    display: block;
    height: 100%;
    background: var(--accent);
    transition: width 0.25s ease;
  }

  .pct {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--ink-2);
  }

  .verdict {
    margin: 0;
    font-size: 0.87rem;
    line-height: 1.5;
    padding: 0.65rem 0.8rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--surface-2);
  }
  .verdict.focus {
    border-color: var(--border);
    background: var(--accent-soft);
  }
  .verdict.balanced {
    border-color: var(--success-edge);
    background: var(--success-soft);
  }
  .verdict.creative {
    border-color: var(--warn-edge);
    background: var(--warn-soft);
  }

  .note {
    margin: 0;
  }

  @media (max-width: 520px) {
    .dist li {
      grid-template-columns: 6rem 1fr 3rem;
    }
  }
</style>
