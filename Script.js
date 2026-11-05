document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section[id]');
  const header = document.querySelector('.topbar');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 140;
    let activeId = sections[0]?.id || '';

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        activeId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', isActive);
    });
  };

  let scrollFrame = 0;
  const updateScrollEffects = () => {
    if (scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      if (header) {
        header.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, progress))));
      }

      const scrolled = window.scrollY > 20;
      if (header) {
        header.style.boxShadow = scrolled ? '0 10px 30px rgba(15, 23, 42, 0.35)' : 'none';
      }
      setActiveLink();
    });
  };

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealItems = document.querySelectorAll(
      '.section-heading, .about-grid, .skill-group, .feature-card, .project-card, .timeline-item, .cert-list, .contact-card'
    );
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -36px 0px' });

    document.body.classList.add('motion-ready');
    revealItems.forEach((item, index) => {
      item.classList.add('scroll-reveal');
      item.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
      revealObserver.observe(item);
    });
  }

  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.project-card, .feature-card, .skill-group').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const tiltX = ((y / bounds.height) - 0.5) * -4;
        const tiltY = ((x / bounds.width) - 0.5) * 4;

        card.style.setProperty('--pointer-x', `${x}px`);
        card.style.setProperty('--pointer-y', `${y}px`);
        card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  window.addEventListener('scroll', updateScrollEffects, { passive: true });
  window.addEventListener('resize', updateScrollEffects);

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', targetId);
    });
  });

  updateScrollEffects();
});
