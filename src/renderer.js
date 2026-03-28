/**
 * Draw dots onto a canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} dots - Array of dot objects from sampler
 * @param {string} [bgColor='#000'] - Background fill color
 * @param {string} [shape='circle'] - 'circle', 'square', or 'soft'
 */
export function drawDots(ctx, dots, bgColor = '#000', shape = 'circle') {
  const { width, height } = ctx.canvas;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  if (shape === 'square') {
    drawSquares(ctx, dots);
  } else if (shape === 'soft') {
    drawSoft(ctx, dots);
  } else {
    drawCircles(ctx, dots);
  }

  ctx.globalAlpha = 1;
}

function drawCircles(ctx, dots) {
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    ctx.globalAlpha = d.alpha;
    ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.size, 0, 6.2832);
    ctx.fill();
  }
}

function drawSquares(ctx, dots) {
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    ctx.globalAlpha = d.alpha;
    ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;
    const s = d.size * 2; // diameter as side length
    ctx.fillRect(d.x - d.size, d.y - d.size, s, s);
  }
}

function drawSoft(ctx, dots) {
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    const r = d.size * 2; // larger radius for soft glow
    const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
    grad.addColorStop(0, `rgba(${d.r},${d.g},${d.b},${d.alpha})`);
    grad.addColorStop(1, `rgba(${d.r},${d.g},${d.b},0)`);
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, 6.2832);
    ctx.fill();
  }
}
