<script lang="ts">
  /**
   * Approximate tokenizer. It is not the real BPE vocabulary - it is a
   * heuristic that produces the *shape* real tokenization has: whitespace and
   * punctuation split off, long words break into pieces, and a token averages
   * about four characters. That is all the exam requires you to internalise.
   */
  let text = $state('Microsoft Foundry makes deploying generative AI models straightforward.');

  const SUFFIXES = ['ing', 'tion', 'ment', 'ness', 'able', 'ible', 'ary', 'ous', 'ful', 'ly', 'ed', 'es', 's'];

  function splitWord(word: string): string[] {
    if (word.length <= 5) return [word];
    for (const suffix of SUFFIXES) {
      if (word.length > suffix.length + 3 && word.toLowerCase().endsWith(suffix)) {
        return [...splitWord(word.slice(0, -suffix.length)), word.slice(-suffix.length)];
      }
    }
    // Fall back to fixed-size pieces of roughly a token each.
    const out: string[] = [];
    for (let i = 0; i < word.length; i += 5) out.push(word.slice(i, i + 5));
    return out;
  }

  const tokens = $derived.by(() => {
    const out: string[] = [];
    // Keep leading whitespace attached, the way real tokenizers do.
    const parts = text.match(/\s*[A-Za-z]+|\s*[0-9]+|\s*[^\sA-Za-z0-9]|\s+/g) ?? [];
    for (const part of parts) {
      const lead = part.match(/^\s*/)?.[0] ?? '';
      const body = part.slice(lead.length);
      if (!body) {
        if (lead.trim() === '' && lead.length > 1) out.push(lead);
        continue;
      }
      if (/^[A-Za-z]+$/.test(body)) {
        const pieces = splitWord(body);
        pieces.forEach((piece, i) => out.push(i === 0 ? lead + piece : piece));
      } else {
        out.push(lead + body);
      }
    }
    return out.filter((t) => t.length > 0);
  });

  const chars = $derived(text.length);
  const words = $derived(text.trim() ? text.trim().split(/\s+/).length : 0);
  const perToken = $derived(tokens.length ? (chars / tokens.length).toFixed(1) : '0');

  const samples = [
    'Microsoft Foundry makes deploying generative AI models straightforward.',
    'Retrieval-augmented generation grounds responses in your own documents.',
    'antidisestablishmentarianism',
    'Set temperature to 0.2 for deterministic, factual summarization.',
  ];
</script>

<div class="demo">
  <label class="field">
    <span class="tiny subtle">Type or paste text</span>
    <textarea bind:value={text} rows="2" spellcheck="false"></textarea>
  </label>

  <div class="samples">
    {#each samples as s (s)}
      <button type="button" class="btn btn-sm btn-ghost" onclick={() => (text = s)}>
        {s.length > 34 ? s.slice(0, 32) + '…' : s}
      </button>
    {/each}
  </div>

  <div class="tokens" aria-label="Approximate tokens">
    {#each tokens as token, i (i)}
      <span class="token" style:--hue={(i * 47) % 360}>{token.replace(/ /g, '␣')}</span>
    {/each}
  </div>

  <dl class="stats">
    <div><dt>Characters</dt><dd>{chars}</dd></div>
    <div><dt>Words</dt><dd>{words}</dd></div>
    <div><dt>≈ Tokens</dt><dd class="hi">{tokens.length}</dd></div>
    <div><dt>Chars / token</dt><dd>{perToken}</dd></div>
  </dl>

  <p class="tiny subtle note">
    Approximate, for intuition. The exam-relevant facts: a token is roughly 4 characters or ¾ of a
    word in English, long words split into several tokens, and tokens are the unit models read,
    generate and bill in.
  </p>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  textarea {
    font: inherit;
    font-size: 0.92rem;
    padding: 0.6rem 0.7rem;
    border-radius: var(--radius);
    border: 1px solid var(--border-strong);
    background: var(--surface);
    color: var(--ink);
    resize: vertical;
    width: 100%;
  }

  .samples {
    display: flex;
    gap: 0.3rem;
    flex-wrap: wrap;
  }
  .samples .btn {
    font-size: 0.75rem;
    border: 1px solid var(--border);
  }

  .tokens {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    padding: 0.7rem;
    border-radius: var(--radius);
    background: var(--surface-2);
    border: 1px solid var(--border);
    min-height: 3rem;
  }

  .token {
    font-family: var(--mono);
    font-size: 0.8rem;
    padding: 0.12rem 0.3rem;
    border-radius: 4px;
    background: hsl(var(--hue) 70% 92%);
    color: hsl(var(--hue) 60% 25%);
    white-space: pre;
  }

  :global([data-theme='dark']) .token {
    background: hsl(var(--hue) 40% 22%);
    color: hsl(var(--hue) 70% 82%);
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .token {
      background: hsl(var(--hue) 40% 22%);
      color: hsl(var(--hue) 70% 82%);
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 0.5rem;
    margin: 0;
  }
  .stats > div {
    text-align: center;
    padding: 0.45rem 0.3rem;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    border: 1px solid var(--border);
  }
  dt {
    font-size: 0.8rem;
    color: var(--ink-3);
  }
  dd {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  dd.hi {
    color: var(--accent);
  }

  .note {
    margin: 0;
    line-height: 1.5;
  }
</style>
