// ===== 구슬런 메인 엔트리 =====
import './styles.css';
import { Game } from './game';
import { getMapList } from './maps';

// === DOM 구성 ===
const app = document.getElementById('app')!;
app.innerHTML = `
  <div id="side-panel">
    <div class="logo-area">
      <div class="logo-title">구슬런</div>
      <div class="logo-subtitle">MARBLE RUN</div>
    </div>

    <div class="panel-section">
      <div class="section-title">참가자</div>
      <textarea id="name-input" placeholder="이름을 입력하세요&#10;쉼표 또는 줄바꿈으로 구분&#10;&#10;예: 홍길동, 김철수, 이영희"></textarea>
      <div class="input-hint">
        가중치: <code>이름/2</code> &nbsp; 중복: <code>이름*3</code>
      </div>
      <div id="participant-count">0명</div>
    </div>

    <div class="panel-section">
      <div class="section-title">맵</div>
      <div class="setting-row">
        <span class="setting-label">맵 선택</span>
        <select id="map-select"></select>
      </div>
    </div>

    <div class="panel-section">
      <div class="section-title">우승 조건</div>
      <div class="radio-group" id="winner-mode">
        <div class="radio-btn active" data-value="first">1등 (First)</div>
        <div class="radio-btn" data-value="last">꼴등 (Last)</div>
        <div class="radio-btn" data-value="custom">지정 순위</div>
      </div>
      <div class="setting-row" id="custom-rank-row" style="display:none; margin-top:8px;">
        <span class="setting-label">몇 등?</span>
        <input type="number" id="custom-rank-input" value="1" min="1">
      </div>
    </div>

    <div class="panel-section">
      <div class="section-title">설정</div>
      <div class="setting-row">
        <span class="setting-label">스킬</span>
        <label class="toggle-switch">
          <input type="checkbox" id="toggle-skills">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">궤적 표시</span>
        <label class="toggle-switch">
          <input type="checkbox" id="toggle-trails" checked>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">다크모드</span>
        <label class="toggle-switch">
          <input type="checkbox" id="toggle-dark" checked>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">사운드</span>
        <label class="toggle-switch">
          <input type="checkbox" id="toggle-sound" checked>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">볼륨</span>
        <input type="range" id="volume-slider" min="0" max="100" value="30">
      </div>
    </div>

    <div class="btn-group">
      <button class="btn btn-shuffle" id="btn-shuffle">🔀 셔플</button>
      <button class="btn btn-start" id="btn-start">▶ 시작</button>
    </div>
    <div class="btn-group" style="padding-top:0;">
      <button class="btn btn-reset" id="btn-reset">↺ 리셋</button>
    </div>

    <div class="credits">made by KIM</div>
  </div>

  <div id="canvas-area">
    <button id="panel-toggle">☰</button>
    <canvas id="game-canvas"></canvas>
  </div>

  <div class="toast" id="toast"></div>
`;

// === 초기화 ===
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const game = new Game(canvas);

// === 맵 셀렉트 ===
const mapSelect = document.getElementById('map-select') as HTMLSelectElement;
const mapList = getMapList();
for (const m of mapList) {
  const opt = document.createElement('option');
  opt.value = m.id;
  opt.textContent = m.name;
  mapSelect.appendChild(opt);
}
mapSelect.addEventListener('change', () => {
  game.updateConfig({ selectedMap: mapSelect.value });
  if (game.getState() === 'idle' || game.getState() === 'ready') {
    applyNames();
  }
});

// === 이름 입력 ===
const nameInput = document.getElementById('name-input') as HTMLTextAreaElement;
const countDisplay = document.getElementById('participant-count')!;

// 로컬 스토리지 복원
const saved = localStorage.getItem('marble-run-names');
if (saved) nameInput.value = saved;

function applyNames(): void {
  const entries = game.parseNames(nameInput.value);
  game.setupMarbles(entries);
  countDisplay.textContent = `${entries.length}명`;
  localStorage.setItem('marble-run-names', nameInput.value);

  // 정지 상태 렌더링을 위해 리셋 호출
  game.reset();
}

nameInput.addEventListener('input', () => {
  const entries = game.parseNames(nameInput.value);
  countDisplay.textContent = `${entries.length}명`;
  localStorage.setItem('marble-run-names', nameInput.value);
});

// 초기 적용
if (nameInput.value.trim()) applyNames();

// === 우승 조건 ===
const winnerBtns = document.querySelectorAll('#winner-mode .radio-btn');
const customRow = document.getElementById('custom-rank-row')!;
const customInput = document.getElementById('custom-rank-input') as HTMLInputElement;

winnerBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    winnerBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.getAttribute('data-value') as 'first' | 'last' | 'custom';
    game.updateConfig({ winnerMode: mode });
    customRow.style.display = mode === 'custom' ? 'flex' : 'none';
  });
});

customInput.addEventListener('change', () => {
  game.updateConfig({ customRank: parseInt(customInput.value) || 1 });
});

// === 토글 설정 ===
function bindToggle(id: string, key: string): void {
  const el = document.getElementById(id) as HTMLInputElement;
  el.addEventListener('change', () => {
    game.updateConfig({ [key]: el.checked });
    if (key === 'darkMode') {
      document.documentElement.setAttribute('data-theme', el.checked ? 'dark' : 'light');
    }
  });
}

bindToggle('toggle-skills', 'enableSkills');
bindToggle('toggle-trails', 'showTrails');
bindToggle('toggle-dark', 'darkMode');
bindToggle('toggle-sound', 'soundEnabled');

const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
volumeSlider.addEventListener('input', () => {
  game.updateConfig({ volume: parseInt(volumeSlider.value) / 100 });
});

// === 버튼 ===
const btnShuffle = document.getElementById('btn-shuffle')!;
const btnStart = document.getElementById('btn-start')!;
const btnReset = document.getElementById('btn-reset')!;

btnShuffle.addEventListener('click', () => {
  applyNames();
  game.shuffle();
  showToast('셔플 완료!');
});

btnStart.addEventListener('click', () => {
  const entries = game.parseNames(nameInput.value);
  if (entries.length < 2) {
    showToast('2명 이상 입력해주세요');
    return;
  }
  applyNames();
  game.shuffle();
  game.start();
});

btnReset.addEventListener('click', () => {
  game.reset();
  showToast('리셋!');
});

// 게임 상태 변경 콜백
game.setStateChangeCallback((state) => {
  if (state === 'running') {
    btnStart.textContent = '⏸ 진행중...';
    btnStart.style.pointerEvents = 'none';
  } else if (state === 'finished') {
    btnStart.textContent = '▶ 다시 시작';
    btnStart.style.pointerEvents = 'auto';
  } else {
    btnStart.textContent = '▶ 시작';
    btnStart.style.pointerEvents = 'auto';
  }
});

// === 패널 토글 ===
const panelToggle = document.getElementById('panel-toggle')!;
const sidePanel = document.getElementById('side-panel')!;

panelToggle.addEventListener('click', () => {
  sidePanel.classList.toggle('collapsed');
  panelToggle.textContent = sidePanel.classList.contains('collapsed') ? '☰' : '✕';
  // 캔버스 리사이즈
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 350);
});

// === 토스트 ===
const toastEl = document.getElementById('toast')!;
let toastTimer: number;

function showToast(message: string): void {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastEl.classList.remove('show');
  }, 1500);
}

// === 키보드 단축키 ===
document.addEventListener('keydown', (e) => {
  if (e.target === nameInput) return;

  switch (e.key) {
    case ' ':
    case 'Enter':
      e.preventDefault();
      if (game.getState() === 'finished') {
        game.reset();
      } else if (game.getState() !== 'running') {
        btnStart.click();
      }
      break;
    case 'r':
    case 'R':
      game.reset();
      break;
    case 's':
    case 'S':
      btnShuffle.click();
      break;
  }
});
