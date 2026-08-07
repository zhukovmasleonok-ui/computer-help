/**
 * Компьютерная помощь — Landing Page Scripts
 */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const scrollTopBtn = document.getElementById('scrollTop');
  const orderForm = document.getElementById('orderForm');
  const phoneInput = document.getElementById('phone');
  const successModal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalClose');
  const modalOk = document.getElementById('modalOk');
  const yearEl = document.getElementById('year');

  // ---------- Year in footer ----------
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Sticky header ----------
  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // ---------- Scroll to top button ----------
  function updateScrollTop() {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Mobile menu ----------
  function closeMenu() {
    burger.classList.remove('active');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    burger.classList.add('active');
    nav.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  burger.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu on nav link click
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
  });

  // ---------- Active nav link on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ---------- Scroll animations (Intersection Observer) ----------
  const animatedEls = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedEls.forEach((el) => observer.observe(el));

  // ---------- Counters ----------
  function animateCounter(el, target, duration) {
    const start = 0;
    const startTime = performance.now();
    const isPlus = el.parentElement && el.parentElement.textContent.includes('+');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * eased);
      el.textContent = value.toLocaleString('ru-RU');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('ru-RU');
      }
    }

    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counterEls.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      animateCounter(el, target, 1800);
    });
  }

  // Start counters when hero stats become visible
  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounters();
          counterObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(heroStats);
  }

  // Also animate why-us counters
  const whyNums = document.querySelectorAll('.why-card__num[data-count]');
  whyNums.forEach((el) => {
    const whyObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const target = parseInt(el.getAttribute('data-count'), 10);
          animateCounter(el, target, 2000);
          whyObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    whyObserver.observe(el);
  });

  // ---------- FAQ Accordion ----------
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq__question');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach((other) => {
        other.classList.remove('active');
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- Phone mask ----------
  function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    let cleaned = digits;

    // Handle leading 8 or 7
    if (cleaned.startsWith('8')) {
      cleaned = '7' + cleaned.slice(1);
    }
    if (!cleaned.startsWith('7') && cleaned.length > 0) {
      cleaned = '7' + cleaned;
    }

    // Limit to 11 digits
    cleaned = cleaned.slice(0, 11);

    let result = '';
    if (cleaned.length > 0) {
      result = '+7';
    }
    if (cleaned.length > 1) {
      result += ' (' + cleaned.slice(1, 4);
    }
    if (cleaned.length >= 4) {
      result += ')';
    }
    if (cleaned.length > 4) {
      result += ' ' + cleaned.slice(4, 7);
    }
    if (cleaned.length > 7) {
      result += '-' + cleaned.slice(7, 9);
    }
    if (cleaned.length > 9) {
      result += '-' + cleaned.slice(9, 11);
    }

    return result;
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const cursorPos = e.target.selectionStart;
      const oldLen = e.target.value.length;
      e.target.value = formatPhone(e.target.value);
      const newLen = e.target.value.length;
      // Simple cursor adjustment
      const diff = newLen - oldLen;
      e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
    });

    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) {
        phoneInput.value = '+7 (';
      }
    });

    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value === '+7 (' || phoneInput.value === '+7') {
        phoneInput.value = '';
      }
    });

    // Paste handling
    phoneInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      phoneInput.value = formatPhone(pasted);
    });
  }

  // ---------- Form validation ----------
  function validateName(name) {
    const trimmed = name.trim();
    if (!trimmed) return 'Укажите ваше имя';
    if (trimmed.length < 2) return 'Имя слишком короткое';
    return '';
  }

  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (!digits || digits.length < 11) return 'Введите корректный номер телефона';
    if (!digits.startsWith('7') && !digits.startsWith('8')) return 'Номер должен начинаться с +7';
    return '';
  }

  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.toggle('error', !!message);
    if (error) error.textContent = message;
  }

  if (orderForm) {
    const submitBtn = document.getElementById('formSubmit');
    const submitText = submitBtn ? submitBtn.querySelector('.form__submit-text') : null;

    // Заявки уходят на почту через FormSubmit.co
    var FORM_EMAIL = 'zhuk_zhukov_98@mail.ru';

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('name').value;
      const phoneVal = document.getElementById('phone').value;
      const messageVal = document.getElementById('message').value;

      const nameErr = validateName(nameVal);
      const phoneErr = validatePhone(phoneVal);

      showError('name', 'nameError', nameErr);
      showError('phone', 'phoneError', phoneErr);

      if (nameErr || phoneErr) return;

      // Антиспам: если honeypot заполнен — не отправляем
      const honey = orderForm.querySelector('[name="_honey"]');
      if (honey && honey.value) {
        openModal();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'Отправка...';
      }

      fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: nameVal.trim(),
          phone: phoneVal.trim(),
          message: messageVal.trim(),
          _subject: 'Новая заявка с сайта Компьютерная помощь',
        }),
      })
        .then((res) => res.json().then((data) => ({ ok: res.ok, data: data })))
        .then(function (result) {
          if (!result.ok || (result.data && result.data.success === 'false')) {
            throw new Error((result.data && result.data.message) || 'Ошибка отправки');
          }
          orderForm.reset();
          showError('name', 'nameError', '');
          showError('phone', 'phoneError', '');
          openModal();
        })
        .catch(function (err) {
          console.error('Form submit error:', err);
          alert('Не удалось отправить заявку. Позвоните нам: +7 (978) 821-45-66');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            if (submitText) submitText.textContent = 'Вызвать мастера';
          }
        });
    });

    document.getElementById('name').addEventListener('input', function () {
      showError('name', 'nameError', '');
    });
    document.getElementById('phone').addEventListener('input', function () {
      showError('phone', 'phoneError', '');
    });
  }

  // ---------- Modal ----------
  function openModal() {
    successModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    successModal.hidden = true;
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOk) modalOk.addEventListener('click', closeModal);

  successModal.querySelector('.modal__overlay').addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !successModal.hidden) {
      closeModal();
    }
  });

  // ---------- Scroll handler (throttled via rAF) ----------
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeader();
        updateScrollTop();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial calls
  updateHeader();
  updateScrollTop();
  updateActiveNav();

  // ---------- Smooth scroll for anchor links (fallback enhancement) ----------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 8;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
