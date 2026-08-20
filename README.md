# 스페셜 크리에이터 웹페이지

오늘의집 "스페셜 크리에이터" 소개 페이지. Figma 디자인을 기반으로 정적 HTML/CSS/JS로 제작 중.

다른 컴퓨터에서 Claude(또는 사람)가 이어서 작업할 때 필요한 배경 설명을 정리해둔 문서입니다.
(git으로는 코드만 넘어가고, 이 대화의 맥락은 넘어가지 않아서 남겨둡니다.)

## 파일 구조

```
index.html / styles.css       "Find the Key" 데스크톱 히어로 페이지
home.html / home.css / home.js "OHOUSE Special Creator" 홈 히어로 페이지 (스크롤 인터랙션)
assets/                        Figma에서 내려받은 벡터·이미지 애셋
.claude/launch.json            로컬 미리보기용 정적 서버 설정
```

## 로컬에서 실행하기

Figma MCP 애셋 URL이 상대경로(`assets/...`)를 참조하므로 `file://`로 직접 열면 일부 리소스가 깨질 수 있습니다.
프로젝트 폴더에서 정적 서버를 띄워서 확인하세요.

```bash
python3 -m http.server 5173
```

이후 `http://localhost:5173/home.html`, `http://localhost:5173/index.html`로 접속.

## Figma 소스

- 메인 디자인 파일: `https://www.figma.com/design/NoZZ6mYgg5AZpr5MxwhzOw/...` (파일 키: `NoZZ6mYgg5AZpr5MxwhzOw`)
- Figma **Sites** 프로젝트(`ugSi251WBhiYVSZRgtzJxR`)도 있었으나 연결된 Figma 계정에 edit 권한이 없어서 접근 불가 → 위 디자인 파일로 계속 작업하기로 함. 필요하면 파일 소유자에게 편집 권한 요청 필요.
- `get_metadata`로 `home` 페이지(`0:135`) 전체를 한 번에 읽으려 하면 응답이 너무 커서 MCP 쪽에서 파싱 에러(SSE JSON invalid)가 계속 남. → 그래서 필요한 하위 노드마다 사용자가 "Copy link to selection"으로 링크를 보내주는 방식으로 개별 진행함. 같은 문제가 재발하면 이 방식을 그대로 쓰면 됨.

### 사용한 주요 노드 ID

| 노드 | 용도 |
|---|---|
| `0:137` (섹션 `0:177` "/find-the-key" 안) | `index.html`의 데스크톱 히어로 |
| `1:252` "key hole image" | 열쇠구멍 오버레이 원본 (다크 배경 + Exclude 키홀 + Scroll/Down 텍스트) |
| `0:660` "hero-outer-graphic" | 키홀 오버레이의 boolean shape (Exclude: 사각형 − 열쇠구멍) |
| `0:135` "home" | 홈페이지 전체 프레임 (메타데이터 통짜로는 못 읽음) |
| `0:49` | 홈페이지 레이아웃 참고용 풀 프레임 (key image 크기 비율 산정에 사용, 1280px 폭 기준) |
| `1:961` "special creater-logo" | OHOUSE / SPECIAL CREATOR 로고 벡터 (텍스트 아님, 실제 벡터로 교체함) |
| `1:975` "key image" | 3D 열쇠 사진 + 그림자 (그림자는 별도 그룹, 애니메이션 제외 대상) |
| `1:982` "home-click me-cusor" | 열쇠 호버 시 따라다니는 "Click me" 커서 배지 |
| `24:56` "downscroll-icon" | 하단 다운스크롤 유도 chevron 아이콘 |

## `home.html` 스크롤 인터랙션 설계 (중요)

`.hero-pin` 섹션(`home.css`/`home.js`)이 핵심 인터랙션입니다. 순서대로:

1. **키홀 오버레이 → 로고 리빌** (`revealDistance = 100vh`의 1.5배 = **150vh** 스크롤 구간)
   - `hero-outer-graphic`(다크 배경 + 열쇠구멍 SVG)이 `scale 1→4.4`, `blur 1.5px→61.5px`, `opacity 1→0`으로 커지면서 사라짐
   - 뒤에 있는 `OHOUSE/SPECIAL CREATOR` 로고는 반대로 `scale 0.4→1`, `blur 10px→0`으로 커지면서 선명해짐 (처음엔 열쇠구멍 사이로 작게 peek 하는 느낌)
   - **가속 이징 적용**: `easeInCubic` (t³) 사용 — 초반엔 느리게, 후반에 급격히 빨라지는 느낌. (레퍼런스: 사용자가 공유한 Pinterest 영상의 모션감 참고)
   - 키홀 SVG는 `preserveAspectRatio="xMidYMid slice"`로 렌더링 — `none`으로 하면 화면 비율에 따라 찌그러지므로 반드시 유지할 것
   - `Scroll`/`Down` 힌트 텍스트 위치는 고정 px가 아니라 `home.js`가 매 리사이즈마다 키홀과 동일한 cover-scale 비율로 재계산함 (`updateHintPosition`)

2. **홀드(정지) 구간**: 리빌이 끝난 뒤 추가로 **60vh**만큼 화면이 그대로 멈춰 있음 (`.hero-pin` 전체 높이 = 100vh(뷰포트) + 150vh(리빌) + 60vh(홀드) = **310vh**)
   - 리빌이 딱 끝나는 순간, 로고에 `is-settling` 클래스로 살짝 튕기는 "덜컥" 스냅 애니메이션 트리거 (`hero-logo-settle` 키프레임, overshoot 이징)
   - 홀드 시작 직후 하단에 `downscroll-icon`이 살짝 딜레이 후 페이드인 + 계속 까딱거리는 bob 애니메이션
   - 홀드 구간 60% 지점부터 다시 페이드아웃 → 다음 섹션으로 넘어가기 전에 완전히 사라지게 처리 (안 그러면 스크롤 릴리즈될 때 화면 위쪽에 어색하게 잔상처럼 남음)

3. 홀드가 끝나면 sticky가 풀리면서 자연스럽게 다음 섹션(`.next-section`)으로 스크롤됨

## 그 아래 "key image" 섹션

- Figma `1:975` 기준, 사진(`key-photo.png`)과 그림자(`key-shadow-1/2.svg`)가 분리되어 있음
- **둥실거리는 모션은 사진에만** 적용 (`.key-photo-wrap`에 `key-float` 애니메이션) — 그림자(`.key-shadow`)는 고정
- 크기는 Figma `0:49` 기준 페이지 폭의 약 **61%**로 스케일 (`clamp(220px, 61vw, 780px)`)
- 호버 시 커서를 숨기고(`cursor: none`) `1:982` "Click me" 배지가 마우스를 따라다님 (`home.js` 하단 `mousemove`/`mouseenter`/`mouseleave`)
- 클릭하면 `index.html`로 이동 (나중에 실제 도메인 사면 `href`만 바꾸면 됨)

## 알아두면 좋은 것

- Pretendard 폰트는 jsdelivr CDN에서 불러옴 (오프라인이면 폰트 깨짐)
- 이 저장소는 private, GitHub 계정 `sarahkim-bucketplace` / repo `special-creator`
- 다른 Mac에서 이어가려면: `git clone` → `gh auth login` (최초 1회) → 이후 `git pull`만 하면 됨
