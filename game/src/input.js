// Twin Tides: mouse, touch and keyboard input. Converts a pointer event
// on either panel into scene coordinates and hands the click to the
// rules in world.js; the caller decides what each outcome does.

import { SCENE_W, SCENE_H } from './config.js';

// Map a pointer event on a canvas to 640x480 scene coordinates.
export function eventToScene(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * SCENE_W;
  const y = ((event.clientY - rect.top) / rect.height) * SCENE_H;
  return { x, y };
}

// Attach click handling to both panels. `onClick(x, y, side)` runs for
// every click while the game is playing; returns the world result.
export function attachPanelClicks(leftCanvas, rightCanvas, onClick) {
  for (const [canvas, side] of [[leftCanvas, 'left'], [rightCanvas, 'right']]) {
    canvas.addEventListener('click', (event) => {
      const { x, y } = eventToScene(canvas, event);
      onClick(x, y, side);
    });
  }
}

// Attach the magnifier: while it is on, the lens follows the pointer
// over either panel. `onMove(target)` receives { canvas, x, y } in scene
// coordinates, or null when the pointer leaves the panels.
export function attachLensTracking(leftCanvas, rightCanvas, onMove) {
  for (const [canvas, side] of [[leftCanvas, 'left'], [rightCanvas, 'right']]) {
    canvas.addEventListener('pointermove', (event) => {
      const { x, y } = eventToScene(canvas, event);
      onMove({ canvas: side, x, y, clientX: event.clientX, clientY: event.clientY });
    });
    canvas.addEventListener('pointerleave', () => onMove(null));
  }
}

// Keyboard shortcuts: L toggles the magnifier, H asks for a hint,
// P or Escape pauses, R restarts the level, Enter starts the game.
export function attachKeyboard(actions) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'l') actions.toggleMagnifier();
    else if (key === 'h') actions.hint();
    else if (key === 'p' || key === 'escape') actions.togglePause();
    else if (key === 'r') actions.restart();
    else if (key === 'enter') actions.confirm();
  });
}
