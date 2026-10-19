<script lang="ts">
  /** The lesson index, in recommended study order, with per-lesson progress. */
  import type { ModuleRef } from '../lib/catalog';
  import { DOMAINS, TOPIC_BY_ID, topicLabel } from '../data/exam';
  import { liveProgress } from '../lib/live.svelte';
  import Icon from './Icon.svelte';

  interface Props {
    base: string;
    modules: ModuleRef[];
  }

  let { base, modules }: Props = $props();

  const link = (p: string) => `${base.replace(/\/$/, '')}${p}`;
  const live = liveProgress();

  const rows = $derived(
    modules.map((m) => {
      const record = live.value.modules[m.id];
      const seen = record?.sectionsSeen.length ?? 0;
      const answered = (ids: string[]) => ids.filter((id) => live.value.questions[id]?.seen).length;
      return {
        module: m,
        domain: TOPIC_BY_ID[m.topic]?.domain ?? 'concepts',
        started: Boolean(record?.startedAt),
        completed: Boolean(record?.completedAt),
        readPct: m.sections ? Math.min(100, Math.round((seen / m.sections) * 100)) : 0,
        checksDone: answered(m.checks),
        quizDone: answered(m.quiz),
      };
    }),
  );

  const groups = $derived(
    DOMAINS.map((d) => ({ domain: d, rows: rows.filter((r) => r.domain === d.id) })).filter(
      (g) => g.rows.length > 0,
    ),
  );

  const completedCount = $derived(rows.filter((r) => r.completed).length);
  const minutesLeft = $derived(
    rows.filter((r) => !r.completed).reduce((sum, r) => sum + r.module.minutes, 0),
  );
  const nextUp = $derived(rows.find((r) => r.started && !r.completed) ?? rows.find((r) => !r.completed));

  function hours(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} minutes`;
    return m === 0 ? `${h} hour${h === 1 ? '' : 's'}` : `${h} h ${m} min`;
  }
</script>

<div class="overview pv" class:ready={live.ready}>
  {#if nextUp}
    <a class="next sheet" href={link(`/learn/${nextUp.module.id}/`)}>
      <span class="next-label small">
        {nextUp.started ? 'Continue where you left off' : completedCount ? 'Up next' : 'Start here'}
      </span>
      <span class="next-title">Lesson {nextUp.module.order}: {nextUp.module.title}</span>
      <span class="small muted">{nextUp.module.summary}</span>
    </a>
  {/if}
  <div class="tally sheet">
    <p class="tally-big num">{completedCount}<span> of {modules.length}</span></p>
    <p class="small muted">lessons complete</p>
    <p class="small subtle num">
      {minutesLeft > 0 ? `${hours(minutesLeft)} of reading left` : 'Every lesson read'}
    </p>
  </div>
</div>

{#each groups as group (group.domain.id)}
  <section class="group" aria-labelledby={`domain-${group.domain.id}`}>
    <h2 id={`domain-${group.domain.id}`} class="group-title">
      {group.domain.label}
      <span class="weight small subtle">{group.domain.weightLabel} of the exam</span>
    </h2>
    <ol class="modules">
      {#each group.rows as row (row.module.id)}
        <li>
          <a class="mod" href={link(`/learn/${row.module.id}/`)} class:done={row.completed}>
            <span class="bubble num pv" class:ready={live.ready} aria-hidden="true">
              {#if row.completed}<Icon name="check" size={18} />{:else}{row.module.order}{/if}
            </span>
            <span class="mod-body">
              <span class="mod-title">
                <span class="visually-hidden">Lesson {row.module.order}: </span>{row.module.title}
                {#if row.completed}<span class="visually-hidden">(complete)</span>{/if}
              </span>
              <span class="mod-summary">{row.module.summary}</span>
              <span class="mod-meta small">
                <span class="chip">{topicLabel(row.module.topic)}</span>
                <span class="subtle num"><Icon name="clock" size={14} /> {row.module.minutes} min</span>
                {#if row.module.priority === 'high'}<span class="chip chip-warn">High priority</span>{/if}
                <span class="subtle num pv" class:ready={live.ready}>
                  {row.checksDone} of {row.module.checks.length} checks, {row.quizDone} of {row.module.quiz.length} quiz
                </span>
              </span>
              {#if row.started && !row.completed}
                <span class="bar mod-bar" aria-hidden="true"><span style:width={`${row.readPct}%`}></span></span>
              {/if}
            </span>
          </a>
        </li>
      {/each}
    </ol>
  </section>
{/each}

<style>
  .overview {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .next {
    display: grid;
    gap: 0.3rem;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
  }
  .next:hover {
    border-color: var(--accent-edge);
  }
  .next-label {
    color: var(--accent);
    font-weight: 600;
  }
  .next-title {
    font-size: 1.25rem;
    font-weight: 650;
    letter-spacing: -0.02em;
  }

  .tally {
    display: grid;
    align-content: center;
    min-width: 12rem;
    border-radius: var(--radius-xl);
  }
  .tally p {
    margin: 0;
  }
  .tally-big {
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.1;
  }
  .tally-big span {
    margin-left: 0.3rem;
    color: var(--ink-3);
    font-size: 1rem;
    font-weight: 550;
    letter-spacing: 0;
  }

  .group + .group {
    margin-top: 3rem;
  }
  .group-title {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    font-size: 1.1875rem;
  }
  .weight {
    font-weight: 500;
    letter-spacing: 0;
  }

  .modules {
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .modules li {
    margin: 0;
  }
  .modules li + li {
    border-top: 1px solid var(--border);
  }

  .mod {
    display: flex;
    align-items: flex-start;
    gap: 1.1rem;
    padding: 1.15rem 1.35rem;
    color: inherit;
    text-decoration: none;
    transition: background 0.15s ease;
  }
  .mod:hover {
    background: var(--surface-2);
    color: inherit;
  }
  .mod:hover .mod-title {
    color: var(--accent);
  }

  .bubble {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    background: var(--surface-2);
    color: var(--ink-2);
    font-size: 0.9rem;
    font-weight: 650;
  }
  .mod.done .bubble {
    border-color: transparent;
    background: var(--success);
    color: var(--surface);
  }

  .mod-body {
    display: grid;
    gap: 0.3rem;
    min-width: 0;
    flex: 1;
  }
  .mod-title {
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.012em;
    line-height: 1.35;
    transition: color 0.15s ease;
  }
  .mod-summary {
    color: var(--ink-2);
    font-size: 0.95rem;
  }
  .mod-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem 0.8rem;
    margin-top: 0.2rem;
  }
  .mod-meta span:has(> :global(.icon)) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  .mod-bar {
    max-width: 16rem;
    margin-top: 0.4rem;
  }

  @media (max-width: 640px) {
    .overview {
      grid-template-columns: 1fr;
    }
    .mod {
      gap: 0.85rem;
      padding: 1rem;
    }
  }
</style>
