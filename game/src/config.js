// Twin Tides — Spot the Difference: shared constants and level data.
// One clear job: everything the game tunes lives here, so the other
// modules never hard-code a number or a difference position.

export const SCENE_W = 640;
export const SCENE_H = 480;

export const LEVEL_TIME_SECONDS = 90;
export const FIND_POINTS = 100;
export const HINT_COST = 50;
export const WRONG_CLICK_COST = 25;
export const TIME_BONUS_PER_SECOND = 5;
export const HINTS_PER_LEVEL = 3;

export const BEST_SCORE_KEY = 'twin-tides-best-score';

// Each difference: an id, a short label for the hint line, and the spot
// (in 640x480 scene coordinates) a click must land near, with its radius.
export const LEVELS = [
  {
    id: 'harbor',
    name: 'Harbor Dawn',
    seed: 20261121,
    blurb: 'First light over the fishing harbor. Seven things changed overnight.',
    diffs: [
      { id: 'rays', label: 'Sun rays', x: 520, y: 92, r: 48 },
      { id: 'gull', label: 'An extra seagull', x: 182, y: 108, r: 30 },
      { id: 'sail', label: 'The sail colour', x: 302, y: 296, r: 42 },
      { id: 'lamp', label: 'The lighthouse lamp', x: 88, y: 122, r: 30 },
      { id: 'buoy', label: 'A buoy in the water', x: 468, y: 382, r: 26 },
      { id: 'fish', label: 'A jumping fish', x: 392, y: 348, r: 30 },
      { id: 'flag', label: 'The pier flag', x: 560, y: 252, r: 26 },
    ],
  },
  {
    id: 'meadow',
    name: 'Meadow Cottage',
    seed: 20261122,
    blurb: 'A quiet cottage at the edge of the meadow. Something is different here.',
    diffs: [
      { id: 'smoke', label: 'Chimney smoke', x: 152, y: 108, r: 34 },
      { id: 'window', label: 'A lit window', x: 332, y: 198, r: 30 },
      { id: 'cat', label: 'A cat on the fence', x: 482, y: 328, r: 28 },
      { id: 'sunflower', label: 'A sunflower', x: 560, y: 360, r: 30 },
      { id: 'butterfly', label: 'A butterfly', x: 222, y: 330, r: 24 },
      { id: 'gate', label: 'The garden gate', x: 420, y: 382, r: 30 },
      { id: 'wreath', label: 'A wreath on the door', x: 300, y: 262, r: 26 },
    ],
  },
  {
    id: 'camp',
    name: 'Starry Camp',
    seed: 20261123,
    blurb: 'A campfire under a wide night sky. The stars are playing tricks.',
    diffs: [
      { id: 'craters', label: 'Craters on the moon', x: 520, y: 92, r: 40 },
      { id: 'owl', label: 'An owl on the branch', x: 142, y: 142, r: 30 },
      { id: 'lantern', label: 'The lantern light', x: 330, y: 330, r: 28 },
      { id: 'flame', label: 'The campfire flame', x: 320, y: 402, r: 34 },
      { id: 'star', label: 'A sparkling star', x: 202, y: 82, r: 26 },
      { id: 'tentflag', label: 'A flag on the tent', x: 450, y: 242, r: 26 },
      { id: 'fireflies', label: 'Fireflies', x: 182, y: 380, r: 30 },
    ],
  },
];
