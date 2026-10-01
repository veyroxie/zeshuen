import { byId } from "./Dom.js";
import { registerPrepareHook, setHint, walkTo, WalkType } from "./House.js";
import { animate, clearMotion, Ease, wait } from "./Motion.js";
import { centerPan } from "./RoomView.js";
import { RoomId } from "./Rooms.js";

const SwingMs = 1300;
const StepInDelayMs = 350;
// The door panel sits just right of the photo's middle; phones start centred on it.
const DoorFocusX = 53;

// The middle panel swings inward on its right-hand hinge, darkening as it turns away from the light.
const LeafSwing = Object.freeze([
  { transform: "rotateY(0deg)", filter: "brightness(1)" },
  { transform: "rotateY(-84deg)", filter: "brightness(.55)" },
]);
const GapLight = Object.freeze([{ opacity: 0 }, { opacity: 1 }]);

let isOpening = false;

/** Wires the door handle: swing the door, let the warm light out, then step inside. */
export function initFrontDoor() {
  byId("DoorHandle").addEventListener("click", openFrontDoor);
  const center = () => centerPan(byId("DoorPan"), DoorFocusX);
  center();
  window.addEventListener("resize", center);
  registerPrepareHook(RoomId.Door, closeFrontDoor);
}

/** Walking back out (with the phone's back button) finds the door shut again, ready to reopen. */
function closeFrontDoor() {
  clearMotion(byId("DoorLeaf"), byId("DoorGap"));
  byId("DoorHandle").hidden = false;
  isOpening = false;
  centerPan(byId("DoorPan"), DoorFocusX);
}

async function openFrontDoor() {
  if (isOpening) {
    return;
  }

  isOpening = true;
  byId("DoorHandle").hidden = true;
  setHint("");
  animate(byId("DoorGap"), GapLight, { duration: SwingMs * 0.7, easing: Ease.Settle });
  await animate(byId("DoorLeaf"), LeafSwing, { duration: SwingMs, easing: Ease.Swing });
  await wait(StepInDelayMs);
  await walkTo(RoomId.Entryway, { origin: gapCenter(), type: WalkType.Forward });
}

/**
 * Walk toward the middle of the open doorway.
 * @returns {string} a CSS transform-origin in px
 */
function gapCenter() {
  const box = byId("DoorGap").getBoundingClientRect();

  return `${box.left + box.width / 2}px ${box.top + box.height / 2}px`;
}
