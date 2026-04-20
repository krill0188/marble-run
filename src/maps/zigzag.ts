// ===== 지그재그 맵 - S자 + 핀 =====
import { MapData, Obstacle } from '../types';

function createPegGrid(
  startX: number, startY: number,
  cols: number, rows: number,
  spacingX: number, spacingY: number,
  radius: number, color: string,
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
        rotation: 0, restitution: 0.55, color,
      });
    }
  }
  return pegs;
}

function createSlopePegs(
  x1: number, y1: number, x2: number, y2: number,
  count: number, radius: number, color: string
): Obstacle[] {
  const pegs: Obstacle[] = [];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    pegs.push({
      type: 'circle',
      pos: { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t - 18 },
      size: { x: radius, y: radius },
      rotation: 0, restitution: 0.6, color,
    });
  }
  return pegs;
}

const obstacles: Obstacle[] = [
  // ====== 상단 핀 (y:100~160) ======
  ...createPegGrid(70, 100, 9, 3, 56, 26, 4, '#5a4fa5', true),

  { type: 'bumper', pos: { x: 200, y: 110 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#FF4757' },
  { type: 'bumper', pos: { x: 400, y: 110 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#FF4757' },

  // ====== 1층 경사 핀 ======
  ...createSlopePegs(50, 180, 460, 210, 8, 4, '#6a5fb5'),
  { type: 'bumper', pos: { x: 250, y: 185 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.2, color: '#FFA502' },

  // 1-2층 핀
  ...createPegGrid(100, 235, 7, 2, 60, 22, 4, '#7a6fc5', true),

  // ====== 2층 경사 핀 ======
  ...createSlopePegs(550, 275, 140, 305, 8, 4, '#6a5fb5'),
  { type: 'bumper', pos: { x: 350, y: 285 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.2, color: '#2ED573' },
  { type: 'spinner', pos: { x: 300, y: 305 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: 2.5, currentAngle: 0 },

  // 2-3층 핀
  ...createPegGrid(80, 335, 8, 2, 58, 22, 4, '#8a7fD5', true),

  // ====== 3층 경사 핀 ======
  ...createSlopePegs(50, 375, 460, 405, 8, 4, '#7a6fc5'),
  { type: 'bumper', pos: { x: 200, y: 385 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: '#FECA57' },
  { type: 'triangle', pos: { x: 350, y: 395 }, size: { x: 28, y: 22 }, rotation: 0, restitution: 0.7, color: '#00D2D3' },

  // 3-4층 핀
  ...createPegGrid(100, 430, 7, 2, 60, 22, 4, '#9a8fE5', true),

  // ====== 4층 경사 핀 ======
  ...createSlopePegs(550, 470, 140, 500, 8, 4, '#8a7fD5'),
  { type: 'bumper', pos: { x: 400, y: 480 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: '#FF6B81' },
  { type: 'spinner', pos: { x: 250, y: 500 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: -3, currentAngle: 0 },

  // 4-5층 핀
  ...createPegGrid(80, 530, 8, 2, 58, 22, 4, '#aa9fF5', true),

  // ====== 5층 경사 핀 ======
  ...createSlopePegs(50, 570, 460, 600, 8, 4, '#9a8fE5'),
  { type: 'bumper', pos: { x: 300, y: 580 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FF4757' },

  // 5-6층 핀
  ...createPegGrid(100, 625, 7, 2, 60, 22, 4, '#baaFF5', true),

  // ====== 6층 경사 핀 ======
  ...createSlopePegs(550, 665, 140, 695, 8, 4, '#aa9fF5'),
  { type: 'bumper', pos: { x: 250, y: 675 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#A855F7' },
  { type: 'bumper', pos: { x: 400, y: 685 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#EE5A24' },

  // ====== 하단 카오스 (y:720~810) ======
  ...createPegGrid(60, 730, 9, 3, 56, 26, 4, '#cabFF5', true),

  { type: 'bumper', pos: { x: 180, y: 750 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FECA57' },
  { type: 'bumper', pos: { x: 300, y: 770 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.6, color: '#FF4757' },
  { type: 'bumper', pos: { x: 420, y: 750 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  { type: 'spinner', pos: { x: 230, y: 800 }, size: { x: 40, y: 5 }, rotation: 0, restitution: 0.5, color: '#FF9FF3', spinSpeed: 4, currentAngle: 0 },
  { type: 'spinner', pos: { x: 370, y: 800 }, size: { x: 40, y: 5 }, rotation: 0, restitution: 0.5, color: '#FF9FF3', spinSpeed: -4, currentAngle: 0 },
];

export const zigzagMap: MapData = {
  name: 'zigzag',
  nameKo: '지그재그',
  width: 600,
  height: 900,
  startArea: { x: 60, y: 20, width: 480, height: 55 },
  finishLine: 865,
  gravity: 400,
  background: '#1a0a2e',
  walls: [
    // 외벽
    { x1: 35, y1: 0, x2: 35, y2: 900, restitution: 0.6 },
    { x1: 565, y1: 0, x2: 565, y2: 900, restitution: 0.6 },
    // 1층: → (끝에 낙하 공간 넓게)
    { x1: 35, y1: 180, x2: 460, y2: 215, restitution: 0.45 },
    { x1: 460, y1: 215, x2: 460, y2: 235, restitution: 0.5 },
    // 2층: ←
    { x1: 565, y1: 275, x2: 140, y2: 310, restitution: 0.45 },
    { x1: 140, y1: 310, x2: 140, y2: 330, restitution: 0.5 },
    // 3층: →
    { x1: 35, y1: 375, x2: 460, y2: 410, restitution: 0.45 },
    { x1: 460, y1: 410, x2: 460, y2: 430, restitution: 0.5 },
    // 4층: ←
    { x1: 565, y1: 470, x2: 140, y2: 505, restitution: 0.45 },
    { x1: 140, y1: 505, x2: 140, y2: 525, restitution: 0.5 },
    // 5층: →
    { x1: 35, y1: 570, x2: 460, y2: 605, restitution: 0.45 },
    { x1: 460, y1: 605, x2: 460, y2: 625, restitution: 0.5 },
    // 6층: ←
    { x1: 565, y1: 665, x2: 140, y2: 700, restitution: 0.45 },
    { x1: 140, y1: 700, x2: 140, y2: 720, restitution: 0.5 },
    // 하단 깔때기
    { x1: 35, y1: 855, x2: 220, y2: 855, restitution: 0.3 },
    { x1: 565, y1: 855, x2: 380, y2: 855, restitution: 0.3 },
  ],
  obstacles,
};
