import { byId } from "./Dom.js";

const ToastMs = 2800;
const IsShownClass = "is-shown";

let hideTimer = 0;

/**
 * Shows a one-line note above the hint, then fades it out.
 * @param {string} text
 */
export function showToast(text) {
  const toast = byId("Toast");
  toast.textContent = text;
  toast.classList.add(IsShownClass);
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => toast.classList.remove(IsShownClass), ToastMs);
}
