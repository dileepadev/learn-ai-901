<script lang="ts">
  /** The personal part of the cram sheet: days to go, and misses still open. */
  import { decodeQuestionRefs } from '../lib/catalog';
  import { computeOverall, daysUntilExam, type ScoredModule } from '../lib/scoring';
  import { liveProgress } from '../lib/live.svelte';

  interface Props {
    base: string;
    refs: string;
    modules: ScoredModule[];
  }

  let { base, refs, modules }: Props = $props();

  const link = (p: string) => `${base.replace(/\/$/, '')}${p}`;
  const questions = $derived(decodeQuestionRefs(refs));
  const live = liveProgress();
  const overall = $derived(computeOverall(live.value, questions, modules));
  const daysLeft = $derived(daysUntilExam(live.value));
</script>

{#if live.ready && (daysLeft !== null || overall.mistakeIds.length)}
  <div class="status no-print rise-in">
    {#if daysLeft !== null && daysLeft >= 0}
      <p class="days">
        <strong class="num">{daysLeft === 0 ? 'Exam day' : daysLeft === 1 ? 'Exam tomorrow' : `${daysLeft} days to go`}</strong>
      </p>
    {/if}
    {#if overall.mistakeIds.length}
      <a class="misses" href={link('/practice/mistakes/')}>
        Clear the {overall.mistakeIds.length} questions you got wrong first. It is the best use of the next
        ten minutes.
      </a>
    {/if}
  </div>
{/if}

<style>
  .status {
    display: flex;
    align-items: center;
    gap: 0.75rem 1.5rem;
    flex-wrap: wrap;
    padding: 0.9rem 1.1rem;
    border: 1px solid var(--warn-edge);
    border-radius: var(--radius-lg);
    background: var(--warn-soft);
  }
  .days {
    margin: 0;
    color: var(--warn);
    font-size: 1.05rem;
    font-weight: 600;
  }
  .misses {
    font-weight: 600;
  }
</style>
