<script lang="ts">
  /**
   * Lesson progress, in two places on the page:
   * - `rail`: the section list beside the lesson. It also does the tracking -
   *   a section counts as read once its last line has scrolled into view.
   * - `footer`: the end-of-lesson panel with the quiz and "mark complete".
   */
  import { markModuleComplete, markModuleStarted, markSectionSeen, setLastVisited } from '../../lib/store';
  import { liveProgress } from '../../lib/live.svelte';
  import Icon from '../Icon.svelte';

  interface Props {
    variant: 'rail' | 'footer';
    moduleId: string;
    title: string;
    path: string;
    sections: { id: string; title: string }[];
    quizHref: string;
    quizCount: number;
  }

  let { variant, moduleId, title, path, sections, quizHref, quizCount }: Props = $props();

  const live = liveProgress();
  const record = $derived(live.value.modules[moduleId]);
  const seen = $derived(new Set(record?.sectionsSeen ?? []));
  const readCount = $derived(sections.filter((s) => seen.has(s.id)).length);
  const completed = $derived(Boolean(record?.completedAt));
  const allRead = $derived(readCount === sections.length);

  let current = $state<string | null>(null);

  $effect(() => {
    if (variant !== 'rail') return;
    markModuleStarted(moduleId);
    setLastVisited(path, title);

    if (typeof IntersectionObserver === 'undefined') return;

    // Read: the end marker of a section has been on screen.
    const ends = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.sectionEnd;
          if (id) markSectionSeen(moduleId, id);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    // Current: whichever section crosses a band near the top of the viewport.
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) current = (entry.target as HTMLElement).dataset.section ?? null;
        }
      },
      { rootMargin: '-20% 0px -75% 0px' },
    );

    document.querySelectorAll<HTMLElement>('[data-section-end]').forEach((el) => ends.observe(el));
    document.querySelectorAll<HTMLElement>('[data-section]').forEach((el) => spy.observe(el));
    return () => {
      ends.disconnect();
      spy.disconnect();
    };
  });
</script>

{#if variant === 'rail'}
  <nav class="rail" aria-label="Sections in this lesson">
    <p class="rail-title">In this lesson</p>
    <ol class="toc">
      {#each sections as section, i (section.id)}
        <li>
          <a
            href={`#${section.id}`}
            class:seen={seen.has(section.id)}
            aria-current={current === section.id ? 'location' : undefined}
          >
            <span class="bubble num" aria-hidden="true">
              {#if seen.has(section.id)}<Icon name="check" size={13} />{:else}{i + 1}{/if}
            </span>
            <span class="toc-text">{section.title}</span>
            {#if seen.has(section.id)}<span class="visually-hidden">(read)</span>{/if}
          </a>
        </li>
      {/each}
    </ol>

    <div class="read pv" class:ready={live.ready}>
      <div class="bar bar-success" aria-hidden="true">
        <span style:width={`${(readCount / Math.max(1, sections.length)) * 100}%`}></span>
      </div>
      <p class="small subtle num">{readCount} of {sections.length} <span class="wide-only">sections</span> read</p>
    </div>

    <div class="rail-actions">
      <a class="btn btn-sm" href={quizHref}>Lesson quiz, {quizCount} questions</a>
      {#if completed}
        <p class="done pv" class:ready={live.ready}><Icon name="check-circle" size={18} /> Lesson complete</p>
      {/if}
    </div>
  </nav>
{:else}
  <section class="finish sheet" aria-labelledby="finish-title">
    {#if completed}
      <h2 id="finish-title" class="finish-title done-title">
        <Icon name="check-circle" size={24} /> Lesson complete
      </h2>
      <p class="muted">
        It counts towards your readiness. The quiz is still the best way to check it has stuck.
      </p>
      <div class="row">
        <a class="btn btn-primary" href={quizHref}>Take the {quizCount}-question quiz</a>
        <button type="button" class="btn btn-ghost" onclick={() => markModuleComplete(moduleId, false)}>
          Mark as not complete
        </button>
      </div>
    {:else}
      <h2 id="finish-title" class="finish-title">End of the lesson</h2>
      <p class="muted">
        {#if allRead}
          You have read every section. Take the quiz to lock it in: scoring 70% or more marks the lesson
          complete.
        {:else}
          Take the quiz to lock it in: scoring 70% or more marks the lesson complete. Or mark it
          complete yourself.
        {/if}
      </p>
      <div class="row">
        <a class="btn btn-primary" href={quizHref}>Take the {quizCount}-question quiz</a>
        <button type="button" class="btn" onclick={() => markModuleComplete(moduleId, true)}>
          Mark complete
        </button>
      </div>
    {/if}
  </section>
{/if}

<style>
  .rail {
    display: grid;
    gap: 1rem;
  }
  .rail-title {
    margin: 0;
    color: var(--ink-3);
    font-size: 0.85rem;
    font-weight: 600;
  }

  .toc {
    display: grid;
    gap: 0.1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .toc li {
    margin: 0;
  }
  .toc a {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.42rem 0.55rem;
    border-radius: var(--radius);
    color: var(--ink-2);
    font-size: 0.9rem;
    line-height: 1.4;
    text-decoration: none;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  .toc a:hover {
    background: var(--hover);
    color: var(--ink);
  }
  .toc a[aria-current='location'] {
    color: var(--accent);
    font-weight: 600;
    background: var(--accent-soft);
  }

  .bubble {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 1.3rem;
    height: 1.3rem;
    margin-top: 0.02rem;
    border: 1px solid var(--border-strong);
    border-radius: 6px;
    background: var(--surface);
    color: var(--ink-3);
    font-size: 0.7rem;
    font-weight: 650;
  }
  .toc a.seen .bubble {
    border-color: transparent;
    background: var(--success);
    color: var(--surface);
  }
  .toc a[aria-current='location'] .bubble {
    border-color: var(--accent-edge);
    color: var(--accent);
  }
  .toc a.seen[aria-current='location'] .bubble {
    border-color: transparent;
    color: var(--surface);
  }

  .read p {
    margin: 0.4rem 0 0;
  }

  .rail-actions {
    display: grid;
    gap: 0.6rem;
    justify-items: start;
  }

  .done {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0;
    color: var(--success);
    font-weight: 600;
  }

  .finish {
    display: grid;
    gap: 0.5rem;
  }
  .finish p {
    margin: 0;
  }
  .finish .row {
    margin-top: 0.5rem;
  }
  .finish-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
  }
  .done-title {
    color: var(--success);
  }

  /* Phones: the rail collapses to a row of numbered section tiles. */
  @media (max-width: 960px) {
    .rail {
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 0.75rem;
    }
    .rail-title,
    .rail-actions {
      display: none;
    }
    .toc-text {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    .toc {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    .toc a {
      padding: 0.3rem;
    }
    .toc a[aria-current='location'] {
      background: transparent;
    }
    .toc a[aria-current='location'] .bubble {
      box-shadow: 0 0 0 2px var(--accent-soft);
    }
    .bubble {
      width: 1.75rem;
      height: 1.75rem;
      font-size: 0.8rem;
    }
    .toc a {
      padding: 0.2rem;
    }
    .read p {
      margin: 0;
      white-space: nowrap;
    }
    .read .bar,
    .wide-only {
      display: none;
    }
  }
</style>
