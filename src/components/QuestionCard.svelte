<script lang="ts">
  /**
   * Renders any question type, collects an answer, and - outside exam mode -
   * marks it straight away: the correct answer, why it is correct, and why each
   * wrong option is wrong.
   *
   * State is initialised once from props. Parents that reuse one card for a
   * sequence of questions wrap it in `{#key question.id}`.
   */
  import { tick, untrack } from 'svelte';
  import type { Answer, ChoiceOption, Question } from '../data/types';
  import { grade } from '../lib/store';
  import { inlineMarkdown } from '../lib/markdown';
  import { topicLabel } from '../data/exam';
  import Icon from './Icon.svelte';

  interface Props {
    question: Question;
    /** Exam mode hides feedback and lets the answer be changed freely. */
    examMode?: boolean;
    /** Pre-existing answer, for review screens or returning to an exam question. */
    initial?: Answer | null;
    /** Show the marking immediately (review screens). */
    revealed?: boolean;
    /** Varies the option order between sessions while keeping it stable within one. */
    seed?: number;
    /** Listen for keyboard shortcuts. Only one card on the page should do this. */
    keys?: boolean;
    /** Called whenever the answer changes (exam mode). */
    onchange?: (answer: Answer, complete: boolean) => void;
    /** Called once when the learner submits and the marking is shown. */
    onanswered?: (correct: boolean, answer: Answer) => void;
    /** Called when the learner asks for the next question. */
    onnext?: () => void;
    /** Label for the advance button. */
    nextLabel?: string;
  }

  let {
    question,
    examMode = false,
    initial = null,
    revealed = false,
    seed = 0,
    keys = false,
    onchange,
    onanswered,
    onnext,
    nextLabel = 'Next question',
  }: Props = $props();

  const LETTERS = 'ABCDEFGHIJ';

  /* ---------------- stable shuffles ---------------- */

  function hash(text: string): number {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function shuffleStable<T>(items: T[], seedText: string): T[] {
    let h = hash(seedText);
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      h = (Math.imul(h, 48271) + 11) >>> 0;
      const j = h % (i + 1);
      [out[i], out[j]] = [out[j]!, out[i]!];
    }
    return out;
  }

  const options = $derived<ChoiceOption[]>(
    question.type === 'single' || question.type === 'multi'
      ? shuffleStable(question.options, `${question.id}:${seed}`)
      : [],
  );

  /* ---------------- answer state ---------------- */

  const start = untrack(() => ({ initial, revealed, question }));

  function startingOrder(): string[] {
    const q = start.question;
    if (q.type !== 'order') return [];
    if (start.initial?.type === 'order') return [...start.initial.itemIds];
    const ids = q.items.map((i) => i.id);
    const shuffled = shuffleStable(ids, `${q.id}:order`);
    // Never hand out the answer: if the shuffle lands on the correct order, rotate it.
    return shuffled.every((id, i) => id === ids[i]) ? [...ids.slice(1), ids[0]!] : shuffled;
  }

  let selectedSingle = $state<string | null>(
    start.initial?.type === 'single' ? start.initial.optionId : null,
  );
  let selectedMulti = $state<string[]>(
    start.initial?.type === 'multi' ? [...start.initial.optionIds] : [],
  );
  let assignments = $state<Record<string, string | null>>(
    start.question.type === 'match'
      ? Object.fromEntries(
          start.question.pairs.map((p) => [
            p.id,
            start.initial?.type === 'match' ? (start.initial.assignments[p.id] ?? null) : null,
          ]),
        )
      : {},
  );
  let ordering = $state<string[]>(startingOrder());

  let submitted = $state(start.revealed);
  let wasCorrect = $state(
    start.revealed && start.initial ? grade(start.question, start.initial) : false,
  );

  const answer = $derived.by((): Answer => {
    switch (question.type) {
      case 'single':
        return { type: 'single', optionId: selectedSingle };
      case 'multi':
        return { type: 'multi', optionIds: selectedMulti };
      case 'match':
        return { type: 'match', assignments };
      case 'order':
        return { type: 'order', itemIds: ordering };
    }
  });

  const complete = $derived.by(() => {
    switch (question.type) {
      case 'single':
        return selectedSingle !== null;
      case 'multi':
        return selectedMulti.length > 0;
      case 'match':
        return question.pairs.every((p) => assignments[p.id]);
      case 'order':
        return ordering.length === question.items.length;
    }
  });

  const requiredCount = $derived(
    question.type === 'multi' ? question.options.filter((o) => o.correct).length : 0,
  );

  const showMarking = $derived(submitted && !examMode);
  const locked = $derived(showMarking);

  /* ---------------- interactions ---------------- */

  let verdictEl = $state<HTMLElement | null>(null);

  function changed() {
    onchange?.(answer, complete);
  }

  function pickSingle(id: string) {
    if (locked) return;
    selectedSingle = id;
    changed();
    // Outside exam mode one tap marks the question: fast practice depends on it.
    if (!examMode) submit();
  }

  function toggleMulti(id: string) {
    if (locked) return;
    selectedMulti = selectedMulti.includes(id)
      ? selectedMulti.filter((x) => x !== id)
      : [...selectedMulti, id];
    changed();
  }

  function choose(option: ChoiceOption) {
    if (question.type === 'single') pickSingle(option.id);
    else toggleMulti(option.id);
  }

  function assign(pairId: string, value: string) {
    if (locked) return;
    assignments = { ...assignments, [pairId]: value || null };
    changed();
  }

  function move(index: number, delta: number) {
    if (locked) return;
    const target = index + delta;
    if (target < 0 || target >= ordering.length) return;
    const next = [...ordering];
    [next[index], next[target]] = [next[target]!, next[index]!];
    ordering = next;
    changed();
  }

  async function submit() {
    if (submitted || !complete || examMode) return;
    submitted = true;
    wasCorrect = grade(question, answer);
    onanswered?.(wasCorrect, answer);
    // The options just became read-only. Hand focus to the marking, which is
    // what the learner reads next, so keyboard and screen reader users land on it.
    await tick();
    verdictEl?.focus({ preventScroll: true });
    verdictEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function isChosen(id: string): boolean {
    return question.type === 'single' ? selectedSingle === id : selectedMulti.includes(id);
  }

  type Mark = 'right' | 'wrong' | 'missed' | 'other' | '';

  function markOf(option: ChoiceOption): Mark {
    if (!showMarking) return '';
    const chosen = isChosen(option.id);
    if (chosen && option.correct) return 'right';
    if (chosen) return 'wrong';
    if (option.correct) return 'missed';
    return 'other';
  }

  /* ---------------- keyboard ---------------- */

  function onKey(event: KeyboardEvent) {
    if (!keys || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"], dialog')) return;

    if (event.key === 'Enter') {
      // Let a focused button do its own thing.
      if (target?.closest('button, a')) return;
      if (showMarking && onnext) {
        event.preventDefault();
        onnext();
      } else if (!submitted && complete && !examMode) {
        event.preventDefault();
        submit();
      }
      return;
    }

    if (question.type !== 'single' && question.type !== 'multi') return;
    const key = event.key.toUpperCase();
    let index = -1;
    if (/^[1-9]$/.test(key)) index = Number(key) - 1;
    else if (key.length === 1 && LETTERS.includes(key)) index = LETTERS.indexOf(key);
    const option = options[index];
    if (!option || locked) return;
    event.preventDefault();
    choose(option);
  }

  /* ---------------- lookups for marking ---------------- */

  const rightOptions = $derived(
    question.type === 'match' ? [...new Set(question.pairs.map((p) => p.right))].sort() : [],
  );

  const itemText = $derived(
    question.type === 'order' ? Object.fromEntries(question.items.map((i) => [i.id, i.text])) : {},
  );

  const correctOrder = $derived(question.type === 'order' ? question.items.map((i) => i.id) : []);

  const correctLetters = $derived(
    options
      .map((o, i) => (o.correct ? LETTERS[i] : null))
      .filter((l): l is string => l !== null)
      .join(' and '),
  );

  const uid = $props.id();
</script>

<svelte:window onkeydown={onKey} />

<article class="q" class:marked={showMarking}>
  <header class="q-head">
    <span class="chip">{topicLabel(question.topic)}</span>
    {#if question.difficulty === 'hard'}
      <span class="chip chip-warn">Hard</span>
    {/if}
  </header>

  {#if question.scenario}
    <p class="scenario">{@html inlineMarkdown(question.scenario)}</p>
  {/if}

  <h3 class="q-prompt">{@html inlineMarkdown(question.prompt)}</h3>

  {#if question.type === 'single' || question.type === 'multi'}
    {#if question.type === 'multi'}
      <p class="choose">Choose {requiredCount}. Each correct answer is part of the solution.</p>
    {/if}
    <div class="options" role="group" aria-label="Answer options">
      {#each options as option, i (option.id)}
        {@const mark = markOf(option)}
        {@const chosen = isChosen(option.id)}
        <button
          type="button"
          class="option {mark}"
          class:chosen
          aria-pressed={chosen}
          aria-disabled={locked}
          onclick={() => choose(option)}
        >
          <span class="bubble" class:square={question.type === 'multi'} aria-hidden="true">
            {#if mark === 'right' || mark === 'missed'}
              <Icon name="check" size={16} />
            {:else if mark === 'wrong'}
              <Icon name="x" size={16} />
            {:else}
              {LETTERS[i]}
            {/if}
          </span>
          <span class="option-body">
            <span class="visually-hidden">{LETTERS[i]}.</span>
            <span class="option-text">{@html inlineMarkdown(option.text)}</span>
            {#if mark === 'missed'}
              <span class="tag tag-tick">Correct answer</span>
            {:else if mark === 'wrong'}
              <span class="tag tag-red">Your answer</span>
            {/if}
            {#if showMarking && !option.correct && option.why}
              <span class="why">{@html inlineMarkdown(option.why)}</span>
            {/if}
          </span>
        </button>
      {/each}
    </div>
  {:else if question.type === 'match'}
    <ul class="matches">
      {#each question.pairs as pair (pair.id)}
        {@const chosen = assignments[pair.id]}
        {@const ok = showMarking && chosen === pair.right}
        <li class="match" class:right={ok} class:wrong={showMarking && !ok}>
          <span class="match-left">{@html inlineMarkdown(pair.left)}</span>
          <span class="match-control">
            <select
              class="input"
              value={chosen ?? ''}
              disabled={locked}
              aria-label={`${question.rightLabel} for ${pair.left}`}
              onchange={(e) => assign(pair.id, e.currentTarget.value)}
            >
              <option value="">Choose {question.rightLabel.toLowerCase()}</option>
              {#each rightOptions as right (right)}
                <option value={right}>{right}</option>
              {/each}
            </select>
            {#if showMarking && !ok}
              <span class="correction"><Icon name="check" size={16} /> {pair.right}</span>
            {/if}
            {#if showMarking && !ok && pair.why}
              <span class="why">{@html inlineMarkdown(pair.why)}</span>
            {/if}
          </span>
        </li>
      {/each}
    </ul>
  {:else if question.type === 'order'}
    <p class="choose">Put these in order, first at the top.</p>
    <ol class="ordering">
      {#each ordering as id, i (id)}
        {@const ok = showMarking && correctOrder[i] === id}
        <li class="order-item" class:right={ok} class:wrong={showMarking && !ok}>
          <span class="order-index num" aria-hidden="true">{i + 1}</span>
          <span class="order-text">{@html inlineMarkdown(itemText[id] ?? id)}</span>
          {#if !locked}
            <span class="order-controls">
              <button
                type="button"
                class="icon-btn"
                disabled={i === 0}
                aria-label={`Move up: ${itemText[id] ?? id}`}
                onclick={() => move(i, -1)}
              >
                <Icon name="chevron-down" class="flip" />
              </button>
              <button
                type="button"
                class="icon-btn"
                disabled={i === ordering.length - 1}
                aria-label={`Move down: ${itemText[id] ?? id}`}
                onclick={() => move(i, 1)}
              >
                <Icon name="chevron-down" />
              </button>
            </span>
          {/if}
        </li>
      {/each}
    </ol>
    {#if showMarking && !wasCorrect}
      <div class="callout callout-info">
        <p class="callout-title">The correct order</p>
        <ol class="correct-order">
          {#each question.items as item (item.id)}
            <li>{@html inlineMarkdown(item.text)}</li>
          {/each}
        </ol>
      </div>
    {/if}
  {/if}

  {#if !examMode && !submitted && question.type !== 'single'}
    <footer class="q-foot">
      <button type="button" class="btn btn-primary" disabled={!complete} onclick={submit}>
        Check answer
      </button>
      {#if !complete}
        <span class="small subtle">
          {question.type === 'multi'
            ? `Choose ${requiredCount}, then check.`
            : question.type === 'match'
              ? 'Match every row, then check.'
              : 'Arrange the items, then check.'}
        </span>
      {/if}
    </footer>
  {/if}

  {#if showMarking}
    <section
      class="verdict rise-in"
      class:ok={wasCorrect}
      bind:this={verdictEl}
      tabindex="-1"
      aria-labelledby={`${uid}-verdict`}
    >
      <p class="verdict-head" id={`${uid}-verdict`}>
        <span class="verdict-mark" aria-hidden="true">
          <Icon name={wasCorrect ? 'check' : 'x'} size={18} />
        </span>
        {wasCorrect ? 'Correct' : 'Not quite'}
        {#if !wasCorrect && correctLetters}
          <span class="visually-hidden">. The correct answer is {correctLetters}.</span>
        {/if}
      </p>
      <p class="explanation">{@html inlineMarkdown(question.explanation)}</p>
      <figure class="learn">
        <figcaption class="learn-head small">From Microsoft Learn</figcaption>
        <blockquote cite={question.reference.url}>
          <p>{question.reference.quote}</p>
        </blockquote>
        <a class="learn-link small" href={question.reference.url} target="_blank" rel="noopener noreferrer">
          {question.reference.label}<Icon name="external" size={14} label="(opens in a new tab)" />
        </a>
      </figure>
      {#if onnext}
        <div class="verdict-actions">
          <button type="button" class="btn btn-primary" onclick={() => onnext?.()}>{nextLabel}</button>
          {#if keys}
            <span class="small subtle key-hint">or press <kbd>Enter</kbd></span>
          {/if}
        </div>
      {/if}
    </section>
  {/if}
</article>

<style>
  .q {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .q-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .scenario {
    margin: 0;
    padding: 0.85rem 1rem;
    border-radius: var(--radius);
    background: var(--surface-2);
    color: var(--ink-2);
    font-size: 0.97rem;
  }

  .q-prompt {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.45;
    letter-spacing: -0.014em;
    text-wrap: pretty;
  }

  .choose {
    margin: -0.4rem 0 0;
    color: var(--ink-2);
    font-size: 0.92rem;
    font-weight: 550;
  }

  /* ---- options ---- */

  .options {
    display: grid;
    gap: 0.55rem;
  }

  .option {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    width: 100%;
    min-height: 3.1rem;
    padding: 0.75rem 1rem 0.75rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-xs);
    color: var(--ink);
    font-size: 0.98rem;
    text-align: left;
    line-height: 1.5;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      background 0.15s ease,
      box-shadow 0.15s ease;
  }
  .option:hover:not([aria-disabled='true']) {
    border-color: var(--accent-edge);
    background: color-mix(in srgb, var(--accent-soft) 55%, var(--surface));
  }
  .option:hover:not([aria-disabled='true']) .bubble {
    border-color: var(--accent-edge);
    color: var(--accent);
  }
  .option[aria-disabled='true'] {
    cursor: default;
  }

  /* A keycap with the option's letter: it is also the keyboard shortcut. */
  .bubble {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    margin-top: -0.1rem;
    border: 1px solid var(--border-strong);
    border-radius: 8px;
    background: var(--surface-2);
    color: var(--ink-2);
    font-size: 0.8rem;
    font-weight: 650;
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
  }
  .bubble.square {
    border-radius: 5px;
  }

  .option.chosen {
    border-color: var(--accent);
    background: var(--accent-soft);
    box-shadow: 0 0 0 1px var(--accent);
  }
  .option.chosen .bubble,
  .option.chosen:hover .bubble {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--on-accent);
  }

  .option.right {
    border-color: var(--success);
    background: var(--success-soft);
    box-shadow: 0 0 0 1px var(--success);
  }
  .option.right .bubble {
    border-color: var(--success);
    background: var(--success);
    color: var(--surface);
  }

  .option.wrong {
    border-color: var(--danger);
    background: var(--danger-soft);
    box-shadow: 0 0 0 1px var(--danger);
  }
  .option.wrong .bubble {
    border-color: var(--danger);
    background: var(--danger);
    color: var(--surface);
  }

  .option.missed {
    border-color: var(--success);
    border-style: dashed;
    box-shadow: none;
  }
  .option.missed .bubble {
    border-color: var(--success-edge);
    background: var(--success-soft);
    color: var(--success);
  }

  .option.other {
    color: var(--ink-2);
    box-shadow: none;
  }
  .option.other .bubble {
    opacity: 0.7;
  }

  .option-body {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 0;
  }

  .tag {
    align-self: flex-start;
    font-size: 0.78rem;
    font-weight: 650;
  }
  .tag-tick {
    color: var(--success);
  }
  .tag-red {
    color: var(--danger);
  }

  .why {
    color: var(--ink-2);
    font-size: 0.92rem;
  }

  /* ---- matching ---- */

  .matches,
  .ordering {
    display: grid;
    gap: 0.55rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .matches li + li,
  .ordering li + li {
    margin-top: 0;
  }

  .match {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0.6rem 1rem;
    align-items: start;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-xs);
  }
  .match.right {
    border-color: var(--success-edge);
    background: var(--success-soft);
  }
  .match.wrong {
    border-color: var(--danger-edge);
    background: var(--danger-soft);
  }
  .match-left {
    align-self: center;
    font-weight: 550;
  }
  .match-control {
    display: grid;
    gap: 0.35rem;
  }
  .correction {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--success);
    font-weight: 650;
    font-size: 0.92rem;
  }

  @media (max-width: 560px) {
    .match {
      grid-template-columns: 1fr;
    }
  }

  /* ---- ordering ---- */

  .order-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 3.1rem;
    padding: 0.45rem 0.5rem 0.45rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-xs);
  }
  .order-item.right {
    border-color: var(--success-edge);
    background: var(--success-soft);
  }
  .order-item.wrong {
    border-color: var(--danger-edge);
    background: var(--danger-soft);
  }
  .order-index {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border: 1px solid var(--border-strong);
    border-radius: 8px;
    background: var(--surface-2);
    color: var(--ink-2);
    font-size: 0.8rem;
    font-weight: 650;
  }
  .order-text {
    flex: 1;
    min-width: 0;
  }
  .order-controls {
    display: flex;
    flex-shrink: 0;
  }
  .order-controls :global(.flip) {
    rotate: 180deg;
  }
  .order-controls .icon-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }
  .correct-order {
    margin: 0;
  }

  .q-foot {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  /* ---- marking ---- */

  .verdict {
    padding: 1.1rem 1.2rem 1.2rem;
    border: 1px solid var(--danger-edge);
    border-radius: var(--radius-lg);
    background: var(--danger-soft);
  }
  .verdict.ok {
    border-color: var(--success-edge);
    background: var(--success-soft);
  }
  .verdict:focus {
    outline: none;
  }
  .verdict:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .verdict-head {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin: 0 0 0.5rem;
    color: var(--danger);
    font-size: 1.05rem;
    font-weight: 650;
    letter-spacing: -0.01em;
  }
  .verdict.ok .verdict-head {
    color: var(--success);
  }
  .verdict-mark {
    display: grid;
    place-items: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: var(--danger);
    color: var(--surface);
  }
  .verdict.ok .verdict-mark {
    background: var(--success);
  }

  .explanation {
    margin: 0;
  }

  /* The official wording, so the learner can check the guide against the source. */
  .learn {
    margin: 0.9rem 0 0;
    padding: 0.85rem 1rem 0.9rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
  }
  .learn-head {
    margin: 0 0 0.4rem;
    color: var(--ink-3);
    font-weight: 600;
  }
  .learn blockquote {
    margin: 0 0 0.55rem;
    padding-left: 0.85rem;
    border-left: 2px solid var(--accent-edge);
    color: var(--ink-2);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .learn blockquote p {
    margin: 0;
  }
  .learn-link {
    font-weight: 550;
  }
  .learn-link :global(.icon) {
    margin-left: 0.3rem;
    vertical-align: -0.15em;
  }

  .verdict-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  @media (hover: none) {
    .key-hint {
      display: none;
    }
  }
</style>
