/**
 * Generate a simple demo image (radial gradient) as an HTMLImageElement.
 * Sized to match the target canvas so cover-fit doesn't crop it.
 * Used as the first-run placeholder until task 06 adds a real demo image.
 */
export function createDemoImage(width = 800, height = 600) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d');

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, '#ccbbdd');
  grad.addColorStop(0.6, '#556688');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = c.toDataURL();
  });
}
