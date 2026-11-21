// Twin Tides: the three hand-painted scenes. Every scene is drawn twice
// — once plain, once with its seven differences — from the same painter.
// `variant` is a Set of difference ids that are switched ON in this panel:
// the left panel paints with an empty set, the right panel with all seven.
// Decorative scatter (stars, clouds, flowers) comes from a seeded random
// generator, so both panels agree on everything except the differences.

import { SCENE_W, SCENE_H } from './config.js';
import { mulberry32, range } from './random.js';

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

// A soft round glow: a radial gradient disc.
function glow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  circle(ctx, x, y, r);
}

// ---------------------------------------------------------------- harbor
function paintHarbor(ctx, variant) {
  const rand = mulberry32(20261121);

  // Dawn sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#ffe3b3');
  sky.addColorStop(0.45, '#ffd1a1');
  sky.addColorStop(1, '#bcd9e8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_W, 300);

  // Sun, low over the water.
  ctx.fillStyle = '#fff3c4';
  glow(ctx, 520, 92, 86, 'rgba(255, 214, 130, 0.85)');
  circle(ctx, 520, 92, 34);
  ctx.fillStyle = '#ffdf8a';
  circle(ctx, 520, 92, 26);
  if (variant.has('rays')) {
    ctx.strokeStyle = '#ffcf5e';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      line(ctx, 520 + Math.cos(a) * 40, 92 + Math.sin(a) * 40,
        520 + Math.cos(a) * 56, 92 + Math.sin(a) * 56);
    }
  }

  // Drifting clouds.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 4; i++) {
    const cx = 60 + rand() * 420;
    const cy = 40 + rand() * 90;
    ellipse(ctx, cx, cy, 46, 14);
    ellipse(ctx, cx + 26, cy + 5, 34, 11);
  }

  // Seagulls: three always there, one extra in the variant panel.
  ctx.strokeStyle = '#5a6b7a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  const gulls = [[120, 70], [250, 55], [330, 96]];
  if (variant.has('gull')) gulls.push([182, 108]);
  for (const [gx, gy] of gulls) {
    ctx.beginPath();
    ctx.moveTo(gx - 11, gy);
    ctx.quadraticCurveTo(gx - 4, gy - 8, gx, gy);
    ctx.quadraticCurveTo(gx + 4, gy - 8, gx + 11, gy);
    ctx.stroke();
  }

  // Sea.
  const sea = ctx.createLinearGradient(0, 280, 0, SCENE_H);
  sea.addColorStop(0, '#7fb8c9');
  sea.addColorStop(1, '#2e6f8e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 280, SCENE_W, SCENE_H - 280);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 14; i++) {
    const wy = 300 + rand() * 160;
    const wx = rand() * SCENE_W;
    line(ctx, wx, wy, wx + 26 + rand() * 30, wy);
  }
  // Sun path on the water.
  ctx.fillStyle = 'rgba(255, 223, 138, 0.35)';
  poly(ctx, [[492, 300], [548, 300], [580, 470], [460, 470]]);

  // Distant headland.
  ctx.fillStyle = '#8fa8b5';
  poly(ctx, [[0, 300], [0, 268], [90, 262], [170, 300]]);

  // Lighthouse on the headland.
  ctx.fillStyle = '#f4ede0';
  ctx.fillRect(72, 150, 32, 118);
  ctx.fillStyle = '#d95f4b';
  ctx.fillRect(72, 168, 32, 14);
  ctx.fillRect(72, 204, 32, 14);
  ctx.fillRect(72, 240, 32, 14);
  ctx.fillStyle = '#3d4a55';
  ctx.fillRect(66, 138, 44, 14);
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(78, 118, 20, 20);
  if (variant.has('lamp')) {
    glow(ctx, 88, 128, 46, 'rgba(255, 215, 106, 0.9)');
    ctx.fillStyle = '#fff6c8';
    circle(ctx, 88, 128, 12);
    ctx.strokeStyle = 'rgba(255, 215, 106, 0.7)';
    ctx.lineWidth = 3;
    line(ctx, 88, 128, 30, 108);
    line(ctx, 88, 128, 150, 104);
  }
  ctx.fillStyle = '#3d4a55';
  poly(ctx, [[66, 138], [110, 138], [88, 112]]);

  // The little sailboat.
  ctx.fillStyle = '#7a4a2b';
  poly(ctx, [[262, 336], [344, 336], [330, 356], [276, 356]]);
  ctx.fillStyle = '#5d3620';
  ctx.fillRect(300, 240, 4, 100);
  ctx.fillStyle = variant.has('sail') ? '#e2574c' : '#fbf7ef';
  poly(ctx, [[306, 248], [306, 330], [352, 330]]);
  ctx.fillStyle = variant.has('sail') ? '#c94a40' : '#efe6d4';
  poly(ctx, [[298, 258], [298, 330], [258, 330]]);

  // Jumping fish, arcing out of the water.
  if (variant.has('fish')) {
    ctx.fillStyle = '#eef6f8';
    ctx.save();
    ctx.translate(392, 348);
    ctx.rotate(-0.6);
    ellipse(ctx, 0, 0, 20, 8);
    poly(ctx, [[-18, 0], [-30, -9], [-30, 9]]);
    ctx.restore();
    ctx.fillStyle = '#9fc6d4';
    circle(ctx, 398, 344, 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(392, 366, 12, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Buoy bobbing near the boat.
  if (variant.has('buoy')) {
    ctx.fillStyle = '#e2574c';
    ellipse(ctx, 468, 382, 13, 9);
    ctx.fillStyle = '#fbf7ef';
    ctx.fillRect(458, 376, 20, 6);
    ctx.fillStyle = '#3d4a55';
    ctx.fillRect(466, 364, 4, 10);
  }

  // Wooden pier on the right, with a flag at its end.
  ctx.fillStyle = '#8a6a4a';
  ctx.fillRect(470, 300, 170, 12);
  ctx.fillStyle = '#77572f';
  for (let i = 0; i < 6; i++) ctx.fillRect(478 + i * 28, 300, 3, 12);
  ctx.fillStyle = '#6b4e33';
  ctx.fillRect(486, 312, 10, 60);
  ctx.fillRect(600, 312, 10, 60);
  if (variant.has('flag')) {
    ctx.strokeStyle = '#3d4a55';
    ctx.lineWidth = 3;
    line(ctx, 560, 252, 560, 300);
    ctx.fillStyle = '#2f9e6e';
    poly(ctx, [[560, 252], [592, 260], [560, 270]]);
  }

  // Foreground rocks.
  ctx.fillStyle = '#7c8a94';
  ellipse(ctx, 40, 468, 60, 22);
  ellipse(ctx, 620, 472, 46, 18);
}

// ---------------------------------------------------------------- meadow
function paintMeadow(ctx, variant) {
  const rand = mulberry32(20261122);

  // Morning sky and sun.
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#8ec8ee');
  sky.addColorStop(1, '#d8f0e4');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_W, 320);
  ctx.fillStyle = '#fff3c4';
  glow(ctx, 92, 76, 70, 'rgba(255, 240, 170, 0.8)');
  circle(ctx, 92, 76, 28);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 3; i++) {
    const cx = 200 + rand() * 380;
    const cy = 36 + rand() * 70;
    ellipse(ctx, cx, cy, 44, 13);
    ellipse(ctx, cx + 24, cy + 5, 30, 10);
  }

  // Rolling hills and the meadow.
  ctx.fillStyle = '#a8d18d';
  ellipse(ctx, 120, 340, 260, 70);
  ellipse(ctx, 540, 330, 280, 80);
  ctx.fillStyle = '#7fb069';
  ctx.fillRect(0, 330, SCENE_W, SCENE_H - 330);

  // The cottage.
  ctx.fillStyle = '#f6e7c8';
  ctx.fillRect(210, 210, 180, 120);
  ctx.fillStyle = '#c96f4a';
  poly(ctx, [[196, 214], [300, 140], [404, 214]]);
  ctx.fillStyle = '#8a5a3b';
  ctx.fillRect(146, 96, 22, 74);
  if (variant.has('smoke')) {
    ctx.fillStyle = 'rgba(240,240,240,0.85)';
    circle(ctx, 152, 92, 10);
    circle(ctx, 142, 74, 13);
    circle(ctx, 158, 56, 16);
    circle(ctx, 146, 36, 12);
  }
  // Door with a wreath.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(284, 258, 34, 72);
  ctx.fillStyle = '#5d3620';
  circle(ctx, 312, 296, 3);
  if (variant.has('wreath')) {
    ctx.strokeStyle = '#2f7d4f';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(301, 272, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#e2574c';
    circle(ctx, 301, 261, 3);
    circle(ctx, 312, 272, 3);
    circle(ctx, 290, 272, 3);
  }
  // Window: dark glass, or warm lamplight.
  ctx.fillStyle = '#5d6b7a';
  ctx.fillRect(322, 186, 30, 26);
  if (variant.has('window')) {
    ctx.fillStyle = '#ffd76a';
    ctx.fillRect(324, 188, 26, 22);
    glow(ctx, 337, 199, 30, 'rgba(255, 215, 106, 0.55)');
    ctx.fillStyle = '#fff3c4';
    ctx.fillRect(324, 188, 26, 22);
  }
  ctx.strokeStyle = '#5d3620';
  ctx.lineWidth = 2;
  line(ctx, 337, 186, 337, 212);
  line(ctx, 322, 199, 352, 199);

  // Garden path.
  ctx.fillStyle = '#d9c49a';
  poly(ctx, [[288, 330], [316, 330], [330, 480], [272, 480]]);

  // Fence across the garden, with a gate that opens or shuts.
  ctx.fillStyle = '#a9805a';
  ctx.fillRect(30, 336, 580, 6);
  ctx.fillRect(30, 356, 580, 6);
  for (let i = 0; i < 12; i++) {
    const fx = 40 + i * 50;
    if (fx > 396 && fx < 446) continue; // the gate gap
    ctx.fillRect(fx, 322, 8, 48);
  }
  if (variant.has('gate')) {
    ctx.fillStyle = '#c49a6c';
    ctx.save();
    ctx.translate(400, 330);
    ctx.rotate(0.5);
    ctx.fillRect(0, 0, 42, 6);
    ctx.fillRect(0, 20, 42, 6);
    ctx.fillRect(2, 0, 5, 40);
    ctx.fillRect(34, 0, 5, 40);
    ctx.restore();
  } else {
    ctx.fillStyle = '#a9805a';
    ctx.fillRect(400, 322, 42, 6);
    ctx.fillRect(400, 342, 42, 6);
    ctx.fillRect(404, 322, 6, 48);
    ctx.fillRect(432, 322, 6, 48);
  }

  // A cat asleep on the fence rail.
  if (variant.has('cat')) {
    ctx.fillStyle = '#4a4a4a';
    ellipse(ctx, 482, 330, 20, 9);
    circle(ctx, 500, 322, 8);
    poly(ctx, [[495, 316], [498, 308], [502, 315]]);
    poly(ctx, [[503, 316], [506, 308], [509, 315]]);
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(464, 332);
    ctx.quadraticCurveTo(452, 326, 458, 316);
    ctx.stroke();
  }

  // Wildflowers, seeded so both panels match.
  const petals = ['#f2a541', '#e2574c', '#ffffff', '#c98ad6'];
  for (let i = 0; i < 26; i++) {
    const fx = 20 + rand() * 600;
    const fy = 380 + rand() * 88;
    if (fx > 268 && fx < 336) continue; // keep the path clear
    ctx.strokeStyle = '#3f7d3a';
    ctx.lineWidth = 2;
    line(ctx, fx, fy, fx, fy - 10);
    ctx.fillStyle = petals[i % petals.length];
    circle(ctx, fx, fy - 12, 4);
  }

  // The tall sunflower.
  if (variant.has('sunflower')) {
    ctx.strokeStyle = '#3f7d3a';
    ctx.lineWidth = 4;
    line(ctx, 560, 420, 560, 348);
    ctx.fillStyle = '#3f7d3a';
    ellipse(ctx, 548, 396, 12, 6);
    ctx.fillStyle = '#f2a541';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ellipse(ctx, 560 + Math.cos(a) * 16, 340 + Math.sin(a) * 16, 8, 4);
    }
    ctx.fillStyle = '#7a4a2b';
    circle(ctx, 560, 340, 11);
  }

  // A butterfly over the flowers.
  if (variant.has('butterfly')) {
    ctx.fillStyle = '#e88fc0';
    ctx.save();
    ctx.translate(222, 330);
    ctx.rotate(-0.4);
    ellipse(ctx, -7, 0, 9, 6);
    ellipse(ctx, 7, 0, 9, 6);
    ctx.restore();
    ctx.strokeStyle = '#3d4a55';
    ctx.lineWidth = 2;
    line(ctx, 222, 330, 226, 322);
    line(ctx, 222, 330, 218, 322);
  }
}

// ------------------------------------------------------------------ camp
function paintCamp(ctx, variant) {
  const rand = mulberry32(20261123);

  // Night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, '#0b1030');
  sky.addColorStop(0.6, '#1c2a52');
  sky.addColorStop(1, '#3a4a7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_W, 340);

  // Stars, seeded.
  for (let i = 0; i < 70; i++) {
    const sx = rand() * SCENE_W;
    const sy = rand() * 280;
    const sr = 1 + rand() * 1.6;
    ctx.fillStyle = `rgba(255,255,255,${0.35 + rand() * 0.6})`;
    circle(ctx, sx, sy, sr);
  }

  // The moon: smooth, or pocked with craters.
  ctx.fillStyle = '#f4ead0';
  glow(ctx, 520, 92, 78, 'rgba(244, 234, 208, 0.35)');
  circle(ctx, 520, 92, 36);
  if (variant.has('craters')) {
    ctx.fillStyle = '#d9cba6';
    circle(ctx, 508, 82, 7);
    circle(ctx, 532, 100, 9);
    circle(ctx, 516, 108, 5);
    circle(ctx, 536, 76, 4);
  }

  // One sparkling star.
  if (variant.has('star')) {
    ctx.fillStyle = '#fff8d0';
    ctx.save();
    ctx.translate(202, 82);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = i % 2 === 0 ? 14 : 4;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    glow(ctx, 202, 82, 26, 'rgba(255, 248, 208, 0.6)');
  }

  // Pine silhouettes.
  ctx.fillStyle = '#101c33';
  for (const [tx, th] of [[30, 150], [90, 120], [600, 170], [560, 120]]) {
    poly(ctx, [[tx - 34, 330], [tx, 330 - th], [tx + 34, 330]]);
    poly(ctx, [[tx - 28, 300], [tx, 300 - th * 0.7], [tx + 28, 300]]);
  }
  ctx.fillStyle = '#0d1526';
  ctx.fillRect(0, 330, SCENE_W, SCENE_H - 330);

  // A bare branch with an owl.
  ctx.strokeStyle = '#2c2118';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  line(ctx, 96, 330, 128, 190);
  line(ctx, 128, 190, 168, 160);
  if (variant.has('owl')) {
    ctx.fillStyle = '#8a6a4a';
    ellipse(ctx, 142, 142, 15, 19);
    ctx.fillStyle = '#a9805a';
    circle(ctx, 142, 126, 11);
    ctx.fillStyle = '#fff3c4';
    circle(ctx, 137, 124, 4);
    circle(ctx, 147, 124, 4);
    ctx.fillStyle = '#1a1a1a';
    circle(ctx, 137, 124, 2);
    circle(ctx, 147, 124, 2);
    ctx.fillStyle = '#e8a34c';
    poly(ctx, [[140, 130], [144, 130], [142, 134]]);
    ctx.fillStyle = '#8a6a4a';
    poly(ctx, [[130, 132], [124, 146], [132, 144]]);
    poly(ctx, [[154, 132], [160, 146], [152, 144]]);
  }

  // The tent, with a flag on its peak.
  ctx.fillStyle = '#c96f4a';
  poly(ctx, [[400, 380], [452, 268], [504, 380]]);
  ctx.fillStyle = '#a85438';
  poly(ctx, [[452, 268], [504, 380], [478, 380]]);
  ctx.fillStyle = '#2c2118';
  poly(ctx, [[438, 380], [452, 330], [466, 380]]);
  if (variant.has('tentflag')) {
    ctx.strokeStyle = '#d9d9d9';
    ctx.lineWidth = 3;
    line(ctx, 452, 240, 452, 268);
    ctx.fillStyle = '#ffd76a';
    poly(ctx, [[452, 240], [480, 246], [452, 254]]);
  }

  // The campfire: stones, logs, and a flame that is small or tall.
  ctx.fillStyle = '#7c8a94';
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    ellipse(ctx, 320 + Math.cos(a) * 26, 428 + Math.sin(a) * 8, 8, 6);
  }
  ctx.strokeStyle = '#5d3620';
  ctx.lineWidth = 6;
  line(ctx, 298, 420, 342, 432);
  line(ctx, 342, 420, 298, 432);
  const flameH = variant.has('flame') ? 44 : 24;
  glow(ctx, 320, 408, 52, 'rgba(255, 150, 50, 0.55)');
  ctx.fillStyle = '#ff8c2e';
  ctx.beginPath();
  ctx.moveTo(320, 428 - flameH);
  ctx.quadraticCurveTo(336, 408, 330, 428);
  ctx.quadraticCurveTo(320, 436, 310, 428);
  ctx.quadraticCurveTo(304, 408, 320, 428 - flameH);
  ctx.fill();
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.moveTo(320, 428 - flameH * 0.6);
  ctx.quadraticCurveTo(330, 414, 326, 428);
  ctx.quadraticCurveTo(320, 432, 314, 428);
  ctx.quadraticCurveTo(310, 414, 320, 428 - flameH * 0.6);
  ctx.fill();

  // A lantern on a stick, lit or dark.
  ctx.strokeStyle = '#5d3620';
  ctx.lineWidth = 4;
  line(ctx, 300, 330, 330, 296);
  line(ctx, 330, 296, 330, 316);
  ctx.fillStyle = '#3d4a55';
  ctx.fillRect(322, 316, 16, 22);
  if (variant.has('lantern')) {
    glow(ctx, 330, 327, 40, 'rgba(255, 215, 106, 0.8)');
    ctx.fillStyle = '#ffd76a';
    ctx.fillRect(325, 319, 10, 16);
  } else {
    ctx.fillStyle = '#6b7a88';
    ctx.fillRect(325, 319, 10, 16);
  }

  // Fireflies drifting over the grass.
  if (variant.has('fireflies')) {
    for (const [fx, fy] of [[182, 380], [160, 400], [204, 398], [176, 420], [210, 372]]) {
      glow(ctx, fx, fy, 12, 'rgba(190, 255, 120, 0.8)');
      ctx.fillStyle = '#d8ff9a';
      circle(ctx, fx, fy, 3);
    }
  }

  // Sleeping bags by the fire.
  ctx.fillStyle = '#2f6e8f';
  ellipse(ctx, 250, 440, 34, 10);
  ctx.fillStyle = '#7a4a8f';
  ellipse(ctx, 396, 442, 34, 10);
}

const PAINTERS = { harbor: paintHarbor, meadow: paintMeadow, camp: paintCamp };

// Paint one panel of a level: `variant` holds the ids switched on here.
export function paintScene(ctx, levelId, variant) {
  ctx.save();
  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  PAINTERS[levelId](ctx, variant);
  ctx.restore();
}
