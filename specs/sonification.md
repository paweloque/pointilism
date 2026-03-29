# Sonification — Hear the Image Through the Cursor

## Concept

The cursor already acts as a visual lens (displacing nearby dots). This feature adds an **audible lens**: as the user moves the cursor over the dot field, nearby dots contribute sine-wave partials to a synthesized tone. The result is that different regions of the image produce different chords — you can "hear" the image.

Inspired by Fourier synthesis (see [klanglabor.ch](https://klanglabor.ch)), where a complex tone is built from individual sine waves with varying frequency and amplitude.

## Mapping

Each dot near the cursor becomes one potential partial (sine wave). Its audio properties derive from existing dot data:

| Dot property | Audio parameter | Mapping |
|---|---|---|
| `brightness` (0–1) | Frequency | Quantized to a musical scale (see below) |
| Distance to cursor | Amplitude | Inverse linear falloff: `1 - dist / radius`, with 10–20 ms attack/release envelope to avoid clicks |
| RGB color | Timbre (harmonics) | R → 2nd harmonic amplitude, G → 3rd, B → 4th. Uses `PeriodicWave` with cached quantized entries. Fundamental always present at amplitude 1.0. |
| Hue (when chromatic) | Stereo pan | Hue mapped to -1…+1 pan position (skip if grayscale) |

### Frequency scale

Map `brightness` (0–1) to 2–3 octaves of a **pentatonic scale** so that any combination of nearby dots sounds consonant. Example mapping with A minor pentatonic rooted at A3 (220 Hz):

```
A3  C4  D4  E4  G4  A4  C5  D5  E5  G5  A5  C6  D6
220 262 294 330 392 440 523 587 659 784 880 1047 1175
```

Brightness 0 → lowest note, brightness 1 → highest note. Quantize to the nearest scale degree.

## Oscillator pool

Summing hundreds of sine waves is expensive and sounds muddy. Use a **fixed pool of 8–12 oscillators**.

Each animation frame:

1. Query nearby dots via `queryRadius(grid, mouse.x, mouse.y, radius)` — reuse the existing spatial grid.
2. Sort by distance (closest first).
3. Take the **closest N** (pool size) dots.
4. For each pool slot, smoothly update:
   - `OscillatorNode.frequency` → target frequency (use `setTargetAtTime` for glide)
   - `GainNode.gain` → target amplitude based on distance (use `setTargetAtTime`, time constant ~15 ms)
   - `OscillatorNode.type` → waveform based on dot size
5. If fewer than N dots are in range, fade unused oscillators to zero gain.

When the cursor leaves the canvas (mouse.x = -9999), fade all oscillators to zero.

## Architecture

### New file: `src/audio.js`

```
createAudioEngine(poolSize = 12)
  → { start(), stop(), update(nearbyDots, mouseX, mouseY, radius), setMasterVolume(v) }
```

- Lazily creates `AudioContext` on first user gesture (browser autoplay policy).
- Each pool slot: `OscillatorNode → GainNode → StereoPannerNode → masterGain → destination`.
- Oscillators are created once and kept alive; only frequency/gain/type are updated per frame.
- `masterGain` for global volume control.

### Integration point: `src/main.js`

Inside the existing render loop, after the spatial query for visual displacement, call `audioEngine.update(nearby, mouse.x, mouse.y, radius)`. The audio module receives the same dot candidates and applies its own sorting/selection.

### State additions

| Key | Type | Default | Group |
|---|---|---|---|
| `sonification` | boolean | `false` | `sound` |
| `sonificationVolume` | number (0–100) | `50` | `sound` |

### UI additions

Add a **Sound** section to the sidebar (below Motion, above Text):

- Toggle: **Enabled** (`sonification`)
- Slider: **Volume** (`sonificationVolume`, 0–100%)

On mobile bottom sheet: add a single toggle for sonification (no volume slider to keep it compact).

## Constraints

- **No sound by default.** The toggle starts off. Audio context is only created when the user enables sonification for the first time (respects browser autoplay policy).
- **CPU budget.** The oscillator pool caps computation. No per-dot oscillators.
- **No new dependencies.** Web Audio API is built into all modern browsers.
- **Graceful degradation.** If `AudioContext` is unavailable, the toggle simply does nothing.
- **Interaction-gated.** Sound only plays while the cursor is within the interaction radius of at least one dot. No ambient drone.

## Out of scope (for now)

- Recording / exporting audio
- Custom scale selection UI
- MIDI output
- Sonification in exported HTML files
