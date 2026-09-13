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

  let ticking = false;

  function update() {
    const scrollableRange = wrapper.offsetHeight - stage.offsetHeight;
    const rect = wrapper.getBoundingClientRect();

    if (rect.top > 0) {
      // not reached yet — sits at the wrapper's own top, in flow
      stage.style.position = 'absolute';
      stage.style.top = '0px';
      setActive(0);
    } else if (-rect.top >= scrollableRange) {
      // scrolled past — sits at the wrapper's own bottom, in flow
      stage.style.position = 'absolute';
      stage.style.top = scrollableRange + 'px';
      setActive(items.length - 1);
    } else {
      // pinned while the wrapper's extra scroll range is being used up
      stage.style.position = 'fixed';
      stage.style.top = PIN_TOP + 'px';
      const progress = clamp(-rect.top / scrollableRange, 0, 1);
      const index = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActive(index);
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
