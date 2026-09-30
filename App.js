import { initBackgroundSong, startBackgroundSong } from "./BackgroundSong.js";
import { Content } from "./Content.js";
import { byId, createElement, isMotionReduced } from "./Dom.js";
import { createPolaroid, renderFridge } from "./Fridge.js";
import { createJarSvg } from "./JarSvg.js";
import { renderMixtape } from "./Mixtape.js";

// Paper-cutout confetti in the jam palette, instead of emoji.
const ConfettiColours = Object.freeze(["#D6455B", "#F4C7CF", "#F2A65A", "#F2C94C", "#5B6BB5", "#9DB38A"]);
const ConfettiShapes = Object.freeze(["confetti--square", "confetti--strip", "confetti--round"]);
const ConfettiCount = 44;
const ConfettiMaxDelayMs = 900;
const ConfettiDriftVw = 40;
const LidOpenMs = 450;
const IntroFadeMs = 700;
const GiftLabel = "for you ♡";
const TypedLetterSummary = "read the typed version";

const ClassName = Object.freeze({
  JarOpen: "is-open",
  Leaving: "is-leaving",
  EnvelopeOpen: "is-open",
  HandwrittenLetter: "letter--handwritten",
});

function bindText() {
  document.querySelectorAll("[data-bind]").forEach((node) => {
    node.textContent = String(Content[node.dataset.bind] ?? "");
  });
  byId("MainVerseText").textContent = `“${Content.MainVerse.Text}”`;
  byId("MainVerseRef").textContent = Content.MainVerse.Reference;
}

function renderSoulNotes() {
  const list = byId("SoulNotes");
  Content.SoulNotes.forEach((note) => list.append(createElement("li", "note", note)));
  const closing = createElement("li", "note note--wide");
  Content.SoulClosing.forEach((paragraph) => closing.append(createElement("p", "", paragraph)));
  list.append(closing);
}

function renderShelf() {
  const shelf = byId("Shelf");
  Content.Jars.forEach((jar) => {
    const button = createElement("button", "shelf__jar");
    button.type = "button";
    button.setAttribute("aria-label", `Open the ${jar.Flavour} jar: ${jar.Title}`);
    button.append(createJarSvg(jar));
    button.addEventListener("click", () => openJar(button, jar));
    shelf.append(button);
  });
}

/**
 * Twists the lid off, then shows the jar's notes in the dialog.
 * @param {HTMLButtonElement} button
 * @param {import("./Content.js").JarContent} jar
 */
function openJar(button, jar) {
  button.classList.add(ClassName.JarOpen);
  byId("JarDialogTitle").textContent = jar.Title;
  byId("JarDialogLines").replaceChildren(...jar.Lines.map((line) => createElement("li", "", line)));
  const extra = byId("JarDialogExtra");
  extra.replaceChildren();
  if (jar.HasGuardDog) {
    extra.append(createPolaroid(Content.GuardDogPhoto, "polaroid"));
  }

  const delay = isMotionReduced() ? 0 : LidOpenMs;
  window.setTimeout(() => byId("JarDialog").showModal(), delay);
}

function closeAllJars() {
  document.querySelectorAll(".shelf__jar").forEach((jar) => jar.classList.remove(ClassName.JarOpen));
}

function renderWorshipPhoto() {
  const worship = createPolaroid(Content.WorshipPhoto, "");
  byId("WorshipPhoto").replaceChildren(...worship.childNodes);
}

function renderVerses() {
  const list = byId("Verses");
  Content.Verses.forEach((verse) => {
    const item = createElement("li", "verse", `“${verse.Text}”`);
    item.append(createElement("cite", "", verse.Reference));
    list.append(item);
  });
}

/** Typed paragraphs, or photos of the handwritten pages with the typed text folded underneath. */
function renderLetter() {
  const body = byId("LetterBody");
  const paragraphs = Content.Letter.map((paragraph) => createElement("p", "", paragraph));
  const isTypedOnly = Content.LetterPages.length === 0;
  if (isTypedOnly) {
    body.append(...paragraphs);

    return;
  }

  byId("Letter").classList.add(ClassName.HandwrittenLetter);
  Content.LetterPages.forEach((src, index) => body.append(createLetterPage(src, index)));
  const typed = createElement("details", "letter__typed");
  // The handwritten pages already carry the signature, so the typed one moves into the fold.
  const signOff = document.querySelector(".letter__sign");
  typed.append(createElement("summary", "", TypedLetterSummary), ...paragraphs, signOff);
  body.append(typed);
}

/**
 * @param {string} src
 * @param {number} index
 * @returns {HTMLImageElement}
 */
function createLetterPage(src, index) {
  const image = /** @type {HTMLImageElement} */ (createElement("img", "letter__page"));
  image.src = src;
  image.alt = `Handwritten letter, page ${index + 1}`;
  image.loading = "lazy";

  return image;
}

/** @param {number} index */
function createConfettiPiece(index) {
  const shape = ConfettiShapes[index % ConfettiShapes.length];
  const piece = createElement("span", `confetti ${shape}`);
  piece.style.left = `${Math.random() * 100}vw`;
  piece.style.background = ConfettiColours[index % ConfettiColours.length];
  piece.style.animationDelay = `${Math.random() * ConfettiMaxDelayMs}ms`;
  piece.style.setProperty("--drift", `${(Math.random() - 0.5) * ConfettiDriftVw}vw`);
  piece.addEventListener("animationend", () => piece.remove());

  return piece;
}

function dropConfetti() {
  if (isMotionReduced()) {
    return;
  }

  for (let index = 0; index < ConfettiCount; index += 1) {
    document.body.append(createConfettiPiece(index));
  }
}

function revealMain() {
  byId("Intro").hidden = true;
  byId("Main").hidden = false;
  window.scrollTo({ top: 0 });
}

function initIntro() {
  const jar = byId("IntroJar");
  jar.append(createJarSvg({ Flavour: "Gift", Label: GiftLabel }));
  jar.addEventListener("click", () => {
    jar.classList.add(ClassName.JarOpen);
    byId("Intro").classList.add(ClassName.Leaving);
    startBackgroundSong();
    dropConfetti();
    window.setTimeout(revealMain, isMotionReduced() ? 0 : IntroFadeMs);
  }, { once: true });
}

function initEnvelope() {
  const envelope = byId("Envelope");
  envelope.addEventListener("click", () => {
    envelope.classList.add(ClassName.EnvelopeOpen);
    envelope.setAttribute("aria-expanded", "true");
    byId("Letter").hidden = false;
    dropConfetti();
  }, { once: true });
}

function initReplay() {
  byId("Replay").addEventListener("click", () => {
    dropConfetti();
    closeAllJars();
    window.scrollTo({ top: 0, behavior: isMotionReduced() ? "auto" : "smooth" });
  });
}

function init() {
  bindText();
  renderSoulNotes();
  renderShelf();
  renderFridge(Content.Photos);
  renderVerses();
  renderWorshipPhoto();
  renderMixtape(Content.Mixtape);
  initBackgroundSong(Content.BackgroundSong);
  renderLetter();
  initIntro();
  initEnvelope();
  initReplay();
  byId("JarDialog").addEventListener("close", closeAllJars);
}

init();
