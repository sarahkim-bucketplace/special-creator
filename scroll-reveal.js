// scroll-reveal: elements start hidden (opacity 0 + offset down), and
// toggle .is-visible on/off as they cross into/out of the viewport, so
// scrolling up then back down replays the animation every time
function initReveal(selector, { stagger = 0, rootMargin = '0px 0px -60px 0px', threshold = 0.15, once = false } = {}) {
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
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // once: reveal-and-forget, rather than the usual toggle-off-when-
          // scrolled-past-again — needed wherever a shrunk rootMargin (a
          // deliberately delayed entry trigger) would otherwise also make
          // the element toggle back off while it's still mostly on screen,
          // since that same shrunk zone governs exit too
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold, rootMargin }
  );

  els.forEach((el) => observer.observe(el));
}
