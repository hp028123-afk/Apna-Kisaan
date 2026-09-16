/* ================================================================
   components.js  v5  |  अपना किसान — Unified Shell
   Header / Topbar / Nav / Footer / Float Buttons
   ================================================================ */
'use strict';

(function () {
  if (window.akComponentsLoaded) return;
  window.akComponentsLoaded = true;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ── Ensure CSS/Fonts ──────────────────────────────── */
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

    /* ── Constants ─────────────────────────────────────── */
    /* Circular branded logo — used in nav + footer */
    var LOGO  = 'assets/images/\u0905\u092a\u0928\u093e.\u0915\u093f\u0938\u093e\u0928.png';
    var PHONE = '+91 626 507 1588';
    var EMAIL = 'hemantkachhi2002@gmail.com';

    /* All 55 MP districts */
    var DISTRICTS = [
      ['\u0906\u0917\u0930 \u092e\u093e\u0932\u0935\u093e','service.html'],
      ['\u0905\u0932\u0940\u0930\u093e\u091c\u092a\u0941\u0930','service.html'],
      ['\u0905\u0928\u0942\u092a\u092a\u0941\u0930','service.html'],
      ['\u0905\u0936\u094b\u0915\u0928\u0917\u0930','service.html'],
      ['\u092c\u093e\u0932\u093e\u0918\u093e\u091f','service9.html'],
      ['\u092c\u0921\u093c\u0935\u093e\u0928\u0940','service.html'],
      ['\u092c\u0948\u0924\u0942\u0932','service.html'],
      ['\u092d\u093f\u0902\u0921','service.html'],
      ['\u092d\u094b\u092a\u093e\u0932','services4.html'],
      ['\u092c\u0941\u0930\u0939\u093e\u0928\u092a\u0941\u0930','service.html'],
      ['\u091b\u0924\u0930\u092a\u0941\u0930','service3.html'],
      ['\u091b\u093f\u0902\u0926\u0935\u093e\u0921\u093c\u093e','service.html'],
      ['\u0926\u092e\u094b\u0939','service1.html'],
      ['\u0926\u0924\u093f\u092f\u093e','service.html'],
      ['\u0926\u0947\u0935\u093e\u0938','service.html'],
      ['\u0927\u093e\u0930','service.html'],
      ['\u0921\u093f\u0902\u0921\u094c\u0930\u0940','service.html'],
      ['\u0917\u0941\u0928\u093e','service.html'],
      ['\u0917\u094d\u0935\u093e\u0932\u093f\u092f\u0930','service8.html'],
      ['\u0939\u0930\u0926\u093e','service.html'],
      ['\u0907\u0902\u0926\u094c\u0930','service.html'],
      ['\u091c\u092c\u0932\u092a\u0941\u0930','service7.html'],
      ['\u091d\u093e\u092c\u0941\u0906','service.html'],
      ['\u0915\u091f\u0928\u0940','service.html'],
      ['\u0916\u0902\u0921\u0935\u093e','service.html'],
      ['\u0916\u0930\u0917\u094b\u0928','service.html'],
      ['\u092e\u0948\u0939\u0930','service.html'],
      ['\u092e\u0902\u0921\u0932\u093e','service.html'],
      ['\u092e\u0902\u0926\u0938\u094c\u0930','service.html'],
      ['\u092e\u090a\u0917\u0902\u091c','service.html'],
      ['\u092e\u0941\u0930\u0948\u0928\u093e','service.html'],
      ['\u0928\u0930\u094d\u092e\u0926\u093e\u092a\u0941\u0930\u092e','service.html'],
      ['\u0928\u0930\u0938\u093f\u0902\u0939\u092a\u0941\u0930','service6.html'],
      ['\u0928\u0940\u092e\u091a','service.html'],
      ['\u0928\u093f\u0935\u093e\u0921\u093c\u0940','service.html'],
      ['\u092a\u093e\u0902\u0922\u0941\u0930\u094d\u0923\u093e','service.html'],
      ['\u092a\u0928\u094d\u0928\u093e','service2.html'],
      ['\u0930\u093e\u092f\u0938\u0947\u0928','service.html'],
      ['\u0930\u093e\u091c\u0917\u0922\u093c','internship.html'],
      ['\u0930\u0924\u0932\u093e\u092e','service.html'],
      ['\u0930\u0940\u0935\u093e','service10.html'],
      ['\u0938\u093e\u0917\u0930','service5.html'],
      ['\u0938\u0924\u0928\u093e','service.html'],
      ['\u0938\u0940\u0939\u094b\u0930','service.html'],
      ['\u0938\u093f\u0935\u0928\u0940','service.html'],
      ['\u0936\u0939\u0921\u094b\u0932','service.html'],
      ['\u0936\u093e\u091c\u093e\u092a\u0941\u0930','service.html'],
      ['\u0936\u094d\u092f\u094b\u092a\u0941\u0930','service.html'],
      ['\u0936\u093f\u0935\u092a\u0941\u0930\u0940','service.html'],
      ['\u0938\u0940\u0927\u0940','service.html'],
      ['\u0938\u093f\u0902\u0917\u0930\u094c\u0932\u0940','service.html'],
      ['\u091f\u0940\u0915\u092e\u0917\u0922\u093c','service11.html'],
      ['\u0909\u091c\u094d\u091c\u0948\u0928','service.html'],
      ['\u0909\u092e\u0930\u093f\u092f\u093e','service.html'],
      ['\u0935\u093f\u0926\u093f\u0936\u093e','service.html']
    ];

    /* ── Build district links HTML ─────────────────────── */
    var distHTML = DISTRICTS.map(function (d) {
      return '<a href="' + d[1] + '" class="ak-dd-link">'
        + '<i class="fa-solid fa-location-dot"></i>'
        + '<span>' + d[0] + '</span>'
        + '</a>';
    }).join('');

    /* ── TOPBAR HTML ───────────────────────────────────── */
    var TOPBAR = ''
      + '<div class="ak-topbar">'
      +   '<div class="ak-shell ak-topbar-inner">'
      +     '<a href="tel:+916265071588"><i class="fa-solid fa-phone"></i> ' + PHONE + '</a>'
      +     '<a href="mailto:' + EMAIL + '" class="ak-topbar-email"><i class="fa-solid fa-envelope"></i> ' + EMAIL + '</a>'
      +     '<span class="ak-topbar-note"><i class="fa-solid fa-seedling"></i> \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0915\u0947 \u0938\u093e\u0925</span>'
      +   '</div>'
      + '</div>';

    /* ── HEADER HTML ───────────────────────────────────── */
    var HEADER = ''
      + '<header class="ak-header" id="akSharedHeader">'
      +   '<div class="ak-shell ak-nav">'

      /* Logo */
      +     '<a class="ak-brand" href="home.html">'
      +       '<img src="' + LOGO + '" alt="\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928" />'
      +       '<div class="ak-brand-text">'
      +         '<strong>\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928</strong>'
      +         '<span>\u0917\u094d\u0930\u093e\u092e\u0940\u0923 \u0938\u092c\u094d\u091c\u0940 \u2014 \u0936\u0939\u0930\u0940 \u0935\u093f\u0924\u0930\u0923</span>'
      +       '</div>'
      +     '</a>'

      /* Desktop nav links */
      +     '<nav class="ak-nav-links" id="akDesktopNav">'
      +       '<a href="home.html">\u0939\u094b\u092e</a>'
      +       '<a href="about.html">\u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902</a>'

      /* सेवाएं dropdown */
      +       '<div class="ak-dd" id="ddServices">'
      +         '<a href="service.html" class="ak-dd-trigger">'
      +           '\u0938\u0947\u0935\u093e\u090f\u0902 <i class="fa-solid fa-chevron-down"></i>'
      +         '</a>'
      +         '<div class="ak-dd-panel ak-dd-panel-wide">'
      +           '<div class="ak-dd-header"><i class="fa-solid fa-map-location-dot"></i> MP \u0915\u0947 \u0938\u092d\u0940 55 \u091c\u093f\u0932\u0947</div>'
      +           '<div class="ak-dd-grid">' + distHTML + '</div>'
      +         '</div>'
      +       '</div>'

      /* मंडी भाव dropdown */
      +       '<div class="ak-dd" id="ddMandi">'
      +         '<a href="mandi-bhav.html" class="ak-dd-trigger">'
      +           '\u092e\u0902\u0921\u0940 \u092d\u093e\u0935 <i class="fa-solid fa-chevron-down"></i>'
      +         '</a>'
      +         '<div class="ak-dd-panel">'
      +           '<a href="mandi-bhav.html"><i class="fa-solid fa-store"></i> \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935</a>'
      +           '<a href="vegetable-price.html"><i class="fa-solid fa-leaf"></i> \u0938\u092c\u094d\u091c\u0940 \u092d\u093e\u0935</a>'
      +           '<a href="crop-price.html"><i class="fa-solid fa-wheat-awn"></i> \u092b\u0938\u0932 \u092d\u093e\u0935</a>'
      +         '</div>'
      +       '</div>'

      +       '<a href="transport.html">\u092a\u0930\u093f\u0935\u0939\u0928</a>'
      +       '<a href="payment.html">\u092d\u0941\u0917\u0924\u093e\u0928</a>'
      +       '<a href="farmer-connect.html">\u0915\u093f\u0938\u093e\u0928 \u0938\u0902\u092a\u0930\u094d\u0915</a>'
      +     '</nav>'

      /* CTA + hamburger */
      +     '<div class="ak-nav-right">'
      +       '<a href="farmer-connect.html" class="ak-nav-cta">\u0906\u091c \u0939\u0940 \u0936\u0941\u0930\u0941\u0906\u0924 \u0915\u0930\u0947\u0902</a>'
      +       '<button class="ak-hamburger" id="akHamBtn" aria-label="\u092e\u0947\u0928\u0942" aria-expanded="false">'
      +         '<span></span><span></span><span></span>'
      +       '</button>'
      +     '</div>'

      +   '</div>'
      + '</header>'

      /* ── MOBILE SIDEBAR ── */
      + '<div class="ak-sidebar-overlay" id="akOverlay"></div>'
      + '<aside class="ak-sidebar" id="akSidebar" aria-hidden="true">'

      /* Sidebar head */
      +   '<div class="ak-sidebar-head">'
      +     '<div class="ak-sidebar-brand">'
      +       '<img src="' + LOGO + '" alt="\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928" />'
      +       '<div>'
      +         '<strong>\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928</strong>'
      +         '<span>\u0906\u092a\u0915\u0940 \u092b\u0938\u0932, \u0906\u092a\u0915\u093e \u0938\u0939\u0940 \u092c\u093e\u091c\u093e\u0930</span>'
      +       '</div>'
      +     '</div>'
      +     '<button class="ak-sidebar-close" id="akSidebarClose" aria-label="\u092c\u0902\u0926 \u0915\u0930\u0947\u0902">&times;</button>'
      +   '</div>'

      /* Sidebar menu */
      +   '<nav class="ak-sidebar-nav">'
      +     '<a href="home.html"><i class="fa-solid fa-house"></i> \u0939\u094b\u092e</a>'
      +     '<a href="about.html"><i class="fa-solid fa-circle-info"></i> \u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902</a>'

      /* Accordion: सेवाएं */
      +     '<div class="ak-sidebar-acc">'
      +       '<button class="ak-sidebar-acc-btn" aria-expanded="false">'
      +         '<span><i class="fa-solid fa-shop"></i> \u0938\u0947\u0935\u093e\u090f\u0902</span>'
      +         '<i class="fa-solid fa-chevron-down ak-acc-icon"></i>'
      +       '</button>'
      +       '<div class="ak-sidebar-acc-body">'
      +         '<p class="ak-sidebar-acc-label"><i class="fa-solid fa-map-location-dot"></i> MP \u0915\u0947 55 \u091c\u093f\u0932\u0947</p>'
      +         '<div class="ak-sidebar-dist-grid">' + distHTML + '</div>'
      +       '</div>'
      +     '</div>'

      /* Accordion: मंडी भाव */
      +     '<div class="ak-sidebar-acc">'
      +       '<button class="ak-sidebar-acc-btn" aria-expanded="false">'
      +         '<span><i class="fa-solid fa-chart-line"></i> \u092e\u0902\u0921\u0940 \u092d\u093e\u0935</span>'
      +         '<i class="fa-solid fa-chevron-down ak-acc-icon"></i>'
      +       '</button>'
      +       '<div class="ak-sidebar-acc-body">'
      +         '<a href="mandi-bhav.html"><i class="fa-solid fa-store"></i> \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935</a>'
      +         '<a href="vegetable-price.html"><i class="fa-solid fa-leaf"></i> \u0938\u092c\u094d\u091c\u0940 \u092d\u093e\u0935</a>'
      +         '<a href="crop-price.html"><i class="fa-solid fa-wheat-awn"></i> \u092b\u0938\u0932 \u092d\u093e\u0935</a>'
      +       '</div>'
      +     '</div>'

      +     '<a href="transport.html"><i class="fa-solid fa-truck-moving"></i> \u092a\u0930\u093f\u0935\u0939\u0928</a>'
      +     '<a href="payment.html"><i class="fa-solid fa-credit-card"></i> \u092d\u0941\u0917\u0924\u093e\u0928 \u0938\u094d\u0925\u093f\u0924\u093f</a>'
      +     '<a href="farmer-connect.html"><i class="fa-solid fa-users"></i> \u0915\u093f\u0938\u093e\u0928 \u0938\u0902\u092a\u0930\u094d\u0915</a>'
      +     '<a href="information.html"><i class="fa-solid fa-book-open"></i> \u0915\u0943\u0937\u093f \u091c\u093e\u0928\u0915\u093e\u0930\u0940</a>'
      +   '</nav>'

      +   '<div class="ak-sidebar-footer">'
      +     '<a href="farmer-connect.html" class="ak-sidebar-cta">\u0906\u091c \u0939\u0940 \u0936\u0941\u0930\u0941\u0906\u0924 \u0915\u0930\u0947\u0902 <i class="fa-solid fa-arrow-right"></i></a>'
      +     '<div class="ak-sidebar-contact">'
      +       '<a href="tel:+916265071588"><i class="fa-solid fa-phone"></i> ' + PHONE + '</a>'
      +       '<a href="https://wa.me/916265071588" target="_blank"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>'
      +     '</div>'
      +   '</div>'

      + '</aside>';

    /* ── FOOTER HTML ───────────────────────────────────── */
    var FOOTER = ''
      + '<footer class="ak-footer">'
      +   '<div class="ak-shell">'
      +     '<div class="ak-footer-grid">'

      +       '<div class="ak-footer-brand">'
      +         '<img src="' + LOGO + '" alt="\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928" />'
      +         '<strong>\u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936 \u0915\u093e \u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928</strong>'
      +         '<small>\u0906\u092a\u0915\u0940 \u092b\u0938\u0932, \u0906\u092a\u0915\u093e \u0938\u0939\u0940 \u092c\u093e\u091c\u093e\u0930\u0964</small>'
      +         '<p>\u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0915\u094b \u0938\u092c\u094d\u091c\u0940 \u092c\u093e\u091c\u093e\u0930 \u0915\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940, \u092d\u0930\u094b\u0938\u0947\u092e\u0902\u0926 \u092a\u0930\u093f\u0935\u0939\u0928 \u0914\u0930 \u0938\u092e\u092f \u092a\u0930 \u092d\u0941\u0917\u0924\u093e\u0928 \u0938\u0947 \u091c\u094b\u0921\u093c\u0928\u0947 \u0915\u093e \u092a\u094d\u0930\u092f\u093e\u0938\u0964</p>'
      +         '<div class="ak-footer-social">'
      +           '<a href="https://wa.me/916265071588" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>'
      +           '<a href="tel:+916265071588"><i class="fa-solid fa-phone"></i></a>'
      +           '<a href="mailto:' + EMAIL + '"><i class="fa-solid fa-envelope"></i></a>'
      +         '</div>'
      +       '</div>'

      +       '<div class="ak-footer-col">'
      +         '<h4>\u0915\u093f\u0938\u093e\u0928 \u0938\u0947\u0935\u093e\u090f\u0902</h4>'
      +         '<a href="mandi-bhav.html"><i class="fa-solid fa-store"></i> \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935</a>'
      +         '<a href="vegetable-price.html"><i class="fa-solid fa-leaf"></i> \u0938\u092c\u094d\u091c\u0940 \u092d\u093e\u0935</a>'
      +         '<a href="crop-price.html"><i class="fa-solid fa-wheat-awn"></i> \u092b\u0938\u0932 \u092d\u093e\u0935</a>'
      +         '<a href="transport.html"><i class="fa-solid fa-truck-moving"></i> \u092a\u0930\u093f\u0935\u0939\u0928</a>'
      +         '<a href="payment.html"><i class="fa-solid fa-credit-card"></i> \u092d\u0941\u0917\u0924\u093e\u0928</a>'
      +         '<a href="farmer-connect.html"><i class="fa-solid fa-users"></i> \u0915\u093f\u0938\u093e\u0928 \u0938\u0902\u092a\u0930\u094d\u0915</a>'
      +       '</div>'

      +       '<div class="ak-footer-col">'
      +         '<h4>\u0909\u092a\u092f\u094b\u0917\u0940 \u0932\u093f\u0902\u0915</h4>'
      +         '<a href="home.html"><i class="fa-solid fa-house"></i> \u0939\u094b\u092e</a>'
      +         '<a href="about.html"><i class="fa-solid fa-circle-info"></i> \u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902</a>'
      +         '<a href="service.html"><i class="fa-solid fa-shop"></i> \u0938\u0947\u0935\u093e\u090f\u0902</a>'
      +         '<a href="information.html"><i class="fa-solid fa-book-open"></i> \u0915\u0943\u0937\u093f \u091c\u093e\u0928\u0915\u093e\u0930\u0940</a>'
      +         '<a href="privacy.html"><i class="fa-solid fa-shield"></i> \u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e</a>'
      +         '<a href="term.html"><i class="fa-solid fa-file-lines"></i> \u0928\u093f\u092f\u092e</a>'
      +       '</div>'

      +       '<div class="ak-footer-col ak-footer-contact">'
      +         '<h4>\u0915\u093f\u0938\u093e\u0928 \u0938\u0939\u093e\u092f\u0924\u093e</h4>'
      +         '<a href="tel:+916265071588"><i class="fa-solid fa-phone"></i> ' + PHONE + '</a>'
      +         '<a href="https://wa.me/916265071588" target="_blank"><i class="fa-brands fa-whatsapp"></i> WhatsApp \u0915\u0930\u0947\u0902</a>'
      +         '<a href="mailto:' + EMAIL + '"><i class="fa-solid fa-envelope"></i> ' + EMAIL + '</a>'
      +         '<span><i class="fa-solid fa-location-dot"></i> \u0907\u0902\u0926\u094c\u0930, \u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936</span>'
      +       '</div>'

      +     '</div>'
      +     '<div class="ak-footer-bottom">'
      +       '<span>\u00A9 2026 \u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928. \u0938\u092d\u0940 \u0905\u0927\u093f\u0915\u093e\u0930 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924\u0964</span>'
      +       '<div class="ak-footer-legal">'
      +         '<a href="privacy.html">\u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f</a>'
      +         '<a href="term.html">\u0928\u093f\u092f\u092e \u090f\u0935\u0902 \u0936\u0930\u094d\u0924\u0947\u0902</a>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      + '</footer>';

    /* Float actions */
    var FLOAT = ''
      + '<div class="ak-float-actions">'
      +   '<a class="ak-float-btn ak-float-phone" href="tel:+916265071588" aria-label="\u092b\u094b\u0928"><i class="fa-solid fa-phone"></i></a>'
      +   '<a class="ak-float-btn ak-float-whatsapp" href="https://wa.me/916265071588" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>'
      + '</div>';

    var BTT = '<button id="akBackToTop" class="ak-back-to-top" aria-label="\u0909\u092a\u0930"><i class="fa-solid fa-chevron-up"></i></button>';

    /* ── Inject helpers ────────────────────────────────── */
    function injectBefore(selector, html) {
      var el = document.querySelector(selector);
      if (!el) return false;
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      var p = el.parentNode;
      while (tmp.firstChild) p.insertBefore(tmp.firstChild, el);
      p.removeChild(el);
      return true;
    }
    function appendHTML(html) {
      var d = document.createElement('div');
      d.innerHTML = html;
      while (d.firstChild) document.body.appendChild(d.firstChild);
    }

    /* Inject topbar */
    injectBefore('.main-top-nav', TOPBAR) || injectBefore('#akTopbar', TOPBAR);

    /* Inject header + sidebar */
    var headerAndSidebar = HEADER; /* sidebar is appended after header in string */
    if (!injectBefore('.nav-sec', headerAndSidebar)) {
      if (!injectBefore('#akHeader', headerAndSidebar)) {
        if (!document.getElementById('akSharedHeader')) {
          var hd = document.createElement('div');
          hd.innerHTML = headerAndSidebar;
          document.body.insertBefore(hd.firstElementChild, document.body.firstChild);
        }
      }
    }

    /* Inject footer */
    if (!injectBefore('.sion-top-footer', FOOTER)) injectBefore('#akFooter', FOOTER);
    var lb = document.querySelector('.sion-bottom-footer');
    if (lb) lb.parentNode.removeChild(lb);

    /* Float actions */
    if (!document.querySelector('.ak-float-actions')) {
      var ft = document.getElementById('akFloatActions');
      ft ? (ft.innerHTML = FLOAT) : appendHTML(FLOAT);
    }
    var of = document.querySelector('.nav-icon-whatapp');
    if (of) of.parentNode.removeChild(of);

    /* Back to top */
    if (!document.getElementById('akBackToTop')) appendHTML(BTT);

    /* ── INTERACTIONS ──────────────────────────────────── */

    var hamBtn   = document.getElementById('akHamBtn');
    var sidebar  = document.getElementById('akSidebar');
    var overlay  = document.getElementById('akOverlay');
    var closeBtn = document.getElementById('akSidebarClose');
    var header   = document.getElementById('akSharedHeader');

    function openSidebar() {
      if (!sidebar) return;
      sidebar.classList.add('open');
      sidebar.setAttribute('aria-hidden', 'false');
      if (overlay) overlay.classList.add('show');
      if (hamBtn)  hamBtn.classList.add('active');
      document.body.classList.add('ak-no-scroll');
    }
    function closeSidebar() {
      if (!sidebar) return;
      sidebar.classList.remove('open');
      sidebar.setAttribute('aria-hidden', 'true');
      if (overlay) overlay.classList.remove('show');
      if (hamBtn)  hamBtn.classList.remove('active');
      document.body.classList.remove('ak-no-scroll');
    }

    if (hamBtn)   hamBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay)  overlay.addEventListener('click', closeSidebar);

    /* ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    /* Close sidebar when a leaf link is tapped */
    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeSidebar);
      });
    }

    /* Sidebar accordions */
    if (sidebar) {
      sidebar.querySelectorAll('.ak-sidebar-acc-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var acc  = this.closest('.ak-sidebar-acc');
          var body = acc.querySelector('.ak-sidebar-acc-body');
          var open = acc.classList.toggle('open');
          this.setAttribute('aria-expanded', String(open));
          body.style.maxHeight = open ? body.scrollHeight + 'px' : '0';
        });
      });
    }

    /* Desktop dropdown — mouseenter/leave with 160ms close delay */
    var ddTimers = {};
    document.querySelectorAll('.ak-dd').forEach(function (dd, i) {
      dd.addEventListener('mouseenter', function () {
        clearTimeout(ddTimers[i]);
        document.querySelectorAll('.ak-dd.open').forEach(function (d) { d.classList.remove('open'); });
        dd.classList.add('open');
      });
      dd.addEventListener('mouseleave', function () {
        ddTimers[i] = setTimeout(function () { dd.classList.remove('open'); }, 160);
      });
      /* Keyboard / click on trigger when on small viewport (shouldn't show, but safety) */
      var trigger = dd.querySelector('.ak-dd-trigger');
      if (trigger) {
        trigger.addEventListener('click', function (e) {
          if (window.innerWidth < 992) {
            /* On mobile, links in sidebar handle nav — desktop nav is hidden */
            return;
          }
        });
      }
    });

    /* Scroll shadow */
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 4);
      }, { passive: true });
    }

    /* Back to top */
    var btt = document.getElementById('akBackToTop');
    if (btt) {
      window.addEventListener('scroll', function () {
        btt.classList.toggle('visible', window.scrollY > 300);
      }, { passive: true });
      btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    /* Active page highlight — header desktop nav */
    var page = (window.location.pathname.split('/').pop() || 'home.html');
    document.querySelectorAll('#akDesktopNav a, .ak-sidebar-nav a').forEach(function (a) {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });

    /* ── Shared utilities ──────────────────────────────── */
    /* Fix legacy herf typo */
    document.querySelectorAll('a[herf]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('herf')); a.removeAttribute('herf');
    });

    /* FAQ accordion */
    document.querySelectorAll('.ak-faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.closest('.ak-faq-item');
        var was  = item.classList.contains('open');
        document.querySelectorAll('.ak-faq-item.open').forEach(function (i) { i.classList.remove('open'); });
        if (!was) item.classList.add('open');
      });
    });

    /* Counter animation */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var t = Number(el.dataset.count);
      if (!isFinite(t)) return;
      var s = performance.now();
      (function tick(now) {
        var p = Math.min((now - s) / 1400, 1);
        el.textContent = Math.floor(p * t) + (p >= 1 ? '+' : '');
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    });

    /* Contact form */
    var form = document.getElementById('akContactForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        form.querySelectorAll('[required]').forEach(function (f) {
          var err = f.closest('.ak-field') && f.closest('.ak-field').querySelector('.ak-field-error');
          if (!f.value.trim()) { f.classList.add('ak-input-error'); if (err) err.classList.add('visible'); ok = false; }
          else { f.classList.remove('ak-input-error'); if (err) err.classList.remove('visible'); }
        });
        if (!ok) return;
        var btn = form.querySelector('[type="submit"]');
        var suc = document.getElementById('akFormSuccess');
        if (btn) { btn.disabled = true; btn.textContent = '\u092d\u0947\u091c\u093e \u091c\u093e \u0930\u0939\u093e \u0939\u0948\u2026'; }
        setTimeout(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> \u0938\u0902\u0926\u0947\u0936 \u092d\u0947\u091c\u0947\u0902'; }
          form.reset();
          if (suc) { suc.classList.add('visible'); setTimeout(function () { suc.classList.remove('visible'); }, 5000); }
        }, 1200);
      });
    }

    /* District search on service.html */
    var ds = document.getElementById('districtSearch');
    if (ds) {
      ds.addEventListener('input', function () {
        var q = this.value.trim().toLowerCase(), v = 0;
        document.querySelectorAll('#districtGrid a').forEach(function (a) {
          var m = a.textContent.toLowerCase().includes(q); a.hidden = !m; if (m) v++;
        });
        var emp = document.getElementById('districtEmpty'); if (emp) emp.hidden = v !== 0;
      });
    }
    var ds2 = document.getElementById('districtSearch2');
    var dg2 = document.getElementById('districtGrid2');
    if (ds2 && dg2) {
      ds2.addEventListener('input', function () {
        var q = this.value.trim().toLowerCase(), v = 0;
        dg2.querySelectorAll('a').forEach(function (a) {
          var n = (a.dataset.name || a.textContent).toLowerCase();
          var m = !q || n.includes(q); a.style.display = m ? '' : 'none'; if (m) v++;
        });
        var e2 = document.getElementById('districtEmpty2'); if (e2) e2.style.display = v ? 'none' : 'block';
      });
    }

    /* Auto-populate districtGrid2 on service.html */
    var grid2 = document.getElementById('districtGrid2');
    if (grid2 && !grid2.children.length) {
      var GRADS = [
        'linear-gradient(135deg,#0f3d1c,#1a5c2a)',
        'linear-gradient(135deg,#1a3a5c,#2563a8)',
        'linear-gradient(135deg,#4c1d1d,#b91c1c)',
        'linear-gradient(135deg,#1a3a1c,#16a34a)',
        'linear-gradient(135deg,#3d2c1a,#ca8a04)',
        'linear-gradient(135deg,#1a2c3c,#0d9488)',
        'linear-gradient(135deg,#1a1a3c,#7c3aed)',
        'linear-gradient(135deg,#1c3a2a,#15803d)',
        'linear-gradient(135deg,#3d1a1a,#dc2626)',
        'linear-gradient(135deg,#1a3c3a,#059669)'
      ];
      var ghtml = '';
      DISTRICTS.forEach(function (d, i) {
        ghtml += '<a href="' + d[1] + '" class="ak-dist-svc-card" data-name="' + d[0] + '">'
          + '<div class="ak-dist-svc-top" style="background:' + GRADS[i % GRADS.length] + '">'
          + '<i class="fa-solid fa-store" style="color:#fff;font-size:24px"></i>'
          + '</div>'
          + '<div class="ak-dist-svc-bottom"><strong>' + d[0] + '</strong></div>'
          + '</a>';
      });
      grid2.innerHTML = ghtml;
    }

    if (window.AOS) AOS.init({ duration: 700, once: true });
    if (window.jQuery && jQuery.fn.owlCarousel && document.querySelector('#carousel')) {
      jQuery('#carousel').owlCarousel({ autoplay:true, rewind:true, margin:20, autoplayTimeout:7000, smartSpeed:800, nav:true, responsive:{0:{items:1},600:{items:1},1024:{items:3}} });
    }

  }); /* end ready */
})();
