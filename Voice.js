import { Content } from "./Content.js";
import { byId } from "./Dom.js";

// Short voice notes from me, played when she reaches certain places. The song ducks
// under them so she can hear me.
const DuckedVolume = 0.2;
const FullVolume = 1;

/** @type {HTMLAudioElement | null} */
let speaking = null;

/**
 * Turns the song down under a voice note, or back up.
 * @param {boolean} isDucked
 */
export function duckSong(isDucked) {
  const song = /** @type {HTMLAudioElement} */ (byId("BackgroundSong"));
  song.volume = isDucked ? DuckedVolume : FullVolume;
}

/** Stops whichever voice note is playing and brings the song back up. */
export function stopVoice() {
  speaking?.pause();
  speaking?.dispatchEvent(new Event("ended"));
}

/** @returns {boolean} */
export const isVoicePlaying = () => speaking !== null;

/**
 * @param {string} key one of Content.Voice's keys
 * @returns {HTMLAudioElement | null} the note, so a button can follow when it ends
 */
export function playVoice(key) {
  const src = Content.Voice[key];
  if (src === undefined) {
    return null;
  }

  speaking?.pause();
  const voice = new Audio(src);
  speaking = voice;
  const song = /** @type {HTMLAudioElement} */ (byId("BackgroundSong"));
  song.volume = DuckedVolume;
  const restore = () => {
    if (speaking === voice) {
      song.volume = FullVolume;
      speaking = null;
    }
  };
  voice.addEventListener("ended", restore);
  voice.addEventListener("error", restore);
  voice.play().catch((error) => {
    console.warn("Voice note could not play:", error);
    restore();
  });

  return voice;
}
