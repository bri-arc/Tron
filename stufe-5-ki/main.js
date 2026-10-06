import { GameEngine } from './src/GameEngine.js';
import { GameClock } from './src/GameClock.js';
const clock = new GameClock();
new GameEngine({ clock });
