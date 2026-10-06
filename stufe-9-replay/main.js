import { GameEngine } from './src/GameEngine.js';
import { initCrashScene } from './src/CrashScene.js';
import { initMultiplayer } from './src/MultiplayerClient.js';
import { GameClock } from './src/GameClock.js';
const clock = new GameClock();
new GameEngine({ clock });
initCrashScene(clock);
initMultiplayer();
