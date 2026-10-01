import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { animate, clearMotion, Ease, wait } from "./Motion.js";
import { deferImage } from "./Preload.js";
import { RoomId } from "./Rooms.js";
import { playVoice } from "./Voice.js";

// She walks in on me at the sink; she taps my shoulder and I turn round mid-brush.
const TurnRoundMs = 450;
const HeyDelayMs = 250;
const HeyFrames = Object.freeze([
  { opacity: 0, transform: "translate(-50%, 12px) scale(.85)" },
  { opacity: 1, transform: "translate(-50%, 0) scale(1)" },
]);

/** Puts both photos in place; only the first shows until she taps my shoulder. */
export function initToiletView() {
  const photos = Content.ToiletPhotos.map((photo, index) => {
    const image = /** @type {HTMLImageElement} */ (createElement("img", "toilet__photo"));
    deferImage(image, photo.Src, RoomId.Toilet);
    image.alt = photo.Alt;
    image.dataset.step = String(index);

    return image;
  });
  byId("ToiletPhotos").replaceChildren(...photos);
  byId("ToiletShoulder").addEventListener("click", turnRound);
}

/** Back to the first photo, ready for the next time she opens the door. */
export function resetToiletPeek() {
  const turned = turnedPhoto();
  clearMotion(turned, byId("ToiletHey"));
  turned.style.opacity = "0";
  byId("ToiletHey").hidden = true;
  byId("ToiletShoulder").hidden = false;
}

/** I turn round and say hey. The voice note starts on her tap, since phones block sound that doesn't. */
async function turnRound() {
  byId("ToiletShoulder").hidden = true;
  playVoice("Toilet");
  await animate(turnedPhoto(), [{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "scale(1)" }], { duration: TurnRoundMs, easing: Ease.Settle });
  await wait(HeyDelayMs);
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
