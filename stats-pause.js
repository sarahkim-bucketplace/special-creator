// guarantees the "stop once, then continue" buffer the user asked for.
// .stats also carries scroll-snap-align:start (FindTheKey.css) so it's a
// valid mandatory-snap resting point, but native snap alone wasn't
// reliable, and neither was an earlier version of this file that used
// preventDefault() on wheel/touchmove to hold the scroll position —
// trackpad momentum scrolling is already "in flight" as its own native
// animation by the time JS sees the events, and preventDefault on the
// individual wheel events doesn't reliably stop that already-committed
// momentum. Setting overflow:hidden instead removes the ability to
// scroll at the layout level, which isn't subject to that race.
(function () {
  const stats = document.querySelector('.stats');
  if (!stats) return;

  const LOCK_MS = 600;
  let triggered = false;

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          observer.disconnect();
          // land exactly on the snap point first, while still scrollable —
          // programmatic scrollIntoView still works once overflow is
          // hidden in most browsers, but doing it first avoids relying on that
          stats.scrollIntoView({ block: 'start' });
          lockScroll();
          window.setTimeout(unlockScroll, LOCK_MS);
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(stats);
})();
