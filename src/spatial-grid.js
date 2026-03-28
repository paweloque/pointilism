/**
 * Grid-based spatial index for fast radius queries.
 * Cell size should equal the query radius so lookups check at most 9 cells.
 */

/**
 * Build a grid from dots using their origin positions.
 * Call once after resampling, not every frame.
 *
 * @param {Array} dots
 * @param {number} cellSize
 * @returns {{ cells: Map, cellSize: number }}
 */
export function buildGrid(dots, cellSize) {
  const cells = new Map();

  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    const col = Math.floor(d.ox / cellSize);
    const row = Math.floor(d.oy / cellSize);
    const key = col + ',' + row;

    let cell = cells.get(key);
    if (!cell) {
      cell = [];
      cells.set(key, cell);
    }
    cell.push(d);
  }

  return { cells, cellSize };
}

/**
 * Query all dots within radius of (x, y).
 * Returns dots from the 9 cells overlapping the query circle.
 * Caller still does exact distance check — this just narrows candidates.
 *
 * @param {{ cells: Map, cellSize: number }} grid
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @returns {Array}
 */
export function queryRadius(grid, x, y, radius) {
  const { cells, cellSize } = grid;
  const minCol = Math.floor((x - radius) / cellSize);
  const maxCol = Math.floor((x + radius) / cellSize);
  const minRow = Math.floor((y - radius) / cellSize);
  const maxRow = Math.floor((y + radius) / cellSize);

  const result = [];

  for (let col = minCol; col <= maxCol; col++) {
    for (let row = minRow; row <= maxRow; row++) {
      const cell = cells.get(col + ',' + row);
      if (cell) {
        for (let i = 0; i < cell.length; i++) {
          result.push(cell[i]);
        }
      }
    }
  }

  return result;
}
