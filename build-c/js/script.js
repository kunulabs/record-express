document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initNavLinks();
  initTopbar();
  initLangDropdown();
  initHeroTypewriter();
  initHeroDescTypewriter();
  initHeroQuoteCard();
  initContactTypewriter();
  initQuoteBar();
  initStatsCountUp();
  initDispatchBoard();
  initServiceRail();
  initIndustrySelector();
  initHowItWorksStepper();
  initTestimonialFeature();
  initCopyTriggers();
  initServicePlaceholder();
  initContactForm();
  initNewsletterForm();
  initScrollReveal();
});

function initMobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var header = document.querySelector('.site-header');
  if (!toggle || !header) return;

  toggle.addEventListener('click', function () {
    var isOpen = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

function initNavLinks() {
  // This is a single-page LP with no other pages/sections to route to yet,
  // so nav items are inert placeholders rather than in-page anchor jumps.
  var header = document.querySelector('.site-header');
  var menuToggle = document.querySelector('.menu-toggle');

  document.querySelectorAll('.main-nav a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

  document.querySelectorAll('.mobile-nav a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (header) header.classList.remove('is-open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initTopbar() {
  var topbar = document.getElementById('topbar');
  var dismiss = document.querySelector('.topbar-dismiss');
  if (!topbar || !dismiss) return;

  dismiss.addEventListener('click', function () {
    topbar.classList.add('is-dismissed');
  });
}

function initLangDropdown() {
  var dropdown = document.querySelector('.lang-dropdown');
  var button = document.getElementById('lang-select-btn');
  var label = dropdown ? dropdown.querySelector('[data-lang-label]') : null;
  var options = dropdown ? dropdown.querySelectorAll('.lang-menu li') : [];
  if (!dropdown || !button) return;

  function close() {
    dropdown.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = dropdown.classList.toggle('is-open');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  options.forEach(function (option) {
    option.addEventListener('click', function () {
      options.forEach(function (o) { o.classList.remove('is-selected'); });
      option.classList.add('is-selected');
      if (label) label.textContent = option.getAttribute('data-lang');
      close();
    });
  });

  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
}

function typeElement(el, speed) {
  var segments = [];
  Array.prototype.forEach.call(el.childNodes, function (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      segments.push({ text: node.textContent, className: null });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      segments.push({ text: node.textContent, tag: node.tagName, className: node.className });
    }
  });
  if (!segments.length) return;

  var finalHeight = el.getBoundingClientRect().height;
  el.style.height = finalHeight + 'px';
  el.style.overflow = 'hidden';
  el.textContent = '';
  el.classList.add('is-typing');

  var segIndex = 0;
  var charIndex = 0;
  var currentNode = null;

  function typeNext() {
    if (segIndex >= segments.length) {
      el.classList.remove('is-typing');
      el.style.height = '';
      el.style.overflow = '';
      // lets anything sequenced behind the headline start on the real end of
      // the typing rather than on a delay guessed from the copy length
      el.dispatchEvent(new CustomEvent('typed', { bubbles: true }));
      return;
    }
    var seg = segments[segIndex];
    if (charIndex === 0) {
      if (seg.tag) {
        // the tag itself has to be rebuilt, not just its class: the headline's
        // highlight is a classed <span>, but the description's emphasis is a
        // bare <strong>, and keying off className alone dropped it to a plain
        // text node and lost the bold
        currentNode = document.createElement(seg.tag);
        if (seg.className) currentNode.className = seg.className;
        el.appendChild(currentNode);
      } else {
        currentNode = document.createTextNode('');
        el.appendChild(currentNode);
      }
    }
    currentNode.textContent += seg.text[charIndex];
    charIndex++;
    if (charIndex >= seg.text.length) {
      segIndex++;
      charIndex = 0;
    }
    setTimeout(typeNext, speed || 28);
  }

  typeNext();
}

function initHeroTypewriter() {
  var el = document.querySelector('.hero-title');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  typeElement(el);
}

// C stacks the hero, so the quote bar sits directly under the headline as its
// own section rather than beside it. It holds back until the headline has
// finished typing, keyed off the typewriter's own finish rather than a delay
// that would drift the moment the headline copy changed length.
function initHeroQuoteCard() {
  var card = document.querySelector('.quote-bar-section');
  var desc = document.querySelector('.hero-desc');
  if (!card) return;

  function show() { card.classList.add('is-typed'); }

  // Claiming the sequence cancels the CSS fallback outright, rather than the
  // two racing on timing. The fallback exists for the script never running at
  // all; once it has, a fixed delay can only be wrong - a throttled tab can
  // stretch the typing past any delay picked here, and the fallback firing
  // first would show the bar and then re-fade it when the typing finished.
  card.classList.add('js-sequenced');

  // the description is the last thing to type, so the bar waits on it rather
  // than on the headline. Under reduced motion nothing types at all, so there
  // is nothing to wait for.
  if (!desc || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    show();
    return;
  }

  // attached before the description starts, which it does when the headline
  // ends; the event fires whenever that run completes
  desc.addEventListener('typed', show, { once: true });
}

// The description types after the headline rather than alongside it, at 24ms
// a character. It is 139 characters, so this runs about 3.3s, and the quote
// bar waits on it finishing rather than on the headline.
function initHeroDescTypewriter() {
  var desc = document.querySelector('.hero-desc');
  var title = document.querySelector('.hero-title');
  if (!desc || !title) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // nothing to chain off if the headline never typed
  if (!title.classList.contains('is-typing')) {
    typeElement(desc, 24);
    return;
  }

  title.addEventListener('typed', function () { typeElement(desc, 24); }, { once: true });
}

function initContactTypewriter() {
  var el = document.querySelector('.contact-title');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        typeElement(el);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.9 });

  observer.observe(el);
}

function initStatsCountUp() {
  var stats = document.querySelectorAll('[data-count-to]');
  if (!stats.length) return;

  function animate(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    function isInt(n) { return Math.round(n) === n; }

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      var display = isInt(target) ? Math.round(value).toLocaleString('en-US') : value.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + (isInt(target) ? target.toLocaleString('en-US') : target) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    stats.forEach(animate);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(function (el) { observer.observe(el); });
}

function initServiceRail() {
  var rail = document.querySelector('.services-rail-list');
  var featured = document.querySelector('.services-featured');
  if (!rail || !featured) return;

  var tabs = Array.prototype.slice.call(rail.querySelectorAll('[data-service-tab]'));
  var panels = Array.prototype.slice.call(featured.querySelectorAll('.service-panel'));
  if (!tabs.length || !panels.length) return;

  function select(index) {
    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (panel, i) {
      var on = i === index;
      panel.classList.toggle('is-active', on);
      if (on) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(i); });
    // Roving arrow-key navigation, as expected of a tablist.
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (next === null) return;
      e.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
}

function initIndustrySelector() {
  var list = document.querySelector('.industries-list');
  var photos = Array.prototype.slice.call(document.querySelectorAll('.industry-photo'));
  if (!list) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll('.industry-row'));
  if (!rows.length) return;

  function select(index) {
    rows.forEach(function (row, i) {
      var on = i === index;
      row.classList.toggle('is-active', on);
      var header = row.querySelector('.industry-row-header');
      if (header) header.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    photos.forEach(function (photo, i) {
      var on = i === index;
      photo.classList.toggle('is-active', on);
      // the inactive photos are decorative duplicates of the active one
      if (on) photo.removeAttribute('aria-hidden');
      else photo.setAttribute('aria-hidden', 'true');
    });
  }

  rows.forEach(function (row, i) {
    var header = row.querySelector('.industry-row-header');
    if (header) header.addEventListener('click', function () { select(i); });
  });
}

function initHowItWorksStepper() {
  var section = document.querySelector('.how-it-works-section');
  var container = document.getElementById('how-it-works-steps');
  if (!section || !container) return;
  var steps = Array.prototype.slice.call(container.querySelectorAll('.step'));
  if (!steps.length) return;

  var scrollIndex = null;
  var hoverIndex = null;
  var current = null;

  function render() {
    var index = hoverIndex !== null ? hoverIndex : scrollIndex;
    if (index === current) return;
    current = index;
    steps.forEach(function (step, i) {
      step.classList.toggle('is-active', i === index);
      step.classList.toggle('is-visited', i <= index);
    });
    var progress = steps.length > 1 && index >= 0 ? index / (steps.length - 1) : 0;
    container.style.setProperty('--steps-progress', progress);
  }

  function setActive(index) {
    scrollIndex = index;
    render();
  }

  steps.forEach(function (step, i) {
    step.addEventListener('mouseenter', function () {
      hoverIndex = i;
      render();
    });
    step.addEventListener('mouseleave', function () {
      hoverIndex = null;
      render();
    });
    step.addEventListener('focus', function () {
      hoverIndex = i;
      render();
    });
    step.addEventListener('blur', function () {
      hoverIndex = null;
      render();
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setActive(0);
    return;
  }

  var ticking = false;

  function updateFromScroll() {
    ticking = false;
    var rect = section.getBoundingClientRect();
    var start = window.scrollY + rect.top;
    var end = start + rect.height;
    var fraction = (window.scrollY - start) / (end - start);
    if (fraction < 0) {
      setActive(-1);
      return;
    }
    fraction = Math.min(fraction, 1);
    var index = Math.round(fraction * (steps.length - 1));
    setActive(index);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateFromScroll);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateFromScroll();
}

function initTestimonialFeature() {
  var wrap = document.getElementById('testimonial-cards');
  if (!wrap) return;
  var featured = wrap.querySelector('[data-featured]');
  var others = wrap.querySelectorAll('.testimonial-card[role="button"]');
  if (!featured || !others.length) return;

  var quoteText = featured.querySelector('[data-quote-text]');
  var quoteName = featured.querySelector('[data-quote-name]');
  var quoteRole = featured.querySelector('[data-quote-role]');
  var quoteAvatar = featured.querySelector('[data-quote-avatar]');

  others.forEach(function (card) {
    function promote() {
      var newQuote = card.getAttribute('data-quote');
      var newName = card.getAttribute('data-name');
      var newRole = card.getAttribute('data-role');
      var newAvatar = card.getAttribute('data-avatar');

      var prevQuote = featured.getAttribute('data-quote');
      var prevName = featured.getAttribute('data-name');
      var prevRole = featured.getAttribute('data-role');
      var prevAvatar = featured.getAttribute('data-avatar');

      featured.classList.add('is-updating');
      setTimeout(function () {
        quoteText.textContent = newQuote;
        quoteName.textContent = newName;
        quoteRole.textContent = newRole;
        quoteAvatar.src = newAvatar;
        featured.setAttribute('data-quote', newQuote);
        featured.setAttribute('data-name', newName);
        featured.setAttribute('data-role', newRole);
        featured.setAttribute('data-avatar', newAvatar);
        featured.classList.remove('is-updating');
      }, 150);

      card.setAttribute('data-quote', prevQuote);
      card.setAttribute('data-name', prevName);
      card.setAttribute('data-role', prevRole);
      card.setAttribute('data-avatar', prevAvatar);
      card.querySelector('p').textContent = prevQuote;
      card.querySelector('cite').textContent = prevName;
      card.querySelector('footer span').textContent = prevRole;
      card.querySelector('footer img').src = prevAvatar;
    }

    card.addEventListener('click', promote);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        promote();
      }
    });
  });
}

function initCopyTriggers() {
  var toast = document.getElementById('copy-toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2000);
  }

  document.querySelectorAll('.copy-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var value = trigger.getAttribute('data-copy') || trigger.textContent.trim();
      var label = trigger.getAttribute('data-copy-label') || value;

      function done() {
        showToast('Copied ' + label + ' to clipboard');
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, done);
      } else {
        var textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); } catch (e) { /* no-op */ }
        document.body.removeChild(textarea);
        done();
      }
    });
  });
}

function initServicePlaceholder() {
  var select = document.querySelector('[data-service-select]');
  var message = document.querySelector('[data-message-field]');
  if (!select || !message) return;

  function updatePlaceholder() {
    var option = select.options[select.selectedIndex];
    var placeholder = option ? option.getAttribute('data-placeholder') : null;
    if (placeholder) message.setAttribute('placeholder', placeholder);
  }

  select.addEventListener('change', updatePlaceholder);
}

function initQuoteBar() {
  var options = document.querySelectorAll('.quote-option');
  options.forEach(function (option) {
    option.addEventListener('click', function () {
      options.forEach(function (o) { o.classList.remove('is-active'); });
      option.classList.add('is-active');
    });
    var input = option.querySelector('input');
    if (input) {
      input.addEventListener('focus', function () {
        options.forEach(function (o) { o.classList.remove('is-active'); });
        option.classList.add('is-active');
      });
    }
  });

  // there are two of these on the page now - the in-page bar and the sticky
  // copy - so bind them all rather than the single original id
  document.querySelectorAll('form.quote-bar').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var pickup = form.querySelector('[data-role="pickup"] input').value;
      var delivery = form.querySelector('[data-role="delivery"] input').value;
      window.location.hash = 'contact';
      console.log('Quote requested', { pickup: pickup, delivery: delivery });
    });
  });
}

// The capsule only takes over once the in-page quote bar has scrolled away, so
// the two are never on screen at the same time.
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var note = form.querySelector('[data-default-note]');
  var defaultNote = note ? note.textContent : '';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (note) {
      note.textContent = 'Thanks! Your quote request has been received.';
    }
    form.reset();
    setTimeout(function () {
      if (note) note.textContent = defaultNote;
    }, 6000);
  });
}

function initNewsletterForm() {
  var form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button');
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    var originalLabel = button.innerHTML;
    button.innerHTML = 'Subscribed';
    form.reset();
    setTimeout(function () {
      button.innerHTML = originalLabel;
    }, 4000);
  });
}

function initScrollReveal() {
  var selectors = [
    '.section-header', '.services-showcase', '.industries-photo',
    '.industries-list', '.blog-card',
    '.testimonial-card', '.step', '.stat', '.benefits-copy', '.benefits-media',
    '.about-copy', '.about-media', '.contact-form', '.contact-copy',
    '.benefits2-card', '.urgent-cta'
  ];
  var elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  elements.forEach(function (el) { el.setAttribute('data-reveal', ''); });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('is-revealed'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
}

// Brings the hero dispatch panel to life: the clock runs, shipments change
// status, and the counters drift the way a real board would.
function initDispatchBoard() {
  var board = document.querySelector('.hero-dispatch');
  if (!board) return;

  var clock = board.querySelector('.d-clock');
  var count = board.querySelector('.d-count');
  var list = board.querySelector('.d-rows');
  if (!list) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll('li'));
  if (!rows.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A job walks down this pipeline one stage at a time, and only forwards.
  // Keeping the stages ordered is what makes the board read as work
  // progressing rather than as cells flickering at random; the four labels and
  // badge colours are the ones from the design.
  var STAGES = [
    { cls: 'd-move', label: 'Removal' },
    { cls: 'd-wait', label: 'In transit' },
    { cls: 'd-road', label: 'On the road' },
    { cls: 'd-done', label: 'Delivered' }
  ];
  var DONE = STAGES.length - 1;

  var ROUTES = [
    ['Brussels', 'Cork'], ['Charleroi', 'Paris Nord'], ['Brussels', 'Lille'],
    ['Antwerp', 'Cork'], ['Liege', 'Antwerp'], ['Ghent', 'Brussels'],
    ['Namur', 'Cork'], ['Antwerp', 'Paris Nord'], ['Brussels', 'Rotterdam'],
    ['Bruges', 'Lille'], ['Leuven', 'Eindhoven'], ['Mons', 'Luxembourg'],
    ['Hasselt', 'Dusseldorf'], ['Brussels', 'Amsterdam'], ['Ghent', 'Calais'],
    ['Antwerp', 'Cologne'], ['Liege', 'Maastricht'], ['Brussels', 'Roissy CDG'],
    ['Tournai', 'Lille'], ['Mechelen', 'Breda'], ['Kortrijk', 'Paris Nord']
  ];

  var ROW_COUNT = rows.length;
  var seconds = 14 * 3600 + 12 * 60 + 46;
  var delivered = 699;
  var timers = [];
  var running = false;
  var booted = false;

  // New jobs get the next reference up from the highest already on the board,
  // so arrivals always carry a higher number than the work above them.
  var nextCode = rows.reduce(function (max, row) {
    var el = row.querySelector('.d-code');
    var n = el ? parseInt(String(el.textContent).replace(/\D/g, ''), 10) : 0;
    return isNaN(n) ? max : Math.max(max, n);
  }, 0) || 25118;

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function later(fn, ms) {
    var t = setTimeout(function () {
      var i = timers.indexOf(t);
      if (i !== -1) timers.splice(i, 1);
      fn();
    }, ms);
    timers.push(t);
    return t;
  }

  function every(fn, ms) {
    var t = setInterval(fn, ms);
    timers.push(t);
    return t;
  }

  function stageOf(row) {
    var badge = row.querySelector('.d-status');
    if (!badge) return -1;
    for (var i = 0; i < STAGES.length; i++) {
      if (badge.classList.contains(STAGES[i].cls)) return i;
    }
    return -1;
  }

  function setStage(row, index) {
    var badge = row.querySelector('.d-status');
    if (!badge) return;
    STAGES.forEach(function (s) { badge.classList.remove(s.cls); });
    badge.classList.add(STAGES[index].cls);
    badge.textContent = STAGES[index].label;
  }

  // Active is derived from what is actually on the board rather than drifting
  // on its own, plus the runs being handled outside this window.
  function render() {
    var live = 0;
    Array.prototype.forEach.call(list.children, function (row) {
      if (stageOf(row) < DONE) live += 1;
    });
    var active = live + 9;
    var h = Math.floor(seconds / 3600) % 24;
    var m = Math.floor(seconds / 60) % 60;
    var s = seconds % 60;
    if (clock) clock.textContent = pad(h) + ':' + pad(m) + ':' + pad(s) + ' · ' + active + ' Active';
    if (count) count.textContent = delivered.toLocaleString('en-GB') + ' deliveries';
  }

  function tick() {
    seconds += 1;
    render();
  }

  // Load a fresh booking into a row: new reference, new route, back to the
  // head of the pipeline.
  function fillRow(li) {
    var route = pick(ROUTES);
    nextCode += 1 + Math.floor(Math.random() * 7);

    li.textContent = '';

    var code = document.createElement('span');
    code.className = 'd-code';
    code.textContent = 'RX-' + nextCode;

    var journey = document.createElement('span');
    journey.className = 'd-journey';
    journey.appendChild(document.createTextNode(route[0] + ' '));
    var arrow = document.createElement('i');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    journey.appendChild(arrow);
    journey.appendChild(document.createTextNode(' ' + route[1]));

    var status = document.createElement('span');
    status.className = 'd-status ' + STAGES[0].cls;
    status.textContent = STAGES[0].label;

    li.appendChild(code);
    li.appendChild(journey);
    li.appendChild(status);
    return li;
  }

  function buildRow() {
    return fillRow(document.createElement('li'));
  }

  // A delivered job holds on screen just long enough to read, then the slot
  // takes new work. Without this the board silts up: completions accumulate
  // faster than arrivals clear them, and after a minute or two almost every
  // row is Delivered and nothing moves.
  function recycle(row) {
    if (!row.parentNode || stageOf(row) !== DONE) return;
    fillRow(row);
    render();
  }

  // Move one job on by a single stage, never backwards.
  function advance() {
    var movable = Array.prototype.filter.call(list.children, function (row) {
      var i = stageOf(row);
      return i >= 0 && i < DONE;
    });

    // everything on screen is finished - clear the oldest one out now rather
    // than waiting on its hold timer, so the board always has something to do
    if (!movable.length) {
      var done = Array.prototype.filter.call(list.children, function (row) {
        return stageOf(row) === DONE;
      });
      if (done.length) recycle(done[done.length - 1]);
      return;
    }

    var row = pick(movable);
    var next = stageOf(row) + 1;
    setStage(row, next);
    if (next === DONE) {
      delivered += 1;
      later(function () { recycle(row); }, 2600 + Math.floor(Math.random() * 1600));
    }
    render();
  }

  // A booking lands on top and the list scrolls down one row, pushing the
  // oldest job off the bottom, the way a real board takes new work.
  function arrive() {
    var first = list.firstElementChild;
    var rowHeight = first ? first.getBoundingClientRect().height : 0;
    var li = buildRow();
    list.insertBefore(li, first);
    var last = list.lastElementChild;

    function trim() {
      list.style.transition = '';
      list.style.transform = '';
      while (list.children.length > ROW_COUNT) {
        list.removeChild(list.lastElementChild);
      }
      render();
    }

    if (reduced || !rowHeight) { trim(); return; }

    list.style.transition = 'none';
    list.style.transform = 'translateY(' + -rowHeight + 'px)';
    void list.offsetWidth;
    list.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    list.style.transform = 'translateY(0)';
    if (last) last.classList.add('is-ageing');

    later(trim, 500);
    render();
  }

  // Rows stream in the first time the board is seen, the way a screen
  // populates, and the live updates hold until they have all landed.
  function bootRows() {
    booted = true;
    rows.forEach(function (row, i) {
      row.classList.add('is-loading');
      later(function () {
        row.classList.remove('is-loading');
        row.classList.add('is-loaded');
      }, 120 + i * 95);
    });
  }

  // Self-rescheduling rather than fixed intervals, so updates land on an
  // uneven beat the way real traffic does instead of metronomically.
  function loopAdvance() {
    if (!running) return;
    advance();
    later(loopAdvance, 1100 + Math.floor(Math.random() * 800));
  }

  function loopArrive() {
    if (!running) return;
    arrive();
    later(loopArrive, 7000 + Math.floor(Math.random() * 3500));
  }

  function startLoops() {
    loopAdvance();
    later(loopArrive, 4000);
  }

  function start() {
    if (running || reduced) return;
    running = true;
    if (!booted) {
      bootRows();
      later(startLoops, 120 + rows.length * 95 + 600);
    } else {
      startLoops();
    }
    every(tick, 1000);
  }

  function stop() {
    running = false;
    timers.forEach(function (t) { clearInterval(t); clearTimeout(t); });
    timers = [];
    // a stop mid-slide would otherwise leave the list parked off its origin
    list.style.transition = '';
    list.style.transform = '';
    while (list.children.length > ROW_COUNT) {
      list.removeChild(list.lastElementChild);
    }
  }

  render();
  if (reduced) return;

  // only run while the panel is actually on screen
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.15 });
    io.observe(board);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (board.getBoundingClientRect().top < window.innerHeight) start();
  });
}
