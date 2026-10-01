import { Content } from "./Content.js";
import { byId } from "./Dom.js";
import { initFridgeView, showClosedFridge } from "./FridgeView.js";
import { animate, clearMotion, Ease, wait } from "./Motion.js";
import { centerRoom, buildRooms } from "./RoomView.js";
import { ActionType, HingeType, RoomId } from "./Rooms.js";
import {
  openGuardDogSheet, openLetterSheet, openMirrorSheet, openPianoSheet, openSofaSheet, openWindowSheet,
} from "./SheetContent.js";
import { showToast } from "./Toast.js";

/** Which way the camera moves: in through a doorway, or back out of a close-up. */
export const WalkType = Object.freeze({ Forward: "Forward", Back: "Back" });

const WalkMs = 850;
const ArriveDelayMs = 160;
const CenterOrigin = "50% 55%";
const IsCurrentClass = "is-current";
const LightsOffMs = 1200;
const FirstSpotSelector = ".spot:not([hidden])";
const DoorSwingMs = 1100;
const DoorPauseMs = 250;

// Inner doors swing away from her into the next room, darkening as they turn from the light.
const DoorSwing = Object.freeze({
  [HingeType.Left]: [{ transform: "rotateY(0deg)", filter: "brightness(1)" }, { transform: "rotateY(82deg)", filter: "brightness(.5)" }],
  [HingeType.Right]: [{ transform: "rotateY(0deg)", filter: "brightness(1)" }, { transform: "rotateY(-82deg)", filter: "brightness(.5)" }],
});
const LightsOnMs = 700;

const WalkFrames = Object.freeze({
  [WalkType.Forward]: { Out: ["scale(1)", "scale(1.4)"], In: ["scale(1.12)", "scale(1)"] },
  [WalkType.Back]: { Out: ["scale(1)", "scale(.86)"], In: ["scale(1.25)", "scale(1)"] },
});

const house = { currentId: RoomId.Door, isWalking: false, isSwinging: false, rooms: {} };

/** Builds the rooms, the bar and the fridge, and shows the front door. */
export function initHouse() {
  house.rooms = buildRooms(handleSpot);
  initFridgeView({ onHint: setHint });
  byId("BackLabel").textContent = Content.House.Rooms.Kitchen.Name;
  byId("Back").addEventListener("click", () => walkTo(RoomId.Kitchen, { origin: CenterOrigin, type: WalkType.Back }));
  byId("LightsOn").addEventListener("click", lightsOn);
  setHint(Content.House.Intro.Hint);
}

/**
 * Walks from the current view into another one, like moving through the flat.
 * @param {string} targetId one of RoomId
 * @param {{ origin: string, type: string }} options origin is a CSS transform-origin; type is one of WalkType
 * @returns {Promise<void>}
 */
export async function walkTo(targetId, { origin, type }) {
  const isIgnored = house.isWalking || targetId === house.currentId;
  if (isIgnored) {
    return;
  }

  house.isWalking = true;
  const outgoing = viewFor(house.currentId);
  const incoming = viewFor(targetId);
  prepareArrival(targetId, incoming);
  await crossWalk(outgoing, incoming, origin, WalkFrames[type]);
  house.currentId = targetId;
  house.isWalking = false;
  showChrome(targetId);
  // Keyboard users land on the first thing they can tap in the new room.
  incoming.querySelector(FirstSpotSelector)?.focus({ preventScroll: true });
}

/**
 * @param {HTMLElement} outgoing
 * @param {HTMLElement} incoming
 * @param {string} origin
 * @param {{ Out: string[], In: string[] }} frames
 */
async function crossWalk(outgoing, incoming, origin, frames) {
  outgoing.style.transformOrigin = origin;
  await Promise.all([
    animate(outgoing, [{ transform: frames.Out[0], opacity: 1 }, { transform: frames.Out[1], opacity: 0 }], { duration: WalkMs, easing: Ease.Walk }),
    animate(incoming, [{ transform: frames.In[0], opacity: 0 }, { transform: frames.In[1], opacity: 1 }], { duration: WalkMs, delay: ArriveDelayMs, easing: Ease.Settle }),
  ]);
  outgoing.hidden = true;
  outgoing.classList.remove(IsCurrentClass);
  incoming.classList.add(IsCurrentClass);
  clearMotion(outgoing, incoming);
}

/**
 * @param {string} targetId
 * @param {HTMLElement} incoming
 */
function prepareArrival(targetId, incoming) {
  incoming.hidden = false;
  // Lights out belongs to the bedroom; walking away turns them back on.
  clearMotion(byId("LightsOut"));
  byId("LightsOut").hidden = true;
  if (targetId === RoomId.Fridge) {
    showClosedFridge();

    return;
  }

  centerRoom(house.rooms[targetId]);
}

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function viewFor(id) {
  return house.rooms[id]?.view ?? byId(`${id}View`);
}

/**
 * Shows the bar once she's inside, with the way back only at the fridge.
 * @param {string} id one of RoomId
 */
function showChrome(id) {
  const isFridge = id === RoomId.Fridge;
  byId("Bar").hidden = id === RoomId.Door;
  const hint = isFridge ? Content.House.Rooms.Fridge.HintClosed : Content.House.Rooms[id]?.Hint;
  setHint(hint ?? "");
}

/** @param {string} text */
export function setHint(text) {
  byId("Hint").textContent = text;
}

const SpotActions = Object.freeze({
  [ActionType.Mirror]: openMirrorSheet,
  [ActionType.Window]: openWindowSheet,
  [ActionType.Piano]: openPianoSheet,
  [ActionType.Sofa]: openSofaSheet,
  [ActionType.Letter]: openLetterSheet,
  [ActionType.GuardDog]: openGuardDogSheet,
  [ActionType.LightsOut]: lightsOut,
  [ActionType.Toast]: (spot) => showToast(Content.House.Toasts[spot.Toast]),
  [ActionType.Walk]: (spot, event) => walkTo(spot.To, { origin: originFromTap(event), type: WalkType.Forward }),
  [ActionType.WalkBack]: (spot) => walkTo(spot.To, { origin: CenterOrigin, type: WalkType.Back }),
  [ActionType.Door]: (spot, event) => walkThroughDoor(spot, /** @type {HTMLElement} */ (event.currentTarget)),
});

/**
 * Swings a door in the photo open (the next room glows behind it), then walks through.
 * The door is shut again by the time she comes back.
 * @param {import("./Rooms.js").SpotLayout} spot
 * @param {HTMLElement} button the tapped spot, inside the room's scene
 */
async function walkThroughDoor(spot, button) {
  const isBusy = house.isWalking || house.isSwinging;
  if (isBusy) {
    return;
  }

  house.isSwinging = true;
  const scene = button.closest(".scene");
  const leaf = scene.querySelector(`[data-leaf="${spot.Key}"]`);
  const gap = scene.querySelector(`[data-gap="${spot.Key}"]`);
  animate(gap, [{ opacity: 0 }, { opacity: 1 }], { duration: DoorSwingMs * 0.7, easing: Ease.Settle });
  await animate(leaf, DoorSwing[spot.Leaf.Hinge], { duration: DoorSwingMs, easing: Ease.Swing });
  await wait(DoorPauseMs);
  await walkTo(spot.To, { origin: centerOf(gap), type: WalkType.Forward });
  clearMotion(leaf, gap);
  house.isSwinging = false;
}

/**
 * @param {Element} element
 * @returns {string} its middle on screen, as a CSS transform-origin
 */
function centerOf(element) {
  const box = element.getBoundingClientRect();

  return `${box.left + box.width / 2}px ${box.top + box.height / 2}px`;
}

/**
 * @param {import("./Rooms.js").SpotLayout} spot
 * @param {MouseEvent} event
 */
function handleSpot(spot, event) {
  SpotActions[spot.Action](spot, event);
}

/**
 * The camera walks toward wherever she tapped.
 * @param {MouseEvent} event
 * @returns {string}
 */
function originFromTap(event) {
  return `${event.clientX}px ${event.clientY}px`;
}

function lightsOut() {
  const overlay = byId("LightsOut");
  overlay.hidden = false;
  setHint("");
  animate(overlay, [{ opacity: 0 }, { opacity: 1 }], { duration: LightsOffMs, easing: Ease.Settle });
}

async function lightsOn() {
  const overlay = byId("LightsOut");
  await animate(overlay, [{ opacity: 1 }, { opacity: 0 }], { duration: LightsOnMs, easing: Ease.Settle });
  overlay.hidden = true;
  clearMotion(overlay);
  setHint(Content.House.Rooms.Bedroom.Hint);
}
