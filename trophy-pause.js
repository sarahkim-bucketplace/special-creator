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

  // shared across both watchers below: if .insight--key and
  // .insight--after-trophy both become intersecting before either lock
  // has run (a tall/short viewport can have both in view near-simultaneously
  // on a single fast flick), the second one used to mark itself "handled"
  // and disconnect without ever actually locking, since scrollIntoView is a
  // no-op while the first lock's overflow:hidden is still in effect — the
  // trophy+second-quote stop would silently never fire. Queuing here makes
  // the second one wait for the first lock to finish, then run its own.
  let busy = false;

  function watch(selector) {
    const el = document.querySelector(selector);
    if (!el) return;

    let triggered = false;

    function runLock() {
      if (busy) {
        window.setTimeout(runLock, 50);
        return;
      }
      busy = true;
      el.scrollIntoView({ block: 'start' });
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        busy = false;
      }, LOCK_MS);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            observer.disconnect();
            runLock();
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
