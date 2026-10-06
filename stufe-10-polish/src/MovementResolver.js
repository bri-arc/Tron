export class MovementResolver {
  static resolve(riders, directions, isBlocked) {
    const activeRiders = riders.filter(rider => rider.alive !== false);
    const occupied = new Set(activeRiders.map(rider => `${rider.x},${rider.y}`));
    const moves = activeRiders.map(rider => {
      const direction = directions.get(rider.id);
      const target = { x: rider.x + direction.x, y: rider.y + direction.y };
      return { rider, direction, target, dead: isBlocked(rider, target) || occupied.has(`${target.x},${target.y}`) };
    });

    for (let first = 0; first < moves.length; first += 1) {
      for (let second = first + 1; second < moves.length; second += 1) {
        const a = moves[first], b = moves[second];
        const sameDestination = a.target.x === b.target.x && a.target.y === b.target.y;
        const headOnSwap = a.target.x === b.rider.x && a.target.y === b.rider.y &&
          b.target.x === a.rider.x && b.target.y === a.rider.y;
        if (sameDestination || headOnSwap) a.dead = b.dead = true;
      }
    }

    return moves;
  }
}
