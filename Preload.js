import { RoomId } from "./Rooms.js";

// Only the front door loads up front. After her first knock the rest of the flat
// downloads one room at a time, in the order she's likely to walk; walking into a
// room that isn't ready yet loads it straight away.
const LoadOrder = Object.freeze([
  RoomId.Entryway, RoomId.LivingRoom, RoomId.Kitchen, RoomId.Fridge, RoomId.Bedroom,
  RoomId.MyRoom, RoomId.Bathroom, RoomId.Toilet, RoomId.Lounge,
]);

/** @type {Map<string, { image: HTMLImageElement, src: string }[]>} */
const waiting = new Map();
let hasStarted = false;

/**
 * Remembers an image to load later with its room, instead of right now.
 * @param {HTMLImageElement} image
 * @param {string} src
 * @param {string} roomId one of RoomId
 */
export function deferImage(image, src, roomId) {
  const queue = waiting.get(roomId) ?? [];
  queue.push({ image, src });
  waiting.set(roomId, queue);
}

/** Starts the one-room-at-a-time download (called on the first knock). */
export async function startPreloading() {
  if (hasStarted) {
    return;
  }

  hasStarted = true;
  for (const roomId of LoadOrder) {
    await loadRoom(roomId);
  }
}

/**
 * Loads one room's images now and resolves when they're in.
 * @param {string} roomId one of RoomId
 * @returns {Promise<void>}
 */
export function loadRoom(roomId) {
  const queue = waiting.get(roomId) ?? [];
  waiting.delete(roomId);

  return Promise.all(queue.map(({ image, src }) => load(image, src))).then(() => undefined);
}

/**
 * @param {HTMLImageElement} image
 * @param {string} src
 * @returns {Promise<void>}
 */
function load(image, src) {
  return new Promise((resolve) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => {
      console.warn("Could not load", src);
      resolve();
    }, { once: true });
    image.src = src;
  });
}
