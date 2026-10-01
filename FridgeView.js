import { Content } from "./Content.js";
import { byId } from "./Dom.js";
import { renderFridgeParts } from "./FridgeParts.js";
import { animate, clearMotion, Ease } from "./Motion.js";
import { showToast } from "./Toast.js";

const SwingMs = 950;
const LightMs = 700;

// French doors swing out toward her on their outer hinges: left door on its left edge, right on its right.
const LeftSwing = Object.freeze([{ transform: "rotateY(0deg)" }, { transform: "rotateY(-108deg)" }]);
const RightSwing = Object.freeze([{ transform: "rotateY(0deg)" }, { transform: "rotateY(108deg)" }]);
const LightOn = Object.freeze([{ opacity: 0 }, { opacity: 1 }]);

// What can be tapped from the outside (closed) and from the inside (open).
const OutsideIds = Object.freeze(["DoorLeftFront", "DoorRightFront", "FridgeHandle"]);
const InsideIds = Object.freeze(["DoorLeftBack", "DoorRightBack", "FridgeInside"]);

const FridgeState = Object.freeze({ Closed: "Closed", Opening: "Opening", Open: "Open", Closing: "Closing" });
let state = FridgeState.Closed;

/** @type {(text: string) => void} */
let setHint = () => {};

/**
 * @param {{ onHint: (text: string) => void }} options
 */
export function initFridgeView({ onHint }) {
  setHint = onHint;
  renderFridgeParts();
  byId("FridgeHandle").addEventListener("click", openFridge);
  byId("DoorLeftBack").addEventListener("click", closeFridge);
  byId("DoorRightBack").addEventListener("click", closeFridge);
  byId("Crisper").addEventListener("click", () => showToast(Content.House.Toasts.Crisper));
}

/** Called when she walks up to the fridge: it always starts closed. */
export function showClosedFridge() {
  state = FridgeState.Closed;
  clearMotion(byId("DoorLeft"), byId("DoorRight"), byId("FridgeInside"));
  setFacesFor(FridgeState.Closed);
  setHint(Content.House.Rooms.Fridge.HintClosed);
}

/** Both doors swing open together and the fridge light comes on. */
async function openFridge() {
  if (state !== FridgeState.Closed) {
    return;
  }

  state = FridgeState.Opening;
  setFacesFor(FridgeState.Open);
  animate(byId("FridgeInside"), LightOn, { duration: LightMs, easing: Ease.Settle });
  await swingDoors(LeftSwing, RightSwing);
  state = FridgeState.Open;
  setHint(Content.House.Rooms.Fridge.HintOpen);
}

/** Tapping either open door swings both shut. */
async function closeFridge() {
  if (state !== FridgeState.Open) {
    return;
  }

  state = FridgeState.Closing;
  await swingDoors([...LeftSwing].reverse(), [...RightSwing].reverse());
  clearMotion(byId("DoorLeft"), byId("DoorRight"), byId("FridgeInside"));
  setFacesFor(FridgeState.Closed);
  state = FridgeState.Closed;
  setHint(Content.House.Rooms.Fridge.HintClosed);
  byId("FridgeHandle").focus({ preventScroll: true });
}

/**
 * @param {Keyframe[]} left
 * @param {Keyframe[]} right
 * @returns {Promise<void>}
 */
async function swingDoors(left, right) {
  const timing = { duration: SwingMs, easing: Ease.Swing };
  await Promise.all([animate(byId("DoorLeft"), left, timing), animate(byId("DoorRight"), right, timing)]);
}

/**
 * Only the side she can see is tappable: the photos when closed, the inside and the door backs when open.
 * @param {string} doorState one of FridgeState
 */
function setFacesFor(doorState) {
  const isOpen = doorState === FridgeState.Open;
  OutsideIds.forEach((id) => { byId(id).inert = isOpen; });
  // the handle's glowing dot would float over the shelves
  byId("FridgeHandle").hidden = isOpen;
  InsideIds.forEach((id) => { byId(id).inert = !isOpen; });
}
