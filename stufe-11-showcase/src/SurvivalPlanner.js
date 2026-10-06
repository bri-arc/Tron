export class SurvivalPlanner {
  static distances(start, arena, trails) {
    const queue = [start];
    const distances = new Map([[arena.grid.key(start.x, start.y), 0]]);
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const cell = queue[cursor], distance = distances.get(arena.grid.key(cell.x, cell.y));
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = cell.x + dx, y = cell.y + dy, key = arena.grid.key(x, y);
        if (arena.isBlocked(x, y) || trails.has(x, y) || distances.has(key)) continue;
        distances.set(key, distance + 1);
        queue.push({ x, y });
      }
    }
    return distances;
  }
  static rate(candidate, self, arena, trails, riders) {
    const reachable = this.distances(candidate, arena, trails);
    const rivals = riders.filter(rider => rider.alive !== false && rider.id !== self.id);
    const rivalDistances = rivals.map(rider => this.distances(rider, arena, trails));
    let territory = 0;
    for (const [key, distance] of reachable) {
      const nearestRival = Math.min(Infinity, ...rivalDistances.map(map => map.get(key) ?? Infinity));
      if (distance < nearestRival) territory += 1;
    }
    return reachable.size * 2 + territory * 4;
  }
}
