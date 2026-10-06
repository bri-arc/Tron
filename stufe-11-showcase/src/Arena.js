export class Arena {
  constructor(grid) { this.grid = grid; this.obstacles = new Set(); this.margin = 0; this.level = 1; }
  reset() { this.obstacles.clear(); this.margin = 0; this.level = 1; }
  configureLevel(level) {
    this.level = level; this.obstacles.clear();
    if (level >= 2 && level % 2 === 0) {
      const wall = Math.floor(this.grid.rows / 2);
      for (let x = 3; x < this.grid.columns - 3; x += 1) {
        if (![9, 19, 29].includes(x)) this.obstacles.add(this.grid.key(x, wall));
      }
    }
    if (level >= 4 && level % 2 === 0) this.margin = 1 + Math.floor((level - 4) / 2);
  }
  isBlocked(x, y) {
    return !this.grid.contains(x, y) || x < this.margin || y < this.margin ||
      x >= this.grid.columns - this.margin || y >= this.grid.rows - this.margin ||
      this.obstacles.has(this.grid.key(x, y));
  }
}
