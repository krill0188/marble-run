// ===== 깔때기 맵 - 수렴/확산 =====
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
        rotation: 0, restitution: 0.6, color,
      });
    }
  }
  return pegs;
}

function createVPegs(
  centerX: number, startY: number,
  rows: number, startWidth: number, endWidth: number,
  spacingY: number, radius: number, color: string
): Obstacle[] {
  const pegs: Obstacle[] = [];
  for (let row = 0; row < rows; row++) {
    const t = row / (rows - 1);
    const width = startWidth + (endWidth - startWidth) * t;
    const cols = Math.max(2, Math.floor(width / 50));
    const startX = centerX - width / 2;
    const spacing = width / (cols - 1);
    for (let col = 0; col < cols; col++) {
      pegs.push({
        type: 'circle',
        pos: { x: startX + col * spacing, y: startY + row * spacingY },
        size: { x: radius, y: radius },
        rotation: 0, restitution: 0.65, color,
      });
    }
  }
  return pegs;
}

const obstacles: Obstacle[] = [
  // ====== 1: 넓은 상단 핀 (y:110~210) ======
  ...createPegGrid(60, 110, 9, 4, 58, 26, 4, '#4a7fa5', true),

  { type: 'bumper', pos: { x: 200, y: 130 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#FF6B81' },
  { type: 'bumper', pos: { x: 400, y: 130 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#FF6B81' },
  { type: 'bumper', pos: { x: 300, y: 170 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.4, color: '#FF4757' },

  // ====== 2: 1차 깔때기 (y:230~320) ======
  ...createVPegs(300, 230, 4, 420, 200, 24, 4, '#5a8fb5'),

  { type: 'bumper', pos: { x: 150, y: 260 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: '#FFA502' },
  { type: 'bumper', pos: { x: 450, y: 260 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: '#FFA502' },
  { type: 'bumper', pos: { x: 300, y: 290 }, size: { x: 11, y: 11 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  // ====== 3: 좁은 통로 + 스피너 (y:350~430) ======
  ...createPegGrid(210, 350, 4, 3, 50, 24, 4, '#6a9fc5', true),

  { type: 'spinner', pos: { x: 300, y: 385 }, size: { x: 65, y: 6 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: 3.2, currentAngle: 0 },
  { type: 'bumper', pos: { x: 240, y: 410 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: '#A855F7' },
  { type: 'bumper', pos: { x: 360, y: 410 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: '#A855F7' },

  // ====== 4: 확산 (y:450~540) ======
  ...createVPegs(300, 450, 4, 180, 420, 24, 4, '#7aafD5'),

  { type: 'triangle', pos: { x: 200, y: 480 }, size: { x: 28, y: 22 }, rotation: -0.2, restitution: 0.7, color: '#2ED573' },
  { type: 'triangle', pos: { x: 400, y: 480 }, size: { x: 28, y: 22 }, rotation: 0.2, restitution: 0.7, color: '#2ED573' },
  { type: 'bumper', pos: { x: 120, y: 520 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#EE5A24' },
  { type: 'bumper', pos: { x: 300, y: 530 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FF4757' },
  { type: 'bumper', pos: { x: 480, y: 520 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#EE5A24' },

  // ====== 5: 넓은 핀 (y:560~660) ======
  ...createPegGrid(55, 570, 9, 3, 58, 28, 4, '#8abfE5', true),

  { type: 'rect', pos: { x: 180, y: 600 }, size: { x: 28, y: 7 }, rotation: 0.2, restitution: 0.5, color: '#1E90FF' },
  { type: 'rect', pos: { x: 420, y: 600 }, size: { x: 28, y: 7 }, rotation: -0.2, restitution: 0.5, color: '#1E90FF' },
  { type: 'spinner', pos: { x: 200, y: 640 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: -3, currentAngle: 0 },
  { type: 'spinner', pos: { x: 400, y: 640 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: 3, currentAngle: 0 },

  // ====== 6: 최종 깔때기 (y:690~820) ======
  ...createVPegs(300, 700, 5, 420, 160, 24, 4, '#9acfF5'),

  { type: 'bumper', pos: { x: 200, y: 730 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FECA57' },
  { type: 'bumper', pos: { x: 300, y: 750 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.6, color: '#FF4757' },
  { type: 'bumper', pos: { x: 400, y: 730 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  ...createPegGrid(230, 800, 3, 2, 50, 18, 3, '#aadFFF', true),
];

export const funnelMap: MapData = {
  name: 'funnel',
  nameKo: '깔때기',
  width: 600,
  height: 900,
  startArea: { x: 60, y: 20, width: 480, height: 60 },
  finishLine: 870,
  gravity: 430,
  background: '#0d1b2a',
  walls: [
    { x1: 30, y1: 0, x2: 30, y2: 230, restitution: 0.6 },
    { x1: 570, y1: 0, x2: 570, y2: 230, restitution: 0.6 },
    // 1차 깔때기
    { x1: 30, y1: 230, x2: 180, y2: 350, restitution: 0.5 },
    { x1: 570, y1: 230, x2: 420, y2: 350, restitution: 0.5 },
    // 좁은 통로 (넉넉하게)
    { x1: 180, y1: 350, x2: 180, y2: 440, restitution: 0.6 },
    { x1: 420, y1: 350, x2: 420, y2: 440, restitution: 0.6 },
    // 확산
    { x1: 180, y1: 440, x2: 40, y2: 550, restitution: 0.5 },
    { x1: 420, y1: 440, x2: 560, y2: 550, restitution: 0.5 },
    // 넓은 구간
    { x1: 40, y1: 550, x2: 40, y2: 690, restitution: 0.6 },
    { x1: 560, y1: 550, x2: 560, y2: 690, restitution: 0.6 },
    // 최종 깔때기
    { x1: 40, y1: 690, x2: 210, y2: 845, restitution: 0.4 },
    { x1: 560, y1: 690, x2: 390, y2: 845, restitution: 0.4 },
    // 바닥
    { x1: 210, y1: 875, x2: 390, y2: 875, restitution: 0.3 },
  ],
  obstacles,
};
