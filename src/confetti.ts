// ===== 축하 이펙트 (Confetti) =====

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  life: number;
  maxLife: number;
  shape: 'rect' | 'circle' | 'star';
}

let particles: Particle[] = [];
let active = false;

const CONFETTI_COLORS = [
  '#FF4757', '#2ED573', '#1E90FF', '#FFA502', '#A855F7',
  '#FF6B81', '#00D2D3', '#FECA57', '#FF9FF3', '#54A0FF',
];

export function launchConfetti(canvasWidth: number, canvasHeight: number): void {
  active = true;
  particles = [];

  // 여러 위치에서 발사
  for (let burst = 0; burst < 5; burst++) {
    const bx = canvasWidth * (0.1 + 0.2 * burst);
    const by = canvasHeight * 0.5;

    for (let i = 0; i < 40; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
      const speed = 300 + Math.random() * 500;
      const shapes: Particle['shape'][] = ['rect', 'circle', 'star'];

      particles.push({
        x: bx,
        y: by,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 15,
        life: 0,
        maxLife: 2 + Math.random() * 2,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
  }
}

export function updateConfetti(dt: number): void {
  if (!active) return;

  for (const p of particles) {
    p.vy += 300 * dt; // 중력
    p.vx *= 0.99;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rotation += p.rotSpeed * dt;
    p.life += dt;
  }

  particles = particles.filter(p => p.life < p.maxLife);
  if (particles.length === 0) active = false;
}

export function drawConfetti(ctx: CanvasRenderingContext2D): void {
  if (!active) return;

  for (const p of particles) {
    const alpha = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;

    switch (p.shape) {
      case 'rect':
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'star':
        drawStar(ctx, 0, 0, p.size / 2);
        break;
    }

    ctx.restore();
  }
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function isConfettiActive(): boolean {
  return active;
}
