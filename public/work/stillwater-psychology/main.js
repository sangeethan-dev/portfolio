(() => {
  const cfg = window.SITE_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const get = (path) =>
    path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), cfg);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const money = (n) =>
    typeof n !== 'number'
      ? ''
      : '$' + n.toLocaleString('en-AU', {
          minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
          maximumFractionDigits: 2,
        });
  const telHref = (v) => 'tel:' + String(v).replace(/[^\d+]/g, '');

  /* ---------- Fill editable values from site-config.js ---------- */
  const fill = (root) => {
    $$('[data-site]', root).forEach((el) => {
      const v = get(el.dataset.site);
      if (typeof v === 'string' && v) el.textContent = v;
    });
    $$('[data-money]', root).forEach((el) => {
      const v = get(el.dataset.money);
      if (typeof v === 'number') el.textContent = money(v);
    });
    $$('[data-gap]', root).forEach((el) => {
      const [a, b] = el.dataset.gap.split(' ').map(get);
      if (typeof a === 'number' && typeof b === 'number') el.textContent = money(Math.round((a - b) * 100) / 100);
    });
    $$('a[data-tel]', root).forEach((a) => { if (cfg.contact?.phone) a.href = telHref(cfg.contact.phone); });
    $$('a[data-mail]', root).forEach((a) => { if (cfg.contact?.email) a.href = 'mailto:' + cfg.contact.email; });
  };
  fill(document);
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Mobile menu ---------- */
  const toggle = $('.menu-toggle');
  const panel = $('#menu');
  const setMenu = (open) => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.classList.toggle('is-open', open);
    panel.inert = !open;
    document.body.classList.toggle('menu-open', open);
  };
  if (toggle && panel) {
    setMenu(false);
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Nav shadow once the page scrolls ---------- */
  const navWrap = $('.nav-wrap');
  const onNavScroll = () => navWrap && navWrap.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  /* ---------- Scroll reveals: once per element ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Tagline: words light up in reading order ---------- */
  const tagline = $('[data-tagline]');
  if (tagline) {
    const wrapWords = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else {
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
    const words = $$('.word', tagline);
    if (reduceMotion) words.forEach((w) => w.classList.add('is-on'));
    else {
      let lit = 0;
      let ticking = false;
      const update = () => {
        ticking = false;
        const rect = tagline.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.85;
        const end = vh * 0.45;
        const progress = (start - rect.top) / (start - end + rect.height);
        const target = Math.max(0, Math.min(words.length, Math.ceil(progress * words.length)));
        while (lit < target) words[lit++].classList.add('is-on');
        if (lit >= words.length) window.removeEventListener('scroll', onScroll);
      };
      const onScroll = () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
    }
  }

  /* ---------- Current section in navigation ---------- */
  const navLinks = $$('.nav-links a, .menu-links a').filter((a) => a.hash);
  const sections = [...new Set(navLinks.map((a) => a.hash))].map((h) => $(h)).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const hash = '#' + entry.target.id;
        navLinks.forEach((a) => {
          const on = a.hash === hash;
          a.classList.toggle('is-current', on);
          if (on) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- FAQ: topic tabs + accessible accordions ---------- */
  const faqItems = $$('.faq-item');
  const setItem = (item, open, animate = true) => {
    const btn = $('.faq-trigger', item);
    const ans = $('.faq-a', item);
    if (!btn || !ans) return;
    if ((btn.getAttribute('aria-expanded') === 'true') === open) return;
    btn.setAttribute('aria-expanded', String(open));
    item.classList.toggle('is-open', open);
    if (reduceMotion || !animate || !ans.animate) {
      ans.hidden = !open;
      return;
    }
    if (ans._anim) ans._anim.cancel();
    if (open) {
      ans.hidden = false;
      const h = ans.scrollHeight;
      ans._anim = ans.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    } else {
      const h = ans.scrollHeight;
      const anim = (ans._anim = ans.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }));
      const done = () => {
        if (btn.getAttribute('aria-expanded') === 'true') return;
        ans.hidden = true;
        anim.cancel();
      };
      anim.onfinish = done;
      setTimeout(done, 320); // in case the animation is throttled (background tab)
    }
  };
  faqItems.forEach((item, i) => {
    const btn = $('.faq-trigger', item);
    const ans = $('.faq-a', item);
    if (!btn || !ans) return;
    const id = 'faq-a-' + i;
    ans.id = id;
    ans.setAttribute('role', 'region');
    btn.id = 'faq-q-' + i;
    btn.setAttribute('aria-controls', id);
    ans.setAttribute('aria-labelledby', btn.id);
    btn.addEventListener('click', () => setItem(item, btn.getAttribute('aria-expanded') !== 'true'));
  });

  const tabs = $$('.faq-tab');
  const selectTab = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      let n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0];
      if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  // Links that jump to one FAQ answer (for example "How telehealth works")
  $$('[data-faq]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const item = document.getElementById(a.dataset.faq);
      if (!item) return;
      e.preventDefault();
      const panelEl = item.closest('[role="tabpanel"]');
      const tab = panelEl && tabs.find((t) => t.getAttribute('aria-controls') === panelEl.id);
      if (tab) selectTab(tab);
      setItem(item, true, false);
      item.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      item.classList.add('is-flash');
      setTimeout(() => item.classList.remove('is-flash'), 1600);
      $('.faq-trigger', item)?.focus({ preventScroll: true });
    });
  });

  if (faqItems.length) {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: $('.faq-q', item).textContent.trim(),
        acceptedAnswer: { '@type': 'Answer', text: $('.faq-a', item).textContent.replace(/\s+/g, ' ').trim() },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /* ---------- Dialog helpers ---------- */
  const openDialog = (dlg) => {
    if (dlg.open) return;
    dlg.showModal();
    document.documentElement.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('is-open')));
  };
  const closeDialog = async (dlg) => {
    if (!dlg.open || dlg.dataset.closing) return;
    dlg.dataset.closing = '1';
    dlg.classList.remove('is-open');
    await wait(reduceMotion ? 120 : 420);
    dlg.close();
    delete dlg.dataset.closing;
    if (!$$('dialog').some((d) => d.open)) document.documentElement.classList.remove('no-scroll');
  };
  const wireDialog = (dlg) => {
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(dlg); });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) closeDialog(dlg);
      if (e.target.closest('[data-close]')) closeDialog(dlg);
    });
  };

  /* ---------- Side sheet: services, profiles, policies ---------- */
  const sheet = $('#sheet');
  const sheetBody = $('#sheet-body');
  const sheetKicker = $('#sheet-kicker');
  if (sheet) wireDialog(sheet);
  const openSheet = (id) => {
    const tpl = document.getElementById(id);
    if (!sheet || !tpl || tpl.tagName !== 'TEMPLATE') return;
    sheetBody.replaceChildren(tpl.content.cloneNode(true));
    sheetKicker.textContent = tpl.dataset.kicker || '';
    fill(sheetBody);
    sheetBody.scrollTop = 0;
    openDialog(sheet);
    $('.icon-btn', sheet).focus();
  };

  /* ---------- Booking ---------- */
  const booking = $('#booking');
  const form = $('#bk-form');

  // Phone and email checks shared by both forms
  const validators = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
    phone: (v) => /^(?:\+?61|0)[2-478]\d{8}$/.test(v.replace(/[\s()-]/g, '')),
  };
  const messages = {
    name: 'Please tell us your name.',
    first: 'Please enter your first name.',
    last: 'Please enter your last name.',
    email: 'Please enter a valid email address, like name@example.com.',
    phone: 'Please enter an Australian phone number, like 0412 345 678.',
    topic: 'Please choose a topic.',
    message: 'Please write a short message (at least 10 characters).',
    consent: 'Please confirm you have read the privacy notice.',
    who: 'Please choose who the call is about.',
    format: 'Please choose in person, telehealth or not sure.',
    clinician: 'Please choose your psychologist.',
    session: 'Please choose a session type.',
    xformat: 'Please choose in person or telehealth.',
    slot: 'Please choose a time that suits you.',
  };
  const showError = (errEl, msg) => {
    if (!errEl) return;
    errEl.textContent = msg || '';
    errEl.classList.toggle('is-shown', !!msg);
  };
  const checkField = (input) => {
    const v = input.type === 'checkbox' ? input.checked : input.value.trim();
    const rule = input.dataset.validate;
    let msg = '';
    if (input.required && !v) msg = messages[input.name] || 'This field is required.';
    else if (v && rule === 'email' && !validators.email(v)) msg = messages.email;
    else if (v && (rule === 'phone' || rule === 'phone-optional') && !validators.phone(v)) msg = messages.phone;
    else if (v && input.dataset.min && v.length < +input.dataset.min) msg = messages[input.name];
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const err = document.getElementById(input.id + '-err');
    if (err) {
      input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), err.id].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(' '));
      showError(err, msg);
    }
    return !msg;
  };
  const liveRevalidate = (root) => {
    root.addEventListener('input', (e) => {
      const el = e.target;
      if (el.getAttribute && el.getAttribute('aria-invalid') === 'true') checkField(el);
    });
    root.addEventListener('change', (e) => {
      const el = e.target;
      if (el.type === 'checkbox' && el.getAttribute('aria-invalid') === 'true') checkField(el);
    });
  };

  if (booking && form) {
    wireDialog(booking);
    liveRevalidate(form);

    const TOTAL = 4;
    const state = { mode: 'new', step: 1, page: 0, date: null, time: null, done: false };
    const fd = () => new FormData(form);
    const val = (name) => (form.elements[name] && 'value' in form.elements[name] ? form.elements[name].value : '');
    const clinicianDays = { 'Dr Mia Hartley': [1, 2, 4], 'James Okafor': [3, 4, 5], 'Priya Nair': [1, 3, 5] };

    const fmtTime = (mins) => {
      const d = new Date(2000, 0, 1, Math.floor(mins / 60), mins % 60);
      return d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }).replace(/\s?([ap])\.?m\.?/i, ' $1m');
    };
    const fmtDate = (d, opts = { weekday: 'long', day: 'numeric', month: 'long' }) => d.toLocaleDateString('en-AU', opts);
    const dayKey = (d) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

    // The next 15 business days, starting today
    const businessDays = () => {
      const out = [];
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      while (out.length < 15) {
        const dow = d.getDay();
        if (dow >= 1 && dow <= 5) out.push(new Date(d));
        d.setDate(d.getDate() + 1);
      }
      return out;
    };
    const days = businessDays();

    // Times as minutes after midnight (Queensland time)
    const baseTimes = (dow) => {
      if (state.mode === 'new') {
        const t = [540, 570, 615, 660, 705, 810, 855, 900, 960, 1005];
        if (dow === 4) t.push(1080, 1125, 1155);
        return t;
      }
      const t = [480, 540, 600, 660, 780, 840, 900, 960, 1020];
      if (dow === 4) t.push(1080, 1140);
      return t;
    };
    const slotsFor = (d) => {
      const dow = d.getDay();
      const who = val('clinician');
      if (state.mode === 'existing') {
        if (!who || !(clinicianDays[who] || []).includes(dow)) return [];
      }
      let times = baseTimes(dow);
      if (state.mode === 'existing' && who === 'James Okafor') times = times.filter((t) => t >= 780);
      const seed = dayKey(d) + state.mode + who;
      times = times.filter((t, i) => hash(seed + i) % 100 > 52);
      const now = new Date();
      if (dayKey(d) === dayKey(now)) {
        const cutoff = now.getHours() * 60 + now.getMinutes() + 120;
        times = times.filter((t) => t >= cutoff);
      }
      return times;
    };

    const nextAvailable = () => {
      for (const d of days) {
        const s = slotsFor(d);
        if (s.length) return { d, t: s[0] };
      }
      return null;
    };

    const renderDates = () => {
      const wrap = $('[data-dates]', form);
      wrap.replaceChildren();
      const pageDays = days.slice(state.page * 5, state.page * 5 + 5);
      pageDays.forEach((d) => {
        const n = slotsFor(d).length;
        const key = dayKey(d);
        const away = state.mode === 'existing' && !(clinicianDays[val('clinician')] || []).includes(d.getDay());
        const label = document.createElement('label');
        label.className = 'date-btn';
        label.innerHTML =
          '<input type="radio" name="date" value="' + key + '"' + (n ? '' : ' disabled') + (state.date === key ? ' checked' : '') + '>' +
          '<span><span class="dow">' + fmtDate(d, { weekday: 'short' }) + '</span><span class="dom">' + d.getDate() + '</span><span class="avail">' +
          (n ? n + (n === 1 ? ' time' : ' times') : away ? 'Not in' : 'Full') + '</span></span>';
        $('input', label).setAttribute('aria-label', fmtDate(d) + (n ? ', ' + n + ' times available' : away ? ', not working this day' : ', fully booked'));
        wrap.appendChild(label);
      });
      $('[data-date-prev]', form).disabled = state.page === 0;
      $('[data-date-next]', form).disabled = state.page >= 2;
    };

    const renderSlots = () => {
      const box = $('[data-slots]', form);
      const heading = $('[data-slot-heading]', form);
      box.replaceChildren();
      const d = days.find((x) => dayKey(x) === state.date);
      if (!d) {
        heading.textContent = 'Choose a day to see available times.';
        return;
      }
      heading.textContent = fmtDate(d);
      const times = slotsFor(d);
      if (!times.length) {
        box.innerHTML = '<p class="no-slots body-6">No times left on this day. Try another date.</p>';
        return;
      }
      const groups = [['Morning', (t) => t < 720], ['Afternoon', (t) => t >= 720 && t < 1020], ['Evening', (t) => t >= 1020]];
      groups.forEach(([name, test]) => {
        const list = times.filter(test);
        if (!list.length) return;
        const g = document.createElement('div');
        g.className = 'slot-group';
        g.innerHTML = '<p class="caption-3">' + name + '</p><div class="slot-list" role="radiogroup" aria-label="' + name + ' times"></div>';
        const ul = $('.slot-list', g);
        list.forEach((t) => {
          const l = document.createElement('label');
          l.className = 'slot';
          l.innerHTML = '<input type="radio" name="slot" value="' + t + '"' + (state.time === t ? ' checked' : '') + '><span>' + fmtTime(t) + '</span>';
          ul.appendChild(l);
        });
        box.appendChild(g);
      });
    };

    const whenText = () => {
      const d = days.find((x) => dayKey(x) === state.date);
      return d && state.time != null ? fmtDate(d) + ', ' + fmtTime(state.time) : '';
    };
    const sessionText = () => (state.mode === 'new' ? 'Free 15 minute call' : val('session') || 'Session');
    const withText = () => (state.mode === 'new' ? 'Sophie Tran, practice manager' : val('clinician'));
    const formatText = () => (state.mode === 'new' ? val('format') : val('xformat'));
    const whoText = () => {
      if (state.mode === 'existing') return 'Existing client';
      const w = val('who');
      const topics = fd().getAll('topics');
      return w ? w + (topics.length ? ' · ' + topics.join(', ') : '') : '';
    };

    const updateSummary = () => {
      $('[data-bk-kicker]', booking).textContent = sessionText();
      const set = (key, text, empty = 'Not chosen yet') => {
        const el = $('[data-sum="' + key + '"]', booking);
        el.textContent = text || empty;
        el.classList.toggle('is-empty', !text);
      };
      set('who', whoText());
      set('format', formatText());
      set('with', withText());
      set('when', whenText());
      const pref = val('preferred');
      if (state.mode === 'new' && pref) $('[data-sum="with"]', booking).textContent = 'Sophie Tran · matching you with ' + pref;
    };

    const stepSections = () => $$('.bk-step', form);
    const currentSection = () =>
      stepSections().find((s) => +s.dataset.step === state.step && (!s.dataset.mode || s.dataset.mode === state.mode));

    const showStep = (n, focus = true) => {
      state.step = n;
      stepSections().forEach((s) => { s.hidden = true; s.classList.remove('is-entering'); });
      const sec = currentSection();
      sec.hidden = false;
      if (!reduceMotion) { void sec.offsetWidth; sec.classList.add('is-entering'); }
      sec.scrollTop = 0;
      const shown = Math.min(n, TOTAL);
      $('.bk-progress-bar', booking).style.width = (shown / TOTAL) * 100 + '%';
      $('[data-stepcount]', booking).textContent = n > TOTAL ? 'Booked' : 'Step ' + n + ' of ' + TOTAL;
      $('[data-back]', form).hidden = n === 1 || n > TOTAL;
      $('[data-next-label]', form).textContent = n === 3 ? 'Review booking' : n === 4 ? 'Confirm booking' : 'Continue';
      booking.classList.toggle('is-done', n > TOTAL);
      if (n === 2) {
        $('[data-time-lead]', form).textContent = state.mode === 'new'
          ? 'Times are in Queensland time (AEST). Sophie will call you on the number you give us.'
          : 'Showing ' + val('clinician') + "'s available times, in Queensland time (AEST).";
        if (!state.date) {
          const first = nextAvailable();
          if (first) { state.date = dayKey(first.d); state.page = Math.floor(days.indexOf(first.d) / 5); }
        }
        renderDates();
        renderSlots();
      }
      if (n === 3) {
        $('[data-new-only]', form).hidden = state.mode !== 'new';
        $('[data-details-lead]', form).textContent = val('who') === 'My teenager'
          ? "Please enter a parent or guardian's details. We'll ask about your teen on the call."
          : 'So we can confirm your booking and reach you at the right time.';
      }
      if (n === 4) renderReview();
      updateSummary();
      if (focus) $('.bk-title', sec)?.focus({ preventScroll: true });
    };

    const radioError = (name, ok) => {
      showError($('[data-err="' + name + '"]', form), ok ? '' : messages[name]);
      return ok;
    };
    const validateStep = () => {
      const sec = currentSection();
      let ok = true;
      let firstBad = null;
      const mark = (good, el) => { if (!good) { ok = false; firstBad = firstBad || el; } };
      if (state.step === 1) {
        const names = state.mode === 'new' ? ['who', 'format'] : ['clinician', 'session', 'xformat'];
        names.forEach((n) => mark(radioError(n, !!val(n)), $('input[name="' + n + '"]', sec)));
      }
      if (state.step === 2) mark(radioError('slot', state.time != null), $('[data-dates] input:not(:disabled)', form));
      if (state.step === 3) {
        ['bk-first', 'bk-last', 'bk-phone', 'bk-email', 'bk-consent'].forEach((id) => {
          const el = document.getElementById(id);
          mark(checkField(el), el);
        });
      }
      if (firstBad) firstBad.focus();
      return ok;
    };

    const renderReview = () => {
      const dl = $('[data-review]', form);
      const rows = [
        ['Booking', sessionText(), 1],
        [state.mode === 'new' ? 'About' : 'Psychologist', state.mode === 'new' ? whoText() : val('clinician'), 1],
        ['Format', formatText(), 1],
        ['When', whenText() + ' (AEST)', 2],
        ['Name', (val('first') + ' ' + val('last')).trim(), 3],
        ['Mobile', val('phone'), 3],
        ['Email', val('email'), 3],
      ];
      if (state.mode === 'new' && val('plan')) rows.push(['Mental Health Treatment Plan', val('plan'), 3]);
      if (val('preferred')) rows.push(['Preferred psychologist', val('preferred'), 1]);
      if (val('notes').trim()) rows.push(['Notes', val('notes').trim(), 3]);
      dl.replaceChildren();
      rows.forEach(([k, v, step]) => {
        const div = document.createElement('div');
        div.innerHTML = '<dt></dt><dd></dd><button type="button" class="text-link inline-btn edit caption-1">Edit</button>';
        div.querySelector('dt').textContent = k;
        div.querySelector('dd').textContent = v;
        const btn = div.querySelector('button');
        btn.setAttribute('aria-label', 'Edit ' + k.toLowerCase());
        btn.addEventListener('click', () => showStep(step));
        dl.appendChild(div);
      });
    };

    const ref = () => 'SW-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const finish = async () => {
      const btn = $('[data-next]', form);
      btn.classList.add('is-loading');
      $('[data-next-label]', form).textContent = 'Confirming…';
      await wait(1100);
      btn.classList.remove('is-loading');
      state.done = true;
      const d = days.find((x) => dayKey(x) === state.date);
      const first = val('first').trim();
      $('[data-done-title]', form).textContent = state.mode === 'new' ? "You're booked in, " + first : 'Session confirmed, ' + first;
      $('[data-done-lead]', form).textContent = state.mode === 'new'
        ? 'Sophie will call you on ' + val('phone').trim() + ' at the time below. A confirmation is on its way to ' + val('email').trim() + '.'
        : 'Your session with ' + val('clinician') + ' is locked in. A confirmation is on its way to ' + val('email').trim() + '.';
      $('[data-done-month]', form).textContent = fmtDate(d, { month: 'short' });
      $('[data-done-day]', form).textContent = d.getDate();
      $('[data-done-what]', form).textContent = sessionText() + (state.mode === 'existing' ? ' with ' + val('clinician') : '');
      $('[data-done-when]', form).textContent = fmtDate(d) + ' at ' + fmtTime(state.time) + ' (AEST) · ' + formatText();
      $('[data-done-ref]', form).textContent = 'Booking reference ' + ref();
      const steps = state.mode === 'new'
        ? ['We’ll send an SMS reminder the day before your call.', 'Sophie calls from ' + (cfg.contact?.phone || 'our clinic number') + '. It takes about 15 minutes.', 'If you decide to go ahead, we’ll book your first session on the call.']
        : ['We’ll send an SMS reminder two days before.', formatText() === 'Telehealth' ? 'Your private video link arrives by SMS and email the morning of your session.' : 'Arrive a few minutes early. Free parking is under the building.', 'Need to change it? Let us know at least 48 hours before.'];
      const ol = $('[data-done-next]', form);
      ol.replaceChildren(...steps.map((s) => { const li = document.createElement('li'); li.textContent = s; return li; }));
      showStep(5);
    };

    const downloadIcs = () => {
      const d = days.find((x) => dayKey(x) === state.date);
      if (!d || state.time == null) return;
      const pad = (n) => String(n).padStart(2, '0');
      const mins = state.mode === 'new' ? 15 : /80/.test(val('session')) ? 80 : 50;
      // Queensland has no daylight saving: AEST is always UTC+10
      const start = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, state.time - 600));
      const end = new Date(start.getTime() + mins * 60000);
      const stamp = (x) => x.getUTCFullYear() + pad(x.getUTCMonth() + 1) + pad(x.getUTCDate()) + 'T' + pad(x.getUTCHours()) + pad(x.getUTCMinutes()) + '00Z';
      const loc = formatText() === 'Telehealth' ? 'Telehealth (link sent by SMS)' : (cfg.contact?.street || '') + ', ' + (cfg.contact?.suburb || '');
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Stillwater Psychology//Booking//EN', 'BEGIN:VEVENT',
        'UID:' + Date.now() + '@stillwaterpsychology.com.au', 'DTSTAMP:' + stamp(new Date()),
        'DTSTART:' + stamp(start), 'DTEND:' + stamp(end),
        'SUMMARY:' + sessionText() + ' · Stillwater Psychology',
        'LOCATION:' + loc.replace(/,/g, '\\,'),
        'DESCRIPTION:' + (state.mode === 'new' ? 'Sophie will call you on ' + val('phone').trim() : 'With ' + val('clinician')),
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stillwater-booking.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const reset = () => {
      form.reset();
      $$('[aria-invalid]', form).forEach((el) => el.setAttribute('aria-invalid', 'false'));
      $$('.field-error', form).forEach((el) => showError(el, ''));
      Object.assign(state, { step: 1, page: 0, date: null, time: null, done: false });
    };

    const applyCouplesRule = () => {
      const isPriya = val('clinician') === 'Priya Nair';
      const opt = $('[data-couples-only] input', form);
      opt.disabled = !isPriya;
      if (!isPriya && opt.checked) opt.checked = false;
      $('[data-couples-only]', form).title = isPriya ? '' : 'Couples sessions are with Priya Nair';
    };

    window.openBooking = (opts = {}) => {
      const mode = opts.mode === 'existing' ? 'existing' : 'new';
      const hasPrefill = !!(opts.who || opts.preferred);
      if (state.done || mode !== state.mode || hasPrefill || state.step === 1) {
        reset();
        state.mode = mode;
      }
      if (opts.who) {
        const r = $('input[name="who"][value="' + opts.who + '"]', form);
        if (r) r.checked = true;
      }
      form.elements.preferred.value = opts.preferred || '';
      applyCouplesRule();
      showStep(state.step, false);
      openDialog(booking);
      setTimeout(() => $('.bk-title', currentSection())?.focus({ preventScroll: true }), 60);
    };

    form.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'date') { state.date = t.value; state.time = null; renderSlots(); showError($('[data-err="slot"]', form), ''); }
      if (t.name === 'slot') { state.time = +t.value; showError($('[data-err="slot"]', form), ''); }
      if (t.name === 'clinician') { applyCouplesRule(); state.date = null; state.time = null; state.page = 0; }
      if (t.type === 'radio' && messages[t.name] && t.name !== 'slot' && t.name !== 'date') radioError(t.name, true);
      updateSummary();
    });
    $('[data-date-prev]', form).addEventListener('click', () => { state.page = Math.max(0, state.page - 1); renderDates(); });
    $('[data-date-next]', form).addEventListener('click', () => { state.page = Math.min(2, state.page + 1); renderDates(); });
    $('[data-back]', form).addEventListener('click', () => showStep(Math.max(1, state.step - 1)));
    $('[data-ics]', form).addEventListener('click', downloadIcs);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.step > TOTAL) return;
      if (!validateStep()) return;
      if (state.step < TOTAL) showStep(state.step + 1);
      else finish();
    });

    // Hero card: the next free introductory call
    const nextEl = $('[data-next-slot]');
    if (nextEl) {
      const saved = state.mode;
      state.mode = 'new';
      const n = nextAvailable();
      state.mode = saved;
      if (n) {
        const today = new Date();
        const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
        const dayWord = dayKey(n.d) === dayKey(today) ? 'Today' : dayKey(n.d) === dayKey(tomorrow) ? 'Tomorrow' : fmtDate(n.d, { weekday: 'long' });
        nextEl.textContent = dayWord + ', ' + fmtTime(n.t);
      }
    }
  }

  /* ---------- Global click routing: booking + sheets ---------- */
  document.addEventListener('click', (e) => {
    const bookEl = e.target.closest('[data-book]');
    if (bookEl) {
      const mode = bookEl.dataset.book === 'existing' ? 'existing' : 'new';
      const external = mode === 'existing' ? cfg.booking?.existingClient : cfg.booking?.newClient;
      if (external) { bookEl.href = external; return; }
      if (!booking || !window.openBooking) return;
      e.preventDefault();
      setMenu(false);
      const opts = { mode, who: bookEl.dataset.who, preferred: bookEl.dataset.preferred };
      if (sheet && sheet.open) closeDialog(sheet).then(() => window.openBooking(opts));
      else window.openBooking(opts);
      return;
    }
    const sheetEl = e.target.closest('[data-sheet]');
    if (sheetEl) {
      e.preventDefault();
      openSheet(sheetEl.dataset.sheet);
    }
  });

  /* ---------- Contact form ---------- */
  const cform = $('#contact-form');
  const success = $('#contact-success');
  if (cform && success) {
    liveRevalidate(cform);
    cform.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = $$('input, select, textarea', cform).filter((el) => el.name);
      let firstBad = null;
      fields.forEach((el) => { if (!checkField(el) && !firstBad) firstBad = el; });
      if (firstBad) { firstBad.focus(); return; }
      const btn = $('.form-submit', cform);
      btn.classList.add('is-loading');
      btn.disabled = true;
      $('span', btn).textContent = 'Sending';
      await wait(900);
      btn.classList.remove('is-loading');
      btn.disabled = false;
      $('span', btn).textContent = 'Send message';
      $('[data-out="name"]', success).textContent = cform.elements.name.value.trim().split(' ')[0];
      $('[data-out="email"]', success).textContent = cform.elements.email.value.trim();
      cform.hidden = true;
      success.hidden = false;
      success.focus();
    });
    $('[data-reset-form]', success).addEventListener('click', () => {
      cform.reset();
      $$('[aria-invalid]', cform).forEach((el) => el.setAttribute('aria-invalid', 'false'));
      success.hidden = true;
      cform.hidden = false;
      cform.elements.name.focus();
    });
  }
})();
