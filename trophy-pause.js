// guarantees the "stop once, then continue" buffer for each resting point
// in the opening quote/trophy/quote sequence, same pattern as
// stats-pause.js / btd-gift-pause.js. Both .insight--key and
// .insight--after-trophy carry scroll-snap-align:start (FindTheKey.css)
// so they're valid mandatory-snap resting points, but native snap alone
// wasn't reliable — a fast scroll could carry straight through one before
// it ever settled into view. Setting overflow:hidden removes the ability
// to scroll at the layout level, which isn't subject to that race the way
// preventDefault() on wheel/touchmove events is.
(function () {
  const LOCK_MS = 600;

  function watch(selector) {
    const el = document.querySelector(selector);
    if (!el) return;

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
            el.scrollIntoView({ block: 'start' });
            lockScroll();
            window.setTimeout(unlockScroll, LOCK_MS);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(el);
  }

  watch('.insight--key');
  watch('.insight--after-trophy');
})();
