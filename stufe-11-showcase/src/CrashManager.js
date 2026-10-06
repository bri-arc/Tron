export class CrashManager {
  constructor(replay) { this.replay = replay; this.lastCrashAt = 0; }
  trigger(riderId, now) {
    this.lastCrashAt = now;
    return this.replay.start(riderId, now);
  }
}
