(function () {
  // initReveal is defined in scroll-reveal.js. .insight--key is deliberately
  // excluded — it's revealed explicitly by trophy-pause.js instead, the
  // instant that script locks onto .about-badge (see that file). Leaving it
  // on the generic IntersectionObserver meant it could cross the (small)
  // reveal threshold and fade in on its own on a tall enough viewport, in
  // the very same frame as the badge above it — before the user had
  // actually scrolled any further than the badge's own pause.
  initReveal('.insight:not(.insight--key)');

  // About section (find-the-key) — same rise-in-as-a-block treatment.
  // .about-roll (the first photo slot's wrapper) is deliberately NOT
  // here — about-hero-roll.js reveals it directly off the same rect.top
  // it already computes every scroll frame for the pin logic, so it only
  // fades in well after the heading above it, once the user keeps
  // scrolling (see that file's comment for why an IntersectionObserver
  // rootMargin approach didn't work here).
  initReveal('.about-heading');
  initReveal('.about-scrapbook .about-photo', { stagger: 100 });
  initReveal('.about-badge');
  initReveal('.about-key-photo');

  // Creator Voices rows — same rise-in-as-a-block treatment as
  // .btd-journey__row (see BeyondTheDoor.js)
  initReveal('.cv-row');
})();
