export class ReplayBuffer {
  constructor(windowMs = 5000) { this.windowMs = windowMs; this.frames = []; }
  clear() { this.frames.length = 0; }
  capture(frame) {
    this.frames.push(frame);
    const cutoff = frame.time - this.windowMs;
    while (this.frames.length && this.frames[0].time < cutoff) this.frames.shift();
  }
  recent(durationMs) {
    const cutoff = (this.frames.at(-1)?.time ?? 0) - durationMs;
    return this.frames.filter(frame => frame.time >= cutoff);
  }
}
