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
import { AIOpponent } from './AIOpponent.js';
import { GameClock } from './GameClock.js';
import { TurnResolver } from './TurnResolver.js';

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
    this.mode = "survival";
    this.difficulty = "normal";
    this.collision = CollisionEngine;
    this.audio = new AudioManager();
    this.ui = new UIManager();
    this.score = new ScoreManager(GAME_CONFIG.scoring);
    this.particles = new ParticleSystem();
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
  }
  start() {
    this.clock.reset(performance.now());
    this.lives = GAME_CONFIG.player.lives; this.score.reset(); this.arena.reset(); this.trails.clear();
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
    this.state = "playing"; this.startedAt = this.clock.now; this.accumulator = 0;
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
    const turn = TurnResolver.resolve(this.player, this.opponents, this.arena, this.trails, this.collision, now);
    const playerMove = turn.find(move => move.rider === this.player);
    for (const move of turn) {
      if (move.dead) {
        if (move.rider === this.player) continue;
        move.rider.alive = false;
        const point = this.grid.center(move.rider.x, move.rider.y, this.canvas.width, this.canvas.height);
        this.particles.emit(point.x, point.y, move.rider.color, 28);
        continue;
      }
      move.rider.direction = move.direction;
      move.rider.x = move.target.x;
      move.rider.y = move.target.y;
      this.trails.add(move.target.x, move.target.y, move.rider.id);
    }
    if (this.mode === "last-cycle" && [this.player, ...this.opponents].filter(rider => rider.alive !== false).length <= 1) {
      this.finish(this.player.alive !== false ? "LAST CYCLE STANDING" : "GRID LOST"); return;
    }
    if (playerMove?.dead) {
      this.shakeUntil = now + 240; this.flashUntil = now + 100; this.shake = 5;
      this.lives -= 1; this.audio.crash();
      if (this.lives <= 0) { this.finish(); return; }
    }
    if (this.mode === "time-attack" && this.clock.now - this.startedAt >= 60000) {
      this.finish("TIME ATTACK COMPLETE"); return;
    }
    if (playerMove?.dead) return;
    if (this.player.alive !== false) this.trails.add(this.player.x, this.player.y, this.player.id);
    this.score.advance();
    if (this.score.ticks % 8 === 0) this.audio.point();
  }
  finish(resultTitle = "CYCLE DEREZZED") {
    this.state = "over";
    const elapsed = Math.floor((this.clock.now - this.startedAt) / 1000);
    const result = this.score.final(elapsed);
    if (result > this.record) { this.record = result; this.saveRecord(result); }
    this.ui.overlayState("SIGNAL LOST", resultTitle, `${result.toString().padStart(6, "0")} PUNKTE · ${elapsed} SEKUNDEN`, "NOCH EIN RUN");
    this.ui.showOverlay(); this.audio.crash();
  }



  render() { this.renderer.render(); }
  frame(now) {
    if (this.lastFrame === null) this.lastFrame = now;
    const frameDelta = Math.min(now - this.lastFrame, GAME_CONFIG.timing.tickMs * 2);
    this.clock.advance(now, GAME_CONFIG.timing.tickMs * 2);
    const delta = Math.min(frameDelta, this.clock.delta);
    this.accumulator = this.state === "playing" ? this.accumulator + delta : 0;
    this.lastFrame = now; this.particles.update(delta);
    const elapsed = this.state === "playing" ? Math.floor((this.clock.now - this.startedAt) / 1000) : 0;
    const tick = Math.max(GAME_CONFIG.timing.minimumTickMs, GAME_CONFIG.timing.tickMs -
      Math.floor(this.score.ticks / GAME_CONFIG.timing.accelerationStep) * GAME_CONFIG.timing.accelerationMs);
    while (this.accumulator >= tick && this.state === "playing") { this.update(); this.accumulator -= tick; }
    this.ui.render({ score: this.score.score, time: `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`, lives: this.lives, level: this.score.level(), record: this.record });
    this.renderer.render(); requestAnimationFrame(time => this.frame(time));
  }
}
