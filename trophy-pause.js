// guarantees the "stop once, then continue" buffer for the opening quote
// + trophy pair, same pattern as stats-pause.js / btd-gift-pause.js.
// .insight--key carries scroll-snap-align:start (FindTheKey.css) so it's
// a valid mandatory-snap resting point, but native snap alone wasn't
// reliable — a fast scroll could carry straight through it before the
// trophy ever settled into view. Setting overflow:hidden removes the
// ability to scroll at the layout level, which isn't subject to that race
// the way preventDefault() on wheel/touchmove events is.
(function () {
  const key = document.querySelector('.insight--key');
  if (!key) return;

  const LOCK_MS = 600;
  let triggered = false;

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          observer.disconnect();
          key.scrollIntoView({ block: 'start' });
          lockScroll();
          window.setTimeout(unlockScroll, LOCK_MS);
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(key);
})();
