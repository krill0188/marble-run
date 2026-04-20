// ===== 클래식 맵 - 핀볼 스타일 =====
import { MapData } from '../types';

export const classicMap: MapData = {
  name: 'classic',
  nameKo: '클래식',
  width: 600,
  height: 900,
  startArea: { x: 50, y: 30, width: 500, height: 60 },
  finishLine: 860,
  gravity: 400,
  background: '#1a1a2e',
  walls: [
    // 좌우 벽
    { x1: 30, y1: 0, x2: 30, y2: 900, restitution: 0.6 },
    { x1: 570, y1: 0, x2: 570, y2: 900, restitution: 0.6 },
    // 바닥 깔때기
    { x1: 30, y1: 870, x2: 250, y2: 860, restitution: 0.4 },
    { x1: 570, y1: 870, x2: 350, y2: 860, restitution: 0.4 },
    // 1단 경사로 (좌)
    { x1: 30, y1: 160, x2: 200, y2: 200, restitution: 0.5 },
    // 1단 경사로 (우)
    { x1: 570, y1: 200, x2: 400, y2: 240, restitution: 0.5 },
    // 2단 경사로 (좌)
    { x1: 30, y1: 320, x2: 250, y2: 360, restitution: 0.5 },
    // 2단 경사로 (우)
    { x1: 570, y1: 360, x2: 350, y2: 400, restitution: 0.5 },
    // 3단 경사로 (좌)
    { x1: 30, y1: 480, x2: 220, y2: 520, restitution: 0.5 },
    // 3단 경사로 (우)
    { x1: 570, y1: 520, x2: 380, y2: 560, restitution: 0.5 },
    // 4단 경사로 (좌)
    { x1: 30, y1: 640, x2: 240, y2: 680, restitution: 0.5 },
    // 4단 경사로 (우)
    { x1: 570, y1: 680, x2: 360, y2: 720, restitution: 0.5 },
  ],
  obstacles: [
    // 1구역 범퍼
    { type: 'bumper', pos: { x: 300, y: 140 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.3, color: '#FF4757' },
    { type: 'bumper', pos: { x: 150, y: 170 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.2, color: '#FFA502' },
    { type: 'bumper', pos: { x: 450, y: 170 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.2, color: '#FFA502' },

    // 2구역
    { type: 'circle', pos: { x: 200, y: 280 }, size: { x: 18, y: 18 }, rotation: 0, restitution: 0.8, color: '#5F27CD' },
    { type: 'circle', pos: { x: 400, y: 280 }, size: { x: 18, y: 18 }, rotation: 0, restitution: 0.8, color: '#5F27CD' },
    { type: 'bumper', pos: { x: 300, y: 310 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.4, color: '#FF6348' },

    // 3구역 - 삼각 장애물
    { type: 'triangle', pos: { x: 300, y: 450 }, size: { x: 50, y: 40 }, rotation: 0, restitution: 0.7, color: '#2ED573' },
    { type: 'circle', pos: { x: 150, y: 470 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 0.9, color: '#1E90FF' },
    { type: 'circle', pos: { x: 450, y: 470 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 0.9, color: '#1E90FF' },

    // 4구역 - 스피너
    { type: 'spinner', pos: { x: 200, y: 600 }, size: { x: 60, y: 8 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: 2.5, currentAngle: 0 },
    { type: 'spinner', pos: { x: 400, y: 600 }, size: { x: 60, y: 8 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: -2.5, currentAngle: 0 },

    // 5구역 - 하단 범퍼
    { type: 'bumper', pos: { x: 150, y: 750 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.2, color: '#FECA57' },
    { type: 'bumper', pos: { x: 300, y: 770 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.5, color: '#FF4757' },
    { type: 'bumper', pos: { x: 450, y: 750 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.2, color: '#FECA57' },

    // 골라인 앞 장애물
    { type: 'circle', pos: { x: 220, y: 820 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.8, color: '#00D2D3' },
    { type: 'circle', pos: { x: 380, y: 820 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.8, color: '#00D2D3' },
  ],
};
