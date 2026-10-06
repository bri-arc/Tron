import test from "node:test";
import assert from "node:assert/strict";
import { Grid } from "../src/Grid.js";
import { TrailManager } from "../src/TrailManager.js";

test("clearTrail keeps the driver's occupied head cell", () => {
  const trails = new TrailManager(new Grid({ columns: 10, rows: 10 }));
  trails.add(1, 1, "player");
  trails.add(2, 1, "player");
  trails.add(3, 1, "player");
  trails.clearTrail("player");
  assert.equal(trails.has(1, 1), false);
  assert.equal(trails.has(2, 1), false);
  assert.equal(trails.has(3, 1), true);
});

test("bomb radius erases trail segments only and does not eliminate riders", () => {
  const trails = new TrailManager(new Grid({ columns: 10, rows: 10 }));
  const rider = { alive: true, x: 8, y: 8 };
  trails.add(4, 4, "player");
  trails.add(5, 4, "opponent");
  trails.add(8, 8, "opponent");
  trails.eraseRadius(4, 4, 1);
  assert.equal(trails.has(4, 4), false);
  assert.equal(trails.has(5, 4), false);
  assert.equal(trails.has(8, 8), true);
  assert.equal(rider.alive, true);
});
