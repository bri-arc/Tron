export class AudioManager {
  constructor() { this.context = null; this.muted = false; }
  tone(frequency, duration, type = "sine", volume = .05) {
    if (this.muted) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context ??= new AudioContext();
    if (this.context.state === "suspended") this.context.resume();
    const osc = this.context.createOscillator(), gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.context.currentTime);
    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, this.context.currentTime + duration);
    osc.connect(gain).connect(this.context.destination);
    osc.start();
    osc.stop(this.context.currentTime + duration);
  }
  start() { this.tone(660, .16, "triangle"); }
  point() { this.tone(430, .07, "sine", .025); }
  crash() { this.tone(110, .65, "sawtooth", .09); }
}
