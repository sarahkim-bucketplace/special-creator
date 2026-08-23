(function () {
  // shared by all 9 pages that use the .header component — toggles the
  // mobile dropdown nav (<=900px) via the hamburger button
  const header = document.querySelector('.header');
  const btn = document.getElementById('header-menu-btn');
  const links = document.getElementById('header-links');
  if (!header || !btn || !links) return;

  function closeMenu() {
    header.classList.remove('header--menu-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const isOpen = header.classList.toggle('header--menu-open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();
