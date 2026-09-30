import { Content } from "./Content.js";
import { byId } from "./Dom.js";

const AudioEvent = Object.freeze({ Play: "play", Pause: "pause" });

/** @returns {HTMLAudioElement} */
const getAudio = () => /** @type {HTMLAudioElement} */ (byId("BackgroundSong"));

/**
 * Wires the looping song and the small floating pause/play button.
 * Nothing plays until she opens the fridge: phones only allow sound after a tap.
 * @param {{ Src: string }} song
 */
export function initBackgroundSong(song) {
  const audio = getAudio();
  audio.src = song.Src;
  const toggle = byId("SongToggle");
  showToggleState(toggle, false);
  onBackgroundSongChange((isPlaying) => showToggleState(toggle, isPlaying));
  toggle.addEventListener("click", toggleBackgroundSong);
}

/** Starts the song (from a tap). The floating toggle appears once it's actually playing. */
export function playBackgroundSong() {
  getAudio().play().catch((error) => console.warn("Background song could not start:", error));
}

/** Pauses the song if it's playing, otherwise starts it. */
export function toggleBackgroundSong() {
  if (isBackgroundSongPaused()) {
    playBackgroundSong();

    return;
  }

  getAudio().pause();
}

/** @returns {boolean} */
export function isBackgroundSongPaused() {
  return getAudio().paused;
}

/**
 * Calls the listener with true when the song starts and false when it stops.
 * @param {(isPlaying: boolean) => void} listener
 * @returns {() => void} stops listening
 */
export function onBackgroundSongChange(listener) {
  const audio = getAudio();
  const onPlay = () => listener(true);
  const onPause = () => listener(false);
  audio.addEventListener(AudioEvent.Play, onPlay);
  audio.addEventListener(AudioEvent.Pause, onPause);

  return () => {
    audio.removeEventListener(AudioEvent.Play, onPlay);
    audio.removeEventListener(AudioEvent.Pause, onPause);
  };
}

/**
 * Keeps the toggle's label in sync. It stays hidden until the song first plays,
 * then stays visible so she can always pause or resume.
 * @param {HTMLElement} toggle
 * @param {boolean} isPlaying
 */
function showToggleState(toggle, isPlaying) {
  if (isPlaying) {
    toggle.hidden = false;
  }

  toggle.textContent = isPlaying ? Content.Ui.PauseSong : Content.Ui.PlaySong;
  toggle.setAttribute("aria-pressed", String(isPlaying));
}
