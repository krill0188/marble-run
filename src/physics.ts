// ===== 구슬런 물리 엔진 =====
import { Vec2, Marble, Obstacle, Segment, MapData } from './types';

const FRICTION = 0.998;
const ANGULAR_FRICTION = 0.995;
const MIN_VELOCITY = 0.01;
const SUBSTEPS = 4;

export function vec2(x: number, y: number): Vec2 {
  return { x, y };
}

export function vec2Add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vec2Sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vec2Scale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

export function vec2Dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function vec2Length(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function vec2Normalize(v: Vec2): Vec2 {
  const len = vec2Length(v);
  if (len < 0.0001) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function vec2Dist(a: Vec2, b: Vec2): number {
  return vec2Length(vec2Sub(a, b));
}

export function vec2Rotate(v: Vec2, angle: number): Vec2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos };
}

// 구슬 간 충돌 감지 및 처리
export function resolveMarbleCollision(a: Marble, b: Marble): boolean {
  if (a.finished || b.finished) return false;
  // 고스트 스킬이면 충돌 무시
  if (a.skillType === 'ghost' && a.skillActive) return false;
  if (b.skillType === 'ghost' && b.skillActive) return false;

  const diff = vec2Sub(b.pos, a.pos);
  const dist = vec2Length(diff);
  const minDist = a.radius + b.radius;

  if (dist < minDist && dist > 0.001) {
    const normal = vec2Normalize(diff);
    const overlap = minDist - dist;

    // 위치 보정 (절반씩)
    const correction = vec2Scale(normal, overlap * 0.5);
    a.pos = vec2Sub(a.pos, correction);
    b.pos = vec2Add(b.pos, correction);

    // 충돌 반발 계수
    const restitution = 0.7;
    const relVel = vec2Sub(b.vel, a.vel);
    const relVelNormal = vec2Dot(relVel, normal);

    if (relVelNormal > 0) return false;

    const impulse = -(1 + restitution) * relVelNormal / 2;
    const impulseVec = vec2Scale(normal, impulse);

    a.vel = vec2Sub(a.vel, impulseVec);
    b.vel = vec2Add(b.vel, impulseVec);

    // 각속도 전달
    const tangent = { x: -normal.y, y: normal.x };
    const tangentVel = vec2Dot(relVel, tangent);
    a.angularVel -= tangentVel * 0.05;
    b.angularVel += tangentVel * 0.05;

    return true;
  }
  return false;
}

// 원형 장애물 충돌
function resolveCircleObstacle(marble: Marble, obs: Obstacle): boolean {
  const diff = vec2Sub(marble.pos, obs.pos);
  const dist = vec2Length(diff);
  const minDist = marble.radius + obs.size.x;

  if (dist < minDist && dist > 0.001) {
    const normal = vec2Normalize(diff);
    const overlap = minDist - dist;
    marble.pos = vec2Add(marble.pos, vec2Scale(normal, overlap));

    const velNormal = vec2Dot(marble.vel, normal);
    if (velNormal < 0) {
      const restitution = obs.type === 'bumper' ? 1.5 : obs.restitution;
      marble.vel = vec2Sub(marble.vel, vec2Scale(normal, (1 + restitution) * velNormal));

      const tangent = { x: -normal.y, y: normal.x };
      marble.angularVel += vec2Dot(marble.vel, tangent) * 0.1;
    }
    return true;
  }
  return false;
}

// 사각형 장애물 충돌
function resolveRectObstacle(marble: Marble, obs: Obstacle): boolean {
  // 회전된 좌표계로 변환
  const localPos = vec2Rotate(
    vec2Sub(marble.pos, obs.pos),
    -obs.rotation
  );

  const halfW = obs.size.x / 2;
  const halfH = obs.size.y / 2;

  const closestX = Math.max(-halfW, Math.min(halfW, localPos.x));
  const closestY = Math.max(-halfH, Math.min(halfH, localPos.y));

  const diff = vec2Sub(localPos, { x: closestX, y: closestY });
  const dist = vec2Length(diff);

  if (dist < marble.radius && dist > 0.001) {
    const localNormal = vec2Normalize(diff);
    const normal = vec2Rotate(localNormal, obs.rotation);
    const overlap = marble.radius - dist;

    marble.pos = vec2Add(marble.pos, vec2Scale(normal, overlap));

    const velNormal = vec2Dot(marble.vel, normal);
    if (velNormal < 0) {
      marble.vel = vec2Sub(marble.vel, vec2Scale(normal, (1 + obs.restitution) * velNormal));

      const tangent = { x: -normal.y, y: normal.x };
      marble.angularVel += vec2Dot(marble.vel, tangent) * 0.1;
    }
    return true;
  }
  return false;
}

// 삼각형 장애물 충돌 (3개 벽으로 분해)
function resolveTriangleObstacle(marble: Marble, obs: Obstacle): boolean {
  const hw = obs.size.x / 2;
  const hh = obs.size.y / 2;
  const cx = obs.pos.x;
  const cy = obs.pos.y;

  const vertices = [
    vec2Rotate({ x: 0, y: -hh }, obs.rotation),
    vec2Rotate({ x: -hw, y: hh }, obs.rotation),
    vec2Rotate({ x: hw, y: hh }, obs.rotation),
  ].map(v => vec2Add(v, obs.pos));

  let collided = false;
  for (let i = 0; i < 3; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % 3];
    if (resolveSegmentCollision(marble, a, b, obs.restitution)) {
      collided = true;
    }
  }
  return collided;
}

// 스피너 장애물 (회전)
function resolveSpinnerObstacle(marble: Marble, obs: Obstacle, dt: number): boolean {
  if (obs.spinSpeed) {
    obs.currentAngle = (obs.currentAngle || 0) + obs.spinSpeed * dt;
  }
  const saved = obs.rotation;
  obs.rotation = obs.currentAngle || 0;
  const result = resolveRectObstacle(marble, obs);
  if (result && obs.spinSpeed) {
    // 스피너의 회전 에너지를 구슬에 전달
    const tangent = vec2Rotate({ x: 1, y: 0 }, (obs.currentAngle || 0) + Math.PI / 2);
    marble.vel = vec2Add(marble.vel, vec2Scale(tangent, obs.spinSpeed * 30));
  }
  obs.rotation = saved;
  return result;
}

// 선분 충돌
function resolveSegmentCollision(
  marble: Marble,
  p1: Vec2,
  p2: Vec2,
  restitution: number
): boolean {
  const seg = vec2Sub(p2, p1);
  const segLen = vec2Length(seg);
  if (segLen < 0.001) return false;

  const segDir = vec2Scale(seg, 1 / segLen);
  const toMarble = vec2Sub(marble.pos, p1);
  const proj = vec2Dot(toMarble, segDir);
  const clampedProj = Math.max(0, Math.min(segLen, proj));

  const closest = vec2Add(p1, vec2Scale(segDir, clampedProj));
  const diff = vec2Sub(marble.pos, closest);
  const dist = vec2Length(diff);

  if (dist < marble.radius && dist > 0.001) {
    const normal = vec2Normalize(diff);
    const overlap = marble.radius - dist;
    marble.pos = vec2Add(marble.pos, vec2Scale(normal, overlap));

    const velNormal = vec2Dot(marble.vel, normal);
    if (velNormal < 0) {
      marble.vel = vec2Sub(marble.vel, vec2Scale(normal, (1 + restitution) * velNormal));

      // 마찰 — 접선 방향 감속
      const tangent = { x: -normal.y, y: normal.x };
      const velTangent = vec2Dot(marble.vel, tangent);
      marble.vel = vec2Sub(marble.vel, vec2Scale(tangent, velTangent * 0.03));
      marble.angularVel += velTangent * 0.15;
    }
    return true;
  }
  return false;
}

// 벽 충돌
export function resolveWallCollision(marble: Marble, wall: Segment): boolean {
  return resolveSegmentCollision(
    marble,
    { x: wall.x1, y: wall.y1 },
    { x: wall.x2, y: wall.y2 },
    wall.restitution
  );
}

// 장애물 충돌 디스패치
export function resolveObstacleCollision(
  marble: Marble,
  obs: Obstacle,
  dt: number
): boolean {
  if (marble.skillType === 'ghost' && marble.skillActive) return false;

  switch (obs.type) {
    case 'circle':
    case 'bumper':
      return resolveCircleObstacle(marble, obs);
    case 'rect':
    case 'flipper':
      return resolveRectObstacle(marble, obs);
    case 'triangle':
      return resolveTriangleObstacle(marble, obs);
    case 'spinner':
      return resolveSpinnerObstacle(marble, obs, dt);
    default:
      return false;
  }
}

// 물리 스텝
export function physicsStep(
  marbles: Marble[],
  map: MapData,
  dt: number,
  gameTime: number
): { collisions: { a: number; b: number }[]; wallHits: number[] } {
  const collisions: { a: number; b: number }[] = [];
  const wallHits: number[] = [];
  const subDt = dt / SUBSTEPS;

  for (let step = 0; step < SUBSTEPS; step++) {
    for (const marble of marbles) {
      if (marble.finished) continue;

      // 중력
      marble.vel.y += map.gravity * subDt;

      // 스킬 효과 적용
      if (marble.skillActive && marble.skillType === 'boost') {
        marble.vel.y += map.gravity * 0.5 * subDt; // 추가 가속
      }

      // 속도 제한
      const speed = vec2Length(marble.vel);
      const maxSpeed = 800;
      if (speed > maxSpeed) {
        marble.vel = vec2Scale(vec2Normalize(marble.vel), maxSpeed);
      }

      // 위치 업데이트
      marble.pos.x += marble.vel.x * subDt;
      marble.pos.y += marble.vel.y * subDt;

      // 마찰
      marble.vel.x *= FRICTION;
      marble.vel.y *= FRICTION;
      marble.rotation += marble.angularVel * subDt;
      marble.angularVel *= ANGULAR_FRICTION;

      // 트레일 기록
      if (step === 0 && Math.random() < 0.3) {
        marble.trail.push({ x: marble.pos.x, y: marble.pos.y });
        if (marble.trail.length > 20) marble.trail.shift();
      }

      // 벽 충돌
      for (const wall of map.walls) {
        if (resolveWallCollision(marble, wall)) {
          wallHits.push(marble.id);
        }
      }

      // 장애물 충돌
      for (const obs of map.obstacles) {
        resolveObstacleCollision(marble, obs, subDt);
      }

      // 골라인 체크
      if (marble.pos.y >= map.finishLine && !marble.finished) {
        marble.finished = true;
        marble.finishTime = gameTime;
      }
    }

    // 구슬 간 충돌
    for (let i = 0; i < marbles.length; i++) {
      for (let j = i + 1; j < marbles.length; j++) {
        if (resolveMarbleCollision(marbles[i], marbles[j])) {
          collisions.push({ a: marbles[i].id, b: marbles[j].id });
        }
      }
    }
  }

  return { collisions, wallHits };
}

// 스킬 시스템 업데이트
export function updateSkills(marbles: Marble[], dt: number): void {
  for (const marble of marbles) {
    if (marble.skillActive) {
      marble.skillTimer -= dt;
      if (marble.skillTimer <= 0) {
        marble.skillActive = false;
        marble.skillType = null;
        if (marble.radius !== 12) marble.radius = 12;
        marble.opacity = 1;
      }
    }
  }
}

// 랜덤 스킬 부여
export function assignRandomSkill(marble: Marble): void {
  const skills: import('./types').SkillType[] = ['boost', 'shield', 'shrink', 'ghost', 'magnet'];
  marble.skillType = skills[Math.floor(Math.random() * skills.length)];
  marble.skillActive = true;
  marble.skillTimer = 3;

  switch (marble.skillType) {
    case 'shrink':
      marble.radius = 8;
      break;
    case 'ghost':
      marble.opacity = 0.4;
      break;
  }
}
