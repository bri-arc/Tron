const DURATION_MS = 6500;
const BOMB_RADIUS = 6;

export class PowerUpEffects {
  static apply(item, { now, effects, trails, player, riders = [player] }) {
    if (item.type === "speed") effects.speedUntil = now + DURATION_MS;
    if (item.type === "slow") effects.slowUntil = now + DURATION_MS;
    if (item.type === "shield") effects.shield = true;
    if (item.type === "clear") trails.clearTrail(player.id);
    if (item.type === "ghost") effects.ghostUntil = now + DURATION_MS;
    if (item.type === "bomb") trails.eraseRadius(player.x, player.y, BOMB_RADIUS, riders);
    if (item.type === "multiplier") effects.multiplierUntil = now + DURATION_MS;
  }
}
