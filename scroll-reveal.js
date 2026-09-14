// scroll-reveal: elements start hidden (opacity 0 + offset down), and
// toggle .is-visible on/off as they cross into/out of the viewport, so
// scrolling up then back down replays the animation every time
function initReveal(selector, { stagger = 0 } = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  if (stagger) {
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i, 5) * stagger}ms`;
    });
  }

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  els.forEach((el) => observer.observe(el));
}
