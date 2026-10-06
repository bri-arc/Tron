export class ScoreManager {
  constructor(config) { this.config = config; this.score = 0; this.ticks = 0; }
  reset() { this.score = 0; this.ticks = 0; }
  advance() { this.ticks += 1; this.score += this.config.cell; }
  final(elapsed) { return this.score + elapsed * this.config.survivalSecond; }
  level() { return Math.floor(this.ticks / 120) + 1; }
}
