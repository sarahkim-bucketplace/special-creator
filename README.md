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
trophy.js                                      3D 트로피 뷰어 — FindTheKey.html에 연결되어 실제로 동작 중 (아래 "트로피 3D 뷰어" 절 참고)
assets/                                        Figma에서 내려받은 벡터·이미지 애셋 (+ trophy.glb, trophy-3d-texture/)
.claude/launch.json                            로컬 미리보기용 정적 서버 설정 (아래 "알아두면 좋은 것" 참고 — 이 프로젝트 경로에선 안 먹음)
```

헤더 nav 4개 페이지(`Find the Key` / `Opportunities Unlocked` / `Creator Voices` / `Beyond the Door`)가 전부 만들어져서 서로 실제 `href`로 연결되어 있음. `Open Your Door` CTA도 이제 실제 지원 페이지(`https://ohou.se/competitions/1155`, 새 탭)로 연결됨 — Creator Voices 하단의 "스페셜 크리에이터 지원하기" 버튼과 동일한 링크.

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
- **CTA 버튼 "Open Your Door"** (Figma node `48:952`): 다크 필(pill) 버튼, `.header__cta` 클래스. `https://ohou.se/competitions/1155`로 연결됨(`target="_blank" rel="noopener"`) — 이 헤더를 쓰는 9개 페이지 전부 동일
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
  - `align-items: flex-start`(상단 정렬) — 실제 콘텐츠가 들어가면서 카드마다 제목이 1줄/2줄로 길이가 달라지자(예: "93 CUPS, 93 STORIES" 2줄 vs "스토리마켓" 1줄) 원래 쓰던 `flex-end`(하단 정렬) 때문에 썸네일 상단이 카드마다 들쭉날쭉해 보이는 문제가 생겨서 `flex-start`로 바꿈 (placeholder 시절엔 제목이 전부 "Creator Network"로 통일돼 있어서 문제가 안 보였을 뿐)
  - 다만 hover로 커질 때는 원래처럼 **위로** 자라야 한다는 요청이 있어서, `.ou-card:hover .ou-card__photo`에 `height` 증가분만큼 `margin-top`을 음수로 줌(데스크톱 430→520px 차이 90px → `margin-top: -90px`, 900px 이하 296→358px 차이 62px → `margin-top: -62px`). 아래쪽 끝은 그대로 고정된 채 위쪽만 위로 자라나서, 쉬는 상태의 상단 정렬은 유지하면서 hover 확대 방향은 예전 그대로 재현함. 만약 hover 크기 값(430/520, 296/358)이 나중에 또 바뀌면 이 margin-top 값도 그 차이만큼 다시 계산해서 맞춰야 함
  - 실제 사진으로 확인해보니 위로 자란 카드가 히어로 텍스트 쪽 여백을 너무 파고들어 붕 떠 보인다는 피드백이 있어서 여백을 늘렸는데(처음엔 `margin-top: 130px → 220px`로 시도), **1680px 미만 뷰포트**(`.ou-contents`가 드래그 스크롤 스트립으로 바뀌며 `overflow-x: auto`가 걸리는 구간 — 실제 데스크톱 창 대부분이 여기 해당)에서는 `overflow-x: auto`가 스펙상 `overflow-y`도 자동으로 `auto`가 되게 만들어서, margin으로 박스 밖으로 삐져나온 부분은 그대로 잘려버림. 그래서 최종적으로 `margin-top: 130px`(원래 값)는 유지하고 `padding-top: 90px`(hover 성장폭만큼)를 추가해서, 자라난 부분이 margin이 아니라 박스 **내부** 여백을 쓰도록 바꿈 — 이러면 overflow가 클리핑되는 구간에서도 안 잘리고 그대로 보임. 1680px 이상(`overflow` 없음)에서도 결과적으로 총 간격(130+90=220px)은 동일하게 유지됨. `@media (max-width: 1680px)` 블록의 `.ou-contents padding` 단축 선언(`padding: 0 36px 8px` → `padding: 90px 36px 8px`)도 이 상단 패딩을 안 지우도록 같이 맞춰야 함
  - 각 카드 제목 옆에 `icon-go` 화살표(18×18, `rotate(-90deg)`로 오른쪽을 가리키게 함)
  - 전체 폭이 1618px로 `.page`의 1280px보다 넓음. **1680px 이상** 뷰포트에서는 `.rolling`과 같은 방식(`left: 50%` + 음수 `margin-left`)으로 breakout하고 스크롤 없이 중앙 정렬됨. **1680px 미만**에서는 100vw 폭의 스크롤 가능한 스트립으로 전환됨(`overflow-x: auto`, 스크롤바는 숨김) — 트랙패드는 그대로 스와이프되고, `OpportunitiesUnlocked.js`가 마우스 클릭+드래그 스크롤도 지원함 (드래그 중엔 커서가 grab→grabbing)
  - 카드 5개 전부 `<a>` 태그로 바뀌어서 클릭하면 아래 상세 페이지로 이동함
- 헤더 nav는 `FindTheKey.html` ↔ `OpportunitiesUnlocked.html` 양방향으로 실제 `href` 연결되어 있음

## Opportunities Unlocked 상세 페이지 (Figma `0:771`)

목록 페이지의 카드를 클릭하면 이동하는 페이지. **Figma 프레임 번호와 파일 번호를 맞춤**: `Frame-01` → `OpportunitiesUnlocked-01.html`, `Frame-02` → `-02.html`, ... `Frame-05` → `-05.html`. 5개 전부 실제 콘텐츠(텍스트+사진)로 채워진 상태 — 더 이상 placeholder 없음.

레이아웃 (좌우 2분할, 다른 페이지들과 달리 `.page` max-width 없이 풀블리드):
- 왼쪽 **`Photo-box`**: `.detail__photo-slide` 안에 `<img class="detail__photo-img">`(`object-fit: cover`)를 넣는 구조. 좌우 화살표(`before-icon`/`after-icon`, 42px)를 누르면 슬라이드가 순환(맨 끝에서 반대쪽으로 넘어감)하며 전환됨 — `detail-photo-carousel.js`(5개 상세 페이지가 공용으로 씀, 유일하게 페이지 간 공유하는 JS 파일)가 슬라이드 개수를 `track.children`으로 동적으로 읽어서 케이스마다 장수가 달라도(1~6장) 코드 수정 없이 그대로 동작함. 이 화살표는 사진만 넘기고, **페이지 이동(이전/다음 사례)은 하단 Navigator가 따로 담당**
  - **텍스트 라벨이 있는 사진**(예: 케이스 02의 안내도 이미지)은 `object-fit: cover`로 자르면 가장자리 텍스트가 잘림 — 그럴 땐 `.detail__photo-img--contain` 클래스를 추가로 붙여서 `object-fit: contain` + 배경색(이미지 실제 배경톤에 맞춘 값)으로 전체가 보이게 처리 (`OpportunitiesUnlocked-02.css` 참고)
- 오른쪽 텍스트 컬럼: 카테고리(`#5d5d5d`, 14px) + 타이틀(8px 간격) → 35px 간격 → 본문. 위쪽에 구분선(`border-top`)
- 하단 **`Navigator`**: 구분선이 텍스트 **아래**에 있음 (위가 아님 — 처음에 위로 잘못 넣었다가 고침). 전체 wrapper는 `opacity` 없음, 대신 "이전/다음" 링크 각각에 `opacity: 0.6`. 두 링크는 `gap: 300px`로 중앙에 모여있음 (900px 이하에서는 `space-between` + 24px로 전환)
  - 링크는 Figma 원래 문구 대신 **01~05를 순환하는 실제 페이지 이동**으로 연결해둠: `01 ← 02 ← 03 ← 04 ← 05`, `01 → 02 → 03 → 04 → 05 → (다시) 01`. **예외는 딱 하나** — `01`의 "이전"만 목록 페이지(`OpportunitiesUnlocked.html`)로 감 (그 앞에 다른 상세 페이지가 없어서). `05`의 "다음"은 `01`로 순환(wrap)됨
  - Navigator 링크 텍스트는 아직 "이전 사례"/"다음 사례" 그대로임 — 각 사례 제목으로 바꾸면 더 자연스러워지지만 아직 요청받지 않아서 보류

### 5개 케이스와 애셋 폴더

| Frame | 페이지 | 폴더 | 비고 |
|---|---|---|---|
| 01 | 오늘의집 × 이도 〈93 CUPS, 93 STORIES〉 전시 | `assets/Opportunities-Unlocked/01-93 CUPS, 93 STORIES/`(폴더명에 공백·쉼표 있어 경로에 `%20`/`%2C` 인코딩 필요) | 사진 6장 |
| 02 | 오늘의집 × 에어비앤비 공간 멘토링 프로그램 | `assets/Opportunities-Unlocked/02-space-airbnb/` | 사진 4장, 3번 슬라이드만 `--contain`(라벨 있는 평면도 이미지) |
| 03 | 오늘의집 북촌 플리마켓 〈스토리마켓〉 | `assets/Opportunities-Unlocked/03-space-storymarket/` | 사진 5장 |
| 04 | 오늘의집 북촌 〈크리에이터 아뜰리에〉 | `assets/Opportunities-Unlocked/04-space-atelier/` | 사진 2장 |
| 05 | 오늘의집 유튜브 오리지널 시리즈 〈취향수집가〉 | `assets/Opportunities-Unlocked/05-Branded-Taste/` | 사진 1장 — 사용자가 나중에 실제 이미지로 교체 예정이라고 밝힘(임시) |

각 폴더는 `thumb.*`(목록 페이지 카드용) + `image*.*`(상세 페이지 캐러셀용, 장수는 케이스마다 다름) 구성. 목록 페이지 카드 5개도 전부 실제 타이틀/서브텍스트로 채워짐.
- 900px 이하에서는 사진이 위, 텍스트가 아래로 세로 스택됨

## Creator Voices 페이지 (Figma `0:519`)

`CreatorVoices.html`/`.css` — 헤더/히어로/배경 시스템은 다른 페이지와 동일하게 재사용. `FindTheKey.css`의 공용 블록(리셋~`.hero__subtitle`까지)을 그대로 복사해서 시작함.

- **`CV-Contents-01`/`02`** (Figma `48:1057`/`48:1112`): 사진(495×340) + 텍스트가 좌우로 나란히 배치되는 행 4개, 홀수 행은 사진이 왼쪽, 짝수 행은 사진이 오른쪽 — `.cv-row` / `.cv-row--reverse`(DOM 순서는 항상 "사진, 텍스트"로 동일, `flex-direction: row-reverse`로만 시각적으로 뒤집음)
  - 4개 행 전부 실제 인터뷰 콘텐츠로 채워짐: 1행 MOPO 님("기록이 열어준 새로운 기회"), 2행 랴료하우스 님("좋아하는 일을 잘하고 있다는 기쁨"), 3행 cooohome 님("내 취향을 믿게 된 시간"), 4행 dear_myhome 님("일상이 된 기록, 기록이 된 집") — 더 이상 4행이 동일한 placeholder가 아님. 각 행의 사진(`.cv-row__photo`)은 아직 회색 박스 그대로임
  - **행 사이 간격은 비대칭**: 사용자가 Figma에서 조정한 뒤로, 일반 행(사진 왼쪽) 다음엔 `margin-bottom: 220px`, 반전 행(사진 오른쪽) 다음엔 `margin-bottom: 267px`(+47px 더 넓음) — 절대좌표로 역산해서 확인한 값. `.hero`도 첫 행 앞에 동일하게 `margin-bottom: 220px`을 가짐. 예전엔 모든 행이 `padding: 90px 0`으로 균일했는데, 지금은 padding 대신 타입별 margin-bottom 방식으로 바뀜 — `.cv-outro`엔 더 이상 자체 margin-top이 없음(마지막 행의 margin-bottom이 그 간격까지 이미 포함)
  - 900px 이하에서는 사진이 위, 텍스트가 아래로 세로 스택, 간격도 균일하게 `margin-bottom: 48px`로 축소
- 하단 **outro**(Figma `55:2735` "sub-text") + **CTA 버튼** "스페셜 크리에이터 지원하기"(`#464646` 배경, 56px 높이, `rounded-52`) — `https://ohou.se/competitions/1155`(새 탭)로 연결됨
- 헤더 nav에서 `Creator Voices` 링크가 이제 다른 모든 페이지(`FindTheKey.html`, `OpportunitiesUnlocked.html`, `OpportunitiesUnlocked-01~05.html`)에서 실제로 이 페이지로 연결됨

## Beyond the Door 페이지 (Figma `28:476`)

`BeyondTheDoor.html`/`.css` — 헤더/히어로/배경은 다른 페이지와 동일. 이 페이지는 섹션이 많아서 구조를 정리해두면:

1. **여정 리스트** (`.btd-journey`, Figma `28:1004`): 번호 붙은 단계 5개(오프닝 밋업 → 브랜드 콜라보 → 스페셜 크리에이터 활동 → 오프라인 밋업 → 페어웰), 각 단계마다 위에 구분선 + 왼쪽 텍스트(번호+제목, 설명) + 오른쪽 사진 2장(390×252). 단계 사이에 아래방향 화살표(`assets/icon-go.svg`를 회전 없이 그대로 씀 — 원래 오른쪽 화살표로 쓸 때만 `-90deg` 돌렸던 거라 아래쪽 화살표엔 회전이 필요 없음)
   - `.btd-journey__item`은 `padding-bottom: 30px`(마지막 단계만 `:last-child`로 0), 화살표(`.btd-arrow`)는 `margin: 30px auto 7px` — 전부 Figma 값 그대로
   - **스크롤 리빌 애니메이션**: 각 단계의 `.btd-journey__row`(텍스트+사진 한 덩어리)가 처음엔 `opacity:0` + 아래로 28px 밀려있다가 뷰포트에 들어오면 나타남 — 아래 갤러리와 같은 `initReveal()` 헬퍼(`BeyondTheDoor.js`) 재사용, stagger 없이 단계별로 한 번에
   - **사진 (`assets/Beyond-the-Door/journey/`, 폴더명 소문자 `journey` — 대문자 `Journey`로 잘못 참조했다가 고침. macOS는 대소문자 구분을 안 해서 로컬에선 안 걸렸지만 대소문자 구분하는 배포 환경(GitHub Pages 등)에선 404 났을 것)**: 1~5단계 전부 채워짐(`02-01.png`/`02-02.jpg`, `03-01.jpg`/`03-02.jpg`, `04-01.jpg`/`04-02.jpg`, `05-1.jpg`/`05-2.jpg`). 1단계만 아직 회색 박스. 파일명 규칙이 살짝 다름(`05-1` vs `02-01`) — 그대로 씀. 각 `.btd-journey__photo`엔 `background-image`(`background-size:cover`)로 직접 넣음
   - **hover 확대(원본 이미지 플로팅)는 시도했다가 뺌**: 사진 박스가 가로형(390:252)인데 실제 사진 대부분이 세로형이라 `object-fit: cover`로 심하게 잘려서, hover 시 원본 비율로 뜨는 미리보기를 별도 레이어(`.btd-photo-float`)로 한 번 구현했었음(갤러리에도 확장해봤다가 "어색하다"는 피드백으로 갤러리에서 먼저 뺐고, 이어서 "저 이미지 플로팅 효과는 다 없애줘" 요청으로 여정 리스트에서도 완전히 제거함). 지금은 갤러리와 마찬가지로 그냥 잘린 채 보이는 `background-image` 썸네일만 있음. **다시 필요해지면**: 같은 `<img>` 하나로 썸네일과 플로팅 미리보기를 둘 다 하려고 하면 hover로 이동시키는 순간 원래 자리의 썸네일이 통째로 사라지는 버그가 남(실제로 한 번 겪음) — 반드시 두 개의 별도 레이어(배경 썸네일 + 플로팅용 `<img>`, `position:absolute` + `opacity:0→1`)로 나눠야 함
2. **middle-text**를 두 번 재사용(Figma에 컴포넌트로 정의됨, `.btd-middle` 클래스로 구현): "직접 만나 나누는 시간"과 "함께한 시간에 마음을 담아" — 텍스트만 다르고 스타일은 동일. `margin-top: 200px`(여정 리스트→첫 번째 middle-text, 갤러리→두 번째 middle-text 둘 다 동일값) — 원래 첫 번째만 Figma 기준 `300px`로 오버라이드해뒀었는데, 두 간격이 서로 다르게 느껴진다는 피드백으로 `200px` 하나로 통일하고 오버라이드 규칙(`.btd-journey + .btd-middle`)은 제거함
3. **사진 모자이크 갤러리** (`.btd-gallery`, Figma photo-01~08 + 무명 노드 하나): Figma 절대좌표를 분석해보면 사실 꽤 깔끔한 구조였음 — 1행은 박스 2개(41% + 나머지), 2행은 동일 너비 3열이고 각 열이 내부적으로 박스 2개를 세로로 쌓은 것(가운데 열만 아래쪽이 작은 박스 2개가 가로로 나란한 형태). 세 열의 내부 합산 높이가 전부 580px로 딱 맞아떨어져서, 이 3열 구조로 확신하고 구현함. 실제 렌더링은 `aspect-ratio`로 Figma 비율만 맞추고, 폭은 flex로 반응형 처리(절대 px 좌표 그대로 베끼지 않음)
   - **스크롤 리빌 애니메이션**: `.btd-gallery__photo` 9개가 처음엔 `opacity:0` + 아래로 28px 밀려있다가, `IntersectionObserver`(`BeyondTheDoor.js`)로 각자 뷰포트에 들어오는 순간 `.is-visible` 클래스가 붙으면서 하나씩 나타남. 같은 행에서 동시에 들어오는 것들은 `transition-delay`로 80ms씩 차이를 둬서 순서대로 튀어나오는 느낌을 줌. `entry.isIntersecting` 값으로 `.is-visible`을 매번 토글하기 때문에(처음엔 `unobserve`로 한 번만 재생되게 했다가, 위/아래로 다시 스크롤할 때마다 재생되게 바꿔달라는 요청으로 수정함) 화면 밖으로 나가면 다시 숨겨졌다가 재진입할 때마다 애니메이션이 반복 재생됨
   - `BeyondTheDoor.js`는 `initReveal(selector, { stagger })` 헬퍼 하나로 갤러리(`stagger: 80`)와 여정 리스트(stagger 없음) 둘 다 처리함 — 새 섹션에도 같은 리빌 효과를 넣고 싶으면 이 헬퍼를 그대로 재사용하면 됨
   - **사진 9장 전부 채워짐** (`assets/Beyond-the-Door/meetup/image-1~9.jpg`, DOM 순서대로 1~9번 매칭 — `background-image` + `background-size:cover`로 넣음). hover 확대(원본 플로팅) 기능은 시도했다가 최종적으로 안 씀 — 여정 리스트 절 참고
4. **Special Gift 인덱스** (`.btd-gift`, Figma `56:2830`): 3열 — 1열은 "Special Gift" 라벨만, 2열은 항목 1~3(각각 위에 구분선), 3열은 항목 4~5. Figma에서 `<ol><li>`로 표현된 번호 매기기는 실제 `ol/li` 대신 그냥 "1. " 텍스트를 직접 써넣는 방식으로 구현함 (프로젝트 전반에 걸쳐 일관된 패턴 — 카드/리스트류에서 실제 시맨틱 리스트 마크업 대신 텍스트로 번호를 씀)
5. 900px 이하에서 여정 리스트는 세로 스택, 갤러리는 1열로 바뀜 (가운데 열의 "작은 박스 2개" 서브로우는 계속 가로 유지)
6. **폰트 굵기**: `.btd-journey__desc`, `.btd-gift__label`, `.btd-gift__item`이 원래 Figma엔 Pretendard Medium(`font-weight: 500`)으로 돼 있었는데, 실제로 보니 너무 진하게 보인다는 피드백으로 전부 Regular(`400`)로 낮춤. 이 페이지에서 Medium 굵기로 남아있는 텍스트는 이제 없음 (제목류는 SemiBold 600 그대로 유지)

## 트로피 3D 뷰어 (`trophy.js`, `FindTheKey.html`에 연결되어 실제로 동작 중)

카드 롤링 섹션 아래 "한 사람이 나눈 영감은..." 문구 다음, `.trophy-placeholder` 안에 Three.js 커스텀 뷰어가 떠 있음. (예전 README에는 "임시 사진 placeholder" 상태로 적혀 있었는데 그건 오래된 내용 — 지금은 사진이 아니라 아래 3D 뷰어가 최종.)

- **모델**: `assets/trophy.glb` (GLTFLoader로 로드). 예전에 시도했던 `.obj`/`.fbx`는 폐기하고 `.glb`로 정착함
- **텍스처**: `assets/trophy-3d-texture/trophy-texture-seamless.png`를 색상(map)·러프니스(roughnessMap)·범프(bumpMap) 공용으로 재사용, `trophy-texture-normal.png`는 그 이미지의 그레이스케일 높이를 Sobel로 뽑아 만든 노멀맵. **`trophy-texture-org.png`(사진 원본)는 절대 덮어쓰지 말 것** — 예전에 한 번 실수로 덮어써서 사용자가 복구한 적 있음. seamless/normal 파일은 파생본이라 계속 재생성/덮어써도 되는 파일들(이번 세션에도 대비/노멀맵 강도를 여러 번 다시 구웠음)
- **조명**: HemisphereLight(약한 ambient) + keyLight/embossLight(각인 글자에 raking light로 음영을 살림) + rimLight(옅은 블루 톤 엣지광)
- **카메라 모션**: 처음엔 `OrbitControls` 자동회전이었는데 사용자가 "정신 사납다"고 해서 제거함. 지금은 커스텀 스피어컬 카메라로, 정지 각도(`baseTheta`/`basePhi`)에서 시작해 마우스가 `#trophyViewer` 위에 있을 때 커서 위치에 따라 `targetTheta`/`targetPhi`가 바뀌고 매 프레임 lerp로 따라감 (`pointerleave` 시 정지 각도로 복귀)

### ⚠️ 다음에 이어서 볼 것: 커서 추적 모션이 아직 사용자 의도와 안 맞을 수 있음

사용자가 "왼쪽으로 마우스 가면 트로피도 왼쪽 보고, 오른쪽 가면 오른쪽", "확확 시원하게 움직이게" 같은 구체적 피드백을 여러 번 줬는데, **이 세션 내내 브라우저 인터랙션 도구(`mcp__claude-in-chrome__*`, Claude in Chrome 익스텐션 연결)가 계속 끊긴 상태**였음 — Claude가 실제 화면을 보거나 스크린샷을 찍을 방법이 전혀 없어서, 매번 사용자의 텍스트 피드백만 보고 파라미터(회전 범위/속도)를 추측으로 계속 키우기만 했음. **방향·범위·속도가 실제로 맞는지 한 번도 시각적으로 검증하지 못한 상태로 세션이 끝남.**

- 마지막으로 커밋된 파라미터: `baseTheta = -18°`, `maxThetaSwing = 55°`, `maxPhiSwing = 18°`, 프레임당 lerp factor `0.3` (`trophy.js`)
- 방향(마우스 오른쪽 → 트로피가 오른쪽을 보는지)은 손계산(카메라가 origin을 lookAt하는 상태에서 theta 증가 시 화면상 투영이 어떻게 움직이는지 벡터로 유도)으로 한 번 검증해서 "이론상 맞다"고 결론 냈지만, 실제 렌더링으로 확인된 적은 없어서 신뢰도는 낮음
- **다음에 이어서 작업할 때**: 먼저 브라우저 도구(`mcp__claude-in-chrome__tabs_context_mcp` 등)가 살아있는지 확인할 것. 살아있으면 실제로 마우스를 좌/중/우로 움직여보며 스크린샷으로 확인. 안 살아있으면 사용자에게 "마우스를 트로피 좌/중/우에 두고 스크린샷 3장"을 요청해서 그걸 보고 판단할 것 (이미 한 번 제안해뒀음) — 절대 텍스트 피드백만으로 파라미터를 또 추측해서 키우지 말 것, 이번 세션에 그렇게 해서 사용자가 답답해했음

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
