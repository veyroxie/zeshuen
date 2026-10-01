import { Content } from "./Content.js";
import { byId } from "./Dom.js";

const AudioEvent = Object.freeze({ Play: "play", Pause: "pause" });

/** @returns {HTMLAudioElement} */
const getAudio = () => /** @type {HTMLAudioElement} */ (byId("BackgroundSong"));

// iPhones ignore volume set from code, so a voice note pauses the song instead of ducking it.
let isHeldForVoice = false;

/**
 * Wires the looping song and the small floating pause/play button.
 * Nothing plays until she starts it from the radio: phones only allow sound after a tap.
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
  // her own tap wins over resuming after a voice note
  isHeldForVoice = false;
  if (isBackgroundSongPaused()) {
    playBackgroundSong();

    return;
  }

  getAudio().pause();
}

/** Pauses the song under a voice note, if it's playing. */
export function holdBackgroundSong() {
  if (isBackgroundSongPaused()) {
    return;
  }

  isHeldForVoice = true;
  getAudio().pause();
}

/** Resumes the song after a voice note, only if the note was what paused it. */
export function releaseBackgroundSong() {
  if (isHeldForVoice === false) {
    return;
  }

  isHeldForVoice = false;
  playBackgroundSong();
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

  toggle.textContent = isPlaying ? Content.Ui.PauseIcon : Content.Ui.PlayIcon;
  toggle.setAttribute("aria-label", isPlaying ? Content.Ui.PauseLabel : Content.Ui.PlayLabel);
  toggle.setAttribute("aria-pressed", String(isPlaying));
}
