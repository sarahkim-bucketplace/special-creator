// the "key" quote-photo rests small showing the image only, gets paused
// centered on screen by about-key-photo-pause.js (which shares centerLine()
// below), reveals the lead-in line right there without moving, then —
// as soon as the user resumes scrolling — grows to fill the screen while
// crossfading to the second line, then releases to scroll away. Same
// pin-and-grow technique as the hero photo's own fullscreen grow
// (about-hero-roll.js), just without that one's photo cycling or
// entering-rise beforehand.
//
// Zones as the wrapper scrolls through the viewport (by wrapper.rect.top):
//   before   rect.top > centerLine()          stage absolute at the wrapper's top, small
//            (d = centerLine() - rect.top)     resting size, image only, no text — visually
//                                               identical to being in normal flow, so no jump
//                                               once it reaches centerLine() and pins there
//   growing  0 <= d < growRange()              stage fixed, growing from that small centered
//                                               size to fullscreen; text 1 is already visible
//                                               at d=0 (the paused position) and crossfades to
//                                               text 2 partway through the grow — no separate
//                                               scroll step or frame movement in between
//   after    d >= growRange()                  stage frozen fullscreen, released to
//                                               position:absolute so it scrolls away with the
//                                               page. settleRange() of trailing empty space is
//                                               added to the wrapper on top of this, purely so
//                                               the frame fully clears the viewport before the
//                                               next quote (.insight--after-trophy, right after
//                                               in the document) begins its own reveal
(function () {
  const wrapper = document.getElementById('key-photo-roll');
  const stage = document.getElementById('about-key-photo');
  const text1 = stage ? stage.querySelector('.about-key-photo__text--1') : null;
  const text2 = stage ? stage.querySelector('.about-key-photo__text--2') : null;
  if (!wrapper || !stage || !text1 || !text2) return;

  // .about-key-photo's rest size per the CSS breakpoints (mirrored here
  // rather than read live via stage.offsetWidth/Height, since the
  // growing/after phases override those inline) — RESTING_HEIGHT must
  // match about-key-photo-pause.js's own copy
  function restingWidth() {
    return Math.min(963, window.innerWidth - 70);
  }
  function restingHeight() {
    return 568;
  }
  // where the pause script holds the frame centered — growing starts
  // exactly here, so there's no dead scroll between "paused" and "growing"
  function centerLine() {
    return (window.innerHeight - restingHeight()) / 2;
  }

  function growRange() {
    return window.innerHeight * 1.1;
  }
  const MAX_GROW_BLUR = 20; // matches about-hero-roll.js's own dissolve blur
  function settleRange() {
    // same "just enough, plus a small buffer" geometry as
    // about-hero-roll.js's settleRange — guarantees the grown frame fully
    // clears the viewport before the next quote's own margin-top (120px)
    // starts to enter it
    const NEXT_MARGIN_TOP = 120;
    const BUFFER = 40;
    return Math.max(0, 2 * window.innerHeight - NEXT_MARGIN_TOP + BUFFER);
  }

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function setWrapperHeight() {
    // from the wrapper's own top (0) down through wherever the grow
    // finishes (growRange() - centerLine() below that), plus a full
    // screen for the frozen fullscreen frame itself, plus the settle gap
    wrapper.style.height = growRange() - centerLine() + window.innerHeight + settleRange() + 'px';
  }

  function wrapperLeftOffset() {
    return wrapper.getBoundingClientRect().left;
  }

  let wrapperTop = 0;
  let wrapperBottom = 0;
  function measureBounds() {
    wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    wrapperBottom = wrapperTop + wrapper.offsetHeight;
  }

  let ticking = false;
  let lastZone = null;

  function update() {
    const rect = wrapper.getBoundingClientRect();

    if (rect.top > centerLine()) {
      stage.style.position = 'absolute';
      stage.style.top = '0px';
      stage.style.left = '50%';
      stage.style.transform = 'translateX(-50%)';
      stage.style.width = restingWidth() + 'px';
      stage.style.height = restingHeight() + 'px';
      stage.style.borderRadius = '20px';
      stage.style.filter = '';
      stage.style.zIndex = '';
      text1.style.opacity = '0';
      text2.style.opacity = '0';
      lastZone = 'before';
    } else {
      const d = centerLine() - rect.top;
      if (d < growRange()) {
        // rawT (0-1) covers the whole grow+hold+dissolve sequence, but the
        // *size* only grows across its first half (sizeT) — freeing up the
        // second half as a genuine sharp, still hold before the dissolve
        // even starts, so text 2 stays clearly readable for longer, and
        // the blur itself ramps across a wider (slower) stretch than before
        const rawT = clamp(d / growRange(), 0, 1);
        const sizeT = easeInOutCubic(clamp(rawT / 0.5, 0, 1));
        const fromWidth = restingWidth();
        const fromHeight = restingHeight();
        const fromLeft = (window.innerWidth - fromWidth) / 2;
        stage.style.position = 'fixed';
        stage.style.top = lerp(centerLine(), 0, sizeT) + 'px';
        stage.style.left = lerp(fromLeft, 0, sizeT) + 'px';
        stage.style.width = lerp(fromWidth, window.innerWidth, sizeT) + 'px';
        stage.style.height = lerp(fromHeight, window.innerHeight, sizeT) + 'px';
        stage.style.transform = 'none';
        stage.style.borderRadius = lerp(20, 0, sizeT) + 'px';
        stage.style.zIndex = '';
        // text 1 is already fully visible at rawT=0 (the paused spot);
        // crossfade to text 2 early, well before the size finishes growing
        const textT = clamp((rawT - 0.2) / 0.2, 0, 1);
        // sharp hold from rawT 0.4 to 0.75 (fullscreen since sizeT=1 by
        // 0.5), then blurs out across a wide 0.75-1 stretch, dissolving
        // into whatever scrolls up next — same idea as
        // about-hero-roll.js's own fullscreen dissolve, just slower. text 2
        // fades out together with the blur instead of sitting there
        // readable-but-blurred
        const blurT = clamp((rawT - 0.75) / 0.25, 0, 1);
        text1.style.opacity = String(1 - textT);
        text2.style.opacity = String(textT * (1 - blurT));
        stage.style.filter = `blur(${blurT * MAX_GROW_BLUR}px)`;
        lastZone = 'during';
      } else {
        stage.style.position = 'absolute';
        // wrapper-relative offset that keeps this flush with the fixed
        // frame's last position (viewport top 0) at the current scroll
        stage.style.top = growRange() - centerLine() + 'px';
        // position:absolute's left is relative to .key-photo-roll's own
        // box, not the viewport — same fix as about-hero-roll.js's
        // frozen frame, canceling the wrapper's own inset so this stays
        // flush full-bleed instead of drifting off to one side
        stage.style.left = -wrapperLeftOffset() + 'px';
        stage.style.width = window.innerWidth + 'px';
        stage.style.height = window.innerHeight + 'px';
        stage.style.transform = 'none';
        stage.style.borderRadius = '0px';
        stage.style.filter = `blur(${MAX_GROW_BLUR}px)`;
        // position:absolute is still a *positioned* element, so on its own
        // it would keep painting above the next (non-positioned) quote
        // even once scrolled past it — a negative z-index drops it behind
        // normal-flow content instead (same fix as about-hero-roll.js)
        stage.style.zIndex = '-1';
        text1.style.opacity = '0';
        text2.style.opacity = '0';
        lastZone = 'after';
      }
    }

    ticking = false;
  }

  function onScroll() {
    // the transition into "growing" happens at centerLine(), not at the
    // wrapper's own top (0) — the "active" window has to extend forward
    // by that same amount, or this skip-check would freeze updates right
    // as the frame reaches its paused/centered spot
    const y = window.scrollY;
    const zone = y < wrapperTop - centerLine() ? 'before' : y > wrapperBottom ? 'after' : 'during';
    if (zone !== 'during' && zone === lastZone) return;

    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    setWrapperHeight();
    measureBounds();
    onScroll();
  });
  setWrapperHeight();
  measureBounds();
  update();
})();
