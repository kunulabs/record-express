/* Hero entrance sequence, shared by all three designs.
 *
 * Elements opt in with data-seq="N" in their design's HTML; those sharing a
 * number arrive together, and groups run in ascending order once the hero
 * headline has finished typing.
 *
 * The cue is the headline's is-typing class being removed, watched with a
 * MutationObserver rather than the "typed" custom event: only design 1's
 * typeElement dispatches that event, and the class is set by all three, so
 * observing it avoids editing three separate copies of script.js.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-seq]'));
  if (!steps.length) return;

  // Claim the sequence immediately, which cancels the CSS fallback. Done at
  // parse time rather than on DOMContentLoaded so there is no window in which
  // both the fallback and the script consider themselves in charge.
  root.classList.add('js-sequenced');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Group by data-seq, then order the groups numerically.
  var groups = {};
  steps.forEach(function (el) {
    var n = parseInt(el.getAttribute('data-seq'), 10);
    if (isNaN(n)) return;
    (groups[n] = groups[n] || []).push(el);
  });
  var order = Object.keys(groups).map(Number).sort(function (a, b) { return a - b; });
  if (!order.length) return;

  function finish() {
    // lets anything that should wait for the whole hero to settle - design 3's
    // CTA pulse, for one - gate on this rather than on a delay copied from the
    // sequence, which would drift the moment a step's timing changed
    root.classList.add('is-seq-done');
  }

  function revealFrom(i) {
    if (i >= order.length) { finish(); return; }
    var group = groups[order[i]];
    var pending = group.length;

    group.forEach(function (el) {
      // the next group waits for this one to finish, so the beats read as a
      // sequence rather than a stagger
      el.addEventListener('animationend', function done(e) {
        if (e.target !== el) return;
        el.removeEventListener('animationend', done);
        if (--pending === 0) revealFrom(i + 1);
      });
      el.classList.add('is-seq-in');
    });
  }

  function start() {
    if (reduced) {
      // nothing types under reduced motion, so there is no cue to wait for and
      // nothing to animate - the CSS has already left these visible
      steps.forEach(function (el) { el.classList.add('is-seq-in'); });
      finish();
      return;
    }
    revealFrom(0);
  }

  function run() {
    var title = document.querySelector('.hero-title');

    // no headline, or it never started typing: there is no cue, so go now
    if (!title || reduced || !title.classList.contains('is-typing')) {
      start();
      return;
    }

    var mo = new MutationObserver(function () {
      if (title.classList.contains('is-typing')) return;
      mo.disconnect();
      start();
    });
    mo.observe(title, { attributes: true, attributeFilter: ['class'] });
  }

  // after DOMContentLoaded so the headline's typewriter has been kicked off and
  // is-typing is already on the element by the time the cue is wired up
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
