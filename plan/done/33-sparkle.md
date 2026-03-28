# Task 33 — Sparkle (independent dot lifecycle)

**Phase**: 5 (Particle physics)
**Spec**: `specs/sparkle.md`

## Description

Dots independently fade in and out on their own cycle, creating a twinkling effect. Works regardless of whether rise is active.

## Deliverables

- Add to each dot in `sampler.js`:
  - `lifecycleDuration`: randomized cycle length (e.g. 4000–12000ms)
  - `lifecycleOffset`: random 0–1 (so dots don't sync)
- Add to `state.js`:
  - `sparkle: false` (toggle)
  - `sparkleSpeed: 1.0` (cycle speed multiplier, 0.2–3.0)
- In `updateDots` (main.js), when `state.sparkle` is on:
  - Calculate `progress = ((t * sparkleSpeed / dot.lifecycleDuration) + dot.lifecycleOffset) % 1`
  - Fade in: 0–0.15 → ramp alpha 0→1
  - Visible: 0.15–0.75 → alpha 1
  - Fade out: 0.75–1.0 → ramp alpha 1→0
  - Multiply into `alphaMultiplier` (stacks with breathing)
- Add sparkle toggle + speed slider to Motion section in `index.html`
- Wire controls in `main.js`
- Update physics presets: "animated" enables sparkle
- Update export.js to include sparkle in exported HTML

## Acceptance

- Toggling sparkle on shows dots twinkling in and out
- Each dot has its own rhythm (not synchronized)
- Speed slider makes the effect faster or slower
- Combines correctly with breathing, sway, rise
- Exported HTML includes sparkle if enabled
