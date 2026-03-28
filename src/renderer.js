/**
 * Parse a hex color string to [r, g, b].
 */
function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/**
 * Get the rendered color for a dot, applying tint if active.
 */
function tintedColor(d, tintRgb, blend) {
  if (!tintRgb || blend <= 0) return `rgb(${d.r},${d.g},${d.b})`;
  const inv = 1 - blend;
  const r = Math.round(d.r * inv + tintRgb[0] * blend);
  const g = Math.round(d.g * inv + tintRgb[1] * blend);
  const b = Math.round(d.b * inv + tintRgb[2] * blend);
  return `rgb(${r},${g},${b})`;
}

/**
 * Compute dot size. If sizeParams provided, compute from brightness at draw time.
 * Otherwise fall back to pre-baked d.size.
 */
function dotSize(d, sizeParams) {
  if (sizeParams) return sizeParams.base + d.brightness * sizeParams.scaling;
  return d.size;
}

/**
 * Draw dots onto a canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} dots
 * @param {string} [bgColor='#000']
 * @param {string} [shape='circle']
 * @param {object} [tint] - { color: '#hex'|null, blend: 0-100 }
 * @param {object} [sizeParams] - { base: number, scaling: number } for draw-time size
 */
export function drawDots(ctx, dots, bgColor = '#000', shape = 'circle', tint = null, sizeParams = null) {
  const { width, height } = ctx.canvas;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const tintRgb = tint && tint.color && tint.blend > 0 ? hexToRgb(tint.color) : null;
  const blend = tintRgb ? tint.blend / 100 : 0;

  if (shape === 'square') {
    drawSquares(ctx, dots, tintRgb, blend, sizeParams);
  } else if (shape === 'soft') {
    drawSoft(ctx, dots, tintRgb, blend, sizeParams);
  } else {
    drawCircles(ctx, dots, tintRgb, blend, sizeParams);
  }

  ctx.globalAlpha = 1;
}

function drawCircles(ctx, dots, tintRgb, blend, sp) {
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    ctx.globalAlpha = d.drawAlpha !== undefined ? d.drawAlpha : d.alpha;
    ctx.fillStyle = tintedColor(d, tintRgb, blend);
    ctx.beginPath();
    ctx.arc(d.x, d.y, dotSize(d, sp), 0, 6.2832);
    ctx.fill();
  }
}

function drawSquares(ctx, dots, tintRgb, blend, sp) {
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    ctx.globalAlpha = d.drawAlpha !== undefined ? d.drawAlpha : d.alpha;
    ctx.fillStyle = tintedColor(d, tintRgb, blend);
    const s = dotSize(d, sp);
    const s2 = s * 2;
    ctx.fillRect(d.x - s, d.y - s, s2, s2);
  }
}

function drawSoft(ctx, dots, tintRgb, blend, sp) {
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    const s = dotSize(d, sp);
    const r = s * 2;
    const color = tintedColor(d, tintRgb, blend);
    const match = color.match(/\d+/g);
    const [cr, cg, cb] = match;
    const a = d.drawAlpha !== undefined ? d.drawAlpha : d.alpha;
    const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
    grad.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`);
    grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, 6.2832);
    ctx.fill();
  }
}
