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
// Exactly one entry is open at a time (accordion): a click on a row, or —
// while scrolling through this section — wheel input, both funneled
// through the same openOnly().
//
// Scroll-position recomputation (read current position, pick the entry
// whose row has crossed a reference line) was tried first and reliably
// failed: opening one entry collapses/expands a large gallery, which by
// itself can shove the next couple of rows past the line before the next
// 'scroll' event is even read, so a real flick — even an ordinary-paced
// one — could jump straight from entry 1 to entry 4, with 2 and 3 toggled
// open for less than a frame and never actually seen. Locking briefly
// after each detected change didn't help either, since the wrong entry
// (too-far-ahead) had already been detected by the time the lock could
// engage — the read itself was already wrong, not just unresponded-to.
//
// So this takes over wheel input entirely while inside the list: each
// wheel tick advances or retreats the open entry by exactly one step and
// applies a small, fixed scroll nudge itself (STEP_SCROLL) rather than
// letting the browser apply whatever raw (and on a fast flick, large)
// native delta it wants. At the first entry (scrolling up) or the last
// (scrolling down) it stops intercepting so normal page scroll continues
// on into .btd-middle--gift above or Creator Voices below.
const GIFT_PHOTO_STAGGER_MS = 80;
const STEP_LOCK_MS = 350;
const STEP_SCROLL = 140;
const WHEEL_THRESHOLD = 40;

(function () {
  const entryEls = document.querySelectorAll('.btd-gift__entry');
  if (!entryEls.length) return;

  const gift = document.querySelector('.btd-gift');
  if (!gift) return;

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

  function currentIdx() {
    return entries.findIndex((item) => item.entry.classList.contains('is-open'));
  }

  entries.forEach((item, idx) => {
    if (!item.row) return;
    item.row.addEventListener('click', () => {
      const wasOpen = item.entry.classList.contains('is-open');
      openOnly(wasOpen ? -1 : idx);
    });
  });

  let busy = false;
  let accum = 0;

  function step(newIdx, dir) {
    busy = true;
    accum = 0;
    openOnly(newIdx);
    window.scrollBy(0, dir * STEP_SCROLL);
    window.setTimeout(() => {
      busy = false;
    }, STEP_LOCK_MS);
  }

  function nearGift() {
    const rect = gift.getBoundingClientRect();
    return rect.bottom > -window.innerHeight && rect.top < window.innerHeight * 2;
  }

  // none of the individual entries are scroll-snap points (only
  // .btd-middle--gift above this list is) — on this page's
  // scroll-snap-type:mandatory html, leaving snap active while inside the
  // list means every window.scrollBy() step below risks getting corrected
  // straight back to that snap point once it "settles". Suppressed for as
  // long as the list is anywhere near view, restored once it isn't.
  function updateSnapSuppression() {
    document.documentElement.style.scrollSnapType = nearGift() ? 'none' : '';
  }

  window.addEventListener('scroll', updateSnapSuppression, { passive: true });
  updateSnapSuppression();

  window.addEventListener(
    'wheel',
    (e) => {
      if (!nearGift()) return;
      const idx = currentIdx();
      if (e.deltaY > 0 && idx >= entries.length - 1) return; // last entry: release, continue to next section
      if (e.deltaY < 0 && idx <= 0) return; // first entry (or none open): release, continue back up
      if (e.deltaY === 0) return;

      e.preventDefault();
      if (busy) return;

      accum += e.deltaY;
      if (Math.abs(accum) < WHEEL_THRESHOLD) return;

      const dir = accum > 0 ? 1 : -1;
      const newIdx = Math.max(0, Math.min(entries.length - 1, idx + dir));
      step(newIdx, dir);
    },
    { passive: false }
  );
})();
