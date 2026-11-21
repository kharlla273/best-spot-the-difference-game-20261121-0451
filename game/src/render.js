// Twin Tides: rendering — the two panels, the rings on found
// differences, the header numbers, the overlay screens, and the
// magnifier lens. All drawing goes through here; the rules live in
// world.js and the art lives in scenes.js.

import { SCENE_W, SCENE_H, LEVELS, BEST_SCORE_KEY } from './config.js';
import { paintScene } from './scenes.js';

const RING_GREEN = '#2fbf5a';
const RING_GOLD = '#ffd76a';

export function loadBestScore() {
  try {
    return Number(window.localStorage.getItem(BEST_SCORE_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Private mode or blocked storage: the game still plays.
  }
}

// A pulsing ring around a found difference, drawn on both panels.
function drawRing(ctx, x, y, r, color, width, pulse) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r + pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// The faint cross that marks a spot the player already found.
function drawTick(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = RING_GREEN;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.1, y + r * 0.35);
  ctx.lineTo(x + r * 0.5, y - r * 0.4);
  ctx.stroke();
  ctx.restore();
}

export class Renderer {
  constructor(leftCanvas, rightCanvas, lensCanvas) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.lens = lensCanvas;
    this.leftCtx = leftCanvas.getContext('2d');
    this.rightCtx = rightCanvas.getContext('2d');
    this.lensCtx = lensCanvas ? lensCanvas.getContext('2d') : null;
    this.hintUntil = 0;
    this.missFlash = null; // { x, y, until } in scene coordinates
    this.magnifierOn = false;
    this.lensTarget = null; // { canvas, x, y } in scene coordinates
  }

  // Paint both panels for the current level, then the rings.
  draw(game, nowMs) {
    const level = LEVELS[game.levelIndex];
    const all = new Set(level.diffs.map((d) => d.id));
    paintScene(this.leftCtx, level.id, new Set());
    paintScene(this.rightCtx, level.id, all);
    for (const diff of level.diffs) {
      if (!game.found.has(diff.id)) continue;
      const pulse = 2 + Math.sin(nowMs / 280) * 1.2;
      drawRing(this.leftCtx, diff.x, diff.y, diff.r, RING_GREEN, 4, pulse);
      drawRing(this.rightCtx, diff.x, diff.y, diff.r, RING_GREEN, 4, pulse);
      drawTick(this.leftCtx, diff.x, diff.y, diff.r);
      drawTick(this.rightCtx, diff.x, diff.y, diff.r);
    }
    // A hint circles its difference in gold until it fades.
    if (game.lastHint && nowMs < this.hintUntil) {
      const diff = level.diffs.find((d) => d.id === game.lastHint);
      if (diff) {
        const pulse = 2 + Math.sin(nowMs / 180) * 2;
        drawRing(this.leftCtx, diff.x, diff.y, diff.r, RING_GOLD, 4, pulse);
        drawRing(this.rightCtx, diff.x, diff.y, diff.r, RING_GOLD, 4, pulse);
      }
    } else if (game.lastHint) {
      game.lastHint = null;
    }
    // A wrong click flashes a small red cross where it landed.
    if (this.missFlash && nowMs < this.missFlash.until) {
      for (const ctx of [this.leftCtx, this.rightCtx]) {
        ctx.save();
        ctx.strokeStyle = '#e2574c';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        const { x, y } = this.missFlash;
        ctx.beginPath();
        ctx.moveTo(x - 9, y - 9);
        ctx.lineTo(x + 9, y + 9);
        ctx.moveTo(x + 9, y - 9);
        ctx.lineTo(x - 9, y + 9);
        ctx.stroke();
        ctx.restore();
      }
    } else {
      this.missFlash = null;
    }
  }

  flashMiss(x, y, nowMs) {
    this.missFlash = { x, y, until: nowMs + 450 };
  }

  showHint(nowMs, seconds = 4) {
    this.hintUntil = nowMs + seconds * 1000;
  }

  // The 2x magnifier lens, following the pointer over a panel.
  drawLens() {
    if (!this.lens || !this.lensCtx) return;
    const target = this.lensTarget;
    if (!this.magnifierOn || !target) {
      this.lens.style.display = 'none';
      return;
    }
    const size = 180;
    const half = 44; // half of the 88px scene patch shown at 2x
    const source = target.canvas === 'left' ? this.left : this.right;
    const ctx = this.lensCtx;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(source, target.x - half, target.y - half, half * 2, half * 2, 0, 0, size, size);
    ctx.restore();
    ctx.strokeStyle = '#2f6e8f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    ctx.stroke();
    this.lens.style.display = 'block';
  }
}

// ---- header and overlay text -------------------------------------------

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function updateHeader(elements, game, best) {
  const level = LEVELS[game.levelIndex];
  elements.levelName.textContent = `Level ${game.levelIndex + 1} of ${LEVELS.length} · ${level.name}`;
  elements.found.textContent = `Found ${game.found.size} / ${level.diffs.length}`;
  elements.timer.textContent = formatTime(game.timeLeft);
  elements.timer.classList.toggle('low', game.timeLeft <= 15 && game.status === 'playing');
  elements.score.textContent = `Score ${game.score}`;
  elements.best.textContent = `Best ${Math.max(best, game.score)}`;
  elements.hintButton.textContent = `Hint (${game.hintsLeft})`;
  elements.hintButton.disabled = game.hintsLeft <= 0 || game.status !== 'playing';
}

export function showOverlay(elements, id) {
  for (const overlay of elements.overlays) overlay.classList.add('hidden');
  if (id) {
    const el = elements.overlays.find((o) => o.id === `overlay-${id}`);
    if (el) el.classList.remove('hidden');
  }
}

export function setLevelDoneText(elements, game) {
  elements.levelDoneTitle.textContent = `${LEVELS[game.levelIndex].name} complete!`;
  elements.levelDoneBody.textContent =
    `All 7 differences found. Time bonus +${game.levelBonus} — score ${game.score}.`;
  elements.levelDoneButton.textContent =
    game.levelIndex + 1 >= LEVELS.length ? 'See results' : 'Next level';
}

export function setGameOverText(elements, game) {
  elements.gameOverBody.textContent =
    `Time ran out with ${game.found.size} of ${LEVELS[game.levelIndex].diffs.length} differences found. Score ${game.score}.`;
}

export function setVictoryText(elements, game, best, isNewBest) {
  elements.victoryBody.textContent =
    `All three scenes cleared — ${game.totalFound} differences found, final score ${game.score}.` +
    (isNewBest ? ' A new best score!' : ` Best score ${best}.`);
}
