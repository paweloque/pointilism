# Sparkle — Independent dot lifecycle

## What it does

Dots have an independent lifecycle: they fade in, remain visible for a duration, then fade out — regardless of whether rise is active. This creates a twinkling/sparkling effect where the image constantly reforms as dots pop in and out.

## How it works

Each dot gets a randomized lifecycle:
- **Cycle duration**: total time for one appear → stay → disappear cycle (randomized per dot)
- **Phase offset**: randomized so dots don't all sync up
- At any given time, a dot is in one of three stages:
  1. **Fade in** — alpha ramps from 0 to full over ~15% of the cycle
  2. **Visible** — full alpha for ~60% of the cycle
  3. **Fade out** — alpha ramps from full to 0 over ~25% of the cycle
- The cycle loops, so the dot reappears after fading out

## Parameters

| Parameter | Default | Range | Description |
|---|---|---|---|
| **Sparkle** (toggle) | off | on/off | Enable the lifecycle behavior |
| **Cycle speed** | 1.0 | 0.2–3.0 | Multiplier for cycle duration (higher = faster turnover) |

## Interaction with other physics

- Sparkle multiplies alpha alongside breathing (they stack)
- Works independently of rise — dots sparkle in place, or while rising, or while swaying
- When sparkle is off, dots are always visible (current behavior)
