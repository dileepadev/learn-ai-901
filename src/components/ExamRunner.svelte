<script lang="ts">
  /**
   * The practice exam. Deliberately unlike practice mode: timed against a
   * wall-clock deadline, nothing marked until the end, free movement between
   * questions with "mark for review", and a topic-by-topic report afterwards.
   *
   * The attempt is saved after every change, so a reload or a closed tab can
   * be resumed - with the clock still running, as it would be in the real exam.
   */
  import { tick } from 'svelte';
  import type { Answer, Question, TopicId } from '../data/types';
  import { EXAM, TOPICS, topicLabel } from '../data/exam';
  import { get, grade, recordAnswer, saveSession } from '../lib/store';
  import { buildQueue } from '../lib/queue';
  import {
    answeredCount as countAnswered,
    clearAttempt,
    isComplete,
    loadAttempt,
    saveAttempt,
    secondsLeft,
    type ExamAttempt,
    type ExamPreset,
  } from '../lib/examSession';
  import QuestionCard from './QuestionCard.svelte';
  import Icon from './Icon.svelte';

  interface Props {
    base: string;
    /** Exam-style questions in the bank, for the setup screen. */
    available: number;
  }

  let { base, available }: Props = $props();

  const link = (p: string) => `${base.replace(/\/$/, '')}${p}`;

  const PRESETS: Record<Exclude<ExamPreset, 'custom'>, { size: number; minutes: number; label: string }> = {
    full: { size: 45, minutes: 45, label: 'Full exam' },
    mini: { size: 15, minutes: 15, label: 'Mini exam' },
  };

  type Phase = 'setup' | 'loading' | 'running' | 'results';

  let phase = $state<Phase>('setup');
  let preset = $state<ExamPreset>('full');
  let size = $state(45);
  let minutes = $state(45);
  let timed = $state(true);
  let saved = $state<ExamAttempt | null>(null);
  let loadError = $state(false);

  let attempt = $state<ExamAttempt | null>(null);
  let questions = $state.raw<Question[]>([]);
  let now = $state(Date.now());
  let announce = $state('');

  let dialog = $state<HTMLDialogElement | null>(null);

  interface TopicResult {
    topic: TopicId;
    label: string;
    weight: number;
    total: number;
    correct: number;
  }

  let results = $state.raw<{
    correct: number;
    total: number;
    unanswered: number;
    pct: number;
    byTopic: TopicResult[];
    missed: Question[];
    elapsed: number;
    expired: boolean;
    answers: Record<string, Answer>;
    seed: number;
  } | null>(null);

  // After mount: honour ?preset=mini, and offer to resume a saved attempt.
  $effect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('preset') === 'mini') choosePreset('mini');
    saved = loadAttempt();
  });

  function choosePreset(next: ExamPreset) {
    preset = next;
    if (next !== 'custom') {
      size = PRESETS[next].size;
      minutes = PRESETS[next].minutes;
      timed = true;
    }
  }

  async function bank(): Promise<Question[]> {
    const { ALL_QUESTIONS } = await import('../data/questions');
    return ALL_QUESTIONS;
  }

  async function begin() {
    phase = 'loading';
    loadError = false;
    try {
      const all = await bank();
      const mode = preset === 'mini' ? 'mini-exam' : 'exam';
      const paper = buildQueue(all, get(), { mode, size: Math.min(size, available) });
      const startedAt = Date.now();
      const next: ExamAttempt = {
        v: 1,
        preset,
        ids: paper.map((q) => q.id),
        seed: Math.floor(Math.random() * 1e9),
        answers: {},
        flagged: [],
        index: 0,
        startedAt,
        deadline: timed ? startedAt + minutes * 60_000 : null,
        limitSeconds: timed ? minutes * 60 : null,
      };
      questions = paper;
      attempt = next;
      saveAttempt(next);
      phase = 'running';
      window.scrollTo({ top: 0 });
    } catch {
      loadError = true;
      phase = 'setup';
    }
  }

  async function resume() {
    if (!saved) return;
    phase = 'loading';
    try {
      const all = await bank();
      const byId = new Map(all.map((q) => [q.id, q]));
      const paper = saved.ids.map((id) => byId.get(id)).filter((q): q is Question => Boolean(q));
      if (paper.length === 0) throw new Error('empty');
      questions = paper;
      attempt = { ...saved, ids: paper.map((q) => q.id), index: Math.min(saved.index, paper.length - 1) };
      saved = null;
      if (secondsLeft(attempt) === 0) {
        submit(true);
      } else {
        phase = 'running';
      }
    } catch {
      clearAttempt();
      saved = null;
      loadError = true;
      phase = 'setup';
    }
  }

  function discard() {
    clearAttempt();
    saved = null;
  }

  /* ---------------- running ---------------- */

  const current = $derived(attempt ? questions[attempt.index] : undefined);
  const answered = $derived(attempt ? countAnswered(attempt) : 0);
  const remaining = $derived(attempt?.deadline ? Math.max(0, Math.round((attempt.deadline - now) / 1000)) : null);
  const lowTime = $derived(remaining !== null && remaining <= 300);
  const unansweredNumbers = $derived(
    attempt ? attempt.ids.map((id, i) => (isComplete(attempt!.answers[id]) ? null : i)).filter((i): i is number => i !== null) : [],
  );
  const flaggedNumbers = $derived(
    attempt ? attempt.ids.map((id, i) => (attempt!.flagged.includes(id) ? i : null)).filter((i): i is number => i !== null) : [],
  );

  const deadline = $derived(attempt?.deadline ?? null);

  // The clock. It reads the deadline each second, so a sleeping tab cannot cheat it.
  $effect(() => {
    if (phase !== 'running' || deadline === null) return;
    const end = deadline;
    const warned = new Set<number>();
    const timer = setInterval(() => {
      now = Date.now();
      const left = Math.round((end - now) / 1000);
      for (const mark of [300, 60]) {
        if (left <= mark && left > 0 && !warned.has(mark)) {
          warned.add(mark);
          announce = mark === 300 ? 'Five minutes left.' : 'One minute left.';
        }
      }
      if (left <= 0) submit(true);
    }, 1000);
    return () => clearInterval(timer);
  });

  function update(patch: Partial<ExamAttempt>) {
    if (!attempt) return;
    attempt = { ...attempt, ...patch };
    saveAttempt(attempt);
  }

  function setAnswer(answer: Answer) {
    if (!attempt || !current) return;
    update({ answers: { ...attempt.answers, [current.id]: answer } });
  }

  function toggleFlag() {
    if (!attempt || !current) return;
    const id = current.id;
    update({
      flagged: attempt.flagged.includes(id) ? attempt.flagged.filter((x) => x !== id) : [...attempt.flagged, id],
    });
  }

  async function go(i: number) {
    if (!attempt) return;
    dialog?.close();
    update({ index: Math.max(0, Math.min(questions.length - 1, i)) });
    await tick();
    document.getElementById('exam-question')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openReview() {
    dialog?.showModal();
  }

  /* ---------------- marking ---------------- */

  function submit(expired = false) {
    if (!attempt) return;
    dialog?.close();
    const final = attempt;
    let correct = 0;
    let unanswered = 0;
    const missed: Question[] = [];
    const tally: Partial<Record<TopicId, { total: number; correct: number }>> = {};

    for (const q of questions) {
      const answer = final.answers[q.id];
      const complete = isComplete(answer);
      if (!complete) unanswered += 1;
      const isCorrect = complete && answer ? grade(q, answer) : false;
      const entry = (tally[q.topic] ??= { total: 0, correct: 0 });
      entry.total += 1;
      if (isCorrect) {
        correct += 1;
        entry.correct += 1;
      } else {
        missed.push(q);
      }
      // Answered questions feed spaced repetition. A blank says nothing about what you know.
      if (complete) recordAnswer(q.id, isCorrect);
    }

    const total = questions.length;
    const finishedAt = Date.now();
    saveSession({
      mode: final.preset === 'mini' ? 'mini-exam' : 'exam',
      startedAt: final.startedAt,
      finishedAt,
      total,
      correct,
      missed: missed.map((q) => q.id),
      limitSeconds: final.limitSeconds ?? undefined,
      byTopic: tally,
    });
    clearAttempt();

    results = {
      correct,
      total,
      unanswered,
      pct: total ? Math.round((correct / total) * 100) : 0,
      byTopic: TOPICS.filter((t) => tally[t.id]).map((t) => ({
        topic: t.id,
        label: t.label,
        weight: t.weight,
        total: tally[t.id]!.total,
        correct: tally[t.id]!.correct,
      })),
      missed,
      elapsed: Math.round(((final.deadline ? Math.min(finishedAt, final.deadline) : finishedAt) - final.startedAt) / 1000),
      expired,
      answers: final.answers,
      seed: final.seed,
    };
    attempt = null;
    phase = 'results';
    window.scrollTo({ top: 0 });
  }

  function clock(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function duration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m ? `${m} min ${s} s` : `${s} s`;
  }

  const sortedTopics = $derived(
    results ? [...results.byTopic].sort((a, b) => a.correct / a.total - b.correct / b.total) : [],
  );
</script>

<p class="visually-hidden" aria-live="assertive">{announce}</p>

{#if phase === 'setup' || phase === 'loading'}
  <section class="setup">
    <header class="page-head">
      <h1>Practice exam</h1>
      <p>
        Exam-style questions only, drawn across the topics in proportion to the exam blueprint. Nothing
        is marked until you finish, just like the real thing.
      </p>
    </header>

    {#if saved}
      <div class="sheet resume" role="region" aria-labelledby="resume-title">
        <h2 id="resume-title" class="h-sm">You have an exam in progress</h2>
        <p class="muted num">
          {countAnswered(saved)} of {saved.ids.length} answered.
          {#if saved.deadline !== null}
            {secondsLeft(saved) === 0
              ? 'Time ran out while you were away, so resuming marks what you answered.'
              : `${Math.ceil((secondsLeft(saved) ?? 0) / 60)} minutes left on the clock.`}
          {:else}
            Untimed.
          {/if}
        </p>
        <div class="row">
          <button type="button" class="btn btn-primary" onclick={resume} disabled={phase === 'loading'}>
            {saved.deadline !== null && secondsLeft(saved) === 0 ? 'See the result' : 'Resume the exam'}
          </button>
          <button type="button" class="btn btn-ghost" onclick={discard}>Discard it</button>
        </div>
      </div>
    {/if}

    {#if loadError}
      <p class="callout callout-trap" role="alert">The exam did not load. Check your connection, then try again.</p>
    {/if}

    <div class="sheet options">
      <div class="field">
        <span id="preset-label">Paper</span>
        <div class="segmented" role="group" aria-labelledby="preset-label">
          <button type="button" aria-pressed={preset === 'full'} onclick={() => choosePreset('full')}>Full exam</button>
          <button type="button" aria-pressed={preset === 'mini'} onclick={() => choosePreset('mini')}>Mini exam</button>
          <button type="button" aria-pressed={preset === 'custom'} onclick={() => choosePreset('custom')}>Custom</button>
        </div>
        <p class="small muted num preset-note">
          {#if preset === 'full'}
            45 questions in 45 minutes: the real exam's clock, at the size of a typical paper.
          {:else if preset === 'mini'}
            15 questions in 15 minutes. A quick check, or a warm-up on exam morning.
          {:else}
            {size} questions, {timed ? `${minutes} minutes` : 'untimed'}.
          {/if}
        </p>
      </div>

      {#if preset === 'custom'}
        <label class="slider">
          <span>Questions</span>
          <input type="range" min="10" max={Math.min(60, available)} step="5" bind:value={size} />
          <strong class="num">{size}</strong>
        </label>
        <label class="check">
          <input type="checkbox" bind:checked={timed} />
          <span>Timed. Recommended, so you practise under pressure.</span>
        </label>
        <label class="slider">
          <span>Time limit</span>
          <input type="range" min="5" max="90" step="5" bind:value={minutes} disabled={!timed} />
          <strong class="num">{timed ? `${minutes} min` : 'Off'}</strong>
        </label>
      {/if}

      <ul class="rules small muted">
        <li>Move freely between questions and mark any for review.</li>
        <li>Your answers are saved as you go. Leave and come back, and the clock will have kept running.</li>
        <li>Wrong answers cost nothing, so answer every question.</li>
      </ul>
    </div>

    <div class="row">
      <button type="button" class="btn btn-primary btn-lg" onclick={begin} disabled={phase === 'loading'}>
        {phase === 'loading' ? 'Preparing the paper' : saved ? 'Start a new exam' : 'Start the exam'}
      </button>
      <a class="btn btn-ghost" href={link('/practice/')}>Practise with marking instead</a>
    </div>

    <p class="small subtle disclaimer">
      These questions are written for this study guide against the current skills measured. They are
      not real exam questions, and no practice set can promise a result. Microsoft's free
      <a href={EXAM.practiceAssessmentUrl} target="_blank" rel="noopener noreferrer">practice assessment</a>
      and <a href={EXAM.sandboxUrl} target="_blank" rel="noopener noreferrer">exam sandbox</a> are worth trying too.
    </p>
  </section>
{:else if phase === 'running' && attempt && current}
  <section class="running" aria-label="Practice exam">
    <header class="exam-bar">
      <p class="num"><span class="subtle">Question</span> <strong>{attempt.index + 1} of {questions.length}</strong></p>
      <p class="num subtle">{answered} answered</p>
      {#if remaining !== null}
        <p class="timer num" class:low={lowTime} aria-label={`${Math.ceil(remaining / 60)} minutes left`}>
          <Icon name="clock" size={18} />
          {clock(remaining)}
        </p>
      {/if}
    </header>

    <div class="sheet exam-question" id="exam-question" tabindex="-1">
      {#key current.id}
        <QuestionCard
          question={current}
          examMode
          keys
          seed={attempt.seed}
          initial={attempt.answers[current.id] ?? null}
          onchange={(answer) => setAnswer(answer)}
        />
      {/key}
    </div>

    <footer class="exam-foot">
      <button type="button" class="btn" disabled={attempt.index === 0} onclick={() => go(attempt!.index - 1)}>
        Previous
      </button>
      <button type="button" class="btn btn-ghost" aria-pressed={attempt.flagged.includes(current.id)} onclick={toggleFlag}>
        <Icon name="flag" />
        {attempt.flagged.includes(current.id) ? 'Marked for review' : 'Mark for review'}
      </button>
      <span class="spacer"></span>
      {#if attempt.index < questions.length - 1}
        <button type="button" class="btn btn-primary" onclick={() => go(attempt!.index + 1)}>Next</button>
      {/if}
      <button type="button" class="btn" class:btn-primary={attempt.index === questions.length - 1} onclick={openReview}>
        Review and submit
      </button>
    </footer>

    <nav class="palette sheet" aria-label="All questions">
      <p class="small subtle">Jump to a question. Filled ones are answered, and an amber dot marks one for review.</p>
      <ol>
        {#each attempt.ids as id, i (id)}
          {@const done = isComplete(attempt.answers[id])}
          {@const flag = attempt.flagged.includes(id)}
          <li>
            <button
              type="button"
              class="pal num"
              class:done
              class:flag
              aria-current={i === attempt.index ? 'step' : undefined}
              aria-label={`Question ${i + 1}${done ? ', answered' : ', not answered'}${flag ? ', marked for review' : ''}`}
              onclick={() => go(i)}>{i + 1}</button
            >
          </li>
        {/each}
      </ol>
    </nav>

    <dialog bind:this={dialog} class="review" aria-labelledby="review-title">
      <h2 id="review-title">Ready to submit?</h2>
      <p class="num">
        You have answered <strong>{answered} of {questions.length}</strong>.
        {#if remaining !== null}You have {clock(remaining)} left.{/if}
      </p>
      {#if unansweredNumbers.length}
        <p class="small muted">Not answered yet. Blanks score nothing, so a guess is always better:</p>
        <ul class="jump">
          {#each unansweredNumbers as i (i)}
            <li><button type="button" class="pal num" onclick={() => go(i)}>{i + 1}</button></li>
          {/each}
        </ul>
      {/if}
      {#if flaggedNumbers.length}
        <p class="small muted">Marked for review:</p>
        <ul class="jump">
          {#each flaggedNumbers as i (i)}
            <li><button type="button" class="pal num flag" onclick={() => go(i)}>{i + 1}</button></li>
          {/each}
        </ul>
      {/if}
      <div class="row">
        <button type="button" class="btn btn-primary" onclick={() => submit(false)}>Submit and see my result</button>
        <button type="button" class="btn" onclick={() => dialog?.close()}>Keep going</button>
      </div>
    </dialog>
  </section>
{:else if phase === 'results' && results}
  <section class="results">
    <div class="sheet score-sheet">
      <p class="score num" aria-hidden="true">
        <span class="score-big" class:good={results.pct >= 80} class:mid={results.pct >= 60 && results.pct < 80}
          >{results.pct}%</span
        >
      </p>
      <div>
        <h1 class="num">{results.correct} of {results.total} correct</h1>
        <p class="muted num">
          {#if results.expired}Time ran out. {/if}Finished in {duration(results.elapsed)}{results.unanswered
            ? `, with ${results.unanswered} left blank`
            : ''}.
        </p>
        <p class="small subtle">
          Microsoft reports a scaled score from 1 to 1,000, and you need {EXAM.passingScore} to pass. A scaled
          score is not a percentage, so read this as a guide: this app treats 80% or more, on more than one
          attempt, as a sign you are ready.
        </p>
      </div>
    </div>

    <section class="sheet" aria-labelledby="topics-title">
      <h2 id="topics-title" class="h-sm">Topic by topic, weakest first</h2>
      <ul class="topic-report">
        {#each sortedTopics as t (t.topic)}
          {@const pct = Math.round((t.correct / t.total) * 100)}
          <li>
            <div class="tr-head">
              <span class="tr-name">{t.label}</span>
              <span class="small subtle">about {t.weight}% of the exam</span>
              <span class="tr-score num" class:weak={pct < 70}>{t.correct} of {t.total}, {pct}%</span>
            </div>
            <div class="bar" class:bar-success={pct >= 75} class:bar-danger={pct < 50} aria-hidden="true">
              <span style:width={`${pct}%`}></span>
            </div>
            {#if pct < 75}
              <a class="small" href={link(`/practice/weak/?topic=${t.topic}`)}>Drill {t.label}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </section>

    <section class="sheet next-steps" aria-labelledby="next-title">
      <h2 id="next-title" class="h-sm">What to do next</h2>
      <p>
        {#if results.pct >= 80}
          A strong paper. Keep your weakest topics warm with short drills, and use the cram sheet the day
          before.
        {:else}
          The topics at the top of the list are where the marks are. Drill the weakest, reread its lesson if
          you scored under 50%, then sit another paper.
        {/if}
      </p>
      <div class="row">
        {#if results.missed.length}
          <a class="btn btn-primary" href={link('/practice/mistakes/')}>Retry what you missed</a>
        {/if}
        <button type="button" class="btn" onclick={() => (phase = 'setup')}>Sit another paper</button>
        <a class="btn btn-ghost" href={link('/')}>Home</a>
      </div>
    </section>

    {#if results.missed.length}
      <section class="review-list" aria-labelledby="missed-title">
        <h2 id="missed-title" class="h-sm">Every question you missed, marked</h2>
        {#each results.missed as q (q.id)}
          <div class="sheet">
            <QuestionCard question={q} revealed seed={results.seed} initial={results.answers[q.id] ?? null} />
          </div>
        {/each}
      </section>
    {/if}
  </section>
{/if}

<style>
  .setup,
  .running,
  .results {
    display: grid;
    gap: 1rem;
    max-width: 52rem;
    margin: 0 auto;
  }

  .h-sm {
    margin: 0 0 0.7rem;
    font-size: 1.1875rem;
  }

  .resume {
    border-color: var(--warn-edge);
    background: var(--warn-soft);
  }
  .resume p {
    margin: 0 0 0.75rem;
  }

  .options {
    display: grid;
    gap: 1.1rem;
  }
  .slider {
    display: grid;
    grid-template-columns: 7rem minmax(0, 1fr) 4.5rem;
    align-items: center;
    gap: 0.75rem;
    font-weight: 550;
  }
  .slider strong {
    text-align: right;
  }
  .check {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .rules {
    margin: 0;
  }
  .preset-note {
    margin: 0.25rem 0 0;
  }

  .disclaimer {
    margin: 0.5rem 0 0;
  }

  /* ---- running ---- */

  .exam-bar {
    position: sticky;
    top: calc(var(--header-h) + 0.5rem);
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--surface) 86%, transparent);
    box-shadow: var(--shadow-sm);
    -webkit-backdrop-filter: saturate(1.6) blur(14px);
    backdrop-filter: saturate(1.6) blur(14px);
  }
  .exam-bar p {
    margin: 0;
  }
  .timer {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: auto !important;
    padding: 0.3rem 0.8rem 0.3rem 0.65rem;
    border-radius: var(--radius);
    background: var(--surface-2);
    box-shadow: inset 0 0 0 1px var(--border);
    font-weight: 650;
    font-size: 1rem;
    letter-spacing: -0.01em;
  }
  .timer.low {
    background: var(--danger-soft);
    box-shadow: inset 0 0 0 1px var(--danger-edge);
    color: var(--danger);
  }

  .exam-question {
    padding: clamp(1.1rem, 0.7rem + 1.6vw, 2rem);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
  }
  .exam-question:focus {
    outline: none;
  }

  .exam-foot {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .spacer {
    flex: 1;
  }

  .palette p {
    margin: 0 0 0.6rem;
  }
  .palette ol,
  .jump {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .palette li,
  .jump li {
    margin: 0;
  }
  .pal {
    position: relative;
    width: 2.4rem;
    height: 2.4rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    background: var(--surface);
    color: var(--ink-2);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      background 0.15s ease;
  }
  .pal:hover {
    border-color: var(--accent);
  }
  .pal.done {
    border-color: transparent;
    background: var(--accent);
    color: var(--on-accent);
  }
  .pal.flag::after {
    content: '';
    position: absolute;
    top: -3px;
    right: -3px;
    width: 0.7rem;
    height: 0.7rem;
    border: 2px solid var(--surface);
    border-radius: 50%;
    background: var(--warn);
  }
  .pal[aria-current='step'] {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  dialog.review {
    width: min(32rem, calc(100vw - 2rem));
    padding: 1.5rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow-lg);
  }
  dialog.review::backdrop {
    background: rgb(11 13 19 / 0.4);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  dialog.review h2 {
    font-size: 1.25rem;
  }
  dialog.review .jump {
    margin-bottom: 1rem;
  }
  dialog.review .row {
    margin-top: 1rem;
  }

  /* ---- results ---- */

  .score-sheet {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .score-sheet h1 {
    margin-bottom: 0.25rem;
    font-size: var(--step-2);
  }
  .score-sheet p {
    margin: 0 0 0.5rem;
  }
  .score {
    margin: 0;
  }
  .score-big {
    display: inline-grid;
    place-items: center;
    width: 6.5rem;
    height: 6.5rem;
    border-radius: 50%;
    background: var(--danger-soft);
    box-shadow: inset 0 0 0 2px var(--danger);
    color: var(--danger);
    font-size: 1.9rem;
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

  .topic-report {
    display: grid;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .topic-report li {
    display: grid;
    gap: 0.35rem;
    margin: 0;
  }
  .tr-head {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .tr-name {
    font-weight: 600;
  }
  .tr-score {
    margin-left: auto;
    font-weight: 650;
  }
  .tr-score.weak {
    color: var(--danger);
  }

  .next-steps p {
    margin-bottom: 0.9rem;
  }

  .review-list {
    display: grid;
    gap: 0.75rem;
  }

  @media (max-width: 560px) {
    .slider {
      grid-template-columns: 1fr auto;
    }
    .slider input {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }
</style>
