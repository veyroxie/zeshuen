import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { createFruitMagnet } from "./FruitMagnet.js";
import { createJarSvg } from "./JarSvg.js";
import { openPhotoViewer } from "./PhotoViewer.js";
import { openJarSheet } from "./SheetContent.js";

// Photos 1-4 ride on the upper door (so they swing with it); 5-6 sit on the lower door.
// Left/top are % of their door, and every photo stays inside the door's edges.
const UpperSnaps = Object.freeze([
  { Left: 5, Top: 4, Tilt: -4 },
  { Left: 46, Top: 2, Tilt: 3 },
  { Left: 4, Top: 41, Tilt: 2 },
  { Left: 52, Top: 43, Tilt: -3 },
]);

const LowerSnaps = Object.freeze([
  { Left: 6, Top: 8, Tilt: 3 },
  { Left: 52, Top: 12, Tilt: -4 },
]);

// Jam jars standing on the two lit glass shelves, as % of the open-fridge photo.
const JarSpots = Object.freeze([
  { Left: 14.5, Top: 16.4 }, { Left: 25, Top: 16.4 }, { Left: 35.5, Top: 16.4 },
  { Left: 14.5, Top: 28.4 }, { Left: 25, Top: 28.4 }, { Left: 35.5, Top: 28.4 },
]);

/** Sticks the photos on both doors and puts the jars on the shelves. */
export function renderFridgeParts() {
  const upperCount = UpperSnaps.length;
  byId("UpperSnaps").replaceChildren(...UpperSnaps.map((spot, index) => createSnap(spot, index)));
  byId("LowerSnaps").replaceChildren(...LowerSnaps.map((spot, index) => createSnap(spot, index + upperCount)));
  byId("Jars").replaceChildren(...Content.Jars.slice(0, JarSpots.length).map((jar, index) => createJar(jar, JarSpots[index])));
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
  image.src = photo.Src;
  image.alt = "";
  snap.append(createFruitMagnet(index), image);
  snap.addEventListener("click", () => openPhotoViewer(index));

  return snap;
}

/**
 * @param {import("./Content.js").JarContent} jar
 * @param {{ Left: number, Top: number }} spot
 * @returns {HTMLButtonElement}
 */
function createJar(jar, spot) {
  const button = /** @type {HTMLButtonElement} */ (createElement("button", "shelf-jar"));
  button.type = "button";
  button.setAttribute("aria-label", `Open the ${jar.Label} jar`);
  placeAt(button, spot.Left, spot.Top);
  button.append(createJarSvg(jar));
  button.addEventListener("click", () => openJarSheet(jar));

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
