// OU cards, mobile only: one-card-at-a-time carousel with prev/next arrows,
// dot indicators, and autoplay — referencing newmixcoffee.com/ko's product
// carousel. Desktop keeps the existing multi-card hover-grow strip untouched
// (see .ou-carousel rules in FindTheKey.css); this script itself no-ops
// above 900px so nothing runs in the background on desktop.
(function () {
  const contents = document.querySelector('.ou-contents');
  const carousel = document.getElementById('ouCarousel');
  const dotsWrap = document.getElementById('ouCarouselDots');
  if (!contents || !carousel || !dotsWrap) return;

  const cards = Array.from(contents.querySelectorAll('.ou-card'));
  if (!cards.length) return;

  const AUTOPLAY_MS = 4000;
  const mq = window.matchMedia('(max-width: 900px)');

  let index = 0;
  let autoplayTimer = null;
  let isMobile = false;
  let suppressScrollSync = false;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `${i + 1}번째 사례로 이동`);
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function updateDots() {
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function goTo(i, userInitiated) {
    index = (i + cards.length) % cards.length;
    suppressScrollSync = true;
    contents.scrollTo({ left: cards[index].offsetLeft, behavior: 'smooth' });
    updateDots();
    // scrollTo's smooth animation fires several scroll events after this —
    // ignore them so they don't fight with the index we just set
    setTimeout(() => { suppressScrollSync = false; }, 400);
    if (userInitiated) restartAutoplay();
  }

  function next() {
    goTo(index + 1, false);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function restartAutoplay() {
    if (isMobile) startAutoplay();
  }

  // keep `index`/dots in sync if the user swipes the strip directly instead
  // of using the arrows/dots
  let scrollRaf = null;
  contents.addEventListener('scroll', () => {
    if (suppressScrollSync || !isMobile) return;
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      const cardWidth = cards[0].offsetWidth || 1;
      const nearest = Math.round(contents.scrollLeft / cardWidth);
      if (nearest !== index) {
        index = (nearest + cards.length) % cards.length;
        updateDots();
      }
    });
  }, { passive: true });

  const prevBtn = carousel.querySelector('.ou-carousel__arrow--prev');
  const nextBtn = carousel.querySelector('.ou-carousel__arrow--next');
  prevBtn?.addEventListener('click', () => goTo(index - 1, true));
  nextBtn?.addEventListener('click', () => goTo(index + 1, true));

  // any direct touch on the strip counts as user interaction — pause/reset
  // the autoplay timer the same as an arrow/dot click would
  contents.addEventListener('touchstart', () => restartAutoplay(), { passive: true });

  function enableMobile() {
    if (isMobile) return;
    isMobile = true;
    index = 0;
    updateDots();
    startAutoplay();
  }

  function disableMobile() {
    if (!isMobile) return;
    isMobile = false;
    stopAutoplay();
  }

  function syncToViewport(e) {
    if (e.matches) enableMobile();
    else disableMobile();
  }

  syncToViewport(mq);
  mq.addEventListener('change', syncToViewport);
})();
