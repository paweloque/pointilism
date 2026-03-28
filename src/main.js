import { sampleImage } from './sampler.js';
import { drawDots } from './renderer.js';
import { createDemoImage } from './demo-image.js';
import { buildGrid, queryRadius } from './spatial-grid.js';

const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const canvasArea = document.getElementById('canvas-area');
const uploadOverlay = document.getElementById('upload-overlay');
const fileInput = document.getElementById('file-input');
const uploadError = document.getElementById('upload-error');

let currentImage = null;
let dots = [];
let grid = null;
let W = 0;
let H = 0;
let animating = false;

// --- Mouse ---

const mouse = { x: -9999, y: -9999 };
const MOUSE_RADIUS = 80;
const MOUSE_STRENGTH = 18;
const MOUSE_EASING = 0.08;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

function resample() {
  if (!currentImage || !W || !H) return;
  const result = sampleImage(currentImage, W, H);
  dots = result.dots;
  grid = buildGrid(dots, MOUSE_RADIUS);
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const newW = Math.round(rect.width);
  const newH = Math.round(rect.height);
  if (newW === W && newH === H) return;
  W = newW;
  H = newH;
  canvas.width = W;
  canvas.height = H;
  resample();
}

// --- Animation loop ---

function updateDots() {
  // Ease all dots toward their origin
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    d.x += (d.ox - d.x) * MOUSE_EASING;
    d.y += (d.oy - d.y) * MOUSE_EASING;
  }

  // Displace only nearby dots via spatial grid
  if (!grid || mouse.x < -1000) return;

  const nearby = queryRadius(grid, mouse.x, mouse.y, MOUSE_RADIUS);
  for (let i = 0; i < nearby.length; i++) {
    const d = nearby[i];
    const dx = d.ox - mouse.x;
    const dy = d.oy - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MOUSE_RADIUS && dist > 0) {
      const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
      const targetX = d.ox + (dx / dist) * force;
      const targetY = d.oy + (dy / dist) * force;
      // Override the ease-to-origin with displaced target
      d.x += (targetX - d.x) * MOUSE_EASING;
      d.y += (targetY - d.y) * MOUSE_EASING;
    }
  }
}

function animate(t) {
  requestAnimationFrame(animate);
  updateDots();
  drawDots(ctx, dots);
}

function startLoop() {
  if (animating) return;
  animating = true;
  requestAnimationFrame(animate);
}

// --- Upload ---

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('not an image'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('failed to load image'));
    };
    img.src = url;
  });
}

function showError(msg) {
  uploadError.textContent = msg;
  uploadError.classList.add('visible');
  setTimeout(() => uploadError.classList.remove('visible'), 2500);
}

async function handleFile(file) {
  try {
    currentImage = await loadImageFromFile(file);
    uploadOverlay.classList.add('hidden');
    resample();
  } catch (e) {
    showError(e.message === 'not an image' ? 'not an image file' : 'failed to load image');
  }
}

uploadOverlay.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    handleFile(fileInput.files[0]);
  }
  fileInput.value = '';
});

canvasArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  canvasArea.classList.add('dragover');
});

canvasArea.addEventListener('dragleave', () => {
  canvasArea.classList.remove('dragover');
});

canvasArea.addEventListener('drop', (e) => {
  e.preventDefault();
  canvasArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

// --- Resize ---

let resizeTimer;
const ro = new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 150);
});
ro.observe(canvas);

// --- Init ---

async function init() {
  resize();
  currentImage = await createDemoImage(W, H);
  resample();
  startLoop();
}

init();
