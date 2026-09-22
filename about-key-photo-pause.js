// guarantees the "stop once, then continue" buffer for the key-photo
// frame — same pattern as stats-pause.js / about-badge-pause.js, except
// it centers the frame instead of aligning it to a small top offset: this
// one is meant to read as "the image arrives and holds, by itself" before
// the lead-in line fades in (about-key-photo-grow.js's TEXT1_LINE) and,
// later, the frame grows to fullscreen.
(function () {
  const stage = document.getElementById('about-key-photo');
  if (!stage) return;

  const RESTING_HEIGHT = 568; // must match about-key-photo-grow.js
  const LOCK_MS = 600;
  const TRIGGER_MARGIN = 150; // start reacting a bit before dead-centered
  let triggered = false;
  let ticking = false;

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  // window.effVH() (viewport.js), not the raw innerHeight, so this matches
  // about-key-photo-grow.js's own copy of the same formula and the pause
  // point stays consistent across screens with very different real heights
  function centeredTop() {
    return (window.effVH() - RESTING_HEIGHT) / 2;
  }

  function check() {
    ticking = false;
    if (triggered) return;
    const top = stage.getBoundingClientRect().top;
    const target = centeredTop();
    if (top <= target + TRIGGER_MARGIN && top > -window.innerHeight) {
      triggered = true;
      document.documentElement.style.scrollSnapType = 'none';
      window.scrollTo(0, window.scrollY + (top - target));
      lockScroll();
      window.setTimeout(() => {
        unlockScroll();
        document.documentElement.style.scrollSnapType = '';
        if (window.markPauseUnlock) window.markPauseUnlock();
      }, LOCK_MS);
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(check);
    },
    { passive: true }
  );

  check();
})();
