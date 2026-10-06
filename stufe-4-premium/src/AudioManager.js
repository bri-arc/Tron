export class AudioManager {
  constructor() { this.context = null; this.muted = false; this.musicTimer = null; this.musicStep = 0; }
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
  startMusic() {
    if (this.musicTimer) return;
    const notes = [110, 164.81, 220, 164.81, 130.81, 196, 261.63, 196];
    this.musicTimer = window.setInterval(() => {
      this.tone(notes[this.musicStep % notes.length], .34, "triangle", .014);
      this.musicStep += 1;
    }, 380);
  }
  stopMusic() { window.clearInterval(this.musicTimer); this.musicTimer = null; }
}
