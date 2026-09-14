// pinned scroll-driven image/caption roll for the "about" (find-the-key)
// section — mirrors hero-home.js's manual pin technique (position:fixed,
// toggled to absolute at the start/end) rather than position:sticky, since
// this page's body has overflow-x:hidden for the full-bleed sections and
// sticky breaks under that in this browser (documented elsewhere in the repo)
(function () {
  const wrapper = document.getElementById('about-roll');
  if (!wrapper) return;

  const stage = wrapper.querySelector('.about-roll__stage');
  const items = Array.from(wrapper.querySelectorAll('.about-roll__item'));
  if (!stage || !items.length) return;

  // must match .about-roll__stage's `top` in FindTheKey.css
  const PIN_TOP = 96;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  function setActive(index) {
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
  }

  // doc-space bounds, cached so onScroll can cheaply skip this section's
  // work when scrolled elsewhere instead of calling getBoundingClientRect()
  // (forces layout) unconditionally on every scroll event page-wide —
  // see the comment in btd-gallery-stack.js for why that matters
  let wrapperTop = 0;
  let wrapperBottom = 0;
  function measureBounds() {
    wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    wrapperBottom = wrapperTop + wrapper.offsetHeight;
  }

  let ticking = false;
  let lastZone = null; // 'before' | 'during' | 'after'

  function update() {
    const scrollableRange = wrapper.offsetHeight - stage.offsetHeight;
    const rect = wrapper.getBoundingClientRect();

    if (rect.top > 0) {
      // not reached yet — sits at the wrapper's own top, in flow
      stage.style.position = 'absolute';
      stage.style.top = '0px';
      setActive(0);
      lastZone = 'before';
    } else if (-rect.top >= scrollableRange) {
      // scrolled past — sits at the wrapper's own bottom, in flow
      stage.style.position = 'absolute';
      stage.style.top = scrollableRange + 'px';
      setActive(items.length - 1);
      lastZone = 'after';
    } else {
      // pinned while the wrapper's extra scroll range is being used up
      stage.style.position = 'fixed';
      stage.style.top = PIN_TOP + 'px';
      const progress = clamp(-rect.top / scrollableRange, 0, 1);
      const index = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActive(index);
      lastZone = 'during';
    }

    ticking = false;
  }

  function onScroll() {
    // cheap zone check first (just arithmetic on cached bounds) so this
    // section's getBoundingClientRect() + style writes only run while
    // actually relevant, not on every scroll event for the page's whole
    // lifetime — see the comment above measureBounds()
    const y = window.scrollY;
    const zone = y < wrapperTop ? 'before' : y > wrapperBottom ? 'after' : 'during';
    if (zone !== 'during' && zone === lastZone) return;

    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    measureBounds();
    onScroll();
  });
  measureBounds();
  update();
})();
