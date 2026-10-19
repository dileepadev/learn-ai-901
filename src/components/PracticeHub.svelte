<script lang="ts">
  /**
   * The practice hub: pick a set, or arrive with one already chosen - by route
   * (/practice/mistakes/, /practice/weak/) or by link (?start=quick, ?topic=...).
   *
   * The hub itself works from build-time refs. The question bank is fetched
   * only when a session actually starts.
   */
  import type { Question, SessionMode, TopicId } from '../data/types';
  import { TOPICS, topicLabel } from '../data/exam';
  import { get } from '../lib/store';
  import { computeOverall, computeReadiness, type ScoredModule } from '../lib/scoring';
  import { buildQueue, dueQuestions, unseenQuestions } from '../lib/queue';
  import { decodeQuestionRefs } from '../lib/catalog';
  import { liveProgress } from '../lib/live.svelte';
  import type { IconName } from '../lib/icons';
  import QuizRunner from './QuizRunner.svelte';
  import Icon from './Icon.svelte';

  interface Props {
    base: string;
    refs: string;
    modules: ScoredModule[];
    /** Fixed set for the dedicated routes. */
    fixedMode?: 'mistakes' | 'weak-areas';
  }

  let { base, refs, modules, fixedMode }: Props = $props();

  const link = (p: string) => `${base.replace(/\/$/, '')}${p}`;
  const questionRefs = $derived(decodeQuestionRefs(refs));
  const live = liveProgress();
  const p = $derived(live.value);

  type SetKind = 'quick' | 'long' | 'rapid' | 'due' | 'mistakes' | 'weak' | 'topic';

  interface SessionSpec {
    kind: SetKind;
    topics?: TopicId[];
  }

  interface Session {
    spec: SessionSpec;
    mode: SessionMode;
    title: string;
    questions: Question[];
  }

  let session = $state.raw<Session | null>(null);
  let loading = $state(false);
  let failed = $state(false);

  const SIZES: Record<SetKind, number> = {
    quick: 10,
    long: 25,
    rapid: 20,
    due: 20,
    mistakes: 40,
    weak: 12,
    topic: 12,
  };

  async function start(spec: SessionSpec) {
    loading = true;
    failed = false;
    try {
      const { ALL_QUESTIONS } = await import('../data/questions');
      // Build from a snapshot: answering must not reshuffle the set mid-session.
      const snapshot = get();
      const size = SIZES[spec.kind];
      let mode: SessionMode = 'practice';
      let pool = ALL_QUESTIONS;
      let title = '';
      switch (spec.kind) {
        case 'quick':
          title = 'Quick set';
          break;
        case 'long':
          title = 'Long set';
          break;
        case 'rapid':
          mode = 'rapid-fire';
          title = 'Rapid fire';
          break;
        case 'due':
          pool = dueQuestions(ALL_QUESTIONS, snapshot);
          title = 'Due for review';
          break;
        case 'mistakes':
          mode = 'mistakes';
          title = 'Questions you got wrong';
          break;
        case 'weak':
        case 'topic': {
          mode = 'weak-areas';
          const topics = spec.topics ?? [];
          const labels = topics.map(topicLabel);
          const listed =
            labels.length > 1 ? `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}` : labels[0];
          title =
            spec.kind === 'weak'
              ? topics.length === 1
                ? `Weak area: ${listed}`
                : 'Your weakest topics'
              : `${topics.length === 1 ? 'Topic' : 'Topics'}: ${listed}`;
          break;
        }
      }
      const questions = buildQueue(pool, snapshot, { mode, size, topics: spec.topics });
      session = { spec, mode, title, questions };
      window.scrollTo({ top: 0 });
    } catch {
      failed = true;
    } finally {
      loading = false;
    }
  }

  function weakestTopics(): TopicId[] {
    const readiness = computeReadiness(get(), questionRefs, modules);
    return readiness.weakest.slice(0, 2).map((t) => t.topic);
  }

  const isTopic = (t: string | null): t is TopicId => TOPICS.some((topic) => topic.id === t);

  // Arriving with a set already chosen. Runs once, after mount: it reads the
  // URL, and the session must not restart every time an answer is saved.
  let routed = false;
  $effect(() => {
    if (!live.ready || routed) return;
    routed = true;
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic');
    const topicList = (params.get('topics') ?? '').split(',').filter(isTopic);
    const startParam = params.get('start');
    if (fixedMode === 'mistakes') {
      void start({ kind: 'mistakes' });
    } else if (fixedMode === 'weak-areas') {
      void start({ kind: 'weak', topics: isTopic(topic) ? [topic] : weakestTopics() });
    } else if (isTopic(topic)) {
      void start({ kind: 'topic', topics: [topic] });
    } else if (topicList.length) {
      void start({ kind: 'topic', topics: topicList });
    } else if (startParam === 'quick' || startParam === 'long' || startParam === 'rapid' || startParam === 'due') {
      void start({ kind: startParam });
    }
  });

  const overall = $derived(computeOverall(p, questionRefs, modules));
  const readiness = $derived(computeReadiness(p, questionRefs, modules));
  const due = $derived(dueQuestions(questionRefs, p).length);
  const unseen = $derived(unseenQuestions(questionRefs, p).length);
  const weakest = $derived(readiness.weakest.filter((t) => t.attempted > 0).slice(0, 2));
  const topicsByWeight = $derived([...readiness.byTopic].sort((a, b) => b.weight - a.weight));

  interface SetCard {
    kind: SetKind;
    icon: IconName;
    title: string;
    body: string;
    disabled?: boolean;
  }

  const sets = $derived<SetCard[]>([
    {
      kind: 'quick',
      icon: 'practice',
      title: 'Quick set, 10 questions',
      body: 'Mixed topics, weighted towards what you have not seen and what is due. About 6 minutes.',
    },
    {
      kind: 'long',
      icon: 'list',
      title: 'Long set, 25 questions',
      body: 'A proper session, every answer marked as you go. About 15 minutes.',
    },
    {
      kind: 'rapid',
      icon: 'cram',
      title: 'Rapid fire, 20 questions',
      body: 'Short recall questions, mostly easier ones. Good for a spare ten minutes.',
    },
    {
      kind: 'due',
      icon: 'clock',
      title: due ? `Due for review, ${Math.min(due, SIZES.due)} questions` : 'Due for review',
      body: due
        ? 'Questions scheduled to come back right about now, before you forget them.'
        : 'Nothing is due yet. Answered questions come back here on a schedule.',
      disabled: due === 0,
    },
  ]);
</script>

{#if session}
  <QuizRunner
    questions={session.questions}
    mode={session.mode}
    title={session.title}
    scope={session.spec.topics?.join(',')}
    {base}
    doneHref={link('/practice/')}
    doneLabel="Back to practice"
    emptyMessage={session.spec.kind === 'mistakes'
      ? 'Nothing is waiting to be fixed: every question you have answered is currently on a correct answer.'
      : session.spec.kind === 'due'
        ? 'Nothing is due for review right now. Answered questions come back here on a schedule.'
        : undefined}
    onrestart={() => session && start(session.spec)}
  />
{:else if loading || (fixedMode && !failed)}
  <div class="sheet preparing" role="status">
    <span class="spinner" aria-hidden="true"></span>
    Preparing your questions
  </div>
{:else}
  <div class="hub">
    <header class="page-head">
      <h1>Practice</h1>
      <p>
        Every answer is marked straight away. Anything you get wrong comes back within minutes,
        anything you keep getting right comes back later, and questions you have never seen come first.
      </p>
    </header>
    {#if failed}
      <p class="callout callout-trap" role="alert">
        The questions did not load. Check your connection, then try again.
      </p>
    {/if}

    <dl class="stats sheet pv" class:ready={live.ready}>
      <div><dt>Never tried</dt><dd class="num">{unseen}</dd></div>
      <div><dt>Due for review</dt><dd class="num">{due}</dd></div>
      <div><dt>Waiting to be fixed</dt><dd class="num">{overall.mistakeIds.length}</dd></div>
      <div><dt>Mastered</dt><dd class="num">{overall.mastered}</dd></div>
    </dl>

    <section aria-labelledby="sets-title">
      <h2 id="sets-title" class="h-sm">Choose a set</h2>
      <div class="sets">
        {#each sets as set (set.kind)}
          <button
            type="button"
            class="sheet set"
            disabled={set.disabled}
            onclick={() => start({ kind: set.kind })}
          >
            <Icon name={set.icon} size={22} />
            <span class="set-body">
              <strong>{set.title}</strong>
              <span class="small muted">{set.body}</span>
            </span>
          </button>
        {/each}
        <a class="sheet set" href={link('/practice/mistakes/')} aria-disabled={overall.mistakeIds.length === 0}>
          <Icon name="retry" size={22} />
          <span class="set-body">
            <strong>Questions I got wrong</strong>
            <span class="small muted">
              {overall.mistakeIds.length
                ? `${overall.mistakeIds.length} waiting. The cheapest marks you can get.`
                : 'Nothing waiting right now.'}
            </span>
          </span>
        </a>
        <a class="sheet set" href={link('/practice/weak/')}>
          <Icon name="target" size={22} />
          <span class="set-body">
            <strong>My weakest topics</strong>
            <span class="small muted">
              {weakest.length
                ? `Right now: ${weakest.map((w) => w.label).join(' and ')}.`
                : 'Answer a few questions first, so your weak spots show up.'}
            </span>
          </span>
        </a>
        <a class="sheet set" href={link('/exam/')}>
          <Icon name="exam" size={22} />
          <span class="set-body">
            <strong>Timed practice exam</strong>
            <span class="small muted">Nothing marked until the end, then a report by topic. The honest test.</span>
          </span>
        </a>
      </div>
    </section>

    <section aria-labelledby="topics-title">
      <h2 id="topics-title" class="h-sm">Or practise one topic</h2>
      <ul class="topics">
        {#each topicsByWeight as t (t.topic)}
          <li>
            <button type="button" class="topic" onclick={() => start({ kind: 'topic', topics: [t.topic] })}>
              <span class="topic-name">{t.label}</span>
              <span class="small subtle num">
                about {t.weight}% of the exam
                <span class="pv" class:ready={live.ready}
                  >, {t.attempted} of {t.bankSize} tried{t.accuracy !== null
                    ? `, ${Math.round(t.accuracy * 100)}% correct`
                    : ''}</span
                >
              </span>
              <span
                class="bar"
                class:bar-success={t.score >= 0.75}
                class:bar-danger={t.score < 0.45 && t.attempted > 0}
                aria-hidden="true"
              >
                <span style:width={`${Math.round(t.score * 100)}%`}></span>
              </span>
            </button>
          </li>
        {/each}
      </ul>
    </section>
  </div>
{/if}

{#if session && fixedMode}
  <p class="back"><a class="small" href={link('/practice/')}>All practice sets</a></p>
{/if}

<style>
  .hub {
    display: grid;
    gap: 2.75rem;
  }
  .hub .page-head {
    margin-bottom: -1rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 0;
    padding: 0;
  }
  .stats > div {
    padding: 1.15rem 1.35rem 1.25rem;
  }
  .stats > div + div {
    border-left: 1px solid var(--border);
  }
  .stats dt {
    color: var(--ink-3);
    font-size: 0.85rem;
    font-weight: 550;
  }
  .stats dd {
    margin: 0.3rem 0 0;
    font-size: 1.875rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.1;
  }

  .h-sm {
    font-size: 1.1875rem;
    margin-bottom: 1rem;
  }

  .sets {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
    gap: 0.85rem;
  }
  .set {
    display: flex;
    align-items: flex-start;
    gap: 0.95rem;
    color: inherit;
  }
  .set:hover {
    border-color: var(--accent-edge);
  }
  .set > :global(.icon) {
    flex-shrink: 0;
    box-sizing: content-box;
    padding: 0.5rem;
    border-radius: var(--radius);
    background: var(--accent-soft);
    color: var(--accent);
  }
  .set-body {
    display: grid;
    gap: 0.25rem;
    padding-top: 0.15rem;
  }
  .set-body strong {
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .set:disabled,
  .set[aria-disabled='true'] {
    opacity: 0.55;
    cursor: default;
    border-color: var(--border);
    box-shadow: none;
  }
  .set:disabled > :global(.icon),
  .set[aria-disabled='true'] > :global(.icon) {
    background: var(--surface-2);
    color: var(--ink-3);
  }
  .set[aria-disabled='true'] {
    pointer-events: none;
  }

  .topics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
    gap: 0.85rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .topics li {
    margin: 0;
  }
  .topic {
    display: grid;
    gap: 0.3rem;
    width: 100%;
    min-height: 100%;
    padding: 1rem 1.15rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    text-align: left;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }
  .topic:hover {
    border-color: var(--accent-edge);
    box-shadow: var(--shadow-md);
  }
  .topic-name {
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .topic .bar {
    margin-top: 0.45rem;
  }

  .preparing {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 50rem;
    margin: 0 auto;
    color: var(--ink-2);
    font-weight: 550;
  }
  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2.5px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      rotate: 360deg;
    }
  }

  .back {
    max-width: 50rem;
    margin: 1.5rem auto 0;
  }

  @media (max-width: 640px) {
    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .stats > div:nth-child(3) {
      border-left: 0;
    }
    .stats > div:nth-child(n + 3) {
      border-top: 1px solid var(--border);
    }
  }
</style>
