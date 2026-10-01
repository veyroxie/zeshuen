import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { animate, clearMotion, Ease, wait } from "./Motion.js";

// She walks in on me at the sink; a beat later I turn round mid-brush.
const TurnRoundDelayMs = 1500;
const TurnRoundMs = 450;
const HeyDelayMs = 250;
const HeyFrames = Object.freeze([
  { opacity: 0, transform: "translate(-50%, 12px) scale(.85)" },
  { opacity: 1, transform: "translate(-50%, 0) scale(1)" },
]);

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
  clearMotion(turned, byId("ToiletHey"));
  turned.style.opacity = "0";
  byId("ToiletHey").hidden = true;
}

/** Runs the gag once she's through the door. A later walk-in cancels an unfinished one. */
export async function playToiletPeek() {
  const run = peekRun;
  await wait(TurnRoundDelayMs);
  if (run !== peekRun) {
    return;
  }

  await animate(turnedPhoto(), [{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "scale(1)" }], { duration: TurnRoundMs, easing: Ease.Settle });
  await wait(HeyDelayMs);
  if (run !== peekRun) {
    return;
  }

  sayHey();
}

/** A pop-up from me: "hey!!", like I've just spotted her in the doorway. */
function sayHey() {
  const hey = byId("ToiletHey");
  hey.hidden = false;
  animate(hey, HeyFrames, { duration: TurnRoundMs, easing: Ease.Pop });
}

/** @returns {HTMLElement} the second photo, me turning round */
function turnedPhoto() {
  return byId("ToiletPhotos").querySelector('[data-step="1"]');
}
