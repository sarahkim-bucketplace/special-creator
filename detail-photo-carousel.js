(function () {
  // shared across all OpportunitiesUnlocked-0N detail pages: clicking the
  // overlay arrows cycles through the photo slides (loops both directions)
  const track = document.getElementById('photoTrack');
  if (!track) return;

  const slides = Array.from(track.children);
  let index = slides.findIndex((el) => el.classList.contains('is-active'));
  if (index < 0) index = 0;

  function render() {
    slides.forEach((el, i) => el.classList.toggle('is-active', i === index));
  }

  document.querySelectorAll('.detail__arrow-btn--prev').forEach((btn) => {
    btn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });
  });

  document.querySelectorAll('.detail__arrow-btn--next').forEach((btn) => {
    btn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      render();
    });
  });

  render();
})();
