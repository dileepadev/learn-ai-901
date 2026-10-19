<script lang="ts">
  /** The official links, searchable and grouped by what you are trying to do. */
  import { OFFICIAL_RESOURCES, RESOURCE_CATEGORIES, type OfficialResource, type ResourceCategoryId } from '../data/resources';
  import { topicLabel } from '../data/exam';
  import Icon from './Icon.svelte';

  let category = $state<ResourceCategoryId | 'all'>('all');
  let search = $state('');

  function domainOf(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  function matches(item: OfficialResource, q: string): boolean {
    if (!q) return true;
    return [item.title, item.description, item.badge, ...item.tags, item.relatedTopicId ? topicLabel(item.relatedTopicId) : '']
      .join(' ')
      .toLowerCase()
      .includes(q);
  }

  const query = $derived(search.trim().toLowerCase());
  const filtered = $derived(
    OFFICIAL_RESOURCES.filter((r) => (category === 'all' || r.category === category) && matches(r, query)),
  );
  const groups = $derived(
    RESOURCE_CATEGORIES.map((c) => ({ category: c, items: filtered.filter((r) => r.category === c.id) })).filter(
      (g) => g.items.length > 0,
    ),
  );
  const featured = OFFICIAL_RESOURCES.filter((r) => r.featured);
  const browsing = $derived(!query && category === 'all');
  const countOf = (id: ResourceCategoryId) => OFFICIAL_RESOURCES.filter((r) => r.category === id).length;
</script>

{#snippet resource(item: OfficialResource)}
  <li class="res">
    <a href={item.url} target="_blank" rel="noopener noreferrer" class="res-link">
      <span class="res-title">{item.title}</span>
      <Icon name="external" size={15} label="(opens in a new tab)" />
    </a>
    <p class="res-desc">{item.description}</p>
    <p class="res-meta small">
      <span class="chip">{item.badge}</span>
      {#if item.relatedTopicId}<span class="chip chip-accent">{topicLabel(item.relatedTopicId)}</span>{/if}
      <span class="subtle">{domainOf(item.url)}</span>
    </p>
  </li>
{/snippet}

{#if browsing}
  <section class="featured" aria-labelledby="featured-title">
    <h2 id="featured-title" class="h-sm">Start with these</h2>
    <ul class="grid-list">
      {#each featured as item (item.id)}
        {@render resource(item)}
      {/each}
    </ul>
  </section>
{/if}

<div class="controls">
  <label class="search">
    <span class="visually-hidden">Search the resources</span>
    <Icon name="search" />
    <input class="input" type="search" placeholder="Search, for example Speech, sandbox or guardrails" bind:value={search} />
  </label>
  <div class="segmented" role="group" aria-label="Category">
    <button type="button" aria-pressed={category === 'all'} onclick={() => (category = 'all')}>
      All <span class="num subtle">{OFFICIAL_RESOURCES.length}</span>
    </button>
    {#each RESOURCE_CATEGORIES as c (c.id)}
      <button type="button" aria-pressed={category === c.id} onclick={() => (category = c.id)}>
        {c.title} <span class="num subtle">{countOf(c.id)}</span>
      </button>
    {/each}
  </div>
</div>

<p class="visually-hidden" aria-live="polite">{filtered.length} resources shown</p>

{#if filtered.length === 0}
  <div class="sheet empty">
    <p>Nothing matches "{search}". Try a service name such as Speech or Content Understanding.</p>
    <button type="button" class="btn btn-sm" onclick={() => { search = ''; category = 'all'; }}>Show everything</button>
  </div>
{:else}
  {#each groups as g (g.category.id)}
    <section class="group" aria-labelledby={`cat-${g.category.id}`}>
      <h2 id={`cat-${g.category.id}`} class="h-sm">{g.category.title}</h2>
      <p class="muted group-desc">{g.category.description}</p>
      <ul class="grid-list">
        {#each g.items as item (item.id)}
          {@render resource(item)}
        {/each}
      </ul>
    </section>
  {/each}
{/if}

<style>
  .h-sm {
    font-size: 1.1875rem;
    margin-bottom: 0.4rem;
  }

  .featured {
    margin-bottom: 2.5rem;
  }
  .featured .h-sm {
    margin-bottom: 1rem;
  }

  .controls {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  .search {
    position: relative;
    display: block;
    max-width: 34rem;
  }
  .search :global(.icon) {
    position: absolute;
    left: 0.8rem;
    top: 50%;
    translate: 0 -50%;
    color: var(--ink-3);
    pointer-events: none;
  }
  .search .input {
    padding-left: 2.5rem;
  }

  .group + .group {
    margin-top: 2.5rem;
  }
  .group-desc {
    margin: 0 0 1rem;
    max-width: var(--measure);
  }

  .grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
    gap: 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .res {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin: 0;
    padding: 1.1rem 1.2rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }
  .res:hover {
    border-color: var(--accent-edge);
    box-shadow: var(--shadow-md);
  }
  .res-link {
    color: var(--ink);
    font-weight: 600;
    letter-spacing: -0.01em;
    text-decoration: none;
  }
  /* The whole card is the link's hit area. */
  .res-link::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
  .res-link:hover {
    color: var(--accent);
  }
  .res-link :global(.icon) {
    margin-left: 0.3rem;
    vertical-align: -0.1em;
    color: var(--ink-3);
  }
  .res-desc {
    margin: 0;
    color: var(--ink-2);
    font-size: 0.94rem;
    flex: 1;
  }
  .res-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem 0.6rem;
    margin: 0.25rem 0 0;
  }

  .empty {
    display: grid;
    justify-items: start;
    gap: 0.5rem;
  }
  .empty p {
    margin: 0;
  }
</style>
