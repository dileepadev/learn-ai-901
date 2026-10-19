<script lang="ts">
  /**
   * The readiness dial. Readiness is this app's own estimate, not a predicted
   * exam score, so the tick marks its "exam ready" threshold (80%) rather than
   * Microsoft's scaled pass mark.
   */
  interface Props {
    value: number;
    label: string;
    size?: number;
  }

  let { value, label, size = 156 }: Props = $props();

  const READY_AT = 80;
  const stroke = $derived(Math.round(size * 0.07));
  const radius = $derived((size - stroke) / 2 - 2);
  const circumference = $derived(2 * Math.PI * radius);
  const clamped = $derived(Math.max(0, Math.min(100, value)));
  const offset = $derived(circumference * (1 - clamped / 100));
  const angle = (READY_AT / 100) * 2 * Math.PI - Math.PI / 2;
</script>

<figure class="ring" style:--size={`${size}px`}>
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    role="img"
    aria-label={`Readiness ${clamped} percent: ${label}`}
  >
    <circle class="track" cx={size / 2} cy={size / 2} r={radius} fill="none" stroke-width={stroke} />
    <circle
      class="value"
      class:none={clamped === 0}
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke-width={stroke}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
    />
    <line
      class="tick"
      x1={size / 2 + (radius - stroke) * Math.cos(angle)}
      y1={size / 2 + (radius - stroke) * Math.sin(angle)}
      x2={size / 2 + (radius + stroke) * Math.cos(angle)}
      y2={size / 2 + (radius + stroke) * Math.sin(angle)}
    />
  </svg>
  <figcaption aria-hidden="true">
    <span class="pct num">{clamped}<span class="unit">%</span></span>
    <span class="label">{label}</span>
  </figcaption>
</figure>

<style>
  .ring {
    position: relative;
    flex-shrink: 0;
    width: var(--size);
    height: var(--size);
    margin: 0;
  }
  .track {
    stroke: var(--track);
  }
  .value {
    stroke: var(--accent);
    transition: stroke-dashoffset 0.9s var(--ease);
  }
  .value.none {
    stroke: transparent;
  }
  .tick {
    stroke: var(--ink-3);
    stroke-width: 2;
    stroke-linecap: round;
  }
  figcaption {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 14%;
    text-align: center;
  }
  .pct {
    font-size: calc(var(--size) * 0.24);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
  }
  .unit {
    margin-left: 0.04em;
    color: var(--ink-3);
    font-size: 0.5em;
    font-weight: 600;
  }
  .label {
    margin-top: 0.2rem;
    color: var(--ink-2);
    font-size: calc(var(--size) * 0.085);
    font-weight: 550;
    line-height: 1.2;
  }
</style>
