import { Content } from "./Content.js";
import { createElement } from "./Dom.js";
import { Rooms } from "./Rooms.js";

const Percent = 100;
// Spots right of the middle put their label on the left so it stays on screen.
const LabelFlipX = 50;

/**
 * @typedef {{ view: HTMLElement, pan: HTMLElement, room: import("./Rooms.js").RoomLayout }} BuiltRoom
 */

/**
 * Builds every room as a hidden full-screen view: a blurred backdrop, the photo in a
 * sideways-scrollable pan, and the tappable spots laid on top of the photo.
 * @param {(spot: import("./Rooms.js").SpotLayout, event: MouseEvent) => void} onSpot
 * @returns {Record<string, BuiltRoom>}
 */
export function buildRooms(onSpot) {
  const container = document.getElementById("Rooms");
  const built = {};
  Object.values(Rooms).forEach((room) => {
    built[room.Id] = buildRoom(room, onSpot);
    container.append(built[room.Id].view);
  });

  return built;
}

/**
 * @param {import("./Rooms.js").RoomLayout} room
 * @param {(spot: import("./Rooms.js").SpotLayout, event: MouseEvent) => void} onSpot
 * @returns {BuiltRoom}
 */
function buildRoom(room, onSpot) {
  const view = createElement("section", "view");
  view.id = `${room.Id}View`;
  view.hidden = true;
  view.setAttribute("aria-label", Content.House.Rooms[room.Id].Name);
  const backdrop = createElement("div", "view__backdrop");
  backdrop.style.backgroundImage = `url(${room.Image})`;
  const pan = createElement("div", "pan");
  pan.append(createScene(room, onSpot));
  view.append(backdrop, pan);

  return { view, pan, room };
}

/**
 * The photo at its own aspect ratio, with the spots on top.
 * @param {import("./Rooms.js").RoomLayout} room
 * @param {(spot: import("./Rooms.js").SpotLayout, event: MouseEvent) => void} onSpot
 * @returns {HTMLElement}
 */
function createScene(room, onSpot) {
  const scene = createElement("div", "scene");
  scene.style.setProperty("--ratio", `${room.Width} / ${room.Height}`);
  scene.append(createPhoto(room), ...room.Spots.map((spot) => createSpot(spot, onSpot)));

  return scene;
}

/**
 * @param {import("./Rooms.js").RoomLayout} room
 * @returns {HTMLImageElement}
 */
function createPhoto(room) {
  const image = /** @type {HTMLImageElement} */ (createElement("img", "scene__photo"));
  image.src = room.Image;
  image.alt = `Our ${Content.House.Rooms[room.Id].Name}`;
  image.decoding = "async";

  return image;
}

/**
 * A soft glowing dot with a handwritten label, placed on the photo.
 * @param {import("./Rooms.js").SpotLayout} spot
 * @param {(spot: import("./Rooms.js").SpotLayout, event: MouseEvent) => void} onSpot
 * @returns {HTMLButtonElement}
 */
function createSpot(spot, onSpot) {
  const sideClass = spot.X >= LabelFlipX ? "spot spot--left" : "spot";
  const button = /** @type {HTMLButtonElement} */ (createElement("button", sideClass));
  button.type = "button";
  button.style.left = `${spot.X}%`;
  button.style.top = `${spot.Y}%`;
  button.append(createElement("span", "spot__dot"), createElement("span", "spot__label", Content.House.Spots[spot.Key]));
  button.addEventListener("click", (event) => onSpot(spot, event));

  return button;
}

/**
 * Scrolls a room's pan so the photo's focus point sits in the middle of the screen.
 * @param {BuiltRoom} built
 */
export function centerRoom(built) {
  centerPan(built.pan, built.room.FocusX);
}

/**
 * @param {HTMLElement} pan
 * @param {number} focusX percent across the photo
 */
export function centerPan(pan, focusX) {
  const target = (pan.scrollWidth * focusX) / Percent - pan.clientWidth / 2;
  pan.scrollLeft = Math.max(0, target);
}
