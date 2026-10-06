export class GameClock {
  constructor() {
    this.time = 0;
    this.delta = 0;
    this.lastRealTime = null;
    this.paused = false;
  }

  advance(realTime, maxDelta = Infinity) {
    if (this.lastRealTime === null) {
      this.lastRealTime = realTime;
      return this.time;
    }
    this.delta = this.paused ? 0 : Math.min(maxDelta, Math.max(0, realTime - this.lastRealTime));
    if (!this.paused) this.time += this.delta;
    this.lastRealTime = realTime;
    return this.time;
  }

  reset(realTime = 0) {
    this.time = 0;
    this.delta = 0;
    this.lastRealTime = realTime;
    this.paused = false;
  }

  pause() {
    this.paused = true;
    this.delta = 0;
  }

  resume(realTime = this.lastRealTime) {
    this.paused = false;
    this.lastRealTime = realTime;
    this.delta = 0;
  }

  get now() {
    return this.time;
  }
}
