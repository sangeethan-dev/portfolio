(() => {
  const cfg = window.SITE_CONFIG || {};
  const get = (path) =>
    path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), cfg);
  const isPlaceholder = (v) => typeof v === 'string' && v.includes('{{');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Fill editable values from site-config.js ---------- */
  document.querySelectorAll('[data-site]').forEach((el) => {
    const value = get(el.dataset.site);
    if (typeof value !== 'string' || !value) return;
    el.textContent = value;

    const kind = el.dataset.link;
    if (kind && !isPlaceholder(value)) {
      const a = document.createElement('a');
      a.className = 'text-link';
      a.href = kind === 'tel' ? 'tel:' + value.replace(/[^\d+]/g, '') : 'mailto:' + value;
      a.textContent = value;
      el.replaceWith(a);
    }
  });

  /* ---------- Halaxy booking links ---------- */
  document.querySelectorAll('[data-book]').forEach((a) => {
    const key = a.dataset.book === 'existing' ? 'booking.existingClient' : 'booking.newClient';
    const url = get(key);
    if (url) a.href = url;
  });

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.getElementById('menu');
  if (toggle && panel) {
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      panel.classList.toggle('is-open', open);
      panel.inert = !open;
      document.body.classList.toggle('menu-open', open);
    };
    setMenu(false);
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Scroll reveals: once per element ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Tagline: words light up one by one in reading order ---------- */
  const tagline = document.querySelector('[data-tagline]');
  if (tagline) {
    const wrapWords = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              const span = document.createElement('span');
              span.className = 'word';
              span.textContent = part;
              frag.appendChild(span);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          wrapWords(child);
        }
      });
    };
    wrapWords(tagline);
    const words = [...tagline.querySelectorAll('.word')];

    if (reduceMotion) {
      words.forEach((w) => w.classList.add('is-on'));
    } else {
      let lit = 0;
      let ticking = false;
      const update = () => {
        ticking = false;
        const rect = tagline.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.85; // tagline top crosses this line: first word lights
        const end = vh * 0.45;   // tagline bottom crosses this line: last word lights
        const progress = (start - rect.top) / (start - end + rect.height);
        const target = Math.max(0, Math.min(words.length, Math.ceil(progress * words.length)));
        while (lit < target) words[lit++].classList.add('is-on');
        if (lit >= words.length) window.removeEventListener('scroll', onScroll);
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
    }
  }

  /* ---------- Current section in navigation ---------- */
  const navLinks = [...document.querySelectorAll('.nav-links a, .menu-links a')].filter((a) => a.hash);
  const sections = [...new Set(navLinks.map((a) => a.hash))]
    .map((hash) => document.querySelector(hash))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const hash = '#' + entry.target.id;
          navLinks.forEach((a) => {
            const on = a.hash === hash;
            a.classList.toggle('is-current', on);
            if (on) a.setAttribute('aria-current', 'location');
            else a.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- FAQ structured data, built from the FAQ on the page ---------- */
  const faqItems = [...document.querySelectorAll('.faq-item')];
  if (faqItems.length) {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.querySelector('.faq-q').textContent.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.querySelector('.faq-a').textContent.replace(/\s+/g, ' ').trim(),
        },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
})();
