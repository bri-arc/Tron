export class PowerUpManager {
  constructor(grid) {
    this.grid = grid; this.item = null; this.lastSpawn = 0; this.nextAt = 0;
    this.definitions = [
      { type: "speed", icon: "S", color: "#42ecff", weight: 36, label: "SPEED BOOST" },
      { type: "slow", icon: "T", color: "#8e9cff", weight: 20, label: "SLOW MOTION" },
      { type: "shield", icon: "D", color: "#ffe77a", weight: 12, label: "SHIELD" },
      { type: "clear", icon: "E", color: "#9aff9e", weight: 12, label: "TRAIL ERASE" },
      { type: "ghost", icon: "G", color: "#dd9cff", weight: 9, label: "GHOST MODE" },
      { type: "bomb", icon: "B", color: "#ff795c", weight: 7, label: "GRID BOMB" },
      { type: "multiplier", icon: "×", color: "#ff9bd4", weight: 4, label: "2× MULTIPLIER" }
    ];
  }
  reset(now) { this.item = null; this.lastSpawn = now; this.nextAt = now + 7000; }
  update(now, trails, arena) {
    if (this.item || now < this.nextAt) return;
    const roll = Math.random() * this.definitions.reduce((sum, item) => sum + item.weight, 0);
    let total = 0;
    const definition = this.definitions.find(item => (total += item.weight) > roll);
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const x = Math.floor(Math.random() * this.grid.columns), y = Math.floor(Math.random() * this.grid.rows);
      if (!arena.isBlocked(x, y) && !trails.has(x, y)) {
        this.item = { ...definition, x, y };
        return;
      }
    }
    this.nextAt = now + 1800;
  }
  collect(x, y, now = 0) {
    if (!this.item || this.item.x !== x || this.item.y !== y) return null;
    const item = this.item;
    this.item = null;
    this.lastSpawn = now;
    this.nextAt = this.lastSpawn + 7000;
    return item;
  }
  draw(ctx, grid, canvas, now) {
    if (!this.item) return;
    const point = grid.center(this.item.x, this.item.y, canvas.width, canvas.height);
    const pulse = 1 + Math.sin(now / 150) * .14;
    ctx.save(); ctx.translate(point.x, point.y); ctx.scale(pulse, pulse);
    ctx.fillStyle = `${this.item.color}33`; ctx.strokeStyle = this.item.color; ctx.lineWidth = 2;
    ctx.shadowColor = this.item.color; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 10px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(this.item.icon, 0, 1);
    ctx.restore();
  }
}
