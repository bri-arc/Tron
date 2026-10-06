import test from "node:test";
import assert from "node:assert/strict";
import { MovementResolver } from "../src/MovementResolver.js";

const neverBlocked = () => false;
const rider = (id, x, y) => ({ id, x, y, alive: true });

test("simultaneous same-cell arrivals eliminate both riders", () => {
  const a = rider("a", 0, 1), b = rider("b", 2, 1);
  const moves = MovementResolver.resolve([a, b], new Map([
    ["a", { x: 1, y: 0 }], ["b", { x: -1, y: 0 }]
  ]), neverBlocked);
  assert.deepEqual(moves.map(move => move.dead), [true, true]);
});

test("head-on swaps eliminate both riders and independent moves survive", () => {
  const a = rider("a", 0, 0), b = rider("b", 1, 0), c = rider("c", 3, 2);
  const moves = MovementResolver.resolve([a, b, c], new Map([
    ["a", { x: 1, y: 0 }], ["b", { x: -1, y: 0 }], ["c", { x: 0, y: 1 }]
  ]), neverBlocked);
  assert.deepEqual(moves.map(move => move.dead), [true, true, false]);
});

test("blocked destinations are evaluated without mutating rider state", () => {
  const a = rider("a", 0, 0);
  const moves = MovementResolver.resolve([a], new Map([["a", { x: 1, y: 0 }]]), (_, target) => target.x === 1);
  assert.equal(moves[0].dead, true);
  assert.deepEqual([a.x, a.y], [0, 0]);
});
