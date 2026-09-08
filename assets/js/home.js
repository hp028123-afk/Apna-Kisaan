/* ================================================================
   home.js  —  Apna Kisaan shared shell + utilities
   Injects header/topbar/nav/footer into legacy pages via
   .main-top-nav / .nav-sec / .sion-top-footer placeholders.
   Uses CUSTOM mobile nav toggle (no Bootstrap collapse).
   ================================================================ */

document.addEventListener("DOMContentLoaded", function () {

  var districts = [
    ["दमोह",       "service1.html"],
    ["पन्ना",       "service2.html"],
    ["छतरपुर",      "service3.html"],
    ["भोपाल",       "services4.html"],
    ["राजगढ़",      "internship.html"],
    ["सागर",        "service5.html"],
    ["नरसिंहपुर",   "service6.html"],
    ["जबलपुर",      "service7.html"],
    ["ग्वालियर",    "service8.html"],
    ["बालाघाट",     "service9.html"],
    ["रीवा",        "service10.html"],
    ["टीकमगढ़",     "service11.html"]
  ];

  /* ── Ensure ak-design.css is loaded FIRST (before home.css) ── */
  function ensureCSS(href) {
    if (!document.querySelector('link[href="' + href + '"]') &&
        !document.querySelector('link[href*="ak-design"]')) {
      var l = document.createElement("link");
      l.rel = "stylesheet"; l.href = href;
      /* Insert before first stylesheet so it loads early,
         but ak-design.css variables should override home.css.
         We also add an override block to fix the variable conflict. */
      var firstLink = document.querySelector('head link[rel="stylesheet"]');
      if (firstLink) {
        document.head.insertBefore(l, firstLink);
      } else {
        document.head.appendChild(l);
      }
      /* Inject inline override to ensure ak-design vars win over home.css */
      var style = document.createElement("style");
      style.textContent = ':root{--ak-green:#1a5c2a!important;--ak-green-dark:#0f3d1c!important;--ak-green-mid:#2d8a47!important;--ak-green-bright:#22c55e!important;}';
      document.head.appendChild(style);
    }
  }
  ensureCSS("assets/css/ak-design.css");

  /* ── Ensure Font Awesome 6 ─────────────────────────────── */
  if (!document.querySelector('link[href*="font-awesome/6"]')) {
    var fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
    document.head.appendChild(fa);
  }

  /* ── Ensure Google Fonts ───────────────────────────────── */
  if (!document.querySelector('link[href*="Noto+Sans+Devanagari"]')) {
    var gf = document.createElement("link");
    gf.rel = "stylesheet";
    gf.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&family=Karla:wght@400;500;600;700&display=swap";
    document.head.appendChild(gf);
  }

  /* ════════════════════════════════════════════════════════
     BUILD SHARED SHELL
     ════════════════════════════════════════════════════════ */
  function buildSharedShell() {
    /* Skip on home page (has its own nav) */
    if (document.body.classList.contains("ak-home")) return;

    /* ── District links for dropdown ── */
    var districtLinks = districts.map(function (d) {
      return '<a href="' + d[1] + '" role="menuitem"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ' + d[0] + '</a>';
    }).join("");

    /* ── LOGO (Unicode-escaped to avoid encoding issues) ── */
    var LOGO_SRC  = "assets/images/\u0905\u092a\u0928\u093e.\u0915\u093f\u0938\u093e\u0928.png";
    var LOGO_ALT  = "\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928 \u0932\u094b\u0917\u094b";
    var BRAND_NAME = "\u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928";
    var BRAND_TAG  = "\u0917\u094d\u0930\u093e\u092e\u0940\u0923 \u0938\u092c\u094d\u091c\u0940 \u2014 \u0936\u0939\u0930\u0940 \u0935\u093f\u0924\u0930\u0923";

    /* ── Topbar HTML ── */
    var topbarHTML =
      '<div class="ak-topbar" role="banner">' +
        '<div class="ak-shell ak-topbar-inner">' +
          '<a href="tel:+916265071588"><i class="fa-solid fa-phone" aria-hidden="true"></i> +91 626 507 1588</a>' +
          '<a href="mailto:hemantkachhi2002@gmail.com"><i class="fa-solid fa-envelope" aria-hidden="true"></i> hemantkachhi2002@gmail.com</a>' +
          '<span class="ak-topbar-note"><i class="fa-solid fa-seedling" aria-hidden="true"></i> \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0915\u0947 \u0938\u093e\u0925, \u0939\u0930 \u092e\u094c\u0938\u092e \u092e\u0947\u0902</span>' +
        '</div>' +
      '</div>';

    /* ── Header + Nav HTML (no Bootstrap collapse — custom toggle) ── */
    var headerHTML =
      '<header class="ak-header" id="akSharedHeader">' +
        '<nav class="ak-shell ak-nav" aria-label="\u092e\u0941\u0916\u094d\u092f \u0928\u0947\u0935\u093f\u0917\u0947\u0936\u0928" style="position:relative">' +

          /* Brand */
          '<a class="ak-brand" href="home.html" aria-label="' + BRAND_NAME + ' \u2014 \u092e\u0941\u0916\u094d\u092f \u092a\u0943\u0937\u094d\u0920">' +
            '<img src="' + LOGO_SRC + '" alt="' + LOGO_ALT + '" width="52" height="52"/>' +
            '<span><strong>' + BRAND_NAME + '</strong><small>' + BRAND_TAG + '</small></span>' +
          '</a>' +

          /* Mobile toggle */
          '<button class="ak-toggler" id="akNavToggle" type="button" aria-label="\u092e\u0947\u0928\u0942 \u0916\u094b\u0932\u0947\u0902" aria-expanded="false" aria-controls="akNavMenu">' +
            '<i class="fa-solid fa-bars" aria-hidden="true"></i>' +
          '</button>' +

          /* Nav links */
          '<ul class="ak-links" id="akNavMenu" role="menubar">' +
            '<li role="none"><a class="nav-link" href="home.html" role="menuitem">\u0939\u094b\u092e</a></li>' +
            '<li class="dropdown" role="none">' +
              '<a class="nav-link dropbtn" href="service.html" role="menuitem" aria-haspopup="true">' +
                '\u0938\u092c\u094d\u091c\u0940 \u092c\u093e\u091c\u093e\u0930 <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>' +
              '</a>' +
              '<div class="dropdown-content" role="menu">' + districtLinks + '</div>' +
            '</li>' +
            '<li role="none"><a class="nav-link" href="about.html" role="menuitem">\u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902</a></li>' +
            '<li role="none"><a class="nav-link" href="information.html" role="menuitem">\u0915\u0943\u0937\u093f \u091c\u093e\u0928\u0915\u093e\u0930\u0940</a></li>' +
            '<li class="dropdown ak-bhav-dropdown" role="none">' +
              '<a class="nav-link dropbtn" href="market-price.html" role="menuitem" aria-haspopup="true">' +
                '\u0906\u091c \u0915\u093e \u092d\u093e\u0935 <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>' +
              '</a>' +
              '<div class="dropdown-content ak-bhav-menu" role="menu">' +
                '<a href="market-price.html" role="menuitem"><i class="fa-solid fa-store" aria-hidden="true"></i> \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935</a>' +
                '<a href="vegetable-price.html" role="menuitem"><i class="fa-solid fa-leaf" aria-hidden="true"></i> \u0938\u092c\u094d\u091c\u0940 \u092d\u093e\u0935</a>' +
                '<a href="crop-price.html" role="menuitem"><i class="fa-solid fa-wheat-awn" aria-hidden="true"></i> \u092b\u0938\u0932 \u092d\u093e\u0935</a>' +
              '</div>' +
            '</li>' +
            '<li role="none"><a class="nav-link" href="contactus.html" role="menuitem">\u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902</a></li>' +
            '<li role="none"><a class="ak-nav-cta" href="contactus.html"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i> \u091c\u0941\u0921\u093c\u0947\u0902</a></li>' +
          '</ul>' +

        '</nav>' +
      '</header>';

    /* ── Footer HTML ── */
    var footerHTML =
      '<footer class="ak-footer" role="contentinfo">' +
        '<div class="ak-shell">' +
          '<div class="ak-footer-grid">' +

            '<div class="ak-footer-brand">' +
              '<img src="' + LOGO_SRC + '" alt="' + LOGO_ALT + '"/>' +
              '<strong>' + BRAND_NAME + '</strong>' +
              '<small>' + BRAND_TAG + '</small>' +
              '<p>\u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936 \u0915\u0947 \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u0938\u092c\u094d\u091c\u0940 \u092c\u093e\u091c\u093e\u0930, \u092e\u0902\u0921\u0940 \u092d\u093e\u0935, \u0915\u0943\u0937\u093f \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0914\u0930 \u092a\u0930\u093f\u0935\u0939\u0928 \u0938\u0939\u093e\u092f\u0924\u093e \u0915\u093e \u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u092e\u0902\u091a\u0964</p>' +
            '</div>' +

            '<div class="ak-footer-col">' +
              '<h4>\u0909\u092a\u092f\u094b\u0917\u0940 \u0932\u093f\u0902\u0915</h4>' +
              '<a href="home.html"><i class="fa-solid fa-house"></i> \u092e\u0941\u0916\u094d\u092f \u092a\u0943\u0937\u094d\u0920</a>' +
              '<a href="about.html"><i class="fa-solid fa-circle-info"></i> \u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902</a>' +
              '<a href="service.html"><i class="fa-solid fa-shop"></i> \u0938\u092c\u094d\u091c\u0940 \u092c\u093e\u091c\u093e\u0930</a>' +
              '<a href="information.html"><i class="fa-solid fa-book-open"></i> \u0915\u0943\u0937\u093f \u091c\u093e\u0928\u0915\u093e\u0930\u0940</a>' +
              '<a href="contactus.html"><i class="fa-solid fa-envelope"></i> \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902</a>' +
            '</div>' +

            '<div class="ak-footer-col">' +
              '<h4>\u092e\u0902\u0921\u0940 \u092d\u093e\u0935</h4>' +
              '<a href="market-price.html"><i class="fa-solid fa-store"></i> \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935</a>' +
              '<a href="vegetable-price.html"><i class="fa-solid fa-leaf"></i> \u0938\u092c\u094d\u091c\u0940 \u092d\u093e\u0935</a>' +
              '<a href="crop-price.html"><i class="fa-solid fa-wheat-awn"></i> \u092b\u0938\u0932 \u092d\u093e\u0935</a>' +
              '<a href="privacy.html"><i class="fa-solid fa-shield"></i> \u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f</a>' +
              '<a href="term.html"><i class="fa-solid fa-file-lines"></i> \u0928\u093f\u092f\u092e \u090f\u0935\u0902 \u0936\u0930\u094d\u0924\u0947\u0902</a>' +
            '</div>' +

            '<div class="ak-footer-col ak-footer-contact">' +
              '<h4>\u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902</h4>' +
              '<a href="tel:+916265071588"><i class="fa-solid fa-phone"></i> +91 626 507 1588</a>' +
              '<a href="mailto:hemantkachhi2002@gmail.com"><i class="fa-solid fa-envelope"></i> hemantkachhi2002@gmail.com</a>' +
              '<span><i class="fa-solid fa-location-dot"></i> \u0907\u0902\u0926\u094c\u0930, \u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936</span>' +
              '<a href="https://wa.me/916265071588" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp \u0915\u0930\u0947\u0902</a>' +
            '</div>' +

          '</div>' +
          '<div class="ak-footer-bottom">' +
            '<span>© ' + new Date().getFullYear() + ' \u0905\u092a\u0928\u093e \u0915\u093f\u0938\u093e\u0928. \u0938\u0930\u094d\u0935\u093e\u0927\u093f\u0915\u093e\u0930 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924\u0964 \u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936, \u092d\u093e\u0930\u0924\u0964</span>' +
            '<div class="ak-footer-legal">' +
              '<a href="privacy.html">\u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f</a>' +
              '<a href="term.html">\u0928\u093f\u092f\u092e \u090f\u0935\u0902 \u0936\u0930\u094d\u0924\u0947\u0902</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</footer>';

    /* ── Floating action buttons ── */
    var floatHTML =
      '<div class="ak-float-actions" aria-label="\u0924\u094d\u0935\u0930\u093f\u0924 \u0938\u0902\u092a\u0930\u094d\u0915">' +
        '<a class="ak-float-btn ak-float-phone" href="tel:+916265071588" aria-label="\u092b\u094b\u0928 \u0915\u0930\u0947\u0902"><i class="fa-solid fa-phone"></i></a>' +
        '<a class="ak-float-btn ak-float-whatsapp" href="https://wa.me/916265071588" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
      '</div>';

    /* ── Inject topbar ── */
    var legacyTop = document.querySelector(".main-top-nav");
    if (legacyTop) {
      var topbarEl = document.createElement("div");
      topbarEl.innerHTML = topbarHTML;
      legacyTop.replaceWith(topbarEl.firstElementChild);
    }

    /* ── Inject header ── */
    var legacyNav = document.querySelector(".nav-sec");
    if (legacyNav) {
      var headerEl = document.createElement("div");
      headerEl.innerHTML = headerHTML;
      legacyNav.replaceWith(headerEl.firstElementChild);
    } else if (!document.getElementById("akSharedHeader")) {
      /* Fallback: prepend to body */
      var hEl = document.createElement("div");
      hEl.innerHTML = headerHTML;
      document.body.insertBefore(hEl.firstElementChild, document.body.firstChild);
    }

    /* ── Inject footer ── */
    var legacyFooter = document.querySelector(".sion-top-footer");
    var legacyBottom = document.querySelector(".sion-bottom-footer");
    if (legacyFooter) {
      var fEl = document.createElement("div");
      fEl.innerHTML = footerHTML;
      legacyFooter.replaceWith(fEl.firstElementChild);
    }
    if (legacyBottom) legacyBottom.remove();

    /* ── Inject floating buttons ── */
    if (!document.querySelector(".ak-float-actions")) {
      var fbEl = document.createElement("div");
      fbEl.innerHTML = floatHTML;
      document.body.appendChild(fbEl.firstElementChild);
    }

    /* ── Remove old floating WhatsApp ── */
    var oldFloat = document.querySelector(".nav-icon-whatapp");
    if (oldFloat) oldFloat.remove();

    document.body.classList.add("ak-legacy-page");

    /* ── Mobile nav toggle (CUSTOM — no Bootstrap collapse) ── */
    var toggle  = document.getElementById("akNavToggle");
    var navMenu = document.getElementById("akNavMenu");

    if (toggle && navMenu) {
      toggle.addEventListener("click", function () {
        var open = navMenu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.querySelector("i").className = open
          ? "fa-solid fa-xmark"
          : "fa-solid fa-bars";
      });
    }

    /* ── Dropdown on mobile (tap to open) ── */
    document.querySelectorAll("#akNavMenu .dropbtn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        if (window.innerWidth < 992) {
          e.preventDefault();
          var dd = this.closest(".dropdown");
          var wasOpen = dd.classList.contains("is-open");
          /* Close all other dropdowns */
          document.querySelectorAll("#akNavMenu .dropdown.is-open").forEach(function (d) {
            d.classList.remove("is-open");
          });
          if (!wasOpen) dd.classList.add("is-open");
        }
      });
    });

    /* Close dropdowns when clicking outside */
    document.addEventListener("click", function (e) {
      if (!e.target.closest("#akNavMenu .dropdown")) {
        document.querySelectorAll("#akNavMenu .dropdown.is-open").forEach(function (d) {
          d.classList.remove("is-open");
        });
      }
    });

    /* Close mobile menu when a nav link is tapped */
    document.querySelectorAll("#akNavMenu a:not(.dropbtn)").forEach(function (a) {
      a.addEventListener("click", function () {
        if (navMenu) navMenu.classList.remove("open");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.querySelector("i").className = "fa-solid fa-bars";
        }
      });
    });

    /* ── Highlight active page ── */
    var currentPage = window.location.pathname.split("/").pop() || "home.html";
    document.querySelectorAll("#akNavMenu .nav-link").forEach(function (link) {
      if (link.getAttribute("href") === currentPage) link.classList.add("active");
    });
    document.querySelectorAll("#akNavMenu .dropdown").forEach(function (dd) {
      if (dd.querySelector('.dropdown-content a[href="' + currentPage + '"]')) {
        var btn = dd.querySelector(".nav-link.dropbtn");
        if (btn) btn.classList.add("active");
      }
    });
  }

  buildSharedShell();

  /* ── Fix legacy typo: herf → href ─────────────────────── */
  document.querySelectorAll("a[herf]").forEach(function (a) {
    a.setAttribute("href", a.getAttribute("herf"));
    a.removeAttribute("herf");
  });

  /* ── Replace Lorem ipsum placeholder text ─────────────── */
  document.querySelectorAll("p, h1, h2, h3, h4").forEach(function (el) {
    if (el.textContent.trim().indexOf("Lorem ipsum") === 0) {
      el.textContent = "\u092f\u0939 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0914\u0930 \u0938\u092c\u094d\u091c\u0940 \u092c\u093e\u091c\u093e\u0930 \u0938\u0947 \u091c\u0941\u0921\u093c\u0947 \u0909\u092a\u092f\u094b\u0917\u0940 \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0928 \u0915\u0947 \u0932\u093f\u090f \u0939\u0948\u0964 \u0905\u0927\u093f\u0915 \u0938\u0939\u093e\u092f\u0924\u093e \u0915\u0947 \u0932\u093f\u090f \u0939\u092e\u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0964";
    }
  });

  /* ── AOS animation init ────────────────────────────────── */
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 40 });
  }

  /* ── Counter animation (legacy pages) ─────────────────── */
  document.querySelectorAll(".web-best-section-counting[data-count]").forEach(function (el) {
    var target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    var start = performance.now();
    (function tick(now) {
      var p = Math.min((now - start) / 1200, 1);
      el.textContent = String(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + "+";
    })(performance.now());
  });

  /* ── Owl Carousel (legacy service pages) ──────────────── */
  if (window.jQuery && jQuery.fn && jQuery.fn.owlCarousel && document.querySelector("#carousel")) {
    jQuery("#carousel").owlCarousel({
      autoplay: true, rewind: true, margin: 20,
      autoplayTimeout: 7000, smartSpeed: 800, nav: true,
      responsive: { 0: { items: 1 }, 600: { items: 1 }, 1024: { items: 3 } }
    });
  }

  /* ── District search (home page) ──────────────────────── */
  var dSearch = document.getElementById("districtSearch");
  if (dSearch) {
    dSearch.addEventListener("input", function () {
      var q = this.value.trim().toLowerCase();
      var visible = 0;
      document.querySelectorAll("#districtGrid a").forEach(function (a) {
        var match = a.textContent.toLowerCase().indexOf(q) !== -1;
        a.hidden = !match;
        if (match) visible++;
      });
      var empty = document.getElementById("districtEmpty");
      if (empty) empty.hidden = visible !== 0;
    });
  }

  /* ── FAQ accordion ─────────────────────────────────────── */
  document.querySelectorAll(".ak-faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = this.closest(".ak-faq-item");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".ak-faq-item.open").forEach(function (i) { i.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ── Contact form ──────────────────────────────────────── */
  var form = document.getElementById("akContactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (f) {
        var errEl = f.closest(".ak-field") && f.closest(".ak-field").querySelector(".ak-field-error");
        if (!f.value.trim()) {
          f.classList.add("ak-input-error");
          if (errEl) errEl.classList.add("visible");
          valid = false;
        } else {
          f.classList.remove("ak-input-error");
          if (errEl) errEl.classList.remove("visible");
        }
      });
      if (!valid) return;
      var btn = form.querySelector(".ak-submit-btn");
      var suc = document.getElementById("akFormSuccess");
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> \u092d\u0947\u091c\u093e \u091c\u093e \u0930\u0939\u093e \u0939\u0948\u2026'; }
      setTimeout(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> \u0938\u0902\u0926\u0947\u0936 \u092d\u0947\u091c\u0947\u0902'; }
        form.reset();
        if (suc) { suc.classList.add("visible"); setTimeout(function () { suc.classList.remove("visible"); }, 5000); }
      }, 1200);
    });
  }

});
