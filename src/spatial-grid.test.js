import { describe, it, expect } from 'vitest';
import { buildGrid, queryRadius } from './spatial-grid.js';

function makeDot(ox, oy) {
  return { ox, oy, x: ox, y: oy };
}

describe('buildGrid', () => {
  it('assigns dots to cells', () => {
    const dots = [makeDot(5, 5), makeDot(15, 15), makeDot(25, 5)];
    const grid = buildGrid(dots, 10);
    expect(grid.cells.size).toBeGreaterThan(0);
    expect(grid.cellSize).toBe(10);
  });

  it('places dots in correct cells', () => {
    const dots = [makeDot(5, 5), makeDot(15, 5)];
    const grid = buildGrid(dots, 10);
    // (5,5) → cell 0,0; (15,5) → cell 1,0
    expect(grid.cells.get('0,0')).toHaveLength(1);
    expect(grid.cells.get('1,0')).toHaveLength(1);
  });
});

describe('queryRadius', () => {
  it('returns dots near the query point', () => {
    const dots = [makeDot(10, 10), makeDot(100, 100)];
    const grid = buildGrid(dots, 20);
    const result = queryRadius(grid, 12, 12, 20);
    expect(result).toContain(dots[0]);
    expect(result).not.toContain(dots[1]);
  });

  it('returns dots from neighboring cells', () => {
    // Dot at (19, 19), query at (21, 21) with radius 20 — different cells but within range
    const dots = [makeDot(19, 19)];
    const grid = buildGrid(dots, 20);
    const result = queryRadius(grid, 21, 21, 20);
    expect(result).toContain(dots[0]);
  });

  it('returns empty array when no dots nearby', () => {
    const dots = [makeDot(500, 500)];
    const grid = buildGrid(dots, 20);
    const result = queryRadius(grid, 10, 10, 20);
    expect(result).toHaveLength(0);
  });
});
