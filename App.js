import { initBackgroundSong } from "./BackgroundSong.js";
import { Content } from "./Content.js";
import { initFrontDoor } from "./FrontDoor.js";
import { initFullscreen } from "./Fullscreen.js";
import { initHouse } from "./House.js";
import { initSheet } from "./Sheet.js";

// [data-bind-*] attribute → where its words live in Content.
const TextSources = Object.freeze({
  bind: Content,
  bindUi: Content.Ui,
  bindHouse: Content.House.Intro,
  bindSpot: Content.House.Spots,
  bindSticker: Content.House.Stickers,
  bindLights: Content.House.LightsOut,
  bindToast: Content.House.Toasts,
  bindSide: Content.Side,
});

/** Fills every [data-bind-*] element from Content, so all the words stay in one file. */
function bindText() {
  Object.entries(TextSources).forEach(([datasetKey, source]) => {
    const attribute = `data-${datasetKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    document.querySelectorAll(`[${attribute}]`).forEach((node) => {
      node.textContent = String(source[node.dataset[datasetKey]] ?? "");
    });
  });
}

function init() {
  bindText();
  initSheet();
  initBackgroundSong(Content.BackgroundSong);
  initHouse();
  initFrontDoor();
  initFullscreen();
}

init();
