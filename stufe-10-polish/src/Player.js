export class Player {
  constructor(id, x, y, color) {
    this.id = id; this.x = x; this.y = y; this.color = color;
    this.direction = { x: 1, y: 0 }; this.input = []; this.alive = true; this.turnAt = 0; this.turnSign = 0;
  }
  steer(direction) {
    const planned = this.input.at(-1) ?? this.direction;
    if ((direction.x === -planned.x && direction.y === -planned.y) ||
        (direction.x === planned.x && direction.y === planned.y) || this.input.length >= 2) return;
    this.input.push(direction);
  }
  next(now = 0) {
    if (this.input.length) {
      const next = this.input.shift();
      if (next.x !== this.direction.x || next.y !== this.direction.y) {
        this.turnSign = this.direction.x * next.y - this.direction.y * next.x;
        this.turnAt = now;
      }
      this.direction = next;
    }
    return { x: this.x + this.direction.x, y: this.y + this.direction.y };
  }
}
