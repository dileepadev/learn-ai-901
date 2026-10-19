/**
 * Progress for an island, in a form that hydrates cleanly.
 *
 * Islands are rendered at build time with empty progress. Reading
 * localStorage during the first client render would produce different markup
 * and break hydration, so the real value arrives only after mount - and
 * `ready` flips at the same moment, so returning visitors never see a
 * misleading zero (see `.pv` in global.css).
 *
 * Call it during component initialisation, like any other rune.
 */
import type { Progress } from '../data/types';
import { emptyProgress, progress } from './store';

export interface LiveProgress {
  readonly value: Progress;
  readonly ready: boolean;
}

export function liveProgress(): LiveProgress {
  let value = $state.raw<Progress>(emptyProgress());
  let ready = $state(false);

  $effect(() =>
    progress.subscribe((p) => {
      value = p;
      ready = true;
    }),
  );

  return {
    get value() {
      return value;
    },
    get ready() {
      return ready;
    },
  };
}
