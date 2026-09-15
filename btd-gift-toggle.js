// Special Gift index toggle (Figma 202:530 collapsed / 203:623 expanded):
// each entry's chevron opens a placeholder photo gallery below it. Toggling
// .is-open (CSS gives it grid-column:1/-1) is enough to make an open entry
// span the full width and let the grid reflow the rest around it — no
// layout math needed here, just flip the class.
//
// The gallery's own show/hide is CSS-only (max-height/opacity transition
// on .is-open .btd-gift__gallery, see FindTheKey.css) rather than toggling
// the `hidden` attribute here — hidden's display:none/block swap has no
// animatable middle state, so opening read as an instant jump-cut instead
// of an unfold.
//
// The individual photos inside stagger in on open (same opacity+translateY
// idea as scroll-reveal.js's initReveal, just open-triggered instead of
// scroll-triggered since the gallery is hidden until toggled, not
// scrolled into view) — matches the staggered reveal already used further
// up the page (.btd-journey__row, .btd-gallery__photo).
//
// Exactly one entry is open at a time (accordion), driven by two inputs
// that share the same openOnly() so they never fight each other: a click
// on a row, and — as the user scrolls through this section — whichever
// row is passing through a band near the top of the viewport. That band
// (see SCROLL_ROOT_MARGIN) is what makes entries open in order and close
// the one above as you scroll past it, without hardcoding pixel offsets.
const GIFT_PHOTO_STAGGER_MS = 80;
const SCROLL_ROOT_MARGIN = '-20% 0px -75% 0px';

(function () {
  const entryEls = document.querySelectorAll('.btd-gift__entry');
  if (!entryEls.length) return;

  const entries = Array.from(entryEls).map((entry) => {
    const row = entry.querySelector('.btd-gift__row');
    const gallery = entry.querySelector('.btd-gift__gallery');
    const photos = gallery ? gallery.querySelectorAll('.btd-gift__photo') : [];
    photos.forEach((photo, i) => {
      photo.style.transitionDelay = `${i * GIFT_PHOTO_STAGGER_MS}ms`;
    });
    return { entry, row, photos };
  });

  function setOpen(item, isOpen) {
    item.entry.classList.toggle('is-open', isOpen);
    if (item.row) item.row.setAttribute('aria-expanded', String(isOpen));
    item.photos.forEach((photo) => photo.classList.toggle('is-visible', isOpen));
  }

  function openOnly(idx) {
    entries.forEach((item, i) => setOpen(item, i === idx));
  }

  entries.forEach((item, idx) => {
    if (!item.row) return;
    item.row.addEventListener('click', () => {
      const wasOpen = item.entry.classList.contains('is-open');
      openOnly(wasOpen ? -1 : idx);
    });
  });

  if (!('IntersectionObserver' in window)) return;

  const scrollObserver = new IntersectionObserver(
    (observed) => {
      observed.forEach((obs) => {
        if (!obs.isIntersecting) return;
        const idx = entries.findIndex((item) => item.row === obs.target);
        if (idx !== -1) openOnly(idx);
      });
    },
    { rootMargin: SCROLL_ROOT_MARGIN, threshold: 0 }
  );

  entries.forEach((item) => {
    if (item.row) scrollObserver.observe(item.row);
  });
})();
