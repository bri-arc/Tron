import { Player } from './Player.js';
import { CollisionEngine } from './CollisionEngine.js';
import { SurvivalPlanner } from './SurvivalPlanner.js';

export class AIOpponent extends Player {
  constructor(id, x, y, color, difficulty) {
    super(id, x, y, color);
    this.alive = true;
    this.difficulty = difficulty;
  }
  choose(arena, trails, opponents) {
    const options = [
      this.direction,
      { x: -this.direction.y, y: this.direction.x },
      { x: this.direction.y, y: -this.direction.x }
    ].filter(candidate => !CollisionEngine.collides(arena, trails, this.x + candidate.x, this.y + candidate.y));
    if (!options.length) return null;
    if (this.difficulty === "expert") {
      return options.map(candidate => {
        const next = { x: this.x + candidate.x, y: this.y + candidate.y };
        return { candidate, value: SurvivalPlanner.rate(next, this, arena, trails, opponents) };
      }).sort((a, b) => b.value - a.value)[0].candidate;
    }
    const nearest = opponents.filter(other => other.alive && other.id !== this.id)
      .sort((a, b) => Math.abs(a.x - this.x) + Math.abs(a.y - this.y) - Math.abs(b.x - this.x) - Math.abs(b.y - this.y))[0];
    const scored = options.map(candidate => {
      const x = this.x + candidate.x, y = this.y + candidate.y;
      let room = 0;
      for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (!CollisionEngine.collides(arena, trails, x + dx, y + dy)) room += 1;
      }
      const distance = nearest ? Math.abs(nearest.x - x) + Math.abs(nearest.y - y) : 0;
      return { candidate, value: room * 5 + (this.difficulty === "hard" ? 7 - Math.min(distance, 7) : 0) };
    }).sort((a, b) => b.value - a.value);
    const choice = this.difficulty === "easy" && scored.length > 1 && Math.random() < .3
      ? scored[Math.floor(Math.random() * scored.length)] : scored[0];
    return choice.candidate;
  }
}
