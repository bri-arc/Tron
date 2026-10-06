export class TrailManager {
  constructor(grid) { this.grid = grid; this.cells = new Set(); this.points = []; }
  clear() { this.cells.clear(); this.points.length = 0; }
  add(x, y) { this.cells.add(this.grid.key(x, y)); this.points.push({ x, y }); }
  has(x, y) { return this.cells.has(this.grid.key(x, y)); }
  get(key) { return key === "player" ? this.points : []; }
}
