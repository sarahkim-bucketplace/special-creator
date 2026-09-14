// opens an Opportunities Unlocked case study as a popup over the current
// page instead of navigating to its standalone HTML file. Fetches that
// page, pulls out its .detail block + stylesheet, and injects both here —
// the standalone OpportunitiesUnlocked-0N.html pages themselves are
// untouched and still work as direct links
(function () {
  const modal = document.getElementById('ouModal');
  const content = document.getElementById('ouModalContent');
  const closeBtn = document.getElementById('ouModalClose');
  if (!modal || !content || !closeBtn) return;

  const loadedStylesheets = new Set();

  function ensureStylesheet(href) {
    if (!href || loadedStylesheets.has(href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    loadedStylesheets.add(href);
  }

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ou-modal-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ou-modal-open');
    content.innerHTML = '';
  }

  function isDetailHref(href) {
    return /OpportunitiesUnlocked-\d+\.html$/.test(href);
  }

  function isListHref(href) {
    return /OpportunitiesUnlocked\.html$/.test(href);
  }

  async function loadDetail(href) {
    const res = await fetch(href);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const detail = doc.querySelector('.detail');
    if (!detail) return;

    const cssHref = doc.querySelector('link[rel="stylesheet"]')?.getAttribute('href');
    ensureStylesheet(cssHref);

    content.innerHTML = '';
    content.appendChild(detail);
    content.parentElement.scrollTop = 0;
    openModal();
    initPhotoCarousel(content);
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');

    if (link.classList.contains('ou-card') && isDetailHref(href)) {
      e.preventDefault();
      loadDetail(href);
      return;
    }

    if (modal.contains(link)) {
      if (isDetailHref(href)) {
        e.preventDefault();
        loadDetail(href);
        return;
      }
      // "목록으로" — the list is already the opportunities-unlocked section
      // on this same page, so close the popup instead of navigating to the
      // standalone list page
      if (isListHref(href)) {
        e.preventDefault();
        closeModal();
      }
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();
