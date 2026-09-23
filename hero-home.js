(function () {
  const pin = document.querySelector('.hero-pin');
  const stage = document.getElementById('heroStage');
  const overlay = document.getElementById('heroOverlay');
  const logo = document.getElementById('heroLogo');
  const hint = document.getElementById('heroHint');
  const downHint = document.getElementById('heroDownHint');
  const photos = document.getElementById('heroPhotos');
  const photosInner = document.getElementById('heroPhotosInner');
  const photoEls = photos ? Array.from(photos.querySelectorAll('.hero-pin__photo')) : [];
  const nextSection = document.querySelector('.next-section');

  // hero-outer-graphic's source viewBox (Figma node 0:660), used to reproduce
  // the same "xMidYMid slice" cover-scale math the SVG itself uses, so the
  // Scroll/Down hint always lines up with the keyhole regardless of viewport size.
  const DESIGN_W = 1280;
  const DESIGN_H = 1080;
  const HINT_OFFSET_LEFT = 210; // "Scroll" center, px from keyhole center at 1:1 scale
  const HINT_OFFSET_RIGHT = 193; // "Down" center, px from keyhole center at 1:1 scale
  // on a narrow/tall phone screen, the cover-scale below is driven by height (not width),
  // which leaves "Scroll"/"Down" sitting much farther from the keyhole than they read on
  // desktop — tighten the gap on mobile only (matches the site's one mobile breakpoint)
  const MOBILE_HINT_BREAKPOINT = 900;
  const MOBILE_HINT_SCALE = 0.6;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  // slow at the start, accelerating toward the end — same scroll distance,
  // but the zoom/blur/reveal itself speeds up as you go (cubic ease-in)
  const easeInCubic = (t) => t * t * t;
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

  // photo cycle vs. logo hand-off, on raw scroll `progress` (0-1) — linear on purpose, so the
  // photos roll at a steady pace even though the keyhole zoom itself is cubic-eased:
  //   0 -> PHOTOS_END       photos 1-3 cycle (each later one fades in over the previous)
  //   PHOTOS_END -> DISSOLVE_START   the last photo holds, still inside the keyhole
  //   DISSOLVE_START -> DISSOLVE_END   photos blur + fade out while the logo fades in
  // scroll distance of the reveal, in viewport heights (hero-home.css: .hero-pin height =
  // 100vh + this + 60vh hold)
  const REVEAL_VH = 2.2;
  const PHOTOS_END = 0.6;
  const DISSOLVE_START = 0.74;
  const OVERLAY_FADE_START = DISSOLVE_START; // progress where the dark overlay starts turning transparent
  const FOCUS_END = 0.15; // progress by which the first photo is fully in focus
  const START_BLUR = 28; // px, photo blur at the very start of the scroll
  const END_BLUR = 24; // px, photo blur at the end of the dissolve
  const DISSOLVE_END = 0.94;

  let ticking = false;
  let wasComplete = false;

  function triggerLogoJolt() {
    logo.classList.remove('is-settling');
    void logo.offsetWidth; // reflow, so the animation restarts if it's re-triggered
    logo.classList.add('is-settling');
  }

  logo.addEventListener('animationend', () => {
    logo.classList.remove('is-settling');
  });

  function updateHintPosition() {
    const rect = stage.getBoundingClientRect();
    const scale = Math.max(rect.width / DESIGN_W, rect.height / DESIGN_H);
    const mobileAdjust = window.innerWidth <= MOBILE_HINT_BREAKPOINT ? MOBILE_HINT_SCALE : 1;
    hint.style.setProperty('--hint-offset-left', `${HINT_OFFSET_LEFT * scale * mobileAdjust}px`);
    hint.style.setProperty('--hint-offset-right', `${HINT_OFFSET_RIGHT * scale * mobileAdjust}px`);
  }

  function update() {
    // the reveal finishes partway through the pin's scroll range (150vh worth);
    // whatever is left (the 60vh "hold" in the CSS) keeps the page pinned with
    // progress clamped at 1, i.e. a pause before it lets go into the next section
    const revealDistance = window.innerHeight * REVEAL_VH;
    const scrolled = -pin.getBoundingClientRect().top;
    const progress = revealDistance > 0 ? clamp(scrolled / revealDistance, 0, 1) : 0;
    const eased = easeInCubic(progress);

    // overlay: scales up + blurs + fades away, revealing the page behind the keyhole.
    // driven by `eased`, not raw scroll, so the zoom crawls at first then rushes toward the end
    overlay.style.setProperty('--overlay-scale', 1 + eased * 3.4);
    overlay.style.setProperty('--overlay-blur', `${1.5 + eased * 60}px`);
    // the dark area around the keyhole stays fully opaque while the photos play, and only
    // fades away (revealing the white page) once the photos start dissolving into the logo
    const overlayFade = clamp((progress - OVERLAY_FADE_START) / (1 - OVERLAY_FADE_START), 0, 1);
    overlay.style.setProperty('--overlay-opacity', 1 - overlayFade * overlayFade * (3 - 2 * overlayFade));

    // logo: starts small + blurred so it peeks through the keyhole opening,
    // then grows to full size and racks into focus as the overlay clears
    logo.style.setProperty('--logo-blur', `${16 * (1 - eased)}px`);
    logo.style.setProperty('--logo-scale', 0.4 + eased * 0.6);

    // photos seen through the keyhole: photo 0 is always there, each later one fades in on top
    const n = photoEls.length;
    if (n) {
      const pos = clamp(progress / PHOTOS_END, 0, 1) * n;
      photoEls.forEach((el, i) => {
        el.style.opacity = i === 0 ? '1' : String(clamp((pos - (i - 0.25)) / 0.5, 0, 1));
      });
      const dissolve = clamp((progress - DISSOLVE_START) / (DISSOLVE_END - DISSOLVE_START), 0, 1);
      photos.style.setProperty('--photos-opacity', 1 - easeOutQuad(dissolve));
      // blur -> photos 1-3 -> opacity + blur -> logo: the photos start heavily blurred and
      // come into focus over the first stretch of scroll, stay sharp while cycling, then
      // blur out again as they fade
      const focusIn = easeOutQuad(clamp(progress / FOCUS_END, 0, 1));
      const photoBlur = START_BLUR * (1 - focusIn) + END_BLUR * dissolve;
      photos.style.setProperty('--photos-blur', `${photoBlur}px`);
      photos.style.setProperty('--photos-scale', 1.12 - 0.12 * clamp(progress / DISSOLVE_END, 0, 1));
      logo.style.setProperty('--logo-opacity', easeOutQuad(dissolve));
    } else {
      logo.style.setProperty('--logo-opacity', 1);
    }

    // scroll hint fades out fast at the very start of the scroll
    hint.style.setProperty('--hint-opacity', Math.max(0, 1 - progress * 5));

    // the moment the reveal finishes and the hold kicks in, give the logo a little snap/jolt
    const isComplete = progress >= 1;
    if (isComplete && !wasComplete) {
      triggerLogoJolt();
    }
    wasComplete = isComplete;

    // down-scroll nudge: shows up once the logo has landed, then fades back out
    // before the hold ends so it doesn't linger as the stage scrolls away
    const totalDistance = pin.offsetHeight - window.innerHeight;
    const holdRange = totalDistance - revealDistance;
    const holdProgress = holdRange > 0 ? clamp((scrolled - revealDistance) / holdRange, 0, 1) : 1;
    const downHintFadeOutStart = 0.6;
    const downHintOpacity = !isComplete
      ? 0
      : holdProgress < downHintFadeOutStart
        ? 1
        : 1 - (holdProgress - downHintFadeOutStart) / (1 - downHintFadeOutStart);
    downHint.style.setProperty('--down-hint-opacity', clamp(downHintOpacity, 0, 1));

    // next-section fades + slides up as a single block right as the hold lets go —
    // referencing newmixcoffee.com/ko's hero-exit motion (a snappy threshold-triggered
    // swap, not a scroll-scrubbed one like the keyhole zoom above). Driven off holdProgress
    // rather than a plain IntersectionObserver: .next-section sits in normal document flow
    // right after .hero-pin, so geometrically it's already "in view" the whole time the
    // sticky stage is pinned over it — an observer would fire while it's still hidden
    // behind the stage, well before the pin actually releases
    if (nextSection) {
      nextSection.classList.toggle('is-visible', isComplete && holdProgress >= 0.9);
    }

    stage.style.pointerEvents = progress >= 1 ? 'none' : 'auto';
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function onResize() {
    updateHintPosition();
    onScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  updateHintPosition();
  update();

  // custom "Click me" cursor that follows the pointer while hovering the key
  const keyLink = document.getElementById('keyLink');
  const cursorBadge = document.getElementById('cursorBadge');

  if (keyLink && cursorBadge) {
    keyLink.addEventListener('mousemove', (e) => {
      cursorBadge.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    keyLink.addEventListener('mouseenter', () => {
      cursorBadge.classList.add('is-visible');
    });
    keyLink.addEventListener('mouseleave', () => {
      cursorBadge.classList.remove('is-visible');
    });
  }
})();
