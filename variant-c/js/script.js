document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initNavLinks();
  initTopbar();
  initLangDropdown();
  initHeroTypewriter();
  initContactTypewriter();
  initQuoteBar();
  initBookingWidget();
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

function typeElement(el) {
  var segments = [];
  Array.prototype.forEach.call(el.childNodes, function (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      segments.push({ text: node.textContent, className: null });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      segments.push({ text: node.textContent, className: node.className });
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
      return;
    }
    var seg = segments[segIndex];
    if (charIndex === 0) {
      if (seg.className) {
        currentNode = document.createElement('span');
        currentNode.className = seg.className;
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
    setTimeout(typeNext, 28);
  }

  typeNext();
}

function initHeroTypewriter() {
  var el = document.querySelector('.hero-title');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  typeElement(el);
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

function initBookingWidget() {
  var widget = document.getElementById('booking-widget');
  if (!widget) return;
  var button = widget.querySelector('.booking-book');
  if (!button) return;

  button.addEventListener('click', function () {
    var open = widget.classList.toggle('is-open');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', function (e) {
    if (!widget.contains(e.target) && widget.classList.contains('is-open')) {
      widget.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  function dismiss() {
    widget.classList.remove('is-open');
    widget.classList.add('is-dismissed');
    button.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!widget.matches(':hover, :focus-within') && !widget.classList.contains('is-open')) return;
    dismiss();
    button.focus();
  });

  widget.addEventListener('mouseleave', function () { widget.classList.remove('is-dismissed'); });
  widget.addEventListener('focusout', function () {
    setTimeout(function () {
      if (!widget.contains(document.activeElement)) widget.classList.remove('is-dismissed');
    }, 0);
  });
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

  var form = document.getElementById('quote-bar');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var pickup = form.querySelector('[data-role="pickup"] input').value;
      var delivery = form.querySelector('[data-role="delivery"] input').value;
      window.location.hash = 'contact';
      console.log('Quote requested', { pickup: pickup, delivery: delivery });
    });
  }
}

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
  var rows = Array.prototype.slice.call(board.querySelectorAll('.d-rows li'));
  if (!rows.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var STATES = [
    { cls: 'd-road', label: 'On the road' },
    { cls: 'd-wait', label: 'In transit' },
    { cls: 'd-move', label: 'Removal' },
    { cls: 'd-done', label: 'Delivered' }
  ];

  var seconds = 14 * 3600 + 12 * 60 + 46;
  var active = 16;
  var delivered = 699;
  var timers = [];
  var running = false;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function renderClock() {
    var h = Math.floor(seconds / 3600) % 24;
    var m = Math.floor(seconds / 60) % 60;
    var s = seconds % 60;
    if (clock) clock.textContent = pad(h) + ':' + pad(m) + ':' + pad(s) + ' · ' + active + ' Active';
  }

  function tick() {
    seconds += 1;
    renderClock();
  }

  function shuffleRow() {
    var row = rows[Math.floor(Math.random() * rows.length)];
    var badge = row.querySelector('.d-status');
    if (!badge) return;

    var current = STATES.filter(function (s) { return badge.classList.contains(s.cls); })[0];
    var next = STATES[Math.floor(Math.random() * STATES.length)];
    if (current && next.cls === current.cls) {
      next = STATES[(STATES.indexOf(current) + 1) % STATES.length];
    }

    STATES.forEach(function (s) { badge.classList.remove(s.cls); });
    badge.classList.add(next.cls);
    badge.textContent = next.label;

    // brief flash so the change reads as an event rather than a repaint
    row.classList.remove('is-updating');
    void row.offsetWidth;
    row.classList.add('is-updating');

    if (next.cls === 'd-done') {
      delivered += 1;
      if (count) count.textContent = delivered.toLocaleString('en-GB') + ' deliveries';
      active = Math.max(8, active - 1);
    } else if (Math.random() > 0.6) {
      active += 1;
    }
    renderClock();
  }

  function start() {
    if (running) return;
    running = true;
    timers.push(setInterval(tick, 1000));
    timers.push(setInterval(shuffleRow, 2600));
  }

  function stop() {
    running = false;
    timers.forEach(clearInterval);
    timers = [];
  }

  renderClock();

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
