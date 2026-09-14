// scroll-linked parallax for the "직접 만나 나누는 시간" photo mosaic,
// loosely inspired by newmixcoffee.com/ko's staggered scrolling photos —
// but that reference site has sparse, overlapping images with room to
// drift; this grid is packed edge-to-edge with 15px gaps, so moving the
// elements themselves (transform/translateY) would open gaps or overlap
// neighbors. Instead each photo's background-position shifts a few px at
// its own speed as it crosses the viewport — the "window" into the image
// drifts, not the box itself, so the tight grid never breaks
(function () {
  const gallery = document.querySelector('.btd-gallery');
  if (!gallery) return;

  const photos = Array.from(gallery.querySelectorAll('.btd-gallery__photo'));
  if (!photos.length) return;

  // a handful of repeating speeds so neighboring photos don't drift in
  // lockstep — kept small (max ~18px) so it stays inside the cover-fit
  // image's overflow instead of revealing empty edges
  const SPEEDS = [0.06, 0.1, 0.08, 0.14, 0.05, 0.12];
  const MAX_OFFSET = 18;

  let ticking = false;

  function update() {
    const viewportCenter = window.innerHeight / 2;
    photos.forEach((photo, i) => {
      const rect = photo.getBoundingClientRect();
      const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
      const speed = SPEEDS[i % SPEEDS.length];
      const offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, -distanceFromCenter * speed));
      photo.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
