import { isBackgroundSongPaused, onBackgroundSongChange, playBackgroundSong } from "./BackgroundSong.js";
import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { createFruitMagnet } from "./FruitMagnet.js";
import { createJarSvg, HoneyFlavour } from "./JarSvg.js";
import { openPhotoViewer } from "./PhotoViewer.js";
import { openHoneySheet, openJarSheet } from "./SheetContent.js";

const IsOpenClass = "is-open";
const IsPlayingClass = "is-playing";
const InertSelector = "[inert]";
const EnvelopeSelector = "#Envelope";
const ToastSelector = ".toast";
const DoorState = Object.freeze({ Open: "Open", Closed: "Closed" });
const HoneyLabel = "honey";
const JarsPerShelf = 3;
const ToastMs = 2600;
const RecipeMagnetIndex = 2;

// Where each photo is stuck on the door: left and top as % of the door, and its tilt.
const SnapSpots = Object.freeze([
  { Left: "6%", Top: "3%", Tilt: "-5deg" },
  { Left: "54%", Top: "5%", Tilt: "4deg" },
  { Left: "4%", Top: "35%", Tilt: "3deg" },
  { Left: "52%", Top: "37%", Tilt: "-4deg" },
  { Left: "9%", Top: "67%", Tilt: "-2deg" },
  { Left: "54%", Top: "66%", Tilt: "5deg" },
]);

/** Fills the fridge and wires its door, handle and crisper. */
export function initFridge() {
  renderShelves();
  renderSnaps();
  byId("Recipe").prepend(createFruitMagnet(RecipeMagnetIndex));
  byId("Handle").addEventListener("click", openDoor);
  byId("ToggleDoor").addEventListener("click", toggleDoor);
  byId("DoorBack").addEventListener("click", closeFromDoorBack);
  byId("Crisper").addEventListener("click", showCrisperNote);
  // The radio's power light follows the song.
  onBackgroundSongChange((isPlaying) => byId("Radio").classList.toggle(IsPlayingClass, isPlaying));
  showDoorState(DoorState.Closed);
}

/** @returns {boolean} */
const isDoorClosed = () => byId("Kitchen").classList.contains(IsOpenClass) === false;

/** Opening starts the song: the tap counts as permission to play sound. */
function openDoor() {
  showDoorState(DoorState.Open);
  if (isBackgroundSongPaused()) {
    playBackgroundSong();
  }
}

function closeDoor() {
  showDoorState(DoorState.Closed);
}

function toggleDoor() {
  if (isDoorClosed()) {
    openDoor();

    return;
  }

  closeDoor();
}

/**
 * Swings the door and makes only the reachable side tappable.
 * @param {string} state one of DoorState
 */
function showDoorState(state) {
  const isOpen = state === DoorState.Open;
  byId("Kitchen").classList.toggle(IsOpenClass, isOpen);
  byId("Interior").inert = !isOpen;
  byId("DoorBack").inert = !isOpen;
  byId("DoorFront").inert = isOpen;
  byId("ToggleDoor").textContent = isOpen ? Content.Ui.CloseDoor : Content.Ui.OpenDoor;
  byId("ToggleDoor").setAttribute("aria-expanded", String(isOpen));
  byId("Hint").textContent = isOpen ? Content.Ui.HintOpen : Content.Ui.HintClosed;
  rescueFocus();
}

/** If the focused control just became inert (the handle, the inside of the door), move focus to the toggle. */
function rescueFocus() {
  const focused = document.activeElement;
  const isStranded = focused instanceof Element && focused.closest(InertSelector) !== null;
  if (isStranded) {
    byId("ToggleDoor").focus({ preventScroll: true });
  }
}

/**
 * Tapping the open door swings it shut, unless she tapped the letter in it.
 * @param {MouseEvent} event
 */
function closeFromDoorBack(event) {
  const isEnvelope = event.target instanceof Element && event.target.closest(EnvelopeSelector) !== null;
  if (isEnvelope) {
    return;
  }

  closeDoor();
}

function renderShelves() {
  const honey = createJarButton({ Flavour: HoneyFlavour, Label: HoneyLabel }, openHoneySheet, "jar jar--honey");
  byId("ShelfTop").replaceChildren(honey);
  const jamJars = Content.Jars.map((jar) => createJarButton(jar, () => openJarSheet(jar), "jar"));
  byId("ShelfMiddle").replaceChildren(...jamJars.slice(0, JarsPerShelf));
  byId("ShelfBottom").replaceChildren(...jamJars.slice(JarsPerShelf));
}

/**
 * @param {{ Flavour: string, Label: string }} jar
 * @param {() => void} onOpen
 * @param {string} className
 * @returns {HTMLButtonElement}
 */
function createJarButton(jar, onOpen, className) {
  const button = /** @type {HTMLButtonElement} */ (createElement("button", className));
  button.type = "button";
  button.setAttribute("aria-label", `Open the ${jar.Label} jar`);
  button.append(createJarSvg(jar));
  button.addEventListener("click", onOpen);

  return button;
}

function renderSnaps() {
  const snaps = Content.Photos.slice(0, SnapSpots.length).map((photo, index) => createSnap(photo, index));
  byId("Snaps").replaceChildren(...snaps);
}

/**
 * A photo stuck to the door with a fruit magnet; tapping it opens the viewer there.
 * @param {import("./Content.js").PhotoContent} photo
 * @param {number} index
 * @returns {HTMLButtonElement}
 */
function createSnap(photo, index) {
  const spot = SnapSpots[index];
  const snap = /** @type {HTMLButtonElement} */ (createElement("button", "snap"));
  snap.type = "button";
  snap.setAttribute("aria-label", `Look at the photo: ${photo.Caption}`);
  Object.assign(snap.style, { left: spot.Left, top: spot.Top });
  snap.style.setProperty("--tilt", spot.Tilt);
  const image = /** @type {HTMLImageElement} */ (createElement("img", ""));
  image.src = photo.Src;
  image.alt = "";
  snap.append(createFruitMagnet(index), image);
  snap.addEventListener("click", () => openPhotoViewer(index));

  return snap;
}

function showCrisperNote() {
  const crisper = byId("Crisper");
  crisper.querySelector(ToastSelector)?.remove();
  const toast = createElement("span", "toast", Content.Ui.Crisper);
  toast.setAttribute("role", "status");
  crisper.append(toast);
  window.setTimeout(() => toast.remove(), ToastMs);
}
