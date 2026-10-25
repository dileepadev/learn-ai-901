<script lang="ts">
  /** An inline knowledge check inside a lesson. Answers feed spaced repetition. */
  import type { Question } from '../../data/types';
  import { recordAnswer } from '../../lib/store';
  import QuestionCard from '../QuestionCard.svelte';
  import Icon from '../Icon.svelte';

  interface Props {
    question: Question;
  }

  let { question }: Props = $props();
</script>

<div class="check">
  <p class="check-label"><Icon name="target" size={16} />Check your understanding</p>
  <QuestionCard {question} onanswered={(correct) => recordAnswer(question.id, correct)} />
</div>

<style>
  .check {
    padding: clamp(1.1rem, 0.85rem + 1vw, 1.6rem);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
  }
  .check-label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0 0 0.9rem;
    padding: 0.2rem 0.6rem 0.2rem 0.5rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.5;
  }
</style>
