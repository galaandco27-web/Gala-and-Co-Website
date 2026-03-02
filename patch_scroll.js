const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// 1) Replace setActiveNavLink to use IntersectionObserver
const newSetActive = `/* ============================================================
   ACTIVE NAV LINK DETECTION (Intersection Observer)
   ============================================================ */
function setActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a, .mobile-menu a');

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -70% 0px' });

  sections.forEach(sec => observer.observe(sec));
}`;

code = code.replace(/function setActiveNavLink\(\) \{[\s\S]*?\}(?=\n\n\/\*)/, newSetActive);

// 2) Replace initSmoothScroll to handle offset
const newSmoothScroll = `/* ============================================================
   SMOOTH SCROLLING — same-page anchor links with offset
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      
      const header = document.querySelector('.site-header');
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}`;

code = code.replace(/function initSmoothScroll\(\) \{[\s\S]*?\}(?=\n\n\/\*)/, newSmoothScroll);

fs.writeFileSync('js/main.js', code);
console.log('patched main.js');
