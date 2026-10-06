export class CollisionEngine {
  static collides(arena, trails, x, y) { return arena.isBlocked(x, y) || trails.has(x, y); }
}
