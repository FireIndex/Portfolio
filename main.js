/* ============================================================
   Renders the page from PORTFOLIO (data.js) and wires up
   the small amount of interaction the design calls for.
   The page is fully readable with JS disabled only for the
   static shell; content lives in data.js, so we render on load.
   ============================================================ */

(function () {
  'use strict';

  const d = window.PORTFOLIO;
  if (!d) return;

  document.documentElement.classList.remove('no-js');

  /* ---------- tiny helpers ---------- */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const setText = (sel, value) => {
    const node = $(sel);
    if (node && value != null) node.textContent = value;
  };

  const isExternal = (href) => /^https?:\/\//i.test(href);

  /* Section numbers are derived from document order, so adding or
     removing a section never leaves a stale 04 behind. */
  const numberSections = () => {
    $$('[data-section-num]').forEach((node, i) => {
      node.textContent = String(i + 1).padStart(2, '0');
    });
  };

  /* Ownership labels. 'personal' is the default and stays unlabelled —
     a badge on everything is noise. */
  const CONTEXT_LABEL = {
    work: 'Professional',
    'open-source': 'Open source',
    personal: 'Personal',
  };

  const ARROW_NE =
    '<svg class="arrow" width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">' +
    '<path d="M3 9L9 3M9 3H4.2M9 3v4.8" stroke="currentColor" stroke-width="1.3" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const ARROW_E =
    '<svg class="btn__arrow" width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
    '<path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.3" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* Mark an anchor as external + safe */
  const linkOut = (a, href) => {
    a.href = href;
    if (isExternal(href)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  };

  /* ---------- meta / head ---------- */

  function renderMeta() {
    /* Only the home page derives its title from meta; other pages
       (work.html) set their own in the HTML. */
    if (!$('[data-hero-headline]')) return;

    const m = d.meta;
    document.title = m.name + ' — ' + m.role;

    const pairs = [
      ['meta[name="description"]', 'content', m.description],
      ['meta[name="author"]', 'content', m.name],
      ['meta[property="og:title"]', 'content', document.title],
      ['meta[property="og:description"]', 'content', m.description],
      ['meta[property="og:site_name"]', 'content', m.name],
      ['meta[name="twitter:title"]', 'content', document.title],
      ['meta[name="twitter:description"]', 'content', m.description],
    ];

    pairs.forEach(([sel, attr, value]) => {
      const node = $(sel);
      if (node && value) node.setAttribute(attr, value);
    });
  }

  /* ---------- navigation ---------- */

  function renderNav() {
    const list = $('[data-nav-list]');
    if (!list) return;
    const brand = $('[data-brand]');
    if (brand) brand.textContent = d.meta.name;

    /* Section links are same-page anchors on the home page, but must
       point back to index.html from any other page. */
    const onHome = !!$('[data-hero-headline]');

    d.nav.forEach((item) => {
      const li = el('li');
      const a = el('a', 'nav__link', item.label);
      a.href =
        !onHome && item.href.startsWith('#')
          ? 'index.html' + item.href
          : item.href;
      li.appendChild(a);
      list.appendChild(li);
    });

    const status = $('[data-status]');
    if (d.meta.available) {
      setText('[data-status-label]', d.meta.availableLabel);
    } else if (status) {
      status.remove();
    }
  }

  /* ---------- hero ---------- */

  function renderHero() {
    const actionsHost = $('[data-hero-actions]');
    if (!actionsHost) return;
    const h = d.hero;
    setText('[data-hero-label]', h.label);
    setText('[data-hero-headline]', h.headline);
    setText('[data-hero-intro]', h.intro);

    const actions = $('[data-hero-actions]');
    h.actions.forEach((action) => {
      const a = el(
        'a',
        'btn ' + (action.primary ? 'btn--primary' : 'btn--ghost')
      );
      a.appendChild(document.createTextNode(action.label));
      a.insertAdjacentHTML('beforeend', ARROW_E);
      linkOut(a, action.href);
      actions.appendChild(a);
    });

    const meta = $('[data-hero-meta]');
    h.meta.forEach((item) => meta.appendChild(el('li', null, item)));
  }

  /* ---------- about ---------- */

  function renderAbout() {
    const body = $('[data-about-body]');
    if (!body) return;
    const a = d.about;
    setText('[data-about-title]', a.title);
    setText('[data-about-quote]', a.quote);

    a.paragraphs.forEach((p) => body.appendChild(el('p', null, p)));

    setText('[data-about-focus-label]', a.focus.label);
    setText('[data-about-expertise-label]', a.expertise.label);

    const focus = $('[data-about-focus]');
    a.focus.items.forEach((i) => focus.appendChild(el('li', null, i)));

    const exp = $('[data-about-expertise]');
    a.expertise.items.forEach((i) => exp.appendChild(el('li', null, i)));
  }

  /* ---------- work ---------- */

  function renderWork() {
    const wrap = $('[data-projects]');
    if (!wrap) return;
    const w = d.work;
    setText('[data-work-title]', w.title);
    setText('[data-work-intro]', w.intro);

    /* The home page shows featured projects only; the rest live in
       the catalogue page. */
    const featured = w.projects.filter((p) => p.featured);

    setText(
      '[data-work-count]',
      String(featured.length).padStart(2, '0') +
        ' of ' +
        String(w.projects.length).padStart(2, '0')
    );

    /* Link through to the full catalogue. */
    const more = $('[data-work-more]');
    if (more && w.catalogueLink) {
      const a = el('a', 'work__more-link');
      a.appendChild(document.createTextNode(w.catalogueLink.label));
      a.insertAdjacentHTML('beforeend', ARROW_E);
      linkOut(a, w.catalogueLink.href);
      more.appendChild(a);
    }

    featured.forEach((p, index) => {
      const article = el(
        'article',
        'project reveal' + (index % 2 === 1 ? ' project--flip' : '')
      );

      /* media — the whole panel is one link to the primary destination */
      const primary = p.links && p.links[0];
      const media = el(
        primary ? 'a' : 'div',
        'project__media'
      );
      if (primary) {
        linkOut(media, primary.href);
        media.setAttribute(
          'aria-label',
          p.name + ' — ' + primary.label
        );
      }

      const img = el('img');
      img.src = p.image;
      img.alt = p.alt || p.name;
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      media.appendChild(img);

      /* body */
      const body = el('div', 'project__body');

      const top = el('div', 'project__top');
      top.appendChild(
        el('span', 'project__num', String(index + 1).padStart(2, '0'))
      );
      if (p.context && p.context !== 'personal') {
        top.appendChild(el('span', 'project__tag', CONTEXT_LABEL[p.context]));
      }
      top.appendChild(el('span', 'project__year', p.year));
      body.appendChild(top);

      body.appendChild(el('h3', 'project__name', p.name));
      if (p.kind) {
        const kind = el('p', 'project__kind', p.kind);
        if (p.org) kind.appendChild(el('span', 'project__org', p.org));
        body.appendChild(kind);
      }
      body.appendChild(el('p', 'project__desc', p.description));

      if (p.outcome) {
        body.appendChild(el('p', 'project__outcome', p.outcome));
      }

      const tech = el('ul', 'project__tech');
      tech.setAttribute('aria-label', 'Technologies used');
      p.tech.forEach((t) => tech.appendChild(el('li', null, t)));
      body.appendChild(tech);

      if (p.links && p.links.length) {
        const links = el('div', 'project__links');
        p.links.forEach((l) => {
          const a = el('a', 'project__link');
          a.appendChild(document.createTextNode(l.label));
          a.insertAdjacentHTML('beforeend', ARROW_NE);
          linkOut(a, l.href);
          a.setAttribute('aria-label', l.label + ' — ' + p.name);
          links.appendChild(a);
        });
        body.appendChild(links);
      }

      article.appendChild(media);
      article.appendChild(body);
      wrap.appendChild(article);
    });
  }

  /* ---------- skills ---------- */

  function renderSkills() {
    const wrap = $('[data-skills]');
    if (!wrap) return;
    const s = d.skills;
    setText('[data-skills-title]', s.title);
    setText('[data-skills-intro]', s.intro);

    s.groups.forEach((group) => {
      const section = el('div', 'skill-group reveal');
      section.appendChild(el('h3', 'skill-group__label', group.label));

      const items = el('ul', 'skill-group__items');
      group.items.forEach((i) => items.appendChild(el('li', null, i)));
      section.appendChild(items);

      wrap.appendChild(section);
    });
  }

  /* ---------- experience ---------- */

  function renderExperience() {
    const wrap = $('[data-timeline]');
    if (!wrap) return;
    const e = d.experience;
    setText('[data-exp-title]', e.title);

    e.entries.forEach((entry) => {
      const item = el('div', 'timeline__item reveal');
      item.appendChild(el('p', 'timeline__period', entry.period));

      const body = el('div');
      body.appendChild(el('h3', 'timeline__role', entry.role));
      const org = el('p', 'timeline__org', entry.org);
      if (entry.place) {
        org.appendChild(el('span', 'timeline__place', entry.place));
      }
      body.appendChild(org);
      body.appendChild(el('p', 'timeline__desc', entry.description));

      if (entry.highlights && entry.highlights.length) {
        const ul = el('ul', 'timeline__highlights');
        entry.highlights.forEach((h) => ul.appendChild(el('li', null, h)));
        body.appendChild(ul);
      }

      item.appendChild(body);
      wrap.appendChild(item);
    });
  }

  /* ---------- education ---------- */

  function renderEducation() {
    const wrap = $('[data-education]');
    if (!wrap) return;
    const e = d.education;
    setText('[data-edu-title]', e.title);

    e.entries.forEach((entry) => {
      const row = el('div', 'edu reveal');
      row.appendChild(el('p', 'edu__year', entry.year));

      const degree = el('h3', 'edu__degree', entry.degree);
      degree.appendChild(el('span', 'edu__institution', entry.institution));
      row.appendChild(degree);

      const areas = el('ul', 'edu__areas');
      areas.setAttribute('aria-label', 'Areas of study');
      entry.areas.forEach((a) => areas.appendChild(el('li', null, a)));
      row.appendChild(areas);

      wrap.appendChild(row);
    });
  }

  /* ---------- contact ---------- */

  function renderContact() {
    const email = $('[data-contact-email]');
    if (!email) return;
    const c = d.contact;
    setText('[data-contact-title]', c.title);
    setText('[data-contact-heading]', c.heading);
    setText('[data-contact-text]', c.text);

    email.href = 'mailto:' + c.email;
    setText('[data-contact-email-text]', c.email);

    const profiles = $('[data-profiles]');
    c.profiles.forEach((p) => {
      const li = el('li');
      const a = el('a', 'profile');
      linkOut(a, p.href);

      const label = el('span', 'profile__label');
      label.appendChild(document.createTextNode(p.label));
      label.insertAdjacentHTML('beforeend', ARROW_NE);

      a.appendChild(label);
      a.appendChild(el('span', 'profile__handle', p.handle));
      li.appendChild(a);
      profiles.appendChild(li);
    });
  }

  /* ---------- footer ---------- */

  function renderFooter() {
    setText('[data-footer-left]', d.footer.left);
    setText('[data-footer-right]', d.footer.right);
    setText(
      '[data-footer-stamp]',
      d.meta.location.toUpperCase() + ' · ' + d.meta.timezone
    );
  }

  /* ============================================================
     INTERACTION
     ============================================================ */

  /* Mobile nav */
  function initNavToggle() {
    const toggle = $('#nav-toggle');
    const menu = $('#nav-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('data-open', String(open));
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    /* Close on nav click and on Escape */
    menu.addEventListener('click', (event) => {
      if (event.target.closest('.nav__link')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    /* Reset state when leaving the mobile breakpoint */
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = (e) => {
      if (e.matches) setOpen(false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
  }

  /* Nav border once scrolled off the top */
  function initNavScrollState() {
    const nav = $('#nav');
    if (!nav) return;

    const update = () => {
      nav.setAttribute('data-scrolled', String(window.scrollY > 8));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* Active section highlight */
  function initActiveSection() {
    const links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const byId = new Map();
    links.forEach((link) => {
      const id = link.getAttribute('href');
      if (id && id.startsWith('#')) byId.set(id.slice(1), link);
    });

    const sections = Array.from(byId.keys())
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = byId.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((l) => l.removeAttribute('aria-current'));
            link.setAttribute('aria-current', 'true');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* Gentle reveal on entry */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach((i) => i.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );

    items.forEach((i) => observer.observe(i));
  }

  /* ---------- catalogue page (work.html) ---------- */

  function renderCatalogue() {
    const wrap = $('[data-catalogue]');
    if (!wrap) return;

    const all = d.work.projects;
    setText(
      '[data-cat-label]',
      String(all.length).padStart(2, '0') + ' projects / ' + d.meta.year
    );
    setText(
      '[data-cat-intro]',
      'Everything, including the smaller and older work. Featured case studies ' +
        'are written up on the home page.'
    );

    /* Group by ownership, most substantial first. A group with no
       entries is skipped rather than rendered empty. */
    const GROUPS = [
      { key: 'work', label: 'Professional' },
      { key: 'open-source', label: 'Open source' },
      { key: 'personal', label: 'Personal' },
    ];

    let n = 0;

    GROUPS.forEach((group) => {
      const items = all.filter((p) => (p.context || 'personal') === group.key);
      if (!items.length) return;

      const section = el('section', 'cat-group reveal');

      const head = el('div', 'cat-group__head');
      head.appendChild(el('h2', 'cat-group__label', group.label));
      head.appendChild(
        el(
          'span',
          'cat-group__count',
          String(items.length).padStart(2, '0')
        )
      );
      section.appendChild(head);

      const list = el('ul', 'cat-list');

      items.forEach((p) => {
        n += 1;
        const li = el('li', 'cat-row');

        li.appendChild(
          el('span', 'cat-row__num', String(n).padStart(2, '0'))
        );

        const main = el('div', 'cat-row__main');

        const nameLine = el('div', 'cat-row__nameline');
        /* Link the title when there is somewhere to go, otherwise
           plain text — never a dead link. */
        const primary = p.links && p.links[0];
        if (primary) {
          const a = el('a', 'cat-row__name');
          a.appendChild(document.createTextNode(p.name));
          a.insertAdjacentHTML('beforeend', ARROW_NE);
          linkOut(a, primary.href);
          a.setAttribute('aria-label', p.name + ' — ' + primary.label);
          nameLine.appendChild(a);
        } else {
          nameLine.appendChild(el('span', 'cat-row__name', p.name));
        }
        if (p.featured) {
          /* Point at the write-up rather than badging it — the home page
             is where the detail lives. */
          const cs = el('a', 'cat-row__case', 'Case study');
          cs.href = 'index.html#work';
          nameLine.appendChild(cs);
        }
        main.appendChild(nameLine);

        if (p.kind) main.appendChild(el('p', 'cat-row__kind', p.kind));

        const tech = el('ul', 'cat-row__tech');
        tech.setAttribute('aria-label', 'Technologies used');
        p.tech.forEach((tk) => tech.appendChild(el('li', null, tk)));
        main.appendChild(tech);

        li.appendChild(main);
        li.appendChild(el('span', 'cat-row__year', p.year));

        list.appendChild(li);
      });

      section.appendChild(list);
      wrap.appendChild(section);
    });
  }

  /* ---------- boot ---------- */

  /* main.js drives both index.html and work.html. Each render function
     no-ops when its target element is absent, so the pages share one
     script and one data source. */

  renderMeta();
  renderNav();
  renderHero();
  renderAbout();
  renderWork();
  renderCatalogue();
  renderSkills();
  renderExperience();
  renderEducation();
  renderContact();
  renderFooter();
  numberSections();

  initNavToggle();
  initNavScrollState();
  initActiveSection();
  initReveal();
})();
