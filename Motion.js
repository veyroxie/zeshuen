import { isMotionReduced } from "./Dom.js";

/** Shared easing so every move in the house feels like the same camera. */
export const Ease = Object.freeze({
  Walk: "cubic-bezier(.45, 0, .2, 1)",
  Swing: "cubic-bezier(.55, .05, .25, 1)",
  Settle: "cubic-bezier(.2, .7, .2, 1)",
  Pop: "cubic-bezier(.3, 1.5, .5, 1)",
});

/**
 * Runs a Web Animation, holds its last frame, and resolves when it ends.
 * With reduced motion it jumps straight to the last frame.
 * @param {Element} element
 * @param {Keyframe[]} keyframes
 * @param {KeyframeAnimationOptions} options
 * @returns {Promise<void>}
 */
export function animate(element, keyframes, options) {
  const timing = isMotionReduced() ? { ...options, duration: 0, delay: 0 } : options;
  const animation = element.animate(keyframes, { fill: "forwards", ...timing });

  return animation.finished.then(() => undefined, reportUnexpectedCancel);
}

const AbortErrorName = "AbortError";

/**
 * clearMotion() cancels animations on purpose, which rejects with AbortError;
 * anything else is a real problem worth seeing.
 * @param {Error} error
 */
function reportUnexpectedCancel(error) {
  if (error.name === AbortErrorName) {
    return;
  }

  console.warn("Animation failed:", error);
}

/**
 * Drops every held animation frame so the element goes back to its CSS state.
 * @param {...Element} elements
 */
export function clearMotion(...elements) {
  elements.forEach((element) => element.getAnimations().forEach((animation) => animation.cancel()));
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function wait(ms) {
  const delay = isMotionReduced() ? 0 : ms;

  return new Promise((resolve) => { window.setTimeout(resolve, delay); });
}
