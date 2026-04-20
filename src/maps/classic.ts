// ===== 클래식 맵 - 파친코/갈톤보드 스타일 =====
import { MapData, Obstacle } from '../types';

// 장애물 색상 — 통일된 어두운 메탈릭 (구슬이 주인공)
const PEG_COLOR = '#3a3f4a';      // 핀: 어두운 그레이
const BUMPER_COLOR = '#4a4f5a';   // 범퍼: 약간 밝은 그레이
const SPINNER_COLOR = '#505868';  // 스피너: 블루그레이
const BLOCK_COLOR = '#454d5e';    // 사각/삼각: 다크 블루그레이

function createPegGrid(
  startX: number, startY: number,
  cols: number, rows: number,
  spacingX: number, spacingY: number,
  radius: number,
  stagger: boolean = true
): Obstacle[] {
  const pegs: Obstacle[] = [];
  for (let row = 0; row < rows; row++) {
    const offset = stagger && row % 2 === 1 ? spacingX / 2 : 0;
    const colCount = stagger && row % 2 === 1 ? cols - 1 : cols;
    for (let col = 0; col < colCount; col++) {
      pegs.push({
        type: 'circle',
        pos: { x: startX + col * spacingX + offset, y: startY + row * spacingY },
        size: { x: radius, y: radius },
        rotation: 0,
        restitution: 0.6,
        color: PEG_COLOR,
      });
    }
  }
  return pegs;
}

const obstacles: Obstacle[] = [
  // ====== 1구역 (y: 120~230) ======
  ...createPegGrid(75, 120, 9, 4, 55, 30, 5, true),

  { type: 'bumper', pos: { x: 200, y: 145 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 400, y: 145 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 300, y: 190 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BUMPER_COLOR },

  // ====== 2구역 (y: 260~370) ======
  ...createPegGrid(60, 270, 9, 4, 58, 28, 5, true),

  { type: 'triangle', pos: { x: 180, y: 300 }, size: { x: 30, y: 24 }, rotation: 0, restitution: 0.7, color: BLOCK_COLOR },
  { type: 'triangle', pos: { x: 420, y: 300 }, size: { x: 30, y: 24 }, rotation: 0, restitution: 0.7, color: BLOCK_COLOR },
  { type: 'bumper', pos: { x: 120, y: 340 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 300, y: 330 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 480, y: 340 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: BUMPER_COLOR },

  // ====== 3구역 (y: 400~510) ======
  ...createPegGrid(70, 410, 9, 3, 56, 30, 5, true),

  { type: 'spinner', pos: { x: 180, y: 460 }, size: { x: 55, y: 6 }, rotation: 0, restitution: 0.6, color: SPINNER_COLOR, spinSpeed: 2.8, currentAngle: 0 },
  { type: 'spinner', pos: { x: 420, y: 460 }, size: { x: 55, y: 6 }, rotation: 0, restitution: 0.6, color: SPINNER_COLOR, spinSpeed: -2.8, currentAngle: 0 },
  { type: 'bumper', pos: { x: 250, y: 490 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 350, y: 490 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 300, y: 510 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BUMPER_COLOR },

  // ====== 4구역 (y: 540~650) ======
  ...createPegGrid(55, 550, 10, 4, 54, 26, 5, true),

  { type: 'rect', pos: { x: 200, y: 590 }, size: { x: 30, y: 8 }, rotation: 0.15, restitution: 0.5, color: BLOCK_COLOR },
  { type: 'rect', pos: { x: 400, y: 590 }, size: { x: 30, y: 8 }, rotation: -0.15, restitution: 0.5, color: BLOCK_COLOR },
  { type: 'rect', pos: { x: 300, y: 630 }, size: { x: 35, y: 8 }, rotation: 0, restitution: 0.5, color: BLOCK_COLOR },
  { type: 'bumper', pos: { x: 140, y: 640 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.2, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 460, y: 640 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.2, color: BUMPER_COLOR },

  // ====== 5구역 (y: 680~810) ======
  ...createPegGrid(65, 690, 9, 4, 56, 28, 5, true),

  { type: 'bumper', pos: { x: 180, y: 720 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 300, y: 740 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.6, color: BUMPER_COLOR },
  { type: 'bumper', pos: { x: 420, y: 720 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BUMPER_COLOR },

  { type: 'spinner', pos: { x: 250, y: 780 }, size: { x: 45, y: 6 }, rotation: 0, restitution: 0.6, color: SPINNER_COLOR, spinSpeed: 3.5, currentAngle: 0 },
  { type: 'spinner', pos: { x: 350, y: 780 }, size: { x: 45, y: 6 }, rotation: 0, restitution: 0.6, color: SPINNER_COLOR, spinSpeed: -3.5, currentAngle: 0 },

  ...createPegGrid(120, 820, 8, 2, 50, 18, 4, true),
];

export const classicMap: MapData = {
  name: 'classic',
  nameKo: '클래식',
  width: 600,
  height: 900,
  startArea: { x: 60, y: 20, width: 480, height: 60 },
  finishLine: 870,
  gravity: 450,
  background: '#1a1a2e',
  walls: [
    { x1: 35, y1: 0, x2: 35, y2: 900, restitution: 0.6 },
    { x1: 565, y1: 0, x2: 565, y2: 900, restitution: 0.6 },
    { x1: 35, y1: 240, x2: 140, y2: 260, restitution: 0.5 },
    { x1: 565, y1: 240, x2: 460, y2: 260, restitution: 0.5 },
    { x1: 35, y1: 390, x2: 120, y2: 405, restitution: 0.5 },
    { x1: 565, y1: 390, x2: 480, y2: 405, restitution: 0.5 },
    { x1: 35, y1: 535, x2: 110, y2: 548, restitution: 0.5 },
    { x1: 565, y1: 535, x2: 490, y2: 548, restitution: 0.5 },
    { x1: 35, y1: 675, x2: 130, y2: 685, restitution: 0.5 },
    { x1: 565, y1: 675, x2: 470, y2: 685, restitution: 0.5 },
    { x1: 35, y1: 870, x2: 200, y2: 865, restitution: 0.3 },
    { x1: 565, y1: 870, x2: 400, y2: 865, restitution: 0.3 },
  ],
  obstacles,
};
