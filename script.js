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

  // Duyurular, ayrı bir dosyadaki bilgilerden oluşturulur.
  const announcementsList = document.querySelector('#announcements-list');
  const announcements = Array.isArray(window.SUNSET_DUYURULAR) ? window.SUNSET_DUYURULAR : [];
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const safeAsset = value => /^assets\/[a-z0-9_./-]+\.(?:jpe?g|png|webp|svg)$/i.test(String(value)) ? value : '';
  const safeVideo = value => /^assets\/[a-z0-9_./-]+\.mp4$/i.test(String(value)) ? value : '';
  const instagramUrl = 'https://www.instagram.com/sunsetsanatatolyesi/';

  if (announcementsList) {
    const validAnnouncements = announcements.filter(item => item && item.baslik && ((Array.isArray(item.gorseller) && item.gorseller.some(image => image && safeAsset(image.dosya))) || safeVideo(item.video)));
    if (!validAnnouncements.length) {
      announcementsList.innerHTML = '<p class="announcements-empty">Yakında yeni etkinliklerimizi burada paylaşacağız. Güncel program için Instagram üzerinden bize ulaşabilirsiniz.</p>';
    } else {
      announcementsList.innerHTML = validAnnouncements.map((item, index) => {
        const images = (item.gorseller || []).filter(image => image && safeAsset(image.dosya));
        const first = images[0];
        const video = safeVideo(item.video);
        const endDate = item.tarihISO && /^\d{4}-\d{2}-\d{2}$/.test(item.tarihISO)
          ? new Date(`${item.tarihISO}T${/^\d{2}:\d{2}$/.test(item.bitisSaati) ? item.bitisSaati : '23:59'}:00+03:00`)
          : null;
        const isPast = item.durum === 'gerceklesen' || (endDate && !Number.isNaN(endDate.getTime()) && endDate < new Date());
        const points = Array.isArray(item.icerik) ? item.icerik : [];
        const reservation = typeof item.rezervasyon === 'string' && item.rezervasyon.startsWith('https://www.instagram.com/') ? item.rezervasyon : instagramUrl;
        return `<article class="announcement-card" aria-labelledby="announcement-${index}-title">
          <div class="announcement-gallery">
            ${video ? `<video class="announcement-video" controls playsinline preload="none" data-video="${escapeHTML(video)}" aria-label="${escapeHTML(item.baslik)} etkinlik videosu">Tarayıcınız video oynatmayı desteklemiyor.</video>` : `<button class="announcement-cover" type="button" data-lightbox="${escapeHTML(first.dosya)}" data-caption="${escapeHTML(first.aciklama || item.baslik)}" aria-label="Afişi büyüt: ${escapeHTML(first.aciklama || item.baslik)}">
              <img src="${escapeHTML(first.dosya)}" alt="${escapeHTML(first.aciklama || item.baslik)}" loading="lazy" width="1122" height="1402">
              <span class="announcement-zoom" aria-hidden="true">↗</span>
            </button>`}
            ${images.length > 1 ? `<div class="announcement-thumbnails" role="group" aria-label="Etkinlik afişleri">
              ${images.map((image, i) => `<button class="announcement-thumb" type="button" data-poster="${escapeHTML(image.dosya)}" data-description="${escapeHTML(image.aciklama || item.baslik)}" aria-label="${i + 1}. afişi göster" aria-pressed="${i === 0}"><img src="${escapeHTML(image.dosya)}" alt="" loading="lazy" width="130" height="160"></button>`).join('')}
            </div>` : ''}
          </div>
          <div class="announcement-info">
            <p class="announcement-kicker">${escapeHTML(item.tur || 'SUNSET SANAT ETKİNLİĞİ')}</p>
            <h3 id="announcement-${index}-title">${escapeHTML(item.baslik)}</h3>
            <span class="announcement-badge${isPast ? ' is-past' : ''}">${isPast ? '✳ GERÇEKLEŞEN ETKİNLİK' : '✳ YAKLAŞAN ETKİNLİK'}</span>
            ${item.tarih || item.saat || item.yer || item.kontenjan ? `<div class="announcement-meta">
              ${item.tarih ? `<div><span class="meta-label">TARİH</span><strong>${escapeHTML(item.tarih)}</strong></div>` : ''}
              ${item.saat ? `<div><span class="meta-label">SAAT</span><strong>${escapeHTML(item.saat)}</strong></div>` : ''}
              ${item.yer ? `<div><span class="meta-label">YER</span><strong>${escapeHTML(item.yer)}</strong></div>` : ''}
              ${item.kontenjan ? `<div><span class="meta-label">KONTENJAN</span><strong>${escapeHTML(item.kontenjan)}</strong></div>` : ''}
            </div>` : ''}
            ${item.spot ? `<p class="announcement-spot">${escapeHTML(item.spot)}</p>` : ''}
            <p class="announcement-description">${escapeHTML(item.aciklama)}</p>
            ${points.length ? `<ul class="announcement-points">${points.map(point => `<li>${escapeHTML(point)}</li>`).join('')}</ul>` : ''}
            <div class="announcement-actions">
              <a class="button button-dark" href="${escapeHTML(reservation)}" target="_blank" rel="noopener noreferrer">${isPast ? 'Yeni Etkinlikleri Sor' : 'Rezervasyon Yap'} <span aria-hidden="true">↗</span></a>
              <span class="announcement-actions-note">${isPast ? 'Yeni workshoplar için bize DM gönderin.' : 'Bilgi ve kayıt için Instagram’dan DM gönderin.'}</span>
            </div>
          </div>
        </article>`;
      }).join('');

      announcementsList.querySelectorAll('.announcement-gallery').forEach(gallery => {
        const cover = gallery.querySelector('.announcement-cover');
        const coverImage = cover?.querySelector('img');
        gallery.querySelectorAll('.announcement-thumb').forEach(thumbnail => thumbnail.addEventListener('click', () => {
          if (!cover || !coverImage) return;
          const src = thumbnail.dataset.poster;
          const description = thumbnail.dataset.description;
          coverImage.src = src;
          coverImage.alt = description;
          cover.dataset.lightbox = src;
          cover.dataset.caption = description;
          cover.setAttribute('aria-label', `Afişi büyüt: ${description}`);
          gallery.querySelectorAll('.announcement-thumb').forEach(other => other.setAttribute('aria-pressed', String(other === thumbnail)));
        }));
      });
      // GitHub Pages üzerinde orijinal MP4, kalite kaybı olmadan küçük statik
      // parçalardan tek oynatılabilir dosya olarak birleştirilir.
      announcementsList.querySelectorAll('video[data-video]').forEach(video => {
        const parts = Array.from({ length: 6 }, (_, i) => `assets/seramik-etkinligi.part0${i + 1}`);
        Promise.all(parts.map(async path => {
          const response = await fetch(path);
          if (!response.ok) throw new Error('Video parçası yüklenemedi');
          return response.arrayBuffer();
        })).then(buffers => {
          const url = URL.createObjectURL(new Blob(buffers, { type: 'video/mp4' }));
          video.src = url;
          video.load();
          window.addEventListener('pagehide', () => URL.revokeObjectURL(url), { once: true });
        }).catch(() => {
          video.insertAdjacentHTML('afterend', '<p class="announcement-video-error">Video şu anda yüklenemiyor. Lütfen sayfayı yenileyin.</p>');
        });
      });
    }
  }

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
