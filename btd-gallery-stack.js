// sizes each .btd-gallery__stack-item to its own photo's rendered height
// (which varies per image's aspect-ratio) plus a short dwell buffer,
// instead of a flat vh value. A flat vh left a large blank gap in the
// item box below the (much shorter) photo, so the next photo's sticky
// pin never started until that blank scroll finished — the two photos
// were never stuck on screen at the same time, so nothing appeared to
// overlap. Sizing to photoHeight + DWELL keeps the pause short enough
// that the next photo's box begins while the current one is still
// pinned, so it slides up and covers it as intended.
//
// Re-checked against the reference screen recording frame-by-frame:
// newmix never holds a single photo alone for long — 2-3 photos are
// visible/overlapping at almost all times, stepping through in a tight,
// continuous cascade rather than "pin, long pause, then cover". DWELL
// was dropped from 320 to 90 to match that tighter pacing, and each
// incoming photo now gets a quick scale/shadow "pop" (see the
// IntersectionObserver below + the .is-active rule in FindTheKey.css)
// so the moment it takes over reads as a snappy settle rather than a
// flat swap — the "쫀득함" the reference has.
(function () {
  const items = document.querySelectorAll('.btd-gallery__stack-item');
  if (!items.length) return;

  const DWELL = 90;

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

  // pop each photo in with a small overshoot-scale as it becomes the
  // active (topmost pinned) one, instead of just snapping into place
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const photo = entry.target.querySelector('.btd-gallery__stack-photo');
        if (!photo) return;
        photo.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { rootMargin: '-96px 0px -55% 0px', threshold: 0 }
  );
  items.forEach((item) => io.observe(item));
})();
