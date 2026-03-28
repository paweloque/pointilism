# Performance

## Targets

- **Desktop**: 60 FPS
- **Mobile**: 30 FPS acceptable
- **Particle budget**: cap at ~50k dots. Warn the user if their image + stride combination would exceed this.

## Rendering

- Start with Canvas 2D. No WebGL for now.
- WebGL is the escape hatch if Canvas 2D can't keep up at higher particle counts — noted as a future option, not planned.

## Spatial indexing

Mouse interaction needs to find dots near the cursor each frame. Checking every dot is O(n) — too slow at 50k particles.

Use a grid-based spatial index: divide the canvas into cells (e.g. cell size = mouse radius). On mouse move, only check dots in nearby cells. Rebuild the grid on resample.

## Parameter cost tiers

Not all parameter changes are equal:

| Tier | Cost | Examples | Update strategy |
|---|---|---|---|
| **Repaint** | Cheap | Color tint, dot size, opacity, background color | Apply next frame, no resample |
| **Resample** | Expensive | Stride, brightness threshold, image change | Debounce (200–300ms), then full resample |

The UI should feel instant for repaint params. Resample params can show a brief loading indicator if needed.

## Adaptive stride

On high-resolution images or lower-powered devices, auto-increase stride to stay within the particle budget. The user-chosen stride is a *minimum* — the system may increase it if the result would exceed the cap.

Display actual particle count in the sidebar so the user understands the tradeoff.
