// guarantees the "stop once, then continue" buffer the user asked for —
// relying on scroll-snap-type:y mandatory alone to catch an intermediate
// point (see FindTheKey.css) turned out unreliable: with a big wheel/
// trackpad scroll, the browser can settle on the *next* snap point and
// skip .stats entirely. This forces it: the first time .stats crosses a
// band just below the header, snap the scroll exactly there and briefly
// swallow wheel/touch input so it reads as a deliberate pause, then let
// scrolling continue normally
(function () {
  const stats = document.querySelector('.stats');
  if (!stats) return;

  const LOCK_MS = 500;
  let triggered = false;

  function preventScroll(e) {
    e.preventDefault();
  }

  function lockScroll() {
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
  }

  function unlockScroll() {
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          observer.disconnect();
          stats.scrollIntoView({ block: 'start' });
          lockScroll();
          window.setTimeout(unlockScroll, LOCK_MS);
        }
      });
    },
    { threshold: 0, rootMargin: '-72px 0px -85% 0px' }
  );

  observer.observe(stats);
})();
