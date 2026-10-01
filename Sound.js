// Little sounds, made in the browser (no audio files): knocks, a door creak, the fridge hum,
// a running tap, a light switch and a "found it" pop. Phones only allow sound after a tap,
// so the audio context starts on the first one.

/** @type {AudioContext | null} */
let context = null;

/** @returns {AudioContext | null} */
function getContext() {
  const AudioContextType = window.AudioContext ?? window.webkitAudioContext;
  if (AudioContextType === undefined) {
    return null;
  }

  context ??= new AudioContextType();
  if (context.state === "suspended") {
    context.resume().catch((error) => console.warn("Sound could not start:", error));
  }

  return context;
}

/**
 * @param {AudioContext} audio
 * @param {number} seconds
 * @returns {AudioBuffer} white noise
 */
function noiseBuffer(audio, seconds) {
  const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * seconds), audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

/**
 * A short sound shaped by a gain envelope.
 * @param {{ source: AudioScheduledSourceNode, filter?: BiquadFilterNode, peak: number, attack: number, decay: number, delay?: number }} options
 */
function envelope({ source, filter, peak, attack, decay, delay = 0 }) {
  const audio = getContext();
  const gain = audio.createGain();
  const start = audio.currentTime + delay;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
  const head = filter ?? gain;
  source.connect(head);
  if (filter) {
    filter.connect(gain);
  }

  gain.connect(audio.destination);
  source.start(start);
  source.stop(start + attack + decay + 0.05);
}

/** One knuckle on wood: a low thump plus a little click. */
export function playKnock() {
  const audio = getContext();
  if (audio === null) {
    return;
  }

  const thump = audio.createOscillator();
  thump.frequency.setValueAtTime(140, audio.currentTime);
  thump.frequency.exponentialRampToValueAtTime(70, audio.currentTime + 0.12);
  envelope({ source: thump, peak: 0.7, attack: 0.004, decay: 0.16 });
  const click = audio.createBufferSource();
  click.buffer = noiseBuffer(audio, 0.05);
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 900;
  envelope({ source: click, filter: band, peak: 0.35, attack: 0.002, decay: 0.04 });
}

/** A slow, low creak while a door swings. */
export function playCreak() {
  const audio = getContext();
  if (audio === null) {
    return;
  }

  const creak = audio.createOscillator();
  creak.type = "sawtooth";
  creak.frequency.setValueAtTime(95, audio.currentTime);
  creak.frequency.linearRampToValueAtTime(140, audio.currentTime + 0.5);
  creak.frequency.linearRampToValueAtTime(110, audio.currentTime + 0.9);
  const low = audio.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 700;
  envelope({ source: creak, filter: low, peak: 0.05, attack: 0.15, decay: 0.8 });
}

/** The fridge opening: a soft seal pop and a low hum. */
export function playFridgeHum() {
  const audio = getContext();
  if (audio === null) {
    return;
  }

  const hum = audio.createOscillator();
  hum.frequency.value = 58;
  envelope({ source: hum, peak: 0.08, attack: 0.3, decay: 1.6 });
  const seal = audio.createBufferSource();
  seal.buffer = noiseBuffer(audio, 0.15);
  const low = audio.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 400;
  envelope({ source: seal, filter: low, peak: 0.3, attack: 0.005, decay: 0.12 });
}

/** A tap running for a couple of seconds. */
export function playTap() {
  const audio = getContext();
  if (audio === null) {
    return;
  }

  const water = audio.createBufferSource();
  water.buffer = noiseBuffer(audio, 2.4);
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2200;
  band.Q.value = 0.6;
  envelope({ source: water, filter: band, peak: 0.12, attack: 0.25, decay: 2 });
}

/** A light switch. */
export function playClick() {
  const audio = getContext();
  if (audio === null) {
    return;
  }

  const click = audio.createBufferSource();
  click.buffer = noiseBuffer(audio, 0.03);
  const high = audio.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 1800;
  envelope({ source: click, filter: high, peak: 0.5, attack: 0.001, decay: 0.025 });
}

/** A happy little two-note pop for finding something. */
export function playFound() {
  const audio = getContext();
  if (audio === null) {
    return;
  }

  [660, 990].forEach((frequency, index) => {
    const note = audio.createOscillator();
    note.type = "triangle";
    note.frequency.value = frequency;
    envelope({ source: note, peak: 0.18, attack: 0.01, decay: 0.25, delay: index * 0.09 });
  });
}
