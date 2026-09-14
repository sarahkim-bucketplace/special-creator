// shared across all OpportunitiesUnlocked-0N detail pages (and the modal
// popup in ou-modal.js, which calls initPhotoCarousel again each time it
// injects a different case study): clicking the overlay arrows cycles
// through the photo slides (loops both directions)
function initPhotoCarousel(root) {
  const track = root.querySelector('#photoTrack');
  if (!track) return;

  const slides = Array.from(track.children);
  let index = slides.findIndex((el) => el.classList.contains('is-active'));
  if (index < 0) index = 0;

  function render() {
    slides.forEach((el, i) => el.classList.toggle('is-active', i === index));
  }

  root.querySelectorAll('.detail__arrow-btn--prev').forEach((btn) => {
    btn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });
  });

  root.querySelectorAll('.detail__arrow-btn--next').forEach((btn) => {
    btn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      render();
    });
  });

  render();
}

if (typeof document !== 'undefined') {
  initPhotoCarousel(document);
}
