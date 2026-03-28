import { sampleImage } from './sampler.js';
import { drawDots } from './renderer.js';
import { createDemoImage } from './demo-image.js';

const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

let currentImage = null;
let W = 0;
let H = 0;

function resize() {
  const rect = canvas.getBoundingClientRect();
  const newW = Math.round(rect.width);
  const newH = Math.round(rect.height);
  if (newW === W && newH === H) return;
  W = newW;
  H = newH;
  canvas.width = W;
  canvas.height = H;
  render();
}

function render() {
  if (!currentImage || !W || !H) return;
  const { dots } = sampleImage(currentImage, W, H);
  drawDots(ctx, dots);
}

// Debounced resize via ResizeObserver
let resizeTimer;
const ro = new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 150);
});
ro.observe(canvas);

async function init() {
  resize();
  currentImage = await createDemoImage(W, H);
  render();
}

init();
