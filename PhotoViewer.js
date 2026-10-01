import { Content } from "./Content.js";
import { createPhotoFigure, openSheet, SheetVariant } from "./Sheet.js";

/**
 * Shows the one photo she tapped on the fridge, on its own. The X closes it.
 * @param {number} index
 */
export function openPhotoViewer(index) {
  const photo = Content.Photos[index];
  openSheet({ tag: "", title: "", children: [createPhotoFigure(photo)], variant: SheetVariant.Photo });
}
