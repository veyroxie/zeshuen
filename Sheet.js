import { byId, createElement } from "./Dom.js";

/**
 * @typedef {{ tag: string, title: string, children: Node[] }} SheetOptions
 */

/**
 * Fills the one shared pop-up and opens it.
 * @param {SheetOptions} options
 */
export function openSheet({ tag, title, children }) {
  const sheet = /** @type {HTMLDialogElement} */ (byId("Sheet"));
  byId("SheetTag").textContent = tag;
  byId("SheetTitle").textContent = title;
  byId("SheetBody").replaceChildren(...children);
  sheet.showModal();
  sheet.scrollTop = 0;
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
