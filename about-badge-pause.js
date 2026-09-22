// guarantees the "stop once, then continue" buffer for the logo motion —
// same pattern as stats-pause.js / trophy-pause.js / etc. Pinned on the
// heading right before .about-badge, not the badge itself: the badge has
// a gap above it, so pinning *it* at a small fixed offset left the
// heading scrolled off above (same class of issue fixed for the
// brand-rolling/stats pair in stats-pause.js) — pinning the heading
// instead keeps both in frame together. .about-heading--before-badge
// carries scroll-snap-align:start (FindTheKey.css) so it's a valid
// mandatory-snap resting point, but native snap alone wasn't reliable —
// a fast scroll could carry straight through it before it ever settled
// into view.
//
// Plain scroll-margin-top alone isn't enough, though: on a short-ish
// desktop window (wide but not very tall), the heading+badge stack is
// shorter than the viewport, so the NEXT stop's content (the first quote,
// .insight--key) already peeks into view below the badge at the same
// time — the two stops end up showing the same screen instead of reading
// as separate pauses. Fixed by picking whichever scroll position scrolls
// further: the heading's normal small top offset, or (when the viewport
// is short enough that it would otherwise leave the badge's bottom edge
// well above the fold) a position that pins the *badge's bottom* to the
// viewport's bottom edge instead, pushing the next stop's content below
// the fold. On a tall viewport the two land on the same value anyway.
(function () {
  const restPoint = document.querySelector('.about-heading--before-badge');
  const badge = document.querySelector('.about-badge');
  if (!restPoint || !badge) return;

  const LOCK_MS = 600;
  const REFERENCE_LINE = 300;
  const REST_OFFSET = 130; // matches this heading's scroll-margin-top
  const BOTTOM_PADDING = 20;
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

  // window.effVH() (viewport.js), not the raw innerHeight, so whether this
  // falls back to the badge-bottom anchor (and by how much) is the same
  // across screens with very different real heights, instead of each
  // screen tripping the fallback differently and landing on a different
  // pair of elements in frame
  function targetScrollY() {
    const headingTopDocY = restPoint.getBoundingClientRect().top + window.scrollY;
    const badgeBottomDocY = badge.getBoundingClientRect().bottom + window.scrollY;
    const headingPin = headingTopDocY - REST_OFFSET;
    const badgeBottomAnchor = badgeBottomDocY - window.effVH() + BOTTOM_PADDING;
    return Math.max(headingPin, badgeBottomAnchor);
  }

  function check() {
    ticking = false;
    if (triggered) return;
    const top = restPoint.getBoundingClientRect().top;
    if (top <= REFERENCE_LINE && top > -window.innerHeight) {
      triggered = true;
      document.documentElement.style.scrollSnapType = 'none';
      window.scrollTo(0, targetScrollY());
      lockScroll();
      window.setTimeout(() => {
        unlockScroll();
        document.documentElement.style.scrollSnapType = '';
        if (window.markPauseUnlock) window.markPauseUnlock();
        // trophy-pause.js's .about-badge stop waits for this before it will
        // even consider locking onto the badge — see its own comment
        window.aboutBadgeHeadingPauseDone = true;
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
