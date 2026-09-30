import { Content } from "./Content.js";
import { createElement } from "./Dom.js";
import { createPhotoFigure, openSheet } from "./Sheet.js";

// A sideways drag at least this long counts as a swipe.
const SwipeMinPx = 40;
const SlideFromPx = 24;
const StepType = Object.freeze({ Previous: -1, Next: 1, Stay: 0 });
const KeyStep = Object.freeze({ ArrowLeft: StepType.Previous, ArrowRight: StepType.Next });

/**
 * Shows the fridge photos one at a time, starting at the one she tapped.
 * Arrows, arrow keys, or a sideways swipe move between them.
 * @param {number} startIndex
 */
export function openPhotoViewer(startIndex) {
  const state = { index: startIndex, stage: createElement("div", ""), count: createElement("span", "viewer__count") };
  const show = (step) => showPhoto(state, step);
  const previous = createNavButton("←", "Previous photo", () => show(StepType.Previous));
  const next = createNavButton("→", "Next photo", () => show(StepType.Next));
  const nav = createElement("div", "viewer__nav");
  nav.append(previous, state.count, next);
  const viewer = createElement("div", "viewer");
  viewer.append(state.stage, nav);
  listenForSwipe(viewer, show);
  viewer.addEventListener("keydown", (event) => showForKey(event.key, show));
  show(StepType.Stay);
  openSheet({ tag: Content.Side.Ours, title: Content.SheetTitle.Photos, children: [viewer] });
  next.focus();
}

/**
 * @param {{ index: number, stage: HTMLElement, count: HTMLElement }} state
 * @param {number} step
 */
function showPhoto(state, step) {
  const total = Content.Photos.length;
  state.index = (state.index + step + total) % total;
  const figure = createPhotoFigure(Content.Photos[state.index]);
  figure.style.setProperty("--from", `${step * SlideFromPx}px`);
  state.stage.replaceChildren(figure);
  state.count.textContent = `${state.index + 1} / ${total}`;
}

/**
 * Only the arrow keys move; any other key (Tab, Enter) leaves the photo alone.
 * @param {string} key
 * @param {(step: number) => void} show
 */
function showForKey(key, show) {
  const step = KeyStep[key];
  if (step === undefined) {
    return;
  }

  show(step);
}

/**
 * @param {string} symbol
 * @param {string} label
 * @param {() => void} onClick
 * @returns {HTMLButtonElement}
 */
function createNavButton(symbol, label, onClick) {
  const button = /** @type {HTMLButtonElement} */ (createElement("button", "pill pill--soft viewer__btn", symbol));
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.addEventListener("click", onClick);

  return button;
}

/**
 * @param {HTMLElement} viewer
 * @param {(step: number) => void} show
 */
function listenForSwipe(viewer, show) {
  let startX = null;
  viewer.addEventListener("pointerdown", (event) => { startX = event.clientX; });
  viewer.addEventListener("pointercancel", () => { startX = null; });
  viewer.addEventListener("pointerup", (event) => {
    const isTracking = startX !== null;
    const distance = isTracking ? event.clientX - startX : 0;
    startX = null;
    if (Math.abs(distance) < SwipeMinPx) {
      return;
    }

    show(distance < 0 ? StepType.Next : StepType.Previous);
  });
}
