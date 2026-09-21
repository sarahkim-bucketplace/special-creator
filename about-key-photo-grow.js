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

  // phases, in viewport heights of scroll:
  //   0 -> GROW_VH      the frame grows to fullscreen (text 1 -> text 2 crossfade along the way)
  //   GROW_VH -> HOLD_VH  fullscreen and pinned, completely sharp (photo and text 2, no blur)
  //   after HOLD_VH     the frame is released and scrolls away with the page. It stays sharp until
  //                     BLUR_START (a fraction of its own height) has scrolled past the top of the
  //                     screen, then blurs (and text 2 fades) as the rest leaves
  const GROW_VH = 0.55;
  const HOLD_VH = 0.85;
  const BLUR_START = 0.5;
  function growRange() {
    return window.innerHeight * HOLD_VH;
  }
  const MAX_GROW_BLUR = 20; // matches about-hero-roll.js's own dissolve blur
  function settleRange() {
    // trailing space after the frozen fullscreen frame, sized so the frame's
    // bottom edge sits a fixed FRAME_TO_QUOTE_GAP above the next quote
    // (.insight--after-trophy, whose own margin-top is already part of that
    // gap). The frame is z-index:-1 above the quote in document order, so any
    // gap >= 0 never overlaps them — the old "2 * innerHeight" copy of
    // about-hero-roll.js's formula (different geometry there) left ~two
    // screens of empty scroll between the two
    const NEXT_MARGIN_TOP = 120;
    const FRAME_TO_QUOTE_GAP = 230;
    return Math.max(0, FRAME_TO_QUOTE_GAP - NEXT_MARGIN_TOP);
  }

  // while the frame covers the top of the screen (fullscreen through its
  // dissolve, until it scrolls off), the header's opaque backdrop band is
  // hidden so the photo reads edge-to-edge — see body.is-fullframe in
  // FindTheKey.css. Only touches the DOM when the state actually flips.
  const HEADER_HEIGHT = 72;
  let fullframe = false;
  function setFullframe(on) {
    if (on === fullframe) return;
    fullframe = on;
    document.body.classList.toggle('is-fullframe', on);
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
      setFullframe(false);
      lastZone = 'before';
    } else {
      const d = centerLine() - rect.top;
      if (d < growRange()) {
        // phases are laid out in absolute scroll distance (see GROW_VH/HOLD_VH):
        // the size only grows across the first stretch (sizeT), then a sharp still
        // hold, then the long blur tail
        const vh = window.innerHeight;
        const sizeT = easeInOutCubic(clamp(d / (GROW_VH * vh), 0, 1));
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
        // text 1 is already fully visible at d=0 (the paused spot);
        // crossfade to text 2 early, well before the size finishes growing
        const textT = clamp((d - 0.22 * vh) / (0.22 * vh), 0, 1);
        // sharp hold from GROW_VH to HOLD_VH: fullscreen, text 2 readable, NO blur — the blur
        // only starts once the released frame is half scrolled away (see the after branch below)
        text1.style.opacity = String(1 - textT);
        text2.style.opacity = String(textT);
        stage.style.filter = '';
        setFullframe(sizeT >= 0.999);
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
        // how much of the released frame has scrolled off the top (0 = none, 1 = all of it):
        // sharp until BLUR_START, then the blur ramps up to its max as the rest leaves
        const gone = clamp((d - growRange()) / window.innerHeight, 0, 1);
        const blurT = clamp((gone - BLUR_START) / (1 - BLUR_START), 0, 1);
        stage.style.filter = blurT > 0 ? `blur(${blurT * MAX_GROW_BLUR}px)` : '';
        // position:absolute is still a *positioned* element, so on its own
        // it would keep painting above the next (non-positioned) quote
        // even once scrolled past it — a negative z-index drops it behind
        // normal-flow content instead (same fix as about-hero-roll.js)
        stage.style.zIndex = '-1';
        text1.style.opacity = '0';
        text2.style.opacity = String(1 - blurT);
        setFullframe(stage.getBoundingClientRect().bottom > HEADER_HEIGHT);
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
    if (zone !== 'during' && zone === lastZone) {
      // the frozen frame's styles don't change out here, but it still keeps
      // scrolling up with the page — give the header its backdrop back once
      // it has fully cleared the header band
      if (fullframe) setFullframe(stage.getBoundingClientRect().bottom > HEADER_HEIGHT);
      return;
    }

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
