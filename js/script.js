document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initQuoteBar();
  initCarousels();
  initContactForm();
  initNewsletterForm();
});

function initCarousels() {
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var buttons = carousel.querySelectorAll('.carousel-btn');
    if (!track || !buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-dir'), 10);
        var card = track.querySelector(':scope > *');
        var amount = card ? card.getBoundingClientRect().width + 28 : 300;
        track.scrollBy({ left: dir * amount, behavior: 'smooth' });
      });
    });
  });
}

function initMobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var header = document.querySelector('.site-header');
  if (!toggle || !header) return;

  toggle.addEventListener('click', function () {
    var isOpen = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
