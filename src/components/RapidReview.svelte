<script lang="ts">
  /**
   * Rapid review: flashcards on their own spaced-repetition schedule,
   * comparison drills whose cells stay hidden until you have committed to an
   * answer, and one-line facts worth knowing verbatim.
   */
  import { FLASHCARDS, COMPARISONS, QUICK_FACTS } from '../data/review';
  import { TOPICS, topicLabel } from '../data/exam';
  import type { Flashcard, Progress, TopicId } from '../data/types';
  import { emptyProgress, get, recordFlashcard } from '../lib/store';
  import { isDue, MASTERED_BOX } from '../lib/srs';
  import { inlineMarkdown } from '../lib/markdown';
  import { liveProgress } from '../lib/live.svelte';

  type Tab = 'cards' | 'compare' | 'facts';
  let tab = $state<Tab>('cards');
  let topicFilter = $state<TopicId | 'all'>('all');

  const live = liveProgress();

  /* ---------------- flashcards ---------------- */

  const PRIORITY = { high: 0, medium: 1, low: 2 } as const;

  /** Due and unseen first, high priority ahead of the rest. Fixed for the session. */
  function buildDeck(p: Progress, topic: TopicId | 'all'): Flashcard[] {
    return FLASHCARDS.filter((c) => topic === 'all' || c.topic === topic).sort((a, b) => {
      const dueA = isDue(p.flashcards[a.id]) ? 1 : 0;
      const dueB = isDue(p.flashcards[b.id]) ? 1 : 0;
      if (dueA !== dueB) return dueB - dueA;
      return PRIORITY[a.priority] - PRIORITY[b.priority];
    });
  }

  // Server and first client render agree on an order; real progress re-sorts it after mount.
  let deck = $state.raw<Flashcard[]>(buildDeck(emptyProgress(), 'all'));
  let position = $state(0);
  let flipped = $state(false);
  let got = $state(0);
  let shaky = $state(0);
  let touched = false;

  function newSession() {
    deck = buildDeck(get(), topicFilter);
    position = 0;
    flipped = false;
    got = 0;
    shaky = 0;
  }

  // Once real progress arrives, order the deck by it - unless the learner has already started.
  $effect(() => {
    if (live.ready && !touched) deck = buildDeck(live.value, topicFilter);
  });

  function changeTopic(next: TopicId | 'all') {
    topicFilter = next;
    newSession();
  }

  const card = $derived<Flashcard | undefined>(deck[position]);
  const finished = $derived(position >= deck.length && deck.length > 0);
  const dueCount = $derived(
    FLASHCARDS.filter((c) => (topicFilter === 'all' || c.topic === topicFilter) && isDue(live.value.flashcards[c.id])).length,
  );
  const knownCount = $derived(
    FLASHCARDS.filter(
      (c) => (topicFilter === 'all' || c.topic === topicFilter) && (live.value.flashcards[c.id]?.box ?? 0) >= MASTERED_BOX,
    ).length,
  );

  function flip() {
    touched = true;
    flipped = !flipped;
  }

  function rate(knewIt: boolean) {
    if (!card) return;
    touched = true;
    recordFlashcard(card.id, knewIt);
    if (knewIt) got += 1;
    else {
      shaky += 1;
      // A shaky card comes round again before the session ends.
      deck = [...deck, card];
    }
    flipped = false;
    position += 1;
  }

  function onKey(e: KeyboardEvent) {
    if (tab !== 'cards' || !card || e.altKey || e.ctrlKey || e.metaKey) return;
    const target = e.target as HTMLElement | null;
    // Focused controls handle Space and Enter themselves.
    if (target?.closest('button, a, input, select, textarea, summary')) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flip();
    } else if (flipped && e.key === '1') {
      rate(false);
    } else if (flipped && e.key === '2') {
      rate(true);
    }
  }

  /* ---------------- comparisons ---------------- */

  let open = $state<Record<string, boolean>>({});
  let revealed = $state<Record<string, number[]>>({});

  function toggleRow(cmpId: string, row: number) {
    const rows = revealed[cmpId] ?? [];
    revealed = {
      ...revealed,
      [cmpId]: rows.includes(row) ? rows.filter((r) => r !== row) : [...rows, row],
    };
  }

  function setAll(cmpId: string, count: number, show: boolean) {
    revealed = { ...revealed, [cmpId]: show ? Array.from({ length: count }, (_, i) => i) : [] };
  }

  const comparisons = $derived(COMPARISONS.filter((c) => topicFilter === 'all' || c.topic === topicFilter));
  const facts = $derived(QUICK_FACTS.filter((f) => topicFilter === 'all' || f.topic === topicFilter));
</script>

<svelte:window onkeydown={onKey} />

<div class="controls">
  <div class="segmented" role="group" aria-label="What to review">
    <button type="button" aria-pressed={tab === 'cards'} onclick={() => (tab = 'cards')}>
      Flashcards
    </button>
    <button type="button" aria-pressed={tab === 'compare'} onclick={() => (tab = 'compare')}>
      Comparisons
    </button>
    <button type="button" aria-pressed={tab === 'facts'} onclick={() => (tab = 'facts')}>
      Know this
    </button>
  </div>
  <label class="filter">
    <span class="small muted">Topic</span>
    <select class="input" value={topicFilter} onchange={(e) => changeTopic(e.currentTarget.value as TopicId | 'all')}>
      <option value="all">All topics</option>
      {#each TOPICS as t (t.id)}
        <option value={t.id}>{t.label}</option>
      {/each}
    </select>
  </label>
</div>

{#if tab === 'cards'}
  <section class="cards" aria-label="Flashcards">
    <p class="deck-stats small subtle num pv" class:ready={live.ready}>
      {#if !finished && card}Card {Math.min(position + 1, deck.length)} of {deck.length}.{/if}
      {dueCount} due, {knownCount} known.
    </p>
    {#if !finished && deck.length > 0}
      <div class="bar deck-bar" aria-hidden="true">
        <span style:width={`${(Math.min(position, deck.length) / deck.length) * 100}%`}></span>
      </div>
    {/if}

    {#if deck.length === 0}
      <div class="sheet"><p>No flashcards for that topic.</p></div>
    {:else if finished}
      <div class="sheet done">
        <h2 class="h-sm">Deck finished</h2>
        <p class="muted num">
          {got} got it, {shaky} still shaky. Shaky cards come back sooner on their own schedule too.
        </p>
        <button type="button" class="btn btn-primary" onclick={newSession}>Go through again</button>
      </div>
    {:else if card}
      <button
        type="button"
        class="index-card"
        class:flipped
        onclick={flip}
        aria-label={flipped ? 'Answer shown. Select to see the question again.' : 'Select to reveal the answer.'}
      >
        <span class="card-topic small">{topicLabel(card.topic)}</span>
        {#if !flipped}
          <span class="face front">{@html inlineMarkdown(card.front)}</span>
        {:else}
          <span class="face back rise-in">{@html inlineMarkdown(card.back)}</span>
        {/if}
      </button>
      <p class="visually-hidden" aria-live="polite">{flipped ? 'Answer revealed.' : ''}</p>

      <div class="card-actions">
        {#if flipped}
          <button type="button" class="btn" onclick={() => rate(false)}>Still shaky <kbd>1</kbd></button>
          <button type="button" class="btn btn-primary" onclick={() => rate(true)}>Got it <kbd>2</kbd></button>
        {:else}
          <button type="button" class="btn btn-primary" onclick={flip}>Reveal the answer <kbd>Space</kbd></button>
        {/if}
      </div>
    {/if}
  </section>
{:else if tab === 'compare'}
  <section class="comparisons" aria-label="Comparisons">
    {#each comparisons as cmp (cmp.id)}
      {@const shown = revealed[cmp.id] ?? []}
      <div class="sheet cmp">
        <h2 class="cmp-title">
          <button
            type="button"
            class="cmp-toggle"
            aria-expanded={Boolean(open[cmp.id])}
            aria-controls={`cmp-${cmp.id}`}
            onclick={() => (open = { ...open, [cmp.id]: !open[cmp.id] })}
          >
            <span>
              <span class="cmp-name">{cmp.title}</span>
              <span class="cmp-hook small muted">{@html inlineMarkdown(cmp.hook)}</span>
            </span>
            <span class="chev" aria-hidden="true"></span>
          </button>
        </h2>

        {#if open[cmp.id]}
          <div class="cmp-body" id={`cmp-${cmp.id}`}>
            <p class="small muted">Say each row out loud, then reveal it to check.</p>
            <div class="row">
              <button type="button" class="btn btn-sm" onclick={() => setAll(cmp.id, cmp.rows.length, true)}>Reveal all</button>
              <button type="button" class="btn btn-sm btn-ghost" onclick={() => setAll(cmp.id, cmp.rows.length, false)}>Hide all</button>
            </div>
            <!-- A scrollable table must be reachable by keyboard (WCAG 2.1.1). -->
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div class="table-scroll" role="region" tabindex="0" aria-label={cmp.title}>
              <table class="data">
                <thead>
                  <tr>
                    {#each cmp.headers as h (h)}<th scope="col">{@html inlineMarkdown(h)}</th>{/each}
                  </tr>
                </thead>
                <tbody>
                  {#each cmp.rows as row, ri (ri)}
                    {@const isShown = shown.includes(ri)}
                    <tr>
                      <th scope="row">
                        <button type="button" class="row-toggle" aria-pressed={isShown} onclick={() => toggleRow(cmp.id, ri)}>
                          <span class="dot" aria-hidden="true"></span>
                          {@html inlineMarkdown(row[0] ?? '')}
                          <span class="visually-hidden">{isShown ? '(shown)' : '(select to reveal)'}</span>
                        </button>
                      </th>
                      {#each row.slice(1) as cell, ci (ci)}
                        <td>
                          {#if isShown}
                            <span class="rise-in">{@html inlineMarkdown(cell)}</span>
                          {:else}
                            <span class="hidden-cell" aria-hidden="true"></span>
                          {/if}
                        </td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <p class="bottom-line"><strong>Bottom line:</strong> {@html inlineMarkdown(cmp.bottomLine)}</p>
          </div>
        {/if}
      </div>
    {/each}
  </section>
{:else}
  <ul class="facts" aria-label="Facts to know">
    {#each facts as fact (fact.id)}
      <li class="fact" class:high={fact.priority === 'high'}>
        <span class="fact-text">{@html inlineMarkdown(fact.fact)}</span>
        <span class="small subtle">{topicLabel(fact.topic)}</span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  .filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .filter .input {
    width: auto;
  }

  .h-sm {
    font-size: 1.1875rem;
  }

  /* ---- flashcards ---- */

  .cards {
    display: grid;
    gap: 1rem;
    max-width: 44rem;
  }
  .deck-stats {
    margin: 0;
  }
  .deck-bar {
    height: 0.25rem;
    margin-top: -0.5rem;
  }

  .index-card {
    position: relative;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 0.75rem;
    min-height: 17rem;
    padding: 3.5rem clamp(1.25rem, 1rem + 3vw, 3.5rem) 2.5rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--surface);
    box-shadow: var(--shadow-md);
    color: var(--ink);
    text-align: center;
    font-size: 1.125rem;
    line-height: 1.6;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }
  .index-card:hover {
    border-color: var(--accent-edge);
    box-shadow: var(--shadow-lg);
  }
  .index-card.flipped {
    background: color-mix(in srgb, var(--accent-soft) 40%, var(--surface));
  }
  .card-topic {
    position: absolute;
    top: 1rem;
    left: 1.1rem;
    padding: 0.1rem 0.6rem;
    border-radius: 999px;
    background: var(--surface-2);
    box-shadow: inset 0 0 0 1px var(--border);
    color: var(--ink-2);
    font-size: 0.78rem;
    font-weight: 550;
    line-height: 1.5;
  }
  .face {
    max-width: 34rem;
    text-wrap: balance;
  }
  .face.front {
    font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
    font-weight: 650;
    letter-spacing: -0.02em;
    line-height: 1.35;
  }
  .face.back {
    text-wrap: pretty;
  }
  .card-actions {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .card-actions kbd {
    margin-left: 0.35rem;
  }
  .done {
    display: grid;
    gap: 0.5rem;
    justify-items: start;
  }
  .done p,
  .done h2 {
    margin: 0;
  }

  /* ---- comparisons ---- */

  .comparisons {
    display: grid;
    gap: 0.75rem;
  }
  .cmp {
    padding: 0;
    overflow: hidden;
  }
  .cmp-title {
    margin: 0;
    font-size: inherit;
  }
  .cmp-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    padding: 1rem 1.15rem;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }
  .cmp-toggle {
    transition: background 0.15s ease;
  }
  .cmp-toggle:hover {
    background: var(--surface-2);
  }
  .cmp-toggle > span:first-child {
    display: grid;
    gap: 0.15rem;
  }
  .cmp-name {
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.012em;
  }
  .cmp-hook {
    font-weight: 400;
  }
  .chev {
    flex-shrink: 0;
    width: 0.65rem;
    height: 0.65rem;
    border-right: 2px solid var(--ink-3);
    border-bottom: 2px solid var(--ink-3);
    rotate: 45deg;
    translate: 0 -0.15rem;
    transition: rotate 0.15s ease;
  }
  .cmp-toggle[aria-expanded='true'] .chev {
    rotate: 225deg;
    translate: 0 0.15rem;
  }
  .cmp-body {
    display: grid;
    gap: 0.75rem;
    padding: 0 1.15rem 1.15rem;
  }
  .cmp-body p {
    margin: 0;
  }

  .row-toggle {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent);
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }
  .dot {
    flex-shrink: 0;
    width: 0.7rem;
    height: 0.7rem;
    border: 1.5px solid currentColor;
    border-radius: 50%;
    translate: 0 0.05rem;
  }
  .row-toggle[aria-pressed='true'] {
    color: var(--ink);
  }
  .row-toggle[aria-pressed='true'] .dot {
    background: currentColor;
  }
  .hidden-cell {
    display: block;
    height: 1.1rem;
    margin-top: 0.15rem;
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--surface-2);
  }
  .bottom-line {
    padding: 0.8rem 1rem;
    border: 1px solid var(--accent-edge);
    border-radius: var(--radius);
    background: var(--accent-soft);
  }

  /* ---- facts ---- */

  .facts {
    margin: 0;
    padding: 0;
    list-style: none;
    max-width: 48rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
  }
  .fact {
    display: grid;
    gap: 0.2rem;
    margin: 0;
    padding: 0.95rem 1.25rem 0.95rem 2.6rem;
    position: relative;
  }
  .fact + .fact {
    border-top: 1px solid var(--border);
  }
  .fact::before {
    content: '';
    position: absolute;
    left: 1.15rem;
    top: 1.45rem;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--border-strong);
  }
  .fact.high::before {
    background: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }
  .fact-text :global(strong) {
    font-weight: 650;
  }
</style>
