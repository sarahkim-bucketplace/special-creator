// pinned + rising-cover scroll-driven image roll for the About section's
// hero photo slot only (the rest of the section is static) — same manual
// pin technique as the site's other manual-pin scripts (position:fixed,
// toggled to absolute at the start/end of the wrapper's extra scroll
// range), not position:sticky, since this page's body has
// overflow-x:hidden and sticky breaks under that in this browser.
//
// Zones as the wrapper scrolls through the viewport (by wrapper.rect.top):
//   far-before  rect.top > ENTER_RANGE                     stage absolute, item 0, below the fold
//   entering    0 < rect.top <= ENTER_RANGE                stage fixed, offset down by an accelerating
//                                                           translateY that snaps to 0 — the photo rises
//                                                           up over the heading above as you scroll
//   cycling     0 <= d < CYCLE_RANGE                        stage fixed at rest size, cycling photos
//               (d = -rect.top)                             1-4 (the credit line shows the whole time)
//   growing     CYCLE_RANGE <= d < CYCLE_RANGE+growRange()  the 5th photo — stage still fixed, sub-phased
//                                                           by growT (0-1) into: grow to fullscreen, sharp
//                                                           (growT 0-0.5) -> the caption line fades in,
//                                                           still sharp (0.5-0.65) -> holds (0.65-0.85) ->
//                                                           caption fades back out while the frame blurs,
//                                                           dissolving into the next heading (0.85-1). The
//                                                           reverse of toss.im's phone-section motion,
//                                                           which zooms IN from a wide shot to a small
//                                                           tight crop; here a small frame expands OUT to
//                                                           cover the screen instead
//   after       d >= CYCLE_RANGE+growRange()                stage frozen fullscreen + blurred, now
//                                                           position:absolute so it scrolls away with
//                                                           the page like any normal block. settleRange()
//                                                           of trailing empty space is added to the
//                                                           wrapper on top of this, purely so the frozen
//                                                           photo fully clears the viewport before the
//                                                           next heading (which starts right after the
//                                                           wrapper in the document) begins its own reveal
(function () {
  const wrapper = document.getElementById('about-roll');
  if (!wrapper) return;

  const stage = wrapper.querySelector('.about-roll__stage');
  const items = Array.from(wrapper.querySelectorAll('.about-roll__item'));
  const caption = wrapper.querySelector('.about-photo__caption');
  const credit = wrapper.querySelector('.about-photo__credit');
  if (!stage || !items.length || !caption || !credit) return;

  // one credit per rolling photo, same order as the .about-roll__item
  // images above — setActive() below keeps this in sync with whichever
  // photo is currently showing, instead of the single static credit this
  // used to be (which only ever matched photo 1)
  const CREDITS = ['jinmilloo예빈', 'dotorisisters', '어반데이', 'sund_home', '루지니하우스'];

  // the heading right above .about-roll blurs out (toss.im's phone-section
  // treatment, run in reverse: there it sharpens INTO focus on entry, here
  // it blurs OUT of focus) in lockstep with the same entering-phase
  // progress that drives the photo's rise, so the two read as one motion
  const heading = document.querySelector('.about-heading--intro');
  const MAX_HEADING_BLUR = 10;

  const CYCLE_RANGE = 260 * (items.length - 1); // scroll px cycling photos 1-4; the 5th grows instead
  const MAX_GROW_BLUR = 20;

  // .about-photo--hero's rest height per the CSS breakpoints (mirrored here
  // rather than read live via stage.offsetHeight, since the growing/after
  // phases override that height inline — a live read would see the grown
  // value instead of the small resting one once a grow has happened)
  function baseStageHeight() {
    if (window.innerWidth <= 600) return 300;
    if (window.innerWidth <= 900) return 420;
    return 584;
  }

  const HEADER_HEIGHT = 72;
  const PIN_LIFT = 20; // nudges the frame up from dead-center, which read as slightly bottom-heavy
  // window.effVH() (viewport.js) instead of the raw window.innerHeight for
  // every pacing/centering calc below — keeps this whole sequence's timing
  // and framing consistent across screens with very different real heights
  // (MacBook 14"/16", external monitors), rather than each one scaling
  // directly off its own window.innerHeight
  function pinTop() {
    return HEADER_HEIGHT + (window.effVH() - HEADER_HEIGHT - baseStageHeight()) / 2 - PIN_LIFT;
  }
  function smallBox() {
    const width = Math.min(1006, window.innerWidth - 70);
    return { top: pinTop(), left: (window.innerWidth - width) / 2, width, height: baseStageHeight() };
  }

  function enterRange() {
    return window.effVH() * 0.9;
  }
  function enterOffset() {
    return window.effVH() * 0.55;
  }
  function growRange() {
    // more room than the entering/cycling phases — it now carries four
    // sub-phases (grow, caption in, hold, dissolve) instead of one motion
    return window.effVH() * 1.3;
  }
  function settleRange() {
    // extra dead scroll space reserved after the freeze point, just enough
    // that the frozen fullscreen photo (itself effVH() tall, starting
    // baseStageHeight() above the wrapper's own bottom edge) fully clears
    // the viewport before the next heading starts to enter it (that
    // heading has margin-top:0 — it centers itself in its own min-height
    // box instead), plus a small fixed buffer so the gap still reads as an
    // intentional pause rather than a hard cut — solved directly from the
    // two elements' geometry rather than guessed as a flat multiple of
    // the viewport height, which either overlapped them or (at a
    // large-enough multiple to always avoid that) left an oversized gap
    const HEADING_MARGIN_TOP = 0;
    const BUFFER = 0;
    return Math.max(0, 2 * window.effVH() - baseStageHeight() - HEADING_MARGIN_TOP + BUFFER);
  }
  function wrapperLeftOffset() {
    return wrapper.getBoundingClientRect().left;
  }

  // while the frame is fullscreen (through its dissolve, until it scrolls
  // off the top), the header's opaque backdrop band is hidden so the photo
  // reads edge-to-edge — body.is-fullframe-hero in FindTheKey.css (the
  // key-photo frame further down uses its own class). Only touches the DOM
  // when the state actually flips.
  let fullframe = false;
  function setFullframe(on) {
    if (on === fullframe) return;
    fullframe = on;
    document.body.classList.toggle('is-fullframe-hero', on);
  }

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
  // the rise itself uses an accelerating curve instead — starts slow, gains
  // speed, then hits its resting spot right as progress reaches 1, for a
  // snap-into-place feel rather than a gentle glide to a stop
  const easeInCubic = (t) => t * t * t;
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function setActive(index) {
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    if (CREDITS[index]) credit.textContent = 'Photo by. ' + CREDITS[index];
  }

  function setCaptionVisible(visible) {
    caption.classList.toggle('is-visible', visible);
    // clear any inline opacity left over from the grow phase's fade-out, so
    // the class-based transition above governs again once we're back to
    // plain cycling (e.g. the user scrolled back up)
    caption.style.opacity = '';
    credit.style.opacity = '';
  }

  function resetStageBox() {
    stage.style.left = '';
    stage.style.width = '';
    stage.style.height = '';
    stage.style.borderRadius = '';
    stage.style.filter = '';
    // undo the 'after' phase's z-index drop (see below) in case the user
    // scrolled back up out of it
    stage.style.zIndex = '';
  }

  function setWrapperHeight() {
    wrapper.style.height = baseStageHeight() + CYCLE_RANGE + growRange() + settleRange() + 'px';
  }

  let wrapperTop = 0;
  let wrapperBottom = 0;
  function measureBounds() {
    wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    wrapperBottom = wrapperTop + wrapper.offsetHeight;
  }

  let ticking = false;
  let lastZone = null;

  // readyToReveal guards against the very first synchronous update() call
  // at parse time, before web fonts/images have settled layout, where
  // rect.top can transiently read small enough to set opacity/offset as if
  // already mid-scroll
  let readyToReveal = false;

  function update() {
    const range = enterRange();
    const rect = wrapper.getBoundingClientRect();

    if (rect.top > range) {
      stage.style.position = 'absolute';
      stage.style.top = '0px';
      stage.style.transform = '';
      resetStageBox();
      setActive(0);
      setCaptionVisible(false);
      if (readyToReveal) wrapper.style.opacity = '0';
      if (heading) heading.style.filter = '';
      setFullframe(false);
      lastZone = 'before';
    } else if (rect.top > 0) {
      const progress = clamp(1 - rect.top / range, 0, 1);
      const offset = enterOffset() * (1 - easeInCubic(progress));
      // opacity ramps up faster than the position settles (reaches full by
      // 60% of the way through the rise), so the photo already reads as
      // solid well before it finishes covering the heading above it
      const opacity = easeOutQuad(clamp(progress / 0.6, 0, 1));
      stage.style.position = 'fixed';
      stage.style.top = pinTop() + 'px';
      stage.style.transform = `translateX(-50%) translateY(${offset}px)`;
      resetStageBox();
      setActive(0);
      setCaptionVisible(false);
      if (readyToReveal) wrapper.style.opacity = String(opacity);
      if (heading) heading.style.filter = `blur(${easeOutQuad(progress) * MAX_HEADING_BLUR}px)`;
      setFullframe(false);
      lastZone = 'during';
    } else {
      const d = -rect.top;
      if (readyToReveal) wrapper.style.opacity = '1';
      if (heading) heading.style.filter = `blur(${MAX_HEADING_BLUR}px)`;

      if (d < CYCLE_RANGE) {
        stage.style.position = 'fixed';
        stage.style.top = pinTop() + 'px';
        stage.style.transform = 'translateX(-50%) translateY(0px)';
        resetStageBox();
        const progress = clamp(d / CYCLE_RANGE, 0, 1);
        const index = Math.min(items.length - 2, Math.floor(progress * (items.length - 1)));
        setActive(index);
        setCaptionVisible(false);
        setFullframe(false);
        lastZone = 'during';
      } else if (d < CYCLE_RANGE + growRange()) {
        setActive(items.length - 1);
        caption.classList.add('is-visible');
        const rawT = clamp((d - CYCLE_RANGE) / growRange(), 0, 1);
        // four sub-phases packed into one growT sweep: grow to fullscreen
        // sharp (0-0.5) -> caption fades in, still sharp (0.5-0.65) ->
        // holds (0.65-0.85) -> caption fades out as the frame blurs into
        // the next heading (0.85-1)
        const sizeT = easeInOutCubic(clamp(rawT / 0.5, 0, 1));
        const capInT = easeOutQuad(clamp((rawT - 0.5) / 0.15, 0, 1));
        const capOutT = easeOutQuad(clamp((rawT - 0.85) / 0.15, 0, 1));
        const blurT = clamp((rawT - 0.85) / 0.15, 0, 1);
        const creditT = clamp(rawT / 0.1, 0, 1);
        const from = smallBox();
        stage.style.position = 'fixed';
        stage.style.top = lerp(from.top, 0, sizeT) + 'px';
        stage.style.left = lerp(from.left, 0, sizeT) + 'px';
        stage.style.width = lerp(from.width, window.innerWidth, sizeT) + 'px';
        stage.style.height = lerp(from.height, window.innerHeight, sizeT) + 'px';
        stage.style.borderRadius = lerp(5, 0, sizeT) + 'px';
        stage.style.filter = `blur(${blurT * MAX_GROW_BLUR}px)`;
        stage.style.transform = 'none';
        stage.style.zIndex = '';
        caption.style.opacity = String(clamp(capInT - capOutT, 0, 1));
        credit.style.opacity = String(1 - creditT);
        setFullframe(sizeT >= 0.999);
        lastZone = 'during';
      } else {
        setActive(items.length - 1);
        stage.style.position = 'absolute';
        stage.style.top = CYCLE_RANGE + growRange() + 'px';
        // position:absolute's left is relative to .about-roll's own box,
        // not the viewport — and .about-roll sits inset inside .page's
        // centered max-width column, not flush against the true left edge.
        // A plain "0px" here left the frame's right edge overflowing off
        // the visible viewport (clipped by html's overflow-x:hidden) while
        // its left edge sat inset from the true edge, reading as a shift
        // to the right. Canceling that inset keeps it flush full-bleed.
        stage.style.left = -wrapperLeftOffset() + 'px';
        stage.style.width = window.innerWidth + 'px';
        stage.style.height = window.innerHeight + 'px';
        stage.style.borderRadius = '0px';
        stage.style.filter = `blur(${MAX_GROW_BLUR}px)`;
        stage.style.transform = 'none';
        // position:absolute is still a *positioned* element, so on its own
        // it would keep painting above the next (non-positioned) heading
        // even once scrolled past it — a negative z-index drops it behind
        // normal-flow content instead, so the heading below reads on top
        // of it as intended, rather than looking blended/ghosted through it
        stage.style.zIndex = '-1';
        caption.style.opacity = '0';
        credit.style.opacity = '0';
        setFullframe(stage.getBoundingClientRect().bottom > HEADER_HEIGHT);
        lastZone = 'after';
      }
    }

    ticking = false;
  }

  function onScroll() {
    // the entering phase starts before the wrapper's own top reaches the
    // viewport (rect.top still positive), so the "active" window has to
    // extend backward by enterRange() too, or this skip-check would freeze
    // the rise animation mid-scroll
    const y = window.scrollY;
    const zone = y < wrapperTop - enterRange() ? 'before' : y > wrapperBottom ? 'after' : 'during';
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
  // the pin positioning (stage.style.position/top) is fine to set from this
  // very first synchronous call, but opacity is gated behind readyToReveal
  // until a frame has passed — run at parse time, before web fonts/images
  // have settled layout, rect.top can transiently read as mid-scroll
  // regardless of actual scroll position
  update();
  requestAnimationFrame(() => {
    readyToReveal = true;
    measureBounds();
    update();
  });
})();
