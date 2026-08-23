(function () {
  // "직접 만나 나누는 시간" 갤러리 — 스크롤해서 뷰포트에 들어올 때마다
  // 사진 프레임이 하나씩 나타남 (한 번 나타나면 다시 숨기지 않음)
  const photos = document.querySelectorAll('.btd-gallery__photo');
  if (!photos.length) return;

  // 같은 행에 동시에 들어오는 프레임들도 살짝 시간차를 두고 튀어나오게
  photos.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
  });

  if (!('IntersectionObserver' in window)) {
    photos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  photos.forEach((el) => observer.observe(el));
})();
