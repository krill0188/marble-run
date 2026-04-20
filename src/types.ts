// ===== 구슬런 타입 정의 =====

export interface Vec2 {
  x: number;
  y: number;
}

export interface Marble {
  id: number;
  name: string;
  pos: Vec2;
  vel: Vec2;
  radius: number;
  color: string;
  textColor: string;
  weight: number;
  finished: boolean;
  finishTime: number;
  finishOrder: number;
  rotation: number;
  angularVel: number;
  trail: Vec2[];
  skillActive: boolean;
  skillType: SkillType | null;
  skillTimer: number;
  opacity: number;
}

export type SkillType = 'boost' | 'shield' | 'shrink' | 'ghost' | 'magnet';

export interface Obstacle {
  type: 'circle' | 'rect' | 'triangle' | 'bumper' | 'spinner' | 'flipper';
  pos: Vec2;
  size: Vec2;
  rotation: number;
  restitution: number;
  color: string;
  spinSpeed?: number;
  currentAngle?: number;
}

export interface MapData {
  name: string;
  nameKo: string;
  width: number;
  height: number;
  startArea: { x: number; y: number; width: number; height: number };
  finishLine: number;
  obstacles: Obstacle[];
  walls: Segment[];
  background: string;
  gravity: number;
}

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  restitution: number;
}

export type WinnerMode = 'first' | 'last' | 'custom';

export interface GameConfig {
  winnerMode: WinnerMode;
  customRank: number;
  enableSkills: boolean;
  darkMode: boolean;
  selectedMap: string;
  showTrails: boolean;
  soundEnabled: boolean;
  volume: number;
}

export type GameState = 'idle' | 'ready' | 'running' | 'finished';

export interface GameResult {
  rankings: { name: string; time: number; order: number }[];
  winner: string;
  duration: number;
}

// 구슬 색상 팔레트 (방송용 선명한 색상)
export const MARBLE_COLORS: { bg: string; text: string }[] = [
  { bg: '#FF4757', text: '#FFFFFF' }, // 빨강
  { bg: '#2ED573', text: '#FFFFFF' }, // 초록
  { bg: '#1E90FF', text: '#FFFFFF' }, // 파랑
  { bg: '#FFA502', text: '#FFFFFF' }, // 주황
  { bg: '#A855F7', text: '#FFFFFF' }, // 보라
  { bg: '#FF6B81', text: '#FFFFFF' }, // 핑크
  { bg: '#00D2D3', text: '#FFFFFF' }, // 시안
  { bg: '#FECA57', text: '#333333' }, // 노랑
  { bg: '#FF9FF3', text: '#333333' }, // 연핑크
  { bg: '#54A0FF', text: '#FFFFFF' }, // 하늘
  { bg: '#5F27CD', text: '#FFFFFF' }, // 딥퍼플
  { bg: '#01A3A4', text: '#FFFFFF' }, // 틸
  { bg: '#F368E0', text: '#FFFFFF' }, // 마젠타
  { bg: '#FF6348', text: '#FFFFFF' }, // 토마토
  { bg: '#7BED9F', text: '#333333' }, // 민트
  { bg: '#E056A0', text: '#FFFFFF' }, // 로즈
  { bg: '#3742FA', text: '#FFFFFF' }, // 인디고
  { bg: '#FFDD59', text: '#333333' }, // 골드
  { bg: '#0ABDE3', text: '#FFFFFF' }, // 스카이
  { bg: '#EE5A24', text: '#FFFFFF' }, // 버밀리온
];
