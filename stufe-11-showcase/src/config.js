// Shared tuning values for this version.
export const GAME_CONFIG = Object.freeze({
    grid: Object.freeze({ columns: 40, rows: 24 }),
    timing: Object.freeze({ tickMs: 125, accelerationStep: 24, minimumTickMs: 58, accelerationMs: 4 }),
    player: Object.freeze({ lives: 1, startX: 0.25, color: "#43eaff" }),
    scoring: Object.freeze({ cell: 10, survivalSecond: 2 }),
    keys: Object.freeze({ ArrowUp: [0, -1], ArrowRight: [1, 0], ArrowDown: [0, 1], ArrowLeft: [-1, 0] })
  });
