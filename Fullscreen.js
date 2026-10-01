import { Content } from "./Content.js";
import { byId } from "./Dom.js";

// Drawn rather than typed: the fonts don't all have a full-screen symbol.
const IconPath = Object.freeze({
  Enter: "M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5",
  Exit: "M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5",
});

/** @returns {boolean} true when the browser can hide its own bars (Android, laptops; not iPhone Safari) */
const canGoFullscreen = () => typeof document.documentElement.requestFullscreen === "function";

/** A corner button that hides the browser's bars, so the flat fills the phone. */
export function initFullscreen() {
  if (canGoFullscreen() === false) {
    return;
  }

  const button = byId("Fullscreen");
  button.hidden = false;
  button.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", showState);
  showState();
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch((error) => console.warn("Could not leave full screen:", error));

    return;
  }

  document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch((error) => console.warn("Could not go full screen:", error));
}

function showState() {
  const isFull = document.fullscreenElement !== null;
  const button = byId("Fullscreen");
  const path = isFull ? IconPath.Exit : IconPath.Enter;
  button.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  button.setAttribute("aria-label", isFull ? Content.Ui.ExitFullscreen : Content.Ui.EnterFullscreen);
}
