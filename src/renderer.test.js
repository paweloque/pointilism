import { describe, it, expect, vi } from 'vitest';
import { drawDots } from './renderer.js';

function makeMockCtx(width = 100, height = 100) {
  return {
    canvas: { width, height },
    fillStyle: '',
    globalAlpha: 1,
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
  };
}

const dots = [
  { x: 10, y: 20, r: 255, g: 128, b: 64, size: 1.5, alpha: 0.8, brightness: 0.7 },
  { x: 30, y: 40, r: 100, g: 200, b: 50, size: 0.9, alpha: 0.5, brightness: 0.4 },
];

describe('drawDots', () => {
  it('clears canvas with background color', () => {
    const ctx = makeMockCtx();
    drawDots(ctx, [], '#112233');
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
  });

  it('draws circles by default', () => {
    const ctx = makeMockCtx();
    drawDots(ctx, dots);
    expect(ctx.arc).toHaveBeenCalledTimes(2);
  });

  it('draws squares when shape is square', () => {
    const ctx = makeMockCtx();
    drawDots(ctx, dots, '#000', 'square');
    expect(ctx.fillRect).toHaveBeenCalledTimes(3);
    expect(ctx.arc).not.toHaveBeenCalled();
  });

  it('draws soft dots with radial gradient', () => {
    const ctx = makeMockCtx();
    drawDots(ctx, dots, '#000', 'soft');
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(2);
  });

  it('resets globalAlpha to 1 after drawing', () => {
    const ctx = makeMockCtx();
    drawDots(ctx, dots);
    expect(ctx.globalAlpha).toBe(1);
  });

  it('applies tint when blend > 0', () => {
    const ctx = makeMockCtx();
    const whiteDot = [{ x: 5, y: 5, r: 255, g: 255, b: 255, size: 1, alpha: 1, brightness: 1 }];
    drawDots(ctx, whiteDot, '#000', 'circle', { color: '#ff0000', blend: 100 });
    // At 100% blend, color should be pure red
    expect(ctx.fillStyle).toBe('rgb(255,0,0)');
  });

  it('shows original colors when blend is 0', () => {
    const ctx = makeMockCtx();
    const whiteDot = [{ x: 5, y: 5, r: 200, g: 100, b: 50, size: 1, alpha: 1, brightness: 0.5 }];
    drawDots(ctx, whiteDot, '#000', 'circle', { color: '#ff0000', blend: 0 });
    expect(ctx.fillStyle).toBe('rgb(200,100,50)');
  });

  it('uses sizeParams for dynamic sizing when provided', () => {
    const ctx = makeMockCtx();
    const d = [{ x: 5, y: 5, r: 255, g: 255, b: 255, size: 99, alpha: 1, brightness: 1.0 }];
    // size = base + brightness * scaling = 0.5 + 1.0 * 1.0 = 1.5
    drawDots(ctx, d, '#000', 'circle', null, { base: 0.5, scaling: 1.0 });
    // arc should be called with radius 1.5, not the baked size of 99
    expect(ctx.arc).toHaveBeenCalledWith(5, 5, 1.5, 0, 6.2832);
  });
});
