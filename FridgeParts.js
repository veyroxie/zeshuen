import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { createFruitMagnet } from "./FruitMagnet.js";
import { createJarSvg } from "./JarSvg.js";
import { openPhotoViewer } from "./PhotoViewer.js";
import { deferImage } from "./Preload.js";
import { RoomId } from "./Rooms.js";
import { FridgeJarCount, markJarFound } from "./JarHunt.js";
import { openJarSheet } from "./SheetContent.js";

// Three photos per French door, as % of that door. The handles sit by the middle seam
// (the left door's right edge, the right door's left edge), so photos keep to the outer side.
const LeftDoorSnaps = Object.freeze([
  { Left: 6, Top: 3, Tilt: -4 },
  { Left: 14, Top: 35, Tilt: 3 },
  { Left: 5, Top: 67, Tilt: -2 },
]);

const RightDoorSnaps = Object.freeze([
  { Left: 40, Top: 5, Tilt: 3 },
  { Left: 33, Top: 37, Tilt: -3 },
  { Left: 42, Top: 68, Tilt: 4 },
]);

// Jars standing on the two glass shelves, as % of the inside of the fridge.
const JarSpots = Object.freeze([
  { Left: 8.5, Top: 13.8 }, { Left: 37.5, Top: 13.8 }, { Left: 66.5, Top: 13.8 },
  { Left: 8.5, Top: 47.8 }, { Left: 37.5, Top: 47.8 }, { Left: 66.5, Top: 47.8 },
]);

/** Sticks the photos on both doors and puts the jars on the shelves. */
export function renderFridgeParts() {
  const rightStart = LeftDoorSnaps.length;
  byId("SnapsLeft").replaceChildren(...LeftDoorSnaps.map((spot, index) => createSnap(spot, index)));
  byId("SnapsRight").replaceChildren(...RightDoorSnaps.map((spot, index) => createSnap(spot, index + rightStart)));
  const jars = Content.Jars.slice(0, FridgeJarCount).map((jar, index) => createJar(jar, JarSpots[index], index));
  byId("Jars").replaceChildren(...jars);
}

/**
 * A photo held on by a fruit magnet; tapping it opens the one-at-a-time viewer there.
 * @param {{ Left: number, Top: number, Tilt: number }} spot
 * @param {number} index
 * @returns {HTMLButtonElement}
 */
function createSnap(spot, index) {
  const photo = Content.Photos[index];
  const snap = /** @type {HTMLButtonElement} */ (createElement("button", "snap"));
  snap.type = "button";
  snap.setAttribute("aria-label", `Look at the photo: ${photo.Caption}`);
  placeAt(snap, spot.Left, spot.Top);
  snap.style.setProperty("--tilt", `${spot.Tilt}deg`);
  const image = /** @type {HTMLImageElement} */ (createElement("img", ""));
  deferImage(image, photo.Src, RoomId.Fridge);
  image.alt = "";
  snap.append(createFruitMagnet(index), image);
  snap.addEventListener("click", () => openPhotoViewer(index));

  return snap;
}

/**
 * @param {import("./Content.js").JarContent} jar
 * @param {{ Left: number, Top: number }} spot
 * @param {number} index into Content.Jars
 * @returns {HTMLButtonElement}
 */
function createJar(jar, spot, index) {
  const button = /** @type {HTMLButtonElement} */ (createElement("button", "shelf-jar"));
  button.type = "button";
  button.setAttribute("aria-label", `Open the ${jar.Label} jar`);
  placeAt(button, spot.Left, spot.Top);
  button.append(createJarSvg(jar));
  button.addEventListener("click", () => {
    openJarSheet(jar);
    markJarFound(index);
  });

  return button;
}

/**
 * @param {HTMLElement} element
 * @param {number} left percent
 * @param {number} top percent
 */
function placeAt(element, left, top) {
  element.style.left = `${left}%`;
  element.style.top = `${top}%`;
}
