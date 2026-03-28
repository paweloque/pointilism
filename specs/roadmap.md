# Roadmap

Ordered phases. Each phase is self-contained and produces a working app. Later phases build on earlier ones. This document is the input for generating implementation tasks.

## Phase 1 — Static dot renderer

Get pixels on screen. No animation, no controls.

- Load a hardcoded test image onto an offscreen canvas
- Sample pixels at a fixed stride, skip near-black
- Draw dots on a full-viewport canvas (size + opacity derived from brightness)
- Result: a static pointillist rendering of the image

## Phase 2 — Image upload

Let the user bring their own image.

- Drag-and-drop and file picker
- Replace the hardcoded image, resample, re-render
- Handle resize / orientation change

## Phase 3 — Mouse interaction

Dots react to the cursor.

- Track mouse position over canvas
- Dots within a radius displace away from cursor
- Dots ease back to origin when cursor moves away
- Configurable: radius, strength, easing speed

## Phase 4 — Parameter playground + basic export

Real-time tweaking and first exportable output.

- Sidebar (desktop) / bottom sheet (mobile) with controls
- Parameters: background color, stride, dot size, size scaling, color tint + blend, brightness threshold, dot shape, focal point
- Presets: quick-start configurations ("Subtle", "Dense", "Dreamy", "Energetic")
- Reset to defaults (per group and global)
- Sliders update the canvas live (resample where needed, repaint otherwise — see performance spec)
- Follows progressive enhancement spec (small/medium/large breakpoints)
- Light/dark mode toggle
- **Basic export**: produces a self-contained `.html` with static dots + mouse interaction. Validates the core value prop early. Export format decisions (see SPEC.md open questions) must be resolved before this work begins.

## Phase 5 — Particle physics

Dots come alive. Inspired by the [vibehaton](https://isnard.dev/vibehaton/) particle system.

- **Sway** — subtle lateral drift (per-dot frequency + amplitude)
- **Rise** — dots float upward by a small amount, loop back
- **Breathing** — opacity oscillates gently over time
- **Escape** — a small fraction of dots break free near end of life cycle and scatter
- **Fade in/out** — dots appear and disappear smoothly
- All behaviors are optional and controlled by parameters in the sidebar
- A "physics" toggle group: off (static + mouse only), subtle, animated
- Each sub-behavior (sway, rise, breathing, escape) has its own on/off and intensity

## Phase 6 — Text overlay

Text becomes part of the dot field.

- Text input, font picker, size slider
- Text is rasterized onto the source image before sampling
- Positioning: centered (mobile/tablet), drag-to-place (desktop)
- Multiple text layers (desktop only)

## Phase 7 — Export (full)

Extend the basic export from Phase 4 with everything built since.

- Exported page includes physics, text overlay, and all parameter state baked in
- All JS/CSS embedded, zero external dependencies
- The exported page is the final product: a ready-to-use website background

## Phase 8 — Mobile polish

- Touch interaction (tap + drag replaces mouse)
- Gyroscope/tilt displaces dots on supported devices
- Performance tuning for lower-powered devices (adaptive stride, frame skipping)
