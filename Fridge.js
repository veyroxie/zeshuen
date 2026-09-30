import { byId, createElement } from "./Dom.js";

const IsLiftedClass = "is-lifted";
// Magnet colours cycle through the jam palette so no two neighbours match.
const MagnetColours = Object.freeze(["#D6455B", "#F2C94C", "#5B6BB5", "#9DB38A", "#F2A65A"]);

/**
 * @param {import("./Content.js").PhotoContent} photo
 * @param {string} className
 * @returns {HTMLElement}
 */
export function createPolaroid(photo, className) {
  const figure = createElement("figure", className);
  const image = document.createElement("img");
  image.src = photo.Src;
  image.alt = photo.Alt;
  image.loading = "lazy";
  image.decoding = "async";
  figure.append(image, createElement("figcaption", "", photo.Caption));

  return figure;
}

/**
 * Pins every photo to the fridge door. Tapping one lifts it to the front.
 * @param {import("./Content.js").PhotoContent[]} photos
 */
export function renderFridge(photos) {
  const list = byId("FridgePhotos");
  photos.forEach((photo, index) => {
    const item = createElement("li", "fridge__item");
    const button = createElement("button", "fridge__photo");
    button.type = "button";
    button.style.setProperty("--magnet", MagnetColours[index % MagnetColours.length]);
    button.append(createPolaroid(photo, "polaroid polaroid--magnet"));
    button.addEventListener("click", () => liftPhoto(list, button));
    item.append(button);
    list.append(item);
  });
}

/**
 * @param {HTMLElement} list
 * @param {HTMLElement} button
 */
function liftPhoto(list, button) {
  const isAlreadyLifted = button.classList.contains(IsLiftedClass);
  list.querySelectorAll(`.${IsLiftedClass}`).forEach((photo) => photo.classList.remove(IsLiftedClass));
  button.classList.toggle(IsLiftedClass, !isAlreadyLifted);
}
