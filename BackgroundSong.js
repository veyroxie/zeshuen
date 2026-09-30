import { byId } from "./Dom.js";

const ToggleLabel = Object.freeze({
  Pause: "❚❚ pause song",
  Play: "♫ play song",
});

/**
 * Loads the looping background song. It starts on the gift-jar tap,
 * because phones only allow sound after the person taps something.
 * @param {{ Src: string }} song
 */
export function initBackgroundSong(song) {
  const audio = /** @type {HTMLAudioElement} */ (byId("BackgroundSong"));
  audio.src = song.Src;
  const toggle = byId("SongToggle");
  audio.addEventListener("play", () => showToggleState(toggle, ToggleLabel.Pause, true));
  audio.addEventListener("pause", () => showToggleState(toggle, ToggleLabel.Play, false));
  toggle.addEventListener("click", () => toggleSong(audio));
}

/** Called from the gift-jar tap. */
export function startBackgroundSong() {
  const audio = /** @type {HTMLAudioElement} */ (byId("BackgroundSong"));
  byId("SongToggle").hidden = false;
  audio.play().catch((error) => console.warn("Background song could not start:", error));
}

/** @param {HTMLAudioElement} audio */
function toggleSong(audio) {
  if (audio.paused) {
    audio.play().catch((error) => console.warn("Background song could not resume:", error));

    return;
  }

  audio.pause();
}

/**
 * @param {HTMLElement} toggle
 * @param {string} label
 * @param {boolean} isPlaying
 */
function showToggleState(toggle, label, isPlaying) {
  toggle.textContent = label;
  toggle.setAttribute("aria-pressed", String(isPlaying));
}
