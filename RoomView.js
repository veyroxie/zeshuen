import { Content } from "./Content.js";
import { createElement } from "./Dom.js";
import { ArrowType, HingeType, Rooms } from "./Rooms.js";

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
  // "Behind" exits mean turning around, so they sit in a fixed corner rather than in the photo.
  const turnBacks = room.Spots.filter(isTurnBack).map((spot) => createSpot(spot, onSpot));
  view.append(backdrop, pan, ...turnBacks);

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
  const doors = room.Spots.filter((spot) => spot.Leaf).flatMap((spot) => createDoor(room, spot));
  const inPhoto = room.Spots.filter((spot) => isTurnBack(spot) === false);
  scene.append(createPhoto(room), ...doors, ...inPhoto.map((spot) => createSpot(spot, onSpot)));

  return scene;
}

/**
 * A door in the photo that can swing open: the panel is cut from the room photo so it
 * lines up exactly, and behind it the next room waits, darkened.
 * @param {import("./Rooms.js").RoomLayout} room
 * @param {import("./Rooms.js").SpotLayout} spot
 * @returns {HTMLElement[]} the gap behind, then the panel
 */
function createDoor(room, spot) {
  const gap = createElement("div", "room-gap");
  const leaf = createElement("div", "room-leaf");
  [gap, leaf].forEach((element) => placeRect(element, spot.Leaf));
  gap.style.backgroundImage = `url(${spot.Leaf.Behind ?? Rooms[spot.To].Image})`;
  gap.dataset.gap = spot.Key;
  leaf.dataset.leaf = spot.Key;
  leaf.style.backgroundImage = `url(${room.Image})`;
  leaf.style.backgroundSize = `${(Percent / spot.Leaf.W) * Percent}% ${(Percent / spot.Leaf.H) * Percent}%`;
  leaf.style.backgroundPosition = `${backgroundOffset(spot.Leaf.X, spot.Leaf.W)}% ${backgroundOffset(spot.Leaf.Y, spot.Leaf.H)}%`;
  leaf.style.transformOrigin = spot.Leaf.Hinge === HingeType.Left ? "left center" : "right center";
  [gap, leaf].forEach((element) => { element.style.clipPath = spot.Leaf.Clip ?? "none"; });

  return [gap, leaf];
}

/**
 * @param {HTMLElement} element
 * @param {import("./Rooms.js").LeafLayout} rect
 */
function placeRect(element, rect) {
  Object.assign(element.style, { left: `${rect.X}%`, top: `${rect.Y}%`, width: `${rect.W}%`, height: `${rect.H}%` });
}

/**
 * background-position % that shows the photo's [start, start + size] window in a box that big.
 * @param {number} start percent of the photo
 * @param {number} size percent of the photo
 * @returns {number}
 */
function backgroundOffset(start, size) {
  const leftover = Percent - size;

  return leftover > 0 ? (start / leftover) * Percent : 0;
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
  const button = /** @type {HTMLButtonElement} */ (createElement("button", spotClass(spot)));
  button.type = "button";
  placeSpot(button, spot);
  const label = Content.House.Spots[spot.Key];
  const marker = spot.Arrow ? createElement("span", "spot__arrow", spot.Arrow) : createElement("span", "spot__dot");
  button.append(marker, createElement("span", "spot__label", label));
  button.addEventListener("click", (event) => onSpot(spot, event));

  return button;
}

/**
 * Exits get a doorway tag with an arrow; everything else a glowing dot, labelled on
 * whichever side keeps it on screen.
 * @param {import("./Rooms.js").SpotLayout} spot
 * @returns {string}
 */
function spotClass(spot) {
  if (isTurnBack(spot)) {
    return "spot spot--exit spot--behind";
  }

  if (spot.Arrow) {
    return "spot spot--exit";
  }

  return spot.X >= LabelFlipX ? "spot spot--left" : "spot";
}

/**
 * Pins a spot to its place in the photo; turn-back exits keep their fixed corner instead.
 * @param {HTMLElement} button
 * @param {import("./Rooms.js").SpotLayout} spot
 */
function placeSpot(button, spot) {
  if (isTurnBack(spot)) {
    return;
  }

  button.style.left = `${spot.X}%`;
  button.style.top = `${spot.Y}%`;
}

/**
 * @param {import("./Rooms.js").SpotLayout} spot
 * @returns {boolean}
 */
const isTurnBack = (spot) => spot.Arrow === ArrowType.Behind;

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
