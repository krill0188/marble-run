// ===== 클래식 맵 - 파친코/갈톤보드 (롱 코스) =====
import { MapData, Obstacle } from '../types';
import { createFinishWalls, createFinishObstacles } from './finish';

const PEG = '#3a3f4a';
const BMP = '#4a4f5a';
const SPN = '#505868';
const BLK = '#454d5e';

function pegs(
  sx: number, sy: number, cols: number, rows: number,
  dx: number, dy: number, r: number, stagger = true
): Obstacle[] {
  const out: Obstacle[] = [];
  for (let row = 0; row < rows; row++) {
    const off = stagger && row % 2 === 1 ? dx / 2 : 0;
    const c = stagger && row % 2 === 1 ? cols - 1 : cols;
    for (let col = 0; col < c; col++) {
      out.push({ type: 'circle', pos: { x: sx + col * dx + off, y: sy + row * dy },
        size: { x: r, y: r }, rotation: 0, restitution: 0.6, color: PEG });
    }
  }
  return out;
}

const obstacles: Obstacle[] = [
  // === 1구역 (y:120~230) ===
  ...pegs(75, 120, 9, 4, 55, 30, 5),
  { type: 'bumper', pos: { x: 200, y: 145 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BMP },
  { type: 'bumper', pos: { x: 400, y: 145 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BMP },
  { type: 'bumper', pos: { x: 300, y: 190 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },

  // === 2구역 (y:260~370) ===
  ...pegs(60, 270, 9, 4, 58, 28, 5),
  { type: 'triangle', pos: { x: 180, y: 300 }, size: { x: 30, y: 24 }, rotation: 0, restitution: 0.7, color: BLK },
  { type: 'triangle', pos: { x: 420, y: 300 }, size: { x: 30, y: 24 }, rotation: 0, restitution: 0.7, color: BLK },
  { type: 'bumper', pos: { x: 120, y: 340 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: BMP },
  { type: 'bumper', pos: { x: 300, y: 330 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BMP },
  { type: 'bumper', pos: { x: 480, y: 340 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: BMP },

  // === 3구역 스피너 (y:400~510) ===
  ...pegs(70, 410, 9, 3, 56, 30, 5),
  { type: 'spinner', pos: { x: 180, y: 460 }, size: { x: 55, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: 2.8, currentAngle: 0 },
  { type: 'spinner', pos: { x: 420, y: 460 }, size: { x: 55, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: -2.8, currentAngle: 0 },
  { type: 'bumper', pos: { x: 250, y: 490 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BMP },
  { type: 'bumper', pos: { x: 350, y: 490 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BMP },

  // === 4구역 사각블록 (y:540~650) ===
  ...pegs(55, 550, 10, 4, 54, 26, 5),
  { type: 'rect', pos: { x: 200, y: 590 }, size: { x: 30, y: 8 }, rotation: 0.15, restitution: 0.5, color: BLK },
  { type: 'rect', pos: { x: 400, y: 590 }, size: { x: 30, y: 8 }, rotation: -0.15, restitution: 0.5, color: BLK },
  { type: 'rect', pos: { x: 300, y: 630 }, size: { x: 35, y: 8 }, rotation: 0, restitution: 0.5, color: BLK },
  { type: 'bumper', pos: { x: 140, y: 640 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.2, color: BMP },
  { type: 'bumper', pos: { x: 460, y: 640 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.2, color: BMP },

  // === 5구역 밀집 (y:680~790) ===
  ...pegs(65, 690, 9, 4, 56, 28, 5),
  { type: 'bumper', pos: { x: 180, y: 720 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },
  { type: 'bumper', pos: { x: 300, y: 740 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.6, color: BMP },
  { type: 'bumper', pos: { x: 420, y: 720 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },
  { type: 'spinner', pos: { x: 250, y: 780 }, size: { x: 45, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: 3.5, currentAngle: 0 },
  { type: 'spinner', pos: { x: 350, y: 780 }, size: { x: 45, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: -3.5, currentAngle: 0 },

  // === 6구역 (y:830~940) — NEW ===
  ...pegs(60, 840, 9, 4, 58, 28, 5),
  { type: 'triangle', pos: { x: 250, y: 870 }, size: { x: 32, y: 26 }, rotation: 0.1, restitution: 0.7, color: BLK },
  { type: 'triangle', pos: { x: 350, y: 870 }, size: { x: 32, y: 26 }, rotation: -0.1, restitution: 0.7, color: BLK },
  { type: 'bumper', pos: { x: 150, y: 910 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BMP },
  { type: 'bumper', pos: { x: 450, y: 910 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BMP },

  // === 7구역 스피너 카오스 (y:970~1070) — NEW ===
  ...pegs(70, 980, 9, 3, 56, 28, 5),
  { type: 'spinner', pos: { x: 200, y: 1010 }, size: { x: 60, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: -3, currentAngle: 0 },
  { type: 'spinner', pos: { x: 400, y: 1010 }, size: { x: 60, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: 3, currentAngle: 0 },
  { type: 'spinner', pos: { x: 300, y: 1050 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: 4, currentAngle: 0 },
  { type: 'bumper', pos: { x: 300, y: 1080 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.6, color: BMP },

  // === 8구역 밀집 (y:1110~1210) — NEW ===
  ...pegs(55, 1120, 10, 4, 54, 26, 5),
  { type: 'rect', pos: { x: 180, y: 1160 }, size: { x: 35, y: 8 }, rotation: -0.2, restitution: 0.5, color: BLK },
  { type: 'rect', pos: { x: 420, y: 1160 }, size: { x: 35, y: 8 }, rotation: 0.2, restitution: 0.5, color: BLK },
  { type: 'bumper', pos: { x: 200, y: 1190 }, size: { x: 11, y: 11 }, rotation: 0, restitution: 1.4, color: BMP },
  { type: 'bumper', pos: { x: 400, y: 1190 }, size: { x: 11, y: 11 }, rotation: 0, restitution: 1.4, color: BMP },

  // === 9구역 최종 (y:1240~1330) — NEW ===
  ...pegs(65, 1250, 9, 3, 56, 26, 5),
  { type: 'bumper', pos: { x: 200, y: 1280 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },
  { type: 'bumper', pos: { x: 300, y: 1300 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.6, color: BMP },
  { type: 'bumper', pos: { x: 400, y: 1280 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },
  ...pegs(120, 1310, 8, 2, 50, 18, 4),

  // 피니시 슬롯 장애물
  ...createFinishObstacles(600, 1370),
];

export const classicMap: MapData = {
  name: 'classic',
  nameKo: '클래식',
  width: 600,
  height: 1400,
  startArea: { x: 60, y: 20, width: 480, height: 60 },
  finishLine: 1370,
  gravity: 450,
  background: '#1a1a2e',
  walls: [
    { x1: 35, y1: 0, x2: 35, y2: 1400, restitution: 0.6 },
    { x1: 565, y1: 0, x2: 565, y2: 1400, restitution: 0.6 },
    // 경사로 (좌우 교대)
    { x1: 35, y1: 240, x2: 140, y2: 260, restitution: 0.5 },
    { x1: 565, y1: 240, x2: 460, y2: 260, restitution: 0.5 },
    { x1: 35, y1: 390, x2: 120, y2: 405, restitution: 0.5 },
    { x1: 565, y1: 390, x2: 480, y2: 405, restitution: 0.5 },
    { x1: 35, y1: 535, x2: 110, y2: 548, restitution: 0.5 },
    { x1: 565, y1: 535, x2: 490, y2: 548, restitution: 0.5 },
    { x1: 35, y1: 675, x2: 130, y2: 685, restitution: 0.5 },
    { x1: 565, y1: 675, x2: 470, y2: 685, restitution: 0.5 },
    // 추가 경사로
    { x1: 35, y1: 825, x2: 120, y2: 838, restitution: 0.5 },
    { x1: 565, y1: 825, x2: 480, y2: 838, restitution: 0.5 },
    { x1: 35, y1: 965, x2: 140, y2: 978, restitution: 0.5 },
    { x1: 565, y1: 965, x2: 460, y2: 978, restitution: 0.5 },
    { x1: 35, y1: 1105, x2: 110, y2: 1118, restitution: 0.5 },
    { x1: 565, y1: 1105, x2: 490, y2: 1118, restitution: 0.5 },
    { x1: 35, y1: 1235, x2: 130, y2: 1248, restitution: 0.5 },
    { x1: 565, y1: 1235, x2: 470, y2: 1248, restitution: 0.5 },
    // 피니시 슬롯
    ...createFinishWalls(600, 1370, 35, 565),
  ],
  obstacles,
};
