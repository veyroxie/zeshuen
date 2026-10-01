import { holdBackgroundSong, releaseBackgroundSong } from "./BackgroundSong.js";
import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { stopVoice } from "./Voice.js";

// A proper little player for the long lounge voice note: play/pause, a bar she can drag,
// elapsed / total time, and a speed button.
const Speeds = Object.freeze([1, 1.25, 1.5, 2]);
const SecondsPerMinute = 60;
const PadWidth = 2;
const RangeMax = 1000;

/**
 * @param {string} src
 * @returns {HTMLElement}
 */
export function createVoicePlayer(src) {
  stopVoice();
  const audio = new Audio(src);
  audio.preload = "metadata";
  const parts = buildParts();
  wire(audio, parts);
  // closing the note stops it, and its pause event brings the song back
  byId("Sheet").addEventListener("close", () => audio.pause(), { once: true });

  return parts.root;
}

/** @returns {{ root: HTMLElement, play: HTMLButtonElement, bar: HTMLInputElement, time: HTMLElement, speed: HTMLButtonElement }} */
function buildParts() {
  const root = createElement("div", "voice-player");
  const play = /** @type {HTMLButtonElement} */ (createElement("button", "voice-player__play", Content.Ui.PlayIconBig));
  play.type = "button";
  play.setAttribute("aria-label", Content.Ui.PlayVoiceLabel);
  const bar = /** @type {HTMLInputElement} */ (createElement("input", "voice-player__bar"));
  Object.assign(bar, { type: "range", min: "0", max: String(RangeMax), value: "0" });
  bar.setAttribute("aria-label", Content.Ui.Seek);
  const time = createElement("span", "voice-player__time", "0:00 / 0:00");
  const speed = /** @type {HTMLButtonElement} */ (createElement("button", "voice-player__speed", "1×"));
  speed.type = "button";
  speed.setAttribute("aria-label", Content.Ui.Speed);
  const title = createElement("span", "label", Content.Ui.VoiceNote);
  const row = createElement("div", "voice-player__row");
  row.append(bar, time);
  root.append(title, play, row, speed);

  return { root, play, bar, time, speed };
}

/**
 * @param {HTMLAudioElement} audio
 * @param {{ play: HTMLButtonElement, bar: HTMLInputElement, time: HTMLElement, speed: HTMLButtonElement }} parts
 */
function wire(audio, { play, bar, time, speed }) {
  const showTime = () => {
    const isKnown = Number.isFinite(audio.duration);
    time.textContent = `${formatTime(audio.currentTime)} / ${isKnown ? formatTime(audio.duration) : "…"}`;
    bar.value = isKnown ? String((audio.currentTime / audio.duration) * RangeMax) : "0";
  };
  audio.addEventListener("loadedmetadata", showTime);
  audio.addEventListener("timeupdate", showTime);
  audio.addEventListener("play", () => { play.textContent = Content.Ui.PauseIconBig; play.setAttribute("aria-label", Content.Ui.PauseVoiceLabel); holdBackgroundSong(); });
  audio.addEventListener("pause", () => { play.textContent = Content.Ui.PlayIconBig; play.setAttribute("aria-label", Content.Ui.PlayVoiceLabel); releaseBackgroundSong(); });
  audio.addEventListener("ended", () => { audio.currentTime = 0; showTime(); });
  play.addEventListener("click", () => togglePlay(audio));
  bar.addEventListener("input", () => seek(audio, Number(bar.value)));
  speed.addEventListener("click", () => { speed.textContent = `${nextSpeed(audio)}×`; });
}

/** @param {HTMLAudioElement} audio */
function togglePlay(audio) {
  if (audio.paused) {
    audio.play().catch((error) => console.warn("Voice note could not play:", error));

    return;
  }

  audio.pause();
}

/**
 * @param {HTMLAudioElement} audio
 * @param {number} position 0..RangeMax
 */
function seek(audio, position) {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (position / RangeMax) * audio.duration;
  }
}

/**
 * @param {HTMLAudioElement} audio
 * @returns {number} the new speed
 */
function nextSpeed(audio) {
  const next = Speeds[(Speeds.indexOf(audio.playbackRate) + 1) % Speeds.length];
  audio.playbackRate = next;

  return next;
}

/**
 * @param {number} seconds
 * @returns {string} m:ss
 */
function formatTime(seconds) {
  const whole = Math.floor(seconds);

  return `${Math.floor(whole / SecondsPerMinute)}:${String(whole % SecondsPerMinute).padStart(PadWidth, "0")}`;
}
