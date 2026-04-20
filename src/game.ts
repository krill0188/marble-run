// ===== 구슬런 게임 엔진 =====
import {
  Marble, GameConfig, GameState, GameResult, WinnerMode,
  MARBLE_COLORS, Vec2,
} from './types';
import { MapData } from './types';
import { getMap } from './maps';
import { physicsStep, updateSkills, assignRandomSkill, vec2 } from './physics';
import { Renderer } from './renderer';
import {
  initAudio, playBounce, playWallHit, playBumperHit,
  playFinish, playCountdown, playSkill, setVolume,
} from './audio';
import { launchConfetti, updateConfetti } from './confetti';

export class Game {
  private renderer: Renderer;
  private marbles: Marble[] = [];
  private map: MapData;
  private config: GameConfig;
  private state: GameState = 'idle';
  private gameTime: number = 0;
  private countdown: number = 0;
  private countdownTimer: number = 0;
  private result: GameResult | null = null;
  private animFrameId: number = 0;
  private lastTime: number = 0;
  private finishOrder: number = 0;
  private onStateChange: ((state: GameState) => void) | null = null;
  private skillSpawnTimer: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.config = {
      winnerMode: 'first',
      customRank: 1,
      enableSkills: false,
      darkMode: true,
      selectedMap: 'classic',
      showTrails: true,
      soundEnabled: true,
      volume: 0.3,
    };
    this.map = getMap('classic');
    initAudio();
  }

  setStateChangeCallback(cb: (state: GameState) => void): void {
    this.onStateChange = cb;
  }

  getState(): GameState {
    return this.state;
  }

  getConfig(): GameConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<GameConfig>): void {
    Object.assign(this.config, partial);
    if (partial.selectedMap) {
      this.map = getMap(partial.selectedMap);
    }
    if (partial.showTrails !== undefined) {
      this.renderer.setTrails(partial.showTrails);
    }
    if (partial.volume !== undefined) {
      setVolume(partial.volume);
    }
  }

  // 이름 파싱 (쉼표/줄바꿈 구분, 가중치/중복 지원)
  parseNames(input: string): { name: string; weight: number }[] {
    const raw = input
      .split(/[,\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const entries: { name: string; weight: number }[] = [];

    for (const item of raw) {
      // name*count 형식
      const multMatch = item.match(/^(.+)\*(\d+)$/);
      if (multMatch) {
        const name = multMatch[1].trim();
        const count = parseInt(multMatch[2]);
        for (let i = 0; i < count; i++) {
          entries.push({ name, weight: 1 });
        }
        continue;
      }

      // name/weight 형식
      const weightMatch = item.match(/^(.+)\/(\d+(?:\.\d+)?)$/);
      if (weightMatch) {
        entries.push({
          name: weightMatch[1].trim(),
          weight: parseFloat(weightMatch[2]),
        });
        continue;
      }

      entries.push({ name: item, weight: 1 });
    }

    return entries;
  }

  // 구슬 생성
  setupMarbles(entries: { name: string; weight: number }[]): void {
    this.marbles = [];
    this.finishOrder = 0;
    this.result = null;
    this.gameTime = 0;

    const area = this.map.startArea;

    for (let i = 0; i < entries.length; i++) {
      const colorIdx = i % MARBLE_COLORS.length;
      const col = MARBLE_COLORS[colorIdx];

      // 시작 위치 배치 (격자형)
      const cols = Math.ceil(Math.sqrt(entries.length));
      const row = Math.floor(i / cols);
      const col2 = i % cols;
      const spacing = Math.min(
        area.width / (cols + 1),
        area.height / (Math.ceil(entries.length / cols) + 1)
      );

      const x = area.x + spacing * (col2 + 1) + (Math.random() - 0.5) * 5;
      const y = area.y + spacing * (row + 0.5) + (Math.random() - 0.5) * 5;

      this.marbles.push({
        id: i,
        name: entries[i].name,
        pos: vec2(x, y),
        vel: vec2(0, 0),
        radius: 8,
        color: col.bg,
        textColor: col.text,
        weight: entries[i].weight,
        finished: false,
        finishTime: 0,
        finishOrder: 0,
        rotation: 0,
        angularVel: 0,
        trail: [],
        skillActive: false,
        skillType: null,
        skillTimer: 0,
        opacity: 1,
        lastY: y,
        stuckTimer: 0,
      });
    }
  }

  // 셔플 (위치 랜덤 재배치)
  shuffle(): void {
    if (this.state !== 'idle' && this.state !== 'ready') return;
    const area = this.map.startArea;

    for (const marble of this.marbles) {
      marble.pos.x = area.x + Math.random() * area.width;
      marble.pos.y = area.y + Math.random() * area.height;
      marble.vel = vec2(0, 0);
    }

    this.state = 'ready';
    this.onStateChange?.('ready');
  }

  // 게임 시작
  start(): void {
    if (this.marbles.length === 0) return;

    this.state = 'ready';
    this.countdown = 3;
    this.countdownTimer = 0;
    this.gameTime = 0;
    this.finishOrder = 0;
    this.result = null;
    this.skillSpawnTimer = 0;

    for (const m of this.marbles) {
      m.finished = false;
      m.finishTime = 0;
      m.finishOrder = 0;
      m.trail = [];
      m.skillActive = false;
      m.skillType = null;
      m.opacity = 1;
      m.radius = 8;
      m.lastY = m.pos.y;
      m.stuckTimer = 0;
    }

    this.onStateChange?.('ready');

    if (this.config.soundEnabled) playCountdown();

    this.lastTime = performance.now();
    this.loop();
  }

  private loop = (): void => {
    const now = performance.now();
    const rawDt = (now - this.lastTime) / 1000;
    const dt = Math.min(rawDt, 1 / 30); // 최대 33ms
    this.lastTime = now;

    if (this.state === 'ready') {
      this.countdownTimer += dt;
      if (this.countdownTimer >= 1) {
        this.countdownTimer = 0;
        this.countdown--;
        if (this.config.soundEnabled) {
          playCountdown(this.countdown <= 0);
        }
        if (this.countdown <= 0) {
          this.state = 'running';
          this.onStateChange?.('running');

          // 초기 랜덤 속도 부여
          for (const m of this.marbles) {
            m.vel.x = (Math.random() - 0.5) * 50;
            m.vel.y = Math.random() * 30;
          }
        }
      }
    }

    if (this.state === 'running') {
      this.gameTime += dt;

      // 물리 시뮬레이션
      const { collisions, wallHits } = physicsStep(this.marbles, this.map, dt, this.gameTime);

      // 사운드 + 화면 흔들림
      if (this.config.soundEnabled) {
        if (collisions.length > 0) {
          playBounce(0.3 + Math.random() * 0.4);
          if (collisions.length >= 3) this.renderer.triggerShake(2);
        }
        if (wallHits.length > 0 && Math.random() < 0.3) playWallHit();
      }

      // 골인 처리
      for (const marble of this.marbles) {
        if (marble.finished && marble.finishOrder === 0) {
          this.finishOrder++;
          marble.finishOrder = this.finishOrder;
          if (this.config.soundEnabled && this.finishOrder <= 3) playFinish();
        }
      }

      // 스킬 시스템
      if (this.config.enableSkills) {
        updateSkills(this.marbles, dt);
        this.skillSpawnTimer += dt;
        if (this.skillSpawnTimer > 5) {
          this.skillSpawnTimer = 0;
          const active = this.marbles.filter(m => !m.finished && !m.skillActive);
          if (active.length > 0) {
            const lucky = active[Math.floor(Math.random() * active.length)];
            assignRandomSkill(lucky);
            if (this.config.soundEnabled) playSkill();
          }
        }
      }

      // 종료 체크
      const allFinished = this.marbles.every(m => m.finished);
      if (allFinished) {
        this.endGame();
      }
    }

    // Confetti 업데이트
    updateConfetti(dt);

    // 카메라 업데이트
    this.renderer.updateCamera(this.marbles, this.map, this.state);

    // 렌더
    this.renderer.render(
      this.marbles,
      this.map,
      this.state,
      this.gameTime,
      this.countdown,
      this.result,
      this.config.darkMode
    );

    if (this.state !== 'finished') {
      this.animFrameId = requestAnimationFrame(this.loop);
    } else {
      // 결과 화면에서도 confetti 애니메이션 계속
      this.animFrameId = requestAnimationFrame(this.finishLoop);
    }
  };

  private finishLoop = (): void => {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 1 / 30);
    this.lastTime = now;

    updateConfetti(dt);

    this.renderer.updateCamera(this.marbles, this.map, this.state);
    this.renderer.render(
      this.marbles,
      this.map,
      this.state,
      this.gameTime,
      0,
      this.result,
      this.config.darkMode
    );

    this.animFrameId = requestAnimationFrame(this.finishLoop);
  };

  private endGame(): void {
    this.state = 'finished';

    const rankings = [...this.marbles]
      .sort((a, b) => a.finishOrder - b.finishOrder)
      .map(m => ({
        name: m.name,
        time: m.finishTime,
        order: m.finishOrder,
      }));

    let winnerIdx = 0;
    switch (this.config.winnerMode) {
      case 'first':
        winnerIdx = 0;
        break;
      case 'last':
        winnerIdx = rankings.length - 1;
        break;
      case 'custom':
        winnerIdx = Math.min(this.config.customRank - 1, rankings.length - 1);
        break;
    }

    this.result = {
      rankings,
      winner: rankings[winnerIdx]?.name || '',
      duration: this.gameTime,
    };

    // Confetti 발사
    launchConfetti(this.map.width, this.map.height);

    this.onStateChange?.('finished');
  }

  // 리셋
  reset(): void {
    cancelAnimationFrame(this.animFrameId);
    this.state = 'idle';
    this.gameTime = 0;
    this.countdown = 0;
    this.result = null;
    this.finishOrder = 0;

    if (this.marbles.length > 0) {
      const entries = this.marbles.map(m => ({ name: m.name, weight: m.weight }));
      this.setupMarbles(entries);
    }

    this.onStateChange?.('idle');

    // 카메라 리셋 + 정지 상태 렌더
    this.renderer.updateCamera(this.marbles, this.map, 'idle');
    this.renderer.render(
      this.marbles,
      this.map,
      'idle',
      0,
      0,
      null,
      this.config.darkMode
    );
  }

  destroy(): void {
    cancelAnimationFrame(this.animFrameId);
  }
}
