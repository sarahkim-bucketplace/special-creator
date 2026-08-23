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
trophy.js                                      3D 트로피 뷰어 (현재 어떤 HTML에도 연결 안 됨, 보류 중)
assets/                                        Figma에서 내려받은 벡터·이미지 애셋 (+ trophy.fbx)
.claude/launch.json                            로컬 미리보기용 정적 서버 설정 (아래 "알아두면 좋은 것" 참고 — 이 프로젝트 경로에선 안 먹음)
```

**아직 안 만든 페이지**: `Beyond the Door` — 헤더 nav에 링크는 있지만 `href="#"`로 비워둔 상태.

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

## `finethekey-image-rolling` (Figma node `0:147`)

`FindTheKey.html`의 카드 섹션은 Figma에서 4개→5개 이미지로 늘어나면서 `finethekey-image-rolling`으로 리네임됨 — 화면 전체 너비로 꽉 차게(edge-to-edge) 배치하고 **계속 자연스럽게 롤링**되어야 한다는 요구사항이 있었음.

- 구현: `.rolling__track`에 원본 5개 + 복제 5개(총 10개) 아이템을 넣고 `translateX(0) → translateX(-50%)` 무한 애니메이션(`rolling-scroll`, 32s linear infinite). 두 세트가 완전히 동일하면 `-50%` 지점에서 이음매 없이 루프됨 — 아이템 개수/gap이 바뀌어도 항상 정확히 맞음
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
  - `align-items: flex-end`(하단 정렬)라서 커진 카드는 위로만 자라남
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
  - 900px 이하에서는 사진이 위, 텍스트가 아래로 세로 스택
- 하단 **outro**(Figma `55:2735` "sub-text") + **CTA 버튼** "스페셜 크리에이터 지원하기"(`#464646` 배경, 56px 높이, `rounded-52`) — 아직 실제 지원 폼/링크가 없어서 `href="#"`
- 헤더 nav에서 `Creator Voices` 링크가 이제 다른 모든 페이지(`FindTheKey.html`, `OpportunitiesUnlocked.html`, `OpportunitiesUnlocked-01~05.html`)에서 실제로 이 페이지로 연결됨

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
