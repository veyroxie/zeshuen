import { Content } from "./Content.js";
import { byId } from "./Dom.js";
import { initFridgeView, showClosedFridge } from "./FridgeView.js";
import { onBackgroundSongChange } from "./BackgroundSong.js";
import { animate, clearMotion, Ease, wait } from "./Motion.js";
import { centerRoom, buildRooms } from "./RoomView.js";
import { ActionType, HingeType, RoomId } from "./Rooms.js";
import { initJarHunt } from "./JarHunt.js";
import { initWindowViews } from "./WindowViews.js";
import { loadRoom } from "./Preload.js";
import { completeRadioMission, missionHint, showMission } from "./Mission.js";
import {
  openGuardDogSheet, openLetterSheet, openLoungeSheet, openMirrorSheet, openRadioSheet, openSofaSheet, openWindowSheet,
} from "./SheetContent.js";
import { initLightsOut, lightsOut } from "./LightsOut.js";
import { playClick, playCreak, playTap } from "./Sound.js";
import { afterSheetCloses } from "./Sheet.js";
import { showToast } from "./Toast.js";
import { initToiletView, resetToiletPeek } from "./ToiletView.js";

/** Which way the camera moves: in through a doorway, or back out of a close-up. */
export const WalkType = Object.freeze({ Forward: "Forward", Back: "Back" });

/** Whether a walk adds a step to the browser history (so the phone's back button retraces it). */
const HistoryMode = Object.freeze({ Push: "Push", Skip: "Skip" });

const WalkMs = 850;
const ArriveDelayMs = 160;
const CenterOrigin = "50% 55%";
const IsCurrentClass = "is-current";
const FirstSpotSelector = ".spot:not([hidden])";
const DoorSwingMs = 1100;
const FreshHintClass = "is-fresh";
const DoorPauseMs = 250;

// Inner doors swing away from her into the next room, darkening as they turn from the light.
const DoorSwing = Object.freeze({
  [HingeType.Left]: [{ transform: "rotateY(0deg)", filter: "brightness(1)" }, { transform: "rotateY(82deg)", filter: "brightness(.5)" }],
  [HingeType.Right]: [{ transform: "rotateY(0deg)", filter: "brightness(1)" }, { transform: "rotateY(-82deg)", filter: "brightness(.5)" }],
});

const WalkFrames = Object.freeze({
  [WalkType.Forward]: { Out: ["scale(1)", "scale(1.4)"], In: ["scale(1.12)", "scale(1)"] },
  [WalkType.Back]: { Out: ["scale(1)", "scale(.86)"], In: ["scale(1.25)", "scale(1)"] },
});

let isUsingKeyboard = false;
window.addEventListener("keydown", () => { isUsingKeyboard = true; });
window.addEventListener("pointerdown", () => { isUsingKeyboard = false; });

const house = { currentId: RoomId.Door, isWalking: false, isSwinging: false, rooms: {} };

/** Builds the rooms, the bar and the fridge, and shows the front door. */
export function initHouse() {
  house.rooms = buildRooms(handleSpot);
  initJarHunt();
  initWindowViews();
  initFridgeView({ onHint: setHint });
  initToiletView();
  // The radio's power light follows the song.
  onBackgroundSongChange((isPlaying) => {
    document.querySelectorAll('[data-prop="Radio"]').forEach((radio) => radio.classList.toggle("is-playing", isPlaying));
  });
  byId("ToiletBackLabel").textContent = `${Content.House.BackTo} ${Content.House.Rooms.Bathroom.Name}`;
  byId("ToiletBack").addEventListener("click", () => walkTo(RoomId.Bathroom, { origin: CenterOrigin, type: WalkType.Back }));
  byId("BackLabel").textContent = `${Content.House.BackTo} ${Content.House.Rooms.Kitchen.Name}`;
  byId("Back").addEventListener("click", () => walkTo(RoomId.Kitchen, { origin: CenterOrigin, type: WalkType.Back }));
  initLightsOut({ isInBedroom: () => house.currentId === RoomId.Bedroom, onHint: setHint });
  setHint(Content.House.Intro.Hint);
  // The phone's back button walks back through the flat instead of leaving the site.
  history.replaceState({ room: RoomId.Door }, "");
  window.addEventListener("popstate", walkBackInHistory);
  window.addEventListener("resize", recenterCurrentRoom);
}

/**
 * Lets another module reset its view before she walks into it (e.g. the front door closing again).
 * @param {string} roomId one of RoomId
 * @param {() => void} prepare
 */
export function registerPrepareHook(roomId, prepare) {
  PrepareHooks.set(roomId, prepare);
}

/** @param {PopStateEvent} event */
function walkBackInHistory(event) {
  const sheet = /** @type {HTMLDialogElement} */ (byId("Sheet"));
  const isBusy = sheet.open || house.isWalking || house.isSwinging;
  if (isBusy) {
    // back closes a pop-up first, and never interrupts a walk
    sheet.close();
    history.pushState({ room: house.currentId }, "");

    return;
  }

  const target = event.state?.room ?? RoomId.Door;
  walkTo(target, { origin: CenterOrigin, type: WalkType.Back, history: HistoryMode.Skip });
}

/** Rotating the phone re-centres the room on its main spot. */
function recenterCurrentRoom() {
  const built = house.rooms[house.currentId];
  if (built) {
    centerRoom(built);
  }
}

/**
 * Walks from the current view into another one, like moving through the flat.
 * @param {string} targetId one of RoomId
 * @param {{ origin: string, type: string, history?: string }} options origin is a CSS transform-origin;
 *   type is one of WalkType; history is one of HistoryMode (pushes a step by default)
 * @returns {Promise<void>}
 */
export async function walkTo(targetId, { origin, type, history: historyMode = HistoryMode.Push }) {
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
  if (historyMode === HistoryMode.Push) {
    history.pushState({ room: targetId }, "");
  }

  showChrome(targetId);
  ArrivedHooks[targetId]?.();
  // Keyboard users land on the first thing they can tap in the new room (touch users don't need the ring).
  if (isUsingKeyboard) {
    incoming.querySelector(FirstSpotSelector)?.focus({ preventScroll: true });
  }
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
    // "both" holds the first frame through the delay, so the next room doesn't flash in at full opacity
    animate(incoming, [{ transform: frames.In[0], opacity: 0 }, { transform: frames.In[1], opacity: 1 }], { duration: WalkMs, delay: ArriveDelayMs, easing: Ease.Settle, fill: "both" }),
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
  // jump the queue if she gets here before this room has downloaded
  loadRoom(targetId);
  incoming.hidden = false;
  // Lights out belongs to the bedroom; walking away turns them back on.
  clearMotion(byId("LightsOut"));
  byId("LightsOut").hidden = true;
  const prepare = PrepareHooks.get(targetId) ?? (() => centerRoom(house.rooms[targetId]));
  prepare();
}

// Views that aren't photo rooms set themselves up before she walks in, and the toilet's running tap plays once she's there.
const PrepareHooks = new Map([
  [RoomId.Fridge, showClosedFridge],
  [RoomId.Toilet, resetToiletPeek],
]);

const ArrivedHooks = Object.freeze({
  [RoomId.Toilet]: playTap,
});

// Some notes come with a little sound.
const ToastSounds = Object.freeze({
  Sink: playTap,
  Lamp: playClick,
});

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function viewFor(id) {
  return house.rooms[id]?.view ?? byId(`${id}View`);
}

/**
 * Shows the bar once she's inside, sets the room's hint and lights up the current mission.
 * @param {string} id one of RoomId
 */
function showChrome(id) {
  const isFridge = id === RoomId.Fridge;
  byId("Bar").hidden = id === RoomId.Door;
  const roomHint = isFridge ? Content.House.Rooms.Fridge.HintClosed : Content.House.Rooms[id]?.Hint;
  setHint(missionHint(id) ?? roomHint ?? "");
  showMission();
}

/** @param {string} text */
export function setHint(text) {
  const hint = byId("Hint");
  hint.textContent = text;
  // restart the fade so each new hint gets its few seconds
  hint.classList.remove(FreshHintClass);
  void hint.offsetWidth;
  hint.classList.add(FreshHintClass);
}

const SpotActions = Object.freeze({
  [ActionType.Mirror]: openMirrorSheet,
  [ActionType.Window]: openWindowSheet,
  [ActionType.Radio]: () => {
    openRadioSheet();
    completeRadioMission();
    // once she closes it, the hint and the glow move on to the kitchen
    afterSheetCloses(() => showChrome(house.currentId));
  },
  [ActionType.Sofa]: openSofaSheet,
  [ActionType.Letter]: openLetterSheet,
  [ActionType.GuardDog]: openGuardDogSheet,
  [ActionType.LightsOut]: lightsOut,
  [ActionType.Lounge]: openLoungeSheet,
  [ActionType.Toast]: (spot) => {
    ToastSounds[spot.Toast]?.();
    showToast(Content.House.Toasts[spot.Toast]);
  },
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
  playCreak();
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
  // a door mid-swing is about to walk her through it
  if (house.isSwinging) {
    return;
  }

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
