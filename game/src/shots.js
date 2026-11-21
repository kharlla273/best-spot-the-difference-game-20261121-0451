// Twin Tides: screenshot presets. The screenshots in screenshots/ are
// taken by loading the game with ?shot=<name>&seed=1 — this module reads
// that query and freezes the game in a photogenic, deterministic state
// (no ticking clock, no animations mid-flight) so the render is the
// same every time it is taken.
//
//   ?shot=start    title screen over Harbor Dawn
//   ?shot=play     Harbor Dawn mid-hunt, 3 of 7 found
//   ?shot=meadow   Meadow Cottage mid-hunt, 2 of 7 found
//   ?shot=victory  the victory screen after all three scenes

import { LEVELS } from './config.js';
import { startLevel, startGame } from './world.js';

export function shotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('shot');
}

export function applyShot(game, shot) {
  if (!shot) return null;
  if (shot === 'start') {
    startLevel(game, 0);
    game.status = 'title';
    game.timeLeft = 90;
    return { frozenTimeMs: 1200 };
  }
  if (shot === 'play') {
    startGame(game);
    startLevel(game, 0);
    game.score = 300;
    game.timeLeft = 63;
    for (const id of ['rays', 'sail', 'buoy']) game.found.add(id);
    return { frozenTimeMs: 1200 };
  }
  if (shot === 'meadow') {
    startGame(game);
    game.score = 500;
    startLevel(game, 1);
    game.score = 500;
    game.timeLeft = 47;
    for (const id of ['smoke', 'cat']) game.found.add(id);
    return { frozenTimeMs: 1200 };
  }
  if (shot === 'victory') {
    startGame(game);
    game.score = 2140;
    game.totalFound = 21;
    game.status = 'victory';
    game.levelIndex = 2;
    for (const diff of LEVELS[2].diffs) game.found.add(diff.id);
    return { frozenTimeMs: 1200 };
  }
  return null;
}
