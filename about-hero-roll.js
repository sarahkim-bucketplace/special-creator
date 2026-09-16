// pinned scroll-driven image roll for the About section's hero photo slot
// only (the rest of the section is static now) — same pin technique as
// the site's other manual-pin scripts (position:fixed, toggled to
// absolute at the start/end of the wrapper's extra scroll range), not
// position:sticky, since this page's body has overflow-x:hidden and
// sticky breaks under that in this browser
(function () {
  const wrapper = document.getElementById('about-roll');
  if (!wrapper) return;

  const stage = wrapper.querySelector('.about-roll__stage');
  const items = Array.from(wrapper.querySelectorAll('.about-roll__item'));
  if (!stage || !items.length) return;

  const HEADER_HEIGHT = 72;
  function pinTop() {
    return HEADER_HEIGHT + (window.innerHeight - HEADER_HEIGHT - stage.offsetHeight) / 2;
  }

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  function setActive(index) {
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
  }

  let wrapperTop = 0;
  let wrapperBottom = 0;
  function measureBounds() {
    wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    wrapperBottom = wrapperTop + wrapper.offsetHeight;
  }

  let ticking = false;
  let lastZone = null;

  // fade the whole wrapper in once its top has scrolled up to within the
  // top 10% of the viewport — well past where .about-heading (default
  // rootMargin, initReveal in find-the-key.js) already revealed, so the
  // two read as sequential instead of appearing together. Plain rect.top
  // arithmetic on the SAME rect this function already computes for the
  // pin logic, rather than a second IntersectionObserver: a percentage
  // rootMargin on this element gave inconsistent results (the observer's
  // very first callback can fire against a transient pre-restore scroll
  // position on load and lock in "revealed" immediately via `once`).
  // NOTE: this page's mandatory scroll-snap settles the very first load
  // at scrollY≈135, not 0 — the threshold has to clear that resting
  // rect.top (not just "the top of the viewport") or it reveals with no
  // scrolling at all. 10% leaves enough runway before the pin itself
  // engages (rect.top<=0) to still read as a scroll-triggered reveal.
  let revealed = false;
  let readyToReveal = false;
  function checkReveal(rect) {
    if (revealed || !readyToReveal) return;
    if (rect.top < window.innerHeight * 0.1) {
      wrapper.classList.add('is-visible');
      revealed = true;
    }
  }

  function update() {
    const scrollableRange = wrapper.offsetHeight - stage.offsetHeight;
    const rect = wrapper.getBoundingClientRect();
    checkReveal(rect);

    if (rect.top > 0) {
      stage.style.position = 'absolute';
      stage.style.top = '0px';
      setActive(0);
      lastZone = 'before';
    } else if (-rect.top >= scrollableRange) {
      stage.style.position = 'absolute';
      stage.style.top = scrollableRange + 'px';
      setActive(items.length - 1);
      lastZone = 'after';
    } else {
      stage.style.position = 'fixed';
      stage.style.top = pinTop() + 'px';
      const progress = clamp(-rect.top / scrollableRange, 0, 1);
      const index = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActive(index);
      lastZone = 'during';
    }

    ticking = false;
  }

  function onScroll() {
    const y = window.scrollY;
    const zone = y < wrapperTop ? 'before' : y > wrapperBottom ? 'after' : 'during';
    // keep sampling every scroll tick, even in an otherwise-skippable zone,
    // until the reveal has actually fired once
    if (revealed && zone !== 'during' && zone === lastZone) return;

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
  // the pin positioning (stage.style.position/top) is fine to set from this
  // very first synchronous call, but the reveal check is gated behind
  // readyToReveal until a frame has passed — run at parse time, before web
  // fonts/images have settled layout, rect.top can transiently read small
  // enough to satisfy the reveal threshold regardless of actual scroll
  // position, permanently locking the wrapper "revealed" on load
  update();
  requestAnimationFrame(() => {
    readyToReveal = true;
    measureBounds();
    checkReveal(wrapper.getBoundingClientRect());
  });
})();
