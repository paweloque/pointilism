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
  { x: 10, y: 20, r: 255, g: 128, b: 64, size: 1.5, alpha: 0.8 },
  { x: 30, y: 40, r: 100, g: 200, b: 50, size: 0.9, alpha: 0.5 },
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
    expect(ctx.fill).toHaveBeenCalledTimes(2);
  });

  it('draws squares when shape is square', () => {
    const ctx = makeMockCtx();
    drawDots(ctx, dots, '#000', 'square');
    // fillRect: 1 for bg clear + 2 for dots = 3
    expect(ctx.fillRect).toHaveBeenCalledTimes(3);
    expect(ctx.arc).not.toHaveBeenCalled();
  });

  it('draws soft dots with radial gradient', () => {
    const ctx = makeMockCtx();
    drawDots(ctx, dots, '#000', 'soft');
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(2);
    expect(ctx.arc).toHaveBeenCalledTimes(2);
  });

  it('resets globalAlpha to 1 after drawing', () => {
    const ctx = makeMockCtx();
    drawDots(ctx, dots, '#000', 'circle');
    expect(ctx.globalAlpha).toBe(1);
  });
});
