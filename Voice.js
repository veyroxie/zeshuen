import { lowerBackgroundSong, restoreBackgroundSong } from "./BackgroundSong.js";
import { Content } from "./Content.js";

// Short voice notes from me. The song fades down under them so she can hear me.

/** @type {HTMLAudioElement | null} */
let speaking = null;

/** Stops whichever voice note is playing and brings the song back. */
export function stopVoice() {
  speaking?.pause();
  speaking?.dispatchEvent(new Event("ended"));
}

/**
 * Only call from a tap: phones block sound that doesn't start from one.
 * @param {string} key one of Content.Voice's keys
 */
export function playVoice(key) {
  const src = Content.Voice[key];
  if (src === undefined) {
    return;
  }

  speaking?.pause();
  const voice = new Audio(src);
  speaking = voice;
  lowerBackgroundSong();
  const restore = () => {
    if (speaking === voice) {
      speaking = null;
      restoreBackgroundSong();
    }
  };
  voice.addEventListener("ended", restore);
  voice.addEventListener("error", restore);
  voice.play().catch((error) => {
    console.warn("Voice note could not play:", error);
    restore();
  });
}
