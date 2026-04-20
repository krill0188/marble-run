// ===== 공통 피니시 슬롯 구조 =====
// 맵 하단에 좁은 깔때기 → 1열 통과 슬롯
import { Obstacle, Segment } from '../types';

const PEG = '#3a3f4a';
const BMP = '#4a4f5a';

// 피니시 구간 벽 생성 (깔때기 → 좁은 1열 슬롯)
export function createFinishWalls(
  mapWidth: number,
  finishY: number, // 피니시 라인 Y
  leftWall: number, // 좌벽 X
  rightWall: number, // 우벽 X
): Segment[] {
  const cx = mapWidth / 2;
  const slotWidth = 20; // 구슬 1개만 지나갈 수 있는 폭 (구슬 반지름 6 * 2 = 12, 여유 8)
  const funnelStart = finishY - 120; // 깔때기 시작
  const slotStart = finishY - 40;     // 슬롯 시작
  const slotEnd = finishY + 30;       // 슬롯 끝 (피니시 라인 아래)

  return [
    // 좌측 깔때기: 넓은 곳 → 좁은 곳
    { x1: leftWall, y1: funnelStart, x2: cx - slotWidth, y2: slotStart, restitution: 0.4 },
    // 우측 깔때기
    { x1: rightWall, y1: funnelStart, x2: cx + slotWidth, y2: slotStart, restitution: 0.4 },
    // 좌측 슬롯 벽 (수직)
    { x1: cx - slotWidth, y1: slotStart, x2: cx - slotWidth, y2: slotEnd, restitution: 0.5 },
    // 우측 슬롯 벽 (수직)
    { x1: cx + slotWidth, y1: slotStart, x2: cx + slotWidth, y2: slotEnd, restitution: 0.5 },
  ];
}

// 피니시 구간 장애물 (슬롯 입구에 핀 배치 — 마지막 혼돈)
export function createFinishObstacles(
  mapWidth: number,
  finishY: number,
): Obstacle[] {
  const cx = mapWidth / 2;
  const funnelStart = finishY - 120;

  return [
    // 깔때기 입구 범퍼 — 마지막 역전 포인트
    { type: 'bumper', pos: { x: cx - 80, y: funnelStart + 20 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BMP },
    { type: 'bumper', pos: { x: cx + 80, y: funnelStart + 20 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BMP },
    { type: 'bumper', pos: { x: cx, y: funnelStart + 40 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP },

    // 깔때기 중간 핀
    { type: 'circle', pos: { x: cx - 40, y: funnelStart + 60 }, size: { x: 4, y: 4 }, rotation: 0, restitution: 0.6, color: PEG },
    { type: 'circle', pos: { x: cx + 40, y: funnelStart + 60 }, size: { x: 4, y: 4 }, rotation: 0, restitution: 0.6, color: PEG },
    { type: 'circle', pos: { x: cx - 20, y: funnelStart + 75 }, size: { x: 4, y: 4 }, rotation: 0, restitution: 0.6, color: PEG },
    { type: 'circle', pos: { x: cx + 20, y: funnelStart + 75 }, size: { x: 4, y: 4 }, rotation: 0, restitution: 0.6, color: PEG },
    { type: 'circle', pos: { x: cx, y: funnelStart + 85 }, size: { x: 4, y: 4 }, rotation: 0, restitution: 0.6, color: PEG },
  ];
}
