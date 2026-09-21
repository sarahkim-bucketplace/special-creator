# 스페셜 크리에이터 웹페이지

오늘의집 "스페셜 크리에이터" 소개 페이지. Figma 디자인을 기반으로 정적 HTML/CSS/JS로 제작 중. 빌드 도구 없음.

다른 컴퓨터에서 Claude(또는 사람)가 이어서 작업할 때 필요한 배경 설명을 정리해둔 문서입니다.
(git으로는 코드만 넘어가고, 대화 맥락은 넘어가지 않아서 남겨둡니다.)

> **먼저 읽을 것**: 사이트의 실제 메인은 **`FindTheKey.html` 한 장짜리 통합 스크롤 페이지**입니다 (About → Opportunities → Programs → Voices). 예전에 섹션별로 따로 만들었던 페이지들(`OpportunitiesUnlocked.html` 등)은 남아있지만 더 이상 메인이 아니고, 새 디자인 수정은 전부 `FindTheKey.html`/`FindTheKey.css`에 들어갑니다. `index.html`은 `FindTheKey.html`로 리다이렉트만 합니다.

## 파일 구조

```
index.html                                     FindTheKey.html로 리다이렉트
FindTheKey.html / FindTheKey.css               ★ 메인 통합 페이지 (섹션 4개, CSS 한 파일에 전부)
hero-home.html / .css / .js                    열쇠구멍 스크롤 첫 화면 (헤더 로고가 여기로 연결)
trophy.js                                      3D 트로피 뷰어 (Three.js, type=module)
assets/                                        이미지·SVG·trophy.glb·trophy-3d-texture/ 등

── 통합 페이지가 쓰는 JS (FindTheKey.html 하단에 순서대로 로드) ──
header-menu.js                                 모바일 햄버거 메뉴 (900px 이하)
scroll-reveal.js                               initReveal(selector, {stagger}) — 등장 애니메이션 공용 헬퍼
find-the-key.js                                About 섹션 reveal 연결
about-hero-roll.js                             About 히어로 사진 pin + 롤링 + 풀스크린 확대/디졸브
about-badge-pause.js                           배지(SC 로고) 앞 멈춤 지점
about-key-photo-grow.js / about-key-photo-pause.js   키 사진 프레임: 중앙 정지 → 확대 → 디졸브
insight-after-trophy-pause.js / trophy-pause.js      마지막 인용문·트로피 멈춤 지점
OpportunitiesUnlocked.js                       OU 카드 행 마우스 드래그 스크롤
stats.js / stats-pause.js                      통계 숫자 카운트업 / 문구+통계 숫자 블록의 멈춤 지점(세로 가운데)
BeyondTheDoor.js                               여정 리스트 reveal (+ 독립 페이지용 갤러리 reveal)
btd-gallery-stack.js                           "직접 만나 나누는 시간" 코버플로 갤러리
btd-gift-pause.js                              선물 섹션 진입 멈춤 지점
faq-toggle.js                                  FAQ 클릭 토글
detail-photo-carousel.js                       OU 상세(팝업 안) 사진 슬라이드
ou-modal.js                                    OU 카드 클릭 → 상세 페이지를 팝업으로 띄움
scroll-spy.js                                  스크롤 위치에 따라 헤더 nav on/off + 아래 화살표(down-hint)

── 아직 남아있는 독립 페이지 (메인에선 안 쓰임) ──
OpportunitiesUnlocked.html / .css / .js        OU 목록 (Figma 0:236)
OpportunitiesUnlocked-01~05.html / .css        OU 사례 상세 — ★ ou-modal.js가 이 파일을 fetch해서 팝업에 넣기 때문에 삭제하면 안 됨
CreatorVoices.html / .css                      Creator Voices 독립판 (Figma 0:519)
BeyondTheDoor.html / .css / .js                Beyond the Door 독립판 (Figma 28:476)
BeyondTheDoor-gift1~4.html / BeyondTheDoor-gift.css / gift-detail-reveal.js   선물 4종 상세 페이지 (메인의 "더 알아보기"가 연결) — 실제로 쓰이는 페이지
```

독립 페이지들(`OpportunitiesUnlocked.html`, `CreatorVoices.html`, `BeyondTheDoor.html`)은 통합 페이지와 **간격/레이아웃이 다를 수 있음** — 폰트 크기·색은 같이 맞춰뒀지만 간격 정리 등은 통합 페이지에만 적용됨. 사용 여부를 정해서 지우거나 유지할 것 (남은 할 일 참고).

## 로컬에서 실행하기

`file://`로 열면 일부 리소스가 깨질 수 있어서 정적 서버를 띄워야 합니다.

```bash
python3 -m http.server 5173
```

`http://localhost:5173/FindTheKey.html`로 접속. (iCloud Drive 경로에서는 Claude Code의 `preview_start` dev-server 모드가 PermissionError를 내니 Bash로 직접 띄울 것 — "알아두면 좋은 것" 참고.)

## Figma 소스

- 메인 디자인 파일 키: `NoZZ6mYgg5AZpr5MxwhzOw`
- Figma **Sites** 프로젝트(`ugSi251WBhiYVSZRgtzJxR`)는 계정에 edit 권한이 없어 접근 불가 → 위 디자인 파일로 작업.
- `get_metadata`로 `home` 페이지(`0:135`)를 통으로 읽으면 응답이 너무 커서 MCP 파싱 에러가 남 → 필요한 하위 노드마다 사용자가 "Copy link to selection" 링크를 주는 방식으로 진행. 같은 문제가 나면 그대로 쓰면 됨.

### 사용한 주요 노드 ID

| 노드 | 용도 |
|---|---|
| `0:137` "find-the-key-main" | FindTheKey 원본 히어로 프레임 |
| `233:1182` | About 섹션 재디자인 (스크랩북) |
| `1:252` / `0:660` | 열쇠구멍 오버레이 (hero-home) |
| `1:961` / `1:975` / `1:982` / `24:56` | hero-home 로고 / 열쇠 사진 / "Click me" 커서 / 다운스크롤 아이콘 |
| `48:271`/`48:284`/`48:297` "header" | 공용 헤더 컴포넌트 |
| `0:236`, `55:2048`/`55:2049` | OU 목록 프레임 / 카드 행(on/off) |
| `0:771` | OU 상세 프레임 |
| `174:568` | 브랜드 로고 롤링 |
| `182:739` | 통계 섹션 |
| `28:476`, `28:1004`, `62:610` | Beyond the Door / 여정 리스트 / 여정 단계 간격 |
| `56:2822`/`56:2823`, `56:2830`, `202:530`/`203:623` | middle-text / 선물 인덱스 / 선물 토글(이후 카드 그리드로 재설계) |
| `0:519`, `48:1057`/`48:1112`, `55:2735`, `206:711` | Creator Voices / 인터뷰 행 / 아웃트로 / FAQ |
| `54:1435` | 배경 그라데이션 블롭 레퍼런스 |

## 디자인 규칙 (통합 페이지 기준 — 새로 만들 때 반드시 지킬 것)

폰트·색·간격을 일괄 정리했음. 새 요소를 추가할 때 임의 값을 쓰지 말고 아래 값만 쓸 것. 아래 표는 데스크톱 기준이고, **모바일(≤900px) 규칙은 이 절 맨 아래 "모바일" 참고**.

### 폰트 사이즈 5단계 (+예외)

| 단계 | 크기 | 자간 | 쓰이는 곳 |
|---|---|---|---|
| ① Display | 38px | -0.19px | About 오프닝·롤링 직후 헤딩·히어로 캡션, 섹션 히어로 타이틀 |
| ② Title | 30px | -0.15px | About 일반 헤딩·인용문(`.insight`)·키 사진 문구, `.btd-middle__title`(현재 통합 페이지에선 안 쓰임 — 독립 페이지용), FAQ 타이틀 |
| ③ Subtitle | 22px | -0.11px | 통계 라벨, 여정 번호, 선물 카드 제목, CV 행 제목, OU 상세 제목 |
| ④ Body | 16px | -0.08px | 본문 전반, 히어로 서브타이틀, FAQ 질문·답변, 버튼("더 알아보기", 지원하기) |
| ⑤ Caption | 14px | -0.07px | 크레딧, OU 카드 부제, 저자명, 헤더 링크·Apply |

**예외**: 통계 숫자 69px / 단위 37px, 모달 닫기 ×(24px). 자간은 크기 × -0.5%.

### 이미지 박스 모서리 (border-radius)

- 사진 박스는 **5px** 하나로 통일: 여정 롤링 사진(`.btd-journey__rolling-photo`), 갤러리(`.btd-gallery__stack-photo`/`-inner`), 선물 카드 썸네일(`.btd-gift__stack-photo`), CV 인터뷰 사진(`.cv-row__photo`), OU 카드 썸네일(`.ou-card__photo`), 선물 상세 그리드(`.gift-detail__item`). 독립 페이지의 같은 박스에도 동일 적용
- 예외: About 사진·키 사진은 **20px**(원래 디자인), 로고·아이콘·브랜드 로고월은 사진 박스가 아니라 0, OU 상세 팝업의 왼쪽 사진(`.detail__photo`)은 팝업 가장자리에 붙는 패널이라 0. 새 사진 박스를 만들 땐 5px을 넣을 것

### 웨이트 3가지

Regular **400**(본문) / Medium **500**(인용문·About 일반 헤딩·라벨·크레딧) / Semibold **600**(38px 헤딩·타이틀류·번호). `strong` 강조는 600 (700은 쓰지 않음).

### 글자색

- 기본 글자: **`#2d2828`** 하나로 통일. **순수 검정 `#000000`은 글자에 쓰지 않음** (구분선 `border`/배경에는 남아있음)
- 보조 회색: **`#7b7b7b`** 하나 (헤더 비활성 메뉴, OU 카드 부제, CV 저자명, FAQ 답변 등)
- 흰색 `#fff`(사진 위 캡션·버튼 글자), 크레딧 `#dddddd`

### 버튼 색

CTA 필 버튼은 전부 **`#464646`** + 흰 글자: 헤더 Apply(`.header__cta`), 선물 카드 "더 알아보기"(`.btd-gift__more`), 스페셜 크리에이터 지원하기(`.cv-apply`). (예전 `#909182`는 폐기)

### 간격 (About 제외, 데스크톱)

- **섹션 사이 340px**: 트로피→OU, OU 카드→로고월, 통계→BTD, 여정→"직접 만나 나누는 시간", 선물→CV
- **메인 타이틀(히어로) → 콘텐츠 220px**: OU 카드(박스 130 + hover 성장 여유 padding 90), BTD 여정 리스트, CV 첫 행
- **서브타이틀 → 콘텐츠 130px**: `.btd-middle` 블록(직접 만나는 시간 갤러리 위, 함께한 시간 선물 위), FAQ. **`.btd-middle`의 타이틀은 지웠고 본문 한 줄이 서브타이틀** — 세 블록(통계 위·갤러리 위·선물 위) 모두 **가운데 정렬 28px/500**(폰트 5단계 밖의 의도적 예외, 요청값). 통계 위 블록만 문구→숫자 **150px**. 선물 카드만 예외로 카드 안쪽 rule이 문구 아래 110px에 오게 함(`.btd-gift { margin-top: 62px }` = 130 - 카드 padding 48 - 사용자 요청 20)
- **의도적 예외**: 로고월→통계 문구 **250px**(문구+숫자 블록을 세로 가운데에서 멈추게 하는 위치와 화면 안 배치를 위해 넓힌 값), 갤러리→선물 문구 **600px**(마지막 사진이 완전히 fade된 뒤에 나와야 해서). 아래 화살표(`.down-hint`)는 `bottom: 24px`(원래 40px — 통계 블록이 화살표에 안 가려지게 낮춤)
- About 파트 내부 간격(120/150/230/135/140/30vh/230/32vh 등)은 스크롤 연출·멈춤 위치와 얽혀 있어서 통일하지 않음 — 건드릴 땐 pause 스크립트 동작을 같이 확인

### 모바일 (≤900px 하나로 통일, `FindTheKey.css` 맨 끝의 마지막 `@media` 블록)

- **폰트 5단계 26 / 22 / 18 / 15 / 13**: ① 26 = About 오프닝·롤링 헤딩·캡션·섹션 히어로 타이틀 ② 22 = About 일반 헤딩·인용문·키 사진 문구·서브타이틀·FAQ 타이틀 ③ 18 = 통계 라벨·여정 번호·선물 제목·CV 행 제목 ④ 15 = 본문·헤더 메뉴/Apply·버튼·FAQ ⑤ 13 = 크레딧·카드 부제·저자명. 예외: 통계 숫자 34/36px, 모달 닫기 ×. 웨이트·색은 데스크톱과 동일
- **간격**: 섹션 사이 120 / 메인 타이틀→콘텐츠 80 / 서브타이틀→콘텐츠 48 (선물 카드는 카드 자체 padding 48px로 맞춤) / 로고월→통계 제목 80
- 이 블록이 **파일 맨 끝**에 있어서 앞쪽 규칙(같은 specificity)을 이김. 예전에 각 섹션 `@media` 안에 흩어져 있던 `font-size`는 통계 숫자만 빼고 전부 지웠으니, 모바일 크기를 바꿀 땐 여기서만 바꿀 것. 태블릿(601~900px)에서는 OU 카드 위 여백이 hover 성장 공간(padding 90px) 때문에 170px로 보임
- 모바일 검증은 Chrome 개발자 도구 모바일 보기나 브라우저 패널 `resize_window`(390×844)로 측정값을 확인했을 뿐, **스크롤 연출(멈춤 지점·키 사진 확대 등)이 폰에서 어떻게 보이는지는 아직 미확인**

## 통합 페이지 구조와 스크롤 동작 (중요)

- 섹션 4개(`#find-the-key`, `#opportunities-unlocked`, `#beyond-the-door`, `#creator-voices`), 각각 `.page > section[id]`. 헤더 nav는 `#앵커`로 이동하고 `scroll-spy.js`가 현재 섹션의 링크를 `--on`으로 표시
- `html { scroll-snap-type: y mandatory }` + 섹션 시작마다 snap. 섹션 안에서는 자유 스크롤. **함정**: 마지막 섹션 밖의 여백은 snap 영역 바깥이라 스크롤로 도달 못 함 → 페이지 하단 여백 400px은 `.page`가 아니라 `#creator-voices { padding-bottom: 400px }` 안에 있음 (밖에 두면 지원 버튼이 창 맨 아래에 붙어버렸음)
- **멈춤(pause) 스크립트 패턴**: `*-pause.js`들은 특정 요소에 도달하면 `overflow:hidden`으로 600ms 락을 걸어 "한 번 멈췄다 가는" 지점을 만듦. `scroll-snap-align: start`도 같이 있지만 native snap만으론 빠른 스크롤에서 놓쳐서 JS로 보강한 것. IntersectionObserver는 빠른 플릭에서 콜백이 누락돼서 **매 scroll 이벤트마다 위치를 재계산하는 방식**으로 재작성됨 — 새 멈춤 지점도 같은 방식으로 만들 것. 멈춤 지점: About 배지 앞 헤딩 / 인용문(키 사진 앞) / 키 사진 프레임(중앙) / 마지막 인용문 / 트로피 / 로고월(+통계) / 선물 제목
- **통계 멈춤은 `.stats-intro`(문구)+`.stats`(숫자)를 한 덩어리로 보고 헤더(72px) 아래 영역의 세로 가운데에 맞춤**(`stats-pause.js`가 매 scroll마다 위치를 재계산해 한 번 락 + `.stats-intro { scroll-snap-align: start; scroll-margin-top: calc((100vh + 72px - 368px) / 2) }`로 스냅 지점도 같은 자리). 로고월은 그 시점엔 이미 위로 지나가 있고 로고월 자체엔 멈춤이 없음. 문구 줄 수·문구↔숫자 간격·숫자 높이를 바꾸면 위 `368px`(=문구 90 + 간격 150 + 숫자 128)도 같이 바꿀 것
- **헤더 배경 띠 숨김**: About의 풀스크린 사진 두 개(히어로 롤링 `about-hero-roll.js`, 키 사진 `about-key-photo-grow.js`)가 화면 전체로 커지는 동안(디졸브 포함, 사진 아래 끝이 헤더 밖으로 나갈 때까지) `<body>`에 `is-fullframe-hero` / `is-fullframe` 클래스를 붙여 `.header-backdrop`을 fade out — 사진이 헤더 뒤까지 꽉 차게 보임. 같은 구간에 헤더 로고(SVG는 `filter: brightness(0) invert(1)`)·선택된 nav 링크(데스크톱만)·아래 화살표(`.down-hint`)가 **흰색**으로 바뀜(모바일 햄버거 막대도 메뉴가 닫혀 있을 때만 흰색). 선택 안 된 nav 링크(`#7b7b7b`)와 Apply 버튼은 그대로라 어두운 사진 위에서 대비가 약함 — 필요하면 그 링크도 흰 계열로
- **reveal 애니메이션(`translateY(28px)`) 때문에** JS로 재는 요소 위치가 28px 어긋나 보임 — 간격 측정할 때 감안할 것
- 형제 블록의 margin은 **collapse**됨 (예: 갤러리 `margin-bottom: 600`과 선물 제목 `margin-top: 340`은 합쳐지지 않고 큰 값 600만 적용)

## 헤더

- 로고(→ `hero-home.html`) + nav 4개 + CTA. **현재 라벨: About / Opportunities / Programs / Voices / Apply** (예전 "Find the Key/…/Open Your Door"에서 바뀜). Apply는 `https://ohou.se/competitions/1155` (새 탭), CV 하단 "스페셜 크리에이터 지원하기"와 같은 링크
- **`position: fixed`** (sticky 금지 — body/html의 `overflow-x: hidden`이 sticky를 깨뜨림). 높이 72px, `body { padding-top: 72px }`. 통합 페이지는 `.header-backdrop`(배경 그라데이션+그레인을 fixed로 똑같이 그린 띠)로 스크롤 내용을 가림. 현재 페이지 링크만 `--on`(600 + 밑줄), 나머지 `--off`(`#7b7b7b`)
- 모바일(≤900px): 햄버거(`.header__menu-btn`) + 드롭다운(`.header--menu-open`), 배경 `#fbfde4`(노란 블롭이 흰 배경에 겹친 색 — 블롭 색이 바뀌면 같이 맞출 것). `header-menu.js`가 관리. 햄버거 아이콘은 지금 CSS 3줄 막대 — 사용자가 실제 아이콘 에셋을 나중에 전달 예정
- 독립/상세 페이지의 헤더는 `#앵커`가 아니라 `FindTheKey.html`·`OpportunitiesUnlocked.html` 같은 파일 링크를 씀

## 섹션별 메모

### About (`#find-the-key`, Figma 233:1182) — 스크롤 연출이 많은 섹션
순서: 오프닝 헤딩(`--intro`, 38px/600) → **히어로 사진 롤링**(`about-hero-roll.js`: pin된 채 사진 5장이 넘어가고 4번째에 캡션, 5번째가 풀스크린으로 커지며 디졸브) → 롤링 직후 헤딩(`--blur-in`) → **스크랩북**(사진 2열, 오른쪽 열 155px 오프셋) → 배지 앞 헤딩 → SC 배지(GIF) → 인용문 1 → **키 사진 프레임**(중앙 정지 → 문구 1 → 풀스크린 확대 + 문구 2 → 디졸브) → 마지막 인용문 → **트로피(3D)**. 인용문(`.insight`)은 전부 30px/500. 키 사진은 아직 임시 회색 배경 + `key-photo.png`.
- 키 사진 뒤 여백은 `about-key-photo-grow.js`의 `settleRange()`가 만듦 — 프레임 아래 끝→마지막 인용문 위 **230px**로 고정 (예전 `2*innerHeight`는 히어로 롤링에서 복사한 잘못된 식이라 두 화면 분량이 비었음)
- **키 사진 블러**: 프레임이 풀스크린으로 커지고 고정된 구간(`GROW_VH 0.55` ~ `HOLD_VH 0.85`)에는 **사진도 문구도 블러 없이 선명**하고, 프레임이 풀려서 페이지와 함께 위로 지나갈 때 **사진의 절반(`BLUR_START 0.5`)이 화면 위로 나간 뒤부터** 블러(최대 20px)와 문구 fade-out이 시작됨. 조절은 `about-key-photo-grow.js` 상단 상수
- 트로피 위 여백 `margin-top: 32vh` (캔버스 자체에 모델 위로 화면 높이 ~15%의 투명 여백이 있어서 60vh에서 줄임), 아래 340px

### 트로피 3D 뷰어 (`trophy.js`)
`assets/trophy.glb` + `assets/trophy-3d-texture/`의 seamless/normal 맵(색·러프니스·범프 공용 + 노멀). **`trophy-texture-org.png`(원본 사진)는 절대 덮어쓰지 말 것** — seamless/normal은 파생본이라 재생성 가능. Three.js는 importmap으로 로드. 조작: 마우스를 올리면 커서 위치에 따라 카메라가 따라가고(`baseTheta=-18°`, `maxThetaSwing=55°`, lerp 0.3), **클릭+드래그로 회전**, 드래그를 놓으면 원래 각도로 복귀.
⚠️ 커서 추적/드래그 동작은 이 문서를 쓴 세션에서도 **실제 화면으로 검증하지 못함** (브라우저 캡처 도구가 빈 화면만 반환). 손질할 땐 실제 Chrome에서 확인하거나 사용자에게 좌/중/우 캡처를 받을 것 — 텍스트 피드백만 보고 파라미터를 추측해서 키우지 말 것.

### Opportunities Unlocked (`#opportunities-unlocked`)
- 히어로 → **카드 5개**(291×430, `opacity .4`, hover 시 394×520/`opacity 1`로 **위로** 자람). 상단 정렬 유지를 위해 hover 시 `margin-top: -90px`, 잘림 방지로 `.ou-contents { padding-top: 90px }` (1680px 미만에서 `overflow-x:auto`가 overflow-y까지 클립하기 때문). 1618px보다 좁으면 마우스 드래그/트랙패드로 스크롤되는 스트립. hover 크기(430/520)를 바꾸면 margin-top도 그 차이만큼 바꿀 것
- 카드 클릭 → **팝업**(`ou-modal.js`가 `OpportunitiesUnlocked-0N.html`을 fetch해서 `.detail`+스타일을 주입). 상세 사진은 케이스별 폴더(`assets/Opportunities-Unlocked/01-…~05-…`, `thumb.*` + 상세 이미지). 텍스트 라벨이 있는 사진은 `--contain` 클래스(02번 슬라이드 3). 이전/다음 링크에는 사례 제목이 들어감(05는 다음 없음). 05(취향수집가)는 이미지를 나중에 교체할 수 있음
- **브랜드 로고 롤링**(`.brand-rolling`, 로고 23개 + 복제 세트, 152×59 박스에 contain) → **통계 위 문구 블록**(`.stats-intro`, 타이틀 없이 "스페셜 크리에이터의 이야기는 / 다양한 협업과 콘텐츠로 이어지고 있습니다." 두 줄 가운데 정렬 28px) → **통계**(300+ / 674건 / 112명 / 29건 카운트업, 숫자 69px)

### Beyond the Door (`#beyond-the-door`, Figma 28:476)
- **여정 리스트**: 4단계(1 오프닝 밋업 / 2 스페셜 크리에이터 활동 / 3 오프라인 클래스 / 4 페어웰 — "브랜드 콜라보"는 삭제됨). 각 단계는 위 구분선 + 텍스트 + **롤링 마키 사진**(244×320, gap 15, 사진 안에 "Photo by. 이름" 크레딧). 단계 사이 화살표는 Figma에서 삭제되어 제거, 단계 간격 120px. 롤링은 원본+복제 세트를 `translateX(0→-50%)`로 돌림(아이템 수를 바꾸면 duration을 비례해서 조정)
- **"직접 만나 나누는 시간" 갤러리**: 코버플로 — 뷰포트 중앙에 가까운 사진이 가장 크고 진하고, 나머지는 거리에 따라 작아지고 fade. `position:sticky`는 안 씀(성능·깨짐), `btd-gallery-stack.js`가 스크롤 위치에서 매 프레임 계산. 사진 `assets/Beyond-the-Door/meetup/image-1~9.jpg`
- **Special Gift**: 2열 **카드 그리드**(예전 토글/아코디언 목록에서 재설계됨). 카드 = 위 구분선 + 제목 + "더 알아보기"(→ `BeyondTheDoor-gift1~4.html`, 사진 그리드+크레딧 상세 페이지) + 부채꼴로 겹친 썸네일. 선물 4종: 스페셜 웰컴 굿즈 / 브랜드 콜라보 굿즈 / 프리미엄 가구 협찬 / 페어웰 기프트
- 이미지 hover 플로팅(원본 미리보기) 효과는 시도했다가 뺌. 다시 필요하면 같은 `<img>` 하나를 옮기지 말고 "배경 썸네일 + 플로팅용 별도 `<img>`" 두 레이어로 만들 것
- 파일 대소문자·한글 파일명 주의: macOS는 대소문자 무시(로컬에서 안 걸리고 GitHub Pages 등에서 404), 한글 파일명은 NFD/NFC 차이로 URL이 404. 새 애셋은 **ASCII 파일명 + 소문자 폴더**로 (`journey`, `meetup`, `gift`)

### Creator Voices (`#creator-voices`, Figma 0:519)
- 인터뷰 행 4개(사진 495×340 + 텍스트, 홀수 행 사진 왼쪽 / 짝수 `--reverse`): MOPO / 랴료하우스 / cooohome / momo_kong(4번째는 교체됨). 사진은 `assets/Creator-Voices/story/`. 행 사이 `margin-bottom: 220px`(반전 행 267px — Figma 값, 건드리지 말 것), reveal 애니메이션은 여정 리스트와 동일
- **FAQ**(Figma 206:711): `자주 묻는 질문` + 질문 3개 클릭 토글(`faq-toggle.js`). 제목→목록 130px
- 아웃트로 문구 + "스페셜 크리에이터 지원하기" 버튼(`#464646`, 56px 높이) → 1155 링크

## 배경 시스템 — `.bg-gradient-anim` + `.bg-grain` (모든 페이지 공용)

- **`.bg-grain`**: 미세한 노이즈. `mix-blend-mode`는 반드시 **`multiply`** (overlay는 흰 배경에서 수학적으로 no-op이라 안 보임)
- **`.bg-gradient-anim`**: 노랑(`rgba(246,251,196)`)·하늘색(`rgba(205,231,255)`) 블롭 2개가 떠다님. Figma `54:1435` 참고. 튜닝 이력: opacity 0.85→0.45(너무 진함), 이동 거리 70~100px→180px + scale 펄스(안 움직여 보임)
- 각 페이지 CSS에 복붙되어 있음(공용 stylesheet 아님). 통합 페이지의 `.header-backdrop`도 같은 그라데이션을 `background-attachment: fixed`로 그려서 띠가 배경과 이어 보이게 함

## `hero-home.html` 스크롤 인터랙션 (열쇠구멍 첫 화면)

`.hero-pin`(**380vh** = 100 + 리빌 **220** + 홀드 60 — `hero-home.css`의 높이와 `hero-home.js`의 `REVEAL_VH = 2.2`를 항상 같이 바꿀 것). 스크롤 진행도 `progress`(0~1, 리빌 구간 기준) 순서:

1. **블러 → 사진 1·2·3 → 투명도+블러 → 로고**: 열쇠구멍 뒤(로고 위, 어두운 오버레이 아래)에 `.hero-pin__photos`가 깔려 있고 구멍으로만 보임. 처음엔 사진 1이 **강하게 블러(28px)**된 채 시작 → 0~15%에 초점이 잡힘 → 15~60%에 사진 2, 3이 앞 사진 위로 차례로 fade-in(앞 사진이 안 비치게 위에 덮는 방식) → 60~74% 사진 3 유지 → 74~94%에 사진이 **opacity↓ + 블러 24px**로 사라지며 **로고가 fade-in**(로고도 블러 16px에서 시작해 선명해짐). 튜닝 상수는 `hero-home.js` 상단(`PHOTOS_END`, `DISSOLVE_START/END`, `FOCUS_END`, `START_BLUR`, `END_BLUR`, `OVERLAY_FADE_START`)
2. **어두운 오버레이**: 키홀 SVG가 `scale 1→4.4`, `blur 1.5→61.5px`로 커짐(`easeInCubic` — 초반 느리고 후반 급가속). 오버레이 투명도는 **진행도 74%(=사진이 사라지기 시작하는 시점)까지 완전 불투명**이다가 100%까지 사라짐 → 사진이 도는 동안 구멍 바깥이 하얘지지 않고 어둡게 유지됨(예전엔 초반부터 투명해져서 흰 배경이 비쳤음)
3. 사진 위에는 **검정 40% 틴트**(`.hero-pin__photos::after`, 숫자만 바꾸면 세기 조절)를 씌워 구멍 테두리보다 안쪽에 있는 듯한 깊이감을 줌. 사진 층은 opacity와 함께 틴트도 같이 사라짐
4. 리빌이 끝나면 로고에 `is-settling`으로 덜컥 스냅, 하단 다운스크롤 아이콘이 딜레이 후 fade-in+bob, 홀드 60% 지점부터 fade-out, 홀드가 끝나면 sticky가 풀리며 다음 섹션
- 키홀 SVG는 `preserveAspectRatio="xMidYMid slice"` 필수(`none`이면 찌그러짐), "Scroll/Down" 힌트 위치는 `updateHintPosition`이 리사이즈마다 재계산, 힌트는 진행도 20%에서 사라짐
- **현재 사진 3장(`rolling-01/02/03`)은 임시** — `hero-home.html`의 `hero-pin__photos` 안 `src` 세 줄만 바꾸면 됨(화면 비율에 맞춰 cover로 잘림)
- **하지 말 것**: 사진 층에 키홀 모양 마스크를 씌우지 말 것 — 마스크의 칼 같은 가장자리와 오버레이의 번진 가장자리 사이로 흰 배경이 새어 하얀 테두리/후광이 생겨서 뺐음. 지금은 "오버레이가 불투명한 동안 사진이 구멍 뒤에서만 보이는" 방식
- 아래 "key image" 섹션(Figma 1:975)은 사진에만 `key-float` 둥실 애니메이션, 그림자는 고정, 크기 `clamp(220px, 61vw, 780px)`, 호버 시 "Click me" 배지가 커서를 따라다니고 클릭하면 `FindTheKey.html`로 이동. 공유용 첫 화면 링크는 이 페이지(`.../special-creator/hero-home.html`)

## 파일명 변경 이력

`home.html/css/js` → `hero-home.*`, `index.html/styles.css` → `FindTheKey.html/css`로 리네임(웹서버가 `index.html`을 루트로 서빙하는 관례와 헷갈리지 않게). 지금 `index.html`은 `FindTheKey.html` 리다이렉트용으로 새로 만든 파일. 나중에 도메인을 연결할 때 첫 화면을 `hero-home.html`로 둘지(그러면 그쪽을 `index.html`로) 결정할 것.

## 알아두면 좋은 것

- Pretendard는 jsdelivr CDN에서 로드(오프라인이면 폰트 깨짐)
- GitHub `sarahkim-bucketplace/special-creator`. **저장소는 public이고 GitHub Pages가 켜져 있음** (예전 메모의 "private"은 틀림 — 코드·이미지·크레딧이 전부 공개됨. 공개하면 안 되는 자료가 있으면 private 전환 필요, 무료 계정에선 private으로 바꾸면 Pages도 꺼짐). 다른 Mac에서 이어가려면 `git clone` → 이후 `git pull`
- **공유용 링크(Pages)**: 메인 통합 페이지 `https://sarahkim-bucketplace.github.io/special-creator/FindTheKey.html`, 첫 히어로(열쇠구멍) 화면 `https://sarahkim-bucketplace.github.io/special-creator/hero-home.html`, 루트(`/special-creator/`)는 `index.html` 리다이렉트로 `FindTheKey.html`로 감. push 후 반영에 1~2분. 배포본에서 페이지가 쓰는 애셋 URL 전부(FindTheKey 117개, hero-home 8개)가 200으로 열리는 것을 확인함(대소문자·한글 파일명 문제 없음). `assets/`가 약 940MB라 첫 로딩이 느릴 수 있음
- **push 인증**: 이 컴퓨터엔 `gh` CLI가 없고 git은 macOS 키체인의 Fine-grained PAT를 씀(토큰 이름 `special-creator-clone`, `Contents` **Read and write** 필수 — Read-only면 clone/pull만 되고 push는 403). 인증이 한 번 실패하면 git이 키체인 항목을 지우니 새 토큰으로 터미널에서 `git push`를 직접 실행해 `Username`(GitHub 아이디, 토큰 아님)/`Password`(토큰)를 입력해야 함. **토큰을 채팅/스크린샷에 노출하면 즉시 Regenerate할 것**
- iCloud Drive 경로에서 `preview_start` dev-server 모드로 `python3 -m http.server`를 띄우면 `PermissionError`가 남 → Bash로 직접 `python3 -m http.server 5173 &` (죽은 서버가 404를 계속 내면 죽이고 프로젝트 폴더에서 다시 띄울 것)
- **Claude Code 내장 브라우저 패널의 함정**: ① CSS/JS 캐시를 심하게 먹음 — 수정이 안 보이면 `curl`로 서버 응답부터 확인하고 `fetch(url,{cache:'reload'})` 후 새로고침. 실제 Chrome은 `Cmd+Shift+R` ② 스크린샷이 빈 화면으로 나오는 일이 잦음 → 텍스트/DOM/`getBoundingClientRect` 측정으로 검증 ③ 창 폭이 좁으면(≤900/600px) 모바일 CSS가 적용돼 측정값이 달라짐 → 측정 전에 `resize_window`로 폭을 지정(desktop 프리셋으로 되돌리는 것도 잊지 말 것) ④ 마우스 hover는 폭 768px 미만(터치 에뮬레이션)에서 안 먹음
- 브라우저 도구(Claude in Chrome 확장)가 응답이 없을 수 있음 — 그땐 사용자에게 Chrome 캡처를 받거나 DOM 측정으로 판단할 것

## 남은 할 일 / 미검증

- **모바일 디테일**: 폰트·간격은 5단계 규칙으로 정리했지만(위 "모바일" 참고), 스크롤 연출(scroll-snap/멈춤 스크립트/키 사진 확대)이 폰에서 어떻게 보이는지는 미확인. 독립 페이지들과 OU 상세 팝업의 모바일 값은 아직 손대지 않음
- **햄버거 아이콘** 에셋 교체 (사용자가 전달 예정)
- 키 사진 프레임은 임시 배경 — 실제 사진으로 교체 가능성
- OU 05(취향수집가) 이미지 교체 가능성
- 독립 페이지(`OpportunitiesUnlocked.html`/`CreatorVoices.html`/`BeyondTheDoor.html`) 유지 여부 결정 (OU 상세 `-01~05`와 선물 상세 `gift1~4`는 메인이 쓰므로 유지)
- 커밋 안 된 애셋 폴더 정리: `assets/01. About/`, `02. oppotunities/`(오타), `03. program /`(끝 공백), `04. gift /`, `05. Creator Voices/` — 원본 보관용이면 `.gitignore`, 사이트에서 쓸 거면 ASCII 이름으로 정리 후 참조
- 커밋 안 된 트로피 잔여 파일: `assets/Untitled.mtl`, `trophy.mtl`, `trophy.obj`, `trophy_texture.png`, `trophy-3d-texture/trophy-texture.png`, `trophy-texture-org.png`(★원본, 삭제·덮어쓰기 금지), `source/`
- 트로피 커서 추적/드래그 동작의 실제 화면 검증
- About 파트 내부 간격·폰트 정리는 스크롤 연출과 얽혀 있어 아직 손대지 않음
