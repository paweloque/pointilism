/**
 * Generate a visually interesting demo image as an HTMLImageElement.
 * Procedural — no external file needed. Produces a scene with overlapping
 * gradients and shapes that look compelling as a dot field.
 */
export function createDemoImage(width = 800, height = 600) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d');

  // Dark base
  ctx.fillStyle = '#0a0a12';
  ctx.fillRect(0, 0, width, height);

  // Large soft glow — off-center warm light
  const g1 = ctx.createRadialGradient(
    width * 0.35, height * 0.4, 0,
    width * 0.35, height * 0.4, Math.min(width, height) * 0.55
  );
  g1.addColorStop(0, 'rgba(200, 160, 120, 0.9)');
  g1.addColorStop(0.3, 'rgba(140, 100, 80, 0.5)');
  g1.addColorStop(0.7, 'rgba(60, 40, 50, 0.2)');
  g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, width, height);

  // Second glow — cool accent, upper right
  const g2 = ctx.createRadialGradient(
    width * 0.75, height * 0.25, 0,
    width * 0.75, height * 0.25, Math.min(width, height) * 0.4
  );
  g2.addColorStop(0, 'rgba(100, 140, 200, 0.7)');
  g2.addColorStop(0.4, 'rgba(60, 80, 140, 0.3)');
  g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, width, height);

  // Bright spot — focal point
  const g3 = ctx.createRadialGradient(
    width * 0.42, height * 0.38, 0,
    width * 0.42, height * 0.38, Math.min(width, height) * 0.15
  );
  g3.addColorStop(0, 'rgba(255, 240, 220, 0.95)');
  g3.addColorStop(0.5, 'rgba(220, 180, 140, 0.4)');
  g3.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g3;
  ctx.fillRect(0, 0, width, height);

  // Subtle horizontal band — like a horizon
  const g4 = ctx.createLinearGradient(0, height * 0.55, 0, height * 0.7);
  g4.addColorStop(0, 'rgba(80, 60, 50, 0)');
  g4.addColorStop(0.3, 'rgba(80, 60, 50, 0.25)');
  g4.addColorStop(0.7, 'rgba(40, 30, 40, 0.15)');
  g4.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g4;
  ctx.fillRect(0, 0, width, height);

  // Small scattered bright spots — like distant lights
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 12; i++) {
    const sx = width * (0.15 + Math.sin(i * 2.3) * 0.35 + 0.35);
    const sy = height * (0.2 + Math.cos(i * 1.7) * 0.25 + 0.3);
    const sr = Math.min(width, height) * (0.02 + (i % 3) * 0.015);
    const gs = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
    const brightness = 120 + (i * 17) % 80;
    gs.addColorStop(0, `rgba(${brightness + 60}, ${brightness + 30}, ${brightness}, 0.6)`);
    gs.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gs;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.globalCompositeOperation = 'source-over';

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = c.toDataURL();
  });
}
