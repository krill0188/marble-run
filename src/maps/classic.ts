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
  // ====== 1구역: 상단 분산 핀 필드 (y: 120~250) ======
  ...createPegGrid(80, 120, 10, 5, 50, 28, 6, '#4a6fa5', true),

  // 1구역 범퍼 (큰 것 3개 — 방향 변환용)
  { type: 'bumper', pos: { x: 200, y: 150 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.4, color: '#FF4757' },
  { type: 'bumper', pos: { x: 400, y: 150 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.4, color: '#FF4757' },
  { type: 'bumper', pos: { x: 300, y: 200 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  // ====== 2구역: 좌우 경사 + 핀 필드 (y: 270~400) ======
  ...createPegGrid(60, 280, 11, 5, 48, 26, 5, '#5a7fa5', true),

  // 2구역 삼각 장애물
  { type: 'triangle', pos: { x: 180, y: 310 }, size: { x: 45, y: 35 }, rotation: 0, restitution: 0.7, color: '#2ED573' },
  { type: 'triangle', pos: { x: 420, y: 310 }, size: { x: 45, y: 35 }, rotation: 0, restitution: 0.7, color: '#2ED573' },

  // 2구역 범퍼
  { type: 'bumper', pos: { x: 120, y: 350 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.3, color: '#FFA502' },
  { type: 'bumper', pos: { x: 300, y: 340 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.4, color: '#FF6B81' },
  { type: 'bumper', pos: { x: 480, y: 350 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.3, color: '#FFA502' },

  // ====== 3구역: 스피너 + 핀 혼합 (y: 420~540) ======
  ...createPegGrid(70, 430, 10, 4, 50, 30, 5, '#6a8fb5', true),

  // 스피너 2개
  { type: 'spinner', pos: { x: 180, y: 470 }, size: { x: 70, y: 8 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: 2.8, currentAngle: 0 },
  { type: 'spinner', pos: { x: 420, y: 470 }, size: { x: 70, y: 8 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: -2.8, currentAngle: 0 },

  // 3구역 범퍼 링
  { type: 'bumper', pos: { x: 250, y: 500 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#A855F7' },
  { type: 'bumper', pos: { x: 350, y: 500 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.3, color: '#A855F7' },
  { type: 'bumper', pos: { x: 300, y: 530 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.5, color: '#FF4757' },

  // ====== 4구역: 밀집 핀 + 사각 장애물 (y: 560~680) ======
  ...createPegGrid(55, 570, 11, 5, 48, 24, 5, '#7a9fc5', true),

  // 사각 블록 (구슬 경로 분할)
  { type: 'rect', pos: { x: 200, y: 600 }, size: { x: 40, y: 12 }, rotation: 0.15, restitution: 0.5, color: '#1E90FF' },
  { type: 'rect', pos: { x: 400, y: 600 }, size: { x: 40, y: 12 }, rotation: -0.15, restitution: 0.5, color: '#1E90FF' },
  { type: 'rect', pos: { x: 300, y: 640 }, size: { x: 50, y: 12 }, rotation: 0, restitution: 0.5, color: '#00D2D3' },

  // 4구역 범퍼
  { type: 'bumper', pos: { x: 140, y: 650 }, size: { x: 11, y: 11 }, rotation: 0, restitution: 1.2, color: '#EE5A24' },
  { type: 'bumper', pos: { x: 460, y: 650 }, size: { x: 11, y: 11 }, rotation: 0, restitution: 1.2, color: '#EE5A24' },

  // ====== 5구역: 하단 카오스 존 (y: 700~820) ======
  ...createPegGrid(65, 710, 10, 4, 50, 28, 5, '#8aafD5', true),

  // 하단 대형 범퍼 삼각 배치
  { type: 'bumper', pos: { x: 180, y: 730 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.5, color: '#FECA57' },
  { type: 'bumper', pos: { x: 300, y: 750 }, size: { x: 18, y: 18 }, rotation: 0, restitution: 1.6, color: '#FF4757' },
  { type: 'bumper', pos: { x: 420, y: 730 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.5, color: '#FECA57' },

  // 하단 스피너
  { type: 'spinner', pos: { x: 250, y: 790 }, size: { x: 55, y: 7 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: 3.5, currentAngle: 0 },
  { type: 'spinner', pos: { x: 350, y: 790 }, size: { x: 55, y: 7 }, rotation: 0, restitution: 0.6, color: '#54A0FF', spinSpeed: -3.5, currentAngle: 0 },

  // 골라인 직전 핀
  ...createPegGrid(100, 830, 9, 2, 50, 20, 4, '#9abfE5', true),
];

export const classicMap: MapData = {
  name: 'classic',
  nameKo: '클래식',
  width: 600,
  height: 900,
  startArea: { x: 60, y: 20, width: 480, height: 60 },
  finishLine: 870,
  gravity: 420,
  background: '#1a1a2e',
  walls: [
    // 좌우 외벽
    { x1: 35, y1: 0, x2: 35, y2: 900, restitution: 0.6 },
    { x1: 565, y1: 0, x2: 565, y2: 900, restitution: 0.6 },
    // 1단 좌 경사
    { x1: 35, y1: 250, x2: 160, y2: 270, restitution: 0.5 },
    // 1단 우 경사
    { x1: 565, y1: 250, x2: 440, y2: 270, restitution: 0.5 },
    // 2단 좌 경사
    { x1: 35, y1: 400, x2: 140, y2: 420, restitution: 0.5 },
    // 2단 우 경사
    { x1: 565, y1: 400, x2: 460, y2: 420, restitution: 0.5 },
    // 3단 좌 경사
    { x1: 35, y1: 550, x2: 120, y2: 565, restitution: 0.5 },
    // 3단 우 경사
    { x1: 565, y1: 550, x2: 480, y2: 565, restitution: 0.5 },
    // 4단 좌 경사
    { x1: 35, y1: 700, x2: 150, y2: 710, restitution: 0.5 },
    // 4단 우 경사
    { x1: 565, y1: 700, x2: 450, y2: 710, restitution: 0.5 },
    // 골라인 깔때기
    { x1: 35, y1: 870, x2: 230, y2: 865, restitution: 0.3 },
    { x1: 565, y1: 870, x2: 370, y2: 865, restitution: 0.3 },
  ],
  obstacles,
};
