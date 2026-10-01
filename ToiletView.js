import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { animate, clearMotion, Ease, wait } from "./Motion.js";
import { showToast } from "./Toast.js";

// She walks in on me at the sink; a beat later I turn round mid-brush.
const TurnRoundDelayMs = 1500;
const TurnRoundMs = 450;

let peekRun = 0;

/** Puts both photos in place; only the first shows until she arrives. */
export function initToiletView() {
  const photos = Content.ToiletPhotos.map((photo, index) => {
    const image = /** @type {HTMLImageElement} */ (createElement("img", "toilet__photo"));
    image.src = photo.Src;
    image.alt = photo.Alt;
    image.dataset.step = String(index);

    return image;
  });
  byId("ToiletPhotos").replaceChildren(...photos);
}

/** Back to the first photo, ready for the next time she opens the door. */
export function resetToiletPeek() {
  peekRun += 1;
  const turned = turnedPhoto();
  clearMotion(turned);
  turned.style.opacity = "0";
}

/** Runs the gag once she's through the door. A later walk-in cancels an unfinished one. */
export async function playToiletPeek() {
  const run = peekRun;
  await wait(TurnRoundDelayMs);
  if (run !== peekRun) {
    return;
  }

  await animate(turnedPhoto(), [{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "scale(1)" }], { duration: TurnRoundMs, easing: Ease.Settle });
  showToast(Content.House.Toasts.Knock);
}

/** @returns {HTMLElement} the second photo, me turning round */
function turnedPhoto() {
  return byId("ToiletPhotos").querySelector('[data-step="1"]');
}
