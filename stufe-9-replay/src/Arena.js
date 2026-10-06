export class Arena {
  constructor(grid) { this.grid = grid; this.obstacles = new Set(); }
  reset() { this.obstacles.clear(); }
  isBlocked(x, y) { return !this.grid.contains(x, y) || this.obstacles.has(this.grid.key(x, y)); }
}
