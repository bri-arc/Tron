export class AudioManager {
  constructor() { this.context = null; this.muted = false; this.musicTimer = null; this.musicStep = 0; this.motors = new Map(); this.musicTempo = 0; }
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
  startMusic(tempo = 380) {
    if (this.musicTimer && this.musicTempo === tempo) return;
    this.stopMusic();
    this.musicTempo = tempo;
    const notes = [110, 164.81, 220, 164.81, 130.81, 196, 261.63, 196];
    this.musicTimer = window.setInterval(() => {
      this.tone(notes[this.musicStep % notes.length], .34, "triangle", .014);
      this.musicStep += 1;
    }, tempo);
  }
  stopMusic() { window.clearInterval(this.musicTimer); this.musicTimer = null; this.musicTempo = 0; }
  setIntensity(riders) { this.startMusic(riders <= 2 ? 190 : riders <= 3 ? 275 : 380); }
  updateRiders(riders, columns, speed) {
    if (this.muted || !riders.length) { this.stopMotor(); return; }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context ??= new AudioContext();
    if (this.context.state === "suspended") this.context.resume();
    const activeIds = new Set(riders.map(rider => rider.id));
    riders.forEach((rider, index) => {
      let motor = this.motors.get(rider.id);
      if (!motor) {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        const panner = this.context.createStereoPanner ? this.context.createStereoPanner() : null;
        oscillator.type = "sawtooth";
        oscillator.connect(gain);
        if (panner) { gain.connect(panner); panner.connect(this.context.destination); }
        else gain.connect(this.context.destination);
        oscillator.start();
        motor = { oscillator, gain, panner };
        this.motors.set(rider.id, motor);
      }
      motor.oscillator.frequency.setTargetAtTime(62 + 260 / speed + index * 13, this.context.currentTime, .08);
      motor.gain.gain.setTargetAtTime(rider.id === "player" ? .012 : .006, this.context.currentTime, .08);
      if (motor.panner) motor.panner.pan.setTargetAtTime((rider.x / (columns - 1)) * 1.6 - .8, this.context.currentTime, .12);
    });
    for (const [id, motor] of this.motors) {
      if (activeIds.has(id)) continue;
      motor.gain.gain.setTargetAtTime(0, this.context.currentTime, .08);
      motor.oscillator.stop(this.context.currentTime + .3);
      this.motors.delete(id);
    }
  }
  stopMotor() {
    if (!this.context) return;
    for (const motor of this.motors.values()) {
      motor.gain.gain.setTargetAtTime(0, this.context.currentTime, .08);
      motor.oscillator.stop(this.context.currentTime + .3);
    }
    this.motors.clear();
  }
}
