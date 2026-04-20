// ===== 공통 피니시 슬롯 구조 =====
// 맵 하단에 좁은 깔때기 → 1열 통과 슬롯
import { Obstacle, Segment } from '../types';

const SPN = '#505868';

// 피니시 구간 벽 생성 (깔때기 → 좁은 1열 슬롯)
export function createFinishWalls(
  mapWidth: number,
  finishY: number,
  leftWall: number,
  rightWall: number,
): Segment[] {
  const cx = mapWidth / 2;
  const slotWidth = 20;
  const funnelStart = finishY - 120;
  const slotStart = finishY - 40;
  const slotEnd = finishY + 30;

  return [
    // 좌측 깔때기
    { x1: leftWall, y1: funnelStart, x2: cx - slotWidth, y2: slotStart, restitution: 0.4 },
    // 우측 깔때기
    { x1: rightWall, y1: funnelStart, x2: cx + slotWidth, y2: slotStart, restitution: 0.4 },
    // 좌측 슬롯 벽
    { x1: cx - slotWidth, y1: slotStart, x2: cx - slotWidth, y2: slotEnd, restitution: 0.5 },
    // 우측 슬롯 벽
    { x1: cx + slotWidth, y1: slotStart, x2: cx + slotWidth, y2: slotEnd, restitution: 0.5 },
  ];
}

// 피니시 구간 장애물 — 스피너(회전 막대)만
export function createFinishObstacles(
  mapWidth: number,
  finishY: number,
): Obstacle[] {
  const cx = mapWidth / 2;
  const funnelStart = finishY - 120;

  return [
    // 깔때기 중간에 회전 막대 1개 — 구슬 순서를 섞어줌
    { type: 'spinner', pos: { x: cx, y: funnelStart + 50 }, size: { x: 80, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: 2.5, currentAngle: 0 },
  ];
}
