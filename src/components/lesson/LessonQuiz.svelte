<script lang="ts">
  /** The end-of-lesson quiz. Scoring 70% or more marks the lesson complete. */
  import type { Question } from '../../data/types';
  import { markModuleComplete } from '../../lib/store';
  import QuizRunner from '../QuizRunner.svelte';

  interface Props {
    moduleId: string;
    title: string;
    questions: Question[];
    base: string;
    doneHref: string;
    doneLabel: string;
  }

  let { moduleId, title, questions, base, doneHref, doneLabel }: Props = $props();
</script>

<QuizRunner
  {questions}
  mode="module-quiz"
  scope={moduleId}
  {title}
  {base}
  {doneHref}
  {doneLabel}
  onfinish={(correct, total) => {
    if (total > 0 && correct / total >= 0.7) markModuleComplete(moduleId, true);
  }}
/>
