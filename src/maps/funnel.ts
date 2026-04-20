// ===== 깔때기 맵 (롱 코스) =====
import { MapData, Obstacle } from '../types';

const PEG = '#3a3f4a'; const BMP = '#4a4f5a'; const SPN = '#505868'; const BLK = '#454d5e';

function pegs(sx: number, sy: number, cols: number, rows: number, dx: number, dy: number, r: number, stagger = true): Obstacle[] {
  const out: Obstacle[] = [];
  for (let row = 0; row < rows; row++) {
    const off = stagger && row % 2 === 1 ? dx / 2 : 0;
    const c = stagger && row % 2 === 1 ? cols - 1 : cols;
    for (let col = 0; col < c; col++)
      out.push({ type: 'circle', pos: { x: sx + col * dx + off, y: sy + row * dy }, size: { x: r, y: r }, rotation: 0, restitution: 0.6, color: PEG });
  }
  return out;
}

function vPegs(cx: number, sy: number, rows: number, sw: number, ew: number, dy: number, r: number): Obstacle[] {
  const out: Obstacle[] = [];
  for (let row = 0; row < rows; row++) {
    const t = row / (rows - 1); const w = sw + (ew - sw) * t;
    const cols = Math.max(2, Math.floor(w / 50)); const sx = cx - w / 2; const sp = w / (cols - 1);
    for (let col = 0; col < cols; col++)
      out.push({ type: 'circle', pos: { x: sx + col * sp, y: sy + row * dy }, size: { x: r, y: r }, rotation: 0, restitution: 0.65, color: PEG });
  }
  return out;
}

const obstacles: Obstacle[] = [
  // 1: 넓은 핀
  ...pegs(60, 110, 9, 4, 58, 26, 5),
  { type: 'bumper', pos: { x: 200, y: 130 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BMP },
  { type: 'bumper', pos: { x: 400, y: 130 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BMP },
  { type: 'bumper', pos: { x: 300, y: 170 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.4, color: BMP },

  // 2: 1차 깔때기
  ...vPegs(300, 230, 4, 420, 200, 24, 5),
  { type: 'bumper', pos: { x: 150, y: 260 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: BMP },
  { type: 'bumper', pos: { x: 450, y: 260 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: BMP },

  // 3: 통로 + 스피너
  ...pegs(210, 350, 4, 3, 50, 24, 5),
  { type: 'spinner', pos: { x: 300, y: 385 }, size: { x: 65, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: 3.2, currentAngle: 0 },

  // 4: 확산
  ...vPegs(300, 450, 4, 180, 420, 24, 5),
  { type: 'triangle', pos: { x: 200, y: 480 }, size: { x: 28, y: 22 }, rotation: -0.2, restitution: 0.7, color: BLK },
  { type: 'triangle', pos: { x: 400, y: 480 }, size: { x: 28, y: 22 }, rotation: 0.2, restitution: 0.7, color: BLK },
  { type: 'bumper', pos: { x: 300, y: 530 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },

  // 5: 넓은 핀
  ...pegs(55, 570, 9, 3, 58, 28, 5),
  { type: 'spinner', pos: { x: 200, y: 640 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: -3, currentAngle: 0 },
  { type: 'spinner', pos: { x: 400, y: 640 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: 3, currentAngle: 0 },

  // 6: 2차 깔때기
  ...vPegs(300, 700, 5, 420, 160, 24, 5),
  { type: 'bumper', pos: { x: 200, y: 730 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },
  { type: 'bumper', pos: { x: 400, y: 730 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },

  // === 7: 통로 → 확산 2 (NEW) ===
  ...pegs(200, 830, 5, 3, 50, 24, 5),
  { type: 'spinner', pos: { x: 300, y: 870 }, size: { x: 70, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: -3.5, currentAngle: 0 },
  { type: 'bumper', pos: { x: 250, y: 900 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BMP },
  { type: 'bumper', pos: { x: 350, y: 900 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BMP },

  // 8: 확산 2
  ...vPegs(300, 930, 4, 160, 440, 24, 5),
  { type: 'triangle', pos: { x: 180, y: 960 }, size: { x: 30, y: 24 }, rotation: 0, restitution: 0.7, color: BLK },
  { type: 'triangle', pos: { x: 420, y: 960 }, size: { x: 30, y: 24 }, rotation: 0, restitution: 0.7, color: BLK },

  // 9: 넓은 핀 2
  ...pegs(55, 1040, 10, 4, 54, 26, 5),
  { type: 'bumper', pos: { x: 150, y: 1080 }, size: { x: 11, y: 11 }, rotation: 0, restitution: 1.3, color: BMP },
  { type: 'bumper', pos: { x: 300, y: 1090 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.5, color: BMP },
  { type: 'bumper', pos: { x: 450, y: 1080 }, size: { x: 11, y: 11 }, rotation: 0, restitution: 1.3, color: BMP },
  { type: 'rect', pos: { x: 200, y: 1120 }, size: { x: 30, y: 8 }, rotation: 0.15, restitution: 0.5, color: BLK },
  { type: 'rect', pos: { x: 400, y: 1120 }, size: { x: 30, y: 8 }, rotation: -0.15, restitution: 0.5, color: BLK },

  // 10: 최종 깔때기
  ...vPegs(300, 1180, 5, 440, 160, 24, 5),
  { type: 'bumper', pos: { x: 200, y: 1210 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },
  { type: 'bumper', pos: { x: 300, y: 1240 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.6, color: BMP },
  { type: 'bumper', pos: { x: 400, y: 1210 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },
  { type: 'spinner', pos: { x: 300, y: 1280 }, size: { x: 55, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: 4, currentAngle: 0 },
  ...pegs(230, 1310, 3, 2, 50, 18, 4),
];

export const funnelMap: MapData = {
  name: 'funnel',
  nameKo: '깔때기',
  width: 600,
  height: 1400,
  startArea: { x: 60, y: 20, width: 480, height: 60 },
  finishLine: 1370,
  gravity: 430,
  background: '#0d1b2a',
  walls: [
    { x1: 30, y1: 0, x2: 30, y2: 230, restitution: 0.6 },
    { x1: 570, y1: 0, x2: 570, y2: 230, restitution: 0.6 },
    { x1: 30, y1: 230, x2: 180, y2: 350, restitution: 0.5 },
    { x1: 570, y1: 230, x2: 420, y2: 350, restitution: 0.5 },
    { x1: 180, y1: 350, x2: 180, y2: 440, restitution: 0.6 },
    { x1: 420, y1: 350, x2: 420, y2: 440, restitution: 0.6 },
    { x1: 180, y1: 440, x2: 40, y2: 550, restitution: 0.5 },
    { x1: 420, y1: 440, x2: 560, y2: 550, restitution: 0.5 },
    { x1: 40, y1: 550, x2: 40, y2: 690, restitution: 0.6 },
    { x1: 560, y1: 550, x2: 560, y2: 690, restitution: 0.6 },
    // 2차 깔때기
    { x1: 40, y1: 690, x2: 180, y2: 830, restitution: 0.4 },
    { x1: 560, y1: 690, x2: 420, y2: 830, restitution: 0.4 },
    { x1: 180, y1: 830, x2: 180, y2: 920, restitution: 0.6 },
    { x1: 420, y1: 830, x2: 420, y2: 920, restitution: 0.6 },
    // 2차 확산
    { x1: 180, y1: 920, x2: 35, y2: 1030, restitution: 0.5 },
    { x1: 420, y1: 920, x2: 565, y2: 1030, restitution: 0.5 },
    { x1: 35, y1: 1030, x2: 35, y2: 1170, restitution: 0.6 },
    { x1: 565, y1: 1030, x2: 565, y2: 1170, restitution: 0.6 },
    // 최종 깔때기
    { x1: 35, y1: 1170, x2: 210, y2: 1350, restitution: 0.4 },
    { x1: 565, y1: 1170, x2: 390, y2: 1350, restitution: 0.4 },
  ],
  obstacles,
};
