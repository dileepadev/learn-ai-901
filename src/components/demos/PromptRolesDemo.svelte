<script lang="ts">
  /**
   * Same user question, four different system messages. The replies are
   * hand-written rather than generated - the point is to show how much of the
   * output a system prompt controls, which is the examinable idea.
   */
  const USER = 'My order #4471 has not arrived. What do I do?';

  const PRESETS = [
    {
      id: 'none',
      label: 'No system message',
      system: '(none)',
      reply:
        "I'm sorry to hear that! Order delays can happen for lots of reasons - carrier backlogs, weather, an address issue, or the parcel being held at a depot. Have you checked your tracking link? Usually the carrier updates it within 24 hours. If it has been more than a week, most retailers will let you open a claim, and some will send a replacement while the investigation runs. You may also want to check with neighbours…",
      notes: 'Rambling, no format, no boundaries, and it invents policy the company may not have.',
      tone: 'bad',
    },
    {
      id: 'scope',
      label: 'Persona + scope',
      system:
        'You are a Contoso support assistant. Only discuss Contoso orders, delivery and returns. Never discuss competitors or pricing.',
      reply:
        "I can help with order #4471. Delivery issues are usually resolved by opening a delivery investigation. I'll need to check the tracking status on the order first - could you confirm the delivery address on file?",
      notes: 'On-brand and in scope, but the length and shape still vary between requests.',
      tone: 'ok',
    },
    {
      id: 'format',
      label: '+ Output format',
      system:
        'You are a Contoso support assistant. Only discuss Contoso orders, delivery and returns. Reply in at most three sentences, plain language, no marketing tone.',
      reply:
        "I can help with order #4471. The next step is to open a delivery investigation, which usually resolves within two working days. Please confirm the delivery address on file so I can raise it.",
      notes: 'Predictable length and register. This is what a format instruction buys you.',
      tone: 'good',
    },
    {
      id: 'grounded',
      label: '+ Failure behaviour',
      system:
        'You are a Contoso support assistant. Answer only from the context provided. If the answer is not in the context, say "I don\'t have that information" and offer to hand over to a human. Reply in at most three sentences.',
      reply:
        "I don't have that information for order #4471. I can hand you over to a human agent who can look up the delivery status directly. Would you like me to do that?",
      notes:
        'The single highest-value line you can add to a grounded assistant: it refuses rather than inventing.',
      tone: 'good',
    },
  ];

  let selected = $state(PRESETS[0]!.id);
  const current = $derived(PRESETS.find((p) => p.id === selected)!);
</script>

<div class="demo">
  <div class="tabs" role="group" aria-label="System message">
    {#each PRESETS as preset (preset.id)}
      <button
        type="button"
        class="tab"
        class:active={selected === preset.id}
        aria-pressed={selected === preset.id}
        onclick={() => (selected = preset.id)}>{preset.label}</button
      >
    {/each}
  </div>

  <div class="chat">
    <div class="msg system">
      <span class="role">system</span>
      <p>{current.system}</p>
    </div>
    <div class="msg user">
      <span class="role">user</span>
      <p>{USER}</p>
    </div>
    {#key current.id}
      <div class="msg assistant rise-in {current.tone}">
        <span class="role">assistant</span>
        <p>{current.reply}</p>
      </div>
    {/key}
  </div>

  <p class="notes {current.tone}">{current.notes}</p>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .tabs {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
  .tab {
    font: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.28rem 0.6rem;
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

  .chat {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .msg {
    border-radius: var(--radius);
    border: 1px solid var(--border);
    padding: 0.55rem 0.7rem;
    background: var(--surface);
  }
  .msg p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.55;
  }

  .role {
    display: block;
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--ink-3);
    margin-bottom: 0.2rem;
  }

  .system {
    background: var(--surface-2);
    border-left: 3px solid var(--ink-3);
  }
  .user {
    border-left: 3px solid var(--accent);
  }
  .assistant {
    border-left: 3px solid var(--accent);
  }
  .assistant.bad {
    border-left-color: var(--danger);
  }
  .assistant.good {
    border-left-color: var(--success);
  }

  .notes {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.5;
    padding: 0.55rem 0.7rem;
    border-radius: var(--radius);
    background: var(--surface-2);
    border: 1px solid var(--border);
  }
  .notes.bad {
    background: var(--danger-soft);
    border-color: var(--danger-edge);
  }
  .notes.good {
    background: var(--success-soft);
    border-color: var(--success-edge);
  }
</style>
