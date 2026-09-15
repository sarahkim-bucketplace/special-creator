// guarantees the "stop once, then continue" buffer the user asked for,
// same pattern as stats-pause.js. Anchored on .btd-middle (the "함께한
// 시간에 마음을 담아" title right above the gift list), not .btd-gift
// itself — landing on .btd-gift alone scrolled past that title, so the
// section read as jumping in already mid-content. .btd-middle carries
// scroll-snap-align:start (FindTheKey.css) so it's a valid mandatory-snap
// resting point, but native snap alone wasn't reliable — a fast scroll or
// trackpad flick could carry straight through it into Creator Voices
// before it ever registered as a stop. Setting overflow:hidden removes
// the ability to scroll at the layout level, which isn't subject to that
// race the way preventDefault() on wheel/touchmove events is.
(function () {
  // .btd-middle appears twice on the page (also before .btd-gallery) —
  // this must be the one immediately before .btd-gift, not the first match
  const gift = document.querySelector('.btd-middle--gift');
  if (!gift) return;

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
          gift.scrollIntoView({ block: 'start' });
          lockScroll();
          window.setTimeout(unlockScroll, LOCK_MS);
          // open the first entry as part of arriving here, same as a
          // real click — reuses btd-gift-toggle.js's own handler rather
          // than duplicating its open logic
          const firstRow = document.querySelector('.btd-gift__row');
          if (firstRow) firstRow.click();
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(gift);
})();
