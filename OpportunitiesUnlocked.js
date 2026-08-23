(function () {
  // click-and-drag horizontal scroll for the OU card row, so mouse users
  // (not just trackpad/touch) can reach the cards that overflow past the
  // viewport once .ou-contents switches into its scrollable mode
  const track = document.querySelector('.ou-contents');
  if (!track) return;

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = false;

  function onPointerDown(e) {
    isDown = true;
    moved = false;
    track.classList.add('is-dragging');
    startX = e.pageX;
    startScrollLeft = track.scrollLeft;
  }

  function onPointerMove(e) {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 3) moved = true;
    track.scrollLeft = startScrollLeft - dx;
  }

  function onPointerUp() {
    isDown = false;
    track.classList.remove('is-dragging');
  }

  track.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  // a card is just a div (no link yet), so this guard isn't load-bearing
  // today, but keeps a real drag from also registering as a click later
  track.addEventListener('click', (e) => {
    if (moved) e.preventDefault();
  }, true);
})();
