// guarantees the "stop once, then continue" buffer for each resting point
// in the badge/quote/trophy/quote sequence, same pattern as
// stats-pause.js / btd-gift-pause.js. Two stops: .about-badge (logo above,
// first quote below — pinned on the badge rather than .insight--key
// itself, so the two land in frame together; the quote has a 140px gap
// above it, so pinning *it* scrolled the badge off above, same class of
// issue fixed for the heading/badge pair in about-badge-pause.js) and
// .trophy-placeholder itself (trophy above, second quote below — pinning
// .insight--after-trophy instead used to pin the QUOTE's top to a small
// fixed offset, which made it geometrically impossible for a tall trophy
// sitting above it to also fit in frame; pinning the trophy's own top
// instead mirrors how stop 1 works, just one element later). Both carry
// scroll-snap-align:start (FindTheKey.css) so they're valid mandatory-snap
// resting points, but native snap alone wasn't reliable — a fast scroll
// could carry straight through one before it ever settled into view.
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

  const targets = Array.from(document.querySelectorAll('.about-badge, .trophy-placeholder'));
  if (!targets.length) return;

  // .insight--key is deliberately left OFF the generic scroll-reveal
  // observer (find-the-key.js) — on a tall enough real viewport it could
  // cross that observer's reveal threshold and fade in on its own the
  // instant the badge above it settles, in the very same frame, no matter
  // how the badge's own pause point was tuned. Revealing it explicitly
  // here instead, the moment this script actually locks onto .about-badge,
  // ties it to "the user scrolled once more" rather than to raw document
  // position, so it's frame-height-independent.
  const badgeTarget = document.querySelector('.about-badge');
  const quote1 = document.querySelector('.insight--key');

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
    if (el === badgeTarget && quote1) quote1.classList.add('is-visible');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      busy = false;
      restoreSnapIfDone();
      if (window.markPauseUnlock) window.markPauseUnlock();
      // re-check right away in case the next stop is already within range —
      // pauseSafeToTrigger() below still holds it off until scrolling has
      // genuinely gone idle and the user scrolls again, this just means it
      // doesn't need its own separate listener
      checkTargets();
    }, LOCK_MS);
  }

  function checkTargets() {
    ticking = false;
    if (busy) return;
    // another pause script (about-badge-pause.js, or this script's own
    // previous stop) can have JUST unlocked — its programmatic scroll lands
    // the next target inside this script's trigger range as a side effect,
    // and a trackpad flick's inertial scroll can keep emitting deltas well
    // after the lock releases, regardless of whether the page could
    // actually scroll during it. Either would chain straight into the next
    // stop within the same physical scroll gesture, before the user ever
    // scrolled again on purpose, so the pair below used to appear in the
    // same breath as the pair above. pauseSafeToTrigger() (viewport.js)
    // only turns true once scrolling has actually gone idle since the last
    // unlock, so this only fires on a scroll the user made afterward.
    if (document.documentElement.style.overflow === 'hidden' || document.body.style.overflow === 'hidden') {
      return;
    }
    if (window.pauseSafeToTrigger && !window.pauseSafeToTrigger()) {
      return;
    }
    for (const el of targets) {
      if (handled.has(el)) continue;
      // the .about-badge stop specifically must not even be considered
      // until about-badge-pause.js's own heading+badge pause has fully
      // finished (unlocked) at least once — the overflow/idle guards above
      // help but, empirically, a scroll event landing in exactly the wrong
      // rAF frame could still let this run mid-way through that other
      // script's own lock. Requiring its explicit "done" flag closes that
      // race entirely instead of relying on timing.
      if (el === badgeTarget && !window.aboutBadgeHeadingPauseDone) continue;
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
