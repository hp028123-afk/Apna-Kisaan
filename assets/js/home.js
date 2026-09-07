
document.addEventListener("DOMContentLoaded", function () {
  var districts = [
    ["दमोह", "service1.html"], ["पन्ना", "service2.html"],
    ["छतरपुर", "service3.html"], ["भोपाल", "services4.html"],
    ["राजगढ़", "internship.html"], ["सागर", "service5.html"],
    ["नरसिंहपुर", "service6.html"], ["जबलपुर", "service7.html"],
    ["ग्वालियर", "service8.html"], ["बालाघाट", "service9.html"],
    ["रीवा", "service10.html"], ["टीकमगढ़", "service11.html"]
  ];

  function buildSharedShell() {
    if (document.body.classList.contains("ak-home")) return;
    if (!document.querySelector('link[href*="font-awesome/6"]')) {
      var iconStyles = document.createElement("link");
      iconStyles.rel = "stylesheet";
      iconStyles.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
      document.head.appendChild(iconStyles);
    }
    var districtLinks = districts.map(function (district) {
      return '<a href="' + district[1] + '">' + district[0] + '</a>';
    }).join("");
    var header = document.createElement("div");
    header.className = "ak-shared-shell";
    header.innerHTML = '<div class="ak-topbar"><div class="ak-shell ak-topbar-inner"><span><i class="fa-solid fa-phone"></i> <a href="tel:+916265071588">+91 626 507 1588</a></span><span><i class="fa-solid fa-envelope"></i> <a href="mailto:hemantkachhi2002@gmail.com">hemantkachhi2002@gmail.com</a></span><span class="ak-topbar-note">किसानों के साथ, हर मौसम में</span></div></div>' +
      '<header class="ak-header"><nav class="navbar navbar-expand-lg ak-shell ak-nav" aria-label="मुख्य नेविगेशन"><a class="navbar-brand ak-brand" href="home.html" aria-label="अपना किसान होम"><img src="assets/images/stock - Copy.png" alt="अपना किसान लोगो"><span><strong>अपना किसान</strong><small>किसान का अपना बाजार</small></span></a><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#akSharedMenu" aria-controls="akSharedMenu" aria-expanded="false" aria-label="मेनू खोलें"><i class="fa-solid fa-bars"></i></button><div class="collapse navbar-collapse" id="akSharedMenu"><ul class="navbar-nav ml-auto align-items-lg-center ak-links"><li class="nav-item"><a class="nav-link" href="home.html">होम</a></li><li class="nav-item dropdown"><a class="nav-link dropbtn" href="service.html">सब्जी बाजार <i class="fa-solid fa-chevron-down"></i></a><div class="dropdown-content">' + districtLinks + '</div></li><li class="nav-item"><a class="nav-link" href="about.html">हमारे बारे में</a></li><li class="nav-item"><a class="nav-link" href="information.html">जानकारी</a></li><li class="nav-item"><a class="nav-link" href="contactus.html">संपर्क करें</a></li><li class="nav-item ml-lg-3"><a class="ak-button ak-button-small" href="contactus.html"><i class="fa-solid fa-arrow-right"></i> जुड़ें</a></li></ul></div></nav></header>';
    var legacyTop = document.querySelector(".main-top-nav");
    var legacyNav = document.querySelector(".nav-sec");
    if (legacyTop) legacyTop.replaceWith(header.firstElementChild);
    if (legacyNav) legacyNav.replaceWith(header.lastElementChild);

    var footer = document.createElement("footer");
    footer.className = "ak-footer ak-shared-footer";
    footer.innerHTML = '<div class="ak-shell ak-footer-grid"><div><a class="ak-brand ak-brand-footer" href="home.html"><img src="assets/images/stock - Copy.png" alt="अपना किसान लोगो"><span><strong>अपना किसान</strong><small>किसान का अपना बाजार</small></span></a><p>मध्य प्रदेश के किसानों के लिए बाजार और परिवहन की उपयोगी जानकारी।</p></div><div><h3>त्वरित लिंक</h3><a href="about.html">हमारे बारे में</a><a href="service.html">सब्जी बाजार</a><a href="information.html">जानकारी</a><a href="contactus.html">संपर्क करें</a></div><div><h3>संपर्क करें</h3><a href="tel:+916265071588"><i class="fa-solid fa-phone"></i> +91 626 507 1588</a><a href="mailto:hemantkachhi2002@gmail.com"><i class="fa-solid fa-envelope"></i> hemantkachhi2002@gmail.com</a><span><i class="fa-solid fa-location-dot"></i> इंदौर, मध्य प्रदेश</span></div></div><div class="ak-footer-bottom"><div class="ak-shell"><span>© 2024 अपना किसान. सर्वाधिकार सुरक्षित।</span><span><a href="privacy.html">गोपनीयता</a> <a href="term.html">नियम और शर्तें</a></span></div></div>';
    var legacyFooter = document.querySelector(".sion-top-footer");
    var legacyBottom = document.querySelector(".sion-bottom-footer");
    if (legacyFooter) legacyFooter.replaceWith(footer);
    if (legacyBottom) legacyBottom.remove();
    document.body.classList.add("ak-legacy-page");
    var currentPage = window.location.pathname.split("/").pop() || "home.html";
    document.querySelectorAll(".ak-links .nav-link").forEach(function (link) {
      if (link.getAttribute("href") === currentPage) link.classList.add("active");
    });
  }

  buildSharedShell();

  document.querySelectorAll("p, h2, h3, a").forEach(function (element) {
    var text = element.textContent.trim();
    if (text.indexOf("Lorem ipsum") === 0) {
      element.textContent = "यह जानकारी किसानों और सब्जी बाजार से जुड़े उपयोगी मार्गदर्शन के लिए है। स्थानीय बाजार, मौसम और मांग के अनुसार निर्णय लेने से पहले संबंधित व्यक्ति से पुष्टि करें। अधिक सहायता के लिए हमसे संपर्क करें।";
    }
    var labels = {
      "Hadding": "महत्वपूर्ण जानकारी",
      "ABOUT US": "हमारे बारे में",
      "CONTACT US": "संपर्क करें",
      "Privacy Policy": "गोपनीयता नीति",
      "Home": "होम",
      "Contact us": "संपर्क करें",
      "Term & Condition": "नियम और शर्तें",
      "PLATFORM WE WORK ON": "हम जिन माध्यमों पर काम करते हैं",
      "Custom Software Development": "किसान सहायता और बाजार जानकारी"
    };
    if (labels[text]) element.textContent = labels[text];
  });

  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 40 });
  }

  document.querySelectorAll(".dropbtn").forEach(function (button) {
    button.addEventListener("click", function (event) {
      if (window.innerWidth < 992) {
        event.preventDefault();
        button.parentElement.classList.toggle("is-open");
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown.is-open").forEach(function (menu) {
        menu.classList.remove("is-open");
      });
    }
  });

  document.querySelectorAll("a[herf]").forEach(function (link) {
    link.setAttribute("href", link.getAttribute("herf"));
    link.removeAttribute("herf");
  });

  var translations = {
    "होम": "Home", "सब्जी बाजार": "Vegetable Market", "हमारे बारे में": "About Us",
    "जानकारी": "Information", "संपर्क करें": "Contact Us", "जुड़ें": "Join Us",
    "सब्जी बाजार देखें": "Explore Vegetable Markets", "जानिए कैसे काम करता है": "How It Works",
    "हमारी सेवाएं": "Our Services", "खेती से बाजार तक,": "From Farm to Market,",
    "हर कदम पर साथ।": "Support at Every Step.", "हमारा तरीका": "Our Approach",
    "जिले के अनुसार": "By District", "अपने नजदीकी": "Find Your Nearby",
    "बाजार को खोजें।": "Market.", "आज ही शुरुआत करें": "Get Started Today",
    "संपर्क करें": "Contact Us", "गोपनीयता": "Privacy", "नियम और शर्तें": "Terms & Conditions",
    "किसानों के साथ, हर मौसम में": "With Farmers, Every Season",
    "मध्य प्रदेश का किसान नेटवर्क": "Madhya Pradesh Farmer Network",
    "किसान पहले": "Farmers First", "बाजार की समझ": "Market Understanding", "भरोसे का साथ": "Trusted Support",
    "सुरक्षित परिवहन": "Safe Transportation", "भुगतान और संपर्क": "Payments & Contact",
    "सब्जी बाजार की जानकारी": "Vegetable Market Information", "पूरी जानकारी": "Full Information",
    "हमसे जुड़ें": "Connect With Us", "बाजार देखें": "View Market",
    "अपना किसान": "Apna Kisaan", "किसान का अपना बाजार": "A Market For Farmers"
  };
  var languageButton = document.createElement("button");
  languageButton.type = "button";
  languageButton.className = "ak-language-toggle";
  languageButton.setAttribute("aria-label", "भाषा बदलें / Switch language");
  languageButton.textContent = "EN";
  document.body.appendChild(languageButton);
  function setLabel(element, label) {
    var textNode = Array.from(element.childNodes).find(function (node) {
      return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
    });
    if (textNode) textNode.textContent = " " + label + " ";
    else element.insertBefore(document.createTextNode(label + " "), element.firstChild);
  }

  languageButton.addEventListener("click", function () {
    var toEnglish = document.documentElement.lang !== "en-US";
    document.documentElement.lang = toEnglish ? "en-US" : "hi";
    languageButton.textContent = toEnglish ? "हिंदी" : "EN";
    document.querySelectorAll(".ak-links .nav-link, .ak-button, .ak-text-link, .ak-kicker, .ak-strip-grid strong, .ak-service-card h3, .ak-card-link, .ak-section-heading h2, .ak-process h2, .ak-cta h2, .sion-navigation-sec-list-tems, .sion-navigation-sec3-btn, .about-us-links").forEach(function (element) {
      var current = element.dataset.hiText || element.textContent.trim();
      if (!element.dataset.hiText) element.dataset.hiText = current;
      var translated = toEnglish ? translations[current] : current;
      if (translated) setLabel(element, translated);
    });
  });

  var districtSearch = document.getElementById("districtSearch");
  if (districtSearch) {
    districtSearch.addEventListener("input", function () {
      var query = districtSearch.value.trim().toLocaleLowerCase("hi");
      var visible = 0;
      document.querySelectorAll("#districtGrid a").forEach(function (district) {
        var matches = district.textContent.toLocaleLowerCase("hi").indexOf(query) !== -1;
        district.hidden = !matches;
        if (matches) visible += 1;
      });
      var emptyState = document.getElementById("districtEmpty");
      if (emptyState) emptyState.hidden = visible !== 0;
    });
  }

  document.querySelectorAll(".web-best-section-counting[data-count]").forEach(function (counter) {
    var target = Number(counter.dataset.count);
    if (!Number.isFinite(target)) return;
    var start = performance.now();
    var duration = 1200;
    function update(now) {
      var progress = Math.min((now - start) / duration, 1);
      counter.textContent = String(Math.floor(progress * target));
      if (progress < 1) window.requestAnimationFrame(update);
      else counter.textContent = String(target) + "+";
    }
    window.requestAnimationFrame(update);
  });

  if (window.jQuery && jQuery.fn && jQuery.fn.owlCarousel && document.querySelector("#carousel")) {
    jQuery("#carousel").owlCarousel({
      autoplay: true,
      rewind: true,
      margin: 20,
      responsiveClass: true,
      autoHeight: true,
      autoplayTimeout: 7000,
      smartSpeed: 800,
      nav: true,
      responsive: { 0: { items: 1 }, 600: { items: 1 }, 1024: { items: 3 } }
    });
  }
});