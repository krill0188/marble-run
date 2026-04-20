// ===== 지그재그 맵 - S자 경로 =====
import { MapData } from '../types';

export const zigzagMap: MapData = {
  name: 'zigzag',
  nameKo: '지그재그',
  width: 600,
  height: 900,
  startArea: { x: 50, y: 30, width: 500, height: 60 },
  finishLine: 860,
  gravity: 350,
  background: '#1a0a2e',
  walls: [
    // 외벽
    { x1: 30, y1: 0, x2: 30, y2: 900, restitution: 0.6 },
    { x1: 570, y1: 0, x2: 570, y2: 900, restitution: 0.6 },

    // 지그재그 경사로 (좌→우→좌→우 반복)
    // 1층: 우측으로
    { x1: 30, y1: 150, x2: 470, y2: 190, restitution: 0.4 },
    // 1층 낙하구
    { x1: 470, y1: 190, x2: 470, y2: 210, restitution: 0.5 },

    // 2층: 좌측으로
    { x1: 570, y1: 250, x2: 130, y2: 290, restitution: 0.4 },
    { x1: 130, y1: 290, x2: 130, y2: 310, restitution: 0.5 },

    // 3층: 우측으로
    { x1: 30, y1: 350, x2: 470, y2: 390, restitution: 0.4 },
    { x1: 470, y1: 390, x2: 470, y2: 410, restitution: 0.5 },

    // 4층: 좌측으로
    { x1: 570, y1: 450, x2: 130, y2: 490, restitution: 0.4 },
    { x1: 130, y1: 490, x2: 130, y2: 510, restitution: 0.5 },

    // 5층: 우측으로
    { x1: 30, y1: 550, x2: 470, y2: 590, restitution: 0.4 },
    { x1: 470, y1: 590, x2: 470, y2: 610, restitution: 0.5 },

    // 6층: 좌측으로
    { x1: 570, y1: 650, x2: 130, y2: 690, restitution: 0.4 },
    { x1: 130, y1: 690, x2: 130, y2: 710, restitution: 0.5 },

    // 최종 깔때기
    { x1: 30, y1: 780, x2: 230, y2: 850, restitution: 0.4 },
    { x1: 570, y1: 780, x2: 370, y2: 850, restitution: 0.4 },
  ],
  obstacles: [
    // 각 층 중간에 범퍼/핀 배치
    // 1층
    { type: 'bumper', pos: { x: 250, y: 155 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.2, color: '#FF4757' },
    { type: 'circle', pos: { x: 380, y: 165 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.8, color: '#54A0FF' },

    // 2층
    { type: 'bumper', pos: { x: 350, y: 255 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.2, color: '#2ED573' },
    { type: 'circle', pos: { x: 220, y: 265 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.8, color: '#FFA502' },

    // 3층
    { type: 'spinner', pos: { x: 250, y: 360 }, size: { x: 50, y: 7 }, rotation: 0, restitution: 0.6, color: '#FECA57', spinSpeed: 3, currentAngle: 0 },
    { type: 'circle', pos: { x: 400, y: 370 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.8, color: '#A855F7' },

    // 4층
    { type: 'bumper', pos: { x: 350, y: 455 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.4, color: '#FF6B81' },
    { type: 'triangle', pos: { x: 250, y: 470 }, size: { x: 35, y: 30 }, rotation: 0, restitution: 0.7, color: '#00D2D3' },

    // 5층
    { type: 'spinner', pos: { x: 350, y: 560 }, size: { x: 55, y: 7 }, rotation: 0, restitution: 0.6, color: '#FF9FF3', spinSpeed: -3.5, currentAngle: 0 },
    { type: 'bumper', pos: { x: 180, y: 570 }, size: { x: 12, y: 12 }, rotation: 0, restitution: 1.3, color: '#EE5A24' },

    // 6층
    { type: 'bumper', pos: { x: 350, y: 655 }, size: { x: 14, y: 14 }, rotation: 0, restitution: 1.3, color: '#5F27CD' },
    { type: 'circle', pos: { x: 250, y: 670 }, size: { x: 10, y: 10 }, rotation: 0, restitution: 0.9, color: '#0ABDE3' },

    // 하단 혼돈 구간
    { type: 'bumper', pos: { x: 200, y: 740 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.4, color: '#FF4757' },
    { type: 'bumper', pos: { x: 300, y: 750 }, size: { x: 16, y: 16 }, rotation: 0, restitution: 1.5, color: '#FECA57' },
    { type: 'bumper', pos: { x: 400, y: 740 }, size: { x: 13, y: 13 }, rotation: 0, restitution: 1.4, color: '#FF4757' },
  ],
};
