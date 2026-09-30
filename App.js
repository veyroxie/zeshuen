import { Content } from "./Content.js";
import { createJarSvg } from "./JarSvg.js";

const ConfettiPieces = Object.freeze(["🍓", "🫐", "🍋", "💗", "✿", "🍑"]);
const ConfettiCount = 36;
const ConfettiMaxDelayMs = 900;
const LidOpenMs = 450;
const IntroFadeMs = 700;
const GiftLabel = "for you ♡";

const ClassName = Object.freeze({
  JarOpen: "is-open",
  Leaving: "is-leaving",
  EnvelopeOpen: "is-open",
});

const isMotionReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const byId = (id) => document.getElementById(id);

/**
 * Creates an element with optional class and text.
 * @param {string} tag
 * @param {string} className
 * @param {string} text
 * @returns {HTMLElement}
 */
function createElement(tag, className, text = "") {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;

  return element;
}

function bindText() {
  document.querySelectorAll("[data-bind]").forEach((node) => {
    node.textContent = String(Content[node.dataset.bind] ?? "");
  });
  document.querySelectorAll("[data-bind-song]").forEach((node) => {
    node.textContent = Content.Song[node.dataset.bindSong] ?? "";
  });
  byId("Song").href = Content.Song.Url;
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
  const lines = byId("JarDialogLines");
  lines.replaceChildren(...jar.Lines.map((line) => createElement("li", "", line)));
  const delay = isMotionReduced() ? 0 : LidOpenMs;
  window.setTimeout(() => byId("JarDialog").showModal(), delay);
}

function closeAllJars() {
  document.querySelectorAll(".shelf__jar").forEach((jar) => jar.classList.remove(ClassName.JarOpen));
}

/**
 * @param {import("./Content.js").PhotoContent} photo
 * @param {string} className
 * @returns {HTMLElement}
 */
function createPolaroid(photo, className) {
  const figure = createElement("figure", className);
  const image = document.createElement("img");
  image.src = photo.Src;
  image.alt = photo.Alt;
  image.loading = "lazy";
  image.decoding = "async";
  figure.append(image, createElement("figcaption", "", photo.Caption));

  return figure;
}

function renderPhotos() {
  const list = byId("Polaroids");
  Content.Photos.forEach((photo) => {
    const item = createElement("li", "polaroids__item");
    item.append(createPolaroid(photo, "polaroid"));
    list.append(item);
  });
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

function renderLetter() {
  const body = byId("LetterBody");
  Content.Letter.forEach((paragraph) => body.append(createElement("p", "", paragraph)));
}

function dropConfetti() {
  if (isMotionReduced()) {
    return;
  }

  for (let index = 0; index < ConfettiCount; index += 1) {
    const piece = createElement("span", "confetti", ConfettiPieces[index % ConfettiPieces.length]);
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDelay = `${Math.random() * ConfettiMaxDelayMs}ms`;
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 40}vw`);
    piece.addEventListener("animationend", () => piece.remove());
    document.body.append(piece);
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
  renderPhotos();
  renderVerses();
  renderLetter();
  initIntro();
  initEnvelope();
  initReplay();
  byId("JarDialog").addEventListener("close", closeAllJars);
}

init();
