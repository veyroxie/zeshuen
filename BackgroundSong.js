import { Content } from "./Content.js";
import { byId } from "./Dom.js";
import { getContext } from "./Sound.js";

const AudioEvent = Object.freeze({ Play: "play", Pause: "pause" });

/** @returns {HTMLAudioElement} */
const getAudio = () => /** @type {HTMLAudioElement} */ (byId("BackgroundSong"));

// iPhones ignore volume set from code, so the song runs through a Web Audio gain that can be turned down.
const LoweredGain = 0.2;
const FullGain = 1;
// fade time constant in seconds: the fade is mostly done after about three of these
const FadeSeconds = 0.15;

/** @type {GainNode | null} */
let songGain = null;

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
  routeThroughGain();
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

/** Fades the song down under a voice note. */
export function lowerBackgroundSong() {
  fadeSongTo(LoweredGain);
}

/** Fades the song back up after a voice note. */
export function restoreBackgroundSong() {
  fadeSongTo(FullGain);
}

/** @param {number} level */
function fadeSongTo(level) {
  if (songGain === null) {
    return;
  }

  const now = songGain.context.currentTime;
  songGain.gain.cancelScheduledValues(now);
  songGain.gain.setTargetAtTime(level, now, FadeSeconds);
}

/** Connects the song to the gain the first time it plays; an element can only be connected once. */
function routeThroughGain() {
  const context = getContext();
  if (songGain !== null || context === null) {
    return;
  }

  songGain = context.createGain();
  context.createMediaElementSource(getAudio()).connect(songGain).connect(context.destination);
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
