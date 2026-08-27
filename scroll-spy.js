// highlights the header nav link for whichever section is currently under a
// thin band just below the fixed header, as the combined page scrolls.
// also drives the down-scroll nudge button: click jumps to the next section,
// and it hides once the last section becomes active.
(function () {
  const sections = Array.from(document.querySelectorAll('.page > section[id]'));
  const links = Array.from(document.querySelectorAll('.header__link[href^="#"]'));
  const downHint = document.getElementById('downHint');
  if (!sections.length) return;

  let activeId = sections[0].id;

  function setActive(id) {
    activeId = id;
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('header__link--on', isActive);
      link.classList.toggle('header__link--off', !isActive);
    });
    if (downHint) {
      const isLast = id === sections[sections.length - 1].id;
      downHint.classList.toggle('is-hidden', isLast);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: '-72px 0px -70% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  if (downHint) {
    downHint.addEventListener('click', () => {
      const idx = sections.findIndex((section) => section.id === activeId);
      const next = sections[idx + 1];
      if (next) next.scrollIntoView({ block: 'start' });
    });
  }
})();
