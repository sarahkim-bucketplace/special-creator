// Sticky-stacked photo story for "직접 만나 나누는 시간". Two rounds of
// feedback against the reference screen recording landed on this model:
//
// 1. A flat vh-tall item box left empty scroll space below each (much
//    shorter) photo, so the next photo's sticky pin never even started
//    until that blank scroll finished — nothing ever overlapped.
// 2. A flat negative margin-top made items overlap in normal flow, but
//    by a *constant* amount everywhere — every transition looked the same.
// 3. Direct correction: the photo that's currently centered/active should
//    have ~no overlap in front of it, and the overlap should widen
//    progressively the further a photo is pushed toward the back of the
//    stack — "like images arranged along the surface of a circle/sphere,"
//    where the ones facing the viewer show fully and the ones curving
//    away are increasingly foreshortened behind the ones in front.
//
// That's a circular easing curve, not a constant offset. Each item's
// entrance is driven every scroll frame by --enter (a translateY on the
// sticky .btd-gallery__stack-photo, no CSS transition — the easing IS the
// motion, so a transition here would just lag behind the math): near the
// start of its entrance window the extra offset stays close to the plain
// linear amount (barely any lead — imperceptible overlap), then rapidly
// collapses to 0 as it finishes, so the covering happens mostly in the
// back half of the scroll range instead of evenly. That's the classic
// quarter-circle relationship (extra = ED * (sqrt(1-p^2) - (1-p))).
//
// The scale/shadow "pop" as a photo becomes fully active is a separate,
// occasional class toggle (.is-active) with its own CSS transition, kept
// on a nested -inner element so it doesn't fight the per-frame --enter
// writes on the outer sticky element (see FindTheKey.css for why).
(function () {
  const items = Array.from(document.querySelectorAll('.btd-gallery__stack-item'));
  if (!items.length) return;

  const photos = Array.from(items, (item) => item.querySelector('.btd-gallery__stack-photo'));
  const inners = Array.from(items, (item) => item.querySelector('.btd-gallery__stack-photo-inner'));

  const DWELL = 20; // px of scroll a photo stays fully pinned/uncovered once active
  const ENTRANCE_DISTANCE = 320; // px of scroll over which the next photo eases in

  let activationY = [];

  function layout() {
    items.forEach((item, i) => {
      const inner = inners[i];
      if (!inner) return;
      const isLast = i === items.length - 1;
      const photoHeight = inner.getBoundingClientRect().height;
      const dwell = isLast ? DWELL + window.innerHeight * 0.4 : DWELL;
      item.style.height = `${photoHeight + dwell}px`;
      item.style.marginTop = '0';
    });

    // second pass: cumulative doc-space top of each item, and the
    // scrollY at which its photo's natural (untransformed) position
    // reaches the sticky offset (96px) — i.e. when it fully activates
    const galleryTop = items[0].getBoundingClientRect().top + window.scrollY;
    let cursor = galleryTop;
    activationY = items.map((item) => {
      const activation = cursor - 96;
      cursor += item.offsetHeight;
      return activation;
    });

    updateEnter();
  }

  function updateEnter() {
    const scrollY = window.scrollY;
    for (let i = 1; i < items.length; i++) {
      const entranceStart = activationY[i] - ENTRANCE_DISTANCE;
      const p = Math.max(0, Math.min(1, (scrollY - entranceStart) / ENTRANCE_DISTANCE));
      const linear = 1 - p;
      const circular = Math.sqrt(1 - p * p);
      const extra = ENTRANCE_DISTANCE * (circular - linear);
      photos[i].style.setProperty('--enter', `${extra.toFixed(1)}px`);
    }
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateEnter();
      ticking = false;
    });
  }

  window.addEventListener('load', layout);
  window.addEventListener('resize', layout);
  window.addEventListener('scroll', onScroll, { passive: true });
  layout();

  // pop each photo in with a small overshoot-scale as it becomes the
  // active (topmost pinned) one, instead of just snapping into place
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const i = items.indexOf(entry.target);
        const inner = inners[i];
        if (!inner) return;
        inner.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { rootMargin: '-96px 0px -55% 0px', threshold: 0 }
  );
  items.forEach((item) => io.observe(item));
})();
