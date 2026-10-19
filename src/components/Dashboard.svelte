<script lang="ts">
  /**
   * The returning visitor's home page. It answers one question above all:
   * "I have this much time right now - what should I do?"
   *
   * New visitors never see this island: the page shows them a static
   * introduction instead (see pages/index.astro).
   */
  import { setExamDate } from '../lib/store';
  import { computeOverall, computeReadiness, daysUntilExam } from '../lib/scoring';
  import { recommend, TIME_BUDGETS, type ActionKind } from '../lib/recommend';
  import { decodeQuestionRefs, type ModuleRef } from '../lib/catalog';
  import { liveProgress } from '../lib/live.svelte';
  import { answeredCount, loadAttempt, secondsLeft, type ExamAttempt } from '../lib/examSession';
  import type { IconName } from '../lib/icons';
  import ReadinessRing from './ReadinessRing.svelte';
  import TopicBars from './TopicBars.svelte';
  import Icon from './Icon.svelte';

  interface Props {
    base: string;
    refs: string;
    modules: ModuleRef[];
    resourceCount: number;
  }

  let { base, refs, modules, resourceCount }: Props = $props();

  const link = (p: string) => `${base.replace(/\/$/, '')}${p}`;
  const questions = $derived(decodeQuestionRefs(refs));
  const live = liveProgress();
  const p = $derived(live.value);

  let budget = $state(30);
  let attempt = $state<ExamAttempt | null>(null);

  $effect(() => {
    try {
      const stored = Number(localStorage.getItem('ai901:budget'));
      if (TIME_BUDGETS.some((t) => t.minutes === stored)) budget = stored;
    } catch {
      /* keep the default */
    }
    attempt = loadAttempt();
  });

  function setBudget(minutes: number) {
    budget = minutes;
    try {
      localStorage.setItem('ai901:budget', String(minutes));
    } catch {
      /* the choice still applies to this visit */
    }
  }

  const readiness = $derived(computeReadiness(p, questions, modules));
  const overall = $derived(computeOverall(p, questions, modules));
  const daysLeft = $derived(daysUntilExam(p));
  const recs = $derived(recommend({ progress: p, modules, questions, budget, base }));
  const primary = $derived(recs[0]);
  const rest = $derived(recs.slice(1));
  const accuracyPct = $derived(overall.accuracy === null ? null : Math.round(overall.accuracy * 100));

  const resume = $derived.by(() => {
    const last = p.lastVisited;
    if (!last) return null;
    const ageDays = (Date.now() - last.at) / 86_400_000;
    return ageDays <= 21 ? last : null;
  });

  const examLeft = $derived(attempt ? secondsLeft(attempt) : null);

  const ICON: Record<ActionKind, IconName> = {
    learn: 'learn',
    practice: 'practice',
    weak: 'target',
    mistakes: 'retry',
    exam: 'exam',
    review: 'clock',
    cram: 'cram',
    flashcards: 'review',
  };

  function minutesText(m: number): string {
    return m >= 60 ? `${Math.round((m / 60) * 10) / 10} h` : `${m} min`;
  }

  function countdown(days: number): string {
    if (days === 0) return 'Your exam is today';
    if (days === 1) return 'Your exam is tomorrow';
    return `${days} days until your exam`;
  }
</script>

{#if !live.ready}
  <div class="loading" aria-hidden="true">
    <div class="skeleton" style="height: 2.5rem; width: 18rem"></div>
    <div class="skeleton" style="height: 12rem"></div>
  </div>
{:else}
  <div class="dash">
    <div class="main">
      <header class="hello">
        <h1>What to do next</h1>
        <p class="muted">
          {#if daysLeft !== null && daysLeft >= 0}
            {countdown(daysLeft)}.
          {/if}
          Pick how long you have, and the most useful thing for that time comes first.
        </p>
      </header>

      {#if attempt}
        <a class="resume sheet exam-resume" href={link('/exam/')}>
          <Icon name="exam" size={22} />
          <span>
            <strong>Resume your practice exam</strong>
            <span class="small muted num">
              {answeredCount(attempt)} of {attempt.ids.length} answered{examLeft !== null
                ? `, ${Math.ceil(examLeft / 60)} minutes left on the clock`
                : ''}
            </span>
          </span>
        </a>
      {:else if resume}
        <a class="resume sheet" href={resume.path}>
          <Icon name="learn" size={22} />
          <span>
            <strong>Continue: {resume.label}</strong>
            <span class="small muted">Pick up the lesson where you left it</span>
          </span>
        </a>
      {/if}

      <div class="budget">
        <span id="budget-label" class="small muted">I have</span>
        <div class="segmented" role="group" aria-labelledby="budget-label">
          {#each TIME_BUDGETS as t (t.minutes)}
            <button type="button" aria-pressed={budget === t.minutes} onclick={() => setBudget(t.minutes)}>
              {t.label}
            </button>
          {/each}
        </div>
      </div>

      {#if primary}
        <a class="primary sheet" href={primary.href}>
          <span class="primary-icon" aria-hidden="true"><Icon name={ICON[primary.kind]} size={24} /></span>
          <span class="primary-body">
            <span class="primary-title">{primary.title}</span>
            <span class="muted">{primary.why}</span>
            <span class="primary-meta small">
              <span class="chip chip-accent num">{minutesText(primary.minutes)}</span>
              <span class="cta">{primary.cta}</span>
            </span>
          </span>
        </a>
      {/if}

      {#if rest.length}
        <h2 class="h-sm">Or, with the same time</h2>
        <ul class="recs">
          {#each rest as r (r.href + r.title)}
            <li>
              <a class="rec" href={r.href}>
                <Icon name={ICON[r.kind]} />
                <span class="rec-body">
                  <span class="rec-title">{r.title}</span>
                  <span class="small muted">{r.why}</span>
                </span>
                <span class="chip num">{minutesText(r.minutes)}</span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}

      <section class="topics" aria-labelledby="topics-title">
        <div class="spread">
          <h2 id="topics-title" class="h-sm">Readiness by exam topic</h2>
          <a class="small" href={link('/progress/')}>Full progress report</a>
        </div>
        <div class="sheet">
          <TopicBars stats={readiness.byTopic} {base} />
        </div>
      </section>
    </div>

    <aside class="side">
      <div class="sheet ready-card">
        <ReadinessRing value={readiness.overall} label={readiness.label} />
        <p class="small muted">
          Readiness blends lessons finished with questions answered correctly, weighted by the exam
          blueprint. The tick marks 80%, where this app calls you exam ready.
        </p>
      </div>

      <dl class="stats sheet">
        <div>
          <dt>Lessons complete</dt>
          <dd class="num">{overall.modulesComplete} of {overall.moduleCount}</dd>
        </div>
        <div>
          <dt>Questions tried</dt>
          <dd class="num">{overall.distinctAnswered} of {overall.bankSize}</dd>
        </div>
        <div>
          <dt>Accuracy</dt>
          <dd class="num">{accuracyPct === null ? 'None yet' : `${accuracyPct}%`}</dd>
        </div>
        <div>
          <dt>Waiting to be fixed</dt>
          <dd class="num">
            {#if overall.mistakeIds.length}
              <a href={link('/practice/mistakes/')}>{overall.mistakeIds.length} questions</a>
            {:else}
              None
            {/if}
          </dd>
        </div>
        <div>
          <dt>Study streak</dt>
          <dd class="num">{overall.streak} {overall.streak === 1 ? 'day' : 'days'}</dd>
        </div>
        <div>
          <dt>Best practice exam</dt>
          <dd class="num">{overall.bestExamScore === null ? 'Not taken' : `${overall.bestExamScore}%`}</dd>
        </div>
      </dl>

      <div class="sheet exam-date">
        <label class="field">
          <span>Exam date</span>
          <input
            class="input"
            type="date"
            value={p.examDate ?? ''}
            onchange={(e) => setExamDate(e.currentTarget.value || undefined)}
          />
        </label>
        <p class="small subtle">
          {#if p.examDate}
            On the last day the dashboard switches you to the cram sheet.
          {:else}
            Set it to get a countdown and a last-day switch to the cram sheet.
          {/if}
        </p>
      </div>

      <a class="sheet side-link" href={link('/resources/')}>
        <Icon name="resources" />
        <span>
          <strong>Official resources</strong>
          <span class="small muted num">{resourceCount} links to Microsoft Learn, the exam sandbox and the labs</span>
        </span>
      </a>
    </aside>
  </div>
{/if}

<style>
  .loading {
    display: grid;
    gap: 1rem;
  }

  .dash {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 20rem;
    gap: clamp(1.5rem, 1rem + 2vw, 3rem);
    align-items: start;
  }

  .main {
    display: grid;
    gap: 1.25rem;
    min-width: 0;
  }

  .hello h1 {
    margin-bottom: 0.4rem;
  }
  .hello p {
    margin: 0;
  }

  .resume {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    color: inherit;
  }
  .resume > span {
    display: grid;
  }
  .resume :global(.icon) {
    color: var(--accent);
    flex-shrink: 0;
  }
  .exam-resume {
    border-color: var(--warn-edge);
    background: var(--warn-soft);
  }
  .exam-resume :global(.icon) {
    color: var(--warn);
  }

  .budget {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .primary {
    display: flex;
    gap: 1.1rem;
    padding: clamp(1.25rem, 1rem + 1vw, 1.75rem);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
  }
  .primary:hover {
    border-color: var(--accent-edge);
  }
  .primary-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-lg);
    background: var(--accent);
    color: var(--on-accent);
    box-shadow: var(--shadow-accent);
  }
  .primary-body {
    display: grid;
    gap: 0.35rem;
  }
  .primary-title {
    font-size: 1.25rem;
    font-weight: 650;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }
  .primary-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.6rem;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    min-height: 2.25rem;
    padding: 0 1rem;
    border-radius: var(--radius);
    background: var(--accent);
    box-shadow: var(--shadow-accent);
    color: var(--on-accent);
    font-weight: 600;
    transition: background 0.15s ease;
  }
  .primary:hover .cta {
    background: var(--accent-hover);
  }

  .h-sm {
    margin: 1rem 0 0;
    font-size: 1.0625rem;
    letter-spacing: -0.012em;
  }

  .recs {
    display: grid;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .recs li {
    margin: 0;
  }
  .recs li + li {
    border-top: 1px solid var(--border);
  }
  .rec {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding: 0.9rem 1rem;
    color: inherit;
    text-decoration: none;
  }
  .rec:hover {
    background: var(--surface-2);
    color: inherit;
  }
  .rec:hover .rec-title {
    color: var(--accent);
  }
  .rec > :global(.icon) {
    flex-shrink: 0;
    box-sizing: content-box;
    padding: 0.4rem;
    margin-top: -0.2rem;
    border-radius: var(--radius);
    background: var(--surface-2);
    color: var(--ink-2);
  }
  .rec-body {
    display: grid;
    gap: 0.15rem;
    flex: 1;
  }
  .rec-title {
    font-weight: 600;
  }

  .topics {
    display: grid;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
  .topics .h-sm {
    margin: 0;
  }

  .side {
    display: grid;
    gap: 1rem;
  }

  .ready-card {
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    text-align: center;
  }
  .ready-card p {
    margin: 0;
  }

  .stats {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0.4rem 1rem;
  }
  .stats div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.65rem 0;
    font-size: 0.94rem;
  }
  .stats div + div {
    border-top: 1px solid var(--border);
  }
  .stats dt {
    color: var(--ink-2);
  }
  .stats dd {
    margin: 0;
    font-weight: 650;
    text-align: right;
  }

  .exam-date {
    display: grid;
    gap: 0.5rem;
  }
  .exam-date p {
    margin: 0;
  }

  .side-link {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }
  .side-link > span {
    display: grid;
  }
  .side-link :global(.icon) {
    flex-shrink: 0;
    box-sizing: content-box;
    padding: 0.45rem;
    border-radius: var(--radius);
    background: var(--accent-soft);
    color: var(--accent);
  }

  @media (max-width: 960px) {
    .dash {
      grid-template-columns: minmax(0, 1fr);
    }
    .side {
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    }
  }
</style>
