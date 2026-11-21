// Twin Tides: the pure game rules. No DOM, no canvas, no sound here,
// so Node can import this file and test every rule on its own.
//
// A game state:
//   status: 'title' | 'playing' | 'paused' | 'levelDone' | 'gameOver' | 'victory'
//   levelIndex, score, hintsLeft, timeLeft, found: Set of diff ids,
//   lastHint: the diff id a hint just circled (or null),
//   levelBonus: time bonus earned when the level was finished.

import {
  LEVELS,
  LEVEL_TIME_SECONDS,
  FIND_POINTS,
  HINT_COST,
  WRONG_CLICK_COST,
  TIME_BONUS_PER_SECOND,
  HINTS_PER_LEVEL,
} from './config.js';

export function levelDiffs(levelIndex) {
  return LEVELS[levelIndex].diffs;
}

export function createGame() {
  return {
    status: 'title',
    levelIndex: 0,
    score: 0,
    hintsLeft: HINTS_PER_LEVEL,
    timeLeft: LEVEL_TIME_SECONDS,
    found: new Set(),
    lastHint: null,
    levelBonus: 0,
    totalFound: 0,
  };
}

export function startLevel(game, levelIndex) {
  game.levelIndex = levelIndex;
  game.status = 'playing';
  game.hintsLeft = HINTS_PER_LEVEL;
  game.timeLeft = LEVEL_TIME_SECONDS;
  game.found = new Set();
  game.lastHint = null;
  game.levelBonus = 0;
  return game;
}

export function startGame(game) {
  game.score = 0;
  game.totalFound = 0;
  return startLevel(game, 0);
}

// Distance from a click (scene coordinates) to the nearest unfound
// difference. Returns the diff or null when nothing is close enough.
export function diffAt(game, x, y) {
  for (const diff of levelDiffs(game.levelIndex)) {
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

// One click on a panel. Returns what happened so the UI can react:
//   { result: 'found', diff } — a new difference, +100 points
//   { result: 'already', diff } — an already-ringed difference, no change
//   { result: 'miss' } — open water, -25 points (score never below 0)
export function clickAt(game, x, y) {
  if (game.status !== 'playing') return { result: 'idle' };
  const diff = diffAt(game, x, y);
  if (!diff) {
    game.score = Math.max(0, game.score - WRONG_CLICK_COST);
    return { result: 'miss' };
  }
  if (game.found.has(diff.id)) return { result: 'already', diff };
  game.found.add(diff.id);
  game.totalFound += 1;
  game.score += FIND_POINTS;
  game.lastHint = null;
  if (game.found.size === levelDiffs(game.levelIndex).length) {
    game.levelBonus = Math.ceil(game.timeLeft) * TIME_BONUS_PER_SECOND;
    game.score += game.levelBonus;
    game.status = game.levelIndex + 1 >= LEVELS.length ? 'victory' : 'levelDone';
  }
  return { result: 'found', diff };
}

// Spend a hint: circles the nearest still-hidden difference for a few
// seconds. Costs 50 points and one of the level's three hints.
export function useHint(game) {
  if (game.status !== 'playing') return null;
  if (game.hintsLeft <= 0) return null;
  const hidden = levelDiffs(game.levelIndex).find((d) => !game.found.has(d.id));
  if (!hidden) return null;
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  game.lastHint = hidden.id;
  return hidden;
}

// Advance the clock by dt seconds. Returns true when time just ran out.
export function tick(game, dt) {
  if (game.status !== 'playing') return false;
  game.timeLeft = Math.max(0, game.timeLeft - dt);
  if (game.timeLeft <= 0) {
    game.status = 'gameOver';
    return true;
  }
  return false;
}

export function foundCount(game) {
  return game.found.size;
}

export function diffsTotal(game) {
  return levelDiffs(game.levelIndex).length;
}

export function pauseGame(game) {
  if (game.status === 'playing') game.status = 'paused';
}

export function resumeGame(game) {
  if (game.status === 'paused') game.status = 'playing';
}

export function nextLevel(game) {
  if (game.status !== 'levelDone') return game;
  return startLevel(game, game.levelIndex + 1);
}
