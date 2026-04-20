// ===== 깔때기 맵 - 수렴형 =====
import { MapData } from '../types';

export const funnelMap: MapData = {
  name: 'funnel',
  nameKo: '깔때기',
  width: 600,
  height: 900,
  startArea: { x: 50, y: 30, width: 500, height: 60 },
  finishLine: 860,
  gravity: 380,
  background: '#0d1b2a',
  walls: [
    // 좌우 벽 (점점 좁아짐)
    { x1: 20, y1: 0, x2: 20, y2: 300, restitution: 0.6 },
    { x1: 580, y1: 0, x2: 580, y2: 300, restitution: 0.6 },
    // 1차 깔때기
    { x1: 20, y1: 300, x2: 100, y2: 400, restitution: 0.5 },
    { x1: 580, y1: 300, x2: 500, y2: 400, restitution: 0.5 },
    // 중간 통로
    { x1: 100, y1: 400, x2: 100, y2: 500, restitution: 0.6 },
    { x1: 500, y1: 400, x2: 500, y2: 500, restitution: 0.6 },
    // 2차 확장
    { x1: 100, y1: 500, x2: 40, y2: 580, restitution: 0.5 },
    { x1: 500, y1: 500, x2: 560, y2: 580, restitution: 0.5 },
    // 넓은 구간
    { x1: 40, y1: 580, x2: 40, y2: 700, restitution: 0.6 },
    { x1: 560, y1: 580, x2: 560, y2: 700, restitution: 0.6 },
    // 최종 깔때기
    { x1: 40, y1: 700, x2: 200, y2: 830, restitution: 0.4 },
    { x1: 560, y1: 700, x2: 400, y2: 830, restitution: 0.4 },
    // 골라인 바닥
    { x1: 200, y1: 870, x2: 400, y2: 870, restitution: 0.3 },
  ],
  obstacles: [
    // 상단 분산 핀
    { type: 'circle', pos: { x: 150, y: 130 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.9, color: '#54A0FF' },
    { type: 'circle', pos: { x: 300, y: 130 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.9, color: '#54A0FF' },
    { type: 'circle', pos: { x: 450, y: 130 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.9, color: '#54A0FF' },

    { type: 'circle', pos: { x: 220, y: 180 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.9, color: '#54A0FF' },
    { type: 'circle', pos: { x: 380, y: 180 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.9, color: '#54A0FF' },

    // 1차 깔때기 입구 범퍼
    { type: 'bumper', pos: { x: 200, y: 270 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.3, color: '#FF6B81' },
    { type: 'bumper', pos: { x: 300, y: 250 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.4, color: '#FF4757' },
    { type: 'bumper', pos: { x: 400, y: 270 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.3, color: '#FF6B81' },

    // 중간 통로 장애물
    { type: 'spinner', pos: { x: 300, y: 450 }, size: { x: 70, y: 8 }, rotation: 0, restitution: 0.6, color: '#FECA57', spinSpeed: 3, currentAngle: 0 },

    // 2차 확장 구간
    { type: 'triangle', pos: { x: 200, y: 550 }, size: { x: 40, y: 35 }, rotation: 0.3, restitution: 0.7, color: '#2ED573' },
    { type: 'triangle', pos: { x: 400, y: 550 }, size: { x: 40, y: 35 }, rotation: -0.3, restitution: 0.7, color: '#2ED573' },

    // 넓은 구간 핀
    { type: 'circle', pos: { x: 150, y: 630 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 0.8, color: '#0ABDE3' },
    { type: 'circle', pos: { x: 300, y: 640 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 0.8, color: '#0ABDE3' },
    { type: 'circle', pos: { x: 450, y: 630 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 0.8, color: '#0ABDE3' },

    // 최종 깔때기 전 범퍼
    { type: 'bumper', pos: { x: 200, y: 720 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.5, color: '#A855F7' },
    { type: 'bumper', pos: { x: 300, y: 700 }, size: { x: 18, y: 18 }, rotation: 0, restitution: 1.6, color: '#FF4757' },
    { type: 'bumper', pos: { x: 400, y: 720 }, size: { x: 15, y: 15 }, rotation: 0, restitution: 1.5, color: '#A855F7' },

    // 골라인 근접
    { type: 'spinner', pos: { x: 300, y: 800 }, size: { x: 50, y: 6 }, rotation: 0, restitution: 0.5, color: '#FF9FF3', spinSpeed: -4, currentAngle: 0 },
  ],
};
