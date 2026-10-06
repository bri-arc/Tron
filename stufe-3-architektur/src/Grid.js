export class Grid {
  constructor(config) { this.columns = config.columns; this.rows = config.rows; }
  key(x, y) { return `${x},${y}`; }
  contains(x, y) { return x >= 0 && x < this.columns && y >= 0 && y < this.rows; }
  center(x, y, width, height) { return { x: (x + .5) * width / this.columns, y: (y + .5) * height / this.rows }; }
}
