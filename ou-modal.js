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

  // above this width the popup is the small fixed-aspect card from the
  // Figma mockup (node 181:588), rendered at NATURAL_WIDTH then scaled down
  // to fit — .detail's own layout uses fixed px values (padding, font-size)
  // tuned for a full viewport, so shrinking it as one scaled unit is the
  // only way to get the whole thing to fit a small card without it just
  // looking like a zoomed-in crop. Below this width the card would make
  // everything too tiny to read, so .detail instead renders at its own
  // natural (responsive) size inside a fullscreen scrollable sheet.
  const CARD_BREAKPOINT = 900;
  const NATURAL_WIDTH = 1280;
  const NATURAL_HEIGHT = 764;

  const loadedStylesheets = new Set();
  let currentDetail = null;

  function ensureStylesheet(href) {
    if (!href || loadedStylesheets.has(href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    loadedStylesheets.add(href);
  }

  function applyLayout() {
    if (!currentDetail) return;
    const scroll = content.parentElement;
    if (window.innerWidth > CARD_BREAKPOINT) {
      const scale = scroll.clientWidth / NATURAL_WIDTH;
      currentDetail.style.width = NATURAL_WIDTH + 'px';
      currentDetail.style.height = NATURAL_HEIGHT + 'px';
      currentDetail.style.transform = `scale(${scale})`;
    } else {
      currentDetail.style.width = '';
      currentDetail.style.height = '';
      currentDetail.style.transform = 'none';
    }
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
    currentDetail = null;
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
    currentDetail = detail;
    content.parentElement.scrollTop = 0;
    applyLayout();
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

  window.addEventListener('resize', applyLayout);

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();
