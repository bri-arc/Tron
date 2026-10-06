export function pollGamepad(engine, now) {
  if (now - engine.lastGamepadPoll < 90) return;
  engine.lastGamepadPoll = now;
  const pad = navigator.getGamepads?.()[0];
  if (!pad) { engine.gamepadDirection = null; engine.gamepadButtons.clear(); return; }
  const pressed = index => Boolean(pad.buttons[index]?.pressed);
  if (pressed(0) && !engine.gamepadButtons.has(0) && engine.state !== "playing") engine.start();
  if (pressed(9) && !engine.gamepadButtons.has(9) && (engine.state === "playing" || engine.state === "paused")) engine.togglePause();
  engine.gamepadButtons = new Set([0, 9].filter(pressed));
  const [axisX = 0, axisY = 0] = pad.axes;
  const vector = Math.abs(axisX) > .55 ? (axisX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 })
    : Math.abs(axisY) > .55 ? (axisY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 })
      : pressed(12) ? { x: 0, y: -1 } : pressed(13) ? { x: 0, y: 1 }
        : pressed(14) ? { x: -1, y: 0 } : pressed(15) ? { x: 1, y: 0 } : null;
  const id = vector ? `${vector.x},${vector.y}` : null;
  if (vector && id !== engine.gamepadDirection && engine.state === "playing") engine.player.steer(vector);
  engine.gamepadDirection = id;
}
