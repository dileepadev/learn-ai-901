<script lang="ts">
  /**
   * The three-day sprint plan. Lesson steps tick themselves off when their
   * lessons are complete, exam steps when you have sat that paper; anything
   * else you tick yourself.
   */
  import { SPRINT_PLAN, type PlanStep } from '../data/roadmap';
  import type { ModuleRef } from '../lib/catalog';
  import { setPlanStepDone } from '../lib/store';
  import { daysUntilExam } from '../lib/scoring';
  import { liveProgress } from '../lib/live.svelte';
  import type { IconName } from '../lib/icons';
  import Icon from './Icon.svelte';

  interface Props {
    base: string;
    modules: ModuleRef[];
  }

  let { base, modules }: Props = $props();

  const link = (p: string) => `${base.replace(/\/$/, '')}${p}`;
  const live = liveProgress();
  const p = $derived(live.value);
  const byId = $derived(new Map(modules.map((m) => [m.id, m])));

  const ICON: Record<PlanStep['kind'], IconName> = {
    learn: 'learn',
    practice: 'practice',
    exam: 'exam',
    review: 'review',
    cram: 'cram',
  };

  /** Done by evidence: the lessons are complete, or that paper has been sat. */
  function autoDone(step: PlanStep): boolean {
    if (step.kind === 'learn' && step.moduleIds?.length) {
      return step.moduleIds.every((id) => Boolean(p.modules[id]?.completedAt));
    }
    if (step.kind === 'exam') {
      const mode = step.exam === 'mini' ? 'mini-exam' : 'exam';
      return p.sessions.some((s) => s.mode === mode);
    }
    return false;
  }

  function isDone(step: PlanStep): boolean {
    return autoDone(step) || p.planDone.includes(step.id);
  }

  function minutesOf(step: PlanStep): number {
    if (step.kind === 'learn' && step.moduleIds) {
      return step.moduleIds.reduce((sum, id) => sum + (byId.get(id)?.minutes ?? 0), 0);
    }
    return step.minutes ?? 0;
  }

  function hrefOf(step: PlanStep): string {
    switch (step.kind) {
      case 'learn': {
        const next = step.moduleIds?.find((id) => !p.modules[id]?.completedAt) ?? step.moduleIds?.[0];
        return link(`/learn/${next ?? ''}/`);
      }
      case 'practice':
        if (step.practice === 'weak') return link('/practice/weak/');
        if (step.practice === 'mistakes') return link('/practice/mistakes/');
        return step.topics?.length ? link(`/practice/?topics=${step.topics.join(',')}`) : link('/practice/');
      case 'exam':
        return link(step.exam === 'mini' ? '/exam/?preset=mini' : '/exam/');
      case 'review':
        return link('/review/');
      case 'cram':
        return link('/cram/');
    }
  }

  function hours(minutes: number): string {
    const h = minutes / 60;
    return h >= 1 ? `about ${Math.round(h * 10) / 10} hours` : `${minutes} minutes`;
  }

  const days = $derived(
    SPRINT_PLAN.map((day) => ({
      day,
      done: day.steps.filter(isDone).length,
      minutes: day.steps.reduce((sum, s) => sum + minutesOf(s), 0),
    })),
  );
  const currentDay = $derived(days.find((d) => d.done < d.day.steps.length)?.day.id);
  const daysLeft = $derived(daysUntilExam(p));
</script>

{#if live.ready && daysLeft !== null && daysLeft >= 0 && daysLeft <= 1}
  <a class="sheet urgent" href={link('/cram/')}>
    <strong>{daysLeft === 0 ? 'It is exam day.' : 'Your exam is tomorrow.'} Switch to the cram sheet.</strong>
    <span class="small muted">No new material this close in. Consolidate, and clear the questions you got wrong.</span>
  </a>
{:else if live.ready && daysLeft !== null && daysLeft > 1 && daysLeft < 3}
  <p class="callout callout-changed">
    You have fewer days left than this plan assumes. Skim lessons on topics you already know, and keep the
    full practice exam: it tells you where the remaining time should go.
  </p>
{/if}

<div class="days">
  {#each days as { day, done, minutes } (day.id)}
    {@const complete = done === day.steps.length}
    <section
      class="day sheet"
      class:current={live.ready && day.id === currentDay}
      aria-labelledby={`${day.id}-title`}
    >
      <header class="day-head">
        <div>
          <h2 id={`${day.id}-title`}>{day.title}</h2>
          <p class="muted">{day.goal}</p>
        </div>
        <p class="day-meta small num">
          <span class="pv" class:ready={live.ready} class:complete>{done} of {day.steps.length} done</span>
          <span class="subtle">{hours(minutes)}</span>
        </p>
      </header>

      <ol class="steps">
        {#each day.steps as step (step.id)}
          {@const done = isDone(step)}
          {@const auto = autoDone(step)}
          <li class="step" class:done>
            <label class="tick" title={auto ? 'Done: worked out from your progress' : 'Tick when done'}>
              <input
                type="checkbox"
                checked={done}
                disabled={auto}
                onchange={(e) => setPlanStepDone(step.id, e.currentTarget.checked)}
              />
              <span class="visually-hidden">{step.label} done</span>
              <span class="box" aria-hidden="true"><Icon name="check" size={16} /></span>
            </label>
            <a class="step-link" href={hrefOf(step)}>
              <span class="step-title">
                <Icon name={ICON[step.kind]} size={18} />
                {step.label}
              </span>
              <span class="small muted">{step.why}</span>
              {#if step.moduleIds}
                <span class="mods small">
                  {#each step.moduleIds as id (id)}
                    {@const m = byId.get(id)}
                    {#if m}
                      <span class="chip" class:chip-success={live.ready && Boolean(p.modules[id]?.completedAt)}>
                        Lesson {m.order}: {m.title}
                      </span>
                    {/if}
                  {/each}
                </span>
              {/if}
            </a>
            <span class="chip step-time num">{minutesOf(step)} min</span>
          </li>
        {/each}
      </ol>
    </section>
  {/each}
</div>

<style>
  .urgent {
    display: grid;
    gap: 0.2rem;
    margin-bottom: 1.25rem;
    border-color: var(--warn-edge);
    background: var(--warn-soft);
    color: inherit;
  }
  .callout {
    margin-bottom: 1.25rem;
  }

  .days {
    display: grid;
    gap: 1rem;
  }

  .day {
    border-radius: var(--radius-xl);
  }
  .day.current {
    border-color: var(--accent-edge);
    box-shadow:
      0 0 0 1px var(--accent-edge),
      var(--shadow-md);
  }

  .day-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .day-head h2 {
    margin-bottom: 0.25rem;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
  }
  .day-head p {
    margin: 0;
  }
  .day-meta {
    display: grid;
    justify-items: end;
    gap: 0.1rem;
    font-weight: 600;
  }
  .day-meta .complete {
    color: var(--success);
  }

  .steps {
    display: grid;
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--border);
  }
  .step {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
    gap: 0.85rem;
    margin: 0;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--border);
  }
  .step:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .tick {
    position: relative;
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
  .tick input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }
  .tick input:disabled {
    cursor: default;
  }
  .box {
    display: grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    border: 1.5px solid var(--border-strong);
    border-radius: 7px;
    background: var(--surface);
    color: transparent;
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }
  .tick:hover .box {
    border-color: var(--accent);
  }
  .tick input:checked + .visually-hidden + .box {
    border-color: transparent;
    background: var(--success);
    color: var(--surface);
  }
  .tick input:focus-visible + .visually-hidden + .box {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .step-link {
    display: grid;
    gap: 0.2rem;
    color: inherit;
    text-decoration: none;
  }
  .step-link:hover .step-title {
    color: var(--accent);
  }
  .step-title {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    transition: color 0.15s ease;
  }
  .step-title :global(.icon) {
    color: var(--ink-3);
  }
  .step.done .step-title {
    color: var(--ink-3);
    text-decoration: line-through;
    text-decoration-color: var(--ink-3);
    text-decoration-thickness: 1px;
  }
  .mods {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.25rem;
  }
  .step-time {
    margin-top: 0.25rem;
  }

  @media (max-width: 560px) {
    .step {
      grid-template-columns: auto minmax(0, 1fr);
    }
    .step-time {
      grid-column: 2;
      justify-self: start;
      margin-top: 0;
    }
  }
</style>
