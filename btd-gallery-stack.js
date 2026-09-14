// sizes each .btd-gallery__stack-item to its own photo's rendered height
// (which varies per image's aspect-ratio) plus a short dwell buffer,
// instead of a flat vh value. A flat vh left a large blank gap in the
// item box below the (much shorter) photo, so the next photo's sticky
// pin never started until that blank scroll finished — the two photos
// were never stuck on screen at the same time, so nothing appeared to
// overlap. Sizing to photoHeight + DWELL keeps the pause short enough
// that the next photo's box begins while the current one is still
// pinned, so it slides up and covers it as intended.
(function () {
  const items = document.querySelectorAll('.btd-gallery__stack-item');
  if (!items.length) return;

  const DWELL = 320;

  function layout() {
    items.forEach((item, i) => {
      const photo = item.querySelector('.btd-gallery__stack-photo');
      if (!photo) return;
      const isLast = i === items.length - 1;
      const photoHeight = photo.getBoundingClientRect().height;
      const dwell = isLast ? DWELL + window.innerHeight * 0.4 : DWELL;
      item.style.height = `${photoHeight + dwell}px`;
    });
  }

  window.addEventListener('load', layout);
  window.addEventListener('resize', layout);
  layout();
})();
