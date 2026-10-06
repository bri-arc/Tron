export class Player {
  constructor(id, x, y, color) {
    this.id = id; this.x = x; this.y = y; this.color = color;
    this.direction = { x: 1, y: 0 }; this.input = [];
  }
  steer(direction) {
    const planned = this.input.at(-1) ?? this.direction;
    if ((direction.x === -planned.x && direction.y === -planned.y) ||
        (direction.x === planned.x && direction.y === planned.y) || this.input.length >= 2) return;
    this.input.push(direction);
  }
  next() {
    if (this.input.length) this.direction = this.input.shift();
    return { x: this.x + this.direction.x, y: this.y + this.direction.y };
  }
}
