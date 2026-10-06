import { MovementResolver } from './MovementResolver.js';

export class TurnResolver {
  static resolve(player, opponents, arena, trails, collision, now, canGhost = () => false) {
    const riders = [player, ...opponents].filter(rider => rider.alive !== false);
    const directions = new Map();
    const failedDecisions = [];

    player.next(now);
    directions.set(player.id, player.direction);
    for (const opponent of riders.slice(1)) {
      const direction = opponent.choose(arena, trails, riders);
      if (direction) directions.set(opponent.id, direction);
      else failedDecisions.push({ rider: opponent, direction: opponent.direction, target: { x: opponent.x, y: opponent.y }, dead: true });
    }

    const moves = MovementResolver.resolve(
      riders.filter(rider => directions.has(rider.id)),
      directions,
      (rider, target) => arena.isBlocked(target.x, target.y) ||
        (trails.has(target.x, target.y) && !canGhost(rider, target))
    );
    return [...moves, ...failedDecisions];
  }
}
