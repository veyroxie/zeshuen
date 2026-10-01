import {
  isBackgroundSongPaused,
  onBackgroundSongChange,
  toggleBackgroundSong,
} from "./BackgroundSong.js";
import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { fogOver } from "./MirrorFog.js";
import { isVoicePlaying, playVoice, stopVoice } from "./Voice.js";
import { createViewSlideshow } from "./WindowViews.js";
import { createParagraphs, createPhotoFigure, openSheet } from "./Sheet.js";

const SpotifyPlaylistBaseUrl = "https://open.spotify.com/playlist/";

/**
 * One jam jar's notes. (The guard dog itself waits in the bedroom.)
 * @param {import("./Content.js").JarContent} jar
 */
export function openJarSheet(jar) {
  openSheet({ tag: Content.Side.Yours, title: jar.Title, children: createParagraphs(jar.Lines, "line") });
}

/** Entryway mirror: the soul notes under steamed-up glass she wipes clear with a finger. */
export function openMirrorSheet() {
  const notes = createElement("div", "fogged");
  notes.append(...createParagraphs(Content.SoulNotes, "line"));
  openSheet({ tag: Content.Side.Yours, title: Content.SheetTitle.Mirror, children: [notes] });
  fogOver(notes, Content.House.Mirror.Wipe);
}

/** Taped to the freezer drawer: who does what in the flat. */
export function openChoreChartSheet() {
  const table = createElement("table", "chores");
  Content.House.ChoreChart.Rows.forEach(([chore, who]) => {
    const row = createElement("tr", "");
    row.append(createElement("th", "", chore), createElement("td", "", who));
    table.append(row);
  });
  openSheet({ tag: Content.Side.Mine, title: Content.House.ChoreChart.Title, children: [table] });
}

/** The secret lounge's fireplace: the reward for finding every jar. */
export function openLoungeSheet() {
  const listen = createElement("button", "pill", Content.Ui.PlayVoice);
  listen.type = "button";
  listen.addEventListener("click", () => toggleLoungeVoice(listen));
  // closing the note stops the voice note too
  byId("Sheet").addEventListener("close", stopVoice, { once: true });
  const children = [...createParagraphs(Content.House.Lounge.Lines, "para"), listen];
  openSheet({ tag: Content.Side.Mine, title: Content.House.Lounge.Title, children });
}

/** Living-room window: the view outside, then the verses and the worship photo. */
export function openWindowSheet() {
  const main = createVerse(Content.MainVerse, "verse verse--main");
  const others = Content.Verses.map((verse) => createVerse(verse, "verse"));
  const children = [createViewSlideshow(), main, ...others, createPhotoFigure(Content.WorshipPhoto)];
  openSheet({ tag: Content.Side.Yours, title: Content.SheetTitle.Window, children });
}

/** Living-room sofa: the long "you're not alone" note. */
export function openSofaSheet() {
  openSheet({ tag: Content.Side.Mine, title: Content.SheetTitle.Sofa, children: createParagraphs(Content.SoulClosing, "para") });
}

/** Bedroom pillow: photos of the handwritten pages, with the typed transcript folded underneath. */
export function openLetterSheet() {
  const pages = Content.LetterPages.map((src, index) => createLetterPage(src, index));
  const typed = createElement("details", "typed");
  const paragraphs = createParagraphs([...Content.Letter, Content.LetterSignOff], "para");
  typed.append(createElement("summary", "", Content.Ui.TypedLetter), ...paragraphs);
  openSheet({ tag: Content.Side.Mine, title: Content.SheetTitle.Letter, children: [...pages, typed] });
  playVoice("Letter");
}

/** Bedroom nightstand: the real guard dog, on night duty. */
export function openGuardDogSheet() {
  const children = [createElement("p", "line", Content.House.GuardDog), createPhotoFigure(Content.GuardDogPhoto)];
  openSheet({ tag: Content.Side.Mine, title: Content.SheetTitle.GuardDog, children });
}

/** Living-room radio: play or pause our song, or open the whole playlist. */
export function openRadioSheet() {
  const toggle = createElement("button", "pill", songLabel(!isBackgroundSongPaused()));
  toggle.type = "button";
  toggle.addEventListener("click", toggleBackgroundSong);
  const stopListening = onBackgroundSongChange((isPlaying) => { toggle.textContent = songLabel(isPlaying); });
  byId("Sheet").addEventListener("close", stopListening, { once: true });
  const row = createElement("div", "player");
  row.append(toggle, createPlaylistLink());
  const note = createElement("p", "para", Content.Mixtape.Note);
  openSheet({ tag: Content.Side.Mine, title: Content.Mixtape.Title, children: [note, row] });
  playVoice("Radio");
}

/** @returns {HTMLAnchorElement} */
function createPlaylistLink() {
  const link = /** @type {HTMLAnchorElement} */ (createElement("a", "player__link", Content.Ui.SpotifyLink));
  link.href = `${SpotifyPlaylistBaseUrl}${Content.Mixtape.SpotifyPlaylistId}`;
  link.target = "_blank";
  link.rel = "noopener";

  return link;
}

/**
 * Plays the long lounge voice note, or pauses it.
 * @param {HTMLElement} button
 */
function toggleLoungeVoice(button) {
  if (isVoicePlaying()) {
    stopVoice();

    return;
  }

  const voice = playVoice("Lounge");
  button.textContent = Content.Ui.PauseVoice;
  voice?.addEventListener("ended", () => { button.textContent = Content.Ui.PlayVoice; });
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
