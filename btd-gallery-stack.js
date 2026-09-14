// Sticky-stacked photo story for "직접 만나 나누는 시간", driven by a
// circular/foreshortening metaphor: the centered/active photo has ~no
// overlap in front of it, and the overlap should widen progressively the
// further a photo is pushed toward the back of the stack — like images
// arranged along the surface of a circle/sphere, where the ones facing
// the viewer show fully and the ones curving away are increasingly
// foreshortened behind the ones in front.
//
// The first version drove this with the literal quarter-circle equation
// (sqrt(1-p^2)), which is where the motion still felt off: that curve's
// velocity is unbounded as p -> 1 (a vertical tangent), so the photo
// briefly moved at 3x+ the user's actual scroll speed right as it locked
// into place — a visible "yank" no real scrolling (or the reference
// recording) ever does. Swapped for extra = ED * p * (1 - p): a plain
// parabola that keeps the same "slow near the front, faster toward the
// back" shape but stays smooth and bounded (peak relative speed 2x,
// reached gradually, not a spike) — same silhouette as a circular arc,
// without the singularity.
//
// --enter is a translateY on the sticky .btd-gallery__stack-photo,
// written every scroll frame with no CSS transition — the easing IS the
// motion, so a transition here would just lag behind the math.
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
      const extra = ENTRANCE_DISTANCE * p * (1 - p);
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
})();
