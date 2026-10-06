export class TrailManager {
  constructor(grid) { this.grid = grid; this.cells = new Set(); this.paths = new Map(); }
  clear() { this.cells.clear(); this.paths.clear(); }
  add(x, y, owner = "player") {
    this.cells.add(this.grid.key(x, y));
    if (!this.paths.has(owner)) this.paths.set(owner, []);
    this.paths.get(owner).push({ x, y });
  }
  has(x, y) { return this.cells.has(this.grid.key(x, y)); }
  trim(owner, count) {
    const path = this.paths.get(owner);
    if (!path) return;
    path.splice(0, Math.max(0, path.length - count));
    this.cells = new Set([...this.paths.values()].flat().map(cell => this.grid.key(cell.x, cell.y)));
  }
  clearTrail(owner) { this.trim(owner, 1); }
  eraseRadius(x, y, radius, riders = []) {
    const squaredRadius = radius * radius;
    const occupied = new Set(riders.filter(rider => rider.alive !== false)
      .map(rider => this.grid.key(rider.x, rider.y)));
    for (const [owner, path] of this.paths) {
      this.paths.set(owner, path.filter(cell => occupied.has(this.grid.key(cell.x, cell.y)) ||
        (cell.x - x) ** 2 + (cell.y - y) ** 2 > squaredRadius));
    }
    this.cells = new Set([...this.paths.values()].flat().map(cell => this.grid.key(cell.x, cell.y)));
  }
  erase(owner) {
    this.paths.delete(owner);
    this.cells = new Set([...this.paths.values()].flat().map(cell => this.grid.key(cell.x, cell.y)));
  }
}
