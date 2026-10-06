export class GameRenderer {
  constructor(engine) { this.engine = engine; }
  render() { renderGame(this.engine); }
}

export function renderGame(engine) {
const cw = engine.canvas.width / engine.grid.columns, ch = engine.canvas.height / engine.grid.rows;
const now = engine.clock.now;
engine.ctx.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
if (now < engine.shakeUntil) {
  engine.ctx.save();
  engine.ctx.translate((Math.random() - .5) * engine.shake, (Math.random() - .5) * engine.shake);
}
engine.ctx.fillStyle = "#03070b"; engine.ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);
engine.ctx.strokeStyle = "rgba(38,129,151,.21)"; engine.ctx.lineWidth = 1; engine.ctx.beginPath();
for (let x = 0; x <= engine.grid.columns; x += 1) { engine.ctx.moveTo(x * cw + .5, 0); engine.ctx.lineTo(x * cw + .5, engine.canvas.height); }
for (let y = 0; y <= engine.grid.rows; y += 1) { engine.ctx.moveTo(0, y * ch + .5); engine.ctx.lineTo(engine.canvas.width, y * ch + .5); }
engine.ctx.stroke();
engine.ctx.save(); engine.ctx.lineCap = "round"; engine.ctx.lineJoin = "round";
engine.ctx.strokeStyle = "rgba(25,203,239,.78)"; engine.ctx.lineWidth = Math.min(cw, ch) * .48; engine.ctx.shadowColor = "#20dbff"; engine.ctx.shadowBlur = 15;
engine.ctx.beginPath();
for (const [owner, path] of engine.trails.paths) {
  const cycle = owner === "player" ? engine.player : engine.opponents.find(opponent => opponent.id === owner);
  const color = cycle?.color ?? "#43eaff";
  const derezzAt = engine.trails.derezz.get(owner);
  const firstVisible = derezzAt === undefined ? 0 : Math.min(path.length, Math.floor(path.length * (now - derezzAt) / 1400));
  if (firstVisible >= path.length) continue;
  const visiblePath = path.slice(firstVisible);
  engine.ctx.strokeStyle = `${color}88`;
  engine.ctx.lineWidth = Math.min(cw, ch) * .62;
  engine.ctx.shadowBlur = 0;
  engine.ctx.beginPath();
  visiblePath.forEach((cell, index) => {
    const point = engine.grid.center(cell.x, cell.y, engine.canvas.width, engine.canvas.height);
    if (!index) engine.ctx.moveTo(point.x + 2, point.y + 4); else engine.ctx.lineTo(point.x + 2, point.y + 4);
  });
  engine.ctx.stroke();
  engine.ctx.strokeStyle = color;
  engine.ctx.lineWidth = Math.min(cw, ch) * .4;
  engine.ctx.shadowColor = color;
  engine.ctx.shadowBlur = 15;
  engine.ctx.beginPath();
  visiblePath.forEach((cell, index) => {
    const point = engine.grid.center(cell.x, cell.y, engine.canvas.width, engine.canvas.height);
    if (!index) engine.ctx.moveTo(point.x, point.y); else engine.ctx.lineTo(point.x, point.y);
  });
  engine.ctx.stroke();
}
engine.ctx.restore();
engine.powerups.draw(engine.ctx, engine.grid, engine.canvas, now);
for (const powerup of engine.remotePowerups.values()) {
  const point = engine.grid.center(powerup.x, powerup.y, engine.canvas.width, engine.canvas.height);
  engine.ctx.save(); engine.ctx.fillStyle = `${powerup.color}33`; engine.ctx.strokeStyle = powerup.color;
  engine.ctx.shadowColor = powerup.color; engine.ctx.shadowBlur = 16; engine.ctx.lineWidth = 2;
  engine.ctx.beginPath(); engine.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2); engine.ctx.fill(); engine.ctx.stroke();
  engine.ctx.fillStyle = "#fff"; engine.ctx.font = "bold 9px system-ui"; engine.ctx.textAlign = "center";
  engine.ctx.textBaseline = "middle"; engine.ctx.fillText(powerup.icon, point.x, point.y); engine.ctx.restore();
}
if (engine.player) drawPlayer(engine, cw, ch);
for (const opponent of engine.opponents) if (opponent.alive) drawCycle(engine, opponent, cw, ch);
for (const remote of engine.remotePlayers.values()) {
  drawCycle(engine, { ...remote, direction: { x: remote.dx, y: remote.dy }, color: "#ffffff" }, cw, ch);
}
engine.particles.draw(engine.ctx);
engine.shockwaves = engine.shockwaves.filter(wave => now - wave.startedAt < 650);
for (const wave of engine.shockwaves) {
  engine.ctx.save();
  engine.ctx.globalAlpha = 1 - (now - wave.startedAt) / 650;
  engine.ctx.strokeStyle = wave.color; engine.ctx.shadowColor = wave.color; engine.ctx.shadowBlur = 14; engine.ctx.lineWidth = 2;
  engine.ctx.beginPath(); engine.ctx.arc(wave.x, wave.y, (now - wave.startedAt) * .09, 0, Math.PI * 2); engine.ctx.stroke(); engine.ctx.restore();
}
if (now < engine.flashUntil) {
  engine.ctx.fillStyle = `rgba(190,245,255,${(engine.flashUntil - now) / 250})`;
  engine.ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);
}
if (now < engine.shakeUntil) engine.ctx.restore();
}

export function drawPlayer(engine, cw, ch) {
drawCycle(engine, engine.player, cw, ch);
}

export function drawCycle(engine, cycle, cw, ch) {
const radius = Math.min(cw, ch) * .34;
const point = engine.grid.center(cycle.x, cycle.y, engine.canvas.width, engine.canvas.height);
engine.ctx.save(); engine.ctx.translate(point.x, point.y);
const lean = cycle.turnSign * Math.max(0, 1 - (engine.clock.now - cycle.turnAt) / 200) * .26;
engine.ctx.rotate(Math.atan2(cycle.direction.y, cycle.direction.x) + lean);
engine.ctx.fillStyle = "#d8fcff"; engine.ctx.shadowColor = cycle.color; engine.ctx.shadowBlur = 20;
engine.ctx.beginPath(); engine.ctx.moveTo(radius * 1.4, 0); engine.ctx.lineTo(-radius, -radius * .8);
engine.ctx.lineTo(-radius * .65, 0); engine.ctx.lineTo(-radius, radius * .8); engine.ctx.closePath(); engine.ctx.fill(); engine.ctx.restore();
}
