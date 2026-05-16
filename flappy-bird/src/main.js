import { Game } from './Game.js';
import { preloadAssets } from './Constants.js';

preloadAssets().then(() => {
    const flappyBird = new Game('gameCanvas');
    flappyBird.startLoop();
});