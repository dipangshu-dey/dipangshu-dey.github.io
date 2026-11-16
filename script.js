/* ==========================================================
   Dipangshu Dey – Cybersecurity Portfolio
   Reads everything from /data/*.json and renders the page.
   All paths are RELATIVE so it works on GitHub Pages project
   sites (https://user.github.io/repo/) as well as user sites.
   ========================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PH_IMG = 'assets/images/placeholder.svg';
  const PH_PROFILE = 'assets/images/profile/profile-placeholder.svg';

  /* ---------------- helpers ---------------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const arr = (v) => (Array.isArray(v) ? v : []);
  const shown = (list) => arr(list).filter((x) => x && x.visible !== false);
  const isPdf = (src) => /\.pdf($|\?|#)/i.test(src || '');
  const safeUrl = (u) => (/^(https?:|mailto:)/i.test(u || '') ? u : '');
  const initials = (s) => String(s || '').split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).map((w) => w[0]).join('').slice(0, 4).toUpperCase();

  function fmtDate(s) {
    if (!s) return '';
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(s);
    if (!m) return s;
    const d = new Date(+m[1], +m[2] - 1, +(m[3] || 1));
    return d.toLocaleDateString('en-GB', m[3] ? { day: 'numeric', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' });
  }

  /* ---------------- icons (Lucide-style, inline, no external requests) ---------------- */
  const ICONS = {
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bug: '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    fingerprint: '<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>',
    'bar-chart': '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'zoom-in': '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/>',
    'zoom-out': '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.shield}</svg>`;

  /* ---------------- image fallbacks (no inline handlers) ---------------- */
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset.ph && !img.dataset.fell) { img.dataset.fell = '1'; img.src = img.dataset.ph; return; }
    if (img.hasAttribute('data-hide')) img.parentElement?.classList.add('no-img');
  }, true);

  const phImg = (src, alt, extra = '') => `<img src="${esc(src || PH_IMG)}" alt="${esc(alt)}" loading="lazy" decoding="async" data-ph="${PH_IMG}" ${extra}>`;

  /* ---------------- lightbox groups ---------------- */
  const groups = {};
  let gid = 0;
  const registerGroup = (items) => { const k = 'g' + (++gid); groups[k] = items; return k; };
  const norm = (s) => (typeof s === 'string' ? { src: s, caption: '' } : s || {});

  function thumbs(shots, title) {
    const list = arr(shots).map(norm).filter((s) => s.src);
    if (!list.length) return '';
    const k = registerGroup(list.map((s) => ({ type: isPdf(s.src) ? 'pdf' : 'image', src: s.src, title, caption: s.caption || '' })));
    return `<div class="shots">${list.map((s, i) => `
      <button type="button" class="shot" data-lb="${k}" data-i="${i}" aria-label="Open ${isPdf(s.src) ? 'document' : 'image'} ${i + 1} of ${list.length}: ${esc(title)}">
        ${isPdf(s.src) ? `<span class="pdf-tile">${icon('file-text')}PDF</span>` : phImg(s.src, s.caption || title)}
      </button>`).join('')}</div>`;
  }

  /* ---------------- data ---------------- */
  async function loadJSON(name) {
    try {
      const r = await fetch(`data/${name}.json`, { cache: 'no-cache' });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (err) {
      console.warn(`Could not load data/${name}.json`, err);
      return null;
    }
  }

  async function fileExists(url) {
    try { const r = await fetch(url, { method: 'HEAD', cache: 'no-cache' }); return r.ok; } catch { return false; }
  }

  /* ---------------- boot ---------------- */
  let started = false;
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();

  async function init() {
    if (started) return; started = true;
    setupIntro();
    $('#year').textContent = new Date().getFullYear();
    setupNavStatic();

    const [profile, education, skills, projects, certificates, ctf, experience, labs, gallery, blogs] = await Promise.all(
      ['profile', 'education', 'skills', 'projects', 'certificates', 'ctf', 'experience', 'labs', 'gallery', 'blogs'].map(loadJSON));

    if (!profile) {
      const box = $('#app-error');
      box.hidden = false;
      box.innerHTML = 'Content could not be loaded. If you opened <code>index.html</code> directly from your files, run a local server instead (see README), or check that the <code>data/</code> folder was uploaded.';
      return;
    }

    const D = {
      profile,
      education: shown(education),
      skills: arr(skills?.categories).filter((c) => c.visible !== false).map((c) => ({ ...c, skills: shown(c.skills) })).filter((c) => c.skills.length),
      projects: shown(projects),
      certs: shown(certificates),
      ctf: shown(ctf),
      experience: shown(experience),
      labs: { focusAreas: arr(labs?.focusAreas), entries: shown(labs?.entries) },
      gallery: shown(gallery?.collections),
      blogs: shown(blogs?.posts),
    };

    const resumeUrl = profile.resume?.file || '';
    const hasResume = resumeUrl ? await fileExists(resumeUrl) : false;

    renderProfile(D.profile, hasResume);
    renderStats(D);
    renderEducation(D.education);
    renderSkills(D.skills);
    renderProjects(D.projects);
    renderBlogs(D.blogs);
    renderLabs(D.labs);
    renderExperience(D.experience);
    renderCerts(D);
    renderGallery(D.gallery);
    renderResume(D.profile, hasResume);
    renderContact(D.profile);

    setupReveal();
    setupScrollSpy();
    setupHeroEffects();
    setupModalRouting(D);
  }

  /* ---------------- intro ---------------- */
  function setupIntro() {
    const el = $('#intro');
    if (!el) return;
    const finish = () => {
      if (el.classList.contains('out')) return;
      el.classList.add('out');
      document.body.classList.remove('locked');
      setTimeout(() => el.classList.add('gone'), 700);
    };
    // Show the welcome animation on every fresh page load. In-page navigation does not reload it.
    if (reduce) { el.classList.add('gone'); return; }
    document.body.classList.add('locked');
    $('#intro-skip').addEventListener('click', finish);
    el.addEventListener('keydown', (e) => { if (e.key === 'Escape') finish(); });
    $('#intro-skip').focus({ preventScroll: true });
    setTimeout(finish, 3000);
  }

  /* ---------------- nav ---------------- */
  function setupNavStatic() {
    const nav = $('#nav');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    const toggle = $('#nav-toggle'), links = $('#nav-links');
    toggle.innerHTML = icon('menu');
    const setOpen = (o) => { links.classList.toggle('open', o); toggle.setAttribute('aria-expanded', String(o)); toggle.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    $('#nav-github').innerHTML = icon('github');
    $('#nav-linkedin').innerHTML = icon('linkedin');
    $('#lb-zoom-out').innerHTML = icon('zoom-out');
    $('#lb-zoom-in').innerHTML = icon('zoom-in');
    $('#lb-download').innerHTML = icon('download');
    $('#lb-close').innerHTML = icon('x');
    $('#lb-prev').innerHTML = icon('chevron-left');
    $('#lb-next').innerHTML = icon('chevron-right');
  }

  function setupScrollSpy() {
    const links = $$('#nav-links a');
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.remove('active'));
        map.get(en.target.id)?.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  function setupReveal() {
    const els = $$('.reveal:not(.in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach((e) => io.observe(e));
  }

  /* ---------------- profile / hero ---------------- */
  function socialLinks(p, withMail = true) {
    const out = [];
    if (safeUrl(p.github)) out.push(`<a class="icon-btn" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">${icon('github')}</a>`);
    if (safeUrl(p.linkedin)) out.push(`<a class="icon-btn" href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">${icon('linkedin')}</a>`);
    if (withMail && p.email) out.push(`<a class="icon-btn" href="mailto:${esc(p.email)}" aria-label="Email ${esc(p.name)}">${icon('mail')}</a>`);
    return out.join('');
  }

  function renderProfile(p, hasResume) {
    if (p.seo?.title) document.title = p.seo.title;
    if (p.seo?.description) {
      $('meta[name="description"]').setAttribute('content', p.seo.description);
      $('meta[property="og:description"]')?.setAttribute('content', p.seo.description);
    }
    if (p.seo?.title) $('meta[property="og:title"]')?.setAttribute('content', p.seo.title);

    $('#brand-name').textContent = p.name;
    $('#footer-name').textContent = p.name;
    $('#footer-copy-name').textContent = p.name;
    $('#hero-name').textContent = p.name;
    $('#hero-greeting').textContent = p.greeting || "Hi, I'm";
    $('#hero-badge').textContent = p.badge || p.title;
    $('#hero-headline').textContent = p.headline || '';
    $('#hero-lead').textContent = p.intro || '';

    if (safeUrl(p.github)) $('#nav-github').href = p.github; else $('#nav-github').remove();
    if (safeUrl(p.linkedin)) $('#nav-linkedin').href = p.linkedin; else $('#nav-linkedin').remove();

    const photo = $('#hero-photo');
    photo.alt = p.photoAlt || `Portrait of ${p.name}`;
    photo.dataset.ph = PH_PROFILE;
    if (p.photo) photo.src = p.photo;

    $('#hero-cta').innerHTML = `
      <a class="btn btn--primary" href="#projects">View Projects ${icon('arrow-right')}</a>
      ${hasResume
        ? `<a class="btn btn--ghost" href="${esc(p.resume.file)}" download>${icon('download')} Download Resume</a>`
        : `<span class="btn btn--ghost btn--disabled" aria-disabled="true" role="link" title="Resume will be available soon">${icon('download')} Resume coming soon</span>`}
      <a class="btn btn--ghost" href="#contact">${icon('mail')} Contact Me</a>`;
    $('#hero-social').innerHTML = socialLinks(p);
    $('#footer-social').innerHTML = socialLinks(p, false);

    typing($('#typed'), arr(p.typing).length ? p.typing : [p.title]);

    // About
    const a = p.about || {};
    $('#about-root').innerHTML = `
      <div class="about__text reveal">${arr(a.paragraphs).map((t) => `<p>${esc(t)}</p>`).join('')}</div>
      <div class="interests">${arr(a.interests).map((i, n) => `
        <div class="interest card card--hover reveal" style="--d:${(n % 4) * 0.06}s"><span class="ico">${icon(i.icon)}</span><span>${esc(i.label)}</span></div>`).join('')}</div>`;
  }

  function typing(el, words) {
    if (reduce || words.length < 2) { el.textContent = words[0] || ''; return; }
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w];
      el.textContent = word.slice(0, c);
      let d = del ? 38 : 80;
      if (!del && c === word.length) { del = true; d = 1500; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 350; }
      else c += del ? -1 : 1;
      setTimeout(tick, d);
    })();
  }

  /* ---------------- stats (computed from the data, never typed in) ---------------- */
  function renderStats(D) {
    const certCount = D.certs.filter((c) => (c.category || 'certification') === 'certification').length;
    const courseCount = D.certs.filter((c) => c.category === 'course').length;
    const items = [
      { icon: 'shield', n: D.projects.length, label: 'Projects' },
      { icon: 'monitor', n: D.labs.entries.length, label: 'SOC Lab Activities' },
      { icon: 'flag', n: D.ctf.length, label: 'CTF & Practical Challenges' },
      { icon: 'award', n: certCount, label: 'Certifications' },
      { icon: 'book-open', n: courseCount, label: 'Courses & Training' },
    ];
    $('#stats').innerHTML = items.map((s) => `<div class="stat">${icon(s.icon)}<div><strong data-count="${s.n}">${s.n}</strong><span>${esc(s.label)}</span></div></div>`).join('');
    if (reduce || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        $$('[data-count]', en.target).forEach((el) => {
          const end = +el.dataset.count; if (!end) return;
          const t0 = performance.now(), dur = 1100;
          (function step(t) {
            const k = Math.min(1, (t - t0) / dur);
            el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(step);
          })(t0);
        });
      });
    }, { threshold: 0.4 });
    io.observe($('#stats'));
  }

  /* ---------------- education ---------------- */
  function renderEducation(list) {
    const root = $('#education-root');
    if (!list.length) { root.innerHTML = emptyState('Education details coming soon.'); return; }
    root.innerHTML = list.map((e, i) => {
      const live = /pursuing|ongoing|current/i.test(e.status || '');
      return `
      <article class="edu card card--hover reveal" style="--d:${i * 0.08}s">
        <div class="logo-box ${e.logo ? '' : 'no-img'}">
          ${e.logo ? `<img src="${esc(e.logo)}" alt="${esc(e.institution)} logo" loading="lazy" decoding="async" data-hide>` : ''}
          <span class="initials" aria-hidden="true">${esc(e.logoText || initials(e.institution))}</span>
        </div>
        <div>
          <div class="edu__top"><h3>${esc(e.degree)}</h3>${e.status ? `<span class="pill ${live ? 'pill--live' : ''}">${esc(e.status)}</span>` : ''}</div>
          <p class="edu__inst">${esc(e.institution)}</p>
          <ul class="meta">
            ${e.location ? `<li>${icon('map-pin')}${esc(e.location)}</li>` : ''}
            ${e.duration ? `<li>${icon('calendar')}${esc(e.duration)}</li>` : ''}
            ${e.cgpa ? `<li>${icon('award')}${esc(e.cgpaLabel || 'CGPA')}: ${esc(e.cgpa)}</li>` : ''}
          </ul>
          ${e.notes ? `<p class="edu__notes">${esc(e.notes)}</p>` : ''}
          ${e.photos?.length ? `<div class="edu__notes">${thumbs(e.photos, e.institution)}</div>` : ''}
        </div>
      </article>`;
    }).join('');
  }

  /* ---------------- skills ---------------- */
  const skillIndex = [];
  function skillHasDetail(s) { return !!(s.description || s.evidence || arr(s.screenshots).length || arr(s.links).length || arr(s.projects).length); }

  function renderSkills(cats) {
    const root = $('#skills-root');
    if (!cats.length) { root.innerHTML = emptyState('Skills will appear here.'); return; }
    root.innerHTML = cats.map((c) => `
      <div class="skill-cat reveal">
        <h3 class="skill-cat__title"><span class="ico">${icon(c.icon || 'shield')}</span>${esc(c.name)}</h3>
        <div class="skill-grid">${c.skills.map((s) => {
          const idx = skillIndex.push(s) - 1;
          const inner = `
            <span class="ico">${s.logo ? `<img src="${esc(s.logo)}" alt="" loading="lazy" data-hide>` : icon(s.icon || 'shield')}</span>
            <span><strong>${esc(s.name)}</strong>${s.subtitle ? `<small>${esc(s.subtitle)}</small>` : ''}</span>`;
          return skillHasDetail(s)
            ? `<button type="button" class="skill card card--hover" data-skill="${idx}" aria-haspopup="dialog">${inner}${icon('arrow-up-right', 'more')}</button>`
            : `<div class="skill card">${inner}</div>`;
        }).join('')}</div>
      </div>`).join('');
  }

  function openSkill(s) {
    const links = arr(s.links).filter((l) => safeUrl(l.url));
    openModal(`
      <div class="dlg__body">
        <div><h2>${esc(s.name)}</h2>${s.subtitle ? `<p class="project__sub">${esc(s.subtitle)}</p>` : ''}</div>
        ${s.description ? `<p>${esc(s.description)}</p>` : ''}
        ${s.evidence ? `<div><h4>Practical evidence</h4><p>${esc(s.evidence)}</p></div>` : ''}
        ${arr(s.screenshots).length ? `<div><h4>Screenshots</h4>${thumbs(s.screenshots, s.name)}</div>` : ''}
        ${links.length ? `<div class="dlg__links">${links.map((l) => `<a class="btn btn--ghost btn--sm" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${icon('link')} ${esc(l.label || 'Related link')}</a>`).join('')}</div>` : ''}
      </div>`);
  }

  /* ---------------- projects ---------------- */
  function cover(p, big) {
    return `<div class="cover ${p.cover ? '' : 'no-img'}">
      ${p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.name)} cover image" loading="lazy" decoding="async" data-hide>` : ''}
      <div class="cover__fb">${icon(p.icon || 'shield')}<span>${esc(p.name)}</span></div>
    </div>`;
  }

  function renderProjects(list) {
    const root = $('#projects-root');
    if (!list.length) { root.innerHTML = emptyState('Projects coming soon.'); return; }
    const cards = list.map((p, i) => `
      <article class="project card card--hover reveal" style="--d:${(i % 3) * 0.08}s">
        <a class="project__cover-link" href="#project=${encodeURIComponent(p.id)}" aria-label="Open ${esc(p.name)} project details">
          ${cover(p)}
        </a>
        <div class="project__body">
          <div class="project__title">
            <div><h3><a class="project__title-link" href="#project=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3>${p.subtitle ? `<p class="project__sub">${esc(p.subtitle)}</p>` : ''}</div>
            ${p.status ? `<span class="pill">${esc(p.status)}</span>` : ''}
          </div>
          <p class="project__desc">${esc(p.description)}</p>
          <div class="tags">${arr(p.tech).slice(0, 6).map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
          <div class="project__actions">
            <a class="btn btn--primary btn--sm" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(p.name)} GitHub repository">View Project ${icon('external-link')}</a>
            <a class="btn btn--ghost btn--sm" href="#project=${encodeURIComponent(p.id)}" aria-label="View details of ${esc(p.name)}">Project Details ${icon('arrow-right')}</a>
            ${safeUrl(p.demo) ? `<a class="btn btn--ghost btn--sm" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">${icon('external-link')} Live demo</a>` : ''}
          </div>
        </div>
      </article>`).join('');
    root.innerHTML = `${cards}
      <a class="projects-github-card card card--hover" href="https://github.com/dipangshu-dey" target="_blank" rel="noopener noreferrer">
        <span class="projects-github-card__icon">${icon('github')}</span>
        <span><strong>Explore my GitHub</strong><small>View repositories, source code and project updates</small></span>
        ${icon('arrow-up-right', 'projects-github-card__arrow')}
      </a>`;
  }

  function openProject(p) {
    openModal(`
      ${cover(p)}
      <div class="dlg__body">
        <div>
          <div class="project__title"><h2>${esc(p.name)}</h2>${p.status ? `<span class="pill">${esc(p.status)}</span>` : ''}</div>
          ${p.subtitle ? `<p class="project__sub">${esc(p.subtitle)}</p>` : ''}
        </div>
        <p>${esc(p.details || p.description)}</p>
        ${arr(p.features).length ? `<div><h4>Key features</h4><ul class="bullets feat">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
        ${arr(p.tech).length ? `<div><h4>Technology stack</h4><div class="tags">${p.tech.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div></div>` : ''}
        <div><h4>Screenshots</h4>${arr(p.screenshots).length ? thumbs(p.screenshots, p.name) : '<p>Screenshots will be added soon.</p>'}</div>
        <div class="dlg__links">
          <a class="btn btn--primary btn--sm" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">${icon('github')} Open this project's GitHub repository</a>
          ${safeUrl(p.demo) ? `<a class="btn btn--ghost btn--sm" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">${icon('external-link')} Live demo</a>` : ''}
        </div>
      </div>`, { onClose: () => { if (location.hash.startsWith('#project=')) history.replaceState(null, '', '#projects'); } });
  }

  /* ---------------- blogs & security write-ups ---------------- */
  function blogBlock(block) {
    if (!block || typeof block !== 'object') return '';
    if (block.type === 'heading') {
      const level = Math.min(4, Math.max(2, Number(block.level) || 2));
      return `<h${level}>${esc(block.text || '')}</h${level}>`;
    }
    if (block.type === 'paragraph') return `<p>${esc(block.text || '')}</p>`;
    if (block.type === 'list') return `<ul class="bullets">${arr(block.items).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    if (block.type === 'code') return `<figure class="blog-code"><figcaption>${esc(block.caption || block.language || 'Code')}</figcaption><pre><code>${esc(block.code || '')}</code></pre></figure>`;
    if (block.type === 'image' && safeUrl(block.src)) return `<figure class="blog-figure"><img src="${esc(block.src)}" alt="${esc(block.alt || block.caption || '')}" loading="lazy"><figcaption>${esc(block.caption || '')}</figcaption></figure>`;
    if (block.type === 'pdf' && safeUrl(block.src)) return `<p><a class="btn btn--ghost btn--sm" href="${esc(block.src)}" target="_blank" rel="noopener noreferrer">${icon('file-text')} ${esc(block.label || 'View PDF report')}</a></p>`;
    if (block.type === 'link' && safeUrl(block.url)) return `<p><a href="${esc(block.url)}" target="_blank" rel="noopener noreferrer">${esc(block.label || block.url)}</a></p>`;
    return '';
  }

  function renderBlogs(posts) {
    const root = $('#blogs-root');
    const search = $('#blog-search');
    const category = $('#blog-category');
    if (!root || !search || !category) return;
    const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort();
    category.innerHTML = '<option value="all">All categories</option>' + categories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
    const draw = () => {
      const q = search.value.trim().toLowerCase();
      const c = category.value;
      const filtered = posts.filter((p) => {
        const haystack = [p.title, p.description, p.category, ...(arr(p.tags))].join(' ').toLowerCase();
        return (c === 'all' || p.category === c) && (!q || haystack.includes(q));
      });
      if (!filtered.length) {
        root.innerHTML = posts.length
          ? emptyState('No write-ups match your search. Try another keyword or category.')
          : `<div class="empty reveal"><strong>Your cybersecurity writing space</strong>
              Your machine-solving reports, CTF write-ups, penetration-testing reports, SOC investigations and security research articles will appear here.
              <p class="blog-empty-note">Add your first article to <code>data/blogs.json</code>. You can attach screenshots, code snippets, PDF reports and reference links.</p>
            </div>`;
        return;
      }
      root.innerHTML = filtered.map((p) => `
        <article class="blog-card card card--hover reveal">
          ${p.cover ? `<a class="blog-card__cover" href="#blog=${encodeURIComponent(p.id)}"><img src="${esc(p.cover)}" alt="${esc(p.title)} cover" loading="lazy"></a>` : ''}
          <div class="blog-card__body">
            <div class="blog-meta"><span class="chip">${esc(p.category || 'Write-up')}</span>${p.date ? `<time>${esc(fmtDate(p.date))}</time>` : ''}${p.readTime ? `<span>${esc(p.readTime)}</span>` : ''}</div>
            <h3><a href="#blog=${encodeURIComponent(p.id)}">${esc(p.title)}</a></h3>
            <p>${esc(p.description || '')}</p>
            ${arr(p.tags).length ? `<div class="tags">${p.tags.map((t) => `<span class="chip chip--muted">${esc(t)}</span>`).join('')}</div>` : ''}
            <a class="blog-read" href="#blog=${encodeURIComponent(p.id)}">Read write-up ${icon('arrow-right')}</a>
          </div>
        </article>`).join('');
      setupReveal();
    };
    search.addEventListener('input', draw);
    category.addEventListener('change', draw);
    draw();
  }

  function openBlog(post) {
    const blocks = arr(post.blocks).map(blogBlock).join('');
    const attachments = arr(post.attachments).filter((a) => safeUrl(a.url));
    openModal(`
      <article class="blog-article dlg__body">
        <div class="blog-meta"><span class="chip">${esc(post.category || 'Write-up')}</span>${post.date ? `<time>${esc(fmtDate(post.date))}</time>` : ''}${post.readTime ? `<span>${esc(post.readTime)}</span>` : ''}</div>
        <h2>${esc(post.title)}</h2>
        <p class="blog-article__intro">${esc(post.description || '')}</p>
        ${post.cover ? `<figure class="blog-figure"><img src="${esc(post.cover)}" alt="${esc(post.title)} cover"></figure>` : ''}
        <div class="blog-article__content">${blocks || '<p>Article content will be added soon.</p>'}</div>
        ${attachments.length ? `<section class="blog-attachments"><h3>Attachments &amp; reports</h3><div class="dlg__links">${attachments.map((a) => `<a class="btn btn--ghost btn--sm" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${icon('download')} ${esc(a.label || 'Download attachment')}</a>`).join('')}</div></section>` : ''}
        ${arr(post.references).filter((u) => safeUrl(u.url)).length ? `<section class="blog-attachments"><h3>References</h3><ul>${post.references.filter((u) => safeUrl(u.url)).map((u) => `<li><a href="${esc(u.url)}" target="_blank" rel="noopener noreferrer">${esc(u.label || u.url)}</a></li>`).join('')}</ul></section>` : ''}
      </article>`, { onClose: () => { if (location.hash.startsWith('#blog=')) history.replaceState(null, '', '#blogs'); } });
  }

  /* ---------------- SOC lab ---------------- */
  function renderLabs(L) {
    const root = $('#labs-root');
    if (!L.entries.length) {
      root.innerHTML = `
        <div class="empty reveal"><strong>Lab write-ups are on the way</strong>
          Completed SOC lab activities will be added here with tools used, commands, screenshots, findings and lessons learned.
          ${L.focusAreas.length ? `<p style="margin-top:14px">Areas I am working toward (not yet completed entries):</p><div class="focus" aria-label="Areas I am working toward">${L.focusAreas.map((f) => `<span class="chip chip--muted">${esc(f)}</span>`).join('')}</div>` : ''}
        </div>`;
      return;
    }
    root.innerHTML = `<div class="timeline">${L.entries.map((e, i) => {
      const tools = Array.isArray(e.tools) ? e.tools : (e.tool ? [e.tool] : []);
      return `
      <article class="tl-item card reveal" style="--d:${(i % 3) * 0.06}s">
        <div class="tags" style="margin-bottom:10px">${e.category ? `<span class="chip">${esc(e.category)}</span>` : ''}${tools.map((t) => `<span class="chip chip--muted">${esc(t)}</span>`).join('')}</div>
        <h3>${esc(e.title)}</h3>
        ${e.date ? `<div class="when"><span class="meta"><li>${icon('calendar')}${esc(fmtDate(e.date))}</li></span></div>` : ''}
        ${e.description ? `<p>${esc(e.description)}</p>` : ''}
        ${arr(e.commands).length ? `<div class="tl-block"><h4>Commands &amp; procedures</h4><pre class="cmds"><code>${arr(e.commands).map(esc).join('\n')}</code></pre></div>` : ''}
        ${arr(e.screenshots).length ? `<div class="tl-block"><h4>Screenshots</h4>${thumbs(e.screenshots, e.title)}</div>` : ''}
        ${bulletsBlock('Findings', e.findings)}
        ${bulletsBlock('What I learned', e.learned)}
      </article>`;
    }).join('')}</div>`;
  }

  function bulletsBlock(title, v) {
    const list = Array.isArray(v) ? v : (v ? [v] : []);
    if (!list.length) return '';
    return `<div class="tl-block"><h4>${esc(title)}</h4><ul class="bullets">${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
  }

  /* ---------------- experience ---------------- */
  function renderExperience(list) {
    const root = $('#experience-root');
    if (!list.length) { root.innerHTML = emptyState('Experience will be added here.'); root.classList.remove('timeline'); return; }
    root.innerHTML = list.map((e, i) => `
      <article class="tl-item card reveal" style="--d:${i * 0.06}s">
        <h3>${esc(e.role)}</h3>
        <p class="project__sub">${esc(e.organization)}</p>
        <div class="when"><ul class="meta">
          ${e.start || e.end ? `<li>${icon('calendar')}${esc([e.start, e.end].filter(Boolean).join(' – '))}</li>` : ''}
          ${e.location ? `<li>${icon('map-pin')}${esc(e.location)}</li>` : ''}
        </ul></div>
        ${e.description ? `<p>${esc(e.description)}</p>` : '<p><em>A fuller description of this internship will be added soon.</em></p>'}
        ${bulletsBlock('Responsibilities', e.responsibilities)}
        ${bulletsBlock('Learning outcomes', e.learnings)}
        ${arr(e.photos).length ? `<div class="tl-block">${thumbs(e.photos, e.organization)}</div>` : ''}
      </article>`).join('');
  }

  /* ---------------- certificates / CTF ---------------- */
  const CAT = {
    ctf: { label: 'CTF & Practical Challenges', short: 'CTF & Practical', note: 'TryHackMe achievements, CTF certificates, challenge completions and practical lab evidence.' },
    certification: { label: 'Cybersecurity Certifications', short: 'Certifications', note: 'Professional and security-focused certifications.' },
    course: { label: 'Courses & Training', short: 'Courses & Training', note: 'Online courses, networking courses, academic training and other learning.' },
  };

  function renderCerts(D) {
    const root = $('#certs-root');
    const all = [
      ...D.ctf.map((c) => ({ ...c, category: 'ctf', issuer: c.issuer || c.platform })),
      ...D.certs.map((c) => ({ ...c, category: CAT[c.category] ? c.category : 'certification' })),
    ];
    const tabs = [{ id: 'all', label: 'All' }, ...Object.keys(CAT).map((k) => ({ id: k, label: CAT[k].short }))];
    const count = (id) => (id === 'all' ? all.length : all.filter((c) => c.category === id).length);

    root.innerHTML = `
      <div class="tabs reveal" role="tablist" aria-label="Certificate categories">
        ${tabs.map((t, i) => `<button type="button" role="tab" class="tab" id="tab-${t.id}" data-tab="${t.id}" aria-selected="${i === 0}" aria-controls="certs-panel">${esc(t.label)}<span class="n">${count(t.id)}</span></button>`).join('')}
      </div>
      <div id="certs-panel" role="tabpanel" aria-live="polite"></div>`;

    const panel = $('#certs-panel');
    const draw = (id) => {
      const list = id === 'all' ? all : all.filter((c) => c.category === id);
      const note = id === 'all' ? '' : `<p class="cert-note">${esc(CAT[id].note)}</p>`;
      if (!list.length) {
        panel.innerHTML = note + emptyState(id === 'all' ? 'Certificates and achievements will be added here as I earn them.' : `No entries in “${CAT[id].label}” yet.`);
        return;
      }
      const k = registerGroup(list.map((c) => {
        const src = c.image || c.pdf;
        return src ? { type: c.image ? 'image' : 'pdf', src, title: c.title, caption: [c.title, c.issuer, fmtDate(c.date)].filter(Boolean).join(' · '), download: c.pdf || c.image } : null;
      }).filter(Boolean));
      let li = -1;
      panel.innerHTML = note + `<div class="certs">${list.map((c, i) => {
        const viewable = !!(c.image || c.pdf);
        if (viewable) li++;
        return `
        <article class="cert card card--hover">
          <button type="button" class="cert__thumb" ${viewable ? `data-lb="${k}" data-i="${li}" aria-label="View ${esc(c.title)}"` : 'disabled'} >
            ${c.image ? phImg(c.image, `${c.title} certificate`) : `<span class="pdf-tile">${icon(c.pdf ? 'file-text' : 'award')}${c.pdf ? 'PDF certificate' : ''}</span>`}
            ${id === 'all' ? `<span class="cert__tag chip">${esc(CAT[c.category].short)}</span>` : ''}
          </button>
          <div class="cert__body">
            <h3>${esc(c.title)}</h3>
            ${c.issuer ? `<p class="cert__issuer">${esc(c.issuer)}</p>` : ''}
            <p class="cert__meta">${c.date ? `<span>${esc(fmtDate(c.date))}</span>` : ''}${c.credentialId ? `<span>ID: ${esc(c.credentialId)}</span>` : ''}</p>
            ${c.description ? `<p class="cert__desc">${esc(c.description)}</p>` : ''}
            <div class="cert__actions">
              ${viewable ? `<button type="button" class="btn btn--primary btn--sm" data-lb="${k}" data-i="${li}">${icon('eye')} View certificate</button>` : ''}
              ${c.image && c.pdf ? `<a class="btn btn--ghost btn--sm" href="${esc(c.pdf)}" target="_blank" rel="noopener noreferrer">${icon('file-text')} PDF</a>` : ''}
              ${c.pdf ? `<a class="btn btn--ghost btn--sm" href="${esc(c.pdf)}" download>${icon('download')} Download</a>` : ''}
              ${safeUrl(c.verifyUrl) ? `<a class="btn btn--ghost btn--sm" href="${esc(c.verifyUrl)}" target="_blank" rel="noopener noreferrer">${icon('external-link')} Verify</a>` : ''}
            </div>
          </div>
        </article>`;
      }).join('')}</div>`;
    };
    draw('all');

    const tabEls = $$('.tab', root);
    const select = (el) => { tabEls.forEach((t) => t.setAttribute('aria-selected', String(t === el))); draw(el.dataset.tab); };
    tabEls.forEach((t) => t.addEventListener('click', () => select(t)));
    $('.tabs', root).addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const i = tabEls.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      const n = tabEls[(i + (e.key === 'ArrowRight' ? 1 : tabEls.length - 1)) % tabEls.length];
      n.focus(); select(n);
    });
  }

  /* ---------------- gallery / collage layouts ---------------- */
  function renderGallery(cols) {
    if (!cols.length) return;
    $('#gallery').hidden = false;
    const nav = $('#nav-links');
    const resume = nav.querySelector('a[href="#resume"]');
    const a = document.createElement('a'); a.href = '#gallery'; a.textContent = 'Gallery';
    nav.insertBefore(a, resume);
    $('#gallery-root').innerHTML = cols.map((c) => galleryHTML(c)).join('');
    $$('.gal').forEach(wireGallery);
  }

  function galleryHTML(c) {
    const imgs = arr(c.images).map(norm).filter((i) => i.src);
    if (!imgs.length) return '';
    const layout = ['grid', 'masonry', 'collage', 'carousel', 'slideshow', 'featured'].includes(c.layout) ? c.layout : 'grid';
    const k = registerGroup(imgs.map((i) => ({ type: isPdf(i.src) ? 'pdf' : 'image', src: i.src, title: c.title || 'Gallery', caption: i.caption || '' })));
    const style = `--gap:${Math.max(0, Math.min(40, +c.gap || 14))}px`;
    const cls = `gal gal--${layout} ${c.border ? 'bordered' : ''}`;
    const fig = (i, n, extra = '') => `
      <figure class="${extra}">
        <button type="button" class="gi" data-lb="${k}" data-i="${n}" aria-label="Open image ${n + 1}${i.caption ? ': ' + esc(i.caption) : ''}">
          ${phImg(i.src, i.caption || c.title || 'Gallery image', i.focus ? `style="object-position:${esc(i.focus)}"` : '')}
          ${i.caption ? `<figcaption>${esc(i.caption)}</figcaption>` : ''}
        </button>
      </figure>`;
    let body = '';
    if (layout === 'collage') {
      body = imgs.map((i, n) => fig(i, n, i.size || (n % 6 === 0 ? 'big' : n % 6 === 3 ? 'wide' : n % 6 === 4 ? 'tall' : ''))).join('');
    } else if (layout === 'slideshow' || layout === 'featured') {
      body = `<div class="gal__main" data-main></div>
        ${layout === 'slideshow'
          ? `<div class="gal__controls"><button type="button" class="icon-btn" data-prev aria-label="Previous slide">${icon('chevron-left')}</button>
              <div class="gal__dots">${imgs.map((_, n) => `<button type="button" data-dot="${n}" aria-label="Go to slide ${n + 1}"></button>`).join('')}</div>
              <button type="button" class="icon-btn" data-next aria-label="Next slide">${icon('chevron-right')}</button>
              <button type="button" class="icon-btn" data-play aria-label="Play slideshow">${icon('play')}</button></div>`
          : `<div class="gal__thumbs">${imgs.map((i, n) => `<button type="button" data-dot="${n}" aria-label="Show image ${n + 1}">${phImg(i.src, '')}</button>`).join('')}</div>`}`;
    } else if (layout === 'carousel') {
      body = `<div class="gal__track" tabindex="0" aria-label="${esc(c.title || 'Image carousel')}">${imgs.map((i, n) => fig(i, n)).join('')}</div>
        <div class="gal__arrows"><button type="button" class="icon-btn" data-scroll="-1" aria-label="Scroll left">${icon('chevron-left')}</button><button type="button" class="icon-btn" data-scroll="1" aria-label="Scroll right">${icon('chevron-right')}</button></div>`;
    } else {
      body = imgs.map((i, n) => fig(i, n)).join('');
    }
    const data = (layout === 'slideshow' || layout === 'featured') ? `data-images='${esc(JSON.stringify(imgs))}' data-group="${k}"` : '';
    return `<div class="reveal"><div class="gal__head"><h3>${esc(c.title || '')}</h3>${c.description ? `<p>${esc(c.description)}</p>` : ''}</div>
      <div class="${cls}" style="${style}" ${data}>${body}</div></div>`;
  }

  function wireGallery(el) {
    const track = $('.gal__track', el);
    if (track) {
      $$('[data-scroll]', el).forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: +b.dataset.scroll * track.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })));
    }
    const main = $('[data-main]', el);
    if (!main) return;
    const imgs = JSON.parse(el.dataset.images);
    const k = el.dataset.group;
    let cur = 0, timer = null;
    const show = (n) => {
      cur = (n + imgs.length) % imgs.length;
      const i = imgs[cur];
      main.innerHTML = `<figure><button type="button" class="gi" data-lb="${k}" data-i="${cur}" aria-label="Open image ${cur + 1}">${phImg(i.src, i.caption || 'Gallery image', i.focus ? `style="object-position:${esc(i.focus)}"` : '')}${i.caption ? `<figcaption>${esc(i.caption)}</figcaption>` : ''}</button></figure>`;
      $$('[data-dot]', el).forEach((d) => d.setAttribute('aria-current', String(+d.dataset.dot === cur)));
    };
    show(0);
    const play = $('[data-play]', el);
    const setPlay = (on) => {
      clearInterval(timer); timer = null;
      if (!play) return;
      if (on) timer = setInterval(() => show(cur + 1), 4500);
      play.innerHTML = icon(on ? 'pause' : 'play');
      play.setAttribute('aria-label', on ? 'Pause slideshow' : 'Play slideshow');
    };
    const manual = (n) => { setPlay(false); show(n); };   // any manual control pauses autoplay
    $$('[data-dot]', el).forEach((d) => d.addEventListener('click', () => manual(+d.dataset.dot)));
    $('[data-prev]', el)?.addEventListener('click', () => manual(cur - 1));
    $('[data-next]', el)?.addEventListener('click', () => manual(cur + 1));
    play?.addEventListener('click', () => setPlay(!timer));
    if (play && !reduce) setPlay(true);
  }

  /* ---------------- resume ---------------- */
  function renderResume(p, hasResume) {
    const root = $('#resume-root');
    const intro = p.resumeSection?.intro || '';
    if (!hasResume) {
      root.innerHTML = `
        <div class="resume card reveal">
          <div class="resume__copy">
            <h3>${esc(p.name)}</h3>
            <p>${esc(intro)}</p>
            <div class="resume__actions"><span class="btn btn--ghost btn--disabled" aria-disabled="true">${icon('eye')} View Resume</span><span class="btn btn--ghost btn--disabled" aria-disabled="true">${icon('download')} Download Resume</span></div>
          </div>
          <div class="paper paper--soon"><div>${icon('file-text')}<strong>Resume coming soon</strong><span>My resume will be published here.</span></div></div>
        </div>`;
      return;
    }
    const f = p.resume.file;
    root.innerHTML = `
      <div class="resume card reveal">
        <div class="resume__copy">
          <h3>${esc(p.name)}</h3>
          <p>${esc(intro)}</p>
          ${p.resume.updated ? `<p class="resume__updated">Last updated: ${esc(fmtDate(p.resume.updated))}</p>` : ''}
          <div class="resume__actions">
            <a class="btn btn--primary" href="${esc(f)}" target="_blank" rel="noopener noreferrer">${icon('eye')} View Resume</a>
            <a class="btn btn--ghost" href="${esc(f)}" download>${icon('download')} Download Resume</a>
          </div>
        </div>
        <div class="paper">
          <iframe src="${esc(f)}#toolbar=0&navpanes=0&view=FitH" title="Resume preview" loading="lazy"></iframe>
          <div class="mobile-only">${icon('file-text')}<strong>PDF resume</strong><span>Use “View Resume” to open it.</span></div>
        </div>
      </div>`;
  }

  /* ---------------- contact ---------------- */
  function renderContact(p) {
    $('#contact-text').textContent = p.contact?.text || '';
    const cards = [];
    if (safeUrl(p.linkedin)) cards.push(`<a class="card card--hover reveal" href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer"><span class="ico">${icon('linkedin')}</span><span><small>LinkedIn</small><strong>dipangshu-dey</strong></span></a>`);
    if (safeUrl(p.github)) cards.push(`<a class="card card--hover reveal" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer"><span class="ico">${icon('github')}</span><span><small>GitHub</small><strong>dipangshu-dey</strong></span></a>`);
    if (p.email) cards.push(`<a class="card card--hover reveal" href="mailto:${esc(p.email)}"><span class="ico">${icon('mail')}</span><span><small>Email</small><strong>${esc(p.email)}</strong></span></a>`);
    const cta = p.email
      ? `<a class="btn btn--primary" href="mailto:${esc(p.email)}">${icon('mail')} Contact Me</a>`
      : (safeUrl(p.linkedin) ? `<a class="btn btn--primary" href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer">${icon('linkedin')} Contact Me on LinkedIn</a>` : '');
    $('#contact-root').innerHTML = cards.join('') + (cta ? `<div class="contact__cta reveal" style="grid-column:1/-1">${cta}</div>` : '');
  }

  const emptyState = (msg) => `<div class="empty reveal"><strong>Nothing here yet</strong>${esc(msg)}</div>`;

  /* ---------------- modal ---------------- */
  const modal = () => $('#modal');
  let modalOnClose = null;
  function openModal(html, opts = {}) {
    const m = modal();
    modalOnClose = opts.onClose || null;
    m.innerHTML = `<button type="button" class="icon-btn dlg-close" data-close aria-label="Close dialog">${icon('x')}</button><div class="dlg__scroll">${html}</div>`;
    if (!m.open) m.showModal();
    m.querySelector('.dlg__scroll').scrollTop = 0;
  }
  function setupModalCloseHandlers() {
    const m = modal();
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) m.close(); });
    m.addEventListener('close', () => { const f = modalOnClose; modalOnClose = null; m.innerHTML = ''; if (f) f(); });
  }

  function setupModalRouting(D) {
    setupModalCloseHandlers();
    const handleHash = () => {
      const projectMatch = /^#project=(.+)$/.exec(location.hash);
      if (projectMatch) {
        const id = decodeURIComponent(projectMatch[1]);
        const p = D.projects.find((x) => x.id === id);
        if (p) openProject(p);
        return;
      }
      const blogMatch = /^#blog=(.+)$/.exec(location.hash);
      if (blogMatch) {
        const id = decodeURIComponent(blogMatch[1]);
        const post = D.blogs.find((x) => x.id === id);
        if (post) openBlog(post);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();

    document.addEventListener('click', (e) => {
      const sk = e.target.closest('[data-skill]');
      if (sk) { openSkill(skillIndex[+sk.dataset.skill]); return; }
      const lbBtn = e.target.closest('[data-lb]');
      if (lbBtn) openLightbox(groups[lbBtn.dataset.lb], +lbBtn.dataset.i);
    });
    // close project modal when back button clears the hash
    window.addEventListener('popstate', () => { if (!location.hash.startsWith('#project=') && !location.hash.startsWith('#blog=') && modal().open && modalOnClose) modal().close(); });
  }

  /* ---------------- lightbox ---------------- */
  const LB = { items: [], i: 0, z: 1, x: 0, y: 0, drag: null };
  function openLightbox(items, i) {
    if (!items?.length) return;
    LB.items = items; LB.i = Math.max(0, Math.min(items.length - 1, i || 0));
    const dlg = $('#lightbox');
    if (!dlg.open) dlg.showModal();
    lbRender();
  }
  function lbRender() {
    const it = LB.items[LB.i];
    const stage = $('#lb-stage');
    LB.z = 1; LB.x = 0; LB.y = 0;
    const pdf = it.type === 'pdf';
    stage.innerHTML = pdf
      ? `<iframe class="lb-pdf" src="${esc(it.src)}" title="${esc(it.title || 'Document')}"></iframe>`
      : `<img class="lb-img" src="${esc(it.src)}" alt="${esc(it.caption || it.title || '')}" draggable="false" data-ph="${PH_IMG}">`;
    $('#lb-count').textContent = LB.items.length > 1 ? `${LB.i + 1} / ${LB.items.length}` : '';
    $('#lb-caption').textContent = it.caption || it.title || '';
    $('#lb-zoom-in').hidden = $('#lb-zoom-out').hidden = pdf;
    const dl = $('#lb-download'); dl.href = it.download || it.src; dl.setAttribute('aria-label', 'Download file');
    $('#lb-prev').hidden = $('#lb-next').hidden = LB.items.length < 2;
    if (pdf) {
      // The built-in PDF viewer grabs keyboard focus; hand it back so arrow keys and Esc keep working.
      const back = () => { const t = LB.items.length > 1 ? $('#lb-next') : $('#lb-close'); t.focus({ preventScroll: true }); };
      $('.lb-pdf').addEventListener('load', () => { back(); setTimeout(back, 250); });
    }
  }
  function lbZoom(z, reset) {
    const img = $('.lb-img'); if (!img) return;
    LB.z = Math.max(0.5, Math.min(5, z));
    if (LB.z === 1 || reset) { LB.x = 0; LB.y = 0; }
    img.style.transform = `translate(${LB.x}px, ${LB.y}px) scale(${LB.z})`;
    img.classList.toggle('zoomed', LB.z > 1);
  }
  const lbStep = (d) => { if (LB.items.length > 1) { LB.i = (LB.i + d + LB.items.length) % LB.items.length; lbRender(); } };

  (function setupLightbox() {
    const dlg = $('#lightbox'), stage = $('#lb-stage');
    $('#lb-close').addEventListener('click', () => dlg.close());
    $('#lb-prev').addEventListener('click', () => lbStep(-1));
    $('#lb-next').addEventListener('click', () => lbStep(1));
    $('#lb-zoom-in').addEventListener('click', () => lbZoom(LB.z * 1.4));
    $('#lb-zoom-out').addEventListener('click', () => lbZoom(LB.z / 1.4));
    dlg.addEventListener('close', () => { stage.innerHTML = ''; });
    dlg.addEventListener('click', (e) => { if (e.target === stage || e.target === dlg) dlg.close(); });
    document.addEventListener('keydown', (e) => {
      if (!dlg.open) return;
      if (e.key === 'ArrowLeft') lbStep(-1);
      else if (e.key === 'ArrowRight') lbStep(1);
      else if (e.key === '+' || e.key === '=') lbZoom(LB.z * 1.4);
      else if (e.key === '-') lbZoom(LB.z / 1.4);
      else if (e.key === '0') lbZoom(1, true);
    });
    stage.addEventListener('wheel', (e) => { if (!$('.lb-img')) return; e.preventDefault(); lbZoom(LB.z * (e.deltaY < 0 ? 1.15 : 1 / 1.15)); }, { passive: false });
    stage.addEventListener('dblclick', (e) => { if (e.target.classList.contains('lb-img')) lbZoom(LB.z > 1 ? 1 : 2.5, true); });
    stage.addEventListener('click', (e) => { if (e.target.classList.contains('lb-img') && !LB.moved && LB.z === 1) lbZoom(2.2); LB.moved = false; });
    stage.addEventListener('pointerdown', (e) => {
      if (!e.target.classList.contains('lb-img') || LB.z <= 1) return;
      LB.drag = { px: e.clientX, py: e.clientY, x: LB.x, y: LB.y }; e.target.setPointerCapture(e.pointerId); e.target.classList.add('dragging');
    });
    stage.addEventListener('pointermove', (e) => {
      if (!LB.drag) return;
      LB.x = LB.drag.x + (e.clientX - LB.drag.px); LB.y = LB.drag.y + (e.clientY - LB.drag.py); LB.moved = true;
      lbZoom(LB.z);
    });
    const end = (e) => { LB.drag = null; e.target.classList?.remove('dragging'); };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
    // swipe left/right on touch when not zoomed
    let sx = null;
    stage.addEventListener('touchstart', (e) => { sx = e.touches.length === 1 && LB.z === 1 ? e.touches[0].clientX : null; }, { passive: true });
    stage.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) lbStep(dx < 0 ? 1 : -1); sx = null; });
  })();

  /* ---------------- hero background: network + cursor glow ---------------- */
  function setupHeroEffects() {
    const hero = $('#home'), canvas = $('#net');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, nodes = [], pulses = [], edges = [], raf = null, visible = true, lastSpawn = 0;
    const LINK = 150;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(46, Math.max(16, (w * h) / 26000)));
      nodes = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
        r: 1.4 + Math.random() * 1.2, glow: i % 7 === 0,
      }));
      pulses = [];
      if (reduce) draw(0);
    };

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      edges = [];
      for (const n of nodes) {
        if (!reduce) { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(139,92,246,${(1 - d / LINK) * 0.3})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            edges.push([a, b]);
          }
        }
      }
      for (const n of nodes) {
        if (n.glow) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 16);
          g.addColorStop(0, 'rgba(139,92,246,.55)'); g.addColorStop(1, 'rgba(139,92,246,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, 16, 0, 7); ctx.fill();
        }
        ctx.fillStyle = n.glow ? 'rgba(196,181,253,.95)' : 'rgba(167,139,250,.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.glow ? n.r + .8 : n.r, 0, 7); ctx.fill();
      }
      if (!reduce) {
        if (t - lastSpawn > 1300 && pulses.length < 4 && edges.length) {
          const e = edges[(Math.random() * edges.length) | 0];
          pulses.push({ a: e[0], b: e[1], k: 0, s: 0.006 + Math.random() * 0.006 });
          lastSpawn = t;
        }
        pulses = pulses.filter((p) => (p.k += p.s) < 1);
        for (const p of pulses) {
          const x = p.a.x + (p.b.x - p.a.x) * p.k, y = p.a.y + (p.b.y - p.a.y) * p.k;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
          g.addColorStop(0, 'rgba(96,180,255,.95)'); g.addColorStop(1, 'rgba(59,156,255,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
        }
      }
    }

    const loop = (t) => { draw(t); raf = visible && !document.hidden ? requestAnimationFrame(loop) : null; };
    const start = () => { if (!raf && !reduce) raf = requestAnimationFrame(loop); };

    resize();
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    if (!reduce) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) start(); }, { threshold: 0 }).observe(hero);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
      start();
      if (window.matchMedia('(pointer: fine)').matches) {
        let tick = false;
        hero.addEventListener('pointermove', (e) => {
          if (tick) return; tick = true;
          requestAnimationFrame(() => { const r = hero.getBoundingClientRect(); hero.style.setProperty('--mx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--my', (e.clientY - r.top) + 'px'); tick = false; });
        });
      }
    }
  }
})();
