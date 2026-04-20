# 🔮 구슬런 (MarbleRun)

**방송용 구슬 룰렛 게임** — 이름을 넣고 굴려서 뽑기!

> 🎮 **라이브 데모:** [https://krill0188.github.io/marble-run/](https://krill0188.github.io/marble-run/)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 🎱 물리 시뮬레이션 | 자체 물리엔진 — 충돌, 중력, 마찰, 반발 |
| 🗺 맵 3종 | 클래식 (핀볼) / 깔때기 (수렴) / 지그재그 (S자) |
| ⚡ 스킬 시스템 | 부스트, 쉴드, 수축, 고스트, 자석 |
| 🔊 사운드 이펙트 | Web Audio API — 설치 불필요 |
| 🎊 축하 이펙트 | Confetti 파티클 |
| 🏆 우승 조건 | 1등 / 꼴등 / 지정 순위 |
| 🌙 다크/라이트 모드 | 원클릭 전환 |
| 📱 모바일 반응형 | 모바일 브라우저 지원 |
| 💾 자동 저장 | 이름 로컬스토리지 저장 |

## 사용법

### 이름 입력
```
홍길동, 김철수, 이영희, 박민수
```

### 가중치 (당첨 확률 조정)
```
홍길동/2, 김철수/1
```

### 중복 입력
```
홍길동*3
```

### 키보드 단축키
| 키 | 동작 |
|----|------|
| `Space` / `Enter` | 시작 / 재시작 |
| `R` | 리셋 |
| `S` | 셔플 |

## 기술 스택

- **TypeScript** — 타입 안전 코드
- **Vite** — 빌드 도구
- **Canvas 2D** — 렌더링 (3D 구슬 효과)
- **Web Audio API** — 사운드 (외부 파일 없음)
- **GitHub Pages** — 배포

## 로컬 실행

```bash
git clone https://github.com/krill0188/marble-run.git
cd marble-run
npm install
npm run dev
```

## 빌드 & 배포

```bash
npm run build    # dist/ 생성
npm run deploy   # GitHub Pages 배포
```

## 라이선스

방송 및 영상을 포함한 모든 곳에서 자유롭게 사용 가능합니다.

---

made by KIM
