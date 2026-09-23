// shared across all OpportunitiesUnlocked-0N detail pages (and the modal
// popup in ou-modal.js, which calls initPhotoCarousel again each time it
// injects a different case study): clicking the overlay arrows cycles
// through the photo slides (loops both directions)
function initPhotoCarousel(root) {
  // mobile-only "뒤로가기" button (see .detail__back-btn in the OU stylesheets)
  // — same .detail markup is used standalone and injected into the modal, so
  // this can't just be a plain link: inside the modal (root is the injected
  // content, not `document`) it closes the modal; on the standalone page it's
  // real browser back
  const backBtn = root.querySelector('.detail__back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (root !== document) {
        document.getElementById('ouModalClose')?.click();
      } else if (history.length > 1) {
        history.back();
      } else {
        location.href = 'FindTheKey.html#opportunities-unlocked';
      }
    });
  }

  const track = root.querySelector('#photoTrack');
  if (!track) return;

  const slides = Array.from(track.children);
  let index = slides.findIndex((el) => el.classList.contains('is-active'));
  if (index < 0) index = 0;

  // optional, page-specific: #detailLinks holds one .detail__link per photo
  // slide (same order) — only OpportunitiesUnlocked-05.html has this right
  // now, so on every other page this is just an empty array and the forEach
  // below is a no-op
  const links = Array.from(root.querySelectorAll('#detailLinks > .detail__link'));

  function render() {
    slides.forEach((el, i) => el.classList.toggle('is-active', i === index));
    links.forEach((el, i) => el.classList.toggle('is-active', i === index));
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
