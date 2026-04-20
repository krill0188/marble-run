// ===== 구슬런 Canvas 렌더러 =====
import { Marble, MapData, Obstacle, GameState, GameResult } from './types';
import { drawConfetti } from './confetti';

const DPR = Math.min(window.devicePixelRatio || 1, 2);

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private scale: number = 1;
  private offsetX: number = 0;
  private cameraY: number = 0;
  private targetCameraY: number = 0;
  private showTrails: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = 600;
    this.height = 900;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize(): void {
    const container = this.canvas.parentElement!;
    const cw = container.clientWidth;
    const ch = container.clientHeight;

    // 맵 비율 유지하면서 컨테이너에 맞추기
    const scaleX = cw / this.width;
    const scaleY = ch / this.height;
    this.scale = Math.min(scaleX, scaleY);

    const displayW = this.width * this.scale;
    const displayH = this.height * this.scale;

    this.canvas.width = displayW * DPR;
    this.canvas.height = displayH * DPR;
    this.canvas.style.width = `${displayW}px`;
    this.canvas.style.height = `${displayH}px`;
    this.offsetX = (cw - displayW) / 2;
    this.canvas.style.marginLeft = `${this.offsetX}px`;
  }

  setTrails(show: boolean): void {
    this.showTrails = show;
  }

  updateCamera(marbles: Marble[], map: MapData): void {
    // 아직 끝나지 않은 구슬 중 가장 아래에 있는 구슬 추적
    const active = marbles.filter(m => !m.finished);
    if (active.length === 0) return;

    const lowestY = Math.max(...active.map(m => m.pos.y));
    const targetY = Math.max(0, lowestY - this.height * 0.6);
    this.targetCameraY = Math.min(targetY, map.height - this.height);
    this.cameraY += (this.targetCameraY - this.cameraY) * 0.05;
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
    const s = this.scale * DPR;

    ctx.save();
    ctx.scale(s, s);

    // 배경
    this.drawBackground(map, darkMode);

    // 카메라 적용 (부드럽게 자동 스크롤은 제거 — 전체 맵 보기)
    // ctx.translate(0, -this.cameraY);

    // 벽
    this.drawWalls(map, darkMode);

    // 장애물
    for (const obs of map.obstacles) {
      this.drawObstacle(obs, gameTime, darkMode);
    }

    // 골라인
    this.drawFinishLine(map);

    // 트레일
    if (this.showTrails) {
      for (const marble of marbles) {
        this.drawTrail(marble);
      }
    }

    // 구슬
    for (const marble of marbles) {
      this.drawMarble(marble, gameTime);
    }

    // ctx.translate(0, this.cameraY); // 카메라 복원

    // 카운트다운 오버레이
    if (state === 'ready' && countdown > 0) {
      this.drawCountdown(countdown);
    }

    // 결과 화면
    if (state === 'finished' && result) {
      this.drawResult(result);
    }

    // Confetti
    drawConfetti(ctx);

    // 게임 시간 표시
    if (state === 'running') {
      this.drawTimer(gameTime);
    }

    ctx.restore();
  }

  private drawBackground(map: MapData, darkMode: boolean): void {
    const ctx = this.ctx;
    const bg = darkMode ? '#0a0a0a' : map.background;

    // 그라데이션 배경
    const grad = ctx.createLinearGradient(0, 0, 0, map.height);
    grad.addColorStop(0, bg);
    grad.addColorStop(1, this.lightenColor(bg, -20));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, map.width, map.height);

    // 그리드 패턴
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < map.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, map.height);
      ctx.stroke();
    }
    for (let y = 0; y < map.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(map.width, y);
      ctx.stroke();
    }
  }

  private drawWalls(map: MapData, darkMode: boolean): void {
    const ctx = this.ctx;

    for (const wall of map.walls) {
      // 벽 그림자
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();

      // 벽 본체
      const wallGrad = ctx.createLinearGradient(wall.x1, wall.y1, wall.x2, wall.y2);
      wallGrad.addColorStop(0, '#4a5568');
      wallGrad.addColorStop(0.5, '#718096');
      wallGrad.addColorStop(1, '#4a5568');
      ctx.strokeStyle = wallGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();

      // 벽 하이라이트
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    }
  }

  private drawObstacle(obs: Obstacle, time: number, darkMode: boolean): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obs.pos.x, obs.pos.y);

    if (obs.type === 'spinner') {
      ctx.rotate(obs.currentAngle || 0);
    } else {
      ctx.rotate(obs.rotation);
    }

    switch (obs.type) {
      case 'circle':
      case 'bumper': {
        const r = obs.size.x;
        const isBumper = obs.type === 'bumper';
        const isSmallPeg = r <= 6;

        // 글로우 효과 (범퍼만)
        if (isBumper) {
          const glow = ctx.createRadialGradient(0, 0, r, 0, 0, r * 3);
          glow.addColorStop(0, obs.color + '50');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, r * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isSmallPeg) {
          // 작은 핀: 심플하고 빠른 렌더
          ctx.fillStyle = obs.color;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();

          // 미니 하이라이트
          ctx.fillStyle = 'rgba(255,255,255,0.35)';
          ctx.beginPath();
          ctx.arc(-r * 0.2, -r * 0.2, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 큰 핀/범퍼: 풀 렌더
          const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
          grad.addColorStop(0, this.lightenColor(obs.color, 50));
          grad.addColorStop(0.5, obs.color);
          grad.addColorStop(1, this.lightenColor(obs.color, -40));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();

          // 테두리
          if (isBumper) {
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // 하이라이트
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.beginPath();
          ctx.arc(-r * 0.25, -r * 0.25, r * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'rect':
      case 'flipper': {
        const hw = obs.size.x / 2;
        const hh = obs.size.y / 2;
        ctx.fillStyle = obs.color;
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 8;
        this.roundRect(-hw, -hh, obs.size.x, obs.size.y, 3);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 상단 하이라이트
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        this.roundRect(-hw, -hh, obs.size.x, obs.size.y / 3, 3);
        ctx.fill();
        break;
      }

      case 'triangle': {
        const hw = obs.size.x / 2;
        const hh = obs.size.y / 2;
        ctx.fillStyle = obs.color;
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, -hh);
        ctx.lineTo(-hw, hh);
        ctx.lineTo(hw, hh);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // 하이라이트
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.moveTo(0, -hh);
        ctx.lineTo(-hw * 0.5, 0);
        ctx.lineTo(hw * 0.5, 0);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'spinner': {
        const hw = obs.size.x / 2;
        const hh = obs.size.y / 2;

        // 중심점
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // 바
        const spinGrad = ctx.createLinearGradient(-hw, 0, hw, 0);
        spinGrad.addColorStop(0, this.lightenColor(obs.color, -20));
        spinGrad.addColorStop(0.5, obs.color);
        spinGrad.addColorStop(1, this.lightenColor(obs.color, -20));
        ctx.fillStyle = spinGrad;
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 12;
        this.roundRect(-hw, -hh, obs.size.x, obs.size.y, 4);
        ctx.fill();
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
    ctx.globalAlpha = marble.opacity;

    // 스킬 이펙트
    if (marble.skillActive) {
      this.drawSkillEffect(marble, time);
    }

    // 구슬 그림자
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(marble.pos.x + 2, marble.pos.y + 3, r * 0.9, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 구슬 본체 (3D 느낌)
    const grad = ctx.createRadialGradient(
      marble.pos.x - r * 0.3,
      marble.pos.y - r * 0.3,
      r * 0.1,
      marble.pos.x,
      marble.pos.y,
      r
    );
    grad.addColorStop(0, this.lightenColor(marble.color, 60));
    grad.addColorStop(0.4, this.lightenColor(marble.color, 20));
    grad.addColorStop(0.7, marble.color);
    grad.addColorStop(1, this.lightenColor(marble.color, -40));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(marble.pos.x, marble.pos.y, r, 0, Math.PI * 2);
    ctx.fill();

    // 테두리
    ctx.strokeStyle = this.lightenColor(marble.color, -30);
    ctx.lineWidth = 1;
    ctx.stroke();

    // 하이라이트 (유리 반사)
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(marble.pos.x - r * 0.25, marble.pos.y - r * 0.25, r * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(marble.pos.x + r * 0.15, marble.pos.y + r * 0.15, r * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 이름 표시
    ctx.globalAlpha = 1;
    const fontSize = Math.max(9, r * 0.75);
    ctx.font = `bold ${fontSize}px 'Pretendard', 'Noto Sans KR', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 이름 배경
    const nameWidth = ctx.measureText(marble.name).width + 8;
    const nameY = marble.pos.y - r - 10;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    this.roundRect(marble.pos.x - nameWidth / 2, nameY - fontSize / 2 - 2, nameWidth, fontSize + 4, 4);
    ctx.fill();

    // 이름 텍스트
    ctx.fillStyle = marble.textColor;
    ctx.fillText(marble.name, marble.pos.x, nameY);

    ctx.restore();
  }

  private drawSkillEffect(marble: Marble, time: number): void {
    const ctx = this.ctx;
    const r = marble.radius;

    switch (marble.skillType) {
      case 'boost':
        // 불꽃 이펙트
        ctx.fillStyle = '#FF6348';
        ctx.globalAlpha = 0.4 + Math.sin(time * 10) * 0.2;
        ctx.beginPath();
        ctx.arc(marble.pos.x, marble.pos.y + r, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = marble.opacity;
        break;

      case 'shield':
        // 보호막
        ctx.strokeStyle = '#54A0FF';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5 + Math.sin(time * 8) * 0.3;
        ctx.beginPath();
        ctx.arc(marble.pos.x, marble.pos.y, r + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = marble.opacity;
        break;

      case 'ghost':
        // 유령 잔상
        ctx.fillStyle = marble.color;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(marble.pos.x - marble.vel.x * 0.02, marble.pos.y - marble.vel.y * 0.02, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = marble.opacity;
        break;

      case 'magnet':
        // 자석장
        const magGrad = ctx.createRadialGradient(marble.pos.x, marble.pos.y, r, marble.pos.x, marble.pos.y, r * 3);
        magGrad.addColorStop(0, 'rgba(255,107,129,0.3)');
        magGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = magGrad;
        ctx.beginPath();
        ctx.arc(marble.pos.x, marble.pos.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }

  private drawTrail(marble: Marble): void {
    if (marble.trail.length < 2) return;
    const ctx = this.ctx;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

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

    // 체커 패턴
    const checkerSize = 10;
    for (let x = 30; x < map.width - 30; x += checkerSize) {
      const row = Math.floor(x / checkerSize);
      for (let r = 0; r < 2; r++) {
        const isBlack = (row + r) % 2 === 0;
        ctx.fillStyle = isBlack ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
        ctx.fillRect(x, y - checkerSize * 2 + r * checkerSize, checkerSize, checkerSize);
      }
    }

    // FINISH 텍스트
    ctx.font = "bold 14px 'Pretendard', sans-serif";
    ctx.fillStyle = '#FECA57';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', map.width / 2, y + 15);
  }

  private drawCountdown(count: number): void {
    const ctx = this.ctx;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // 반투명 오버레이
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, this.width, this.height);

    // 숫자
    const text = count > 0 ? count.toString() : 'GO!';
    const size = count > 0 ? 120 : 80;
    const color = count > 0 ? '#FFFFFF' : '#FECA57';

    ctx.font = `bold ${size}px 'Pretendard', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 글로우
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fillStyle = color;
    ctx.fillText(text, centerX, centerY);
    ctx.shadowBlur = 0;
  }

  private drawTimer(time: number): void {
    const ctx = this.ctx;
    const text = time.toFixed(1) + 's';

    ctx.font = "bold 18px 'Pretendard', monospace";
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.roundRect(this.width - 90, 8, 80, 28, 6);
    ctx.fill();
    ctx.fillStyle = '#FECA57';
    ctx.fillText(text, this.width - 18, 27);
  }

  private drawResult(result: GameResult): void {
    const ctx = this.ctx;
    const cx = this.width / 2;

    // 오버레이
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, this.width, this.height);

    // 결과 패널
    const panelW = 380;
    const panelH = Math.min(450, 120 + result.rankings.length * 36);
    const panelX = cx - panelW / 2;
    const panelY = this.height / 2 - panelH / 2;

    // 패널 배경
    const panelGrad = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
    panelGrad.addColorStop(0, '#1a1a2e');
    panelGrad.addColorStop(1, '#16213e');
    ctx.fillStyle = panelGrad;
    this.roundRect(panelX, panelY, panelW, panelH, 16);
    ctx.fill();

    // 테두리
    ctx.strokeStyle = '#FECA57';
    ctx.lineWidth = 2;
    this.roundRect(panelX, panelY, panelW, panelH, 16);
    ctx.stroke();

    // 타이틀
    ctx.font = "bold 28px 'Pretendard', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FECA57';
    ctx.fillText('🏆 결과', cx, panelY + 45);

    // 우승자
    ctx.font = "bold 22px 'Pretendard', sans-serif";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(result.winner, cx, panelY + 80);

    // 순위표
    const startY = panelY + 110;
    const maxShow = Math.min(result.rankings.length, 8);

    for (let i = 0; i < maxShow; i++) {
      const r = result.rankings[i];
      const y = startY + i * 36;

      // 순위 색상
      const rankColors = ['#FECA57', '#C0C0C0', '#CD7F32'];
      const rankColor = i < 3 ? rankColors[i] : '#AAAAAA';
      const medals = ['🥇', '🥈', '🥉'];

      // 배경 바
      ctx.fillStyle = i === 0 ? 'rgba(254,202,87,0.1)' : 'rgba(255,255,255,0.03)';
      this.roundRect(panelX + 20, y - 12, panelW - 40, 30, 6);
      ctx.fill();

      // 순위
      ctx.font = "bold 16px 'Pretendard', sans-serif";
      ctx.textAlign = 'left';
      ctx.fillStyle = rankColor;
      const prefix = i < 3 ? medals[i] : `${i + 1}.`;
      ctx.fillText(prefix, panelX + 30, y + 5);

      // 이름
      ctx.font = "600 15px 'Pretendard', sans-serif";
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(r.name, panelX + 70, y + 5);

      // 시간
      ctx.font = "13px 'Pretendard', monospace";
      ctx.textAlign = 'right';
      ctx.fillStyle = '#888';
      ctx.fillText(r.time.toFixed(2) + 's', panelX + panelW - 30, y + 5);
    }

    // 소요 시간
    ctx.font = "13px 'Pretendard', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.fillText(`총 ${result.duration.toFixed(1)}초`, cx, panelY + panelH - 20);
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
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
    const r = Math.max(0, Math.min(255, parseInt(color.substring(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(color.substring(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(color.substring(4, 6), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}
