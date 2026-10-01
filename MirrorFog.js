import { createElement } from "./Dom.js";

// Steam on the mirror: a canvas over the notes that her finger wipes away.
// Once most of it is clear, the rest fades and the notes scroll normally.
const BrushPx = 64;
const ClearRatio = 0.22;
const SampleStep = 24;
// a pixel this see-through counts as wiped
const FaintAlpha = 60;
const FadeMs = 600;
const IsClearClass = "is-clear";
// the fog is read back to see how much is wiped
const ReadOptions = Object.freeze({ willReadFrequently: true });
const FogColour = "rgba(236, 232, 226, .96)";

/**
 * @param {HTMLElement} target the notes to cover
 * @param {string} prompt shown on the steam
 */
export function fogOver(target, prompt) {
  const canvas = /** @type {HTMLCanvasElement} */ (createElement("canvas", "fog"));
  const label = createElement("span", "fog__prompt", prompt);
  target.append(canvas, label);
  // wait a frame so the sheet has its real size
  requestAnimationFrame(() => paintFog(canvas));
  let isWiping = false;
  canvas.addEventListener("pointerdown", (event) => { isWiping = true; canvas.setPointerCapture(event.pointerId); wipe(canvas, event); label.remove(); });
  canvas.addEventListener("pointermove", (event) => { if (isWiping) wipe(canvas, event); });
  canvas.addEventListener("pointerleave", () => clearIfMostlyWiped(canvas));
  canvas.addEventListener("pointerup", () => { isWiping = false; clearIfMostlyWiped(canvas); });
}

/** @param {HTMLCanvasElement} canvas */
function paintFog(canvas) {
  const box = canvas.getBoundingClientRect();
  canvas.width = Math.round(box.width);
  canvas.height = Math.round(box.height);
  const paint = canvas.getContext("2d", ReadOptions);
  paint.fillStyle = FogColour;
  paint.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {PointerEvent} event
 */
function wipe(canvas, event) {
  const box = canvas.getBoundingClientRect();
  const paint = canvas.getContext("2d", ReadOptions);
  paint.globalCompositeOperation = "destination-out";
  const x = event.clientX - box.left;
  const y = event.clientY - box.top;
  // soft-edged, like a hand on steam
  const brush = paint.createRadialGradient(x, y, 0, x, y, BrushPx);
  brush.addColorStop(0, "rgba(0, 0, 0, 1)");
  brush.addColorStop(0.7, "rgba(0, 0, 0, .9)");
  brush.addColorStop(1, "rgba(0, 0, 0, 0)");
  paint.fillStyle = brush;
  paint.beginPath();
  paint.arc(x, y, BrushPx, 0, Math.PI * 2);
  paint.fill();
}

/** @param {HTMLCanvasElement} canvas */
function clearIfMostlyWiped(canvas) {
  const { data } = canvas.getContext("2d", ReadOptions).getImageData(0, 0, canvas.width, canvas.height);
  let samples = 0;
  let cleared = 0;
  // check every SampleStep-th pixel's alpha
  for (let index = 3; index < data.length; index += 4 * SampleStep) {
    samples += 1;
    cleared += data[index] < FaintAlpha ? 1 : 0;
  }

  const isMostlyClear = samples > 0 && cleared / samples >= ClearRatio;
  if (isMostlyClear) {
    canvas.classList.add(IsClearClass);
    window.setTimeout(() => canvas.remove(), FadeMs);
  }
}
