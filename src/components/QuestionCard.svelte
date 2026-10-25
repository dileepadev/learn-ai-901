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
  import { BLANK, blankText, type Answer, type ChoiceOption, type Question } from '../data/types';
  import { grade, pointsFor, score } from '../lib/store';
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

  const blankOptions = $derived<Record<string, ChoiceOption[]>>(
    question.type === 'dropdown'
      ? Object.fromEntries(
          question.blanks.map((b) => [b.id, shuffleStable(b.options, `${question.id}:${b.id}:${seed}`)]),
        )
      : {},
  );

  /** A dropdown question's blanks sit in its code, when the code has any. */
  const inCode = $derived(question.type === 'dropdown' && blankText(question) === question.code);

  /** The sentence or code around a dropdown question's blanks. */
  const sentence = $derived(question.type === 'dropdown' ? blankText(question).split(BLANK) : []);

  /** Build-list steps in a stable order that never hands out the answer. */
  const stepOrder = $derived.by(() => {
    if (question.type !== 'order') return [];
    const ids = question.items.map((i) => i.id);
    const shuffled = shuffleStable(ids, `${question.id}:order`);
    // If the shuffle lands on the correct order, rotate it.
    return shuffled.every((id, i) => id === ids[i]) ? [...ids.slice(1), ids[0]!] : shuffled;
  });

  /* ---------------- answer state ---------------- */

  const start = untrack(() => ({ initial, revealed, question }));

  /** Blank-per-part state, keyed by part id, seeded from a saved answer. */
  function parts<T>(ids: string[], saved: Record<string, T | null> | undefined): Record<string, T | null> {
    return Object.fromEntries(ids.map((id) => [id, saved?.[id] ?? null]));
  }

  let selectedSingle = $state<string | null>(
    start.initial?.type === 'single' ? start.initial.optionId : null,
  );
  let selectedMulti = $state<string[]>(
    start.initial?.type === 'multi' ? [...start.initial.optionIds] : [],
  );
  let assignments = $state<Record<string, string | null>>(
    start.question.type === 'match'
      ? parts(
          start.question.pairs.map((p) => p.id),
          start.initial?.type === 'match' ? start.initial.assignments : undefined,
        )
      : {},
  );
  /** Build list: the steps in the answer area, in the learner's order. */
  let ordering = $state<string[]>(start.initial?.type === 'order' ? [...start.initial.itemIds] : []);
  let verdicts = $state<Record<string, boolean | null>>(
    start.question.type === 'yesno'
      ? parts(
          start.question.statements.map((s) => s.id),
          start.initial?.type === 'yesno' ? start.initial.values : undefined,
        )
      : {},
  );
  let choices = $state<Record<string, string | null>>(
    start.question.type === 'dropdown'
      ? parts(
          start.question.blanks.map((b) => b.id),
          start.initial?.type === 'dropdown' ? start.initial.choices : undefined,
        )
      : {},
  );

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
      case 'yesno':
        return { type: 'yesno', values: verdicts };
      case 'dropdown':
        return { type: 'dropdown', choices };
    }
  });

  const complete = $derived.by(() => {
    switch (question.type) {
      case 'single':
        return selectedSingle !== null;
      case 'multi':
        return selectedMulti.length === requiredCount;
      case 'match':
        return question.pairs.every((p) => assignments[p.id]);
      case 'order':
        return ordering.length === question.items.length;
      case 'yesno':
        return question.statements.every((s) => verdicts[s.id] !== null);
      case 'dropdown':
        return question.blanks.every((b) => choices[b.id]);
    }
  });

  const requiredCount = $derived(
    question.type === 'multi' ? question.options.filter((o) => o.correct).length : 0,
  );

  const showMarking = $derived(submitted && !examMode);
  const locked = $derived(showMarking);
  /** Read only once marked, so a click does not re-score the answer. */
  const points = $derived(score(question, answer));
  /** Multi-part questions earn a point per part, and say so, as the real exam does. */
  const perPart = $derived(pointsFor(question) > 1);

  /* ---------------- interactions ---------------- */

  let verdictEl = $state<HTMLElement | null>(null);
  /** Read out by screen readers: limits reached, values picked up and placed. */
  let note = $state('');
  /** A multi-answer option was refused because the limit is reached. Shown, not only read out. */
  let limitHit = $state(false);

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
    limitHit = false;
    if (selectedMulti.includes(id)) {
      selectedMulti = selectedMulti.filter((x) => x !== id);
      note = '';
    } else if (selectedMulti.length >= requiredCount) {
      // Choosing more than asked would earn nothing extra on the exam either.
      note = `You have chosen ${requiredCount}. Clear one to change your answer.`;
      limitHit = true;
      return;
    } else {
      selectedMulti = [...selectedMulti, id];
    }
    changed();
  }

  function choose(option: ChoiceOption) {
    if (question.type === 'single') pickSingle(option.id);
    else toggleMulti(option.id);
  }

  function setVerdict(statementId: string, yes: boolean) {
    if (locked) return;
    verdicts = { ...verdicts, [statementId]: yes };
    changed();
  }

  function fill(blankId: string, optionId: string) {
    if (locked) return;
    choices = { ...choices, [blankId]: optionId || null };
    changed();
  }

  /* ---------------- drag and drop ---------------- */

  /**
   * Everything that can be dragged can also be selected and then placed, so
   * the same questions work by touch, keyboard and screen reader. `held` is
   * the value or step picked up that way.
   */
  let held = $state<string | null>(null);
  let dropTarget = $state<string | null>(null);

  function pickUp(value: string) {
    if (locked) return;
    held = held === value ? null : value;
    note = held ? `${value} picked up. Choose the row it belongs in.` : '';
  }

  function assign(pairId: string, value: string | null) {
    if (locked) return;
    assignments = { ...assignments, [pairId]: value };
    changed();
  }

  function placeHeld(pairId: string, left: string) {
    if (!held) return;
    assign(pairId, held);
    note = `${held} placed next to ${left}.`;
    held = null;
  }

  function place(id: string, before: string | null = null) {
    if (locked) return;
    const next = ordering.filter((x) => x !== id);
    const at = before === null ? -1 : next.indexOf(before);
    next.splice(at === -1 ? next.length : at, 0, id);
    ordering = next;
    changed();
  }

  function unplace(id: string) {
    if (locked) return;
    ordering = ordering.filter((x) => x !== id);
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

  /** Drag payloads: a value from the bank, a filled slot, or a build-list step. */
  type Dragged = { kind: 'value'; value: string } | { kind: 'slot'; pairId: string } | { kind: 'step'; id: string };

  /** One type per question, so a card ignores what is dragged out of another card on the page. */
  const DRAG_MIME = $derived(`application/x-ai901-drag-${question.id}`);

  function dragStart(event: DragEvent, payload: Dragged) {
    if (locked || !event.dataTransfer) return;
    event.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
    event.dataTransfer.effectAllowed = 'move';
    held = null;
  }

  function dragged(event: DragEvent): Dragged | null {
    try {
      return JSON.parse(event.dataTransfer?.getData(DRAG_MIME) ?? '') as Dragged;
    } catch {
      return null;
    }
  }

  function allowDrop(event: DragEvent, target: string) {
    if (locked || !event.dataTransfer?.types.includes(DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    dropTarget = target;
  }

  function leave(target: string) {
    if (dropTarget === target) dropTarget = null;
  }

  function dropOnSlot(event: DragEvent, pairId: string) {
    event.preventDefault();
    dropTarget = null;
    const d = dragged(event);
    if (d?.kind === 'value') assign(pairId, d.value);
    else if (d?.kind === 'slot' && d.pairId !== pairId) {
      const value = assignments[d.pairId] ?? null;
      assignments = { ...assignments, [d.pairId]: null };
      assign(pairId, value);
    }
  }

  function dropOnBank(event: DragEvent) {
    event.preventDefault();
    dropTarget = null;
    const d = dragged(event);
    if (d?.kind === 'slot') assign(d.pairId, null);
  }

  function dropStep(event: DragEvent, before: string | null) {
    event.preventDefault();
    event.stopPropagation();
    dropTarget = null;
    const d = dragged(event);
    if (d?.kind === 'step' && d.id !== before) place(d.id, before);
  }

  function dropOnSteps(event: DragEvent) {
    event.preventDefault();
    dropTarget = null;
    const d = dragged(event);
    if (d?.kind === 'step') unplace(d.id);
  }

  async function submit() {
    if (submitted || !complete || examMode) return;
    submitted = true;
    held = null;
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
    if (event.key === 'Escape' && held) {
      held = null;
      note = '';
      return;
    }
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

  const itemText = $derived<Record<string, string>>(
    question.type === 'order' ? Object.fromEntries(question.items.map((i) => [i.id, i.text])) : {},
  );

  const correctOrder = $derived(question.type === 'order' ? question.items.map((i) => i.id) : []);

  /** Build-list steps still outside the answer area. */
  const unplaced = $derived(stepOrder.filter((id) => !ordering.includes(id)));

  const instruction = $derived.by(() => {
    switch (question.type) {
      case 'multi':
        return `Choose ${requiredCount}. Each correct answer is part of the solution.`;
      case 'match':
        return 'Drag each item into the row it belongs in, or select an item and then select the row. Each item may be used once, more than once, or not at all.';
      case 'order':
        return 'Move the steps into the answer area and arrange them in the correct order. Drag them, or select a step to add it next.';
      case 'yesno':
        return 'For each statement, select Yes if it is true. Otherwise, select No.';
      default:
        return '';
    }
  });

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

  {#if question.type === 'dropdown' && !inCode}
    <h3 class="q-prompt">
      Select the {question.blanks.length > 1 ? 'answers that correctly complete' : 'answer that correctly completes'} the
      sentence.
    </h3>
  {:else}
    <h3 class="q-prompt">{@html inlineMarkdown(question.prompt)}</h3>
  {/if}

  {#if question.code && !inCode}
    <figure class="codeblock q-code">
      <figcaption>Python</figcaption>
      <pre><code>{question.code}</code></pre>
    </figure>
  {/if}

  {#if instruction || perPart}
    <p class="choose">
      {instruction}
      {#if perPart}<span class="per-part">Each correct selection is worth one point.</span>{/if}
    </p>
  {/if}
  <p class="visually-hidden" aria-live="polite">{note}</p>

  {#if question.type === 'single' || question.type === 'multi'}
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
    {#if limitHit && !locked}
      <p class="small subtle" aria-hidden="true">You have chosen {requiredCount}. Clear one to change your answer.</p>
    {/if}
  {:else if question.type === 'yesno'}
    <ul class="statements">
      {#each question.statements as statement (statement.id)}
        {@const value = verdicts[statement.id]}
        {@const ok = showMarking && value === statement.yes}
        <li class="statement" class:right={ok} class:wrong={showMarking && !ok}>
          <span class="statement-text" id={`${uid}-${statement.id}`}>{@html inlineMarkdown(statement.text)}</span>
          <span class="yn" role="radiogroup" aria-labelledby={`${uid}-${statement.id}`}>
            {#each [true, false] as yes (yes)}
              <label class="yn-choice" class:on={value === yes}>
                <input
                  type="radio"
                  name={`${uid}-${statement.id}`}
                  checked={value === yes}
                  disabled={locked}
                  onchange={() => setVerdict(statement.id, yes)}
                />
                <span>{yes ? 'Yes' : 'No'}</span>
              </label>
            {/each}
          </span>
          {#if showMarking}
            <span class="statement-mark">
              <span class="correction" class:off={!ok}>
                <Icon name={ok ? 'check' : 'x'} size={16} />
                {ok ? 'Right' : 'Wrong'}: the answer is {statement.yes ? 'Yes' : 'No'}.
              </span>
              <span class="why">{@html inlineMarkdown(statement.why)}</span>
            </span>
          {/if}
        </li>
      {/each}
    </ul>
  {:else if question.type === 'dropdown'}
    {#snippet blankSelect(i: number)}
      {#if question.type === 'dropdown' && question.blanks[i]}
        {@const blank = question.blanks[i]!}
        {@const chosen = choices[blank.id]}
        {@const ok = showMarking && blank.options.some((o) => o.correct && o.id === chosen)}
        <select
          class="input blank"
          class:right={ok}
          class:wrong={showMarking && !ok}
          value={chosen ?? ''}
          disabled={locked}
          aria-label={question.blanks.length > 1 ? `Blank ${i + 1}` : 'Answer'}
          onchange={(e) => fill(blank.id, e.currentTarget.value)}
        >
          <option value="">Choose an answer</option>
          {#each blankOptions[blank.id] ?? [] as option (option.id)}
            <option value={option.id}>{option.text}</option>
          {/each}
        </select>
      {/if}
    {/snippet}
    {#if inCode}
      <!-- One line on purpose: whitespace inside <pre> is part of the code. -->
      <figure class="codeblock q-code answer-code">
        <figcaption>Answer area: Python</figcaption>
        <pre><code>{#each sentence as part, i (i)}{part}{@render blankSelect(i)}{/each}</code></pre>
      </figure>
    {:else}
      <div class="answer-area sentence">
        <p class="area-label">Answer area</p>
        <!-- Kept on one line where it matters: whitespace here would show as a gap before the punctuation. -->
        <p class="sentence-text">
          {#each sentence as part, i (i)}{@html inlineMarkdown(part)}{@render blankSelect(i)}{/each}
        </p>
      </div>
    {/if}
    {#if showMarking}
      <ul class="blank-marks">
        {#each question.blanks as blank, i (blank.id)}
          {#each [...blank.options].sort((a, b) => Number(b.correct) - Number(a.correct)) as option (option.id)}
            {@const chosen = choices[blank.id] === option.id}
            <li class:right={option.correct} class:wrong={chosen && !option.correct}>
              <span class="correction" class:off={chosen && !option.correct} class:muted={!chosen && !option.correct}>
                <Icon name={option.correct ? 'check' : 'x'} size={16} />
                {question.blanks.length > 1 ? `Blank ${i + 1}: ` : ''}{option.text}
                {#if chosen}<span class="tag" class:tag-red={!option.correct}>Your answer</span>{/if}
              </span>
              {#if !option.correct && option.why}
                <span class="why">{@html inlineMarkdown(option.why)}</span>
              {/if}
            </li>
          {/each}
        {/each}
      </ul>
    {/if}
  {:else if question.type === 'match'}
    <div class="dnd">
      {#if !locked}
        <!-- Dropping a placed value back on the list removes it. Every drag here has a select-and-place equivalent. -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="bank"
          class:target={dropTarget === 'bank'}
          ondragover={(e) => allowDrop(e, 'bank')}
          ondragleave={() => leave('bank')}
          ondrop={dropOnBank}
        >
          <p class="area-label" id={`${uid}-bank`}>{question.rightLabel}</p>
          <ul class="tokens" aria-labelledby={`${uid}-bank`}>
            {#each rightOptions as value (value)}
              <li>
                <button
                  type="button"
                  class="token"
                  class:held={held === value}
                  draggable="true"
                  aria-pressed={held === value}
                  ondragstart={(e) => dragStart(e, { kind: 'value', value })}
                  ondragend={() => (dropTarget = null)}
                  onclick={() => pickUp(value)}>{value}</button
                >
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      <div class="answer-area">
        <p class="area-label">Answer area</p>
        <ul class="matches">
          {#each question.pairs as pair (pair.id)}
            {@const chosen = assignments[pair.id]}
            {@const ok = showMarking && chosen === pair.right}
            <li class="match" class:right={ok} class:wrong={showMarking && !ok}>
              <span class="match-left">{@html inlineMarkdown(pair.left)}</span>
              <span class="match-control">
                {#if locked}
                  <span class="slot filled">{chosen ?? 'Not answered'}</span>
                {:else}
                  <span class="slot-row">
                    <button
                      type="button"
                      class="slot"
                      class:filled={chosen !== null}
                      class:ready={held !== null}
                      class:target={dropTarget === pair.id}
                      draggable={chosen ? 'true' : 'false'}
                      aria-label={`${question.rightLabel} for ${pair.left}: ${chosen ?? 'empty'}${held ? `. Select to place ${held} here` : ''}`}
                      ondragstart={(e) => dragStart(e, { kind: 'slot', pairId: pair.id })}
                      ondragend={() => (dropTarget = null)}
                      ondragover={(e) => allowDrop(e, pair.id)}
                      ondragleave={() => leave(pair.id)}
                      ondrop={(e) => dropOnSlot(e, pair.id)}
                      onclick={() => placeHeld(pair.id, pair.left)}
                    >
                      {chosen ?? (held ? 'Place here' : 'Drop here')}
                    </button>
                    {#if chosen}
                      <button
                        type="button"
                        class="icon-btn"
                        aria-label={`Remove ${chosen} from ${pair.left}`}
                        onclick={() => assign(pair.id, null)}
                      >
                        <Icon name="x" size={16} />
                      </button>
                    {/if}
                  </span>
                {/if}
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
      </div>
    </div>
  {:else if question.type === 'order'}
    <div class="dnd build" class:split={!locked}>
      {#if !locked}
        <!-- Dropping a step back here takes it out of the answer area. -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="bank"
          class:target={dropTarget === 'steps'}
          ondragover={(e) => allowDrop(e, 'steps')}
          ondragleave={() => leave('steps')}
          ondrop={dropOnSteps}
        >
          <p class="area-label" id={`${uid}-steps`}>Steps</p>
          {#if unplaced.length}
            <ul class="steps" aria-labelledby={`${uid}-steps`}>
              {#each unplaced as id (id)}
                <li>
                  <button
                    type="button"
                    class="token step"
                    draggable="true"
                    aria-label={`Add to the answer area: ${itemText[id] ?? id}`}
                    ondragstart={(e) => dragStart(e, { kind: 'step', id })}
                    ondragend={() => (dropTarget = null)}
                    onclick={() => place(id)}>{@html inlineMarkdown(itemText[id] ?? id)}</button
                  >
                </li>
              {/each}
            </ul>
          {:else}
            <p class="small subtle">Every step is in the answer area.</p>
          {/if}
        </div>
      {/if}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="answer-area"
        class:target={dropTarget === 'answer'}
        ondragover={(e) => allowDrop(e, 'answer')}
        ondragleave={() => leave('answer')}
        ondrop={(e) => dropStep(e, null)}
      >
        <p class="area-label">Answer area</p>
        {#if ordering.length === 0}
          <p class="drop-hint small subtle">
            {locked ? 'No steps were placed.' : 'Drag the steps here, or select them in order.'}
          </p>
        {/if}
        <ol class="ordering">
          {#each ordering as id, i (id)}
            {@const ok = showMarking && correctOrder[i] === id}
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li
              class="order-item"
              class:right={ok}
              class:wrong={showMarking && !ok}
              class:target={dropTarget === id}
              draggable={locked ? 'false' : 'true'}
              ondragstart={(e) => dragStart(e, { kind: 'step', id })}
              ondragend={() => (dropTarget = null)}
              ondragover={(e) => {
                // Keep the answer area's own handler from taking the marker back.
                e.stopPropagation();
                allowDrop(e, id);
              }}
              ondragleave={() => leave(id)}
              ondrop={(e) => dropStep(e, id)}
            >
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
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label={`Take out of the answer area: ${itemText[id] ?? id}`}
                    onclick={() => unplace(id)}
                  >
                    <Icon name="x" size={16} />
                  </button>
                </span>
              {/if}
            </li>
          {/each}
        </ol>
      </div>
    </div>
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
          {#if question.type === 'multi'}
            Choose {requiredCount}, then check.
          {:else if question.type === 'match'}
            Fill every row, then check.
          {:else if question.type === 'order'}
            Move every step into the answer area, then check.
          {:else if question.type === 'yesno'}
            Answer every statement, then check.
          {:else}
            Fill the {question.blanks.length > 1 ? 'blanks' : 'blank'}, then check.
          {/if}
        </span>
      {/if}
    </footer>
  {/if}

  {#if showMarking}
    <section
      class="verdict rise-in"
      class:ok={wasCorrect}
      class:partial={!wasCorrect && points.earned > 0}
      bind:this={verdictEl}
      tabindex="-1"
      aria-labelledby={`${uid}-verdict`}
    >
      <p class="verdict-head" id={`${uid}-verdict`}>
        <span class="verdict-mark" aria-hidden="true">
          <Icon name={wasCorrect ? 'check' : 'x'} size={18} />
        </span>
        {#if wasCorrect}
          Correct{perPart ? `: all ${points.possible} points` : ''}
        {:else if points.earned > 0}
          Partly right: {points.earned} of {points.possible} points
        {:else}
          Not quite
        {/if}
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

  /* ---- Yes/No statements ---- */

  .per-part {
    display: block;
    margin-top: 0.15rem;
    color: var(--ink-3);
    font-weight: 600;
  }

  .statements,
  .blank-marks,
  .tokens,
  .steps {
    display: grid;
    gap: 0.55rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .statements li + li,
  .blank-marks li + li,
  .tokens li + li,
  .steps li + li {
    margin-top: 0;
  }

  .statement {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.6rem 1rem;
    align-items: center;
    padding: 0.7rem 0.75rem 0.7rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-xs);
  }
  .statement.right,
  .blank-marks .right {
    border-color: var(--success-edge);
    background: var(--success-soft);
  }
  .statement.wrong,
  .blank-marks .wrong {
    border-color: var(--danger-edge);
    background: var(--danger-soft);
  }
  .statement-mark {
    display: grid;
    grid-column: 1 / -1;
    gap: 0.25rem;
  }

  /* Two pills per statement, backed by real radio buttons for the keyboard. */
  .yn {
    display: inline-flex;
    gap: 0.35rem;
  }
  .yn-choice {
    position: relative;
    display: inline-grid;
    place-items: center;
    min-width: 3.6rem;
    min-height: 2.5rem;
    padding: 0 0.8rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    background: var(--surface-2);
    color: var(--ink-2);
    font-weight: 600;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      background 0.15s ease;
  }
  .yn-choice input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }
  .yn-choice:hover {
    border-color: var(--accent-edge);
  }
  .yn-choice:has(input:focus-visible) {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .yn-choice.on {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--on-accent);
  }
  .yn-choice:has(input:disabled) {
    cursor: default;
  }

  .correction.off {
    color: var(--danger);
  }
  .correction.muted {
    color: var(--ink-2);
  }

  @media (max-width: 560px) {
    .statement {
      grid-template-columns: 1fr;
    }
  }

  /* ---- answer areas: sentence completion and drag and drop ---- */

  .answer-area,
  .bank {
    display: grid;
    gap: 0.6rem;
    align-content: start;
    padding: 0.9rem 1rem 1rem;
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius-lg);
    transition:
      border-color 0.15s ease,
      background 0.15s ease;
  }
  .bank {
    border-style: solid;
    border-color: var(--border);
    background: var(--surface-2);
  }
  .answer-area.target,
  .bank.target {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .area-label {
    margin: 0;
    color: var(--ink-3);
    font-size: 0.78rem;
    font-weight: 650;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .sentence-text {
    margin: 0;
    font-size: 1.02rem;
    line-height: 2.2;
  }
  .blank {
    display: inline-block;
    width: auto;
    max-width: 100%;
    margin: 0 0.2rem 0 0;
    vertical-align: baseline;
  }
  /* A dropdown inside code sits on the code's own line, in the code's own font. */
  .answer-code .blank {
    min-height: 0;
    margin: 0.15rem 0;
    padding: 0.1rem 1.6rem 0.1rem 0.45rem;
    font-family: var(--mono);
    font-size: inherit;
    line-height: 1.4;
    vertical-align: baseline;
  }
  /* Wrap long lines rather than scroll, so no blank or line label hides off to the side. */
  .q-code > pre {
    line-height: 1.9;
    white-space: pre-wrap;
  }
  .q-code code {
    overflow-wrap: anywhere;
  }

  .blank.right {
    border-color: var(--success);
    box-shadow: 0 0 0 1px var(--success);
  }
  .blank.wrong {
    border-color: var(--danger);
    box-shadow: 0 0 0 1px var(--danger);
  }
  .blank-marks li {
    display: grid;
    gap: 0.25rem;
    padding: 0.6rem 0.9rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .dnd {
    display: grid;
    gap: 0.75rem;
  }
  @media (min-width: 760px) {
    .dnd.build.split {
      grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
      align-items: start;
    }
  }

  .tokens {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }
  .token {
    display: inline-flex;
    align-items: center;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.45rem 0.8rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    background: var(--surface);
    box-shadow: var(--shadow-xs);
    color: var(--ink);
    font: inherit;
    font-size: 0.95rem;
    font-weight: 550;
    text-align: left;
    cursor: grab;
    transition:
      border-color 0.15s ease,
      background 0.15s ease,
      box-shadow 0.15s ease;
  }
  .tokens .token {
    width: auto;
  }
  .token:hover {
    border-color: var(--accent-edge);
  }
  .token:active {
    cursor: grabbing;
  }
  .token.held {
    border-color: var(--accent);
    background: var(--accent-soft);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .slot-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .slot {
    flex: 1;
    min-width: 0;
    min-height: 2.5rem;
    padding: 0.45rem 0.8rem;
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius);
    background: var(--surface-2);
    color: var(--ink-3);
    font: inherit;
    font-size: 0.95rem;
    text-align: left;
    transition:
      border-color 0.15s ease,
      background 0.15s ease;
  }
  button.slot {
    cursor: pointer;
  }
  .slot.filled {
    border-style: solid;
    background: var(--surface);
    color: var(--ink);
    font-weight: 550;
    cursor: grab;
  }
  .slot.ready,
  .slot.target {
    border-color: var(--accent);
    background: var(--accent-soft);
    color: var(--accent);
  }

  .order-item[draggable='true'] {
    cursor: grab;
  }
  .order-item.target {
    box-shadow: inset 0 3px 0 var(--accent);
  }
  .drop-hint {
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
  .verdict.partial {
    border-color: var(--warn-edge);
    background: var(--warn-soft);
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
  .verdict.partial .verdict-head {
    color: var(--warn);
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
  .verdict.partial .verdict-mark {
    background: var(--warn);
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
