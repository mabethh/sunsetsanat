(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  function closeMenu() { if (!menuButton) return; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Menüyü aç'); nav.classList.remove('is-open'); document.body.classList.remove('menu-open'); }
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const next = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(next));
      menuButton.setAttribute('aria-label', next ? 'Menüyü kapat' : 'Menüyü aç');
      nav.classList.toggle('is-open', next);
      document.body.classList.toggle('menu-open', next);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
  }

  const filterButtons = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.course-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const value = button.dataset.filter;
    filterButtons.forEach(el => { const active = el === button; el.classList.toggle('active',active); el.setAttribute('aria-pressed', String(active)); });
    cards.forEach(card => { card.hidden = value !== 'all' && card.dataset.category !== value; });
  }));

  document.querySelectorAll('.faq-list details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-list details').forEach(other => { if (other !== item) other.open = false; });
    });
  });

  const lightbox = document.querySelector('#lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('p');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  let previousFocus;
  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    document.body.classList.remove('lightbox-open');
    previousFocus?.focus?.();
  }
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    previousFocus = document.activeElement;
    lightboxImg.src = button.querySelector('img')?.src || button.dataset.lightbox;
    lightboxImg.alt = button.querySelector('img')?.alt || 'Atölye fotoğrafı';
    lightboxCaption.textContent = button.dataset.caption || '';
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  }));
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  document.querySelector('#year').textContent = String(new Date().getFullYear());
})();
