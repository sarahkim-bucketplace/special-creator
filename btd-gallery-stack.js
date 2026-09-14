// Coverflow photo story for "직접 만나 나누는 시간". Per direct correction
// against the reference recording: this isn't a one-way "next photo
// covers the previous one" stack — the photo nearest the focus point
// (roughly viewport-center) is biggest and fully opaque, and every other
// photo, whether already passed or still arriving, shrinks and fades
// symmetrically the further it sits from that point.
//
// Earlier versions drove this with position:sticky (pinning each photo
// at a fixed top, then having the next one cover it) and needed
// increasingly elaborate math — an entrance easing curve, a dwell
// buffer, a negative margin — to fake the overlap. This version drops
// sticky entirely: every photo just scrolls normally, and --scale/--dim
// are a plain continuous function of that photo's on-screen distance
// from the focus point, recomputed every scroll frame. Simpler, matches
// the reference's symmetric taper (which one-way covering never could),
// and cheaper — no getBoundingClientRect() in the scroll handler at all,
// just arithmetic against doc-space positions cached once in layout().
(function () {
  const items = Array.from(document.querySelectorAll('.btd-gallery__stack-item'));
  if (!items.length) return;

  const photos = Array.from(items, (item) => item.querySelector('.btd-gallery__stack-photo'));
  const inners = Array.from(items, (item) => item.querySelector('.btd-gallery__stack-photo-inner'));

  const OVERLAP_RATIO = 0.3; // how much of each photo's height the next one overlaps, in normal flow
  const MIN_SCALE = 0.72;
  const MIN_OPACITY = 0.35;
  const FALLOFF = 750; // px of on-screen distance from the focus point over which scale/opacity taper to their minimum — wider than the item spacing so each photo holds near-full size/opacity for longer instead of the next one crowding in right away

  let centerY = []; // doc-space vertical center of each photo, once laid out
  let focusY = 0;
  let rangeTop = 0;
  let rangeBottom = 0;

  function layout() {
    // measured from the OUTER element, not -inner: -inner carries the
    // transform:scale(var(--scale)) that this same script drives, so at
    // load time (before any item has reached scale 1) reading its rect
    // would capture an already-shrunk size and throw off every spacing
    // calc below it — the outer element is never transformed, so its
    // rect is always the true, unscaled photo size
    const photoHeight = photos[0].getBoundingClientRect().height;
    const overlap = photoHeight * OVERLAP_RATIO;

    items.forEach((item, i) => {
      item.style.marginTop = i === 0 ? '0' : `-${overlap.toFixed(1)}px`;
    });

    // true center of the *visible* viewport — below the 72px fixed
    // header, not the raw window center, so the biggest/clearest photo
    // actually lines up with where the screen looks centered to the eye
    const HEADER_HEIGHT = 72;
    focusY = HEADER_HEIGHT + (window.innerHeight - HEADER_HEIGHT) / 2;

    const galleryTop = items[0].getBoundingClientRect().top + window.scrollY;
    centerY = items.map((_, i) => galleryTop + photoHeight / 2 + i * (photoHeight - overlap));

    rangeTop = centerY[0] - focusY - FALLOFF;
    rangeBottom = centerY[centerY.length - 1] - focusY + FALLOFF;

    update();
  }

  function update() {
    const scrollY = window.scrollY;
    for (let i = 0; i < items.length; i++) {
      const onScreenCenter = centerY[i] - scrollY;
      const distance = Math.abs(onScreenCenter - focusY);
      const t = Math.max(0, 1 - distance / FALLOFF);
      const scale = MIN_SCALE + (1 - MIN_SCALE) * t;
      const opacity = MIN_OPACITY + (1 - MIN_OPACITY) * t;
      inners[i].style.setProperty('--scale', scale.toFixed(3));
      inners[i].style.setProperty('--dim', opacity.toFixed(3));
      photos[i].style.zIndex = Math.round(t * 1000);
    }
  }

  let ticking = false;
  function onScroll() {
    // cheap range check (plain arithmetic, no layout read) so this skips
    // entirely once scrolled well clear of the gallery — see the same
    // guard in about-roll.js for why that matters for scroll perf
    if (window.scrollY < rangeTop || window.scrollY > rangeBottom) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  window.addEventListener('load', layout);
  window.addEventListener('resize', layout);
  window.addEventListener('scroll', onScroll, { passive: true });
  layout();
})();
