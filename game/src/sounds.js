// Twin Tides: synthesized sounds — no audio files, everything is an
// oscillator through the Web Audio API, created on first user gesture.

let audio = null;
let muted = false;

function ensureAudio() {
  if (!audio) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audio = new Ctor();
  }
  if (audio.state === 'suspended') void audio.resume();
  return audio;
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

// One note: a sine/triangle blip that slides from `from` to `to` Hz.
function note(freqFrom, freqTo, seconds, type, gainValue, delay = 0) {
  if (muted) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqFrom, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqTo), start + seconds);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + seconds);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + seconds + 0.05);
}

export function playClick() {
  note(660, 660, 0.06, 'sine', 0.08);
}

export function playFind() {
  note(523, 523, 0.12, 'triangle', 0.16);
  note(784, 784, 0.18, 'triangle', 0.16, 0.09);
}

export function playWrong() {
  note(180, 110, 0.22, 'sawtooth', 0.07);
}

export function playHint() {
  note(880, 660, 0.14, 'sine', 0.1);
  note(660, 520, 0.16, 'sine', 0.08, 0.1);
}

export function playLevelDone() {
  [523, 659, 784, 1047].forEach((f, i) => note(f, f, 0.2, 'triangle', 0.15, i * 0.11));
}

export function playVictory() {
  [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, f, 0.28, 'triangle', 0.15, i * 0.13));
}

export function playGameOver() {
  [392, 330, 262, 196].forEach((f, i) => note(f, f * 0.94, 0.26, 'sine', 0.12, i * 0.16));
}
