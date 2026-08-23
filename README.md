# 스페셜 크리에이터 웹페이지

오늘의집 "스페셜 크리에이터" 소개 페이지. Figma 디자인을 기반으로 정적 HTML/CSS/JS로 제작 중.

다른 컴퓨터에서 Claude(또는 사람)가 이어서 작업할 때 필요한 배경 설명을 정리해둔 문서입니다.
(git으로는 코드만 넘어가고, 이 대화의 맥락은 넘어가지 않아서 남겨둡니다.)

## 파일 구조

```
FindTheKey.html / FindTheKey.css               "Find the Key" 데스크톱 히어로 페이지
hero-home.html / hero-home.css / hero-home.js  "OHOUSE Special Creator" 홈 히어로 페이지 (스크롤 인터랙션)
OpportunitiesUnlocked.html / .css              "Opportunities Unlocked" 목록 페이지 (Figma 0:236)
OpportunitiesUnlocked-01~05.html / .css        카드 클릭 시 이동하는 상세 페이지 (Figma 0:771) — 아래 절 참고
detail-photo-carousel.js                       위 5개 상세 페이지가 공용으로 쓰는 사진 슬라이드 화살표 스크립트
CreatorVoices.html / .css                      "Creator Voices" 페이지 (Figma 0:519) — 아래 절 참고
BeyondTheDoor.html / .css                      "Beyond the Door" 페이지 (Figma 28:476) — 아래 절 참고
trophy.js                                      3D 트로피 뷰어 (현재 어떤 HTML에도 연결 안 됨, 보류 중)
assets/                                        Figma에서 내려받은 벡터·이미지 애셋 (+ trophy.fbx)
.claude/launch.json                            로컬 미리보기용 정적 서버 설정 (아래 "알아두면 좋은 것" 참고 — 이 프로젝트 경로에선 안 먹음)
```

헤더 nav 4개 페이지(`Find the Key` / `Opportunities Unlocked` / `Creator Voices` / `Beyond the Door`)가 전부 만들어져서 서로 실제 `href`로 연결되어 있음. `Open Your Door` CTA만 아직 목적지가 없어서 `href="#"`.

## 로컬에서 실행하기

Figma MCP 애셋 URL이 상대경로(`assets/...`)를 참조하므로 `file://`로 직접 열면 일부 리소스가 깨질 수 있습니다.
프로젝트 폴더에서 정적 서버를 띄워서 확인하세요.

```bash
python3 -m http.server 5173
```

이후 `http://localhost:5173/hero-home.html`, `http://localhost:5173/FindTheKey.html`로 접속.

## Figma 소스

- 메인 디자인 파일: `https://www.figma.com/design/NoZZ6mYgg5AZpr5MxwhzOw/...` (파일 키: `NoZZ6mYgg5AZpr5MxwhzOw`)
- Figma **Sites** 프로젝트(`ugSi251WBhiYVSZRgtzJxR`)도 있었으나 연결된 Figma 계정에 edit 권한이 없어서 접근 불가 → 위 디자인 파일로 계속 작업하기로 함. 필요하면 파일 소유자에게 편집 권한 요청 필요.
- `get_metadata`로 `home` 페이지(`0:135`) 전체를 한 번에 읽으려 하면 응답이 너무 커서 MCP 쪽에서 파싱 에러(SSE JSON invalid)가 계속 남. → 그래서 필요한 하위 노드마다 사용자가 "Copy link to selection"으로 링크를 보내주는 방식으로 개별 진행함. 같은 문제가 재발하면 이 방식을 그대로 쓰면 됨.

### 사용한 주요 노드 ID

| 노드 | 용도 |
|---|---|
| `0:137` (섹션 `0:177` "/find-the-key" 안) | `FindTheKey.html`의 데스크톱 히어로 |
| `1:252` "key hole image" | 열쇠구멍 오버레이 원본 (다크 배경 + Exclude 키홀 + Scroll/Down 텍스트) |
| `0:660` "hero-outer-graphic" | 키홀 오버레이의 boolean shape (Exclude: 사각형 − 열쇠구멍) |
| `0:135` "home" | 홈페이지 전체 프레임 (메타데이터 통짜로는 못 읽음) |
| `0:49` | 홈페이지 레이아웃 참고용 풀 프레임 (key image 크기 비율 산정에 사용, 1280px 폭 기준) |
| `1:961` "special creater-logo" | OHOUSE / SPECIAL CREATOR 로고 벡터 (텍스트 아님, 실제 벡터로 교체함) |
| `1:975` "key image" | 3D 열쇠 사진 + 그림자 (그림자는 별도 그룹, 애니메이션 제외 대상) |
| `1:982` "home-click me-cusor" | 열쇠 호버 시 따라다니는 "Click me" 커서 배지 |
| `24:56` "downscroll-icon" | 하단 다운스크롤 유도 chevron 아이콘 |
| `48:271`/`48:284`/`48:297` "header" | 공용 헤더 컴포넌트 (페이지마다 인스턴스 노드 id는 다르지만 구조는 동일 — 아래 "헤더" 절 참고) |
| `0:147` "finethekey-image-rolling" | `FindTheKey.html`의 무한 롤링 이미지 카드 행 (아래 절 참고) |
| `0:137` "find-the-key-main" | `FindTheKey.html` 전체 프레임 (예전엔 "Desktop"이라는 이름이었음, 리네임됨) |
| `54:1435` | 배경 그라데이션 블롭 레퍼런스 (아래 "배경 시스템" 절 참고) |
| `0:236` "Opportunities-Unlocked-main" | `OpportunitiesUnlocked.html` 전체 프레임 |
| `55:2048` "OU-contents-box-on" | Opportunities Unlocked의 5개 카드 행 (가운데 강조 카드 + 좌우 dim 카드) |

## `hero-home.html` 스크롤 인터랙션 설계 (중요)

`.hero-pin` 섹션(`hero-home.css`/`hero-home.js`)이 핵심 인터랙션입니다. 순서대로:

1. **키홀 오버레이 → 로고 리빌** (`revealDistance = 100vh`의 1.5배 = **150vh** 스크롤 구간)
   - `hero-outer-graphic`(다크 배경 + 열쇠구멍 SVG)이 `scale 1→4.4`, `blur 1.5px→61.5px`, `opacity 1→0`으로 커지면서 사라짐
   - 뒤에 있는 `OHOUSE/SPECIAL CREATOR` 로고는 반대로 `scale 0.4→1`, `blur 10px→0`으로 커지면서 선명해짐 (처음엔 열쇠구멍 사이로 작게 peek 하는 느낌)
   - **가속 이징 적용**: `easeInCubic` (t³) 사용 — 초반엔 느리게, 후반에 급격히 빨라지는 느낌. (레퍼런스: 사용자가 공유한 Pinterest 영상의 모션감 참고)
   - 키홀 SVG는 `preserveAspectRatio="xMidYMid slice"`로 렌더링 — `none`으로 하면 화면 비율에 따라 찌그러지므로 반드시 유지할 것
   - `Scroll`/`Down` 힌트 텍스트 위치는 고정 px가 아니라 `hero-home.js`가 매 리사이즈마다 키홀과 동일한 cover-scale 비율로 재계산함 (`updateHintPosition`)

2. **홀드(정지) 구간**: 리빌이 끝난 뒤 추가로 **60vh**만큼 화면이 그대로 멈춰 있음 (`.hero-pin` 전체 높이 = 100vh(뷰포트) + 150vh(리빌) + 60vh(홀드) = **310vh**)
   - 리빌이 딱 끝나는 순간, 로고에 `is-settling` 클래스로 살짝 튕기는 "덜컥" 스냅 애니메이션 트리거 (`hero-logo-settle` 키프레임, overshoot 이징)
   - 홀드 시작 직후 하단에 `downscroll-icon`이 살짝 딜레이 후 페이드인 + 계속 까딱거리는 bob 애니메이션
   - 홀드 구간 60% 지점부터 다시 페이드아웃 → 다음 섹션으로 넘어가기 전에 완전히 사라지게 처리 (안 그러면 스크롤 릴리즈될 때 화면 위쪽에 어색하게 잔상처럼 남음)

3. 홀드가 끝나면 sticky가 풀리면서 자연스럽게 다음 섹션(`.next-section`)으로 스크롤됨

## 그 아래 "key image" 섹션

- Figma `1:975` 기준, 사진(`key-photo.png`)과 그림자(`key-shadow-1/2.svg`)가 분리되어 있음
- **둥실거리는 모션은 사진에만** 적용 (`.key-photo-wrap`에 `key-float` 애니메이션) — 그림자(`.key-shadow`)는 고정
- 크기는 Figma `0:49` 기준 페이지 폭의 약 **61%**로 스케일 (`clamp(220px, 61vw, 780px)`)
- 호버 시 커서를 숨기고(`cursor: none`) `1:982` "Click me" 배지가 마우스를 따라다님 (`hero-home.js` 하단 `mousemove`/`mouseenter`/`mouseleave`)
- 클릭하면 `FindTheKey.html`로 이동 (나중에 실제 도메인 사면 `href`만 바꾸면 됨)

## 히어로 상단 여백

4개 페이지(`FindTheKey`/`OpportunitiesUnlocked`/`CreatorVoices`/`BeyondTheDoor`)가 전부 공유하는 `.hero { margin-top: 85px; }` — 원래 113px이었는데, 콘텐츠가 헤더에서 너무 멀리 떨어져 보인다는 피드백으로 Figma `0:137`(FindTheKey) 기준 헤더 하단(105px)~히어로 상단(190px) 실측 간격에 맞춰 낮춤. 4개 파일 모두 같은 값을 씀 — 하나를 바꾸면 나머지도 같이 바꿔야 함(공용 stylesheet로 뽑혀있지 않고 각 CSS에 중복 존재).

## 헤더 (Figma `header` 컴포넌트)

모든 페이지가 같은 헤더 마크업/CSS를 (페이지별 CSS 파일에 중복해서) 갖고 있음. 로고 + nav 링크 4개 + CTA 버튼 구조:

- 로고(`#icon-logo`)는 클릭하면 `hero-home.html`(열쇠구멍 스크롤 첫 화면)로 이동
- nav 링크 4개: `Find the Key` / `Opportunities Unlocked` / `Creator Voices` / `Beyond the Door` — Figma 컴포넌트에 `prop1: on/off` variant가 있어서, 현재 보고 있는 페이지에 해당하는 링크만 `on`으로 표시해야 함
  - 구현은 `.header__link--on` / `.header__link--off` 클래스로 함 (on = `font-weight: 600`, Pretendard SemiBold)
  - **주의**: on/off의 실제 시각 차이는 Figma에서 직접 variant를 확인한 게 아니라, 이전 버전 헤더의 active 링크가 볼드였던 것에 근거해 추정한 것. 실제 Figma on 상태 디자인이 다르면(색상/밑줄 등) 수정 필요
  - 새 페이지를 만들 때마다: 그 페이지의 링크만 `--on`, 나머지는 `--off`로. `Find the Key` ↔ `Opportunities Unlocked`는 이제 서로 실제 `href`로 연결되어 있음 (나머지 미완성 페이지들은 아직 `href="#"`)
- **CTA 버튼 "Open Your Door"** (Figma node `48:952`): 다크 필(pill) 버튼, `.header__cta` 클래스. 아직 실제 목적지가 정해지지 않아서 `href="#"` 상태 — 나중에 실제 랜딩 페이지 생기면 연결할 것
- **헤더는 `position: fixed`로 스크롤해도 항상 상단에 고정됨**, 배경은 투명 (사용자가 반투명+블러 배경을 시도했다가 "이상하다"고 해서 완전 투명으로 되돌림). `body`에 `padding-top: 105px`을 줘서 헤더가 in-flow였을 때와 동일한 여백을 유지함
  - **중요한 함정**: 처음엔 `position: sticky`로 구현했는데, `body`에 `.rolling` 섹션의 100vw breakout 때문에 걸려있는 `overflow-x: hidden`과 충돌해서 헤더가 스크롤하면 그냥 사라져버리는 버그가 있었음 (sticky 위치 계산이 깨짐 — 알려진 브라우저 동작). `overflow-x: hidden`을 `body`에서 빼면 sticky는 고쳐지지만 이번엔 실제로 가로 스크롤이 가능해지는 부작용이 생김. 최종 해결책은 `position: fixed`로 바꾸는 것 — fixed는 조상의 overflow 설정에 영향을 안 받음. **다른 페이지에 헤더를 붙일 때도 sticky 대신 fixed를 쓸 것.**
- **모바일 햄버거 메뉴 (900px 이하)**: 원래 nav 링크 4개+CTA가 `white-space: nowrap`이라 좁은 화면에서 줄바꿈 없이 그대로 넘쳐서, 로고가 flex-shrink로 너비 0까지 눌리고 "Beyond the Door"/CTA 버튼은 뷰포트 밖으로 밀려나 아예 탭할 수 없는 상태였음(사용자가 실측 스크린샷으로 발견). 900px 이하에서 로고 옆에 햄버거 버튼(`.header__menu-btn`)이 나타나고, 누르면 `.header`에 `header--menu-open` 클래스가 붙으면서 `.header__links`가 헤더 바로 아래(`top:105px`) 전체너비 드롭다운 패널로 바뀜(`max-height` 트랜지션으로 열림/닫힘). 로직은 `header-menu.js` 하나로 이 헤더를 쓰는 9개 페이지(`FindTheKey`/`OpportunitiesUnlocked`/`CreatorVoices`/`BeyondTheDoor`/`OpportunitiesUnlocked-01~05`) 전부가 공유함 — 새 페이지에 헤더를 붙일 때 `<script src="header-menu.js"></script>`도 같이 추가할 것. 드롭다운 안의 링크를 클릭하면 자동으로 닫힘, 900px보다 넓어지면(리사이즈) 자동으로 닫힘. 예전에 있던 600px 전용 `.header`/`.header__links`/`.header__link` 폰트·간격 축소 규칙은 이제 이 드롭다운으로 대체되어 제거함
  - 드롭다운 배경은 흰색이 아니라 `#fbfde4` — `.bg-gradient-anim`의 노란 블롭(`rgba(246,251,196,0.45)`)이 흰 배경 위에 겹쳤을 때 실제로 보이는 색을 계산해서 씀(파란 블롭 쪽 `#e9f4ff`도 시도했다가 사용자가 노란색 쪽을 선택함). 배경 블롭 색이 바뀌면 이 값도 같이 맞춰줘야 함
  - 햄버거 아이콘(현재는 CSS로 그린 3줄 막대)은 사용자가 나중에 실제 아이콘 에셋을 따로 전달할 예정 — 그때 `.header__menu-icon` 관련 CSS를 이미지/SVG로 교체할 것

## `finethekey-image-rolling` (Figma node `0:147`)

`FindTheKey.html`의 카드 섹션은 Figma에서 4개→5개 이미지로 늘어나면서 `finethekey-image-rolling`으로 리네임됨 — 화면 전체 너비로 꽉 차게(edge-to-edge) 배치하고 **계속 자연스럽게 롤링**되어야 한다는 요구사항이 있었음.

- 구현: `.rolling__track`에 원본 N개 + 복제 N개(총 2N개) 아이템을 넣고 `translateX(0) → translateX(-50%)` 무한 애니메이션(`rolling-scroll`). 두 세트가 완전히 동일하면 `-50%` 지점에서 이음매 없이 루프됨 — 아이템 개수/gap이 바뀌어도 항상 정확히 맞음
  - 현재 실사진 7장(`assets/find-the-key/rolling/rolling-01~07.*`, 전부 세로형이라 393×495 박스에 `object-fit: cover`로 크롭됨) — 원래 5장 회색 placeholder였다가 실사진으로 교체하면서 7장으로 늘림. 아이템 수를 바꿀 때마다 `rolling-scroll` 애니메이션 duration도 비례해서 같이 바꿔야 체감 속도가 유지됨 (5개→32s였던 걸 7개→45s로, `32 * (7/5)` 비례 계산). 아이템 수를 또 바꾸면 `이전 개수 : 이전 duration = 새 개수 : 새 duration` 비율로 다시 계산할 것
- `.rolling`은 `.page`의 max-width 1280px 안에 있지만 `left: 50%; margin-left: -50vw;` 트릭으로 뷰포트 전체 너비로 breakout함
- Figma 스펙에는 `border-radius`가 없음 — 카드에 둥근 모서리 넣지 말 것 (한 번 실수로 넣었다가 제거함)

`find-the-key-main`(`0:137`)이 이후 Figma에서 한 번 더 업데이트되어 다시 반영함:
- 히어로 타이틀에서 "(WIP)" 제거 → 그냥 "Special Creator"
- 카드 아래 문구 재작성: "오늘의집은 그 가능성의 문을 여는 스페셜 크리에이터를 '영감의 키(Key)'라고 믿습니다" (`.insight`, `font-weight: 400` — 한 번 500으로 잘못 들어가 있던 걸 고침. Pretendard Regular = 400)
- Figma 노드명을 `data-name` 속성으로 각 요소에 매핑해둠 (`find-the-key-main`, `main_text_frame`, `icon-SC`, `text`, `sub-text` 등) — 나중에 Figma랑 대조할 때 참고

## 배경 시스템 — `.bg-gradient-anim` + `.bg-grain` (모든 페이지 공용)

`FindTheKey.html`, `hero-home.html`, `OpportunitiesUnlocked.html` 전부 동일한 배경을 씀 (페이지별 CSS 파일에 그대로 복붙되어 있음 — 공용 stylesheet로 뽑아내지 않았음, 필요하면 리팩터링 가능).

- **`.bg-grain`**: 흰 배경 위에 미세한 노이즈 텍스처. `mix-blend-mode: overlay`가 아니라 반드시 **`multiply`**를 써야 함 — overlay는 베이스가 순수 흰색(#fff)일 때 수학적으로 완전히 no-op이라 아무 효과가 안 보임 (실제로 겪은 버그).
- **`.bg-gradient-anim`**: 노랑(`rgba(246,251,196)`)·하늘색(`rgba(205,231,255)`) 블롭 2개가 각각 다른 주기(14s/16s)로 부드럽게 떠다님 (`::before`/`::after` 가상 요소, `filter: blur(60px)`). Figma node `54:1435`(정적 레퍼런스: 작은 블롭 2개가 각자 영역에서 보이는 느낌)를 보고 다시 만든 버전 — 처음엔 큰 대각선 `linear-gradient` 하나를 `background-position`으로 움직이는 방식으로 만들었다가, "한 번에 색 하나만 보인다"는 피드백을 받고 지금의 2-블롭 방식으로 교체함
  - 튜닝 히스토리: opacity `0.85` → 너무 진하다는 피드백 → `0.45`로. 이동 거리 `70~100px` → 너무 안 움직여 보인다는 피드백 → `180px` + `scale(1.15)` 펄스 추가로 체감 늘림
- 원래 `hero-home.html`의 `.hero-pin__stage`엔 자체 정적 그라데이션 배경이 따로 있었는데, 이것도 지우고 위 공용 배경으로 통일함 (사용자가 "이 배경들 다 동일하게 적용해줘, 기존 배경은 없애고" 요청)

## Opportunities Unlocked 목록 페이지 (Figma `0:236`)

`OpportunitiesUnlocked.html`/`.css` — 헤더의 "Opportunities Unlocked" 링크를 누르면 나오는 페이지. `FindTheKey.html`과 헤더/히어로 구조/배경 시스템을 그대로 재사용하고, 그 아래에 새 섹션만 추가:

- **카드 행은 Figma의 `OU-contents-box-off`(`55:2049`) 기준** — 카드 5개가 기본 상태에선 전부 동일한 크기(291×430)와 `opacity: 0.4`, 텍스트도 전부 "Creator Network"로 통일되어 있음 (특정 카드가 고정으로 강조된 `-box-on`(`55:2048`) 버전은 폐기함)
  - **마우스를 올리면(hover) 그 카드만** Figma의 강조 크기(394×520, `opacity: 1`)로 부드럽게 커짐 — 어떤 카드든 hover하면 그 카드가 커지는 방식 (`.ou-card:hover`, `transition`)
  - `align-items: flex-start`(상단 정렬) — 실제 콘텐츠가 들어가면서 카드마다 제목이 1줄/2줄로 길이가 달라지자(예: "93 CUPS, 93 STORIES" 2줄 vs "스토리마켓" 1줄) 원래 쓰던 `flex-end`(하단 정렬) 때문에 썸네일 상단이 카드마다 들쭉날쭉해 보이는 문제가 생겨서 `flex-start`로 바꿈. 이 때문에 hover로 커지는 카드는 이제 아래로만 자라남 (예전엔 위로 자랐음 — 그때는 제목이 전부 "Creator Network" placeholder로 통일돼서 문제가 안 보였을 뿐, 실제 카드별 텍스트 길이가 다양해지면 이 정렬 방식이 맞음)
  - 각 카드 제목 옆에 `icon-go` 화살표(18×18, `rotate(-90deg)`로 오른쪽을 가리키게 함)
  - 전체 폭이 1618px로 `.page`의 1280px보다 넓음. **1680px 이상** 뷰포트에서는 `.rolling`과 같은 방식(`left: 50%` + 음수 `margin-left`)으로 breakout하고 스크롤 없이 중앙 정렬됨. **1680px 미만**에서는 100vw 폭의 스크롤 가능한 스트립으로 전환됨(`overflow-x: auto`, 스크롤바는 숨김) — 트랙패드는 그대로 스와이프되고, `OpportunitiesUnlocked.js`가 마우스 클릭+드래그 스크롤도 지원함 (드래그 중엔 커서가 grab→grabbing)
  - 카드 5개 전부 `<a>` 태그로 바뀌어서 클릭하면 아래 상세 페이지로 이동함
- 헤더 nav는 `FindTheKey.html` ↔ `OpportunitiesUnlocked.html` 양방향으로 실제 `href` 연결되어 있음

## Opportunities Unlocked 상세 페이지 (Figma `0:771`)

목록 페이지의 카드를 클릭하면 이동하는 페이지. **Figma 프레임 번호와 파일 번호를 맞춤**: `Frame-01` → `OpportunitiesUnlocked-01.html`, `Frame-02` → `-02.html`, ... `Frame-05` → `-05.html`. 5개 파일 모두 지금은 완전히 동일한 내용(오늘의집 × 이도 "93 CUPS, 93 STORIES" 텍스트/레이아웃)의 복사본임 — 카드별로 실제 콘텐츠가 아직 안 정해져서 우선 구조만 5개로 나눠둔 상태. 나중에 카드마다 실제 사례가 정해지면 각 `-0N.html`/`.css`에 그 내용만 채워 넣으면 됨.

레이아웃 (좌우 2분할, 다른 페이지들과 달리 `.page` max-width 없이 풀블리드):
- 왼쪽 **`Photo-box`**: 실제 사진은 아직 없어서(Figma에서도 임시로 뺀 상태) `#8a8a8a`~`#5a5a5a` 톤의 번호 붙은 placeholder 슬라이드 4장(`.detail__photo-slide`)이 들어가 있음. 좌우 화살표(`before-icon`/`after-icon`, 42px)를 누르면 이 슬라이드가 순환(맨 끝에서 반대쪽으로 넘어감)하며 전환됨 — `detail-photo-carousel.js`(5개 상세 페이지가 공용으로 씀, 유일하게 페이지 간 공유하는 JS 파일). 실제 사진이 정해지면 `.detail__photo-slide` 안에 `<img>`만 넣으면 되고(`object-fit: cover`), 마크업/JS는 안 바꿔도 됨. 이 화살표는 사진만 넘기고, **페이지 이동(이전/다음 사례)은 하단 Navigator가 따로 담당**
- 오른쪽 텍스트 컬럼: 카테고리(`#5d5d5d`, 14px) + 타이틀(8px 간격) → 35px 간격 → 본문. 위쪽에 구분선(`border-top`)
- 하단 **`Navigator`**: 구분선이 텍스트 **아래**에 있음 (위가 아님 — 처음에 위로 잘못 넣었다가 고침). 전체 wrapper는 `opacity` 없음, 대신 "이전/다음" 링크 각각에 `opacity: 0.6`. 두 링크는 `gap: 300px`로 중앙에 모여있음 (900px 이하에서는 `space-between` + 24px로 전환)
  - 링크는 Figma 원래 문구 대신 **01~05를 순환하는 실제 페이지 이동**으로 연결해둠: `01 ← 02 ← 03 ← 04 ← 05`, `01 → 02 → 03 → 04 → 05 → (다시) 01`. **예외는 딱 하나** — `01`의 "이전"만 목록 페이지(`OpportunitiesUnlocked.html`)로 감 (그 앞에 다른 상세 페이지가 없어서). `05`의 "다음"은 `01`로 순환(wrap)됨
  - 카드별 실제 콘텐츠가 정해지면, 이 상세 페이지들 자체도 서로 다른 내용으로 채워질 것이므로 그때 Navigator 링크 텍스트("이전 사례"/"다음 사례")도 그 사례 제목으로 바꿔주면 자연스러움
- 900px 이하에서는 사진이 위, 텍스트가 아래로 세로 스택됨

## Creator Voices 페이지 (Figma `0:519`)

`CreatorVoices.html`/`.css` — 헤더/히어로/배경 시스템은 다른 페이지와 동일하게 재사용. `FindTheKey.css`의 공용 블록(리셋~`.hero__subtitle`까지)을 그대로 복사해서 시작함.

- **`CV-Contents-01`/`02`** (Figma `48:1057`/`48:1112`): 사진(495×340) + 텍스트가 좌우로 나란히 배치되는 행 4개, 홀수 행은 사진이 왼쪽, 짝수 행은 사진이 오른쪽 — `.cv-row` / `.cv-row--reverse`(DOM 순서는 항상 "사진, 텍스트"로 동일, `flex-direction: row-reverse`로만 시각적으로 뒤집음)
  - Figma의 4개 행 콘텐츠(타이틀 "기록이 열어준 새로운 기회", 작성자 "MOPO 님", 본문)가 전부 동일한 placeholder 텍스트라, 그대로 4번 복사해둠 — 실제 인터뷰 콘텐츠가 정해지면 각 `.cv-row`의 텍스트만 바꾸면 됨
  - **행 사이 간격은 비대칭**: 사용자가 Figma에서 조정한 뒤로, 일반 행(사진 왼쪽) 다음엔 `margin-bottom: 220px`, 반전 행(사진 오른쪽) 다음엔 `margin-bottom: 267px`(+47px 더 넓음) — 절대좌표로 역산해서 확인한 값. `.hero`도 첫 행 앞에 동일하게 `margin-bottom: 220px`을 가짐. 예전엔 모든 행이 `padding: 90px 0`으로 균일했는데, 지금은 padding 대신 타입별 margin-bottom 방식으로 바뀜 — `.cv-outro`엔 더 이상 자체 margin-top이 없음(마지막 행의 margin-bottom이 그 간격까지 이미 포함)
  - 900px 이하에서는 사진이 위, 텍스트가 아래로 세로 스택, 간격도 균일하게 `margin-bottom: 48px`로 축소
- 하단 **outro**(Figma `55:2735` "sub-text") + **CTA 버튼** "스페셜 크리에이터 지원하기"(`#464646` 배경, 56px 높이, `rounded-52`) — 아직 실제 지원 폼/링크가 없어서 `href="#"`
- 헤더 nav에서 `Creator Voices` 링크가 이제 다른 모든 페이지(`FindTheKey.html`, `OpportunitiesUnlocked.html`, `OpportunitiesUnlocked-01~05.html`)에서 실제로 이 페이지로 연결됨

## Beyond the Door 페이지 (Figma `28:476`)

`BeyondTheDoor.html`/`.css` — 헤더/히어로/배경은 다른 페이지와 동일. 이 페이지는 섹션이 많아서 구조를 정리해두면:

1. **여정 리스트** (`.btd-journey`, Figma `28:1004`): 번호 붙은 단계 5개(오프닝 밋업 → 브랜드 콜라보 → 스페셜 크리에이터 활동 → 오프라인 밋업 → 페어웰), 각 단계마다 위에 구분선 + 왼쪽 텍스트(번호+제목, 설명) + 오른쪽 사진 2장(390×252). 단계 사이에 아래방향 화살표(`assets/icon-go.svg`를 회전 없이 그대로 씀 — 원래 오른쪽 화살표로 쓸 때만 `-90deg` 돌렸던 거라 아래쪽 화살표엔 회전이 필요 없음)
   - `.btd-journey__item`은 `padding-bottom: 30px`(마지막 단계만 `:last-child`로 0), 화살표(`.btd-arrow`)는 `margin: 30px auto 7px` — 전부 Figma 값 그대로. 여정 리스트 섹션이 끝나고 바로 다음에 오는 첫 번째 `.btd-middle`("직접 만나 나누는 시간")은 사용자가 Figma에서 간격을 넓혀서 `margin-top: 300px`로 따로 오버라이드해둠(`.btd-journey + .btd-middle` 선택자). 갤러리 뒤에 오는 두 번째 `.btd-middle`은 기본값 `130px` 그대로이니, 나중에 `.btd-middle` 기본값을 바꿀 땐 이 오버라이드 규칙이 있다는 걸 기억할 것
   - **스크롤 리빌 애니메이션**: 각 단계의 `.btd-journey__row`(텍스트+사진 한 덩어리)가 처음엔 `opacity:0` + 아래로 28px 밀려있다가 뷰포트에 들어오면 나타남 — 아래 갤러리와 같은 `initReveal()` 헬퍼(`BeyondTheDoor.js`) 재사용, stagger 없이 단계별로 한 번에
2. **middle-text**를 두 번 재사용(Figma에 컴포넌트로 정의됨, `.btd-middle` 클래스로 구현): "직접 만나 나누는 시간"과 "함께한 시간에 마음을 담아" — 텍스트만 다르고 스타일은 동일
3. **사진 모자이크 갤러리** (`.btd-gallery`, Figma photo-01~08 + 무명 노드 하나): Figma 절대좌표를 분석해보면 사실 꽤 깔끔한 구조였음 — 1행은 박스 2개(41% + 나머지), 2행은 동일 너비 3열이고 각 열이 내부적으로 박스 2개를 세로로 쌓은 것(가운데 열만 아래쪽이 작은 박스 2개가 가로로 나란한 형태). 세 열의 내부 합산 높이가 전부 580px로 딱 맞아떨어져서, 이 3열 구조로 확신하고 구현함. 실제 렌더링은 `aspect-ratio`로 Figma 비율만 맞추고, 폭은 flex로 반응형 처리(절대 px 좌표 그대로 베끼지 않음)
   - **스크롤 리빌 애니메이션**: `.btd-gallery__photo` 9개가 처음엔 `opacity:0` + 아래로 28px 밀려있다가, `IntersectionObserver`(`BeyondTheDoor.js`)로 각자 뷰포트에 들어오는 순간 `.is-visible` 클래스가 붙으면서 하나씩 나타남. 같은 행에서 동시에 들어오는 것들은 `transition-delay`로 80ms씩 차이를 둬서 순서대로 튀어나오는 느낌을 줌. `entry.isIntersecting` 값으로 `.is-visible`을 매번 토글하기 때문에(처음엔 `unobserve`로 한 번만 재생되게 했다가, 위/아래로 다시 스크롤할 때마다 재생되게 바꿔달라는 요청으로 수정함) 화면 밖으로 나가면 다시 숨겨졌다가 재진입할 때마다 애니메이션이 반복 재생됨
   - `BeyondTheDoor.js`는 `initReveal(selector, { stagger })` 헬퍼 하나로 갤러리(`stagger: 80`)와 여정 리스트(stagger 없음) 둘 다 처리함 — 새 섹션에도 같은 리빌 효과를 넣고 싶으면 이 헬퍼를 그대로 재사용하면 됨
4. **Special Gift 인덱스** (`.btd-gift`, Figma `56:2830`): 3열 — 1열은 "Special Gift" 라벨만, 2열은 항목 1~3(각각 위에 구분선), 3열은 항목 4~5. Figma에서 `<ol><li>`로 표현된 번호 매기기는 실제 `ol/li` 대신 그냥 "1. " 텍스트를 직접 써넣는 방식으로 구현함 (프로젝트 전반에 걸쳐 일관된 패턴 — 카드/리스트류에서 실제 시맨틱 리스트 마크업 대신 텍스트로 번호를 씀)
5. 900px 이하에서 여정 리스트는 세로 스택, 갤러리는 1열로 바뀜 (가운데 열의 "작은 박스 2개" 서브로우는 계속 가로 유지)
6. **폰트 굵기**: `.btd-journey__desc`, `.btd-gift__label`, `.btd-gift__item`이 원래 Figma엔 Pretendard Medium(`font-weight: 500`)으로 돼 있었는데, 실제로 보니 너무 진하게 보인다는 피드백으로 전부 Regular(`400`)로 낮춤. 이 페이지에서 Medium 굵기로 남아있는 텍스트는 이제 없음 (제목류는 SemiBold 600 그대로 유지)

## 트로피 자리 (아직 미착수)

카드 롤링 섹션 아래 "한 사람이 나눈 영감은..." 문구 다음에, Figma상 803×917 크기의 트로피 3D 배치 영역이 있음 (`트로피 3D 배치 예정.` 플레이스홀더 텍스트).

- 사용자가 `.obj`/`.fbx` 3D 파일(오늘의집 최종 트로피)을 한 번 전달해서 Three.js(FBXLoader, CDN 모듈 import) + `<model-viewer>` 대신 커스텀 뷰어로 자동회전 구현까지 완료했었음 (`trophy.js`, `assets/trophy.fbx`)
- 재질 질감(석고 느낌 살리려고 procedural grain bump/roughness map + RoomEnvironment 환경광까지 추가)까지 다듬었지만, 사용자가 최종적으로 "맘에 안 든다"고 해서 **`FindTheKey.html`에서 3D 뷰어를 다시 제거**하고 원래 Figma의 정적 플레이스홀더 박스(`#454545` 배경 + 흰 텍스트)로 되돌림
- `trophy.js`와 `assets/trophy.fbx`는 나중에 다시 시도할 수 있도록 삭제하지 않고 저장소에 남겨둔 상태 (현재 어떤 HTML에서도 로드하지 않음)
- 이어서 작업한다면: `trophy.js`를 다시 `FindTheKey.html`에 `<script type="module">`로 연결하고, 조명/재질을 사용자가 만족할 때까지 다시 튜닝하면 됨. 이전에 시도했다가 별로였던 것: RoomEnvironment 단독 조명(너무 어둡고 드라마틱함), 강한 bumpScale(너무 sparkle함)

## 파일명 변경 이력

원래 `index.html`/`home.html`이었다가, 실제 배포 시 웹서버가 `index.html`을 루트(`/`)로 서빙하는 관례와 헷갈리지 않도록 사용자 요청으로 리네임함:

- `home.html`/`home.css`/`home.js` → `hero-home.html`/`hero-home.css`/`hero-home.js` (열쇠구멍 스크롤 첫 화면)
- `index.html`/`styles.css` → `FindTheKey.html`/`FindTheKey.css` (Find the Key 페이지)

나중에 실제 도메인을 연결할 때는, 그 시점의 첫 화면(현재 `hero-home.html`)을 `index.html`로 다시 바꿔주는 게 자연스러움.

## 알아두면 좋은 것

- Pretendard 폰트는 jsdelivr CDN에서 불러옴 (오프라인이면 폰트 깨짐)
- 이 저장소는 private, GitHub 계정 `sarahkim-bucketplace` / repo `special-creator`
- 다른 Mac에서 이어가려면: `git clone` → `gh auth login` (최초 1회) → 이후 `git pull`만 하면 됨
- **push 권한**: GitHub Fine-grained PAT를 발급할 때 `Contents` 권한을 반드시 **Read and write**로 설정해야 push가 됨 (Read-only로 만들면 clone/pull은 되지만 push는 403으로 막힘 — 실제로 한 번 겪었음). 이미 만들어둔 토큰이 있으면 새로 발급받을 필요 없이 `github.com/settings/tokens?type=beta` → 해당 토큰 클릭 → Repository permissions → Contents를 Read-only에서 Read and write로 **수정**하면 됨 (재발급 아님)
- 로컬 정적 서버(`python3 -m http.server`)를 이 프로젝트 경로(iCloud Drive 하위)에서 Claude Code의 `preview_start` 도구로 띄우면 `PermissionError: [Errno 1] Operation not permitted` (`os.getcwd()`)가 남 — iCloud Drive 경로에 대한 도구 자체의 샌드박스 제약으로 보임. Bash로 직접 `python3 -m http.server 5173 &`로 띄우면 정상 동작하니 그 방식을 쓸 것
- **Claude Code 내장 브라우저 미리보기 패널이 캐시를 심하게 먹음**: 파일을 수정한 뒤 미리보기에서 옛날 버전(심지어 완전히 예전 텍스트/스타일)이 보이는 일이 여러 번 있었음. 이건 실제 회귀(regression)가 아니라 100% 캐시 문제였음 — `curl`로 서버 응답을 직접 찍어보면 항상 최신 파일이 맞았음. 사용자의 실제 Chrome은 항상 정상적으로 보였음. 그러니 미리보기에서 이상해 보이면: 먼저 서버 응답을 직접 확인(`curl localhost:5173/파일명`)하거나, `?v=타임스탬프` 쿼리로 캐시 무효화하거나, `link.href`/`script.src`에 캐시버스터를 붙여서 재확인할 것. 파일이 실제로 잘못됐다고 결론 내리기 전에 캐시부터 의심할 것
