import test from "node:test";
import assert from "node:assert/strict";
import { TurnResolver } from "../src/TurnResolver.js";

const rider = (id, x, y, direction) => ({
  id, x, y, alive: true, direction, next() { return { x: this.x + direction.x, y: this.y + direction.y }; },
  choose() { return direction; }
});
const arena = { isBlocked: () => false };

test("drivers choosing one destination are both eliminated in the same turn", () => {
  const player = rider("player", 1, 1, { x: 1, y: 0 });
  const opponent = rider("opponent", 3, 1, { x: -1, y: 0 });
  const moves = TurnResolver.resolve(player, [opponent], arena, { has: () => false }, null, 0);
  assert.deepEqual(moves.map(move => move.dead), [true, true]);
});

test("ghost ignores trail cells only for the protected rider", () => {
  const player = rider("player", 1, 1, { x: 1, y: 0 });
  const opponent = rider("opponent", 1, 3, { x: 1, y: 0 });
  const trails = { has: (x, y) => x === 2 && (y === 1 || y === 3) };
  const moves = TurnResolver.resolve(player, [opponent], arena, trails, null, 0,
    current => current.id === "player");
  assert.deepEqual(moves.map(move => move.dead), [false, true]);
});
