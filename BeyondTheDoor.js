(function () {
  // initReveal is defined in scroll-reveal.js (shared with FindTheKey.html)

  // "직접 만나 나누는 시간" 갤러리 — 사진 9장이 하나씩(80ms 시차) 나타남
  initReveal('.btd-gallery__photo', { stagger: 80 });

  // 여정 리스트 — 각 단계는 텍스트+사진이 한 덩어리로 같이 나타남
  initReveal('.btd-journey__row');
})();
