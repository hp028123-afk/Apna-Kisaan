/* ================================================================
   home.js  —  Apna Kisaan shared shell + utilities
   Injects header/topbar/nav/footer into legacy pages via
   .main-top-nav / .nav-sec / .sion-top-footer placeholders.
   Uses CUSTOM mobile nav toggle (no Bootstrap collapse).
   ================================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ── Load components.js if not already loaded ── */
  if (typeof window.akComponentsLoaded === 'undefined') {
    var script = document.createElement('script');
    script.src = 'assets/js/components.js';
    document.head.appendChild(script);
  }

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
