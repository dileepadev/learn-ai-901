<script lang="ts">
  /**
   * Build a Content Understanding field schema by toggling fields, and watch
   * the JSON it produces. The point is the Extract / Classify / Generate
   * choice, which the exam tests directly.
   */
  type Method = 'extract' | 'classify' | 'generate';

  interface Field {
    id: string;
    name: string;
    type: string;
    method: Method;
    description: string;
    enumValues?: string[];
    on: boolean;
    modality: 'document' | 'image' | 'audio' | 'video';
  }

  let modality = $state<'document' | 'image' | 'audio' | 'video'>('document');

  let fields = $state<Field[]>([
    { id: 'f1', name: 'VendorName', type: 'string', method: 'extract', description: 'Legal company name issuing the document', on: true, modality: 'document' },
    { id: 'f2', name: 'TotalAmount', type: 'number', method: 'extract', description: 'Final amount due including taxes', on: true, modality: 'document' },
    { id: 'f3', name: 'DocumentType', type: 'string', method: 'classify', description: 'Which kind of document this is', enumValues: ['invoice', 'receipt', 'purchase order'], on: true, modality: 'document' },
    { id: 'f4', name: 'Summary', type: 'string', method: 'generate', description: 'One sentence describing what this document is for', on: false, modality: 'document' },
    { id: 'f5', name: 'DamagedParts', type: 'array', method: 'generate', description: 'List of visibly damaged vehicle parts', on: true, modality: 'image' },
    { id: 'f6', name: 'Severity', type: 'string', method: 'classify', description: 'Overall damage severity', enumValues: ['minor', 'moderate', 'severe'], on: true, modality: 'image' },
    { id: 'f7', name: 'CallSentiment', type: 'string', method: 'classify', description: 'How the caller sounded by the end of the call', enumValues: ['positive', 'neutral', 'negative'], on: true, modality: 'audio' },
    { id: 'f8', name: 'CallSummary', type: 'string', method: 'generate', description: 'A short summary of what the caller needed and what was agreed', on: true, modality: 'audio' },
    { id: 'f9', name: 'SceneDescription', type: 'string', method: 'generate', description: 'What happens in this segment: people, places, actions', on: true, modality: 'video' },
    { id: 'f10', name: 'ContainsDemo', type: 'boolean', method: 'classify', description: 'Whether this segment shows a product demonstration', enumValues: ['true', 'false'], on: true, modality: 'video' },
  ]);

  const MODALITIES = [
    { id: 'document' as const, label: 'Document', analyzer: 'prebuilt-document', example: 'invoice.pdf' },
    { id: 'image' as const, label: 'Image', analyzer: 'prebuilt-image', example: 'damage-photo.jpg' },
    { id: 'audio' as const, label: 'Audio', analyzer: 'prebuilt-audio', example: 'support-call.wav' },
    { id: 'video' as const, label: 'Video', analyzer: 'prebuilt-video', example: 'product-demo.mp4' },
  ];

  const currentModality = $derived(MODALITIES.find((m) => m.id === modality)!);
  const visible = $derived(fields.filter((f) => f.modality === modality));
  const active = $derived(visible.filter((f) => f.on));

  function toggle(id: string) {
    fields = fields.map((f) => (f.id === id ? { ...f, on: !f.on } : f));
  }

  const schema = $derived.by(() => {
    const props: Record<string, unknown> = {};
    for (const f of active) {
      const entry: Record<string, unknown> = {
        type: f.type,
        method: f.method,
        description: f.description,
      };
      if (f.method === 'classify' && f.enumValues) entry.enum = f.enumValues;
      props[f.name] = entry;
    }
    return JSON.stringify(
      { baseAnalyzerId: currentModality.analyzer, fieldSchema: { fields: props } },
      null,
      2,
    );
  });

  const methodHelp: Record<Method, string> = {
    extract: 'Takes the value exactly as it appears. Documents only.',
    classify: 'Chooses from a predefined set of categories.',
    generate: 'Freely writes a value from the input.',
  };

  const extractWarning = $derived(
    modality !== 'document' && active.some((f) => f.method === 'extract'),
  );
</script>

<div class="demo">
  <div class="tabs" role="group" aria-label="Content modality">
    {#each MODALITIES as m (m.id)}
      <button
        type="button"
        class="tab"
        class:active={modality === m.id}
        aria-pressed={modality === m.id}
        onclick={() => (modality = m.id)}>{m.label}</button
      >
    {/each}
  </div>

  <p class="tiny subtle">
    Base analyzer <code>{currentModality.analyzer}</code> · input <code>{currentModality.example}</code>
  </p>

  <div class="split">
    <div class="fields">
      <span class="tiny subtle lbl">Fields in your schema</span>
      {#each visible as field (field.id)}
        <label class="field" class:on={field.on}>
          <input type="checkbox" checked={field.on} onchange={() => toggle(field.id)} />
          <span class="field-body">
            <span class="field-head">
              <code>{field.name}</code>
              <span class="chip method {field.method}">{field.method}</span>
            </span>
            <span class="tiny subtle">{methodHelp[field.method]}</span>
          </span>
        </label>
      {/each}
    </div>

    <div class="json">
      <span class="tiny subtle lbl">Analyzer definition</span>
      <pre>{schema}</pre>
      {#if extractWarning}
        <p class="tiny warn-note">
          Note: <strong>Extract</strong> is supported for documents only. For images, audio and video,
          use Classify or Generate.
        </p>
      {/if}
    </div>
  </div>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
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
    padding: 0.28rem 0.65rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink-2);
    cursor: pointer;
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

  .split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0.8rem;
    align-items: start;
  }

  .lbl {
    display: block;
    margin-bottom: 0.3rem;
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .field {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.6rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface);
    cursor: pointer;
    transition:
      border-color 0.13s,
      opacity 0.13s;
    opacity: 0.55;
  }
  .field.on {
    opacity: 1;
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  input[type='checkbox'] {
    margin-top: 0.25rem;
    accent-color: var(--accent);
    flex-shrink: 0;
  }

  .field-body {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .field-head {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
  }
  .field-head code {
    font-size: 0.8rem;
  }

  .method {
    font-size: 0.65rem;
    padding: 0.08rem 0.35rem;
  }
  .method.extract {
    background: var(--accent-soft);
    border-color: var(--border);
    color: var(--accent);
  }
  .method.classify {
    background: var(--warn-soft);
    border-color: var(--warn-edge);
    color: var(--warn);
  }
  .method.generate {
    background: var(--success-soft);
    border-color: var(--success-edge);
    color: var(--success);
  }

  pre {
    font-size: 0.72rem;
    padding: 0.65rem;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    border: 1px solid var(--border);
    max-height: 320px;
    overflow: auto;
  }

  .warn-note {
    margin: 0.4rem 0 0;
    padding: 0.45rem 0.6rem;
    border-radius: var(--radius-sm);
    background: var(--warn-soft);
    border: 1px solid var(--warn-edge);
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .split {
      grid-template-columns: 1fr;
    }
  }
</style>
