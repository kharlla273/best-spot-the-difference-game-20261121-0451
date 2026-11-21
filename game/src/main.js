// Twin Tides — Spot the Difference: bootstrap and game loop.
// Wires the pure rules (world.js), the painters (scenes.js via
// render.js), input and sounds together, and runs the frame loop.

import { LEVELS } from './config.js';
import {
  createGame,
  startGame,
  startLevel,
  clickAt,
  useHint,
  tick,
  pauseGame,
  resumeGame,
  nextLevel,
} from './world.js';
import {
  Renderer,
  loadBestScore,
  saveBestScore,
  updateHeader,
  showOverlay,
  setLevelDoneText,
  setGameOverText,
  setVictoryText,
} from './render.js';
import { attachPanelClicks, attachLensTracking, attachKeyboard } from './input.js';
import {
  playClick,
  playFind,
  playWrong,
  playHint,
  playLevelDone,
  playVictory,
  playGameOver,
  setMuted,
  isMuted,
} from './sounds.js';
import { shotFromUrl, applyShot } from './shots.js';

const $ = (id) => document.getElementById(id);

const game = createGame();
let best = loadBestScore();
let frozenTimeMs = null; // screenshot mode: the clock and pulse freeze

const elements = {
  levelName: $('level-name'),
  found: $('found-count'),
  timer: $('timer'),
  score: $('score'),
  best: $('best-score'),
  hintButton: $('hint-button'),
  magnifierButton: $('magnifier-button'),
  pauseButton: $('pause-button'),
  restartButton: $('restart-button'),
  soundButton: $('sound-button'),
  overlays: [...document.querySelectorAll('.overlay')],
  levelDoneTitle: $('level-done-title'),
  levelDoneBody: $('level-done-body'),
  levelDoneButton: $('level-done-button'),
  gameOverBody: $('game-over-body'),
  victoryBody: $('victory-body'),
  hintLine: $('hint-line'),
};

const renderer = new Renderer($('panel-left'), $('panel-right'), $('lens'));

function refreshBest() {
  if (game.score > best) {
    best = game.score;
    saveBestScore(best);
    return true;
  }
  return false;
}

function refreshHeader() {
  updateHeader(elements, game, best);
}

function showScreenForStatus() {
  if (game.status === 'title') showOverlay(elements, 'title');
  else if (game.status === 'paused') showOverlay(elements, 'pause');
  else if (game.status === 'levelDone') {
    setLevelDoneText(elements, game);
    showOverlay(elements, 'level-done');
  } else if (game.status === 'gameOver') {
    setGameOverText(elements, game);
    showOverlay(elements, 'game-over');
  } else if (game.status === 'victory') {
    const isNewBest = refreshBest();
    setVictoryText(elements, game, best, isNewBest);
    showOverlay(elements, 'victory');
  } else {
    showOverlay(elements, null);
  }
  refreshHeader();
}

function onPanelClick(x, y) {
  if (game.status !== 'playing') return;
  const outcome = clickAt(game, x, y);
  if (outcome.result === 'found') {
    playFind();
    elements.hintLine.textContent = `Found it — ${outcome.diff.label}!`;
    if (game.status === 'levelDone') {
      playLevelDone();
      showScreenForStatus();
    } else if (game.status === 'victory') {
      playVictory();
      showScreenForStatus();
    }
  } else if (outcome.result === 'already') {
    playClick();
    elements.hintLine.textContent = 'Already found — keep looking!';
  } else if (outcome.result === 'miss') {
    playWrong();
    renderer.flashMiss(x, y, performance.now());
    elements.hintLine.textContent = 'Not a difference — minus 25 points.';
  }
  refreshHeader();
}

function doHint() {
  if (game.status !== 'playing') return;
  const diff = useHint(game);
  if (!diff) {
    elements.hintLine.textContent = game.hintsLeft <= 0
      ? 'No hints left on this level.'
      : 'Nothing left to hint at.';
    return;
  }
  playHint();
  renderer.showHint(performance.now(), 4);
  elements.hintLine.textContent = `Hint: look near the ${diff.label.toLowerCase()} (−50 points).`;
  refreshHeader();
}

function toggleMagnifier() {
  renderer.magnifierOn = !renderer.magnifierOn;
  elements.magnifierButton.classList.toggle('active', renderer.magnifierOn);
  elements.magnifierButton.textContent = renderer.magnifierOn ? 'Lens on (L)' : 'Lens (L)';
  if (!renderer.magnifierOn) renderer.lensTarget = null;
}

function togglePause() {
  if (game.status === 'playing') {
    pauseGame(game);
    showScreenForStatus();
  } else if (game.status === 'paused') {
    resumeGame(game);
    showScreenForStatus();
  }
}

function restartLevel() {
  startLevel(game, game.levelIndex);
  elements.hintLine.textContent = 'Level restarted — find all 7 differences.';
  showScreenForStatus();
}

function confirm() {
  if (game.status === 'title') {
    startGame(game);
    showScreenForStatus();
  } else if (game.status === 'levelDone') {
    nextLevel(game);
    showScreenForStatus();
  } else if (game.status === 'gameOver') {
    restartLevel();
  } else if (game.status === 'victory') {
    startGame(game);
    showScreenForStatus();
  }
}

// ---- wire up the buttons ----------------------------------------------
$('start-button').addEventListener('click', () => {
  playClick();
  startGame(game);
  showScreenForStatus();
});
$('resume-button').addEventListener('click', () => {
  playClick();
  resumeGame(game);
  showScreenForStatus();
});
$('pause-restart-button').addEventListener('click', () => {
  playClick();
  restartLevel();
});
elements.levelDoneButton.addEventListener('click', () => {
  playClick();
  if (game.status === 'levelDone') {
    nextLevel(game);
    showScreenForStatus();
  }
});
$('retry-button').addEventListener('click', () => {
  playClick();
  restartLevel();
});
$('victory-button').addEventListener('click', () => {
  playClick();
  startGame(game);
  showScreenForStatus();
});
elements.hintButton.addEventListener('click', doHint);
elements.magnifierButton.addEventListener('click', toggleMagnifier);
elements.pauseButton.addEventListener('click', togglePause);
elements.restartButton.addEventListener('click', restartLevel);
elements.soundButton.addEventListener('click', () => {
  setMuted(!isMuted());
  elements.soundButton.textContent = isMuted() ? 'Sound off' : 'Sound on';
  if (!isMuted()) playClick();
});

attachPanelClicks($('panel-left'), $('panel-right'), onPanelClick);
attachLensTracking($('panel-left'), $('panel-right'), (target) => {
  renderer.lensTarget = target;
  const lens = $('lens');
  if (target && renderer.magnifierOn) {
    lens.style.left = `${target.clientX + 18}px`;
    lens.style.top = `${target.clientY - 190}px`;
  }
});
attachKeyboard({
  toggleMagnifier,
  hint: doHint,
  togglePause,
  restart: restartLevel,
  confirm,
});

// ---- screenshot presets (?shot=...) -------------------------------------
const shot = shotFromUrl();
if (shot) {
  const preset = applyShot(game, shot);
  if (preset) frozenTimeMs = preset.frozenTimeMs;
}

// ---- frame loop ----------------------------------------------------------
let lastTick = performance.now();

function frame(now) {
  const dt = Math.min(0.1, (now - lastTick) / 1000);
  lastTick = now;
  const clock = frozenTimeMs ?? now;
  if (frozenTimeMs === null && game.status === 'playing') {
    if (tick(game, dt)) {
      playGameOver();
      showScreenForStatus();
    }
  }
  renderer.draw(game, clock);
  renderer.drawLens();
  if (game.status === 'playing') refreshHeader();
  requestAnimationFrame(frame);
}

showScreenForStatus();
requestAnimationFrame(frame);
