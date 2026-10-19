<script lang="ts">
  /** Readiness per exam topic, heaviest topics first. */
  import type { TopicStats } from '../lib/scoring';

  interface Props {
    stats: TopicStats[];
    base: string;
    /** Show the drill link on each row. */
    actionable?: boolean;
  }

  let { stats, base, actionable = true }: Props = $props();

  const link = (p: string) => `${base.replace(/\/$/, '')}${p}`;
  const sorted = $derived([...stats].sort((a, b) => b.weight - a.weight));

  function tone(score: number): string {
    if (score >= 0.75) return 'good';
    if (score >= 0.45) return 'mid';
    if (score > 0) return 'low';
    return 'none';
  }
</script>

<ul class="bars">
  {#each sorted as t (t.topic)}
    {@const pct = Math.round(t.score * 100)}
    <li class={tone(t.score)}>
      <div class="head">
        <span class="name">{t.label}</span>
        <span class="weight small subtle num" title="Estimated share of the exam">about {t.weight}% of the exam</span>
        <span class="score num">{pct}%</span>
      </div>
      <div class="bar" role="img" aria-label={`${t.label}: ${pct} percent ready`}>
        <span style:width={`${pct}%`}></span>
      </div>
      <div class="meta small subtle num">
        <span>{t.modulesComplete} of {t.moduleCount} lessons</span>
        <span>{t.attempted} of {t.bankSize} questions tried</span>
        {#if t.accuracy !== null}<span>{Math.round(t.accuracy * 100)}% correct</span>{/if}
        {#if actionable}
          <a class="drill" href={link(`/practice/weak/?topic=${t.topic}`)}>Drill {t.label}</a>
        {/if}
      </div>
    </li>
  {/each}
</ul>

<style>
  .bars {
    display: grid;
    gap: 1.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .bars li {
    margin: 0;
  }
  .head {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-bottom: 0.35rem;
  }
  .name {
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .score {
    margin-left: auto;
    font-weight: 650;
  }
  .bar > span {
    background: var(--ink-3);
  }
  .good .bar > span {
    background: var(--success);
  }
  .mid .bar > span {
    background: var(--warn);
  }
  .low .bar > span {
    background: var(--danger);
  }
  .none .bar > span {
    background: transparent;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem 1rem;
    margin-top: 0.35rem;
  }
  .drill {
    margin-left: auto;
    font-weight: 550;
    text-decoration: none;
  }
  .drill:hover {
    text-decoration: underline;
  }
</style>
