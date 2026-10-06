export class TrailManager {
  constructor(grid) { this.grid = grid; this.cells = new Set(); this.paths = new Map(); }
  clear() { this.cells.clear(); this.paths.clear(); }
  add(x, y, owner = "player") {
    this.cells.add(this.grid.key(x, y));
    if (!this.paths.has(owner)) this.paths.set(owner, []);
    this.paths.get(owner).push({ x, y });
  }
  has(x, y) { return this.cells.has(this.grid.key(x, y)); }
  erase(owner) {
    this.paths.delete(owner);
    this.cells = new Set([...this.paths.values()].flat().map(cell => this.grid.key(cell.x, cell.y)));
  }
}
