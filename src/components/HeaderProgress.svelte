<script lang="ts">
  /**
   * Readiness chip in the site header. It persists across page navigations,
   * and works from build-time refs rather than the question bank itself.
   */
  import { decodeQuestionRefs } from '../lib/catalog';
  import { computeReadiness, type ScoredModule } from '../lib/scoring';
  import { liveProgress } from '../lib/live.svelte';

  interface Props {
    base: string;
    /** Encoded question refs (see lib/catalog). */
    refs: string;
    modules: ScoredModule[];
  }

  let { base, refs, modules }: Props = $props();

  const questions = $derived(decodeQuestionRefs(refs));
  const live = liveProgress();
  const readiness = $derived(computeReadiness(live.value, questions, modules).overall);
  const href = $derived(`${base.replace(/\/$/, '')}/progress/`);

  let current = $state(false);
  $effect(() => {
    const check = () => {
      current = /\/progress\/?$/.test(window.location.pathname);
    };
    check();
    document.addEventListener('astro:page-load', check);
    return () => document.removeEventListener('astro:page-load', check);
  });
</script>

<a
  class="chip-link pv"
  class:ready={live.ready}
  {href}
  aria-current={current ? 'page' : undefined}
  title="Exam readiness. Open your progress report."
>
  <svg class="dial" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8" pathLength="100" class="track" />
    <circle
      cx="10"
      cy="10"
      r="8"
      pathLength="100"
      class="fill"
      stroke-dasharray={`${readiness} 100`}
    />
  </svg>
  <span class="value num">{readiness}%</span>
  <span class="label">ready</span>
  <span class="visually-hidden">for the exam</span>
</a>

<style>
  .chip-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 2.25rem;
    padding: 0 0.8rem 0 0.45rem;
    border-radius: 999px;
    background: var(--surface-2);
    box-shadow: inset 0 0 0 1px var(--border);
    color: var(--ink);
    font-size: 0.875rem;
    font-weight: 650;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s ease;
  }
  .chip-link:hover {
    background: var(--hover);
    color: var(--ink);
  }
  .chip-link[aria-current='page'] {
    box-shadow: inset 0 0 0 1px var(--accent-edge);
    background: var(--accent-soft);
  }
  .label {
    margin-left: -0.15rem;
    color: var(--ink-3);
    font-weight: 500;
  }

  .dial {
    width: 22px;
    height: 22px;
    rotate: -90deg;
  }
  .dial circle {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
  }
  .track {
    stroke: var(--track);
  }
  .fill {
    stroke: var(--accent);
    transition: stroke-dasharray 0.6s var(--ease);
  }
  /* Zero length still draws a round cap; hide it until there is progress. */
  .fill[stroke-dasharray^='0 '] {
    stroke: transparent;
  }

  @media (max-width: 420px) {
    .label {
      display: none;
    }
  }
</style>
