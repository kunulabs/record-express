document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initTopbar();
  initLangDropdown();
  initHeroTilt();
  initQuoteBar();
  initStatsCountUp();
  initCarousels();
  initIndustryToggles();
  initHowItWorksStepper();
  initTestimonialFeature();
  initTimelineAccordion();
  initBlogFilters();
  initPartnersMarquee();
  initCopyTriggers();
  initServicePlaceholder();
  initContactForm();
  initNewsletterForm();
  initBackToTop();
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

function initHeroTilt() {
  var media = document.querySelector('.hero-media');
  var card = document.querySelector('.hero-media-card');
  if (!media || !card) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  media.addEventListener('mousemove', function (e) {
    var rect = media.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'rotateY(' + (x * 10) + 'deg) rotateX(' + (y * -10) + 'deg) translateZ(10px)';
  });

  media.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
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

function initCarousels() {
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var buttons = carousel.querySelectorAll('.carousel-btn');
    var dotsContainer = carousel.querySelector('[data-carousel-dots]');
    if (!track) return;

    var cards = Array.prototype.slice.call(track.children);
    var dots = [];

    function cardWidth() {
      var card = track.querySelector(':scope > *');
      return card ? card.getBoundingClientRect().width + 28 : 300;
    }

    function updateActiveDot() {
      if (!dots.length) return;
      var index = Math.round(track.scrollLeft / cardWidth());
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    if (dotsContainer && cards.length > 1) {
      cards.forEach(function (card, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function () {
          track.scrollTo({ left: cardWidth() * i, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
      var debounced;
      track.addEventListener('scroll', function () {
        clearTimeout(debounced);
        debounced = setTimeout(updateActiveDot, 100);
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-dir'), 10);
        track.scrollBy({ left: dir * cardWidth(), behavior: 'smooth' });
      });
    });
  });
}

function initIndustryToggles() {
  document.querySelectorAll('.industry-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.industry-card');
      if (!card) return;
      var isOpen = card.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}

function initHowItWorksStepper() {
  var container = document.getElementById('how-it-works-steps');
  if (!container) return;
  var steps = Array.prototype.slice.call(container.querySelectorAll('.step'));
  if (!steps.length) return;

  var current = 0;
  var timer = null;

  function setActive(index) {
    current = index;
    steps.forEach(function (step, i) {
      step.classList.toggle('is-active', i === index);
    });
    var progress = steps.length > 1 ? (index / (steps.length - 1)) * 100 : 0;
    container.style.setProperty('--steps-progress', progress + '%');
  }

  function startAuto() {
    stopAuto();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () {
      setActive((current + 1) % steps.length);
    }, 4000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  steps.forEach(function (step, i) {
    step.addEventListener('click', function () {
      setActive(i);
      startAuto();
    });
    step.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive(i);
        startAuto();
      }
    });
  });

  container.addEventListener('mouseenter', stopAuto);
  container.addEventListener('mouseleave', startAuto);

  setActive(0);
  startAuto();
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

function initTimelineAccordion() {
  var timeline = document.getElementById('about-timeline');
  if (!timeline) return;
  var items = Array.prototype.slice.call(timeline.querySelectorAll('[data-timeline-item]'));

  function activate(item) {
    items.forEach(function (i) {
      var isActive = i === item;
      i.classList.toggle('is-active', isActive);
      i.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () { activate(item); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(item);
      }
    });
  });
}

function initBlogFilters() {
  var filters = document.querySelectorAll('.blog-filter');
  var cards = document.querySelectorAll('.blog-card');
  if (!filters.length) return;

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-tag') === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });
}

function initPartnersMarquee() {
  var marquee = document.querySelector('.partners-marquee');
  if (!marquee) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Marquee runs via CSS animation; pause-on-hover is handled in CSS.
  // Clicking a logo pauses/resumes the scroll as an extra touch on touch devices.
  marquee.addEventListener('click', function () {
    marquee.classList.toggle('is-paused');
    var strips = marquee.querySelectorAll('.partners-strip');
    strips.forEach(function (s) {
      s.style.animationPlayState = marquee.classList.contains('is-paused') ? 'paused' : 'running';
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

function initBackToTop() {
  var button = document.getElementById('back-to-top');
  if (!button) return;

  window.addEventListener('scroll', function () {
    button.classList.toggle('is-visible', window.scrollY > 800);
  }, { passive: true });

  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initScrollReveal() {
  var selectors = [
    '.section-header', '.service-card', '.industry-card', '.blog-card',
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
