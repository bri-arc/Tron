import { GAME_CONFIG } from './config.js';
import { GameRenderer } from './GameRenderer.js';
import { Grid } from './Grid.js';
import { Player } from './Player.js';
import { Arena } from './Arena.js';
import { TrailManager } from './TrailManager.js';
import { CollisionEngine } from './CollisionEngine.js';
import { AudioManager } from './AudioManager.js';
import { UIManager } from './UIManager.js';
import { ScoreManager } from './ScoreManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { PowerUpManager } from './PowerUpManager.js';
import { ReplayBuffer } from './ReplayBuffer.js';
import { GameClock } from './GameClock.js';
import { PowerUpEffects } from './PowerUpEffects.js';
import { TurnResolver } from './TurnResolver.js';
import { EventSystem } from './EventSystem.js';
import { CameraManager } from './CameraManager.js';
import { ReplayManager } from './ReplayManager.js';
import { CrashManager } from './CrashManager.js';
import { SurvivalPlanner } from './SurvivalPlanner.js';
import { AIOpponent } from './AIOpponent.js';

export class GameEngine {
  constructor({ clock = new GameClock() } = {}) {
    this.clock = clock;
    this.canvas = document.querySelector("#game");
    this.ctx = this.canvas.getContext("2d");
    this.grid = new Grid(GAME_CONFIG.grid);
    this.arena = new Arena(this.grid);
    this.trails = new TrailManager(this.grid);
    this.player = null;
    this.opponents = [];
    this.remotePlayers = new Map();
    this.remotePowerups = new Map();
    this.mode = "survival";
    this.difficulty = "normal";
    this.collision = CollisionEngine;
    this.audio = new AudioManager();
    this.ui = new UIManager();
    this.score = new ScoreManager(GAME_CONFIG.scoring);
    this.particles = new ParticleSystem();
    this.powerups = new PowerUpManager(this.grid);
    this.replayBuffer = new ReplayBuffer();
    this.eventSystem = new EventSystem();
    this.camera = new CameraManager();
    this.replay = new ReplayManager(this.replayBuffer, document.querySelector("#replay-canvas"), document.querySelector("#replay-monitor"), this.camera);
    this.crashes = new CrashManager(this.replay);
    this.pendingResult = null;
    this.replayPauseAt = 0;
    this.replay.onComplete = now => this.finishReplay(now);
    this.eventSystem.addEventListener("crash", event => window.dispatchEvent(new CustomEvent("ng:crash", { detail: event.detail })));
    this.effects = { shield: false, ghostUntil: 0, speedUntil: 0, slowUntil: 0, multiplierUntil: 0 };
    this.state = "ready"; this.lives = GAME_CONFIG.player.lives;
    this.record = this.readRecord(); this.startedAt = 0;
    this.lastFrame = null; this.accumulator = 0;
    this.shakeUntil = 0; this.flashUntil = 0; this.shake = 0;
    this.bindEvents();
    this.renderer = new GameRenderer(this);
    this.renderer.render();
    requestAnimationFrame(time => this.frame(time));
    window.setTimeout(() => document.querySelector("#loading-screen").classList.add("is-ready"), 700);
  }
  readRecord() {
    try { const value = Number(localStorage.getItem("neon-grid-high-score")); return Number.isFinite(value) ? value : 0; }
    catch (error) { console.warn("Local storage is unavailable.", error); return 0; }
  }
  saveRecord(value) {
    try { localStorage.setItem("neon-grid-high-score", String(value)); }
    catch (error) { console.warn("Could not save arcade record.", error); }
  }
  bindEvents() {
    document.querySelector("#start-button").addEventListener("click", () => this.state === "paused" ? this.togglePause() : this.start());
    document.querySelector("#pause-button").addEventListener("click", () => this.togglePause());
    document.querySelector("#sound-toggle").addEventListener("click", event => {
      this.audio.muted = !this.audio.muted;
      event.currentTarget.textContent = `AUDIO: ${this.audio.muted ? "OFF" : "ON"}`;
      event.currentTarget.setAttribute("aria-pressed", String(!this.audio.muted));
    });
    window.addEventListener("keydown", event => this.keyDown(event));
    window.addEventListener("ng:crash-scene-complete", () => this.showResult());
    window.addEventListener("ng:remote-state", event => this.remotePlayers.set(event.detail.id, event.detail));
    window.addEventListener("ng:remote-powerup", event => {
      const { id, action, type, x, y } = event.detail;
      const key = `${id}:${x},${y}`;
      if (action === "collect") this.remotePowerups.delete(key);
      else {
        const definition = this.powerups.definitions.find(item => item.type === type);
        if (definition) this.remotePowerups.set(key, { ...definition, x, y });
      }
    });
  }
  start() {
    this.clock.reset(performance.now());
    this.lives = GAME_CONFIG.player.lives; this.score.reset(); this.arena.reset(); this.trails.clear();
    this.replayBuffer.clear();
    this.remotePowerups.clear();
    this.mode = document.querySelector("#mode-select").value;
    this.difficulty = document.querySelector("#difficulty-select").value;
    const x = Math.floor(this.grid.columns * GAME_CONFIG.player.startX), y = Math.floor(this.grid.rows / 2);
    this.player = new Player("player", x, y, GAME_CONFIG.player.color);
    this.opponents = [
      new AIOpponent("ai-blue", 30, 5, "#ff9b45", this.difficulty),
      new AIOpponent("ai-pink", 30, 18, "#fc4d9c", this.difficulty),
      new AIOpponent("ai-violet", 22, 11, "#a98aff", this.difficulty)
    ];
    this.trails.add(x, y);
    this.opponents.forEach(opponent => this.trails.add(opponent.x, opponent.y, opponent.id));
    this.effects = { shield: false, ghostUntil: 0, speedUntil: 0, slowUntil: 0, multiplierUntil: 0 };
    this.startedAt = this.clock.now;
    this.powerups.reset(this.startedAt);
    this.state = "playing"; this.accumulator = 0;
    this.ui.overlayState("SYSTEM ONLINE", "LINK ESTABLISHED", "Jeder überlebte Tick bringt Punkte.", "NEUSTART");
    this.ui.hideOverlay(); this.audio.start(); this.renderer.render();
    this.audio.startMusic();
  }
  togglePause() {
    if (this.state === "playing") {
      this.state = "paused";
      this.clock.pause();
      this.ui.overlayState("RUN ANGEHALTEN", "PAUSE", "Drücke P oder Fortsetzen, um weiterzufahren.", "FORTSETZEN");
      this.ui.showOverlay();
    } else if (this.state === "paused") {
      this.clock.resume();
      this.accumulator = 0; this.lastFrame = this.clock.lastRealTime;
      this.state = "playing"; this.ui.hideOverlay();
    }
  }
  keyDown(event) {
    if (event.key.toLowerCase() === "p" && (this.state === "playing" || this.state === "paused")) {
      event.preventDefault(); this.togglePause(); return;
    }
    const vector = GAME_CONFIG.keys[event.key];
    if (vector) {
      event.preventDefault();
      if (this.state === "ready" || this.state === "over") this.start();
      if (this.state === "playing") this.player.steer({ x: vector[0], y: vector[1] });
    } else if ((event.key === "Enter" || event.key === " ") && this.state === "paused") this.togglePause();
    else if ((event.key === "Enter" || event.key === " ") && this.state !== "playing") this.start();
  }
  update() {
    if (this.state !== "playing") return;
    const now = this.clock.now;
    const moves = TurnResolver.resolve(this.player, this.opponents, this.arena, this.trails,
      this.collision, now, rider => rider.id === this.player.id && now < this.effects.ghostUntil);
    const playerMove = moves.find(move => move.rider.id === this.player.id);
    const playerBlocked = playerMove?.dead ?? true;
    if (playerBlocked && this.effects.shield) {
      this.effects.shield = false;
      this.ui.message.textContent = "SHIELD ABSORBED A COLLISION";
      playerMove.dead = false;
    } else if (playerBlocked) {
      const impact = this.grid.center(this.player.x, this.player.y, this.canvas.width, this.canvas.height);
      this.particles.emit(impact.x, impact.y, this.player.color, 48);
      this.shakeUntil = now + 240; this.flashUntil = now + 100; this.shake = 5;
      this.lives -= 1; this.audio.crash();
      if (this.lives > 0) {
        this.player.x = Math.floor(this.grid.columns * GAME_CONFIG.player.startX);
        this.player.y = Math.floor(this.grid.rows / 2);
        this.player.direction = { x: 1, y: 0 }; this.player.input.length = 0;
        this.trails.erase("player"); this.trails.add(this.player.x, this.player.y);
        this.ui.message.textContent = `CYCLE VERLOREN — ${this.lives} LEBEN VERBLEIBEN`;
      }
    } else {
      this.player.x = playerMove.target.x; this.player.y = playerMove.target.y;
      this.trails.add(this.player.x, this.player.y);
    }
    window.dispatchEvent(new CustomEvent("ng:local-state", { detail: {
      x: this.player.x, y: this.player.y, dx: this.player.direction.x, dy: this.player.direction.y
    } }));
    const pickup = playerBlocked ? null : this.powerups.collect(this.player.x, this.player.y, now);
    if (pickup) {
      window.dispatchEvent(new CustomEvent("ng:local-powerup", { detail: { action: "collect", type: pickup.type, x: pickup.x, y: pickup.y } }));
      this.applyPowerup(pickup, now);
    }
    const crashedOpponents = [];
    for (const move of moves.filter(move => move.rider !== this.player)) {
      const opponent = move.rider;
      if (move.dead) {
        opponent.alive = false; crashedOpponents.push(opponent);
        const pos = this.grid.center(opponent.x, opponent.y, this.canvas.width, this.canvas.height);
        this.particles.emit(pos.x, pos.y, opponent.color, 28);
        continue;
      }
      opponent.direction = move.direction;
      opponent.x = move.target.x; opponent.y = move.target.y;
      this.trails.add(opponent.x, opponent.y, opponent.id);
    }
    crashedOpponents.forEach(opponent => this.crashes.trigger(opponent.id, now));
    if (this.lives <= 0) { this.finish(); return; }
    if (this.mode === "last-cycle" && [this.player, ...this.opponents].filter(rider => rider.alive !== false).length === 1) {
      this.finish("LAST CYCLE STANDING"); return;
    }
    if (this.mode === "time-attack" && this.clock.now - this.startedAt >= 60000) {
      this.finish("TIME ATTACK COMPLETE"); return;
    }
    const previousPowerup = this.powerups.item;
    this.powerups.update(now, this.trails, this.arena);
    if (this.powerups.item && this.powerups.item !== previousPowerup) {
      window.dispatchEvent(new CustomEvent("ng:local-powerup", { detail: {
        action: "spawn", type: this.powerups.item.type, x: this.powerups.item.x, y: this.powerups.item.y
      } }));
    }
    this.score.score += GAME_CONFIG.scoring.cell * (now < this.effects.multiplierUntil ? 2 : 1);
    this.score.ticks += 1;
    if (this.score.ticks % 8 === 0) this.audio.point();
  }
  applyPowerup(item, now) {
    PowerUpEffects.apply(item, { now, effects: this.effects, trails: this.trails, player: this.player, riders: [this.player, ...this.opponents] });
    if (item.type === "bomb") this.particles.emit((this.player.x + .5) * this.canvas.width / this.grid.columns,
      (this.player.y + .5) * this.canvas.height / this.grid.rows, item.color, 65);
    this.ui.message.textContent = `${item.label} ACTIVATED`;
    this.audio.tone(760, .18, "triangle", .065);
  }
  finish(resultTitle = "CYCLE DEREZZED") {
    const elapsed = Math.floor((this.clock.now - this.startedAt) / 1000);
    const result = this.score.final(elapsed);
    this.pendingResult = { title: resultTitle, elapsed, result };
    this.replayPauseAt = this.clock.now;
    this.replayBuffer.capture(this.snapshot(this.replayPauseAt));
    this.state = "replay";
    if (!this.crashes.trigger(this.player.id, this.replayPauseAt)) this.finishReplay(this.replayPauseAt);
  }
  finishReplay(now) {
    if (this.state !== "replay" || !this.pendingResult) return;
    this.state = "over";
    this.eventSystem.emit("crash", { ...this.snapshot(now), crashed: "player" });
  }
  showResult() {
    if (this.state !== "over" || !this.pendingResult) return;
    const { title, elapsed, result } = this.pendingResult;
    if (result > this.record) { this.record = result; this.saveRecord(result); }
    this.ui.overlayState("SIGNAL LOST", title, `${result.toString().padStart(6, "0")} PUNKTE · ${elapsed} SEKUNDEN`, "NOCH EIN RUN");
    this.ui.showOverlay(); this.audio.crash();
    this.pendingResult = null;
  }
  snapshot(now) {
    const riders = [this.player, ...this.opponents].filter(rider => rider && rider.alive !== false).map(rider => ({
      id: rider.id, x: rider.x, y: rider.y, dx: rider.direction.x, dy: rider.direction.y, color: rider.color
    }));
    const trails = [...this.trails.paths].map(([id, cells]) => ({
      id, color: id === "player" ? this.player?.color : this.opponents.find(opponent => opponent.id === id)?.color ?? "#43eaff",
      cells: cells.map(cell => ({ ...cell }))
    }));
    return { time: now, riders, trails, powerup: this.powerups.item ? { ...this.powerups.item } : null, state: this.state };
  }



  render() { this.renderer.render(); }
  frame(now) {
    if (this.lastFrame === null) this.lastFrame = now;
    const frameDelta = Math.min(now - this.lastFrame, GAME_CONFIG.timing.tickMs * 2);
    this.clock.advance(now, GAME_CONFIG.timing.tickMs * 2);
    const delta = Math.min(frameDelta, this.clock.delta);
    this.accumulator = this.state === "playing" ? this.accumulator + delta : 0;
    this.lastFrame = now; this.particles.update(delta);
    const gameNow = this.clock.now;
    const elapsed = this.state === "playing" ? Math.floor((gameNow - this.startedAt) / 1000) : 0;
    const tick = Math.max(GAME_CONFIG.timing.minimumTickMs, GAME_CONFIG.timing.tickMs -
      Math.floor(this.score.ticks / GAME_CONFIG.timing.accelerationStep) * GAME_CONFIG.timing.accelerationMs);
    const powerupScale = gameNow < this.effects.speedUntil ? .72 : gameNow < this.effects.slowUntil ? 1.35 : 1;
    const adjustedTick = tick * powerupScale;
    while (this.accumulator >= adjustedTick && this.state === "playing") { this.update(); this.accumulator -= adjustedTick; }
    if (this.state === "playing") this.replayBuffer.capture(this.snapshot(gameNow));
    this.replay.draw(gameNow);
    const active = [];
    if (this.effects.shield) active.push("SHIELD");
    if (gameNow < this.effects.speedUntil) active.push("SPEED");
    if (gameNow < this.effects.slowUntil) active.push("SLOW");
    if (gameNow < this.effects.ghostUntil) active.push("GHOST");
    if (gameNow < this.effects.multiplierUntil) active.push("2×");
    const cooldown = Math.max(0, Math.ceil((this.powerups.nextAt - now) / 1000));
    document.querySelector("#power-status").textContent = active.length
      ? `ACTIVE · ${active.join(" / ")}` : this.powerups.item ? `PICKUP · ${this.powerups.item.label}` : `POWER-UP SCAN · ${cooldown}S`;
    this.ui.render({ score: this.score.score, time: `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`, lives: this.lives, level: this.score.level(), record: this.record });
    this.renderer.render(); requestAnimationFrame(time => this.frame(time));
  }
}
