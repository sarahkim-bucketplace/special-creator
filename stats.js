// count-up numbers (like d2sf.naver.com/ko/who-we-are's stat section):
// each .stats__number-value starts at 0 and counts up to its data-target
// once it scrolls into view, easing out so it settles rather than
// stopping abruptly
(function () {
  const values = document.querySelectorAll('.stats__number-value');
  if (!values.length) return;

  const DURATION = 1400;

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ko-KR');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    values.forEach((el) => {
      el.textContent = el.dataset.target;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  values.forEach((el) => observer.observe(el));
})();
