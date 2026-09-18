// guarantees the "stop once, then continue" buffer for the closing quote
// before the trophy — same pattern as about-key-photo-pause.js, centering
// this text on screen instead of aligning it to a small top offset. No
// hardcoded height needed here (unlike that frame): this element is
// plain text, never resized by JS, so its own live offsetHeight is
// reliable to measure directly.
(function () {
  const el = document.querySelector('.insight--after-trophy');
  if (!el) return;

  const LOCK_MS = 600;
  const TRIGGER_MARGIN = 400; // wide catch window — a fast flick can otherwise skip past a narrow one between scroll events entirely
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

  function centeredTop() {
    return (window.innerHeight - el.offsetHeight) / 2;
  }

  function check() {
    ticking = false;
    if (triggered) return;
    const top = el.getBoundingClientRect().top;
    const target = centeredTop();
    // .trophy-placeholder right after this quote carries its own native
    // scroll-snap-align — left alone, that snap can pull scroll back
    // before this element's own (narrower) trigger condition below is
    // ever satisfied. Suppressing snap as soon as this quote is anywhere
    // near, not just at the trigger instant, is the same fix
    // trophy-pause.js already needed for the exact same reason.
    if (top <= window.innerHeight * 2) {
      document.documentElement.style.scrollSnapType = 'none';
    }
    if (top <= target + TRIGGER_MARGIN && top > -window.innerHeight) {
      triggered = true;
      window.scrollTo(0, window.scrollY + (top - target));
      lockScroll();
      window.setTimeout(() => {
        unlockScroll();
        document.documentElement.style.scrollSnapType = '';
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
