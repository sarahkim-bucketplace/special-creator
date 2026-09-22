// keeps every scroll-driven pin/pause/grow script's layout math (pause
// targets, gaps, centering) consistent across very different real screen
// heights — MacBook 14" vs 16" vs an external monitor can easily differ by
// 150-200px of window.innerHeight, which was enough to change which
// elements land in frame together at each pause stop. Every script below
// reads this clamped "effective" viewport height instead of the raw one for
// that layout math, so the same composition results regardless of the
// actual screen. Places that must fill the REAL screen (a photo growing to
// literally cover the viewport with no gaps) still use window.innerHeight
// directly — this clamp only governs the logical spacing/centering/settle
// calculations, not the final full-bleed size.
(function () {
  var MIN_VH = 760;
  var MAX_VH = 960;

  function compute() {
    var v = Math.min(Math.max(window.innerHeight, MIN_VH), MAX_VH);
    document.documentElement.style.setProperty('--vh-eff', v + 'px');
    return v;
  }

  window.effVH = compute;
  compute();
  window.addEventListener('resize', compute);
})();

// shared "has scrolling actually settled since the last pause?" tracker —
// every pause/pin script (about-badge-pause.js, about-key-photo-pause.js,
// insight-after-trophy-pause.js, stats-pause.js, trophy-pause.js) calls
// markPauseUnlock() right when its own overflow:hidden lock releases.
// trophy-pause.js checks pauseSafeToTrigger() before triggering its own
// next stop.
//
// A plain fixed-length cooldown after unlock isn't enough here: a strong
// trackpad flick's inertial scroll can keep emitting wheel deltas well
// past any short fixed window, independent of whether the page could
// actually scroll during the lock, so a fixed cooldown alone still let
// leftover momentum chain straight into the next pause. Instead, after a
// lock releases, this waits for scrolling to actually go idle for IDLE_MS
// — genuinely stop, not just "some time has passed" — before the next
// trigger is allowed; every further scroll event (still the same
// momentum) pushes that idle point back out. Only once it's been reached
// does the state stay armed, so the user's next real, separate scroll can
// trigger normally.
(function () {
  var IDLE_MS = 150;
  var idleAchieved = true;
  var idleTimer = null;

  window.markPauseUnlock = function () {
    idleAchieved = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      idleAchieved = true;
    }, IDLE_MS);
  };

  window.addEventListener(
    'scroll',
    function () {
      if (idleAchieved) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        idleAchieved = true;
      }, IDLE_MS);
    },
    { passive: true }
  );

  window.pauseSafeToTrigger = function () {
    return idleAchieved;
  };
})();
