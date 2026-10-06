import test from "node:test";
import assert from "node:assert/strict";
import { GameClock } from "../src/GameClock.js";

test("GameClock freezes elapsed simulation time while paused", () => {
  const clock = new GameClock();
  clock.reset(10);
  assert.equal(clock.advance(20), 10);
  clock.pause();
  assert.equal(clock.advance(1020), 10);
  assert.equal(clock.delta, 0);
  clock.resume(1020);
  assert.equal(clock.advance(1045), 35);
});

test("GameClock clamps large frame gaps and resets deterministically", () => {
  const clock = new GameClock();
  clock.reset(0);
  clock.advance(1000, 50);
  assert.equal(clock.now, 50);
  assert.equal(clock.delta, 50);
  clock.reset(1200);
  assert.equal(clock.now, 0);
  assert.equal(clock.advance(1210), 10);
});
