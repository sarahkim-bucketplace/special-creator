(function () {
  // initReveal is defined in scroll-reveal.js (shared with FindTheKey.html).
  // This file is shared with the standalone BeyondTheDoor.html, which still
  // uses the old .btd-gallery__photo grid — on FindTheKey.html that
  // selector now matches nothing (the combined page's gallery was rebuilt
  // as a sticky-stacked story instead), so this call is a harmless no-op
  // there rather than something to remove
  initReveal('.btd-gallery__photo', { stagger: 80 });

  // 여정 리스트 — 각 단계는 텍스트+사진이 한 덩어리로 같이 나타남
  initReveal('.btd-journey__row');
})();
