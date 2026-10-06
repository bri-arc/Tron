export function awardNearMiss(engine, x, y, now) {
  if (now - engine.nearMissAt < 900) return;
  const near = engine.opponents.some(opponent => opponent.alive &&
    (engine.trails.paths.get(opponent.id) ?? []).some(cell =>
      Math.abs(cell.x - x) <= 1 && Math.abs(cell.y - y) <= 1 && (cell.x !== x || cell.y !== y)));
  if (!near) return;
  engine.nearMissAt = now;
  engine.combo = now - engine.comboAt < 2600 ? engine.combo + 1 : 1;
  engine.comboAt = now;
  engine.score.score += 50 * engine.combo;
  engine.effects.slowUntil = Math.max(engine.effects.slowUntil, now + 350);
  const point = engine.grid.center(x, y, engine.canvas.width, engine.canvas.height);
  engine.particles.emit(point.x, point.y, engine.player.color, 12);
  engine.ui.message.textContent = `NEAR-MISS +${50 * engine.combo}${engine.combo > 1 ? ` · COMBO ×${engine.combo}` : ""}`;
  engine.audio.tone(920 + engine.combo * 35, .11, "triangle", .06);
}
