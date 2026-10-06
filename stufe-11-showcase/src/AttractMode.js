import { AIOpponent } from './AIOpponent.js';

export class AttractMode {
  constructor(engine, delayMs = 6000) {
    this.engine = engine;
    this.delayMs = delayMs;
    this.lastInputAt = performance.now();
    this.active = false;
  }

  noteInput() {
    this.lastInputAt = performance.now();
    if (this.active) this.stop();
  }

  update(now) {
    if (!this.active && this.engine.state === "ready" && now - this.lastInputAt >= this.delayMs) {
      this.start();
    }
  }

  start() {
    const engine = this.engine;
    this.active = true;
    engine.isDemo = true;
    engine.mode = "survival";
    engine.difficulty = "normal";
    engine.arena.reset();
    engine.trails.clear();
    engine.powerups.reset(engine.clock.now);
    engine.player = new AIOpponent("demo-cyan", 8, 12, engine.palette[0], "normal");
    engine.opponents = [
      new AIOpponent("demo-orange", 31, 6, engine.palette[1], "normal"),
      new AIOpponent("demo-violet", 31, 18, engine.palette[3], "normal")
    ];
    engine.trails.add(engine.player.x, engine.player.y, engine.player.id);
    engine.opponents.forEach(rider => engine.trails.add(rider.x, rider.y, rider.id));
    engine.startedAt = engine.clock.now;
    engine.accumulator = 0;
    engine.state = "demo";
    engine.ui.message.textContent = "ATTRACT MODE · BELIEBIGE EINGABE ZUM BEENDEN";
    engine.ui.hideOverlay();
  }

  stop() {
    if (!this.active) return;
    const engine = this.engine;
    this.active = false;
    engine.isDemo = false;
    engine.state = "ready";
    engine.player = null;
    engine.opponents = [];
    engine.trails.clear();
    engine.accumulator = 0;
    this.lastInputAt = performance.now();
    engine.ui.overlayState("SYSTEM READY", "ENTER THE GRID", "Lenke dein Lightcycle. Überlebe so lange du kannst.", "RUN STARTEN");
    engine.ui.message.textContent = "ÜBERLEBE. EROBER DEN HIGH SCORE.";
    engine.ui.showOverlay();
  }
}
