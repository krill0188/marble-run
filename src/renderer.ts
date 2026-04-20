// ===== 구슬런 Canvas 렌더러 (카메라 시스템 포함) =====
import { Marble, MapData, Obstacle, GameState, GameResult } from './types';
import { drawConfetti } from './confetti';

const DPR = Math.min(window.devicePixelRatio || 1, 2);

export type CameraMode = 'full' | 'leader' | 'pack' | 'finish';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private containerW: number = 0;
  private containerH: number = 0;
  private showTrails: boolean = true;

  // === 카메라 시스템 ===
  private camX: number = 0;       // 현재 카메라 중심 X (맵 좌표)
  private camY: number = 0;       // 현재 카메라 중심 Y (맵 좌표)
  private camZoom: number = 1;    // 현재 줌 (1 = 전체 맵 맞춤)
  private targetCamX: number = 0;
  private targetCamY: number = 0;
  private targetZoom: number = 1;
  private camMode: CameraMode = 'full';
  private camSmooth: number = 0.04; // 카메라 이동 부드러움 (낮을수록 느리게)
  private zoomSmooth: number = 0.03;
  private shakeX: number = 0;
  private shakeY: number = 0;
  private shakeIntensity: number = 0;

  // 리더보드용
  private leaderName: string = '';
  private leaderOrder: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize(): void {
    const container = this.canvas.parentElement!;
    this.containerW = container.clientWidth;
    this.containerH = container.clientHeight;

    this.canvas.width = this.containerW * DPR;
    this.canvas.height = this.containerH * DPR;
    this.canvas.style.width = `${this.containerW}px`;
    this.canvas.style.height = `${this.containerH}px`;
  }

  setTrails(show: boolean): void {
    this.showTrails = show;
  }

  triggerShake(intensity: number = 3): void {
    this.shakeIntensity = intensity;
  }

  // === 카메라 업데이트 (매 프레임) ===
  updateCamera(marbles: Marble[], map: MapData, state: GameState): void {
    const active = marbles.filter(m => !m.finished);
    const finished = marbles.filter(m => m.finished);

    if (state !== 'running' || active.length === 0) {
      // 대기/카운트다운/완료 → 전체 맵 보기
      this.camMode = 'full';
      this.targetCamX = map.width / 2;
      this.targetCamY = map.height / 2;
      this.targetZoom = 1;
      this.camSmooth = 0.06;
      this.zoomSmooth = 0.04;
    } else {
      // 선두 구슬 찾기
      const sorted = [...active].sort((a, b) => b.pos.y - a.pos.y);
      const leader = sorted[0];
      const pack = sorted.slice(0, Math.min(5, sorted.length));

      // 구슬들의 Y 분포 (밀집도)
      const minY = Math.min(...active.map(m => m.pos.y));
      const maxY = Math.max(...active.map(m => m.pos.y));
      const spread = maxY - minY;

      // 선두와 2등 격차
      const gap = sorted.length > 1 ? sorted[0].pos.y - sorted[1].pos.y : 0;

      // 골라인까지 거리
      const distToFinish = map.finishLine - leader.pos.y;

      this.leaderName = leader.name;
      this.leaderOrder = finished.length + 1;

      if (distToFinish < 120) {
        // 🏁 골라인 근접 → 골라인 줌인
        this.camMode = 'finish';
        this.targetCamX = map.width / 2;
        this.targetCamY = map.finishLine - 40;
        this.targetZoom = 2.2;
        this.camSmooth = 0.06;
        this.zoomSmooth = 0.04;
      } else if (gap > 80 && spread > 200) {
        // 🥇 선두가 크게 앞서감 → 선두 줌인
        this.camMode = 'leader';
        this.targetCamX = leader.pos.x;
        this.targetCamY = leader.pos.y;
        this.targetZoom = 2.0;
        this.camSmooth = 0.05;
        this.zoomSmooth = 0.03;
      } else if (spread < 150) {
        // 🎯 구슬들이 밀집 → 팩 줌인
        this.camMode = 'pack';
        const avgX = pack.reduce((s, m) => s + m.pos.x, 0) / pack.length;
        const avgY = pack.reduce((s, m) => s + m.pos.y, 0) / pack.length;
        this.targetCamX = avgX;
        this.targetCamY = avgY;
        // 밀집도에 따라 줌 조절
        const packSpread = Math.max(
          ...pack.map(m => Math.abs(m.pos.x - avgX)),
          ...pack.map(m => Math.abs(m.pos.y - avgY))
        );
        this.targetZoom = Math.max(1.4, Math.min(2.5, 200 / (packSpread + 50)));
        this.camSmooth = 0.04;
        this.zoomSmooth = 0.03;
      } else {
        // 📷 일반 추적 — 선두 그룹 중심 + 약간 줌인
        this.camMode = 'pack';
        const trackCount = Math.min(active.length, 8);
        const trackMarbles = sorted.slice(0, trackCount);
        const avgX = trackMarbles.reduce((s, m) => s + m.pos.x, 0) / trackCount;
        const avgY = trackMarbles.reduce((s, m) => s + m.pos.y, 0) / trackCount;
        this.targetCamX = avgX;
        this.targetCamY = avgY;

        // 분포에 따라 줌 결정
        const rangeX = Math.max(...trackMarbles.map(m => m.pos.x)) - Math.min(...trackMarbles.map(m => m.pos.x));
        const rangeY = Math.max(...trackMarbles.map(m => m.pos.y)) - Math.min(...trackMarbles.map(m => m.pos.y));
        const maxRange = Math.max(rangeX, rangeY);
        this.targetZoom = Math.max(1.2, Math.min(2.0, 350 / (maxRange + 80)));
        this.camSmooth = 0.035;
        this.zoomSmooth = 0.025;
      }
    }

    // 부드러운 카메라 이동
    this.camX += (this.targetCamX - this.camX) * this.camSmooth;
    this.camY += (this.targetCamY - this.camY) * this.camSmooth;
    this.camZoom += (this.targetZoom - this.camZoom) * this.zoomSmooth;

    // 화면 흔들림 감쇠
    if (this.shakeIntensity > 0.1) {
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= 0.9;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeIntensity = 0;
    }
  }

  render(
    marbles: Marble[],
    map: MapData,
    state: GameState,
    gameTime: number,
    countdown: number,
    result: GameResult | null,
    darkMode: boolean
  ): void {
    const ctx = this.ctx;
    const cw = this.containerW;
    const ch = this.containerH;

    ctx.save();
    ctx.scale(DPR, DPR);

    // 배경 (전체 캔버스)
    const bg = darkMode ? '#0a0a0a' : map.background;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cw, ch);

    // === 카메라 변환 ===
    // 기본 스케일: 맵을 캔버스에 맞추기
    const baseScaleX = cw / map.width;
    const baseScaleY = ch / map.height;
    const baseScale = Math.min(baseScaleX, baseScaleY);

    const totalScale = baseScale * this.camZoom;

    // 카메라 중심을 화면 중심으로
    const screenCenterX = cw / 2 + this.shakeX;
    const screenCenterY = ch / 2 + this.shakeY;

    ctx.translate(screenCenterX, screenCenterY);
    ctx.scale(totalScale, totalScale);
    ctx.translate(-this.camX, -this.camY);

    // === 맵 배경 ===
    this.drawBackground(map, darkMode);

    // === 벽 ===
    this.drawWalls(map);

    // === 장애물 ===
    for (const obs of map.obstacles) {
      this.drawObstacle(obs, gameTime);
    }

    // === 골라인 ===
    this.drawFinishLine(map);

    // === 트레일 ===
    if (this.showTrails) {
      for (const marble of marbles) {
        this.drawTrail(marble);
      }
    }

    // === 구슬 ===
    // 완료된 구슬 먼저, 활성 구슬이 위에
    const finished = marbles.filter(m => m.finished);
    const active = marbles.filter(m => !m.finished);
    for (const marble of finished) this.drawMarble(marble, gameTime);
    for (const marble of active) this.drawMarble(marble, gameTime);

    // 카메라 변환 복원
    ctx.restore();

    // === HUD (카메라 밖 — 화면 고정) ===
    ctx.save();
    ctx.scale(DPR, DPR);

    // 카운트다운
    if (state === 'ready' && countdown > 0) {
      this.drawCountdown(countdown, cw, ch);
    }

    // 게임 중 HUD
    if (state === 'running') {
      this.drawTimer(gameTime, cw);
      this.drawLeaderHUD(marbles, cw);
      this.drawCameraModeIndicator(cw, ch);
    }

    // 결과 화면
    if (state === 'finished' && result) {
      // Confetti는 화면 좌표 기준
      drawConfetti(ctx);
      this.drawResult(result, cw, ch);
    }

    ctx.restore();
  }

  private drawBackground(map: MapData, darkMode: boolean): void {
    const ctx = this.ctx;
    const bg = darkMode ? '#0a0a0a' : map.background;

    const grad = ctx.createLinearGradient(0, 0, 0, map.height);
    grad.addColorStop(0, bg);
    grad.addColorStop(0.5, this.lightenColor(bg, 5));
    grad.addColorStop(1, this.lightenColor(bg, -15));
    ctx.fillStyle = grad;
    ctx.fillRect(-50, -50, map.width + 100, map.height + 100);

    // 미세 그리드
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < map.width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, map.height); ctx.stroke();
    }
    for (let y = 0; y < map.height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(map.width, y); ctx.stroke();
    }
  }

  private drawWalls(map: MapData): void {
    const ctx = this.ctx;
    for (const wall of map.walls) {
      // 그림자
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(wall.x1, wall.y1); ctx.lineTo(wall.x2, wall.y2); ctx.stroke();

      // 본체
      const g = ctx.createLinearGradient(wall.x1, wall.y1, wall.x2, wall.y2);
      g.addColorStop(0, '#4a5568'); g.addColorStop(0.5, '#718096'); g.addColorStop(1, '#4a5568');
      ctx.strokeStyle = g; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(wall.x1, wall.y1); ctx.lineTo(wall.x2, wall.y2); ctx.stroke();

      // 하이라이트
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(wall.x1, wall.y1); ctx.lineTo(wall.x2, wall.y2); ctx.stroke();
    }
  }

  private drawObstacle(obs: Obstacle, time: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obs.pos.x, obs.pos.y);
    if (obs.type === 'spinner') ctx.rotate(obs.currentAngle || 0);
    else ctx.rotate(obs.rotation);

    switch (obs.type) {
      case 'circle':
      case 'bumper': {
        const r = obs.size.x;
        const isBumper = obs.type === 'bumper';
        const isSmallPeg = r <= 6;

        if (isBumper) {
          const glow = ctx.createRadialGradient(0, 0, r, 0, 0, r * 3.5);
          glow.addColorStop(0, obs.color + '60');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(0, 0, r * 3.5, 0, Math.PI * 2); ctx.fill();
        }

        if (isSmallPeg) {
          // 어두운 메탈 핀 — 눈에 안 띄게
          const pg = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
          pg.addColorStop(0, this.lightenColor(obs.color, 15));
          pg.addColorStop(1, obs.color);
          ctx.fillStyle = pg;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.2, r * 0.3, 0, Math.PI * 2); ctx.fill();
        } else {
          const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
          grad.addColorStop(0, this.lightenColor(obs.color, 50));
          grad.addColorStop(0.5, obs.color);
          grad.addColorStop(1, this.lightenColor(obs.color, -40));
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
          if (isBumper) {
            ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
          }
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.beginPath(); ctx.arc(-r * 0.25, -r * 0.25, r * 0.3, 0, Math.PI * 2); ctx.fill();
        }
        break;
      }
      case 'rect':
      case 'flipper': {
        const hw = obs.size.x / 2, hh = obs.size.y / 2;
        ctx.fillStyle = obs.color;
        ctx.shadowColor = obs.color; ctx.shadowBlur = 8;
        this.roundRect(-hw, -hh, obs.size.x, obs.size.y, 3); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        this.roundRect(-hw, -hh, obs.size.x, obs.size.y / 3, 3); ctx.fill();
        break;
      }
      case 'triangle': {
        const hw = obs.size.x / 2, hh = obs.size.y / 2;
        ctx.fillStyle = obs.color; ctx.shadowColor = obs.color; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(0, -hh); ctx.lineTo(-hw, hh); ctx.lineTo(hw, hh); ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.moveTo(0, -hh); ctx.lineTo(-hw * 0.5, 0); ctx.lineTo(hw * 0.5, 0); ctx.closePath(); ctx.fill();
        break;
      }
      case 'spinner': {
        const hw = obs.size.x / 2, hh = obs.size.y / 2;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
        const sg = ctx.createLinearGradient(-hw, 0, hw, 0);
        sg.addColorStop(0, this.lightenColor(obs.color, -20)); sg.addColorStop(0.5, obs.color); sg.addColorStop(1, this.lightenColor(obs.color, -20));
        ctx.fillStyle = sg; ctx.shadowColor = obs.color; ctx.shadowBlur = 12;
        this.roundRect(-hw, -hh, obs.size.x, obs.size.y, 4); ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
    }
    ctx.restore();
  }

  private drawMarble(marble: Marble, time: number): void {
    const ctx = this.ctx;
    const r = marble.radius;
    ctx.save();
    ctx.globalAlpha = marble.finished ? 0.4 : marble.opacity;

    if (marble.skillActive) this.drawSkillEffect(marble, time);

    // 그림자
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(marble.pos.x + 2, marble.pos.y + 3, r * 0.9, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 본체
    const grad = ctx.createRadialGradient(
      marble.pos.x - r * 0.3, marble.pos.y - r * 0.3, r * 0.1,
      marble.pos.x, marble.pos.y, r
    );
    grad.addColorStop(0, this.lightenColor(marble.color, 60));
    grad.addColorStop(0.4, this.lightenColor(marble.color, 20));
    grad.addColorStop(0.7, marble.color);
    grad.addColorStop(1, this.lightenColor(marble.color, -40));
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(marble.pos.x, marble.pos.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = this.lightenColor(marble.color, -30); ctx.lineWidth = 1; ctx.stroke();

    // 하이라이트
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(marble.pos.x - r * 0.25, marble.pos.y - r * 0.25, r * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.arc(marble.pos.x + r * 0.15, marble.pos.y + r * 0.15, r * 0.15, 0, Math.PI * 2); ctx.fill();

    // 이름
    ctx.globalAlpha = marble.finished ? 0.5 : 1;
    const fontSize = Math.max(8, r * 0.9);
    ctx.font = `bold ${fontSize}px 'Noto Sans KR', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const nameWidth = ctx.measureText(marble.name).width + 8;
    const nameY = marble.pos.y - r - 10;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    this.roundRect(marble.pos.x - nameWidth / 2, nameY - fontSize / 2 - 2, nameWidth, fontSize + 4, 4);
    ctx.fill();
    ctx.fillStyle = marble.textColor;
    ctx.fillText(marble.name, marble.pos.x, nameY);

    ctx.restore();
  }

  private drawSkillEffect(marble: Marble, time: number): void {
    const ctx = this.ctx;
    const r = marble.radius;
    switch (marble.skillType) {
      case 'boost':
        ctx.fillStyle = '#FF6348'; ctx.globalAlpha = 0.4 + Math.sin(time * 10) * 0.2;
        ctx.beginPath(); ctx.arc(marble.pos.x, marble.pos.y + r, r * 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = marble.opacity; break;
      case 'shield':
        ctx.strokeStyle = '#54A0FF'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5 + Math.sin(time * 8) * 0.3;
        ctx.beginPath(); ctx.arc(marble.pos.x, marble.pos.y, r + 5, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = marble.opacity; break;
      case 'ghost':
        ctx.fillStyle = marble.color; ctx.globalAlpha = 0.15;
        ctx.beginPath(); ctx.arc(marble.pos.x - marble.vel.x * 0.02, marble.pos.y - marble.vel.y * 0.02, r, 0, Math.PI * 2);
        ctx.fill(); ctx.globalAlpha = marble.opacity; break;
      case 'magnet': {
        const mg = ctx.createRadialGradient(marble.pos.x, marble.pos.y, r, marble.pos.x, marble.pos.y, r * 3);
        mg.addColorStop(0, 'rgba(255,107,129,0.3)'); mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(marble.pos.x, marble.pos.y, r * 3, 0, Math.PI * 2); ctx.fill();
        break;
      }
    }
  }

  private drawTrail(marble: Marble): void {
    if (marble.trail.length < 2) return;
    const ctx = this.ctx;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 1; i < marble.trail.length; i++) {
      const alpha = (i / marble.trail.length) * 0.3;
      const width = (i / marble.trail.length) * marble.radius * 0.6;
      ctx.strokeStyle = marble.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(marble.trail[i - 1].x, marble.trail[i - 1].y);
      ctx.lineTo(marble.trail[i].x, marble.trail[i].y);
      ctx.stroke();
    }
  }

  private drawFinishLine(map: MapData): void {
    const ctx = this.ctx;
    const y = map.finishLine;

    // 통과형 라인 — 점선 + 글로우
    ctx.save();

    // 글로우
    ctx.shadowColor = '#FECA57';
    ctx.shadowBlur = 15;

    // 체커 스트라이프 (한 줄만)
    const stripeH = 6;
    const stripeW = 12;
    for (let x = 35; x < map.width - 35; x += stripeW) {
      const idx = Math.floor(x / stripeW);
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(254,202,87,0.9)' : 'rgba(0,0,0,0.6)';
      ctx.fillRect(x, y - stripeH / 2, stripeW, stripeH);
    }

    ctx.shadowBlur = 0;

    // FINISH 텍스트 (라인 위)
    ctx.font = "bold 12px 'Noto Sans KR', sans-serif";
    ctx.fillStyle = 'rgba(254,202,87,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', map.width / 2, y - 10);

    ctx.restore();
  }

  // === HUD 요소들 (화면 고정) ===

  private drawCountdown(count: number, cw: number, ch: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, cw, ch);
    const text = count > 0 ? count.toString() : 'GO!';
    const size = count > 0 ? 120 : 80;
    const color = count > 0 ? '#FFFFFF' : '#FECA57';
    ctx.font = `bold ${size}px 'Noto Sans KR', sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = color; ctx.shadowBlur = 30;
    ctx.fillStyle = color;
    ctx.fillText(text, cw / 2, ch / 2);
    ctx.shadowBlur = 0;
  }

  private drawTimer(time: number, cw: number): void {
    const ctx = this.ctx;
    ctx.font = "bold 18px 'Noto Sans KR', monospace";
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.roundRect(cw - 100, 10, 88, 30, 8); ctx.fill();
    ctx.fillStyle = '#FECA57';
    ctx.fillText(time.toFixed(1) + 's', cw - 18, 30);
  }

  // 실시간 순위 HUD
  private drawLeaderHUD(marbles: Marble[], cw: number): void {
    const ctx = this.ctx;
    const active = marbles.filter(m => !m.finished);
    const finished = marbles.filter(m => m.finished).sort((a, b) => a.finishOrder - b.finishOrder);

    // 상위 5명 표시
    const sorted = [...active].sort((a, b) => b.pos.y - a.pos.y);
    const top = [...finished.slice(0, 3), ...sorted.slice(0, Math.max(0, 5 - finished.length))];

    const panelX = 10;
    const panelY = 10;
    const panelW = 160;
    const rowH = 24;
    const panelH = 30 + top.length * rowH;

    // 패널 배경
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.roundRect(panelX, panelY, panelW, panelH, 8);
    ctx.fill();

    // 타이틀
    ctx.font = "bold 11px 'Noto Sans KR', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FECA57';
    ctx.fillText('실시간 순위', panelX + 10, panelY + 16);

    const medals = ['🥇', '🥈', '🥉'];

    for (let i = 0; i < top.length; i++) {
      const m = top[i];
      const y = panelY + 30 + i * rowH;
      const rank = i + 1;

      // 색상 점
      ctx.fillStyle = m.color;
      ctx.beginPath(); ctx.arc(panelX + 16, y + 4, 5, 0, Math.PI * 2); ctx.fill();

      // 순위
      ctx.font = "bold 11px 'Noto Sans KR', sans-serif";
      ctx.fillStyle = rank <= 3 ? '#FECA57' : '#aaa';
      const prefix = rank <= 3 ? medals[rank - 1] : `${rank}.`;
      ctx.fillText(prefix, panelX + 26, y + 8);

      // 이름
      ctx.font = "600 11px 'Noto Sans KR', sans-serif";
      ctx.fillStyle = m.finished ? '#888' : '#fff';
      const name = m.name.length > 6 ? m.name.substring(0, 6) + '..' : m.name;
      ctx.fillText(name, panelX + 50, y + 8);

      // 상태
      if (m.finished) {
        ctx.font = "10px monospace";
        ctx.fillStyle = '#2ED573';
        ctx.textAlign = 'right';
        ctx.fillText('FINISH', panelX + panelW - 10, y + 8);
        ctx.textAlign = 'left';
      }
    }
  }

  // 카메라 모드 표시
  private drawCameraModeIndicator(cw: number, ch: number): void {
    const ctx = this.ctx;
    const labels: Record<CameraMode, string> = {
      full: '📷 전체',
      leader: '🥇 선두 추적',
      pack: '🎯 밀집 추적',
      finish: '🏁 골라인',
    };
    const label = labels[this.camMode];

    ctx.font = "bold 11px 'Noto Sans KR', sans-serif";
    const w = ctx.measureText(label).width + 16;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.roundRect(cw - w - 10, ch - 32, w, 22, 6);
    ctx.fill();
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'center';
    ctx.fillText(label, cw - w / 2 - 10, ch - 17);
  }

  private drawResult(result: GameResult, cw: number, ch: number): void {
    const ctx = this.ctx;
    const cx = cw / 2;

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, cw, ch);

    const panelW = Math.min(380, cw - 40);
    const panelH = Math.min(450, 120 + result.rankings.length * 36);
    const panelX = cx - panelW / 2;
    const panelY = ch / 2 - panelH / 2;

    const pg = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
    pg.addColorStop(0, '#1a1a2e'); pg.addColorStop(1, '#16213e');
    ctx.fillStyle = pg;
    this.roundRect(panelX, panelY, panelW, panelH, 16); ctx.fill();
    ctx.strokeStyle = '#FECA57'; ctx.lineWidth = 2;
    this.roundRect(panelX, panelY, panelW, panelH, 16); ctx.stroke();

    ctx.font = "bold 28px 'Noto Sans KR', sans-serif";
    ctx.textAlign = 'center'; ctx.fillStyle = '#FECA57';
    ctx.fillText('🏆 결과', cx, panelY + 45);

    ctx.font = "bold 22px 'Noto Sans KR', sans-serif";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(result.winner, cx, panelY + 80);

    const startY = panelY + 110;
    const maxShow = Math.min(result.rankings.length, 8);
    const medals = ['🥇', '🥈', '🥉'];

    for (let i = 0; i < maxShow; i++) {
      const r = result.rankings[i];
      const y = startY + i * 36;
      const rankColors = ['#FECA57', '#C0C0C0', '#CD7F32'];
      const rankColor = i < 3 ? rankColors[i] : '#AAAAAA';

      ctx.fillStyle = i === 0 ? 'rgba(254,202,87,0.1)' : 'rgba(255,255,255,0.03)';
      this.roundRect(panelX + 20, y - 12, panelW - 40, 30, 6); ctx.fill();

      ctx.font = "bold 16px 'Noto Sans KR', sans-serif";
      ctx.textAlign = 'left'; ctx.fillStyle = rankColor;
      ctx.fillText(i < 3 ? medals[i] : `${i + 1}.`, panelX + 30, y + 5);

      ctx.font = "600 15px 'Noto Sans KR', sans-serif";
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(r.name, panelX + 70, y + 5);

      ctx.font = "13px monospace";
      ctx.textAlign = 'right'; ctx.fillStyle = '#888';
      ctx.fillText(r.time.toFixed(2) + 's', panelX + panelW - 30, y + 5);
    }

    ctx.font = "13px 'Noto Sans KR', sans-serif";
    ctx.textAlign = 'center'; ctx.fillStyle = '#666';
    ctx.fillText(`총 ${result.duration.toFixed(1)}초`, cx, panelY + panelH - 20);
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  private lightenColor(hex: string, amount: number): string {
    const color = hex.replace('#', '');
    if (color.length < 6) return hex;
    const r = Math.max(0, Math.min(255, parseInt(color.substring(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(color.substring(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(color.substring(4, 6), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}
