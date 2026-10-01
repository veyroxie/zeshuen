import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";

/** How the pop-up is laid out: notes with a title, or a single photo on its own. */
export const SheetVariant = Object.freeze({ Notes: "Notes", Photo: "Photo" });

const PhotoClass = "sheet--photo";

/**
 * @typedef {{ tag: string, title: string, children: Node[], variant?: string }} SheetOptions
 */

/** Labels the X for screen readers. */
export function initSheet() {
  byId("SheetClose").setAttribute("aria-label", Content.Ui.SheetClose);
}

/**
 * Fills the one shared pop-up and opens it.
 * @param {SheetOptions} options
 */
export function openSheet({ tag, title, children, variant = SheetVariant.Notes }) {
  const sheet = /** @type {HTMLDialogElement} */ (byId("Sheet"));
  sheet.classList.toggle(PhotoClass, variant === SheetVariant.Photo);
  byId("SheetTag").textContent = tag;
  byId("SheetTitle").textContent = title;
  byId("SheetBody").replaceChildren(...children);
  sheet.showModal();
  sheet.scrollTop = 0;
}

/**
 * Runs once the pop-up is closed: right away if it already is. Toasts wait for this,
 * since anything shown under an open pop-up sits behind its dark backdrop.
 * @param {() => void} callback
 */
export function afterSheetCloses(callback) {
  const sheet = /** @type {HTMLDialogElement} */ (byId("Sheet"));
  if (sheet.open) {
    sheet.addEventListener("close", callback, { once: true });

    return;
  }

  callback();
}

/**
 * @param {string[]} texts
 * @param {string} className
 * @returns {HTMLElement[]}
 */
export function createParagraphs(texts, className) {
  return texts.map((text) => createElement("p", className, text));
}

/**
 * A polaroid-style photo with its caption in her handwriting.
 * @param {import("./Content.js").PhotoContent} photo
 * @returns {HTMLElement}
 */
export function createPhotoFigure(photo) {
  const figure = createElement("figure", "photo");
  const image = /** @type {HTMLImageElement} */ (createElement("img", ""));
  image.src = photo.Src;
  image.alt = photo.Alt;
  image.decoding = "async";
  figure.append(image, createElement("figcaption", "", photo.Caption));

  return figure;
}
