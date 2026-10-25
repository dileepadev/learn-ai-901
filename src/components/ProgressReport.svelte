<script lang="ts">
  /** The full progress report: readiness, retention, milestones, history and your data. */
  import { computeOverall, computeReadiness, daysUntilExam, pointsText, sessionPct, type ScoredModule } from '../lib/scoring';
  import { MASTERED_BOX } from '../lib/srs';
  import { exportJSON, importJSON, resetAll } from '../lib/store';
  import { clearAttempt } from '../lib/examSession';
  import { decodeQuestionRefs } from '../lib/catalog';
  import { liveProgress } from '../lib/live.svelte';
  import ReadinessRing from './ReadinessRing.svelte';
  import TopicBars from './TopicBars.svelte';
  import Icon from './Icon.svelte';

  interface Props {
    base: string;
    refs: string;
    modules: ScoredModule[];
  }

  let { base, refs, modules }: Props = $props();

  const questions = $derived(decodeQuestionRefs(refs));
  const live = liveProgress();
  const p = $derived(live.value);

  const readiness = $derived(computeReadiness(p, questions, modules));
  const overall = $derived(computeOverall(p, questions, modules));
  const daysLeft = $derived(daysUntilExam(p));
  const recentSessions = $derived([...p.sessions].reverse().slice(0, 15));

  /** Milestones are worked out from progress, never stored, so they cannot drift. */
  const milestones = $derived([
    { label: 'First lesson complete', got: overall.modulesComplete >= 1 },
    { label: 'Half the lessons complete', got: overall.modulesComplete >= Math.ceil(modules.length / 2) },
    { label: 'Every lesson complete', got: overall.modulesComplete >= modules.length },
    { label: '50 answers given', got: overall.questionsAnswered >= 50 },
    { label: '150 answers given', got: overall.questionsAnswered >= 150 },
    { label: 'Every question tried once', got: overall.distinctAnswered >= overall.bankSize },
    { label: '70% accuracy overall', got: (overall.accuracy ?? 0) >= 0.7 },
    { label: '85% accuracy overall', got: (overall.accuracy ?? 0) >= 0.85 },
    { label: 'First practice exam', got: overall.examsTaken >= 1 },
    { label: '80% or more on a practice exam', got: (overall.bestExamScore ?? 0) >= 80 },
    { label: 'Nothing left to fix', got: overall.distinctAnswered > 20 && overall.mistakeIds.length === 0 },
    { label: 'Three-day streak', got: overall.bestStreak >= 3 },
  ]);
  const unlocked = $derived(milestones.filter((m) => m.got).length);

  const BOX_LABELS = ['Just missed', 'Shaky', 'Getting there', 'Probably solid', 'Solid', 'Mastered'];
  const boxes = $derived.by(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    for (const q of questions) {
      const s = p.questions[q.id];
      if (s?.seen) counts[Math.min(5, s.box)]! += 1;
    }
    return counts;
  });
  const maxBox = $derived(Math.max(...boxes, 1));

  /* ---- your data ---- */

  let resetDialog = $state<HTMLDialogElement | null>(null);
  let message = $state('');

  function download() {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learn-ai-901-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    message = 'Backup downloaded.';
  }

  function handleImport(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      message = importJSON(String(reader.result))
        ? 'Progress restored from your backup.'
        : 'That file is not a Learn AI-901 backup, so nothing was changed.';
    };
    reader.readAsText(file);
    input.value = '';
  }

  function doReset() {
    resetAll();
    clearAttempt();
    resetDialog?.close();
    message = 'All progress deleted. You are starting fresh.';
  }

  function when(ts: number): string {
    return new Date(ts).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const MODE_LABEL: Record<string, string> = {
    'module-quiz': 'Lesson quiz',
    practice: 'Practice set',
    'weak-areas': 'Topic practice',
    mistakes: 'Questions I got wrong',
    'rapid-fire': 'Rapid fire',
    exam: 'Practice exam',
    'mini-exam': 'Mini exam',
  };
</script>

<div class="report">
  <section class="head sheet pv" class:ready={live.ready}>
    <ReadinessRing value={readiness.overall} label={readiness.label} size={148} />
    <div>
      <p>
        Readiness blends what you have <strong>covered</strong> ({readiness.fromCoverage}% of the lessons,
        weighted by topic) with what you have <strong>proven</strong> ({readiness.fromAccuracy}% weighted
        accuracy). Accuracy from only a few answers is discounted, so a handful of lucky guesses does not read
        as mastery.
      </p>
      {#if daysLeft !== null && daysLeft >= 0}
        <p class="small subtle num">
          {daysLeft === 0 ? 'Your exam is today.' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} until your exam.`}
        </p>
      {/if}
    </div>
  </section>

  <dl class="stats sheet pv" class:ready={live.ready}>
    <div><dt>Answers given</dt><dd class="num">{overall.questionsAnswered}</dd></div>
    <div><dt>Questions tried</dt><dd class="num">{overall.distinctAnswered} of {overall.bankSize}</dd></div>
    <div>
      <dt>Accuracy</dt>
      <dd class="num">{overall.accuracy === null ? 'None yet' : `${Math.round(overall.accuracy * 100)}%`}</dd>
    </div>
    <div><dt>Mastered</dt><dd class="num">{overall.mastered}</dd></div>
    <div><dt>Study days</dt><dd class="num">{overall.studyDays}</dd></div>
    <div><dt>Best streak</dt><dd class="num">{overall.bestStreak} {overall.bestStreak === 1 ? 'day' : 'days'}</dd></div>
  </dl>

  <section class="sheet" aria-labelledby="topic-title">
    <h2 id="topic-title" class="h-sm">By exam topic</h2>
    <TopicBars stats={readiness.byTopic} {base} />
  </section>

  <section class="sheet" aria-labelledby="ret-title">
    <h2 id="ret-title" class="h-sm">Where your answered questions sit in the review schedule</h2>
    <ol class="boxes">
      {#each boxes as count, i (i)}
        <li>
          <span class="box-bar" aria-hidden="true">
            <span style:height={`${(count / maxBox) * 100}%`} class:mastered={i >= MASTERED_BOX}></span>
          </span>
          <strong class="num">{count}</strong>
          <span class="small subtle">{BOX_LABELS[i]}</span>
        </li>
      {/each}
    </ol>
    <p class="small subtle">
      A correct answer moves a question up a box and pushes its next review further out. A miss drops it two
      boxes, so anything shaky comes back within minutes. Intervals top out at four days, tuned for a short
      sprint rather than months of study.
    </p>
  </section>

  <section class="sheet" aria-labelledby="ms-title">
    <h2 id="ms-title" class="h-sm num">Milestones: {unlocked} of {milestones.length}</h2>
    <ul class="milestones">
      {#each milestones as m (m.label)}
        <li class:got={m.got}>
          <span class="bubble" aria-hidden="true">{#if m.got}<Icon name="check" size={14} />{/if}</span>
          {m.label}
          {#if m.got}<span class="visually-hidden">(reached)</span>{/if}
        </li>
      {/each}
    </ul>
  </section>

  {#if recentSessions.length}
    <section class="sheet" aria-labelledby="hist-title">
      <h2 id="hist-title" class="h-sm">Recent sessions</h2>
      <!-- A scrollable table must be reachable by keyboard (WCAG 2.1.1). -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div class="table-scroll" role="region" tabindex="0" aria-labelledby="hist-title">
        <table class="data">
          <thead>
            <tr><th scope="col">When</th><th scope="col">Session</th><th scope="col">Score</th></tr>
          </thead>
          <tbody>
            {#each recentSessions as s (s.id)}
              {@const pct = sessionPct(s)}
              <tr>
                <td class="nowrap num">{when(s.finishedAt)}</td>
                <td>{MODE_LABEL[s.mode] ?? s.mode}</td>
                <td class="nowrap num">
                  {s.points ? pointsText(s.points) : `${s.correct} of ${s.total}`}
                  <span class="chip" class:chip-success={pct >= 75} class:chip-danger={pct < 50} class:chip-warn={pct >= 50 && pct < 75}
                    >{pct}%</span
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/if}

  <section class="sheet data" aria-labelledby="data-title">
    <h2 id="data-title" class="h-sm">Your data</h2>
    <p>
      Everything is kept in this browser. Nothing is sent anywhere and there is no account, so clearing your
      browser data clears your progress too. Download a backup before you switch devices.
    </p>
    <div class="row">
      <button type="button" class="btn" onclick={download}><Icon name="download" /> Download a backup</button>
      <label class="btn import">
        <Icon name="upload" /> Restore from a backup
        <input type="file" accept="application/json,.json" onchange={handleImport} />
      </label>
      <button type="button" class="btn btn-danger" onclick={() => resetDialog?.showModal()}>
        <Icon name="trash" /> Delete all progress
      </button>
    </div>
    <p class="small message" role="status">{message}</p>
  </section>

  <dialog bind:this={resetDialog} class="confirm" aria-labelledby="reset-title">
    <h2 id="reset-title">Delete all progress?</h2>
    <p class="muted">
      This removes every answer, lesson, session and setting stored in this browser, including an exam in
      progress. It cannot be undone, so download a backup first if you might want it.
    </p>
    <div class="row">
      <button type="button" class="btn btn-danger" onclick={doReset}>Delete everything</button>
      <button type="button" class="btn" onclick={() => resetDialog?.close()}>Keep my progress</button>
    </div>
  </dialog>
</div>

<style>
  .report {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }
  .h-sm {
    font-size: 1.1875rem;
    margin-bottom: 1.1rem;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .head > div {
    flex: 1;
    min-width: 16rem;
  }
  .head p {
    max-width: var(--measure);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  /* Hairlines between cells however the grid wraps; the card clips the outer ones. */
  .stats > div {
    padding: 1.05rem 1.25rem 1.15rem;
    box-shadow:
      1px 0 0 var(--border),
      0 1px 0 var(--border);
  }
  .stats dt {
    color: var(--ink-3);
    font-size: 0.85rem;
    font-weight: 550;
  }
  .stats dd {
    margin: 0.25rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.035em;
  }

  .boxes {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.75rem;
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;
  }
  .boxes li {
    display: grid;
    justify-items: center;
    gap: 0.25rem;
    margin: 0;
    text-align: center;
  }
  .box-bar {
    display: flex;
    align-items: flex-end;
    width: 100%;
    max-width: 3.5rem;
    height: 6rem;
    padding: 3px;
    border-radius: var(--radius);
    background: var(--surface-2);
  }
  .box-bar span {
    width: 100%;
    min-height: 3px;
    border-radius: 6px;
    background: var(--accent);
    opacity: 0.75;
  }
  .box-bar span.mastered {
    background: var(--success);
    opacity: 1;
  }

  .milestones {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 0.5rem 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .milestones li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin: 0;
    color: var(--ink-3);
  }
  .milestones li.got {
    color: var(--ink);
    font-weight: 550;
  }
  .bubble {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 1.4rem;
    height: 1.4rem;
    border: 1px dashed var(--border-strong);
    border-radius: 50%;
  }
  .got .bubble {
    border: 0;
    background: var(--success);
    color: var(--surface);
  }

  .data p {
    max-width: var(--measure);
  }
  .import {
    position: relative;
    overflow: hidden;
  }
  .import input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .import:focus-within {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .message {
    min-height: 1.4em;
    margin: 0.75rem 0 0;
    color: var(--success);
    font-weight: 600;
  }

  dialog.confirm {
    width: min(30rem, calc(100vw - 2rem));
    padding: 1.5rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow-lg);
  }
  dialog.confirm::backdrop {
    background: rgb(11 13 19 / 0.4);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  dialog.confirm h2 {
    font-size: 1.25rem;
  }

  @media (max-width: 560px) {
    .boxes {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
