// Special Gift index toggle (Figma 202:530 collapsed / 203:623 expanded):
// each entry's chevron opens a placeholder photo gallery below it. Toggling
// .is-open (CSS gives it grid-column:1/-1) is enough to make an open entry
// span the full width and let the grid reflow the rest around it — no
// layout math needed here, just show/hide the gallery and flip the class.
(function () {
  const entries = document.querySelectorAll('.btd-gift__entry');

  entries.forEach((entry) => {
    const row = entry.querySelector('.btd-gift__row');
    const gallery = entry.querySelector('.btd-gift__gallery');
    if (!row || !gallery) return;

    row.addEventListener('click', () => {
      const isOpen = entry.classList.toggle('is-open');
      row.setAttribute('aria-expanded', String(isOpen));
      gallery.hidden = !isOpen;
    });
  });
})();
