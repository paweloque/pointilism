# Pointilism — Image-to-Dots Background Generator

## What it does

A web app where the user uploads an image and gets back a self-contained HTML page that renders that image as a field of colored dots on a canvas. The dots respond to mouse movement with subtle displacement. The output page works as a standalone website background.

## How it works

1. **Upload** — User drops or selects an image (PNG/JPG).
2. **Sample** — The image is drawn to an offscreen canvas, cover-fitted to the viewport (like `background-size: cover`). On desktop, a draggable focal point controls the crop center; on mobile/tablet, center crop. Pixels are sampled at a configurable stride. The brightness threshold determines which pixels are too close to the background color to show as dots (near-black for dark backgrounds, near-white for light backgrounds). Each qualifying pixel becomes a dot whose color, size, and opacity derive from the source pixel's brightness and color.
3. **Render** — Dots are drawn on a full-viewport `<canvas>`. On mouse move, dots near the cursor shift away (or toward) by a small amount, then ease back to their origin.
4. **Export** — The user clicks "Export" and receives a single `.html` file with the image data inlined (base64) and all JS/CSS embedded. No external dependencies.

## Parameter playground

A sidebar/panel lets the user tweak and preview in real-time:

| Parameter | What it controls |
|---|---|
| **Background color** | Canvas fill behind the dots |
| **Dot stride** | Sampling density (every Nth pixel) |
| **Dot base size** | Minimum dot radius |
| **Dot size scaling** | How much brightness affects size |
| **Color tint** | Optional tint color + blend strength (0-100%) |
| **Mouse radius** | How far from cursor dots react |
| **Mouse strength** | How far dots displace |
| **Mouse easing** | How quickly dots return to origin |
| **Breathing** | Optional subtle opacity pulse |
| **Dot shape** | Circle (default), square, or soft-edge; squares render faster at high particle counts |
| **Brightness threshold** | Which pixels are too close to the background color to skip (adapts to light/dark background) |
| **Focal point** | Crop center for cover-fitted image (draggable on desktop, center on mobile) |
| **Presets** | Quick-start configurations (e.g. "Subtle", "Dense", "Dreamy", "Energetic") |
| **Reset** | Reset all parameters (or a group) back to defaults |
| **Text overlay** | Optional text rendered as part of the dot field |

## Presets

Presets set all parameters at once as a starting point. The user selects a preset, then fine-tunes individual sliders. Custom/saved presets are out of scope for now.

## Text overlay (optional)

The user can type a line of text, pick font/size/position. The text is rasterized onto the source image before sampling, so it becomes part of the dot field — not a separate HTML layer.

## Tech

- Single-page app, vanilla HTML/CSS/JS (or lightweight framework if needed later).
- Canvas 2D for rendering. No WebGL required at this scale.
- All processing happens client-side. No server needed.

## Export (open questions — to be discussed)

The export format needs a decision **before Phase 4 export work begins**:

- Embed original image and resample on page load? (small file, processing cost on open)
- Or embed the particle array directly? (large file, instant render)
- Should the exported page include mouse interaction and physics, or be static?
- Can it be iframe-embedded or used as a drop-in component?
- Is there a file size budget?

## Out of scope (for now)

- Video/GIF input
- Multi-image compositions
