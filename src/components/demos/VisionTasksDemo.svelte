<script lang="ts">
  /**
   * One scene, five vision tasks. Switching between them shows that the tasks
   * differ entirely in the *shape of their output* - which is exactly how the
   * exam distinguishes them.
   */
  type Task = 'classify' | 'detect' | 'segment' | 'ocr' | 'face';

  let task = $state<Task>('classify');

  const TASKS: { id: Task; label: string; output: string; note: string }[] = [
    {
      id: 'classify',
      label: 'Classification',
      output: '{ "label": "warehouse", "confidence": 0.94 }',
      note: 'One label for the whole image. It cannot tell you where anything is, or how many.',
    },
    {
      id: 'detect',
      label: 'Object detection',
      output:
        '[\n  { "label": "box",    "box": [18,96,30,26],   "conf": 0.97 },\n  { "label": "box",    "box": [54,96,30,26],   "conf": 0.96 },\n  { "label": "pallet", "box": [14,128,74,14],  "conf": 0.91 },\n  { "label": "person", "box": [128,62,30,80],  "conf": 0.89 }\n]',
      note: 'A label and a bounding box per instance. This is what lets you count.',
    },
    {
      id: 'segment',
      label: 'Segmentation',
      output: '{ "masks": [{ "label": "person", "pixels": 4128 }, { "label": "pallet", "pixels": 2310 }] }',
      note: 'A per-pixel mask, so you can measure exact shape and area.',
    },
    {
      id: 'ocr',
      label: 'OCR',
      output: '[\n  { "text": "AISLE 4", "box": [110,20,66,14] },\n  { "text": "FRAGILE", "box": [20,100,26,8] }\n]',
      note: 'The characters, with their coordinates. Printed and handwritten.',
    },
    {
      id: 'face',
      label: 'Face detection',
      output: '[{ "faceRectangle": { "top": 64, "left": 132, "width": 20, "height": 22 } }]',
      note: 'Where the faces are. Deciding *who* they are is Limited Access.',
    },
  ];

  const current = $derived(TASKS.find((t) => t.id === task)!);
</script>

<div class="demo">
  <div class="tabs" role="group" aria-label="Computer vision task">
    {#each TASKS as t (t.id)}
      <button
        type="button"
        class="tab"
        class:active={task === t.id}
        aria-pressed={task === t.id}
        onclick={() => (task = t.id)}>{t.label}</button
      >
    {/each}
  </div>

  <div class="stage">
    <svg viewBox="0 0 200 150" role="img" aria-label={`Warehouse scene with ${current.label} output`}>
      <!-- Scene -->
      <rect x="0" y="0" width="200" height="150" fill="var(--surface-2)" />
      <rect x="0" y="112" width="200" height="38" fill="var(--border)" opacity="0.5" />

      <!-- Sign -->
      <rect x="110" y="20" width="66" height="14" rx="2" fill="var(--surface)" stroke="var(--border-strong)" />
      <text x="143" y="30" font-size="8" text-anchor="middle" fill="var(--ink-2)" font-family="monospace">AISLE 4</text>

      <!-- Pallet -->
      <rect x="14" y="128" width="74" height="14" rx="1" fill="var(--warn-soft)" stroke="var(--warn-edge)" />

      <!-- Boxes -->
      <rect x="18" y="96" width="30" height="26" rx="2" fill="var(--accent-soft)" stroke="var(--border)" />
      <text x="33" y="108" font-size="5" text-anchor="middle" fill="var(--ink-2)" font-family="monospace">FRAGILE</text>
      <rect x="54" y="96" width="30" height="26" rx="2" fill="var(--accent-soft)" stroke="var(--border)" />

      <!-- Person -->
      <circle cx="142" cy="74" r="10" fill="var(--accent-soft)" stroke="var(--border-strong)" />
      <rect x="132" y="86" width="20" height="42" rx="6" fill="var(--accent-soft)" stroke="var(--border-strong)" />

      <!-- Task overlays -->
      {#if task === 'classify'}
        <rect x="2" y="2" width="196" height="146" fill="none" stroke="var(--accent)" stroke-width="2.5" rx="4" />
        <rect x="6" y="6" width="78" height="15" rx="3" fill="var(--accent)" />
        <text x="45" y="17" font-size="8" text-anchor="middle" fill="var(--on-accent)" font-weight="700">warehouse 94%</text>
      {/if}

      {#if task === 'detect'}
        {#each [{ x: 18, y: 96, w: 30, h: 26, l: 'box' }, { x: 54, y: 96, w: 30, h: 26, l: 'box' }, { x: 14, y: 128, w: 74, h: 14, l: 'pallet' }, { x: 128, y: 62, w: 30, h: 80, l: 'person' }] as b (b.l + b.x)}
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke="var(--accent)" stroke-width="1.8" />
          <rect x={b.x} y={b.y - 9} width={b.l.length * 4.6 + 6} height="9" fill="var(--accent)" />
          <text x={b.x + 3} y={b.y - 2.5} font-size="6" fill="var(--on-accent)" font-weight="700">{b.l}</text>
        {/each}
      {/if}

      {#if task === 'segment'}
        <g opacity="0.62">
          <circle cx="142" cy="74" r="10" fill="var(--accent)" />
          <rect x="132" y="86" width="20" height="42" rx="6" fill="var(--accent)" />
          <rect x="14" y="128" width="74" height="14" rx="1" fill="var(--success)" />
          <rect x="18" y="96" width="30" height="26" rx="2" fill="var(--warn)" />
          <rect x="54" y="96" width="30" height="26" rx="2" fill="var(--warn)" />
        </g>
      {/if}

      {#if task === 'ocr'}
        <rect x="110" y="20" width="66" height="14" fill="none" stroke="var(--success)" stroke-width="1.6" />
        <rect x="20" y="100" width="26" height="9" fill="none" stroke="var(--success)" stroke-width="1.6" />
      {/if}

      {#if task === 'face'}
        <rect x="132" y="64" width="20" height="22" fill="none" stroke="var(--danger)" stroke-width="1.8" />
        <rect x="132" y="55" width="26" height="9" fill="var(--danger)" />
        <text x="135" y="61.5" font-size="6" fill="var(--surface)" font-weight="700">face</text>
      {/if}
    </svg>

    <div class="output">
      <span class="tiny subtle">Typical output</span>
      <pre>{current.output}</pre>
      <p class="tiny note">{current.note}</p>
    </div>
  </div>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .tabs {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
  .tab {
    font: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink-2);
    cursor: pointer;
    transition:
      background 0.13s,
      color 0.13s;
  }
  .tab:hover {
    background: var(--hover);
    color: var(--ink);
  }
  .tab.active {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-accent);
  }

  .stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0.8rem;
    align-items: start;
  }

  svg {
    width: 100%;
    height: auto;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    display: block;
  }

  .output {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  pre {
    font-size: 0.72rem;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    border: 1px solid var(--border);
    max-height: 170px;
    overflow: auto;
  }

  .note {
    margin: 0;
    color: var(--ink-2);
    line-height: 1.5;
  }

  @media (max-width: 620px) {
    .stage {
      grid-template-columns: 1fr;
    }
  }
</style>
