(function () {
  // initReveal is defined in scroll-reveal.js. The standalone BeyondTheDoor.html this
  // file used to also serve (with its old .btd-gallery__photo grid) has been deleted —
  // FindTheKey.html's gallery was rebuilt as a sticky-stacked story (btd-gallery-stack.js)
  // long before that, so the .btd-gallery__photo reveal call this file used to carry was
  // already dead here and has been dropped.

  // 여정 리스트 — 각 단계는 텍스트+사진이 한 덩어리로 같이 나타남
  initReveal('.btd-journey__row');
})();
