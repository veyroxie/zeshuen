import { initBackgroundSong } from "./BackgroundSong.js";
import { Content } from "./Content.js";
import { byId, isMotionReduced } from "./Dom.js";
import { initFridge } from "./Fridge.js";
import { openLetterSheet, openRadioSheet, openRecipeSheet } from "./SheetContent.js";

const ScrollBehavior = Object.freeze({ Smooth: "smooth", Instant: "auto" });

/** Copies simple values from Content into every [data-bind] element. */
function bindText() {
  document.querySelectorAll("[data-bind]").forEach((node) => {
    node.textContent = String(Content[node.dataset.bind] ?? "");
  });
  document.querySelectorAll("[data-bind-ui]").forEach((node) => {
    node.textContent = Content.Ui[node.dataset.bindUi] ?? "";
  });
}

function initHero() {
  byId("Enter").addEventListener("click", () => {
    const behavior = isMotionReduced() ? ScrollBehavior.Instant : ScrollBehavior.Smooth;
    byId("Kitchen").scrollIntoView({ behavior, block: "start" });
  });
}

function initFridgeExtras() {
  byId("Recipe").addEventListener("click", openRecipeSheet);
  byId("Radio").addEventListener("click", openRadioSheet);
  byId("Envelope").addEventListener("click", openLetterSheet);
}

function init() {
  bindText();
  initBackgroundSong(Content.BackgroundSong);
  initHero();
  initFridge();
  initFridgeExtras();
}

init();
