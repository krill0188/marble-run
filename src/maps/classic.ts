// ===== 클래식 맵 - 파친코/갈톤보드 스타일 =====
import { MapData, Obstacle } from '../types';

// 핀 배열 생성 헬퍼
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

const obstacles: Obstacle[] = [
  // ====== 1구역: 상단 분산 핀 (y: 120~230) ======
  // 핀 4px, 간격 55px — 구슬(8px)이 편하게 지나감
  ...createPegGrid(75, 120, 9, 4, 55, 30, 4, '#4a6fa5', true),

  // 1구역 범퍼
  { type: 'bumper', pos: { x: 200, y: 145 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: '#FF4757' },
  { type: 'bumper', pos: { x: 400, y: 145 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: '#FF4757' },
  { type: 'bumper', pos: { x: 300, y: 190 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  // ====== 2구역: (y: 260~370) ======
  ...createPegGrid(60, 270, 9, 4, 58, 28, 4, '#5a7fa5', true),

  // 삼각 장애물 (작게)
  { type: 'triangle', pos: { x: 180, y: 300 }, size: { x: 30, y: 24 }, rotation: 0, restitution: 0.7, color: '#2ED573' },
  { type: 'triangle', pos: { x: 420, y: 300 }, size: { x: 30, y: 24 }, rotation: 0, restitution: 0.7, color: '#2ED573' },

  // 범퍼
  { type: 'bumper', pos: { x: 120, y: 340 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: '#FFA502' },
  { type: 'bumper', pos: { x: 300, y: 330 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: '#FF6B81' },
  { type: 'bumper', pos: { x: 480, y: 340 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.3, color: '#FFA502' },

  // ====== 3구역: 스피너 + 핀 (y: 400~510) ======
  ...createPegGrid(70, 410, 9, 3, 56, 30, 4, '#6a8fb5', true),

  // 스피너 (슬림)
  { type: 'spinner', pos: { x: 180, y: 460 }, size: { x: 55, y: 6 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: 2.8, currentAngle: 0 },
  { type: 'spinner', pos: { x: 420, y: 460 }, size: { x: 55, y: 6 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: -2.8, currentAngle: 0 },

  // 범퍼
  { type: 'bumper', pos: { x: 250, y: 490 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#A855F7' },
  { type: 'bumper', pos: { x: 350, y: 490 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: '#A855F7' },
  { type: 'bumper', pos: { x: 300, y: 510 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FF4757' },

  // ====== 4구역: 핀 + 사각 (y: 540~650) ======
  ...createPegGrid(55, 550, 10, 4, 54, 26, 4, '#7a9fc5', true),

  // 사각 블록 (작게)
  { type: 'rect', pos: { x: 200, y: 590 }, size: { x: 30, y: 8 }, rotation: 0.15, restitution: 0.5, color: '#1E90FF' },
  { type: 'rect', pos: { x: 400, y: 590 }, size: { x: 30, y: 8 }, rotation: -0.15, restitution: 0.5, color: '#1E90FF' },
  { type: 'rect', pos: { x: 300, y: 630 }, size: { x: 35, y: 8 }, rotation: 0, restitution: 0.5, color: '#00D2D3' },

  // 범퍼
  { type: 'bumper', pos: { x: 140, y: 640 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.2, color: '#EE5A24' },
  { type: 'bumper', pos: { x: 460, y: 640 }, size: { x: 9, y: 9 }, rotation: 0, restitution: 1.2, color: '#EE5A24' },

  // ====== 5구역: 하단 카오스 (y: 680~810) ======
  ...createPegGrid(65, 690, 9, 4, 56, 28, 4, '#8aafD5', true),

  // 대형 범퍼 삼각 배치
  { type: 'bumper', pos: { x: 180, y: 720 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FECA57' },
  { type: 'bumper', pos: { x: 300, y: 740 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.6, color: '#FF4757' },
  { type: 'bumper', pos: { x: 420, y: 720 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  // 하단 스피너
  { type: 'spinner', pos: { x: 250, y: 780 }, size: { x: 45, y: 6 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: 3.5, currentAngle: 0 },
  { type: 'spinner', pos: { x: 350, y: 780 }, size: { x: 45, y: 6 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: -3.5, currentAngle: 0 },

  // 골라인 직전 핀
  ...createPegGrid(120, 820, 8, 2, 50, 18, 3, '#9abfE5', true),
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
    // 좌우 외벽
    { x1: 35, y1: 0, x2: 35, y2: 900, restitution: 0.6 },
    { x1: 565, y1: 0, x2: 565, y2: 900, restitution: 0.6 },
    // 1단 좌 경사
    { x1: 35, y1: 240, x2: 140, y2: 260, restitution: 0.5 },
    // 1단 우 경사
    { x1: 565, y1: 240, x2: 460, y2: 260, restitution: 0.5 },
    // 2단 좌 경사
    { x1: 35, y1: 390, x2: 120, y2: 405, restitution: 0.5 },
    // 2단 우 경사
    { x1: 565, y1: 390, x2: 480, y2: 405, restitution: 0.5 },
    // 3단 좌 경사
    { x1: 35, y1: 535, x2: 110, y2: 548, restitution: 0.5 },
    // 3단 우 경사
    { x1: 565, y1: 535, x2: 490, y2: 548, restitution: 0.5 },
    // 4단 좌 경사
    { x1: 35, y1: 675, x2: 130, y2: 685, restitution: 0.5 },
    // 4단 우 경사
    { x1: 565, y1: 675, x2: 470, y2: 685, restitution: 0.5 },
    // 골라인 깔때기 (넓게)
    { x1: 35, y1: 870, x2: 200, y2: 865, restitution: 0.3 },
    { x1: 565, y1: 870, x2: 400, y2: 865, restitution: 0.3 },
  ],
  obstacles,
};
