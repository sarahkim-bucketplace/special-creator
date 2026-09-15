// guarantees the "stop once, then continue" buffer for each resting point
// in the opening quote/trophy/quote sequence, same pattern as
// stats-pause.js / btd-gift-pause.js. Both .insight--key and
// .insight--after-trophy carry scroll-snap-align:start (FindTheKey.css)
// so they're valid mandatory-snap resting points, but native snap alone
// wasn't reliable — a fast scroll could carry straight through one before
// it ever settled into view.
//
// This does NOT use IntersectionObserver (tried first) — with two stops
// only ~950px apart, a single fast flick can cross both stops' geometry
// between the sparse, batched frames IntersectionObserver actually samples
// on a real trackpad gesture, so the second one's callback simply never
// fires. Same failure mode already hit and fixed in btd-gift-toggle.js's
// accordion (see its comment) by recomputing from live scroll position on
// every 'scroll' event instead of waiting for an edge-triggered crossing —
// applying that same fix here.
(function () {
  const LOCK_MS = 600;
  const REFERENCE_LINE = 300; // generous band — these stops sit close together

  const targets = Array.from(document.querySelectorAll('.insight--key, .insight--after-trophy'));
  if (!targets.length) return;

  const handled = new Set();
  let busy = false;
  let ticking = false;

  function lockOnto(el) {
    busy = true;
    document.documentElement.style.scrollSnapType = 'none';
    el.scrollIntoView({ block: 'start' });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.scrollSnapType = '';
      busy = false;
      // re-check right away in case the next stop is already within range
      checkTargets();
    }, LOCK_MS);
  }

  function checkTargets() {
    ticking = false;
    if (busy) return;
    for (const el of targets) {
      if (handled.has(el)) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= REFERENCE_LINE && top > -window.innerHeight) {
        handled.add(el);
        lockOnto(el);
        return;
      }
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(checkTargets);
    },
    { passive: true }
  );

  // in case one is already in range on load (e.g. a mid-page refresh)
  checkTargets();
})();
