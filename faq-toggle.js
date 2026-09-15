// FAQ toggle (Figma 206:711) — each question independently expands to show
// its answer. Simple click-to-toggle, unlike the Special Gift accordion:
// short text reveals don't cause the kind of layout reflow that made
// scroll-driven detection unreliable there, so there's no need for the
// wheel-interception machinery — plain toggling is enough here.
(function () {
  document.querySelectorAll('.faq__item').forEach((item) => {
    const row = item.querySelector('.faq__row');
    if (!row) return;

    row.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      row.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();
