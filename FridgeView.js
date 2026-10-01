import { isBackgroundSongPaused, playBackgroundSong } from "./BackgroundSong.js";
import { Content } from "./Content.js";
import { byId } from "./Dom.js";
import { renderFridgeParts } from "./FridgeParts.js";
import { animate, clearMotion, Ease } from "./Motion.js";
import { showToast } from "./Toast.js";

// The open close-up frames this part of the open-fridge photo (as % of it): the lit shelves
// plus a sliver of the open door, which closes the fridge when tapped.
const OpenPhoto = Object.freeze({ Width: 813, Height: 1600 });
const ShelfRegion = Object.freeze({ X: 6, Y: 6, W: 56, H: 42 });
const Percent = 100;

const SwingOpen = Object.freeze([{ transform: "rotateY(0deg)" }, { transform: "rotateY(78deg)" }]);
const SwingMs = 750;
const CutMs = 450;
const InsideLight = Object.freeze([{ opacity: 0 }, { opacity: 1 }]);

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
  byId("OpenDoorEdge").addEventListener("click", closeFridge);
  byId("Crisper").addEventListener("click", () => showToast(Content.House.Toasts.Crisper));
  window.addEventListener("resize", fitOpenScene);
}

/** Called when she walks up to the fridge: always start with it closed. */
export function showClosedFridge() {
  state = FridgeState.Closed;
  byId("ClosedShot").hidden = false;
  byId("OpenShot").hidden = true;
  byId("ClosedShot").scrollTop = 0;
  clearMotion(byId("FridgeDoor"), byId("FridgeInside"), byId("ClosedShot"), byId("OpenShot"));
  setHint(Content.House.Rooms.Fridge.HintClosed);
}

/** @returns {boolean} */
export const isFridgeOpen = () => state === FridgeState.Open;

/** Door swings out toward her, the light comes on, then the camera cuts in close to the shelves. */
async function openFridge() {
  if (state !== FridgeState.Closed) {
    return;
  }

  state = FridgeState.Opening;
  startSongFromTap();
  animate(byId("FridgeInside"), InsideLight, { duration: SwingMs * 0.6, easing: Ease.Settle });
  await animate(byId("FridgeDoor"), SwingOpen, { duration: SwingMs, easing: Ease.Swing });
  await cutTo(byId("OpenShot"), byId("ClosedShot"));
  state = FridgeState.Open;
  setHint(Content.House.Rooms.Fridge.HintOpen);
}

/** Cut back to the full fridge with the door still open, then swing it shut. */
export async function closeFridge() {
  if (state !== FridgeState.Open) {
    return;
  }

  state = FridgeState.Closing;
  await cutTo(byId("ClosedShot"), byId("OpenShot"));
  const door = byId("FridgeDoor");
  await animate(door, [...SwingOpen].reverse(), { duration: SwingMs, easing: Ease.Swing });
  await animate(byId("FridgeInside"), [...InsideLight].reverse(), { duration: CutMs, easing: Ease.Settle });
  clearMotion(door, byId("FridgeInside"));
  state = FridgeState.Closed;
  setHint(Content.House.Rooms.Fridge.HintClosed);
}

/**
 * Crossfades between the two fridge shots with a slight push, like a camera cut.
 * @param {HTMLElement} incoming
 * @param {HTMLElement} outgoing
 */
async function cutTo(incoming, outgoing) {
  incoming.hidden = false;
  fitOpenScene();
  clearMotion(incoming, outgoing);
  const timing = { duration: CutMs, easing: Ease.Settle };
  await Promise.all([
    animate(incoming, [{ opacity: 0, transform: "scale(1.06)" }, { opacity: 1, transform: "scale(1)" }], timing),
    animate(outgoing, [{ opacity: 1 }, { opacity: 0 }], timing),
  ]);
  outgoing.hidden = true;
  clearMotion(incoming, outgoing);
}

// The song starts on this tap; phones only allow sound inside the tap itself, before any await.
function startSongFromTap() {
  if (isBackgroundSongPaused()) {
    playBackgroundSong();
  }
}

/**
 * Sizes the open-fridge photo so the shelf region fills the screen's height, centred.
 * On a phone that crops the sides a little; on a laptop the rest of the photo shows around it.
 */
function fitOpenScene() {
  const shot = byId("OpenShot");
  const regionWidth = (OpenPhoto.Width * ShelfRegion.W) / Percent;
  const regionHeight = (OpenPhoto.Height * ShelfRegion.H) / Percent;
  const scale = shot.clientHeight / regionHeight;
  const scene = byId("OpenScene");
  scene.style.width = `${OpenPhoto.Width * scale}px`;
  scene.style.height = `${OpenPhoto.Height * scale}px`;
  scene.style.left = `${(shot.clientWidth - regionWidth * scale) / 2 - (OpenPhoto.Width * ShelfRegion.X * scale) / Percent}px`;
  scene.style.top = `${(shot.clientHeight - regionHeight * scale) / 2 - (OpenPhoto.Height * ShelfRegion.Y * scale) / Percent}px`;
}
