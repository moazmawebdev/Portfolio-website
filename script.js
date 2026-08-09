(() => {
  'use strict';

  /* ---------- Hero code typewriter (signature element) ---------- */
  const codeEl = document.getElementById('typedCode');
  const cursorEl = document.getElementById('typedCursor');

  const codeLines = [
    { text: 'export function ', cls: 'kw' },
    { text: 'Hero', cls: 'fn' },
    { text: '() {\n  return (\n    <section className=' },
    { text: '"hero"', cls: 'str' },
    { text: '>\n      <h1>\n        Built for ' },
    { text: '' },
    { text: 'production', cls: 'str' },
    { text: '.\n      </h1>\n    </section>\n  );\n}' }
  ];
  const fullText = codeLines.map(l => l.text).join('');

  if (codeEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let i = 0;
    const speed = 22;

    const renderHighlighted = (upto) => {
      // Rebuild markup with syntax spans up to the typed length
      let remaining = upto;
      let html = '';
      for (const seg of codeLines) {
        if (remaining <= 0) break;
        const take = Math.min(seg.text.length, remaining);
        const chunk = seg.text.slice(0, take);
        const escaped = chunk.replace(/&/g, '&amp;').replace(/</g, '&lt;');
        html += seg.cls ? `<span class="${seg.cls}">${escaped}</span>` : escaped;
        remaining -= take;
      }
      codeEl.innerHTML = html;
    };

    const type = () => {
      if (i <= fullText.length) {
        renderHighlighted(i);
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  } else if (codeEl) {
    renderStatic();
  }

  function renderStatic() {
    let html = '';
    codeLines.forEach(seg => {
      const escaped = seg.text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      html += seg.cls ? `<span class="${seg.cls}">${escaped}</span>` : escaped;
    });
    codeEl.innerHTML = html;
    if (cursorEl) cursorEl.style.display = 'none';
  }

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 20);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__q');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), (i % 4) * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Active navigation on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-menu__link[href^="#"]');

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Merged: cursor-follow glow on cards ---------- */
  if (!window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.glow-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

})();