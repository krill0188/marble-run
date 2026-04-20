// ===== 깔때기 맵 - 좁아졌다 넓어지는 수렴/확산 =====
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
        restitution: 0.6,
        color,
      });
    }
  }
  return pegs;
}

// V자 핀 배열 (깔때기 입구)
function createVPegs(
  centerX: number, startY: number,
  rows: number, startWidth: number, endWidth: number,
  spacingY: number, radius: number, color: string
): Obstacle[] {
  const pegs: Obstacle[] = [];
  for (let row = 0; row < rows; row++) {
    const t = row / (rows - 1);
    const width = startWidth + (endWidth - startWidth) * t;
    const cols = Math.max(2, Math.floor(width / 40));
    const startX = centerX - width / 2;
    const spacing = width / (cols - 1);
    for (let col = 0; col < cols; col++) {
      pegs.push({
        type: 'circle',
        pos: { x: startX + col * spacing, y: startY + row * spacingY },
        size: { x: radius, y: radius },
        rotation: 0,
        restitution: 0.65,
        color,
      });
    }
  }
  return pegs;
}

const obstacles: Obstacle[] = [
  // ====== 1구역: 넓은 상단 핀 필드 (y:110~220) ======
  ...createPegGrid(60, 110, 11, 5, 48, 24, 6, '#4a7fa5', true),

  // 상단 범퍼
  { type: 'bumper', pos: { x: 200, y: 130 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#FF6B81' },
  { type: 'bumper', pos: { x: 400, y: 130 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#FF6B81' },
  { type: 'bumper', pos: { x: 300, y: 180 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.4, color: '#FF4757' },

  // ====== 2구역: 1차 깔때기 (y:240~340) ======
  ...createVPegs(300, 240, 5, 450, 180, 22, 5, '#5a8fb5'),

  // 깔때기 입구 범퍼
  { type: 'bumper', pos: { x: 150, y: 270 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.3, color: '#FFA502' },
  { type: 'bumper', pos: { x: 450, y: 270 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.3, color: '#FFA502' },
  { type: 'bumper', pos: { x: 300, y: 300 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  // ====== 3구역: 좁은 통로 + 스피너 (y:360~440) ======
  ...createPegGrid(200, 360, 5, 4, 50, 22, 5, '#6a9fc5', true),

  // 통로 스피너
  { type: 'spinner', pos: { x: 300, y: 390 }, size: { x: 80, y: 8 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: 3.2, currentAngle: 0 },

  // 통로 범퍼
  { type: 'bumper', pos: { x: 230, y: 420 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.3, color: '#A855F7' },
  { type: 'bumper', pos: { x: 370, y: 420 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.3, color: '#A855F7' },

  // ====== 4구역: 확산 (좁→넓) (y:460~560) ======
  ...createVPegs(300, 460, 5, 160, 440, 22, 5, '#7aafD5'),

  // 확산 구간 삼각 장애물
  { type: 'triangle', pos: { x: 200, y: 490 }, size: { x: 40, y: 35 }, rotation: -0.2, restitution: 0.7, color: '#2ED573' },
  { type: 'triangle', pos: { x: 400, y: 490 }, size: { x: 40, y: 35 }, rotation: 0.2, restitution: 0.7, color: '#2ED573' },

  // 확산 범퍼
  { type: 'bumper', pos: { x: 120, y: 530 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#EE5A24' },
  { type: 'bumper', pos: { x: 300, y: 540 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.5, color: '#FF4757' },
  { type: 'bumper', pos: { x: 480, y: 530 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#EE5A24' },

  // ====== 5구역: 넓은 핀 필드 (y:580~680) ======
  ...createPegGrid(55, 580, 11, 4, 50, 26, 5, '#8abfE5', true),

  // 사각 블록
  { type: 'rect', pos: { x: 180, y: 610 }, size: { x: 35, y: 10 }, rotation: 0.2, restitution: 0.5, color: '#1E90FF' },
  { type: 'rect', pos: { x: 420, y: 610 }, size: { x: 35, y: 10 }, rotation: -0.2, restitution: 0.5, color: '#1E90FF' },

  // 스피너 쌍
  { type: 'spinner', pos: { x: 200, y: 660 }, size: { x: 60, y: 7 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: -3, currentAngle: 0 },
  { type: 'spinner', pos: { x: 400, y: 660 }, size: { x: 60, y: 7 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: 3, currentAngle: 0 },

  // ====== 6구역: 최종 깔때기 (y:700~830) ======
  ...createVPegs(300, 710, 6, 440, 140, 22, 5, '#9acfF5'),

  // 최종 대형 범퍼
  { type: 'bumper', pos: { x: 200, y: 740 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.5, color: '#FECA57' },
  { type: 'bumper', pos: { x: 300, y: 760 }, size: { x: 18, y: 18 }, rotation: 0, restitution: 1.6, color: '#FF4757' },
  { type: 'bumper', pos: { x: 400, y: 740 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  // 골라인 직전 핀
  ...createPegGrid(210, 810, 4, 2, 50, 18, 4, '#aadFFF', true),
];

export const funnelMap: MapData = {
  name: 'funnel',
  nameKo: '깔때기',
  width: 600,
  height: 900,
  startArea: { x: 60, y: 20, width: 480, height: 60 },
  finishLine: 870,
  gravity: 400,
  background: '#0d1b2a',
  walls: [
    // 외벽
    { x1: 30, y1: 0, x2: 30, y2: 240, restitution: 0.6 },
    { x1: 570, y1: 0, x2: 570, y2: 240, restitution: 0.6 },
    // 1차 깔때기 벽
    { x1: 30, y1: 240, x2: 170, y2: 360, restitution: 0.5 },
    { x1: 570, y1: 240, x2: 430, y2: 360, restitution: 0.5 },
    // 좁은 통로
    { x1: 170, y1: 360, x2: 170, y2: 450, restitution: 0.6 },
    { x1: 430, y1: 360, x2: 430, y2: 450, restitution: 0.6 },
    // 확산
    { x1: 170, y1: 450, x2: 40, y2: 560, restitution: 0.5 },
    { x1: 430, y1: 450, x2: 560, y2: 560, restitution: 0.5 },
    // 넓은 구간
    { x1: 40, y1: 560, x2: 40, y2: 700, restitution: 0.6 },
    { x1: 560, y1: 560, x2: 560, y2: 700, restitution: 0.6 },
    // 최종 깔때기
    { x1: 40, y1: 700, x2: 220, y2: 850, restitution: 0.4 },
    { x1: 560, y1: 700, x2: 380, y2: 850, restitution: 0.4 },
    // 바닥
    { x1: 220, y1: 875, x2: 380, y2: 875, restitution: 0.3 },
  ],
  obstacles,
};
