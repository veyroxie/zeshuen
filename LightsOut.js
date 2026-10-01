import { Content } from "./Content.js";
import { byId } from "./Dom.js";
import { animate, clearMotion, Ease } from "./Motion.js";
import { playClick } from "./Sound.js";
import { playVoice } from "./Voice.js";

// The bedroom light switch is the ending: the room goes dark, "best before: never".
const LightsOffMs = 1200;
const LightsOnMs = 700;

const lights = { isInBedroom: () => false, onHint: (/** @type {string} */ text) => text };

/**
 * @param {{ isInBedroom: () => boolean, onHint: (text: string) => void }} options
 */
export function initLightsOut({ isInBedroom, onHint }) {
  Object.assign(lights, { isInBedroom, onHint });
  byId("LightsOn").addEventListener("click", lightsOn);
}

export function lightsOut() {
  playClick();
  playVoice("Goodnight");
  const overlay = byId("LightsOut");
  overlay.hidden = false;
  lights.onHint("");
  animate(overlay, [{ opacity: 0 }, { opacity: 1 }], { duration: LightsOffMs, easing: Ease.Settle });
}

async function lightsOn() {
  playClick();
  const overlay = byId("LightsOut");
  await animate(overlay, [{ opacity: 1 }, { opacity: 0 }], { duration: LightsOnMs, easing: Ease.Settle });
  overlay.hidden = true;
  clearMotion(overlay);
  // she may have walked off while it faded
  if (lights.isInBedroom()) {
    lights.onHint(Content.House.Rooms.Bedroom.Hint);
  }
}
