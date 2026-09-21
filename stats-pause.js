// guarantees the "stop once, then continue" buffer for the stats pair: the centered
// statement ("스페셜 크리에이터의 이야기는 …") plus the four count-up numbers right below it.
// The two are treated as ONE block and centered vertically in the area under the fixed
// header — the logo wall above has already scrolled off by then (this used to pin the logo
// wall at the top instead; the stop now happens one beat later, on the statement + numbers).
//
// .stats-intro carries scroll-snap-align:start (FindTheKey.css) with a scroll-margin that
// puts the block in the same centered spot, so it's a valid mandatory-snap resting point,
// but native snap alone wasn't reliable — a fast scroll or trackpad flick could carry
// straight through it — so this also locks the scroll for a moment once, same pattern as
// insight-after-trophy-pause.js / about-key-photo-pause.js. Setting overflow:hidden (instead
// of preventDefault on wheel events) removes the ability to scroll at the layout level, which
// isn't subject to trackpad momentum "already in flight".
//
// Recomputes from the live scroll position on every 'scroll' event rather than using an
// IntersectionObserver: a fast flick can cross the target's geometry between the sparse,
// batched frames an observer actually samples, so its callback would never fire.
(function () {
  const intro = document.querySelector('.stats-intro');
  const stats = document.querySelector('.stats');
  if (!intro || !stats) return;

  const HEADER_HEIGHT = 72;
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

  // where the block's top should sit so the whole statement+numbers block is centered in the
  // visible area under the header
  function centeredTop() {
    const blockHeight = stats.getBoundingClientRect().bottom - intro.getBoundingClientRect().top;
    return HEADER_HEIGHT + (window.innerHeight - HEADER_HEIGHT - blockHeight) / 2;
  }

  function check() {
    ticking = false;
    if (triggered) return;
    const top = intro.getBoundingClientRect().top;
    const target = centeredTop();
    if (top <= target + TRIGGER_MARGIN && top > -window.innerHeight) {
      triggered = true;
      document.documentElement.style.scrollSnapType = 'none';
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
