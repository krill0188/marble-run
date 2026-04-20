// ===== 지그재그 맵 - S자 + 밀집 핀 =====
import { MapData, Obstacle } from '../types';

function createPegGrid(
  startX: number, startY: number,
  cols: number, rows: number,
  spacingX: number, spacingY: number,
  radius: number,
  color: string,
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
        restitution: 0.55,
        color,
      });
    }
  }
  return pegs;
}

// 경사면 위에 핀 배열
function createSlopePegs(
  x1: number, y1: number, x2: number, y2: number,
  count: number, radius: number, color: string
): Obstacle[] {
  const pegs: Obstacle[] = [];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    pegs.push({
      type: 'circle',
      pos: {
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t - 20, // 경사면 위 약간 위
      },
      size: { x: radius, y: radius },
      rotation: 0,
      restitution: 0.6,
      color,
    });
  }
  return pegs;
}

const obstacles: Obstacle[] = [
  // ====== 상단: 분산 핀 (y:100~170) ======
  ...createPegGrid(70, 100, 10, 3, 50, 24, 6, '#5a4fa5', true),

  // 상단 범퍼
  { type: 'bumper', pos: { x: 200, y: 110 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#FF4757' },
  { type: 'bumper', pos: { x: 400, y: 110 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#FF4757' },

  // ====== 1층 경사 위 핀 (우측으로) ======
  ...createSlopePegs(50, 180, 460, 215, 10, 5, '#6a5fb5'),
  { type: 'bumper', pos: { x: 250, y: 185 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.2, color: '#FFA502' },

  // ====== 1-2층 사이 핀 ======
  ...createPegGrid(100, 240, 8, 2, 55, 22, 5, '#7a6fc5', true),

  // ====== 2층 경사 위 핀 (좌측으로) ======
  ...createSlopePegs(550, 280, 140, 315, 10, 5, '#6a5fb5'),
  { type: 'bumper', pos: { x: 350, y: 290 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.2, color: '#2ED573' },
  { type: 'spinner', pos: { x: 300, y: 310 }, size: { x: 60, y: 7 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: 2.5, currentAngle: 0 },

  // ====== 2-3층 사이 핀 ======
  ...createPegGrid(80, 340, 9, 2, 52, 22, 5, '#8a7fD5', true),

  // ====== 3층 경사 위 핀 (우측으로) ======
  ...createSlopePegs(50, 380, 460, 415, 10, 5, '#7a6fc5'),
  { type: 'bumper', pos: { x: 200, y: 390 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.4, color: '#FECA57' },
  { type: 'triangle', pos: { x: 350, y: 400 }, size: { x: 40, y: 30 }, rotation: 0, restitution: 0.7, color: '#00D2D3' },

  // ====== 3-4층 사이 핀 ======
  ...createPegGrid(100, 440, 8, 2, 55, 22, 5, '#9a8fE5', true),

  // ====== 4층 경사 위 핀 (좌측으로) ======
  ...createSlopePegs(550, 480, 140, 515, 10, 5, '#8a7fD5'),
  { type: 'bumper', pos: { x: 400, y: 490 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.4, color: '#FF6B81' },
  { type: 'spinner', pos: { x: 250, y: 510 }, size: { x: 65, y: 7 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: -3, currentAngle: 0 },

  // ====== 4-5층 사이 핀 ======
  ...createPegGrid(80, 540, 9, 2, 52, 22, 5, '#aa9fF5', true),

  // ====== 5층 경사 위 핀 (우측으로) ======
  ...createSlopePegs(50, 580, 460, 615, 10, 5, '#9a8fE5'),
  { type: 'bumper', pos: { x: 300, y: 590 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.5, color: '#FF4757' },

  // ====== 5-6층 사이 핀 ======
  ...createPegGrid(100, 640, 8, 2, 55, 22, 5, '#baaFF5', true),

  // ====== 6층 경사 위 핀 (좌측으로) ======
  ...createSlopePegs(550, 680, 140, 715, 10, 5, '#aa9fF5'),
  { type: 'bumper', pos: { x: 250, y: 690 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#A855F7' },
  { type: 'bumper', pos: { x: 400, y: 700 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#EE5A24' },

  // ====== 하단 카오스 존 (y:740~830) ======
  ...createPegGrid(60, 740, 10, 4, 50, 24, 5, '#cabFF5', true),

  // 하단 대형 범퍼
  { type: 'bumper', pos: { x: 180, y: 760 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.5, color: '#FECA57' },
  { type: 'bumper', pos: { x: 300, y: 780 }, size: { x: 18, y: 18 }, rotation: 0, restitution: 1.6, color: '#FF4757' },
  { type: 'bumper', pos: { x: 420, y: 760 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  // 최종 스피너
  { type: 'spinner', pos: { x: 230, y: 810 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.5, color: '#FF9FF3', spinSpeed: 4, currentAngle: 0 },
  { type: 'spinner', pos: { x: 370, y: 810 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.5, color: '#FF9FF3', spinSpeed: -4, currentAngle: 0 },
];

export const zigzagMap: MapData = {
  name: 'zigzag',
  nameKo: '지그재그',
  width: 600,
  height: 900,
  startArea: { x: 60, y: 20, width: 480, height: 55 },
  finishLine: 865,
  gravity: 370,
  background: '#1a0a2e',
  walls: [
    // 외벽
    { x1: 35, y1: 0, x2: 35, y2: 900, restitution: 0.6 },
    { x1: 565, y1: 0, x2: 565, y2: 900, restitution: 0.6 },

    // 지그재그 경사로
    // 1층: →
    { x1: 35, y1: 180, x2: 470, y2: 220, restitution: 0.45 },
    { x1: 470, y1: 220, x2: 470, y2: 240, restitution: 0.5 },
    // 2층: ←
    { x1: 565, y1: 280, x2: 130, y2: 320, restitution: 0.45 },
    { x1: 130, y1: 320, x2: 130, y2: 340, restitution: 0.5 },
    // 3층: →
    { x1: 35, y1: 380, x2: 470, y2: 420, restitution: 0.45 },
    { x1: 470, y1: 420, x2: 470, y2: 440, restitution: 0.5 },
    // 4층: ←
    { x1: 565, y1: 480, x2: 130, y2: 520, restitution: 0.45 },
    { x1: 130, y1: 520, x2: 130, y2: 540, restitution: 0.5 },
    // 5층: →
    { x1: 35, y1: 580, x2: 470, y2: 620, restitution: 0.45 },
    { x1: 470, y1: 620, x2: 470, y2: 640, restitution: 0.5 },
    // 6층: ←
    { x1: 565, y1: 680, x2: 130, y2: 720, restitution: 0.45 },
    { x1: 130, y1: 720, x2: 130, y2: 740, restitution: 0.5 },

    // 하단 깔때기
    { x1: 35, y1: 860, x2: 230, y2: 860, restitution: 0.3 },
    { x1: 565, y1: 860, x2: 370, y2: 860, restitution: 0.3 },
  ],
  obstacles,
};
