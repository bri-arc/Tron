import test from "node:test";
import assert from "node:assert/strict";
import { Grid } from "../src/Grid.js";
import { PowerUpEffects } from "../src/PowerUpEffects.js";
import { TrailManager } from "../src/TrailManager.js";

test("bomb removes nearby trail but preserves live rider cells", () => {
  const trails = new TrailManager(new Grid({ columns: 12, rows: 12 }));
  const player = { id: "player", x: 4, y: 4, alive: true };
  const opponent = { id: "opponent", x: 6, y: 4, alive: true };
  trails.add(3, 4, player.id);
  trails.add(4, 4, player.id);
  trails.add(5, 4, opponent.id);
  trails.add(6, 4, opponent.id);
  const effects = {};

  PowerUpEffects.apply({ type: "bomb" }, { now: 100, effects, trails, player, riders: [player, opponent] });

  assert.equal(trails.has(3, 4), false);
  assert.equal(trails.has(5, 4), false);
  assert.equal(trails.has(4, 4), true);
  assert.equal(trails.has(6, 4), true);
  assert.equal(player.alive, true);
  assert.equal(opponent.alive, true);
});

test("speed and slow power-ups share the paused game-clock timeline", () => {
  const effects = {};
  const context = { now: 250, effects, trails: {}, player: { id: "player", x: 0, y: 0 } };

  PowerUpEffects.apply({ type: "speed" }, context);
  PowerUpEffects.apply({ type: "slow" }, context);

  assert.equal(effects.speedUntil, 6750);
  assert.equal(effects.slowUntil, 6750);
});

test("trail erase keeps the player head and other riders' trails", () => {
  const trails = new TrailManager(new Grid({ columns: 12, rows: 12 }));
  const player = { id: "player", x: 2, y: 1, alive: true };
  trails.add(1, 1, player.id); trails.add(2, 1, player.id);
  trails.add(6, 6, "opponent");

  PowerUpEffects.apply({ type: "clear" }, { now: 0, effects: {}, trails, player });

  assert.equal(trails.has(1, 1), false);
  assert.equal(trails.has(2, 1), true);
  assert.equal(trails.has(6, 6), true);
});
