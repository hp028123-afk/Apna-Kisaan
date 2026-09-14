/* ================================================================
   components.js  v4  |  अपना किसान — Unified Shell
   Single source of truth for Header / Footer / Topbar across ALL pages.
   Supports both new (#akTopbar / #akHeader) and legacy
   (.main-top-nav / .nav-sec / .sion-top-footer) injection targets.
   ================================================================ */
'use strict';

(function () {
  /* Prevent double-execution */
  if (window.akComponentsLoaded) return;
  window.akComponentsLoaded = true;

  /* ─── 1. RUN ON DOM READY ─────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {

    /* ─── 2. ENSURE ASSETS ──────────────────────────────── */
    function ensureCSS(href) {
      if (document.querySelector('link[href="' + href + '"]')) return;
      if (href.indexOf('ak-design') !== -1 && document.querySelector('link[href*="ak-design"]')) return;
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = href;
      var first = document.querySelector('head link[rel="stylesheet"]');
      first ? document.head.insertBefore(l, first) : document.head.appendChild(l);
    }
    ensureCSS('assets/css/ak-design.css');
    ensureCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css');
    ensureCSS('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&family=Karla:wght@400;500;600;700&display=swap');

    /* ─── 3. DATA ────────────────────────────────────────── */
    var LOGO  = 'assets/images/ChatGPT Image Sep 8, 2026, 11_23_02 PM.png';
    var PHONE = '+91 626 507 1588';
    var EMAIL = 'hemantkachhi2002@gmail.com';

    var DISTRICTS = [
      ['\u0926\u092e\u094b\u0939','\u0938\u0947\u0935\u093e','service1.html'],
      ['\u092a\u0928\u094d\u0928\u093e','\u0938\u0947\u0935\u093e','service2.html'],
      ['\u091b\u0924\u0930\u092a\u0941\u0930','\u0938\u0947\u0935\u093e','service3.html'],
      ['\u092d\u094b\u092a\u093e\u0932','\u0930\u093e\u091c\u0927\u093e\u0928\u0940','services4.html'],
      ['\u0930\u093e\u091c\u0917\u0922\u093c','\u092e\u093e\u0932\u0935\u093e','internship.html'],
      ['\u0938\u093e\u0917\u0930','\u0938\u0947\u0935\u093e','service5.html'],
      ['\u0928\u0930\u0938\u093f\u0902\u0939\u092a\u0941\u0930','\u092e\u0939\u093e\u0915\u094c\u0936\u0932','service6.html'],
      ['\u091c\u092c\u0932\u092a\u0941\u0930','\u092e\u0939\u093e\u0915\u094c\u0936\u0932','service7.html'],
      ['\u0917\u094d\u0935\u093e\u0932\u093f\u092f\u0930','\u091a\u0902\u092c\u0932','service8.html'],
      ['\u092c\u093e\u0932\u093e\u0918\u093e\u091f','\u092e\u0939\u093e\u0915\u094c\u0936\u0932','service9.html'],
      ['\u0930\u0940\u0935\u093e','\u0935\u093f\u0902\u0927\u094d\u092f','service10.html'],
      ['\u091f\u0940\u0915\u092e\u0917\u0922\u093c','\u0935\u093f\u0902\u0927\u094d\u092f','service11.html']
    ];

    /* ─── 4. BUILD HTML ──────────────────────────────────── */

    /* Top bar */
    var TOPBAR_HTML = '<div class="ak-topbar" role="banner">'
      + '<div class="ak-shell ak-topbar-inner">'
      + '<a href="tel:+916265071588"><i class="fa-solid fa-phone"></i> ' + PHONE + '</a>'
      + '<a href="mailto:' + EMAIL + '"><i class="fa-solid fa-envelope"></i> ' + EMAIL + '</a>'
      + '<span class="ak-topbar-note"><i class="fa-solid fa-seedling"></i> \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0915\u0947 \u0938\u093e\u0925, \u0939\u0930 \u092e\u094c\u0938\u092e \u092e\u0947\u0902</span>'
      + '</div></div>';

    /* District links for dropdown */
    var distItems = DISTRICTS.map(function (d) {
      return '<a href="' + d[2] + '" role="menuitem">'
        + '<i class="fa-solid fa-location-dot"></i>'
        + '<span class="ak-dd-label">' + d[0] + '</span>'
        + '<small class="ak-dd-sub">' + d[1] + '</small>'
        + '</a>';
    }).join('');

    /* Header */
    var HEADER_HTML = '<header class="ak-header" id="akSharedHeader">'
      + '<nav class="ak-shell ak-nav" aria-label="\u092e\u0941\u0916\u094d\u092f \u0928\u0947\u0935\u093f\u0917\u0947\u0936\u0928">'

      /* Logo */
      + '<a class="ak-brand" href="home.html" aria-label="\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928">'
      + '<img src="' + LOGO + '" alt="\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928 \u0932\u094b\u0917\u094b" width="52" height="52"/>'
      + '<span><strong>\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928</strong>'
      + '<small>\u0917\u094d\u0930\u093e\u092e\u0940\u0923 \u0938\u092c\u094d\u091c\u0940 \u2014 \u0936\u0939\u0930\u0940 \u0935\u093f\u0924\u0930\u0923</small></span>'
      + '</a>'

      /* Hamburger */
      + '<button class="ak-toggler" id="akNavToggle" type="button"'
      + ' aria-label="\u092e\u0947\u0928\u0942 \u0916\u094b\u0932\u0947\u0902" aria-expanded="false" aria-controls="akNavMenu">'
      + '<span class="ak-ham"><span></span><span></span><span></span></span>'
      + '</button>'

      /* Links */
      + '<ul class="ak-links" id="akNavMenu" role="menubar">'

      + '<li role="none"><a class="nav-link" href="home.html">\u0939\u094b\u092e</a></li>'
      + '<li role="none"><a class="nav-link" href="about.html">\u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902</a></li>'

      /* सेवाएं dropdown */
      + '<li class="ak-dd-wrap" role="none">'
      + '<a class="nav-link ak-dd-btn" href="service.html" aria-haspopup="true" aria-expanded="false">'
      + '\u0938\u0947\u0935\u093e\u090f\u0902 <i class="fa-solid fa-chevron-down"></i></a>'
      + '<div class="ak-dd-menu ak-dd-districts" role="menu">'
      + '<div class="ak-dd-title"><i class="fa-solid fa-map-location-dot"></i> \u091c\u093f\u0932\u093e \u091a\u0941\u0928\u0947\u0902</div>'
      + distItems
      + '</div></li>'

      /* मंडी भाव dropdown */
      + '<li class="ak-dd-wrap" role="none">'
      + '<a class="nav-link ak-dd-btn" href="mandi-bhav.html" aria-haspopup="true" aria-expanded="false">'
      + '\u092e\u0902\u0921\u0940 \u092d\u093e\u0935 <i class="fa-solid fa-chevron-down"></i></a>'
      + '<div class="ak-dd-menu" role="menu">'
      + '<a href="mandi-bhav.html" role="menuitem"><i class="fa-solid fa-store"></i> \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935</a>'
      + '<a href="vegetable-price.html" role="menuitem"><i class="fa-solid fa-leaf"></i> \u0938\u092c\u094d\u091c\u0940 \u092d\u093e\u0935</a>'
      + '<a href="crop-price.html" role="menuitem"><i class="fa-solid fa-wheat-awn"></i> \u092b\u0938\u0932 \u092d\u093e\u0935</a>'
      + '</div></li>'

      + '<li role="none"><a class="nav-link" href="transport.html">\u092a\u0930\u093f\u0935\u0939\u0928</a></li>'
      + '<li role="none"><a class="nav-link" href="payment.html">\u092d\u0941\u0917\u0924\u093e\u0928 \u0938\u094d\u0925\u093f\u0924\u093f</a></li>'
      + '<li role="none"><a class="nav-link" href="farmer-connect.html">\u0915\u093f\u0938\u093e\u0928 \u0938\u0902\u092a\u0930\u094d\u0915</a></li>'

      /* CTA */
      + '<li role="none"><a class="ak-nav-cta" href="farmer-connect.html">'
      + '\u0906\u091c \u0939\u0940 \u0936\u0941\u0930\u0941\u0906\u0924 \u0915\u0930\u0947\u0902 <i class="fa-solid fa-arrow-right"></i>'
      + '</a></li>'

      + '</ul></nav></header>';

    /* Footer */
    var FOOTER_HTML = '<footer class="ak-footer" role="contentinfo">'
      + '<div class="ak-shell"><div class="ak-footer-grid">'

      /* Brand */
      + '<div class="ak-footer-brand">'
      + '<img src="' + LOGO + '" alt="\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928 \u0932\u094b\u0917\u094b"/>'
      + '<strong>\u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936 \u0915\u093e \u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928</strong>'
      + '<small>\u0906\u092a\u0915\u0940 \u092b\u0938\u0932, \u0906\u092a\u0915\u093e \u0938\u0939\u0940 \u092c\u093e\u091c\u093e\u0930\u0964</small>'
      + '<p>\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928 \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0915\u094b \u0938\u092c\u094d\u091c\u0940 \u092c\u093e\u091c\u093e\u0930 \u0915\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940, \u092d\u0930\u094b\u0938\u0947\u092e\u0902\u0926 \u092a\u0930\u093f\u0935\u0939\u0928 \u0914\u0930 \u0938\u092e\u092f \u092a\u0930 \u092d\u0941\u0917\u0924\u093e\u0928 \u0938\u0947 \u091c\u094b\u0921\u093c\u0928\u0947 \u0915\u093e \u092a\u094d\u0930\u092f\u093e\u0938 \u0939\u0948\u0964</p>'
      + '<div class="ak-footer-social">'
      + '<a href="https://wa.me/916265071588" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>'
      + '<a href="tel:+916265071588" aria-label="\u092b\u094b\u0928 \u0915\u0930\u0947\u0902"><i class="fa-solid fa-phone"></i></a>'
      + '<a href="mailto:' + EMAIL + '" aria-label="\u0908\u092e\u0947\u0932 \u0915\u0930\u0947\u0902"><i class="fa-solid fa-envelope"></i></a>'
      + '</div></div>'

      /* Services col */
      + '<div class="ak-footer-col"><h4>\u0915\u093f\u0938\u093e\u0928 \u0938\u0947\u0935\u093e\u090f\u0902</h4>'
      + '<a href="mandi-bhav.html"><i class="fa-solid fa-store"></i> \u092c\u093e\u091c\u093e\u0930 \u0915\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940</a>'
      + '<a href="transport.html"><i class="fa-solid fa-truck-moving"></i> \u092d\u0930\u094b\u0938\u0947\u092e\u0902\u0926 \u092a\u0930\u093f\u0935\u0939\u0928</a>'
      + '<a href="payment.html"><i class="fa-solid fa-credit-card"></i> \u0938\u092e\u092f \u092a\u0930 \u092d\u0941\u0917\u0924\u093e\u0928</a>'
      + '<a href="farmer-connect.html"><i class="fa-solid fa-users"></i> \u0915\u093f\u0938\u093e\u0928 \u0915\u0928\u0947\u0915\u094d\u091f\u093f\u0935\u093f\u091f\u0940</a>'
      + '<a href="vegetable-price.html"><i class="fa-solid fa-leaf"></i> \u0938\u092c\u094d\u091c\u0940 \u092d\u093e\u0935</a>'
      + '<a href="crop-price.html"><i class="fa-solid fa-wheat-awn"></i> \u092b\u0938\u0932 \u092d\u093e\u0935</a>'
      + '</div>'

      /* Quick links col */
      + '<div class="ak-footer-col"><h4>\u0909\u092a\u092f\u094b\u0917\u0940 \u0932\u093f\u0902\u0915</h4>'
      + '<a href="home.html"><i class="fa-solid fa-house"></i> \u0939\u094b\u092e</a>'
      + '<a href="about.html"><i class="fa-solid fa-circle-info"></i> \u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902</a>'
      + '<a href="service.html"><i class="fa-solid fa-shop"></i> \u0938\u0947\u0935\u093e\u090f\u0902</a>'
      + '<a href="information.html"><i class="fa-solid fa-book-open"></i> \u0915\u0943\u0937\u093f \u091c\u093e\u0928\u0915\u093e\u0930\u0940</a>'
      + '<a href="privacy.html"><i class="fa-solid fa-shield"></i> \u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f</a>'
      + '<a href="term.html"><i class="fa-solid fa-file-lines"></i> \u0928\u093f\u092f\u092e \u090f\u0935\u0902 \u0936\u0930\u094d\u0924\u0947\u0902</a>'
      + '</div>'

      /* Contact col */
      + '<div class="ak-footer-col ak-footer-contact"><h4>\u0915\u093f\u0938\u093e\u0928 \u0938\u0939\u093e\u092f\u0924\u093e</h4>'
      + '<a href="tel:+916265071588"><i class="fa-solid fa-phone"></i> ' + PHONE + '</a>'
      + '<a href="https://wa.me/916265071588" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp \u0915\u0930\u0947\u0902</a>'
      + '<a href="mailto:' + EMAIL + '"><i class="fa-solid fa-envelope"></i> ' + EMAIL + '</a>'
      + '<span><i class="fa-solid fa-location-dot"></i> \u0907\u0902\u0926\u094c\u0930, \u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936</span>'
      + '<span class="ak-footer-hours"><i class="fa-solid fa-clock"></i> \u0938\u094b\u092e\u2013\u0930\u0935\u093f | \u0938\u0941\u092c\u0939 8 \u2014 \u0936\u093e\u092e 8</span>'
      + '</div>'

      + '</div>'/* footer-grid end */

      /* Footer bottom */
      + '<div class="ak-footer-bottom">'
      + '<span>\u00A9 2026 \u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928. \u0938\u092d\u0940 \u0905\u0927\u093f\u0915\u093e\u0930 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924\u0964</span>'
      + '<div class="ak-footer-legal">'
      + '<a href="privacy.html">\u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f</a>'
      + '<a href="term.html">\u0928\u093f\u092f\u092e \u090f\u0935\u0902 \u0936\u0930\u094d\u0924\u0947\u0902</a>'
      + '</div></div>'
      + '</div></footer>';

    /* Float buttons */
    var FLOAT_HTML = '<div class="ak-float-actions" aria-label="\u0924\u094d\u0935\u0930\u093f\u0924 \u0938\u0902\u092a\u0930\u094d\u0915">'
      + '<a class="ak-float-btn ak-float-phone" href="tel:+916265071588" aria-label="\u092b\u094b\u0928"><i class="fa-solid fa-phone"></i></a>'
      + '<a class="ak-float-btn ak-float-whatsapp" href="https://wa.me/916265071588" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>'
      + '</div>';

    var BTT_HTML = '<button id="akBackToTop" class="ak-back-to-top" aria-label="\u0789\u06AB\u0642\u09be \u0915\u0947 \u0913\u092a\u0930">'
      + '<i class="fa-solid fa-chevron-up"></i></button>';

    /* ─── 5. INJECT ──────────────────────────────────────── */
    function injectOrReplace(selector, newHTML) {
      var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) return false;
      var wrap = document.createElement('div');
      wrap.innerHTML = newHTML;
      var parent = el.parentNode;
      while (wrap.firstChild) parent.insertBefore(wrap.firstChild, el);
      parent.removeChild(el);
      return true;
    }
    function appendToBody(html) {
      var d = document.createElement('div');
      d.innerHTML = html;
      while (d.firstChild) document.body.appendChild(d.firstChild);
    }

    /* Topbar */
    injectOrReplace('.main-top-nav', TOPBAR_HTML) ||
    injectOrReplace('#akTopbar', TOPBAR_HTML);

    /* Header */
    if (!injectOrReplace('.nav-sec', HEADER_HTML)) {
      if (!injectOrReplace('#akHeader', HEADER_HTML)) {
        if (!document.getElementById('akSharedHeader')) {
          var hd = document.createElement('div');
          hd.innerHTML = HEADER_HTML;
          document.body.insertBefore(hd.firstElementChild, document.body.firstChild);
        }
      }
    }

    /* Footer */
    if (!injectOrReplace('.sion-top-footer', FOOTER_HTML)) {
      injectOrReplace('#akFooter', FOOTER_HTML);
    }
    /* Remove legacy second footer */
    var legacyB = document.querySelector('.sion-bottom-footer');
    if (legacyB) legacyB.parentNode.removeChild(legacyB);

    /* Float actions */
    if (!document.querySelector('.ak-float-actions')) {
      var floatTarget = document.getElementById('akFloatActions');
      floatTarget ? injectOrReplace('#akFloatActions', FLOAT_HTML) : appendToBody(FLOAT_HTML);
    }
    /* Remove old float */
    var oldFloat = document.querySelector('.nav-icon-whatapp');
    if (oldFloat) oldFloat.parentNode.removeChild(oldFloat);

    /* Back-to-top */
    if (!document.getElementById('akBackToTop')) appendToBody(BTT_HTML);

    /* ─── 6. INTERACTIONS ────────────────────────────────── */

    /* Mobile nav toggle */
    var toggle  = document.getElementById('akNavToggle');
    var navMenu = document.getElementById('akNavMenu');

    if (toggle && navMenu) {
      toggle.addEventListener('click', function () {
        var open = navMenu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        /* Animate hamburger → X */
        toggle.classList.toggle('is-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });

      /* Dropdown accordion on mobile */
      navMenu.querySelectorAll('.ak-dd-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          if (window.innerWidth >= 992) return;
          e.preventDefault();
          var dd = this.closest('.ak-dd-wrap');
          var wasOpen = dd.classList.contains('is-open');
          navMenu.querySelectorAll('.ak-dd-wrap.is-open').forEach(function (d) {
            d.classList.remove('is-open');
            d.querySelector('.ak-dd-btn').setAttribute('aria-expanded', 'false');
          });
          if (!wasOpen) {
            dd.classList.add('is-open');
            this.setAttribute('aria-expanded', 'true');
          }
        });
      });

      /* Outside click closes nav */
      document.addEventListener('click', function (e) {
        if (e.target.closest('#akNavMenu') || e.target.closest('#akNavToggle')) return;
        navMenu.classList.remove('open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navMenu.querySelectorAll('.ak-dd-wrap.is-open').forEach(function (d) {
          d.classList.remove('is-open');
          var b = d.querySelector('.ak-dd-btn');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      });

      /* Close on link tap */
      navMenu.querySelectorAll('a:not(.ak-dd-btn)').forEach(function (a) {
        a.addEventListener('click', function () {
          navMenu.classList.remove('open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      /* ESC key */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          toggle.focus();
        }
      });
    }

    /* Scroll shadow on header */
    var hdrEl = document.getElementById('akSharedHeader');
    if (hdrEl) {
      function onScroll() {
        hdrEl.classList.toggle('ak-scrolled', window.scrollY > 4);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Back-to-top */
    var btt = document.getElementById('akBackToTop');
    if (btt) {
      window.addEventListener('scroll', function () {
        btt.classList.toggle('visible', window.scrollY > 280);
      }, { passive: true });
      btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* Active nav highlight */
    var curPage = (window.location.pathname.split('/').pop() || 'home.html').split('?')[0];
    document.querySelectorAll('#akNavMenu .nav-link').forEach(function (lnk) {
      if (lnk.getAttribute('href') === curPage) lnk.classList.add('active');
    });
    document.querySelectorAll('#akNavMenu .ak-dd-wrap').forEach(function (dd) {
      if (dd.querySelector('.ak-dd-menu a[href="' + curPage + '"]')) {
        var b = dd.querySelector('.ak-dd-btn');
        if (b) b.classList.add('active');
      }
    });

    /* ─── 7. SHARED PAGE UTILITIES ───────────────────────── */

    /* FAQ accordion */
    document.querySelectorAll('.ak-faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.closest('.ak-faq-item');
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.ak-faq-item.open').forEach(function (i) { i.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });

    /* Counter animation */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = Number(el.dataset.count);
      if (!Number.isFinite(target)) return;
      var s = performance.now();
      (function tick(now) {
        var p = Math.min((now - s) / 1400, 1);
        el.textContent = Math.floor(p * target) + (p >= 1 ? '+' : '');
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    });

    /* Fix legacy herf typo */
    document.querySelectorAll('a[herf]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('herf'));
      a.removeAttribute('herf');
    });

    /* Replace Lorem ipsum */
    document.querySelectorAll('p,h1,h2,h3,h4').forEach(function (el) {
      if (el.textContent.trim().startsWith('Lorem ipsum'))
        el.textContent = '\u092f\u0939 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0914\u0930 \u0938\u092c\u094d\u091c\u0940 \u092c\u093e\u091c\u093e\u0930 \u0938\u0947 \u091c\u0941\u0921\u093c\u0947 \u0909\u092a\u092f\u094b\u0917\u0940 \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0928 \u0915\u0947 \u0932\u093f\u090f \u0939\u0948\u0964';
    });

    /* Contact form */
    var form = document.getElementById('akContactForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;
        form.querySelectorAll('[required]').forEach(function (f) {
          var errEl = f.closest('.ak-field') && f.closest('.ak-field').querySelector('.ak-field-error');
          if (!f.value.trim()) {
            f.classList.add('ak-input-error');
            if (errEl) errEl.classList.add('visible');
            valid = false;
          } else {
            f.classList.remove('ak-input-error');
            if (errEl) errEl.classList.remove('visible');
          }
        });
        if (!valid) return;
        var btn = form.querySelector('.ak-submit-btn, [type="submit"]');
        var suc = document.getElementById('akFormSuccess');
        if (btn) { btn.disabled = true; btn.textContent = '\u092d\u0947\u091c\u093e \u091c\u093e \u0930\u0939\u093e \u0939\u0948\u2026'; }
        setTimeout(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> \u0938\u0902\u0926\u0947\u0936 \u092d\u0947\u091c\u0947\u0902'; }
          form.reset();
          if (suc) { suc.classList.add('visible'); setTimeout(function () { suc.classList.remove('visible'); }, 5000); }
        }, 1200);
      });
    }

    /* District search (home page) */
    var dSearch = document.getElementById('districtSearch');
    if (dSearch) {
      dSearch.addEventListener('input', function () {
        var q = this.value.trim().toLowerCase();
        var vis = 0;
        document.querySelectorAll('#districtGrid a').forEach(function (a) {
          var match = a.textContent.toLowerCase().includes(q);
          a.hidden = !match;
          if (match) vis++;
        });
        var empty = document.getElementById('districtEmpty');
        if (empty) empty.hidden = vis !== 0;
      });
    }

    /* Owl carousel */
    if (window.jQuery && jQuery.fn.owlCarousel && document.querySelector('#carousel')) {
      jQuery('#carousel').owlCarousel({
        autoplay: true, rewind: true, margin: 20,
        autoplayTimeout: 7000, smartSpeed: 800, nav: true,
        responsive: { 0:{items:1}, 600:{items:1}, 1024:{items:3} }
      });
    }

    /* AOS */
    if (window.AOS) AOS.init({ duration: 700, once: true, offset: 40 });

  }); /* end ready */

})();
