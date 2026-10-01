import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { createJarSvg } from "./JarSvg.js";
import { RoomId } from "./Rooms.js";
import { afterSheetCloses } from "./Sheet.js";
import { openJarSheet } from "./SheetContent.js";
import { playFound } from "./Sound.js";
import { showToast } from "./Toast.js";

// Three jars stay in the fridge; the other three ran off around the flat. Find all six
// before they spoil, and the secret lounge opens. Progress is kept between visits.
export const FridgeJarCount = 3;

const StorageKey = "Alyesa.JarsFound";
const SecretSpotSelector = '[data-spot="ToLounge"]';
const AllFoundDelayMs = 900;

// Where the runaway jars hide, as % of each room photo (index into Content.Jars).
const HiddenJars = Object.freeze([
  { Room: RoomId.LivingRoom, Index: 3, X: 52.5, Y: 44.5, W: 4.5 },
  { Room: RoomId.Bathroom, Index: 4, X: 58.5, Y: 73.5, W: 4.5 },
  { Room: RoomId.Bedroom, Index: 5, X: 9, Y: 58.5, W: 5 },
]);

/** @type {Set<number>} */
const found = readFound();

/** @type {() => void} */
let onAllFound = () => {};

/**
 * Hides the runaway jars in their rooms and shows progress so far.
 * @param {{ onAllFound: () => void }} options onAllFound runs once she closes the last jar
 */
export function initJarHunt(options) {
  onAllFound = options.onAllFound;
  HiddenJars.forEach((hidden) => {
    const scene = byId(`${hidden.Room}View`).querySelector(".scene");
    scene.append(createHiddenJar(hidden));
  });
  showProgress();
}

/**
 * Called whenever she opens a jar, in the fridge or around the flat.
 * @param {number} index into Content.Jars
 */
export function markJarFound(index) {
  const isNew = found.has(index) === false;
  found.add(index);
  saveFound();
  showProgress();
  if (isNew) {
    celebrate();
  }
}

/** @returns {boolean} she's opened at least one jar, so she knows the mission */
export const hasStartedHunt = () => found.size > 0;

/** @returns {boolean} */
export const isLoungeOpen = () => found.size >= Content.Jars.length;

/**
 * @param {{ Index: number, X: number, Y: number, W: number }} hidden
 * @returns {HTMLButtonElement}
 */
function createHiddenJar(hidden) {
  const jar = Content.Jars[hidden.Index];
  const button = /** @type {HTMLButtonElement} */ (createElement("button", "hidden-jar"));
  button.type = "button";
  button.setAttribute("aria-label", `A jar: ${jar.Label}`);
  Object.assign(button.style, { left: `${hidden.X}%`, top: `${hidden.Y}%`, width: `${hidden.W}%` });
  button.append(createJarSvg(jar));
  button.addEventListener("click", () => {
    openJarSheet(jar);
    markJarFound(hidden.Index);
  });

  return button;
}

/** The pop sounds now; the note waits until she closes the jar, so she actually sees it. */
function celebrate() {
  playFound();
  if (isLoungeOpen()) {
    afterSheetCloses(() => {
      onAllFound();
      window.setTimeout(() => showToast(Content.House.Toasts.AllJars), AllFoundDelayMs);
    });

    return;
  }

  afterSheetCloses(() => showToast(fill(Content.House.Toasts.JarFound)));
}

function showProgress() {
  const counter = byId("JarCounter");
  counter.hidden = found.size === 0;
  counter.textContent = fill(Content.House.JarCounter);
  document.querySelectorAll(SecretSpotSelector).forEach((spot) => { spot.hidden = isLoungeOpen() === false; });
}

/**
 * @param {string} template with {found} and {total}
 * @returns {string}
 */
function fill(template) {
  return template.replace("{found}", String(found.size)).replace("{total}", String(Content.Jars.length));
}

/** @returns {Set<number>} */
function readFound() {
  try {
    const saved = JSON.parse(localStorage.getItem(StorageKey) ?? "[]");

    return new Set(Array.isArray(saved) ? saved.filter(Number.isInteger) : []);
  } catch (error) {
    console.warn("Could not read found jars:", error);

    return new Set();
  }
}

function saveFound() {
  try {
    localStorage.setItem(StorageKey, JSON.stringify([...found]));
  } catch (error) {
    console.warn("Could not save found jars:", error);
  }
}
