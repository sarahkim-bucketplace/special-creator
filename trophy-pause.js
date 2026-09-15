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
  // native mandatory scroll-snap re-engaging between the two locks (as soon
  // as the first one releases) is what kept carrying real trackpad
  // momentum straight past the second stop before its own lock ever got a
  // chance to grab it — toggling snap off/on per-lock wasn't enough.
  // Instead: the moment the FIRST of these two targets is seen anywhere
  // near, snap stays off for this whole quote/trophy/quote stretch, and
  // only comes back once both stops are done.
  let snapSuppressed = false;

  function suppressSnap() {
    if (snapSuppressed) return;
    snapSuppressed = true;
    document.documentElement.style.scrollSnapType = 'none';
  }

  function restoreSnapIfDone() {
    if (targets.every((el) => handled.has(el))) {
      document.documentElement.style.scrollSnapType = '';
      snapSuppressed = false;
    }
  }

  function lockOnto(el) {
    busy = true;
    el.scrollIntoView({ block: 'start' });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      busy = false;
      restoreSnapIfDone();
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
        suppressSnap();
        handled.add(el);
        lockOnto(el);
        return;
      }
      // approaching (within a couple viewport heights) — kill snap early
      // so it can't yank past this target before checkTargets next runs
      if (top <= window.innerHeight * 2) {
        suppressSnap();
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
