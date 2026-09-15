// guarantees the "stop once, then continue" buffer the user asked for —
// pinned on .brand-rolling (the logo marquee), not .stats itself, so the
// logo wall and the stats numbers below it land in frame together. .stats
// has a 340px gap above it; pinning .stats at a small fixed offset would
// leave the logos scrolled off above (same class of issue fixed for the
// trophy/quote pair in trophy-pause.js). .brand-rolling carries
// scroll-snap-align:start (FindTheKey.css) so it's a valid mandatory-snap
// resting point, but native snap alone wasn't reliable, and neither was
// an earlier version of this file that used preventDefault() on
// wheel/touchmove to hold the scroll position — trackpad momentum
// scrolling is already "in flight" as its own native animation by the
// time JS sees the events, and preventDefault on the individual wheel
// events doesn't reliably stop that already-committed momentum. Setting
// overflow:hidden instead removes the ability to scroll at the layout
// level, which isn't subject to that race.
//
// Also rewritten from an IntersectionObserver version (same failure mode
// eventually hit and fixed in trophy-pause.js / btd-gift-toggle.js: a
// fast flick can cross the target's geometry between the sparse, batched
// frames IntersectionObserver actually samples, so the callback never
// fires) to recompute from live scroll position on every 'scroll' event
// instead of waiting for an edge-triggered crossing.
(function () {
  const stats = document.querySelector('.brand-rolling');
  if (!stats) return;

  const LOCK_MS = 600;
  const REFERENCE_LINE = 300;
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

  function check() {
    ticking = false;
    if (triggered) return;
    const top = stats.getBoundingClientRect().top;
    if (top <= REFERENCE_LINE && top > -window.innerHeight) {
      triggered = true;
      document.documentElement.style.scrollSnapType = 'none';
      stats.scrollIntoView({ block: 'start' });
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
