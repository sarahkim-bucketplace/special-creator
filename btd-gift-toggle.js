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
const GIFT_PHOTO_STAGGER_MS = 80;

(function () {
  const entries = document.querySelectorAll('.btd-gift__entry');

  entries.forEach((entry) => {
    const row = entry.querySelector('.btd-gift__row');
    const gallery = entry.querySelector('.btd-gift__gallery');
    if (!row || !gallery) return;

    const photos = gallery.querySelectorAll('.btd-gift__photo');
    photos.forEach((photo, i) => {
      photo.style.transitionDelay = `${i * GIFT_PHOTO_STAGGER_MS}ms`;
    });

    row.addEventListener('click', () => {
      const isOpen = entry.classList.toggle('is-open');
      row.setAttribute('aria-expanded', String(isOpen));

      if (isOpen) {
        photos.forEach((photo) => photo.classList.add('is-visible'));
      } else {
        // reset so the stagger replays next time this entry opens
        photos.forEach((photo) => photo.classList.remove('is-visible'));
      }
    });
  });
})();
