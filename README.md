# 스페셜 크리에이터 웹페이지

오늘의집 "스페셜 크리에이터" 소개 페이지. Figma 디자인을 기반으로 정적 HTML/CSS/JS로 제작 중. 빌드 도구 없음.

다른 컴퓨터에서 Claude(또는 사람)가 이어서 작업할 때 필요한 배경 설명을 정리해둔 문서입니다.
(git으로는 코드만 넘어가고, 대화 맥락은 넘어가지 않아서 남겨둡니다.)

> **먼저 읽을 것**: 사이트의 실제 메인은 **`FindTheKey.html` 한 장짜리 통합 스크롤 페이지**입니다 (About → Opportunities → Programs → Voices). 새 디자인 수정은 전부 `FindTheKey.html`/`FindTheKey.css`에 들어갑니다. `index.html`은 **`hero-home.html`(열쇠구멍 첫 화면)로 리다이렉트** — 방문자는 거기서 스크롤/클릭으로 `FindTheKey.html`로 넘어감 (예전엔 `index.html`이 바로 `FindTheKey.html`로 갔음, 첫 화면을 hero-home으로 둘지 결정 보류였다가 확정됨). 예전에 섹션별로 따로 만들었던 목록 페이지들(`OpportunitiesUnlocked.html`/`BeyondTheDoor.html`/`CreatorVoices.html`)은 아무 데서도 링크가 안 걸려 방문자가 볼 방법이 없어서 **삭제함** — 아래 "파일 구조" 참고.

## 파일 구조

```
index.html                                     hero-home.html로 리다이렉트 (사이트 진입점)
FindTheKey.html / FindTheKey.css               ★ 메인 통합 페이지 (섹션 4개, CSS 한 파일에 전부)
hero-home.html / .css / .js                    열쇠구멍 스크롤 첫 화면 (헤더 로고가 여기로 연결)
trophy.js                                      3D 트로피 뷰어 (Three.js, type=module)
viewport.js                                    **가장 먼저 로드되는 공용 스크립트** — 화면 높이 clamp(`window.effVH()`)와 스크롤 멈춤 스크립트 간 조율(`markPauseUnlock`/`pauseSafeToTrigger`) 제공, 아래 "화면 높이 clamp" 절 참고
assets/                                        이미지·SVG·trophy.glb·trophy-3d-texture/ 등. **섹션별 폴더 구조**: `00-hero`(hero-home 전용) / `01-about`(About 섹션: rolling 사진, 트로피, key-photo, 뱃지 gif) / `02-opportunities`(OU 섹션 + 상세 페이지: 케이스별 폴더, brand-logos, 화살표 아이콘) / `03-program`(Beyond the Door: journey, meetup, gift) / `04-voices`(Creator Voices: story). 루트에는 여러 섹션이 공유하는 것만 남김(`nav-icon.svg` 헤더 로고, `hero-icon.svg`, `icon-go.svg`, `icon-close.svg` 모달 닫기)

── 통합 페이지가 쓰는 JS (FindTheKey.html 하단에 순서대로 로드) ──
header-menu.js                                 모바일 햄버거 메뉴 (900px 이하)
scroll-reveal.js                               initReveal(selector, {stagger}) — 등장 애니메이션 공용 헬퍼
find-the-key.js                                About 섹션 reveal 연결
about-hero-roll.js                             About 히어로 사진 pin + 롤링 + 풀스크린 확대/디졸브
about-badge-pause.js                           배지(SC 로고) 앞 멈춤 지점
about-key-photo-grow.js / about-key-photo-pause.js   키 사진 프레임: 중앙 정지 → 확대 → 디졸브
insight-after-trophy-pause.js / trophy-pause.js      마지막 인용문·트로피 멈춤 지점
OpportunitiesUnlocked.js                       OU 카드 행 마우스 드래그 스크롤(데스크톱)
ou-mobile-carousel.js                          OU 카드, 모바일 전용 원카드 캐러셀(자동재생+화살표+점)
stats.js / stats-pause.js                      통계 숫자 카운트업 / 문구+통계 숫자 블록의 멈춤 지점(세로 가운데)
BeyondTheDoor.js                               여정 리스트 reveal (+ 독립 페이지용 갤러리 reveal)
btd-gallery-stack.js                           "직접 만나 나누는 시간" 코버플로 갤러리
btd-gift-pause.js                              선물 섹션 진입 멈춤 지점
faq-toggle.js                                  FAQ 클릭 토글
detail-photo-carousel.js                       OU 상세(팝업 안) 사진 슬라이드
ou-modal.js                                    OU 카드 클릭 → 상세 페이지를 팝업으로 띄움
scroll-spy.js                                  스크롤 위치에 따라 헤더 nav on/off + 아래 화살표(down-hint)

── 실제로 쓰이는 상세 페이지 (메인이 링크/fetch함, 삭제 금지) ──
OpportunitiesUnlocked-01~05.html / .css        OU 카드 클릭 시 상세 — ★ ou-modal.js가 이 파일을 fetch해서 팝업에 넣음
BeyondTheDoor-gift1~4.html / BeyondTheDoor-gift.css / gift-detail-reveal.js   선물 4종 상세 페이지 (메인의 "더보기"가 연결) — 실제 페이지 전환
```

`OpportunitiesUnlocked.js`/`BeyondTheDoor.js`라는 이름과 달리 이 둘은 **통합 페이지 전용 스크립트**(위 목록 참고)로, 예전 독립 목록 페이지들과는 이제 무관함.

**삭제된 파일**: `OpportunitiesUnlocked.html`/`.css`, `BeyondTheDoor.html`/`.css`, `CreatorVoices.html`/`.css` — 통합 페이지가 생기면서 어디서도 링크가 안 걸린 채 방치돼 있던 예전 독립 목록 페이지 3종. 사진·문구·간격 변경도 전혀 반영되지 않고 있었음(예: CV 인터뷰 사진 4장이 계속 회색 박스). 삭제하면서, 위 9개 상세 페이지의 헤더 nav(Opportunities/Programs/Voices)가 이 삭제된 파일들을 가리키고 있던 것도 `FindTheKey.html#opportunities-unlocked` 등 앵커 링크로 고침 — 안 고쳤으면 그 9개 페이지에서 헤더 메뉴 클릭 시 404가 났을 것. git 기록에는 남아있어 필요하면 복구 가능.

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
| ① Display | 38px | -0.19px | About 오프닝·롤링 직후 헤딩·히어로 캡션, 섹션 히어로 타이틀, **그리고 About 일반 헤딩·인용문(`.insight`)·키 사진 문구**(예전엔 30px Title 단계였다가, About 안의 모든 텍스트를 오프닝 헤딩과 같은 크기로 맞춰달라는 요청으로 여기로 옮김 — weight는 그대로 500 유지, `.about-heading--intro`/`--blur-in`/`.about-photo__caption`만 600) |
| ② Title | 30px | -0.15px | (통합 페이지에서 현재 이 크기를 쓰는 요소 없음 — About 항목들이 위 Display로 이동함). **문구형 서브타이틀(`.btd-middle__desc` 3곳: 통계 위·갤러리 위·선물 위)과 마무리 문구(`.cv-outro`)는 이 표 밖의 예외로 27px / 500**(요청값 — 30→28→30→25→26→27로 바뀌어 온 끝값). `.btd-middle__title`은 통합 페이지에선 안 쓰임(독립 페이지용) |
| ③ Subtitle | 22px | -0.11px | 여정 번호, 선물 카드 제목, CV 행 제목, OU 상세 제목 |
| ④ Body | 16px | -0.08px | 본문 전반, FAQ 질문·답변 — 버튼 글자 크기는 아래 "버튼" 참고 |
| ⑤ Caption | 14px | -0.07px | 크레딧, OU 카드 부제, 저자명, 헤더 링크·Apply |

**예외**: **통계 영역(라벨 20px / 숫자 54px / 단위 "건·명·+" 28px)** — 원래 Figma 69/37px + 라벨 22px였다가 요청으로 줄임(B안), 모달 닫기 ×(24px), **섹션 히어로 소개 문구 21px**(`.hero__subtitle`, 줄 높이 1.6, 타이틀 38px과 조합 — 16px일 땐 30px 서브타이틀 옆에서 너무 작아 보여 키움). 자간은 크기 × -0.5%.

### 이미지 박스 모서리 (border-radius)

- 사진 박스는 **5px** 하나로 통일: 여정 롤링 사진(`.btd-journey__rolling-photo`), 갤러리(`.btd-gallery__stack-photo`/`-inner`), 선물 카드 썸네일(`.btd-gift__stack-photo`), CV 인터뷰 사진(`.cv-row__photo`), OU 카드 썸네일(`.ou-card__photo`), 선물 상세 그리드(`.gift-detail__item`), **About 히어로 사진(`.about-photo`)·키 사진(`.about-key-photo`)**(예전엔 원래 Figma 디자인대로 20px 예외였다가, 다른 섹션과 안 맞아 보인다는 요청으로 5px로 통일함 — 이 두 프레임은 `about-hero-roll.js`/`about-key-photo-grow.js`가 풀스크린으로 커질 때 `stage.style.borderRadius`를 JS로 직접 애니메이션시키므로, 반경을 또 바꿀 땐 CSS뿐 아니라 이 두 JS 파일에 하드코딩된 시작 반경 값도 같이 바꿔야 함). 독립 페이지의 같은 박스에도 동일 적용
- 예외: 로고·아이콘·브랜드 로고월은 사진 박스가 아니라 0, OU 상세 팝업의 왼쪽 사진(`.detail__photo`)은 팝업 가장자리에 붙는 패널이라 0. 새 사진 박스를 만들 땐 5px을 넣을 것

### 웨이트 3가지

Regular **400**(본문·**모든 CTA 버튼**) / Medium **500**(인용문·About 일반 헤딩·라벨·크레딧) / Semibold **600**(38px 헤딩·타이틀류·번호). `strong` 강조는 600 (700은 원칙적으로 안 씀 — 예외: `hero-home.css`의 `.next-section h2`는 모바일 900px 이하에서만 700, 데스크톱은 600 그대로. 데스크톱 38px에서는 600이 괜찮았지만 모바일 26px에서는 얇아 보인다는 요청으로 이 한 곳만 예외 처리함).

### 글자색

- 기본 글자: **`#2d2828`** 하나로 통일. **순수 검정 `#000000`은 글자에 쓰지 않음** (구분선 `border`/배경에는 남아있음)
- 보조 회색: **`#7b7b7b`** 하나 (헤더 비활성 메뉴, OU 카드 부제, CV 저자명, FAQ 답변 등)
- 흰색 `#fff`(사진 위 캡션·버튼 글자), 크레딧 `#dddddd`

### 버튼 색

CTA 필 버튼은 전부 **`#464646`** + 흰 글자 + **웨이트 400(Regular)**: 헤더 Apply(`.header__cta`, 14px), 선물 카드 **"더보기"**(`.btd-gift__more`, 15px, 좌우 padding 18px — 박스는 라벨 폭 + 36px, 높이 30px), 스페셜 크리에이터 지원하기(`.cv-apply`, **22px**, 380×72px). (예전 `#909182`는 폐기, "더 알아보기"였던 문구는 "더보기"로 바뀜)

### 간격 (About 제외, 데스크톱)

- **섹션 사이 340px**: 트로피→OU, 통계→BTD, 여정→"직접 만나 나누는 시간", 선물→CV (OU 카드→로고월은 **200px** — 같은 섹션 안이라 요청으로 줄임)
- **메인 타이틀(히어로) → 콘텐츠 150px**: OU 카드(박스 60 + hover 성장 여유 padding 90), BTD 여정 리스트, CV 첫 행. 히어로 안쪽 간격: 아이콘→타이틀 **44px**, 타이틀→소개 문구 **40px**
- **서브타이틀(문구) → 콘텐츠 160px**: 통계 위 문구→숫자, 갤러리 위 문구→첫 사진, 선물 위 문구→카드 위 선(카드 안쪽 padding 48px이라 `.btd-gift { margin-top: 112px }` = 160 - 48), 마무리 문구→CTA 버튼(`.cv-apply { margin: 160px auto 0 }`) 전부 **160px**로 통일(예전 130/150/110). **`.btd-middle`의 타이틀은 지웠고 본문 한 줄이 서브타이틀** — 네 블록(통계 위·갤러리 위·선물 위·마무리) 모두 **가운데 정렬 27px/500 2줄**. 마무리 문구 위(마지막 인터뷰 행 아래)는 **340px**
- **의도적 예외**: 로고월→통계 문구 **250px**(문구+숫자 블록을 세로 가운데에서 멈추게 하는 위치와 화면 안 배치를 위해 넓힌 값), 갤러리→선물 문구 **600px**(마지막 사진이 완전히 fade된 뒤에 나와야 해서). 아래 화살표(`.down-hint`)는 `bottom: 24px`(원래 40px — 통계 블록이 화살표에 안 가려지게 낮춤) — **순수 장식용으로 클릭 불가**(`pointer-events: none`, `<div>`, 클릭 시 다음 섹션으로 넘기던 핸들러는 `scroll-spy.js`에서 제거). 마지막 섹션에서 숨기는 동작(`scroll-spy.js`)만 남아있음
- About 파트 내부 간격(120/150/230/135/140/30vh/230/32vh 등)은 스크롤 연출·멈춤 위치와 얽혀 있어서 통일하지 않음 — 건드릴 땐 pause 스크립트 동작을 같이 확인

### 모바일 (≤900px 하나로 통일, `FindTheKey.css` 맨 끝의 마지막 `@media` 블록)

- **폰트 5단계 26 / 22 / 18 / 15 / 13**: ① 26 = (해당 없음 — `.hero__title`은 아래 참고로 이 표에서 분리됨) ② 22 = 서브타이틀·FAQ 타이틀(`.cv-outro`/`.btd-middle__title`/`.faq__title`) ③ 18 = 통계 라벨·여정 번호·선물 제목·CV 행 제목 ④ 15 = 본문·헤더 메뉴/Apply·버튼·FAQ ⑤ 13 = 크레딧·카드 부제·저자명. 예외: 통계 숫자 34/36px, 모달 닫기 ×. 웨이트·색은 데스크톱과 동일
  - **섹션 히어로 아이콘/타이틀/서브타이틀(`.hero__icon`/`.hero__title`/`.hero__subtitle`, OU·BTD·CV 공용), 모바일만 별도 값**: 아이콘 28px(예전 39.2px)+아래 여백 20px(예전 44px), 타이틀 22px(예전 26px, 위 5단계 밖 — 20px로 한 번 줄였다가 "너무 작다"는 피드백으로 22px로 다시 키움), 서브타이틀 14px(예전 18px, 데스크톱은 21px — 마찬가지로 13px였다가 14px로 조정). 전부 직접 요청으로 재조정. 타이틀 2곳("스페셜 크리에이터에게 열리는 새로운 기회" / "스페셜 크리에이터가 들려주는 이야기")은 모바일에서만 `<br class="mobile-break">`로 줄바꿈(데스크톱은 한 줄) — 패턴은 hero-home.html의 "Key Creator" 제목과 동일
  - **About 섹션 텍스트는 이 5단계와 별도로 모바일 전용 20px 하나로 통일**: `.about-heading--blur-in`, `.about-photo__caption`, `.about-heading`(배지 앞 헤딩), `.insight`(인용문 2개), `.about-key-photo`(키 사진 문구 2개) 전부 20px — 처음엔 오프닝 헤딩과 맞추려고 26px으로 통일했다가 "커 보인다"는 피드백으로 20px로 낮춤. **데스크톱은 안 건드림**(오프닝 헤딩과 맞춘 38px 그대로). **`.about-heading--intro`("스페셜 크리에이터는 집과 일상을")만 다시 22px로 예외**(직접 요청) — 나머지 About 텍스트는 20px 그대로
- **간격**: 섹션 사이 120 / 메인 타이틀→콘텐츠 80 / 서브타이틀→콘텐츠 48 (선물 카드는 카드 자체 padding 48px로 맞춤) / 로고월→통계 문구 80
- **사이드 거터(좌우 여백) 24px로 통일**: `.page`(`FindTheKey.css`), `.header`, OU 상세의 `.detail__content`, 선물 상세의 `.gift-detail` — 전부 예전 35~36px에서 24px로 줄임(FindTheKey.css/OpportunitiesUnlocked-01~05.css/BeyondTheDoor-gift.css 동시 수정). newmixcoffee.com/ko 모바일 버전의 거터 값(24px)을 참고해 맞춘 값. 풀블리드 행(`.rolling`/`.brand-rolling`/OU 카드 스트립 등, `left:50%; margin-left:-50vw` 방식)은 `.page` 패딩과 무관하니 영향 없음
- 이 블록이 **파일 맨 끝**에 있어서 앞쪽 규칙(같은 specificity)을 이김. 예전에 각 섹션 `@media` 안에 흩어져 있던 `font-size`는 통계 숫자만 빼고 전부 지웠으니, 모바일 크기를 바꿀 땐 여기서만 바꿀 것. 태블릿(601~900px)에서는 OU 카드 위 여백이 hover 성장 공간(padding 90px) 때문에 170px로 보임
- 모바일 검증은 Chrome 개발자 도구 모바일 보기나 브라우저 패널 `resize_window`(390×844)로 측정값을 확인했을 뿐, **스크롤 연출(멈춤 지점·키 사진 확대 등)이 폰에서 어떻게 보이는지는 아직 미확인**

## 통합 페이지 구조와 스크롤 동작 (중요)

- 섹션 4개(`#find-the-key`, `#opportunities-unlocked`, `#beyond-the-door`, `#creator-voices`), 각각 `.page > section[id]`. 헤더 nav는 `#앵커`로 이동하고 `scroll-spy.js`가 현재 섹션의 링크를 `--on`으로 표시
- `html { scroll-snap-type: y mandatory }` + 섹션 시작마다 snap. 섹션 안에서는 자유 스크롤. **함정**: 마지막 섹션 밖의 여백은 snap 영역 바깥이라 스크롤로 도달 못 함 → 페이지 하단 여백 400px은 `.page`가 아니라 `#creator-voices { padding-bottom: 400px }` 안에 있음 (밖에 두면 지원 버튼이 창 맨 아래에 붙어버렸음)
- **멈춤(pause) 스크립트 패턴**: `*-pause.js`들은 특정 요소에 도달하면 `overflow:hidden`으로 600ms 락을 걸어 "한 번 멈췄다 가는" 지점을 만듦. `scroll-snap-align: start`도 같이 있지만 native snap만으론 빠른 스크롤에서 놓쳐서 JS로 보강한 것. IntersectionObserver는 빠른 플릭에서 콜백이 누락돼서 **매 scroll 이벤트마다 위치를 재계산하는 방식**으로 재작성됨 — 새 멈춤 지점도 같은 방식으로 만들 것. 멈춤 지점: About 배지 앞 헤딩 / 인용문(키 사진 앞) / 키 사진 프레임(중앙) / 마지막 인용문 / 트로피 / 로고월(+통계) / 선물 제목
- **화면 높이 clamp(`viewport.js`)**: About 섹션의 여러 스크롤 연출(`about-hero-roll.js`, `about-key-photo-grow.js` 등)이 예전엔 `window.innerHeight`를 직접 써서, 맥북 14"/16"·외부 모니터처럼 실제 화면 높이가 크게 다르면 같은 지점에서 다른 구도가 나왔음(예: 뱃지 멈춤에서 다음 문장이 같이 보이거나 안 보이거나). `viewport.js`가 `window.effVH()`(760~960px로 clamp된 값)를 전역으로 제공하고, 각 스크립트는 **실제 화면을 꽉 채워야 하는 곳(풀스크린 사진 크기)만 진짜 `innerHeight`를 쓰고, 나머지 여백·정지 위치 계산은 전부 `effVH()`로 바꿔서** 화면 높이가 달라도 같은 구도가 나오게 함. CSS 쪽 vh 값도 `--vh-eff` 커스텀 프로퍼티로 통일(`FindTheKey.css` `:root`)
- **멈춤 스크립트 간 연쇄 방지**: `about-badge-pause.js`가 스스로 스크롤을 옮기면 그 자체가 'scroll' 이벤트를 내서, `trophy-pause.js`가 사용자가 실제로 스크롤하지 않았는데도 바로 다음 멈춤(배지+첫 문장)까지 연달아 실행해버리는 문제가 있었음. `viewport.js`의 `markPauseUnlock()`/`pauseSafeToTrigger()`가 "스크롤이 실제로 완전히 멈췄다가 다시 시작됐는지"를 추적해서, 관성 스크롤이 남아있는 동안은 다음 멈춤이 끼어들지 못하게 막음 + `window.aboutBadgeHeadingPauseDone` 플래그로 `trophy-pause.js`의 배지 정지가 `about-badge-pause.js`보다 먼저 끝나는 경쟁 상태 자체를 차단. 새 멈춤 지점을 이어 붙일 땐 이 패턴을 따를 것
- **통계 멈춤은 `.stats-intro`(문구)+`.stats`(숫자)를 한 덩어리로 보고 헤더(72px) 아래 영역의 세로 가운데에 맞춤**(`stats-pause.js`가 매 scroll마다 위치를 재계산해 한 번 락 + `.stats-intro { scroll-snap-align: start; scroll-margin-top: calc((100vh + 72px - 354px) / 2) }`로 스냅 지점도 같은 자리). 로고월은 그 시점엔 이미 위로 지나가 있고 로고월 자체엔 멈춤이 없음. 문구 줄 수·문구↔숫자 간격·숫자 높이를 바꾸면 위 `354px`(=문구 86 + 간격 160 + 숫자 108)도 같이 바꿀 것
- **헤더 배경 띠 숨김**: About의 풀스크린 사진 두 개(히어로 롤링 `about-hero-roll.js`, 키 사진 `about-key-photo-grow.js`)가 화면 전체로 커지는 동안(디졸브 포함, 사진 아래 끝이 헤더 밖으로 나갈 때까지) `<body>`에 `is-fullframe-hero` / `is-fullframe` 클래스를 붙여 `.header-backdrop`을 fade out — 사진이 헤더 뒤까지 꽉 차게 보임. 같은 구간에 헤더 로고(SVG는 `filter: brightness(0) invert(1)`)·선택된 nav 링크(데스크톱만)·아래 화살표(`.down-hint`)가 **흰색**으로 바뀜(모바일 햄버거 막대도 메뉴가 닫혀 있을 때만 흰색). 선택 안 된 nav 링크(`#7b7b7b`)와 Apply 버튼은 그대로라 어두운 사진 위에서 대비가 약함 — 필요하면 그 링크도 흰 계열로
- **reveal 애니메이션(`translateY(28px)`) 때문에** JS로 재는 요소 위치가 28px 어긋나 보임 — 간격 측정할 때 감안할 것
- 형제 블록의 margin은 **collapse**됨 (예: 갤러리 `margin-bottom: 600`과 선물 제목 `margin-top: 340`은 합쳐지지 않고 큰 값 600만 적용)

## 헤더

- 로고(→ `hero-home.html`) + nav 4개 + CTA. **현재 라벨: About / Opportunities / Programs / Voices / Apply** (예전 "Find the Key/…/Open Your Door"에서 바뀜). Apply는 `https://ohou.se/competitions/1155` (새 탭), CV 하단 "스페셜 크리에이터 지원하기"와 같은 링크
- **`position: fixed`** (sticky 금지 — body/html의 `overflow-x: hidden`이 sticky를 깨뜨림). 높이 72px, `body { padding-top: 72px }`. 통합 페이지는 `.header-backdrop`(배경 그라데이션+그레인을 fixed로 똑같이 그린 띠)로 스크롤 내용을 가림. 현재 페이지 링크만 `--on`(600 + 밑줄), 나머지 `--off`(`#7b7b7b`)
- 모바일(≤900px): 햄버거(`.header__menu-btn`) + 드롭다운(`.header--menu-open`), 배경 `#fbfde4`(노란 블롭이 흰 배경에 겹친 색 — 블롭 색이 바뀌면 같이 맞출 것). `header-menu.js`가 관리. 햄버거 아이콘은 CSS로 그린 3줄 막대(이미지 아님) — Figma 노드 `256:749`(사용자가 전달) 기준으로 두께 2px→1px, 너비 22px→23px, 줄 간격 7px→8px로 조정, 열림(X) 애니메이션의 회전 축(`top`)도 새 가운데 줄 위치(16px)에 맞춰 같이 옮김. 색은 에셋 원본의 `#181415`(거의 검정) 대신 헤더 링크와 같은 사이트 표준 `#2d2828` 유지. FindTheKey.css와 이 컴포넌트를 그대로 복사해 쓰는 6개 상세 페이지 스타일시트(OU 5개 + gift 1개) 전부 동일하게 반영
  - **함정(실제로 걸렸던 버그)**: `.header__menu-icon::before`/`::after`의 `top`은 **버튼이 아니라 `.header__menu-icon` 자기 자신의 박스** 기준으로 계산됨(`.header__menu-icon`도 `position:absolute`라 자기 자식 pseudo-element의 containing block이 됨). 그래서 "버튼 위 8px/24px에 놓겠다"는 의도로 `top: 8px`/`top: 24px`를 쓰면 실제로는 아이콘 자신의 `top:16px`에 그 값이 **더해져서** 8/16/24가 아니라 24/16/40(간격 8px·16px, 2배 차이)로 어긋남 — 얇은 1px 선으로 바꾸고 나서야 눈에 띌 만큼 벌어져 보였지만, 두꺼운 2px 막대였던 예전 버전에도 같은 계산 실수가 있었음(간격 8px·14px). 고친 값: `::before`는 `top: -8px`, `::after`는 `top: 8px`(둘 다 아이콘 자신의 16px에 상대적으로 계산되어 실제로는 8px·24px에 위치), 열림(X) 상태의 회전 축도 `top: 16px`이 아니라 `top: 0`이어야 아이콘 자신의 위치(16px)에 정확히 겹침. **새 pseudo-element 기반 아이콘/도형을 만들 때 이 containing-block 규칙을 항상 염두에 둘 것**
- 상세 페이지(OU 상세 5개, 선물 상세 4개)의 헤더 nav도 통합 페이지와 똑같이 `FindTheKey.html#opportunities-unlocked` 같은 **앵커 링크**를 씀(About만 앵커 없이 `FindTheKey.html`) — 예전엔 삭제된 독립 목록 페이지(`OpportunitiesUnlocked.html` 등)를 직접 가리켰다가, 그 페이지들을 지우면서 같이 고침. 새 상세 페이지를 만들 때도 이 패턴을 따를 것

## 섹션별 메모

### About (`#find-the-key`, Figma 233:1182) — 스크롤 연출이 많은 섹션
순서: 오프닝 헤딩(`--intro`, 38px/600) → **히어로 사진 롤링**(`about-hero-roll.js`: pin된 채 사진 5장이 넘어가고 4번째에 캡션, 5번째가 풀스크린으로 커지며 디졸브) → 롤링 직후 헤딩(`--blur-in`) → **스크랩북**(사진 2열, 오른쪽 열 155px 오프셋) → 배지 앞 헤딩 → SC 배지(GIF) → 인용문 1 → **키 사진 프레임**(중앙 정지 → 문구 1 → 풀스크린 확대 + 문구 2 → 디졸브) → 마지막 인용문 → **트로피(3D)**. 인용문(`.insight`)은 전부 38px/500(예전 30px — About 텍스트를 전부 오프닝 헤딩 크기로 맞춰달라는 요청으로 변경, 위 "폰트 사이즈 5단계" 참고). 키 사진은 `assets/01-about/about-key-photo.jpg`(실제 사진으로 교체됨, 이전 임시 회색 배경+`key-photo.png`은 폐기).
- **히어로 사진 롤링의 크레딧도 사진마다 다름**: 예전엔 `.about-photo__credit`이 고정 텍스트라 5장 내내 첫 사진 크레딧만 보였음 — 지금은 `about-hero-roll.js`의 `CREDITS` 배열(사진과 같은 순서: jinmilloo예빈/dotorisisters/어반데이/sund_home/루지니하우스)을 `setActive(index)`가 매번 `credit.textContent`에 반영. 사진을 더 바꾸면 이 배열도 같이 바꿀 것
- 키 사진 뒤 여백은 `about-key-photo-grow.js`의 `settleRange()`가 만듦 — 프레임 아래 끝→마지막 인용문 위 **230px**로 고정 (예전 `2*innerHeight`는 히어로 롤링에서 복사한 잘못된 식이라 두 화면 분량이 비었음)
- **모바일 버그: 키 사진 문구가 줄 단위로 쪼개져 보이던 문제** — `.about-key-photo__text`(`<p>`)에 `display:flex`를 직접 걸어놨는데, 이 `<p>`가 텍스트 노드 + `<strong>`을 같이 담고 있으면 CSS가 텍스트 런과 `<strong>`을 각각 **별도의 익명 flex 아이템**으로 쪼갬 — 데스크톱처럼 한 줄에 다 들어가면 안 보이지만, 모바일처럼 줄바꿈이 필요해지면 그 조각들이 서로 다른 줄로 따로 떨어져 문장이 깨져 보임(`--2`가 `<strong>`을 포함해서 실제로 깨졌었고, `--1`은 조각이 하나뿐이라 안 깨진 것처럼 보였을 뿐). 고친 방법: `<p>` 안에 실제 문구를 감싸는 `<span>` 하나를 추가해서 flex 컨테이너의 자식이 그 span 하나만 되게 하고, `text-align: center`는 span에 줌. 앞으로 `display:flex`를 문구가 있는 `<p>`/`<div>`에 직접 걸 때는 이 패턴(텍스트는 항상 자식 하나로 감싸기)을 따를 것
- **키 사진 블러**: 프레임이 풀스크린으로 커지고 고정된 구간(`GROW_VH 0.55` ~ `HOLD_VH 0.85`)에는 **사진도 문구도 블러 없이 선명**하고, 프레임이 풀려서 페이지와 함께 위로 지나갈 때 **사진의 절반(`BLUR_START 0.5`)이 화면 위로 나간 뒤부터** 블러(최대 20px)와 문구 fade-out이 시작됨. 조절은 `about-key-photo-grow.js` 상단 상수
- 트로피 위 여백 `margin-top: 32vh` (캔버스 자체에 모델 위로 화면 높이 ~15%의 투명 여백이 있어서 60vh에서 줄임), 아래 340px

### 트로피 3D 뷰어 (`trophy.js`)
`assets/01-about/trophy.glb` + `assets/01-about/trophy-3d-texture/`의 seamless/normal 맵(색·러프니스·범프 공용 + 노멀). **`trophy-texture-org.png`(원본 사진)는 절대 덮어쓰지 말 것** — seamless/normal은 파생본이라 재생성 가능. Three.js는 importmap으로 로드. 조작: 마우스를 올리면 커서 위치에 따라 카메라가 따라가고(`baseTheta=-18°`, `maxThetaSwing=55°`, lerp 0.3), **클릭+드래그로 회전**, 드래그를 놓으면 원래 각도로 복귀. 트로피 바로 아래에 안내 문구 `.trophy-hint`("*마우스로 돌려보세요", 본문 크기 16px/400, 보조 회색 `#7b7b7b`, 트로피와 간격 0)가 있고 — **사이트 표준 340px 섹션 간격은 이 문구로 옮겨감**(`.trophy-placeholder` 자체엔 더 이상 `margin-bottom` 없음, 모바일은 120px).
⚠️ 커서 추적/드래그 동작은 이 문서를 쓴 세션에서도 **실제 화면으로 검증하지 못함** (브라우저 캡처 도구가 빈 화면만 반환). 손질할 땐 실제 Chrome에서 확인하거나 사용자에게 좌/중/우 캡처를 받을 것 — 텍스트 피드백만 보고 파라미터를 추측해서 키우지 말 것.

### Opportunities Unlocked (`#opportunities-unlocked`)
- 히어로 → **카드 5개**(291×430, `opacity .4`, hover 시 394×520/`opacity 1`로 **위로** 자람). 상단 정렬 유지를 위해 hover 시 `margin-top: -90px`, 잘림 방지로 `.ou-contents { padding-top: 90px }` (1680px 미만에서 `overflow-x:auto`가 overflow-y까지 클립하기 때문). 1618px보다 좁으면 마우스 드래그/트랙패드로 스크롤되는 스트립. hover 크기(430/520)를 바꾸면 margin-top도 그 차이만큼 바꿀 것
- **모바일(≤900px)만 완전히 다른 UI — 원카드 캐러셀** (newmixcoffee.com/ko의 상품 캐러셀 참고, 직접 요청): 데스크톱의 hover-grow 멀티카드 스트립 대신, 카드 1장이 화면 꽉 채우고(`flex: 0 0 100%`, `scroll-snap-align: center`) 좌우로 다음/이전 카드가 살짝 보임(`.ou-contents`의 기존 24px 패딩+15px gap 덕분에 자연스럽게 생긴 효과, 의도적으로 설계한 건 아니지만 남겨둠). `ou-mobile-carousel.js`가 4초마다 자동 재생, 좌우 화살표 버튼(`.ou-carousel__arrow`)과 하단 점 인디케이터(`.ou-carousel__dots`, 카드 수만큼 JS로 생성)로 수동 이동도 가능 — 화살표/점 클릭이나 직접 스와이프 둘 다 자동재생 타이머를 리셋함. `window.matchMedia('(max-width: 900px)')`로 게이팅되어 있어서 데스크톱 폭에선 이 스크립트가 아예 아무 것도 안 함(백그라운드에서 타이머도 안 돌아감). `.ou-carousel`이라는 새 wrapper div가 `.ou-contents`를 감싸면서 900px 이하에서 풀블리드 breakout을 `.ou-contents` 대신 이 wrapper가 가져감(화살표/점이 절대 위치로 같은 좌표계를 쓰기 위함) — 900px 초과에선 `.ou-contents`가 예전처럼 자기 자신이 풀블리드
  - **카드 자체도 newmix 느낌으로 재조정 (직접 요청)**: 사진은 데스크톱 hover 시 커지는 520px 크기로 **고정**(자라나는 모션 자체가 없음 — `transition: none`), 제목+태그(`.ou-card__text`)는 사진 **아래가 아니라 안쪽**에 하단 정렬로 겹쳐 올라감(검정→투명 그라데이션 배경 + 흰 글자, go 아이콘도 `filter: brightness(0) invert(1)`로 흰색). 화살표는 원형 배경/그림자를 없애고 흰색 아이콘 + 옅은 드롭섀도우만 남김(원 없이도 사진 위에서 읽히도록), 버튼 52px/아이콘 28px로 확대(피드백 반영, 처음엔 36/18이었음)
    - ⚠️ **버그였던 것**: 위 520px 고정이 처음엔 `:hover` 상태를 안 막아놔서, iOS Safari가 탭한 `<a>`를 `:hover`에 계속 걸어두는 특성상 이 파일에 이미 있던 **더 높은 specificity의** 데스크톱용 hover-grow 규칙(및 예전 600px 전용 변형)이 도로 이겨서 사진이 430px/358px로 줄고 위로 밀리는 현상이 있었음(겉보기엔 "사진이 작아지는 오류"). `.ou-carousel .ou-card:hover .ou-card__photo`까지 같은 520px/margin-top:0으로 명시적으로 눌러서 해결 — 이 페이지에 유사한 고정 크기 오버라이드를 또 넣을 땐 `:hover` 상태도 같이 눌러둘 것
- 카드 클릭 → **팝업**(`ou-modal.js`가 `OpportunitiesUnlocked-0N.html`을 fetch해서 `.detail`+스타일을 주입). 상세 사진은 케이스별 폴더(`assets/02-opportunities/01-…~05-…`, `thumb.*` + 상세 이미지). 텍스트 라벨이 있는 사진은 `--contain` 클래스(02번 슬라이드 3). 이전/다음 링크에는 사례 제목이 들어감(05는 다음 없음). 닫기 버튼(`.ou-modal__close`, Figma 252:755)은 배경 없는 흰 X, 카드를 감싸는 `.ou-modal__frame`(카드 크기에 맞춰 hug) 바깥쪽에 절대 위치 — 카드 위가 아니라 카드 **옆** 우측 상단
- **OU-05(취향수집가)만 사진별로 본문 링크가 바뀜**: `.detail__links`가 사진 슬라이드와 같은 순서로 `.detail__link` 5개를 담고 있고, `detail-photo-carousel.js`가 사진의 `is-active`를 토글할 때 같은 인덱스의 링크도 같이 토글(`#detailLinks`가 없는 다른 OU 상세 페이지에선 그냥 빈 배열이라 영향 없음). 실제 링크 5개(브랜디드 취향수집가=myfavehobby, 전국 내집자랑=88like/원삼집, 우리집에 놀러와=tovhaus, 왓츠인 마이홈=제니홈무드) 다 채워짐. **전국 내집자랑(슬라이드 2-3)은 16:9 유튜브 썸네일이라 세로가 긴 사진 박스에 그냥 cover하면 좌우가 심하게 잘림** — `.detail__photo-img--contain`(01번 페이지의 세로 포스터용 클래스와 같은 패턴, 배경만 검정)으로 원본 비율 그대로 위아래 레터박스
- **브랜드 로고 롤링**(`.brand-rolling`, 로고 21개 + 복제 세트, 152×59 박스에 contain, `assets/02-opportunities/brand-logos/`) → **통계 위 문구 블록**(`.stats-intro`, 타이틀 없이 "스페셜 크리에이터의 이야기는 / 다양한 협업과 콘텐츠로 이어지고 있습니다." 두 줄 가운데 정렬 28px) → **통계**(300+ / 674건 / 112명 / 29건 카운트업, 네 항목 사이 간격 `clamp(24px, 7.6vw, 110px)`(Figma 70px에서 넓힘), 숫자 54px)

### Beyond the Door (`#beyond-the-door`, Figma 28:476)
- **여정 리스트**: 4단계(1 오프닝 밋업 / 2 스페셜 크리에이터 활동 / 3 오프라인 클래스 / 4 페어웰 — "브랜드 콜라보"는 삭제됨). 각 단계는 위 구분선 + 텍스트 + **롤링 마키 사진**(244×320, gap 15, 사진 안에 "Photo by. 이름" 크레딧). 단계 사이 화살표는 Figma에서 삭제되어 제거, 단계 간격 120px. 롤링은 원본+복제 세트를 `translateX(0→-50%)`로 돌림(아이템 수를 바꾸면 duration을 비례해서 조정)
- **"직접 만나 나누는 시간" 갤러리**: 코버플로 — 뷰포트 중앙에 가까운 사진이 가장 크고 진하고, 나머지는 거리에 따라 작아지고 fade. `position:sticky`는 안 씀(성능·깨짐), `btd-gallery-stack.js`가 스크롤 위치에서 매 프레임 계산. 사진 9장은 `assets/03-program/meetup/`에 있고 파일명이 곧 설명(예: `공간_스토리마켓_04.jpg`, `공간_쇼룸_ngray_01.jpg`)
- **Special Gift**: 2열 **카드 그리드**(예전 토글/아코디언 목록에서 재설계됨). 카드 = 위 구분선 + 제목 + "더보기"(→ `BeyondTheDoor-gift1~4.html`, 사진 그리드 상세 페이지) + 겹친 썸네일 3장(평소엔 **기울기 없이 똑바로** 앞 사진 뒤에 나란히 겹쳐 있고, **`.btd-gift__stack`에 마우스를 올리면 양옆 사진이 ±118px 밀려나며 ±7° 기울어지며 펼쳐짐**, 0.4s ease — 브랜디자인 clients 페이지 참고. 모바일은 ±88px). 선물 4종: 스페셜 웰컴 굿즈 / 브랜드 콜라보 굿즈 / 프리미엄 가구 협찬 / 페어웰 기프트
  - **4종 전부 크레딧 있음**: `.gift-detail__item` 안에 `<p class="gift-detail__credit">Photo by. 이름</p>`(사진 우측 하단, 13px/400, `#dddddd`, 그림자 없음 — `.about-photo__credit`/`.btd-journey__rolling-credit`와 같은 톤). gift1(13장)/gift2(32장)/gift3(12장)/gift4(17장) 전부 채움
  - **사진 출처(공통 워크플로)**: `assets/03. program /gift /`(iCloud 안의 원본 raw 사진 폴더, 4개 하위폴더 — `1. 호텔 &키 & 명함`=gift1, `2. 브랜드 콜라보 굿즈`=gift2, `3. 프리미엄 가구 협찬`=gift3, `4. 페어웰 기프트`=gift4, 전부 공백·한글 포함이라 git 미추적)에 사용자가 각 사진을 **`N-이름.확장자`**(예: `8-리루홈.jpg`)로 미리 정리해두고, 출처 불명 사진은 그 폴더에서 직접 지워둠 — 이 폴더가 그대로 소스가 됨. `이름` 부분이 그대로 크레딧 문구("Photo by. 이름")가 됨. 원본은 2560×3400급 풀 해상도라 `sips -Z 1000 -s format jpeg -s formatOptions 80`로 리사이즈해서 `assets/03-program/gift/giftN/`에 `giftN-01.jpg`부터 저장(avif 원본은 sips가 못 열어서 리사이즈 없이 그대로 복사). gift1/3(번호 1~N 유일, 빈 자리 없음)은 원본 `N`을 그대로 최종 번호로 씀. **gift4는 원본 번호가 중복·군데군데 비어 있어서**(예: `03-*.jpg`가 3장, `08`/`11`/`13`은 없음) `(원본 번호, 파일명)` 순으로 정렬해 1부터 새로 번호를 매김 — 새 gift 항목을 채울 때 원본 번호가 gift4처럼 지저분하면 같은 방식(정렬 후 재번호)을 쓸 것. **이 raw 폴더 4개는 이제 다 소진됨**(gift1~4 전부 처리 완료, 남은 미사용 사진 없음)
  - **FindTheKey.html 카드의 부채꼴 썸네일 3장**(`.btd-gift__stack-photo--left/right/front`)도 각 gift 폴더의 사진을 직접 가리킴 — gift1/3/4는 `-01/02/03.jpg`(front=01, 기본 컨벤션), **gift2만 예외로 `-04/05/06.jpg`(front=04, 사용자가 지정)** 사용 중. 바꾸려면 이 세 `<div>`의 `background-image`만 고치면 됨
- 이미지 hover 플로팅(원본 미리보기) 효과는 시도했다가 뺌. 다시 필요하면 같은 `<img>` 하나를 옮기지 말고 "배경 썸네일 + 플로팅용 별도 `<img>`" 두 레이어로 만들 것
- 파일 대소문자·한글 파일명 주의: macOS는 대소문자 무시(로컬에서 안 걸리고 GitHub Pages 등에서 404), 한글 파일명은 NFD/NFC 차이로 URL이 404. 새 애셋은 **ASCII 파일명 + 소문자 폴더**로 (`journey`, `meetup`, `gift`)

### Creator Voices (`#creator-voices`, Figma 0:519)
- 인터뷰 행 4개(사진 495×340 + 텍스트, 홀수 행 사진 왼쪽 / 짝수 `--reverse`): MOPO / 랴료하우스 / cooohome / momo_kong(4번째는 스토리로 교체됨). 사진은 `assets/04-voices/story/`, 4개 다 채워짐 — momo_kong 사진은 원본이 10MB대 PNG(2560×3413)라 900px 폭 JPG로 줄여서 넣음(약 280KB), 다른 사진들과 같은 명명 규칙(`cv-이름.jpg`). 행 사이 `margin-bottom: 220px`(반전 행 267px — Figma 값, 건드리지 말 것), reveal 애니메이션은 여정 리스트와 동일
- **FAQ**(Figma 206:711): 지원하기 버튼 **아래**에 있고(예전엔 버튼 위), **"자주 묻는 질문" 제목은 뺐음** — 질문 3개 클릭 토글(`faq-toggle.js`)만 남음. 버튼→목록 **260px**(문구→버튼 160px보다 일부러 넓게), 목록 아래는 `#creator-voices`의 400px padding
- **마무리 문구**("다음 문을 열 Key Creator를 기다립니다. / 집과 일상에서…", `.cv-outro`)는 다른 서브타이틀 문구와 같은 **27px/500 가운데**, → **"스페셜 크리에이터 지원하기" 버튼(`.cv-apply`, `#464646`, 380×72px, 글자 22px/400)** → 1155 링크

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
- **키홀로 보이는 사진 3장은 About 섹션과 같은 실제 파일을 그대로 씀** — `hero-pin__photos` 안 `src` 3줄은 `assets/01-about/rolling/`의 히어로 롤링 사진 중 앞 3장(현재 jinmilloo예빈/dotorisisters/어반데이). **함정**: About 섹션 사진을 교체할 때 `FindTheKey.html`만 고치고 `hero-home.html`의 이 3줄을 깜빡하면 여기만 404 남음 — 같이 바꿀 것
- **아래 key-visual 사진(`key-photo`)은 About의 key-photo 프레임과 예전엔 같은 파일을 썼지만 지금은 분리됨** — hero-home 전용 3D 렌더 키 이미지 `assets/00-hero/key-photo.png`(About을 실제 사진으로 교체하면서 갈라짐). About의 키 프레임 사진을 또 바꾸더라도 이 파일은 건드리지 말 것(반대도 마찬가지)
- **하지 말 것**: 사진 층에 키홀 모양 마스크를 씌우지 말 것 — 마스크의 칼 같은 가장자리와 오버레이의 번진 가장자리 사이로 흰 배경이 새어 하얀 테두리/후광이 생겨서 뺐음. 지금은 "오버레이가 불투명한 동안 사진이 구멍 뒤에서만 보이는" 방식
- 아래 "key image" 섹션(Figma 1:975)은 사진에만 `key-float` 둥실 애니메이션, 그림자는 고정, 크기 `clamp(220px, 61vw, 780px)`, 호버 시 "Click me" 배지가 커서를 따라다니고 클릭하면 `FindTheKey.html`로 이동. 공유용 첫 화면 링크는 이 페이지(`.../special-creator/hero-home.html`)
  - **모바일**: 예전엔 이 페이지만 `@media (max-width: 900px)`가 아니라 `600px`를 썼음 — 700~900px 폭(태블릿 세로, 좁은 데스크톱 창)에서 사이트의 다른 모든 페이지는 이미 모바일 레이아웃인데 이 페이지만 데스크톱 크기가 나왔던 것. `900px`로 통일하고, `.next-section h2`의 모바일 크기도 통합 페이지의 모바일 Display 단계와 맞춰 24→26px로 조정
  - **`.hero-pin`/`.hero-pin__stage`/`.next-section`의 높이에 `dvh` 폴백 추가**(`vh` 다음 줄에 같은 속성을 `dvh`로 한 번 더 선언 — 지원 안 하는 브라우저는 `vh`로 자동 폴백): `hero-home.js`의 스크롤 진행도 계산이 `window.innerHeight`(현재 실제 뷰포트, 모바일에서 주소창 열림/닫힘에 따라 매 순간 바뀜)를 쓰는데, CSS `vh`는 **가장 큰 뷰포트**(주소창 다 접혔을 때) 기준이라 둘이 어긋남 — 모바일에서 스크롤하다 주소창이 접히면 실제로 필요한 스크롤 거리(`vh` 기준 `.hero-pin.offsetHeight`)와 JS가 생각하는 진행도(`innerHeight` 기준)가 서로 안 맞아 리빌이 다 끝났는데 핀 섹션은 아직 안 끝났거나 하는 식의 밀림이 생길 수 있었음. `dvh`는 `innerHeight`처럼 매 순간의 실제 뷰포트를 따라가므로 이 어긋남이 줄어듦. (참고: About 섹션 스크롤 연출은 같은 문제를 `viewport.js`의 `effVH()` clamp로 풀고 있음 — hero-home은 아직 `viewport.js`를 안 쓰고 있어서, `effVH()`를 가져다 쓰는 대신 더 가벼운 `dvh` 폴백만 적용함)
  - **`.key-link`의 "Click me" 배지, 모바일에서 1초 뒤 자동으로 뜨게 고침**: 원래 `mousemove`/`mouseenter`로만 뜨는데 터치 기기엔 그런 이벤트가 없어서 폰/태블릿에서는 이 배지가 절대 안 떴음(열쇠를 눌러야 다음 페이지로 간다는 시각적 힌트가 모바일엔 전혀 없었음). `hero-home.js`의 `update()`가 next-section을 보여주는 순간(`holdProgress >= 0.9`)을 그대로 감지해서, **900px 이하에서만** 1초 뒤 `showAutoClickBadge()`가 배지를 열쇠 자체의 중심 좌표에 고정해서 띄움(커서를 따라다니진 않음, 그냥 그 자리에 나타남). 데스크톱은 기존 호버 방식 그대로 — 이미 잘 되고 있는데 자동으로 또 띄우면 오히려 방해가 될 것 같아서 안 건드림
  - **"Scroll"/"Down" 힌트, 모바일에서 키홀과 간격 좁힘**: `hero-home.js`의 `updateHintPosition()`이 키홀 SVG와 같은 "xMidYMid slice" cover-scale 방식으로 힌트 위치를 계산하는데, 세로로 긴 폰 화면에서는 이 스케일이 **높이 기준**으로 커져서 힌트가 키홀에서 데스크톱보다 훨씬 멀어 보였음 — 900px 이하에서만 `MOBILE_HINT_SCALE`(0.6)을 곱해서 간격을 좁힘
  - **로고 → "영감을 여는 사람들" 전환에 newmix 스타일 모션 추가**: 예전엔 hold가 끝나고 핀이 풀리면 다음 섹션이 그냥 문서 흐름대로 나타났음(모션 없음). newmixcoffee.com/ko의 히어로 이탈 모션(스크롤 스크러빙이 아니라 **한 번에 스냅되는 fade+slide**, opacity 0→1 + `translateY(50px)→0`, 300ms `cubic-bezier(0.33,1,0.68,1)`)을 참고해서 `.next-section`에 같은 스타일의 진입 모션을 줌. `hero-home.js`의 `update()`가 이미 계산하고 있는 `holdProgress`가 0.9를 넘는 순간(hold가 거의 끝나 갈 때) `.is-visible` 클래스를 토글하는 방식 — 처음엔 `scroll-reveal.js`의 `initReveal`(IntersectionObserver)로 만들려다가, `.next-section`이 `.hero-pin` 바로 뒤 문서 흐름에 있어서 **핀이 아직 화면을 덮고 있는 동안에도 기하학적으로는 이미 "보이는 중"**이라 옵저버가 너무 일찍 발동해버려서(핀 뒤에 숨어 있는 채로 모션이 다 끝나버림) 대신 기존 스크롤 진행률 값을 직접 재사용하는 방식으로 바꿈
    - ⚠️ 이 모션은 Claude Code 내장 브라우저 패널에서 라이브 스크롤로 검증하기 까다로웠음 — 이 패널의 "mobile" 프리셋에서 가끔 `window.innerHeight`가 실제 레이아웃 폭/높이(`getBoundingClientRect` 기준)와 다르게(최대 ~1.8배) 잘못 보고되는 경우가 있는데, `hero-home.js`의 리빌 진행률 계산이 전부 `window.innerHeight` 기준이라 이 버그가 나면 리빌 자체가 끝까지 안 끝남(모션 전체가 멈춰 보임). 코드 자체는 이미 검증된 `isComplete`/`holdProgress` 값을 그대로 재사용해서 로직상 문제는 없다고 보지만, 실기기(폰)에서 한 번 더 확인해볼 것
  - **"영감을 여는 사람들, Key Creator" 제목, 모바일에서만 콤마 뒤 줄바꿈**: `<br class="mobile-break">`을 데스크톱에선 `display:none`, 900px 이하에서만 `display:inline`으로 — 데스크톱은 한 줄 그대로, 모바일은 "영감을 여는 사람들," / "Key Creator" 두 줄로 나뉨
  - **제목·문구 텍스트를 위로, 열쇠 이미지는 더 크게 (모바일만)**: `.next-section`이 `justify-content: center`로 콘텐츠 전체를 세로 가운데 정렬하기 때문에, 텍스트 자체를 옮기는 대신 **문구(`p`) 아래 여백**으로 전체 블록의 키를 조절 — 이 여백을 늘리면 가운데 정렬 기준점이 아래로 밀리면서 텍스트는 위로, 열쇠는 상대적으로 아래로 내려간 것처럼 보임. 처음 40px→70px로 늘렸다가 "간격이 멀어 보인다"는 피드백으로 **20px**로 다시 좁힘(데스크톱 40px보다도 좁음 — 모바일에서 텍스트를 위로 올리는 목적 자체는 유지하되 텍스트-열쇠 간격은 오히려 데스크톱보다 타이트하게). 열쇠 이미지(`.key-link`)는 데스크톱과 같은 `61vw` 공식이 폰 폭에서는 최소값(220px)에 거의 붙어 작아 보여서, 모바일만 `clamp(260px, 85vw, 780px)`로 키움
  - **제목 글자 두께가 얇아 보인다는 문의 확인 결과 → 모바일만 700으로 예외 처리**: `.next-section h2`는 `font-weight: 600`이 정확히 계산되고 있고 Pretendard 600(세미볼드) 폰트 파일도 정상 로드됨(`document.fonts`로 직접 확인) — 코드 버그는 아니었음. 26px 정도의 작은 크기에서는 세미볼드가 상대적으로 얇아 보이는 게 타이포그래피에서 흔한 현상이라고 설명 → 모바일에서만 700을 써달라는 요청을 받아 `@media (max-width: 900px)` 블록 안에만 `font-weight: 700`을 추가(데스크톱 38px은 600 그대로, 사이트 전체 규칙의 "700은 안 씀"에 대한 명시적 예외 — 위 "웨이트 3가지" 절에도 기록)

## 파일명 변경 이력

`home.html/css/js` → `hero-home.*`, `index.html/styles.css` → `FindTheKey.html/css`로 리네임(웹서버가 `index.html`을 루트로 서빙하는 관례와 헷갈리지 않게). `index.html`은 리다이렉트 전용 파일 — **첫 화면은 `hero-home.html`로 확정**(예전엔 `FindTheKey.html`로 바로 갔음).

## 알아두면 좋은 것

- Pretendard는 jsdelivr CDN에서 로드(오프라인이면 폰트 깨짐)
- GitHub `sarahkim-bucketplace/special-creator`. **저장소는 public이고 GitHub Pages가 켜져 있음** (예전 메모의 "private"은 틀림 — 코드·이미지·크레딧이 전부 공개됨. 공개하면 안 되는 자료가 있으면 private 전환 필요, 무료 계정에선 private으로 바꾸면 Pages도 꺼짐). 다른 Mac에서 이어가려면 `git clone` → 이후 `git pull`
- **공유용 링크(Pages)**: 메인 통합 페이지 `https://sarahkim-bucketplace.github.io/special-creator/FindTheKey.html`, 첫 히어로(열쇠구멍) 화면 `https://sarahkim-bucketplace.github.io/special-creator/hero-home.html`, 루트(`/special-creator/`)는 `index.html` 리다이렉트로 `hero-home.html`로 감. push 후 반영에 1~2분. ⚠️ **이 대소문자·한글 파일명 200 확인은 `assets/`를 00-hero~04-voices로 재구성하기 전 상태 기준** — 폴더를 통째로 옮긴 뒤(로컬 `git mv`로는 확인했지만) 실제 배포본에서 재검증 안 함, push 후 꼭 한 번 훑어볼 것. `assets/`가 약 940MB라 첫 로딩이 느릴 수 있음
- **push 인증**: 이 컴퓨터엔 `gh` CLI가 없고 git은 macOS 키체인의 Fine-grained PAT를 씀(토큰 이름 `special-creator-clone`, `Contents` **Read and write** 필수 — Read-only면 clone/pull만 되고 push는 403). 인증이 한 번 실패하면 git이 키체인 항목을 지우니 새 토큰으로 터미널에서 `git push`를 직접 실행해 `Username`(GitHub 아이디, 토큰 아님)/`Password`(토큰)를 입력해야 함. **토큰을 채팅/스크린샷에 노출하면 즉시 Regenerate할 것**
- iCloud Drive 경로에서 `preview_start` dev-server 모드로 `python3 -m http.server`를 띄우면 `PermissionError`가 남 → Bash로 직접 `python3 -m http.server 5173 &` (죽은 서버가 404를 계속 내면 죽이고 프로젝트 폴더에서 다시 띄울 것)
- **Claude Code 내장 브라우저 패널의 함정**: ① CSS/JS 캐시를 심하게 먹음 — 수정이 안 보이면 `curl`로 서버 응답부터 확인하고 `fetch(url,{cache:'reload'})` 후 새로고침. 실제 Chrome은 `Cmd+Shift+R` ② 스크린샷이 빈 화면으로 나오는 일이 잦음 → 텍스트/DOM/`getBoundingClientRect` 측정으로 검증 ③ 창 폭이 좁으면(≤900/600px) 모바일 CSS가 적용돼 측정값이 달라짐 → 측정 전에 `resize_window`로 폭을 지정(desktop 프리셋으로 되돌리는 것도 잊지 말 것) ④ 마우스 hover는 폭 768px 미만(터치 에뮬레이션)에서 안 먹음 ⑤ **"mobile" 프리셋에서 `window.innerWidth`/`innerHeight`가 실제 레이아웃(= `getBoundingClientRect`/`screen.width`/`screen.height` 기준)보다 최대 ~1.8배 크게 잘못 보고될 때가 있음** — `getBoundingClientRect` 너비는 정확한데 `innerHeight`만 어긋나는 식이라 알아채기 쉽지 않음. `window.innerHeight`를 직접 읽는 스크립트(`hero-home.js`의 스크롤 진행률 계산 등)를 이 패널에서 검증할 땐 그 결과를 못 믿을 수 있으니 `screen.height`나 `getBoundingClientRect` 쪽을 기준으로 교차 확인할 것
- 브라우저 도구(Claude in Chrome 확장)가 응답이 없을 수 있음 — 그땐 사용자에게 Chrome 캡처를 받거나 DOM 측정으로 판단할 것

## 남은 할 일 / 미검증

- **모바일 디테일**: 폰트·간격은 5단계 규칙으로 정리했지만(위 "모바일" 참고), 스크롤 연출(scroll-snap/멈춤 스크립트/키 사진 확대)이 폰에서 어떻게 보이는지는 미확인. OU 상세 팝업의 모바일 값은 아직 손대지 않음
- **안 쓰는 이미지**(일부러 남겨둠, 지울지 결정 필요): `assets/01-about/rolling/rolling-06.jpg`·`rolling-07.jpg`·`about-01.jpg`
- 브랜드 로고 롤링(`.brand-rolling__item`, 152×59 박스, `contain`)을 사용자가 통일된 로고 세트로 새로 교체 예정 — 박스를 꽉 채우는 이미지로 만들려면 **152×59 비율(2배 해상도면 304×118)**로 준비할 것
- 트로피 커서 추적/드래그 동작의 실제 화면 검증
- About 파트 내부 간격·폰트 정리는 스크롤 연출과 얽혀 있어 아직 손대지 않음
