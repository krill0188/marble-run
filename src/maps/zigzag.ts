// ===== 지그재그 맵 (롱 코스 — 10층) =====
import { MapData, Obstacle } from '../types';
import { createFinishWalls, createFinishObstacles } from './finish';

const PEG = '#3a3f4a'; const BMP = '#4a4f5a'; const SPN = '#505868'; const BLK = '#454d5e';

function pegs(sx: number, sy: number, cols: number, rows: number, dx: number, dy: number, r: number, stagger = true): Obstacle[] {
  const out: Obstacle[] = [];
  for (let row = 0; row < rows; row++) {
    const off = stagger && row % 2 === 1 ? dx / 2 : 0;
    const c = stagger && row % 2 === 1 ? cols - 1 : cols;
    for (let col = 0; col < c; col++)
      out.push({ type: 'circle', pos: { x: sx + col * dx + off, y: sy + row * dy }, size: { x: r, y: r }, rotation: 0, restitution: 0.55, color: PEG });
  }
  return out;
}

function slopePegs(x1: number, y1: number, x2: number, y2: number, count: number, r: number): Obstacle[] {
  const out: Obstacle[] = [];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    out.push({ type: 'circle', pos: { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t - 18 }, size: { x: r, y: r }, rotation: 0, restitution: 0.6, color: PEG });
  }
  return out;
}

// 10층 지그재그 생성
function makeFloor(floorIdx: number, goRight: boolean): { obstacles: Obstacle[], wallY: number } {
  const baseY = 100 + floorIdx * 120;
  const slopeY = baseY + 80;
  const obs: Obstacle[] = [];

  // 상단 핀
  obs.push(...pegs(70 + (floorIdx % 2) * 10, baseY, 8, 2, 58, 22, 5));

  // 경사면 핀
  if (goRight) {
    obs.push(...slopePegs(50, slopeY, 460, slopeY + 30, 8, 5));
  } else {
    obs.push(...slopePegs(550, slopeY, 140, slopeY + 30, 8, 5));
  }

  // 랜덤 장애물 (층마다 다른 타입)
  const cx = goRight ? 250 + (floorIdx % 3) * 50 : 350 - (floorIdx % 3) * 50;
  if (floorIdx % 3 === 0) {
    obs.push({ type: 'bumper', pos: { x: cx, y: slopeY + 5 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.4, color: BMP });
  } else if (floorIdx % 3 === 1) {
    obs.push({ type: 'spinner', pos: { x: 300, y: slopeY + 15 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.6, color: SPN, spinSpeed: goRight ? 3 : -3, currentAngle: 0 });
  } else {
    obs.push({ type: 'triangle', pos: { x: cx, y: slopeY + 10 }, size: { x: 28, y: 22 }, rotation: 0, restitution: 0.7, color: BLK });
  }

  return { obstacles: obs, wallY: slopeY };
}

const allObs: Obstacle[] = [];
const walls: { x1: number; y1: number; x2: number; y2: number; restitution: number }[] = [
  // 외벽
  { x1: 35, y1: 0, x2: 35, y2: 1400, restitution: 0.6 },
  { x1: 565, y1: 0, x2: 565, y2: 1400, restitution: 0.6 },
];

// 초기 핀
allObs.push(...pegs(70, 80, 9, 2, 56, 22, 5));
allObs.push({ type: 'bumper', pos: { x: 200, y: 85 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BMP });
allObs.push({ type: 'bumper', pos: { x: 400, y: 85 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 1.3, color: BMP });

// 10층 생성
for (let i = 0; i < 10; i++) {
  const goRight = i % 2 === 0;
  const { obstacles: floorObs, wallY } = makeFloor(i, goRight);
  allObs.push(...floorObs);

  if (goRight) {
    walls.push({ x1: 35, y1: wallY, x2: 460, y2: wallY + 30, restitution: 0.45 });
    walls.push({ x1: 460, y1: wallY + 30, x2: 460, y2: wallY + 50, restitution: 0.5 });
  } else {
    walls.push({ x1: 565, y1: wallY, x2: 140, y2: wallY + 30, restitution: 0.45 });
    walls.push({ x1: 140, y1: wallY + 30, x2: 140, y2: wallY + 50, restitution: 0.5 });
  }
}

// 하단 카오스 존
const chaosY = 100 + 10 * 120 + 20;
allObs.push(...pegs(60, chaosY, 9, 4, 56, 26, 5));
allObs.push({ type: 'bumper', pos: { x: 180, y: chaosY + 30 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP });
allObs.push({ type: 'bumper', pos: { x: 300, y: chaosY + 50 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.6, color: BMP });
allObs.push({ type: 'bumper', pos: { x: 420, y: chaosY + 30 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.5, color: BMP });
allObs.push({ type: 'spinner', pos: { x: 230, y: chaosY + 80 }, size: { x: 45, y: 5 }, rotation: 0, restitution: 0.5, color: SPN, spinSpeed: 4, currentAngle: 0 });
allObs.push({ type: 'spinner', pos: { x: 370, y: chaosY + 80 }, size: { x: 45, y: 5 }, rotation: 0, restitution: 0.5, color: SPN, spinSpeed: -4, currentAngle: 0 });

// 피니시 슬롯
allObs.push(...createFinishObstacles(600, 1370));
walls.push(...createFinishWalls(600, 1370, 35, 565));

export const zigzagMap: MapData = {
  name: 'zigzag',
  nameKo: '지그재그',
  width: 600,
  height: 1400,
  startArea: { x: 60, y: 15, width: 480, height: 45 },
  finishLine: 1370,
  gravity: 400,
  background: '#1a0a2e',
  walls,
  obstacles: allObs,
};
