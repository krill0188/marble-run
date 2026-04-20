// ===== 구슬런 사운드 시스템 (Web Audio API) =====

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let initialized = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = 0.3;
  }
  return audioCtx;
}

export function initAudio(): void {
  if (initialized) return;
  const resume = () => {
    getCtx();
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    initialized = true;
    document.removeEventListener('click', resume);
    document.removeEventListener('touchstart', resume);
  };
  document.addEventListener('click', resume);
  document.addEventListener('touchstart', resume);
}

export function setVolume(vol: number): void {
  if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, vol));
}

// 구슬 충돌음
export function playBounce(intensity: number = 0.5): void {
  if (!initialized) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 800 + Math.random() * 400;
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

  gain.gain.value = intensity * 0.15;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

// 벽 충돌음
export function playWallHit(): void {
  if (!initialized) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.value = 300 + Math.random() * 200;

  gain.gain.value = 0.08;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

// 범퍼 히트음
export function playBumperHit(): void {
  if (!initialized) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.value = 1200;
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);

  gain.gain.value = 0.12;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  osc.stop(ctx.currentTime + 0.16);
}

// 골인 사운드
export function playFinish(): void {
  if (!initialized) return;
  const ctx = getCtx();

  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3 + i * 0.1);
    osc.connect(gain);
    gain.connect(masterGain!);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + 0.4 + i * 0.1);
  });
}

// 카운트다운 틱
export function playCountdown(final: boolean = false): void {
  if (!initialized) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = final ? 880 : 440;

  gain.gain.value = 0.2;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// 스킬 사운드
export function playSkill(): void {
  if (!initialized) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = 300;
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);

  gain.gain.value = 0.1;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  osc.stop(ctx.currentTime + 0.22);
}
