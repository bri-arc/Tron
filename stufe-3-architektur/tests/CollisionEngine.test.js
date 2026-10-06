import test from "node:test";
import assert from "node:assert/strict";
import { Arena } from "../src/Arena.js";
import { CollisionEngine } from "../src/CollisionEngine.js";
import { Grid } from "../src/Grid.js";
import { TrailManager } from "../src/TrailManager.js";

test("grid collision rules detect walls and trail cells without browser APIs", () => {
  const grid = new Grid({ columns: 4, rows: 4 });
  const arena = new Arena(grid);
  const trails = new TrailManager(grid);
  trails.add(2, 2);
  assert.equal(CollisionEngine.collides(arena, trails, 1, 1), false);
  assert.equal(CollisionEngine.collides(arena, trails, 2, 2), true);
  assert.equal(CollisionEngine.collides(arena, trails, -1, 1), true);
});

test("stage 3 starts with the unchanged one-life gameplay configuration", async () => {
  const { GAME_CONFIG } = await import("../src/config.js");
  assert.equal(GAME_CONFIG.player.lives, 1);
});
