(function () {
  const pin = document.querySelector('.hero-pin');
  const stage = document.getElementById('heroStage');
  const overlay = document.getElementById('heroOverlay');
  const logo = document.getElementById('heroLogo');
  const hint = document.getElementById('heroHint');
  const downHint = document.getElementById('heroDownHint');

  // hero-outer-graphic's source viewBox (Figma node 0:660), used to reproduce
  // the same "xMidYMid slice" cover-scale math the SVG itself uses, so the
  // Scroll/Down hint always lines up with the keyhole regardless of viewport size.
  const DESIGN_W = 1280;
  const DESIGN_H = 1080;
  const HINT_OFFSET_LEFT = 210; // "Scroll" center, px from keyhole center at 1:1 scale
  const HINT_OFFSET_RIGHT = 193; // "Down" center, px from keyhole center at 1:1 scale

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  // slow at the start, accelerating toward the end — same scroll distance,
  // but the zoom/blur/reveal itself speeds up as you go (cubic ease-in)
  const easeInCubic = (t) => t * t * t;

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
    hint.style.setProperty('--hint-offset-left', `${HINT_OFFSET_LEFT * scale}px`);
    hint.style.setProperty('--hint-offset-right', `${HINT_OFFSET_RIGHT * scale}px`);
  }

  function update() {
    // the reveal finishes partway through the pin's scroll range (150vh worth);
    // whatever is left (the 60vh "hold" in the CSS) keeps the page pinned with
    // progress clamped at 1, i.e. a pause before it lets go into the next section
    const revealDistance = window.innerHeight * 1.5;
    const scrolled = -pin.getBoundingClientRect().top;
    const progress = revealDistance > 0 ? clamp(scrolled / revealDistance, 0, 1) : 0;
    const eased = easeInCubic(progress);

    // overlay: scales up + blurs + fades away, revealing the page behind the keyhole.
    // driven by `eased`, not raw scroll, so the zoom crawls at first then rushes toward the end
    overlay.style.setProperty('--overlay-scale', 1 + eased * 3.4);
    overlay.style.setProperty('--overlay-blur', `${1.5 + eased * 60}px`);
    overlay.style.setProperty('--overlay-opacity', Math.max(0, 1 - eased * 1.15));

    // logo: starts small + blurred so it peeks through the keyhole opening,
    // then grows to full size and racks into focus as the overlay clears
    logo.style.setProperty('--logo-blur', `${10 * (1 - eased)}px`);
    logo.style.setProperty('--logo-scale', 0.4 + eased * 0.6);

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
