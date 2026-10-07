/* ==================================================================
   abby GROUP — site interactions
   - sticky header state
   - mobile nav
   - reveal on scroll
   - page transition overlay
   - contact form submit (POST /api/contact)
   ================================================================== */
(function () {
  'use strict';

  var doc = document;
  var header = doc.getElementById('site-header');
  var hero = doc.getElementById('hero'); // 2枚目（ダーク）のヒーロー

  /* ---------------------------------------------------------------- *
     Header: ファーストビュー（ブランドイエロー）→ ダークヒーロー → 通常
     ・イエロー背景の上  : 既定（黒テキスト・透過）
     ・ダーク背景の上    : is-over-dark（白テキスト）
     ・ダークを過ぎたら  : is-solid（白背景に固定）
   * ---------------------------------------------------------------- */
  function updateHeader() {
    if (!header) return;
    var h = header.offsetHeight || 64;

    if (hero) {
      var rect = hero.getBoundingClientRect();
      var overDark = rect.top <= h && rect.bottom > h;
      header.classList.toggle('is-over-dark', overDark);
      header.classList.toggle('is-solid', rect.bottom <= h);
    } else {
      header.classList.remove('is-over-dark');
      header.classList.toggle('is-solid', window.scrollY > 60);
    }
  }

  var ticking = false;
  window.addEventListener(
    'scroll',
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateHeader();
        ticking = false;
      });
    },
    { passive: true }
  );
  updateHeader();

  /* ---------------------------------------------------------------- *
     Mobile nav
   * ---------------------------------------------------------------- */
  var toggle = doc.getElementById('nav-toggle');
  var mobileNav = doc.getElementById('mobile-nav');

  function closeMenu() {
    if (!header || !toggle) return;
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
  }

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    if (mobileNav) {
      mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  /* ---------------------------------------------------------------- *
     Reveal on scroll
   * ---------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  /* ---------------------------------------------------------------- *
     Smooth scroll for same-page anchors (respect reduced motion)
   * ---------------------------------------------------------------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  doc.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href*="#"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;

    var hashIndex = href.indexOf('#');
    var path = href.slice(0, hashIndex);
    var hash = href.slice(hashIndex + 1);
    if (!hash) return;

    // Only handle same-page anchors (empty path or current path)
    var current = window.location.pathname;
    if (path !== '' && path !== current && path !== current + '/') return;

    var target = doc.getElementById(hash);
    if (!target) return;

    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });

    if (history.replaceState) {
      history.replaceState(null, '', href);
    }
    closeMenu();
  });

  /* ---------------------------------------------------------------- *
     Page transition overlay (internal links only)
   * ---------------------------------------------------------------- */
  var overlay = doc.getElementById('pt-overlay');
  if (overlay && !reduce) {
    doc.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a');
      if (!link) return;
      if (link.target === '_blank') return;
      if (link.hasAttribute('download')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      var href = link.getAttribute('href');
      if (!href) return;
      if (href.indexOf('http') === 0 || href.indexOf('//') === 0) return;
      if (href.indexOf('#') === 0) return;
      if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;

      // same-page anchor (with path prefix) already handled above
      if (href.indexOf('#') > -1) return;

      e.preventDefault();
      overlay.classList.add('is-on');
      window.setTimeout(function () {
        window.location.href = href;
      }, 420);
    });

    window.addEventListener('pageshow', function () {
      overlay.classList.remove('is-on');
    });
  }

  /* ---------------------------------------------------------------- *
     Contact form
   * ---------------------------------------------------------------- */
  var form = doc.getElementById('contact-form');
  if (form) {
    var status = doc.getElementById('form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!status) return;

      var data = {
        type: (form.elements['type'] || {}).value || '',
        company: (form.elements['company'] || {}).value || '',
        name: (form.elements['name'] || {}).value || '',
        email: (form.elements['email'] || {}).value || '',
        message: (form.elements['message'] || {}).value || '',
      };

      if (!data.type || !data.name || !data.email || !data.message) {
        status.textContent = '必須項目をすべて入力してください。';
        status.className = 'form-status is-error';
        return;
      }

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      if (!emailOk) {
        status.textContent = 'メールアドレスの形式が正しくありません。';
        status.className = 'form-status is-error';
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      status.textContent = '送信しています…';
      status.className = 'form-status';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().then(function (body) {
            return { ok: res.ok, body: body };
          });
        })
        .then(function (result) {
          if (result.ok && result.body && result.body.success) {
            form.reset();
            status.textContent = '送信が完了しました。ありがとうございました。';
            status.className = 'form-status is-ok';
          } else {
            status.textContent =
              (result.body && result.body.message) || '送信に失敗しました。時間をおいて再度お試しください。';
            status.className = 'form-status is-error';
          }
        })
        .catch(function () {
          status.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
          status.className = 'form-status is-error';
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
