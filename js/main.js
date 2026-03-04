/**
 * Gala & Co — Cinematic Hero System
 * Vanilla JS only — no libraries, no frameworks
 */

'use strict';

/* ============================================================
   UTILITY: Reduced Motion Detection
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   UTILITY: Lerp (linear interpolation for smooth following)
   ============================================================ */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* ============================================================
   ACTIVE NAV LINK DETECTION
   ============================================================ */
function setActiveNavLink() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .mobile-menu a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if ((filename === 'index.html' || filename === '') && href === 'index.html') {
      link.classList.add('active');
    } else if (filename && href === filename) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   HEADER — Transparent / Scrolled States
   ============================================================ */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const logoImg = header.querySelector('.brand-logo-img');
  const LOGO_DARK = 'assets/images/logo.png';
  const LOGO_WHITE = 'assets/images/White_Logo.png';
  const THRESHOLD = 80;

  const update = () => {
    if (window.scrollY > THRESHOLD) {
      header.classList.remove('transparent');
      header.classList.add('scrolled');
      // Sticky White Header State -> logo.png
      if (logoImg && logoImg.getAttribute('src') !== LOGO_DARK) {
        logoImg.setAttribute('src', LOGO_DARK);
      }
    } else {
      header.classList.remove('scrolled');
      header.classList.add('transparent');
      // Transparent Hero Header State -> White_Logo.png
      if (logoImg && logoImg.getAttribute('src') !== LOGO_WHITE) {
        logoImg.setAttribute('src', LOGO_WHITE);
      }
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update(); // initial state
}

/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const toggle = () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);

  mobileMenu.querySelectorAll('a, .btn-mobile-cta').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   CINEMATIC LOAD SEQUENCE
   Orchestrates: hero image zoom | logo seal | navbar settle | content reveal
   ============================================================ */
function initCinematicLoad() {
  const heroSection = document.querySelector('.hero-section');
  const logoSeal = document.querySelector('.hero-logo-seal');
  const headerLogo = document.querySelector('.header-logo');
  const header = document.querySelector('.site-header');

  if (!heroSection) return;

  // If user prefers reduced motion — skip to final state immediately
  if (prefersReducedMotion) {
    if (heroSection) {
      heroSection.classList.add('loaded', 'content-visible');
    }
    if (logoSeal) logoSeal.classList.add('settled');
    if (headerLogo) headerLogo.classList.add('visible');
    if (header) {
      header.classList.add('transparent');
    }
    return;
  }

  // Step 1 — Immediate: hero image begins scale 1.05 → 1
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroSection.classList.add('loaded');
    });
  });

  // Step 2 — Logo Seal appears (t = 80ms)
  setTimeout(() => {
    if (logoSeal) {
      logoSeal.classList.add('appearing');
    }
  }, 80);

  // Step 3 — Logo settles into navbar (t = 2.2s — slower, more considered)
  setTimeout(() => {
    if (logoSeal) {
      logoSeal.classList.remove('appearing');
      logoSeal.classList.add('settling');
    }
    // Trigger overlay fade: cream screen recedes, revealing full hero image
    if (heroSection) {
      heroSection.classList.add('logo-settling');
    }
    // Navbar logo becomes visible
    if (headerLogo) {
      headerLogo.classList.add('visible');
    }
  }, 2200);

  // Step 4 — Content stagger in (t = 3.1s)
  setTimeout(() => {
    if (logoSeal) {
      logoSeal.classList.remove('settling');
      logoSeal.classList.add('settled');
    }
    if (heroSection) {
      heroSection.classList.add('content-visible');
    }
  }, 3100);
}

/* ============================================================
   MOUSE PARALLAX — Desktop only, rAF-driven
   Background: max ±1.5%, Logo seal: ±1%, Content: ±0.5%
   ============================================================ */
function initMouseParallax() {
  // Disable on touch/coarse pointer devices (mobile)
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (prefersReducedMotion) return;

  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const heroBgImg = document.querySelector('.hero-bg img');
  const logoSeal = document.querySelector('.hero-logo-seal');
  const heroContent = document.querySelector('.hero-content');

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;
  let isActive = false;

  const LERP_FACTOR = 0.07;  // Slow ease factor for smoothness

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Normalized -1 to +1 relative to center
    targetX = (e.clientX - cx) / (rect.width / 2);
    targetY = (e.clientY - cy) / (rect.height / 2);

    if (!isActive) {
      isActive = true;
      animate();
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    // Ease back to center
    targetX = 0;
    targetY = 0;
    // Keep animating until settled
    if (!isActive) {
      isActive = true;
      animate();
    }
  });

  function animate() {
    currentX = lerp(currentX, targetX, LERP_FACTOR);
    currentY = lerp(currentY, targetY, LERP_FACTOR);

    const settled = Math.abs(currentX - targetX) < 0.0005 && Math.abs(currentY - targetY) < 0.0005;

    // Apply transforms — extremely minimal parallax (±0.3% max depth)
    const intensity = 0.2; // Borderline invisible but present for UX

    if (heroBgImg) {
      const px = currentX * intensity * 1.5;
      const py = currentY * intensity * 1.0;
      heroBgImg.style.transform = `scale(${heroSection.classList.contains('loaded') ? 1 : 1.05}) translate(${px}%, ${py}%)`;
    }

    if (logoSeal && !logoSeal.classList.contains('settled') && !logoSeal.classList.contains('settling')) {
      const px = currentX * intensity * 1.0;
      const py = currentY * intensity * 0.7;
      logoSeal.style.transform = `translate(${px}%, ${py}%)`;
    }

    if (heroContent) {
      const px = currentX * intensity * 0.5;
      const py = currentY * intensity * 0.35;
      heroContent.style.transform = `translate(${px}%, ${py}%)`;
    }

    if (settled && targetX === 0 && targetY === 0) {
      isActive = false;
      if (heroBgImg) heroBgImg.style.transform = `scale(${heroSection.classList.contains('loaded') ? 1 : 1.05})`;
      if (heroContent) heroContent.style.transform = '';
      cancelAnimationFrame(rafId);
      return;
    }

    rafId = requestAnimationFrame(animate);
  }
}

/* ============================================================
   SCROLL-DRIVEN HERO SYSTEM
   Hero zoom out, overlay darkens, headline fades
   NOTE: Scroll transforms go on .hero-bg (wrapper).
   Mouse parallax goes on .hero-bg img (child). No conflict.
   ============================================================ */
function initHeroScroll() {
  const heroSection = document.querySelector('.hero-section');
  const heroBg = document.querySelector('.hero-bg');
  const heroGradient = document.querySelector('.hero-section .luxury-gradient-overlay');
  const heroH1 = document.querySelector('.hero-h1');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (!heroSection) return;
  if (prefersReducedMotion) return;

  let lastScrollY = -1;
  let rafId = null;

  const update = () => {
    const scrollY = window.scrollY;
    if (scrollY === lastScrollY) return;
    lastScrollY = scrollY;

    const viewH = window.innerHeight;
    // Progress 0–1 as user scrolls through hero
    const progress = Math.min(1, scrollY / viewH);

    // Hero image zoom: scale 1 → 0.98
    if (heroBg) {
      const scale = 1 - (progress * 0.025);
      heroBg.style.transform = `scale(${scale}) translateY(${progress * 5}%)`;
    }

    // Overlay darkens slightly
    if (heroGradient) {
      const extraOpacity = progress * 0.3;
      heroGradient.style.opacity = 1 + extraOpacity;
    }

    // Headline fades and rises
    if (heroH1 && heroSection.classList.contains('content-visible')) {
      const fade = Math.max(0, 1 - progress * 2.5);
      heroH1.style.opacity = fade;
      heroH1.style.transform = `translateY(${-progress * 20}px)`;
    }

    // Scroll indicator fades on scroll
    if (scrollIndicator) {
      const indicatorFade = Math.max(0, 1 - progress * 5);
      scrollIndicator.style.opacity = indicatorFade;
    }
  };

  const onScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver (for sections below hero)
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .reveal-right, .about-image-wrap');

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ============================================================
   SERVICES — Click to Activate
   ============================================================ */
function initServices() {
  const rows = document.querySelectorAll('.service-row');
  if (!rows.length) return;

  if (rows[0]) rows[0].classList.add('active-service');

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active-service'));
      row.classList.add('active-service');
    });
  });
}

/* ============================================================
   SERVICES — Scroll-Driven Micro-Drift (Desktop only)
   Subtle lateral shift (max 30px) tied to scroll progress
   ============================================================ */
function initServiceMicroScroll() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (prefersReducedMotion) return;

  const section = document.querySelector('.services-section');
  const rows = document.querySelectorAll('.service-row');
  if (!section || !rows.length) return;

  let rafId = null;

  const update = () => {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    // Is the section in view?
    if (rect.top < winH && rect.bottom > 0) {
      // Progress of the section through the viewport (0 to 1)
      const progress = Math.min(1, Math.max(0, (winH - rect.top) / (winH + rect.height)));

      // Drift calculation: -30px to +30px (60px total)
      const drift = (progress - 0.5) * 60;

      rows.forEach((row, index) => {
        // Mirrored drift for architectural balance
        const multiplier = index % 2 === 0 ? 1 : -1;
        const x = drift * multiplier;
        row.style.setProperty('--drift-x', `${x}px`);
      });
    }
    rafId = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(update);
  }, { passive: true });

  update(); // Initial position
}

/**
 * Project Box Image Slider
 * Handles fading between images with auto-play and manual controls
 */
function initProjectSlider() {
  const slider = document.getElementById('project-slider-1');
  if (!slider) return;

  const images = slider.querySelectorAll('.slider-img');
  const prevBtn = slider.querySelector('.prev-btn');
  const nextBtn = slider.querySelector('.next-btn');

  if (!images.length) return;

  let currentIndex = 0;
  let autoPlayInterval;
  const SLIDE_DURATION = 4000; // 4 seconds per image

  const showImage = (index) => {
    images.forEach(img => img.classList.remove('is-active'));
    images[index].classList.add('is-active');
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, SLIDE_DURATION);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      resetAutoPlay();
    });
  }

  // Preload next images
  const preloadImages = () => {
    images.forEach(img => {
      if (!img.complete && img.loading === 'lazy') {
        img.loading = 'eager'; // Force load others once slider begins
      }
    });
  };

  // Start auto-play
  autoPlayInterval = setInterval(nextSlide, SLIDE_DURATION);

  // Pause on hover for better UX
  slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  slider.addEventListener('mouseleave', () => resetAutoPlay());

  // Trigger preload after UI settles
  setTimeout(preloadImages, 1000);
}


/* ============================================================
   SCROLL INDICATOR — Click to scroll to next section
   ============================================================ */
function initScrollIndicator() {
  const btn = document.getElementById('scroll-indicator-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const target = document.querySelector('#about');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ============================================================
   MAGNETIC CTA — Very subtle (2px max shift within 50px radius)
   ============================================================ */
function initMagneticCTA() {
  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (prefersReducedMotion) return;

  const cta = document.getElementById('hero-cta-btn');
  if (!cta) return;

  const RADIUS = 50;
  const MAX_SHIFT = 2;

  document.addEventListener('mousemove', (e) => {
    const rect = cta.getBoundingClientRect();
    const ctaCX = rect.left + rect.width / 2;
    const ctaCY = rect.top + rect.height / 2;

    const dx = e.clientX - ctaCX;
    const dy = e.clientY - ctaCY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < RADIUS) {
      const strength = (RADIUS - dist) / RADIUS;
      const shiftX = (dx / dist) * strength * MAX_SHIFT;
      const shiftY = (dy / dist) * strength * MAX_SHIFT;
      // Blend with existing translate if hero content is revealed
      cta.style.marginLeft = `${shiftX}px`;
      cta.style.marginTop = `${shiftY}px`;
    } else {
      cta.style.marginLeft = '';
      cta.style.marginTop = '';
    }
  });
}

/* ============================================================
   VISIT MODAL — Open / Close / Validate / Auto-close
   ============================================================ */
function initVisitModal() {
  const overlay = document.getElementById('visitModalOverlay');
  const box = document.getElementById('visitModalBox');
  const closeBtn = document.getElementById('modalCloseBtn');
  const formState = document.getElementById('modalFormState');
  const successState = document.getElementById('modalSuccessState');
  const form = document.getElementById('visitForm');
  if (!overlay || !form) return;

  // --- Fields & Errors ---
  const nameField = document.getElementById('modal-name');
  const emailField = document.getElementById('modal-email');
  const phoneField = document.getElementById('modal-phone');
  const nameErr = document.getElementById('modal-name-error');
  const emailErr = document.getElementById('modal-email-error');
  const phoneErr = document.getElementById('modal-phone-error');

  // --- Open ---
  function openModal() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // Focus first field after animation
    setTimeout(() => nameField && nameField.focus(), 300);
  }

  // --- Close ---
  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // Reset after transition
    setTimeout(resetModal, 280);
  }

  function resetModal() {
    form.reset();
    clearErrors();
    hideFetchError();
    setLoading(false);
    if (formState) { formState.style.display = ''; }
    if (successState) { successState.classList.remove('show'); }
  }

  function clearErrors() {
    [nameField, emailField, phoneField].forEach(f => {
      if (f) f.classList.remove('is-invalid');
    });
    [nameErr, emailErr, phoneErr].forEach(e => {
      if (e) { e.textContent = ''; e.classList.remove('show'); }
    });
  }

  function showError(field, errorEl, msg) {
    field.classList.add('is-invalid');
    errorEl.textContent = msg;
    errorEl.classList.add('show');
  }

  function clearError(field, errorEl) {
    field.classList.remove('is-invalid');
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }

  // --- Trigger: all .open-visit-modal elements ---
  document.querySelectorAll('.open-visit-modal').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // --- Close: X button ---
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // --- Close: backdrop click ---
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // --- Close: ESC key ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  // --- Live clear on input ---
  nameField && nameField.addEventListener('input', () => clearError(nameField, nameErr));
  emailField && emailField.addEventListener('input', () => clearError(emailField, emailErr));
  phoneField && phoneField.addEventListener('input', () => {
    // Strip non-digits live
    phoneField.value = phoneField.value.replace(/\D/g, '').slice(0, 10);
    clearError(phoneField, phoneErr);
  });

  // --- Validation ---
  function validateForm() {
    let valid = true;
    clearErrors();

    // Name: required, minimum 2 chars
    const name = nameField.value.trim();
    if (!name) {
      showError(nameField, nameErr, 'Please enter your name.');
      valid = false;
    } else if (name.length < 2) {
      showError(nameField, nameErr, 'Name must be at least 2 characters.');
      valid = false;
    }

    // Email: required, valid format
    const email = emailField.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError(emailField, emailErr, 'Please enter your email address.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      showError(emailField, emailErr, 'Please enter a valid email address.');
      valid = false;
    }

    // Phone: required, exactly 10 digits
    const phone = phoneField.value.trim();
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
      showError(phoneField, phoneErr, 'Please enter your phone number.');
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      showError(phoneField, phoneErr, 'Phone number must be exactly 10 digits.');
      valid = false;
    }

    return valid;
  }

  // --- Google Apps Script endpoint ---
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbytgoBzPooTPxCVbElBtGEiIwkbdXuw_zGD0iqEv4lJMWyzzeHAYyLi32ULqg-CLw8/exec';

  // Inline fetch error element (appended once below submit btn)
  const submitBtn = form.querySelector('.modal-submit-btn');
  const fetchErrEl = document.createElement('p');
  fetchErrEl.className = 'modal-fetch-error';
  fetchErrEl.setAttribute('role', 'alert');
  submitBtn.insertAdjacentElement('afterend', fetchErrEl);

  function showFetchError(msg) {
    fetchErrEl.textContent = msg;
    fetchErrEl.classList.add('show');
  }

  function hideFetchError() {
    fetchErrEl.textContent = '';
    fetchErrEl.classList.remove('show');
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Sending…' : 'Send Request';
  }

  // --- Submit ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFetchError();
    if (!validateForm()) return;

    const formData = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField.value.trim(),
      message: document.getElementById('modal-message').value.trim(),
    };

    // Show success immediately — don't make user wait for network
    if (formState) formState.style.display = 'none';
    if (successState) successState.classList.add('show');

    // Fire request in background (fire-and-forget)
    fetch(ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(formData),
      mode: 'no-cors',
    }).catch(() => {
      // Silent fail — data may not have saved, but UX stays clean
    });

    // Auto-close after 3 seconds
    setTimeout(() => closeModal(), 3000);
  });
}

/* ============================================================
   SMOOTH SCROLLING — same-page anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initServices();
  initServiceMicroScroll();
  initProjectSlider();
  initVisitModal();
  initSmoothScroll();
  initCinematicLoad();
  initMouseParallax();
  initHeroScroll();
  initScrollIndicator();
  initMagneticCTA();
});
