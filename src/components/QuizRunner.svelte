<script lang="ts">
  /**
   * Runs a non-exam session: one question at a time with immediate marking,
   * then a results sheet and the option to retry only what was missed.
   *
   * The caller builds the question list, so this component never needs the
   * whole bank.
   */
  import { untrack } from 'svelte';
  import type { Answer, Question, SessionMode, TopicId } from '../data/types';
  import { recordAnswer, saveSession } from '../lib/store';
  import { topicLabel } from '../data/exam';
  import QuestionCard from './QuestionCard.svelte';
  import Icon from './Icon.svelte';

  interface Props {
    questions: Question[];
    mode: SessionMode;
    title: string;
    base: string;
    /** Module id or topic list this session covers, stored with the result. */
    scope?: string;
    /** Where "done" sends the learner. */
    doneHref?: string;
    doneLabel?: string;
    /** What to say when the set is empty. */
    emptyMessage?: string;
    /** Offer a fresh set at the end. The caller builds it. */
    onrestart?: () => void;
    /** Called after the session is saved. */
    onfinish?: (correct: number, total: number) => void;
  }

  let {
    questions,
    mode,
    title,
    base,
    scope,
    doneHref,
    doneLabel = 'Back to practice',
    emptyMessage = 'Every question in this set is answered and not due again yet. Come back later, or pick another set.',
    onrestart,
    onfinish,
  }: Props = $props();

  const link = (p: string) => `${base.replace(/\/$/, '')}${p}`;

  interface Attempt {
    correct: boolean;
    answer: Answer;
  }

  // The first run renders on the server too, so it starts from the props with a
  // fixed shuffle seed. Later runs get a fresh seed so options move around.
  let source = untrack(() => questions);
  let queue = $state.raw<Question[]>(source);
  let index = $state(0);
  let attempts = $state<Record<string, Attempt>>({});
  let startedAt = Date.now();
  let finished = $state(false);
  let seed = $state(0);

  function begin(list: Question[]) {
    queue = list;
    index = 0;
    attempts = {};
    startedAt = Date.now();
    finished = false;
    seed = Math.floor(Math.random() * 1e9);
  }

  // A new list from the caller (a rebuilt set) starts a new run.
  $effect(() => {
    if (questions === source) return;
    source = questions;
    begin(questions);
  });

  const current = $derived(queue[index]);
  const total = $derived(queue.length);
  const answered = $derived(queue.filter((q) => attempts[q.id]));
  const correctCount = $derived(answered.filter((q) => attempts[q.id]?.correct).length);
  const missedQuestions = $derived(answered.filter((q) => !attempts[q.id]?.correct));
  const scorePct = $derived(
    answered.length ? Math.round((correctCount / answered.length) * 100) : 0,
  );

  function handleAnswered(isCorrect: boolean, answer: Answer) {
    const q = current;
    if (!q || attempts[q.id]) return;
    recordAnswer(q.id, isCorrect);
    attempts = { ...attempts, [q.id]: { correct: isCorrect, answer } };
  }

  function next() {
    if (index + 1 >= queue.length) finish();
    else {
      index += 1;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function finish() {
    finished = true;
    window.scrollTo({ top: 0 });
    // Only questions actually answered count. Ending early must not score the rest.
    if (answered.length === 0) return;
    const byTopic: Partial<Record<TopicId, { total: number; correct: number }>> = {};
    for (const q of answered) {
      const entry = (byTopic[q.topic] ??= { total: 0, correct: 0 });
      entry.total += 1;
      if (attempts[q.id]?.correct) entry.correct += 1;
    }
    saveSession({
      mode,
      scope,
      startedAt,
      finishedAt: Date.now(),
      total: answered.length,
      correct: correctCount,
      missed: missedQuestions.map((q) => q.id),
      byTopic,
    });
    onfinish?.(correctCount, answered.length);
  }

  const missedByTopic = $derived.by(() => {
    const counts = new Map<TopicId, number>();
    for (const q of missedQuestions) counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  });

  const verdict = $derived(
    scorePct >= 90
      ? 'Excellent. This material is solid.'
      : scorePct >= 70
        ? 'Solid. Tidy up the misses below and it will stick.'
        : scorePct >= 50
          ? 'Getting there. The misses below are where the marks are.'
          : 'Worth rereading the lesson before drilling further.',
  );
</script>

<div class="runner">
  {#if total === 0}
    <div class="sheet empty">
      <h2>Nothing to practise here right now</h2>
      <p class="muted">{emptyMessage}</p>
      <a class="btn btn-primary" href={doneHref ?? link('/practice/')}>{doneLabel}</a>
    </div>
  {:else if !finished && current}
    <header class="runner-head">
      <div class="spread">
        <div>
          <h1 class="runner-title">{title}</h1>
          <p class="small subtle num">Question {index + 1} of {total}</p>
        </div>
        <p class="tally num" aria-label={`${correctCount} correct, ${answered.length - correctCount} wrong so far`}>
          <span class="t-ok"><Icon name="check" size={16} />{correctCount}</span>
          <span class="t-no"><Icon name="x" size={16} />{answered.length - correctCount}</span>
        </p>
      </div>
      <div
        class="bar"
        role="progressbar"
        aria-label="Session progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered.length}
      >
        <span style:width={`${(answered.length / total) * 100}%`}></span>
      </div>
    </header>

    <div class="sheet question-sheet">
      {#key `${current.id}:${seed}`}
        <QuestionCard
          question={current}
          {seed}
          keys
          onanswered={handleAnswered}
          onnext={next}
          nextLabel={index + 1 >= total ? 'See results' : 'Next question'}
        />
      {/key}
    </div>

    <div class="runner-foot">
      <button type="button" class="btn btn-ghost btn-sm" onclick={finish}>
        {answered.length === 0 ? 'Leave this session' : 'End session and see results'}
      </button>
      <span class="small subtle key-help">
        Answer with <kbd>A</kbd> to <kbd>D</kbd> or <kbd>1</kbd> to <kbd>4</kbd>
      </span>
    </div>
  {:else if answered.length === 0}
    <div class="sheet empty">
      <h2>Session ended</h2>
      <p class="muted">You left before answering anything, so nothing was recorded.</p>
      <div class="row">
        <button type="button" class="btn btn-primary" onclick={() => begin(queue)}>Start again</button>
        <a class="btn" href={doneHref ?? link('/practice/')}>{doneLabel}</a>
      </div>
    </div>
  {:else}
    <div class="results">
      <section class="sheet result-sheet" aria-labelledby="result-title">
        <p class="score num" aria-hidden="true">
          <span class="score-big" class:good={scorePct >= 70} class:mid={scorePct >= 50 && scorePct < 70}
            >{scorePct}%</span
          >
        </p>
        <h1 id="result-title" class="result-title num">
          {correctCount} of {answered.length} correct
        </h1>
        {#if answered.length < total}
          <p class="small subtle num">You answered {answered.length} of the {total} questions in this set.</p>
        {/if}
        <p class="muted">{verdict}</p>
        <div class="row">
          {#if missedQuestions.length}
            <button type="button" class="btn btn-primary" onclick={() => begin(missedQuestions)}>
              Retry the {missedQuestions.length} you missed
            </button>
          {/if}
          {#if onrestart}
            <button type="button" class="btn" onclick={() => onrestart?.()}>New set</button>
          {:else}
            <button type="button" class="btn" onclick={() => begin(queue)}>Try the whole set again</button>
          {/if}
          <a class="btn btn-ghost" href={doneHref ?? link('/practice/')}>{doneLabel}</a>
        </div>
      </section>

      {#if missedByTopic.length}
        <section class="sheet">
          <h2 class="h-sm">Where the misses were</h2>
          <ul class="topic-misses">
            {#each missedByTopic as [topic, count] (topic)}
              <li>
                <span>{topicLabel(topic)}</span>
                <span class="chip chip-danger num">{count} missed</span>
                <a class="small" href={link(`/practice/weak/?topic=${topic}`)}>Drill {topicLabel(topic)}</a>
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if missedQuestions.length}
        <section class="review-list" aria-labelledby="review-title">
          <h2 class="h-sm" id="review-title">Your misses, marked</h2>
          {#each missedQuestions as q (q.id)}
            <div class="sheet">
              <QuestionCard question={q} {seed} revealed initial={attempts[q.id]?.answer ?? null} />
            </div>
          {/each}
        </section>
      {/if}
    </div>
  {/if}
</div>

<style>
  .runner {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 50rem;
    margin: 0 auto;
  }

  .runner-head {
    display: grid;
    gap: 0.6rem;
  }
  .runner-title {
    margin: 0 0 0.1rem;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
  }
  .runner-head p {
    margin: 0;
  }

  .tally {
    display: flex;
    gap: 0.4rem;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 650;
  }
  .tally span {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.6rem 0.2rem 0.45rem;
    border-radius: 999px;
  }
  .t-ok {
    background: var(--success-soft);
    color: var(--success);
  }
  .t-no {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .question-sheet {
    padding: clamp(1.1rem, 0.7rem + 1.6vw, 2rem);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
  }

  .runner-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  @media (hover: none) {
    .key-help {
      display: none;
    }
  }

  .empty {
    display: grid;
    justify-items: start;
    gap: 0.5rem;
  }
  .empty h2,
  .empty p {
    margin: 0;
  }

  .results {
    display: grid;
    gap: 1rem;
  }

  .result-sheet {
    display: grid;
    gap: 0.4rem;
    justify-items: start;
  }
  .result-sheet p {
    margin: 0;
  }
  .score-big {
    display: inline-grid;
    place-items: center;
    min-width: 5.5rem;
    height: 5.5rem;
    padding: 0 0.5rem;
    border-radius: 50%;
    background: var(--danger-soft);
    box-shadow: inset 0 0 0 2px var(--danger);
    color: var(--danger);
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.04em;
  }
  .score-big.good {
    background: var(--success-soft);
    box-shadow: inset 0 0 0 2px var(--success);
    color: var(--success);
  }
  .score-big.mid {
    background: var(--warn-soft);
    box-shadow: inset 0 0 0 2px var(--warn);
    color: var(--warn);
  }
  .result-title {
    margin: 0.6rem 0 0;
    font-size: var(--step-2);
  }
  .result-sheet .row {
    margin-top: 0.75rem;
  }

  .h-sm {
    font-size: 1.1875rem;
    margin-bottom: 0.85rem;
  }

  .topic-misses {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .topic-misses li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin: 0;
  }
  .topic-misses li span:first-child {
    font-weight: 600;
    min-width: 12rem;
  }

  .review-list {
    display: grid;
    gap: 0.75rem;
  }
</style>
