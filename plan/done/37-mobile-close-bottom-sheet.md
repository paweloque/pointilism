# Task 37 — Mobile: close bottom sheet

**Phase**: 4 (Parameter playground)
**Spec**: `specs/ux-progressive-enhancement.md`

## Problem

On mobile (< 640px), the settings bottom sheet opens when the user taps the floating action button (FAB). Once open, the sheet (`z-index: 10`) covers the FAB (`z-index: 3`), leaving no way to dismiss it.

## Deliverables

- Add a close affordance to the bottom sheet. Options (pick one):
  - **Preferred**: add a small close / collapse button at the top of the bottom sheet (e.g. a centered `—` drag-handle bar or `✕` button) that removes the `.open` class
  - Alternative: raise the FAB above the sheet when open, turning it into a close button
- Tapping the canvas area above the sheet should also dismiss it (click-outside-to-close)
- The close affordance should follow the existing minimal-mono style (1px borders, Inter font, `--ink`/`--bg` tokens)

## Acceptance

- On a mobile viewport (< 640px), tapping the FAB opens the bottom sheet
- The bottom sheet can be closed again by tapping the close control or tapping outside the sheet
- No regressions on medium (sidebar toggle) or large (persistent sidebar) breakpoints
