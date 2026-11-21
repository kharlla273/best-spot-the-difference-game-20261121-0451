# Twin Tides — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/kharlla273/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/kharlla273/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures that look the same, but seven things changed between them. Click a difference in either picture to ring it green — on both panels at once.

Three hand-painted scenes, seven differences each:

- **Harbor Dawn** — sun rays, a seagull, the sail's colour, the lighthouse lamp, a buoy, a jumping fish, the pier flag.
- **Meadow Cottage** — chimney smoke, a lit window, a cat on the fence, a sunflower, a butterfly, the garden gate, a wreath on the door.
- **Starry Camp** — craters on the moon, an owl, the lantern light, the campfire flame, a sparkling star, a flag on the tent, fireflies.

## How to play

- 90 seconds per level, 100 points per difference found, plus a time bonus when you clear a level.
- Hints cost 50 points (3 per level) and circle a difference in gold. Wrong clicks cost 25.
- Press **L** for a 2× magnifier lens, **H** for a hint, **P** to pause, **R** to restart the level.
- Sounds are synthesized live in the browser — no audio files. Your best score is kept in localStorage.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Plain static files under `game/`, no build step, no network requests: `game/index.html` plus ES modules in `game/src/`. `main.ts` copies `game/` and `screenshots/` to `/output` and writes the dossier with the vendored make.fun library.

## Layout

- `game/index.html` — page, header, overlays, styles
- `game/src/config.js` — constants and the three levels' difference lists
- `game/src/random.js` — seeded random numbers
- `game/src/scenes.js` — the three hand-painted scenes (each drawn twice: plain and with differences)
- `game/src/world.js` — the pure game rules (clicks, scoring, hints, timer)
- `game/src/render.js` — panels, rings, header, overlays, magnifier lens
- `game/src/input.js` — mouse, touch and keyboard input
- `game/src/sounds.js` — synthesized Web Audio sounds
- `game/src/shots.js` — deterministic screenshot presets (`?shot=start|play|meadow|victory`)
- `game/src/main.js` — bootstrap and frame loop
- `main.ts` — the entry's hand-in program (Node 22, standard library only)
- `serve.ts` — local static server for development

---

<sub>Entered on [make.fun](https://make.fun/?ref=n305kcfc&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
