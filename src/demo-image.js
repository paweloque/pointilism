/**
 * Generate a simple demo image (radial gradient) as an HTMLImageElement.
 * Used as the first-run placeholder until task 06 adds a real demo image.
 */
export function createDemoImage(size = 256) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');

  // Radial gradient: bright center, dark edges
  const cx = size / 2;
  const cy = size / 2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.5);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.4, '#aaaacc');
  grad.addColorStop(0.7, '#445566');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = c.toDataURL();
  });
}
