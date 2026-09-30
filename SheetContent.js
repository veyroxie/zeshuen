import {
  isBackgroundSongPaused,
  onBackgroundSongChange,
  toggleBackgroundSong,
} from "./BackgroundSong.js";
import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { createParagraphs, createPhotoFigure, openSheet } from "./Sheet.js";

const SpotifyPlaylistBaseUrl = "https://open.spotify.com/playlist/";

/**
 * One jam jar's notes; the can't-sleep jar also shows the guard dog photo.
 * @param {import("./Content.js").JarContent} jar
 */
export function openJarSheet(jar) {
  const children = createParagraphs(jar.Lines, "line");
  if (jar.HasGuardDog) {
    children.push(createPhotoFigure(Content.GuardDogPhoto));
  }

  openSheet({ tag: Content.Side.Yours, title: jar.Title, children });
}

/** The glowing honey jar: the main verse, the others, and the worship photo. */
export function openHoneySheet() {
  const main = createVerse(Content.MainVerse, "verse verse--main");
  const others = Content.Verses.map((verse) => createVerse(verse, "verse"));
  const children = [main, ...others, createPhotoFigure(Content.WorshipPhoto)];
  openSheet({ tag: Content.Side.Yours, title: Content.SheetTitle.Honey, children });
}

/** The soul notes as ingredients, the long note as the method. */
export function openRecipeSheet() {
  const ingredients = Content.SoulNotes.map((note, index) => createIngredient(note, index));
  const method = [createElement("span", "label", "method"), ...createParagraphs(Content.SoulClosing, "para")];
  openSheet({ tag: Content.Side.Mine, title: Content.SheetTitle.Recipe, children: [...ingredients, ...method] });
}

/** Photos of the handwritten pages, with the typed transcript folded underneath. */
export function openLetterSheet() {
  const pages = Content.LetterPages.map((src, index) => createLetterPage(src, index));
  const typed = createElement("details", "typed");
  const paragraphs = createParagraphs([...Content.Letter, Content.LetterSignOff], "para");
  typed.append(createElement("summary", "", Content.Ui.TypedLetter), ...paragraphs);
  openSheet({ tag: Content.Side.Mine, title: Content.SheetTitle.Letter, children: [...pages, typed] });
}

/** The radio: play or pause the song, or open the whole playlist. */
export function openRadioSheet() {
  const toggle = createElement("button", "pill", songLabel(!isBackgroundSongPaused()));
  toggle.type = "button";
  toggle.addEventListener("click", toggleBackgroundSong);
  const stopListening = onBackgroundSongChange((isPlaying) => { toggle.textContent = songLabel(isPlaying); });
  byId("Sheet").addEventListener("close", stopListening, { once: true });
  const link = /** @type {HTMLAnchorElement} */ (createElement("a", "player__link", Content.Ui.SpotifyLink));
  link.href = `${SpotifyPlaylistBaseUrl}${Content.Mixtape.SpotifyPlaylistId}`;
  link.target = "_blank";
  link.rel = "noopener";
  const row = createElement("div", "player");
  row.append(toggle, link);
  const note = createElement("p", "para", Content.Mixtape.Note);
  openSheet({ tag: Content.Side.Mine, title: Content.Mixtape.Title, children: [note, row] });
}

/**
 * @param {boolean} isPlaying
 * @returns {string}
 */
const songLabel = (isPlaying) => (isPlaying ? Content.Ui.PauseSong : Content.Ui.PlaySong);

/**
 * @param {import("./Content.js").VerseContent} verse
 * @param {string} className
 * @returns {HTMLElement}
 */
function createVerse(verse, className) {
  const quote = createElement("blockquote", className, `“${verse.Text}”`);
  quote.append(createElement("cite", "", verse.Reference));

  return quote;
}

/**
 * @param {string} note
 * @param {number} index
 * @returns {HTMLElement}
 */
function createIngredient(note, index) {
  const row = createElement("p", "line ingredient");
  const measure = Content.Measures[index % Content.Measures.length];
  row.append(createElement("b", "", measure), createElement("span", "", note));

  return row;
}

/**
 * @param {string} src
 * @param {number} index
 * @returns {HTMLImageElement}
 */
function createLetterPage(src, index) {
  const image = /** @type {HTMLImageElement} */ (createElement("img", "letter-page"));
  image.src = src;
  image.alt = `Handwritten letter, page ${index + 1}`;
  image.loading = "lazy";

  return image;
}
