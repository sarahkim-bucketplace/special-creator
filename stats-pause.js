// guarantees the "stop once, then continue" buffer the user asked for.
// .stats also carries scroll-snap-align:start (FindTheKey.css) so it's a
// valid mandatory-snap resting point, but native snap alone wasn't
// reliable — on a fast wheel/trackpad scroll the browser can settle on the
// *next* snap point and skip an intermediate one, especially with a thin
// detection band or a throttled IntersectionObserver check. This forces
// it: the first time .stats starts entering the viewport at all, snap the
// scroll exactly to it and briefly swallow scroll input (wheel/touch/the
// common scroll keys) so it reads as a deliberate stop, then release
(function () {
  const stats = document.querySelector('.stats');
  if (!stats) return;

  const LOCK_MS = 500;
  const SCROLL_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Spacebar', 'Home', 'End'];
  let triggered = false;

  function preventScroll(e) {
    e.preventDefault();
  }

  function preventScrollKeys(e) {
    if (SCROLL_KEYS.includes(e.key)) e.preventDefault();
  }

  function lockScroll() {
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScrollKeys, { passive: false });
  }

  function unlockScroll() {
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', preventScrollKeys);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          observer.disconnect();
          lockScroll();
          stats.scrollIntoView({ block: 'start' });
          window.setTimeout(unlockScroll, LOCK_MS);
        }
      });
    },
    // no rootMargin shrinking — fires as soon as any part of .stats enters
    // the viewport at all, so a fast scroll can't jump clean over a thin
    // trigger band before the observer gets a chance to check
    { threshold: 0 }
  );

  observer.observe(stats);
})();
