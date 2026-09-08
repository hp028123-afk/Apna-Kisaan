/* =============================================================
   crop-price.js  v2
   Uses BhavAPI.fetchCrops() from bhav-api.js.
   Drives: dashboard, MP spotlight, card grid, table,
           bar chart (MP crops in blue), trend donut.
   ============================================================= */

(function () {
  "use strict";

  /* ── DOM refs ───────────────────────────────────────────── */
  var els = {
    search:        document.getElementById("cropSearch"),
    category:      document.getElementById("cropCategory"),
    trend:         document.getElementById("cropTrend"),
    sort:          document.getElementById("cropSort"),
    refresh:       document.getElementById("cropRefresh"),
    reset:         document.getElementById("cropReset"),
    error:         document.getElementById("cropError"),
    errorText:     document.getElementById("cropErrorText"),
    retry:         document.getElementById("cropRetry"),
    demo:          document.getElementById("cropDemo"),
    retryLive:     document.getElementById("cropRetryLive"),
    skeleton:      document.getElementById("cropSkeleton"),
    mpSection:     document.getElementById("mpSection"),
    mpGrid:        document.getElementById("mpCropGrid"),
    resultMeta:    document.getElementById("cropResultMeta"),
    resultCount:   document.getElementById("cropResultCount"),
    tabCards:      document.getElementById("cropTabCards"),
    tabTable:      document.getElementById("cropTabTable"),
    cardsView:     document.getElementById("cropCardsView"),
    cards:         document.getElementById("cropCards"),
    cardsEmpty:    document.getElementById("cropCardsEmpty"),
    tableView:     document.getElementById("cropTableView"),
    tableBody:     document.getElementById("cropTableBody"),
    tableEmpty:    document.getElementById("cropTableEmpty"),
    liveBadge:     document.getElementById("cropLiveBadge"),
    chartsSection: document.getElementById("cropChartsSection"),
    priceCanvas:   document.getElementById("cropPriceChart"),
    trendCanvas:   document.getElementById("cropTrendChart"),
    heroUpdated:   document.getElementById("heroLastUpdatedCrop"),
    dashTotal:     document.getElementById("cropDashTotal"),
    dashMP:        document.getElementById("cropDashMP"),
    dashRising:    document.getElementById("cropDashRising"),
    dashFalling:   document.getElementById("cropDashFalling"),
    dashHighest:   document.getElementById("cropDashHighest"),
    dashDate:      document.getElementById("cropDashDate")
  };

  /* ── State ──────────────────────────────────────────────── */
  var state = { all: [], mpOnly: [], filtered: [], isDemo: false, view: "cards" };

  /* ── Icon map ───────────────────────────────────────────── */
  var CROP_ICONS = {
    wheat:"fa-solid fa-wheat-awn", rice:"fa-solid fa-bowl-rice", paddy:"fa-solid fa-bowl-rice",
    maize:"fa-solid fa-seedling", corn:"fa-solid fa-seedling",
    soybean:"fa-solid fa-circle", soya:"fa-solid fa-circle",
    mustard:"fa-solid fa-seedling", cotton:"fa-solid fa-cloud",
    sugarcane:"fa-solid fa-leaf", jowar:"fa-solid fa-wheat-awn", bajra:"fa-solid fa-wheat-awn",
    barley:"fa-solid fa-wheat-awn", chana:"fa-solid fa-circle-dot", gram:"fa-solid fa-circle-dot",
    lentil:"fa-solid fa-circle-dot", groundnut:"fa-solid fa-egg",
    sesame:"fa-solid fa-seedling", sunflower:"fa-solid fa-sun",
    "default":"fa-solid fa-wheat-awn"
  };

  function getIcon(nameEn) {
    if (!nameEn) return CROP_ICONS["default"];
    var key = nameEn.toLowerCase();
    for (var k in CROP_ICONS) {
      if (k !== "default" && key.indexOf(k) !== -1) return CROP_ICONS[k];
    }
    return CROP_ICONS["default"];
  }

  /* ── Normalise record ───────────────────────────────────── */
  function normalise(raw) {
    function num(v) {
      if (v === null || v === undefined) return null;
      var n = Number(String(v).replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? n : null;
    }
    return {
      nameHi:   raw.commodity      || raw.commodity_en || "—",
      nameEn:   raw.commodity_en   || raw.commodity    || "—",
      category: raw.category       || "फसल",
      min:      num(raw.min_price),
      max:      num(raw.max_price),
      modal:    num(raw.modal_price),
      change:   num(raw.change),
      trend:    (raw.trend || "same").toLowerCase(),
      unit:     raw.unit           || "रु./क्विंटल",
      date:     raw.arrival_date   || raw.updated || "",
      isMP:     raw.is_mp === true,
      district: raw.district       || "भारत"
    };
  }

  /* ── Helpers ────────────────────────────────────────────── */
  function fmt(val) {
    if (val === null || val === undefined) return "—";
    return "रु.\u00A0" + Number(val).toLocaleString("hi-IN");
  }
  function fmtChange(val) {
    if (val === null) return "—";
    return (val > 0 ? "+" : "") + Number(val).toLocaleString("hi-IN");
  }
  function formatDate(v) {
    if (!v) return "—";
    var d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleDateString("hi-IN", { day:"2-digit", month:"short", year:"numeric" });
  }
  function trendHTML(t) {
    if (t === "up")   return '<span class="bhav-td-up"><i class="fa-solid fa-arrow-trend-up"></i> बढ़त</span>';
    if (t === "down") return '<span class="bhav-td-down"><i class="fa-solid fa-arrow-trend-down"></i> गिरावट</span>';
    return '<span class="bhav-td-same"><i class="fa-solid fa-equals"></i> स्थिर</span>';
  }
  function trendClass(t) { return t === "up" ? "up" : t === "down" ? "down" : "same"; }
  function trendCard(t) {
    if (t === "up")   return '<i class="fa-solid fa-arrow-trend-up"></i> बढ़त';
    if (t === "down") return '<i class="fa-solid fa-arrow-trend-down"></i> गिरावट';
    return '<i class="fa-solid fa-equals"></i> स्थिर';
  }

  /* ── Category dropdown ──────────────────────────────────── */
  function buildCategories(records) {
    var seen = {};
    records.forEach(function (r) { if (r.category) seen[r.category] = true; });
    while (els.category.options.length > 1) els.category.remove(1);
    Object.keys(seen).sort().forEach(function (c) {
      var o = document.createElement("option");
      o.value = c; o.textContent = c;
      els.category.appendChild(o);
    });
  }

  /* ── Dashboard ──────────────────────────────────────────── */
  function updateDashboard(all) {
    var mpCount  = all.filter(function (r) { return r.isMP; }).length;
    var rising   = all.filter(function (r) { return r.trend === "up";   }).length;
    var falling  = all.filter(function (r) { return r.trend === "down"; }).length;
    var prices   = all.map(function (r) { return r.modal; }).filter(function (v) { return v !== null; });
    var firstDate = all.length ? formatDate(all[0].date) : "—";

    els.dashTotal.textContent   = all.length.toLocaleString("hi-IN");
    els.dashMP.textContent      = mpCount.toLocaleString("hi-IN");
    els.dashRising.textContent  = rising.toLocaleString("hi-IN");
    els.dashFalling.textContent = falling.toLocaleString("hi-IN");
    els.dashHighest.textContent = prices.length ? "रु.\u00A0" + Math.max.apply(null, prices).toLocaleString("hi-IN") : "—";
    els.dashDate.textContent    = firstDate;

    if (els.heroUpdated)
      els.heroUpdated.textContent = firstDate || new Date().toLocaleTimeString("hi-IN", {hour:"2-digit", minute:"2-digit"});
  }

  /* ── MP spotlight ───────────────────────────────────────── */
  function renderMPSection(mpRecords) {
    if (!mpRecords.length) { els.mpSection.hidden = true; return; }
    els.mpSection.hidden = false;
    els.mpGrid.innerHTML = mpRecords.map(function (r) {
      var tc  = trendClass(r.trend);
      var chg = fmtChange(r.change);
      return [
        '<article class="bhav-mp-card">',
          '<div class="bhav-mp-card-name">' + r.nameHi + '</div>',
          '<div class="bhav-mp-card-en">' + r.nameEn + ' — ' + r.category + '</div>',
          '<div class="bhav-mp-card-price">' + (r.modal !== null ? "रु.\u00A0" + r.modal.toLocaleString("hi-IN") : "—") + '</div>',
          '<div class="bhav-mp-card-range">न्यूनतम: ' + (r.min !== null ? r.min.toLocaleString("hi-IN") : "—") + ' | अधिकतम: ' + (r.max !== null ? r.max.toLocaleString("hi-IN") : "—") + '</div>',
          '<span class="bhav-mp-card-change ' + tc + '">' + trendCard(r.trend) + ' &nbsp;' + chg + '</span>',
        '</article>'
      ].join("");
    }).join("");
  }

  /* ── Cards ──────────────────────────────────────────────── */
  function renderCards(records) {
    if (!records.length) {
      els.cards.innerHTML = ""; els.cardsEmpty.hidden = false; return;
    }
    els.cardsEmpty.hidden = true;
    els.cards.innerHTML = records.map(function (r) {
      var icon   = getIcon(r.nameEn);
      var tc     = trendClass(r.trend);
      var chg    = fmtChange(r.change);
      var iType  = r.isMP ? "mp" : "crop";
      return [
        '<article class="bhav-card">',
          '<div class="bhav-card-head">',
            '<div class="bhav-card-icon ' + iType + '"><i class="' + icon + '"></i></div>',
            '<div class="bhav-card-names">',
              '<div class="bhav-card-name-hi">' + r.nameHi + '</div>',
              '<div class="bhav-card-name-en">' + r.nameEn + '</div>',
            '</div>',
            '<span class="bhav-card-trend ' + tc + '">' + trendCard(r.trend) + '</span>',
          '</div>',
          '<div class="bhav-card-price">',
            '<span class="bhav-card-modal">' + (r.modal !== null ? "रु.\u00A0" + r.modal.toLocaleString("hi-IN") : "—") + '</span>',
            '<span class="bhav-card-unit">/ ' + r.unit + '</span>',
          '</div>',
          '<div class="bhav-card-range">',
            '<div class="bhav-card-range-item bhav-range-min"><span>' + (r.min !== null ? r.min.toLocaleString("hi-IN") : "—") + '</span><span>न्यूनतम</span></div>',
            '<div class="bhav-card-range-item bhav-range-max"><span>' + (r.max !== null ? r.max.toLocaleString("hi-IN") : "—") + '</span><span>अधिकतम</span></div>',
            '<div class="bhav-card-range-item bhav-range-change"><span>' + chg + '</span><span>बदलाव</span></div>',
          '</div>',
          '<div class="bhav-card-meta">',
            r.isMP
              ? '<span class="bhav-card-mp-badge"><i class="fa-solid fa-map-location-dot"></i> मध्य प्रदेश</span>'
              : '<span><i class="fa-solid fa-tag"></i>' + r.category + '</span>',
            r.date ? '<span><i class="fa-regular fa-calendar"></i>' + formatDate(r.date) + '</span>' : '',
          '</div>',
        '</article>'
      ].join("");
    }).join("");
  }

  /* ── Table ──────────────────────────────────────────────── */
  function renderTable(records) {
    if (!records.length) {
      els.tableBody.innerHTML = ""; els.tableEmpty.hidden = false; return;
    }
    els.tableEmpty.hidden = true;
    els.tableBody.innerHTML = records.map(function (r) {
      var chg  = fmtChange(r.change);
      var chgC = r.change > 0 ? "bhav-td-up" : r.change < 0 ? "bhav-td-down" : "bhav-td-same";
      var area = r.isMP
        ? '<span class="bhav-card-mp-badge"><i class="fa-solid fa-map-location-dot"></i> MP</span>'
        : r.district;
      return [
        "<tr>",
          '<td data-label="फसल" class="bhav-td-name"><strong>' + r.nameHi + '</strong><small>' + r.nameEn + '</small></td>',
          '<td data-label="श्रेणी">' + r.category + '</td>',
          '<td data-label="क्षेत्र">' + area + '</td>',
          '<td data-label="न्यूनतम" class="bhav-td-min">' + fmt(r.min) + '</td>',
          '<td data-label="मोडल" class="bhav-td-modal">' + fmt(r.modal) + '</td>',
          '<td data-label="अधिकतम" class="bhav-td-max">' + fmt(r.max) + '</td>',
          '<td data-label="बदलाव" class="' + chgC + '">' + chg + '</td>',
          '<td data-label="रुझान">' + trendHTML(r.trend) + '</td>',
          '<td data-label="इकाई">' + r.unit + '</td>',
        "</tr>"
      ].join("");
    }).join("");
  }

  /* ── Bar chart — MP crops highlighted in blue ───────────── */
  function drawBarChart(records) {
    var canvas = els.priceCanvas;
    if (!canvas) return;
    var ctx  = canvas.getContext("2d");
    var top10 = records.filter(function (r) { return r.max !== null; }).slice(0, 10);
    var W = canvas.clientWidth || 420, H = canvas.clientHeight || 300;
    var dpr = window.devicePixelRatio || 1;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (!top10.length) {
      ctx.fillStyle = "#829087"; ctx.font = "13px Noto Sans Devanagari";
      ctx.textAlign = "center"; ctx.fillText("डेटा उपलब्ध होने पर चार्ट दिखेगा", W / 2, H / 2); return;
    }

    var maxVal = Math.max.apply(null, top10.map(function (r) { return r.max; })) || 1;
    var PL = 52, PB = 44, PT = 18, PR = 12;
    var CW = W - PL - PR, CH = H - PT - PB;
    var gap = 8, bw = (CW - gap * (top10.length - 1)) / top10.length;

    for (var s = 0; s <= 4; s++) {
      var gy = PT + CH - CH * s / 4;
      ctx.strokeStyle = "#e5eee2"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PL, gy); ctx.lineTo(W - PR, gy); ctx.stroke();
      ctx.fillStyle = "#91a098"; ctx.font = "9px Karla"; ctx.textAlign = "right";
      ctx.fillText(Math.round(maxVal * s / 4).toLocaleString("hi-IN"), PL - 4, gy + 3);
    }

    top10.forEach(function (r, i) {
      var bH = CH * r.max / maxVal;
      var x  = PL + i * (bw + gap), y = PT + CH - bH;
      ctx.fillStyle = r.isMP ? "#1a5080" : (i % 2 ? "#e8753d" : "#176b45");
      var rad = Math.min(4, bw / 2);
      ctx.beginPath();
      ctx.moveTo(x + rad, y); ctx.lineTo(x + bw - rad, y);
      ctx.quadraticCurveTo(x + bw, y, x + bw, y + rad);
      ctx.lineTo(x + bw, y + bH); ctx.lineTo(x, y + bH);
      ctx.lineTo(x, y + rad); ctx.quadraticCurveTo(x, y, x + rad, y);
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = "#294f3b"; ctx.font = "bold 9px Karla"; ctx.textAlign = "center";
      ctx.fillText(r.max.toLocaleString("hi-IN"), x + bw / 2, Math.max(y - 4, 12));
      ctx.fillStyle = "#50675a"; ctx.font = "9px Noto Sans Devanagari";
      var lbl = r.nameHi.length > 6 ? r.nameHi.slice(0, 5) + "…" : r.nameHi;
      ctx.fillText(lbl, x + bw / 2, H - 6);
    });

    ctx.strokeStyle = "#c4d8c0"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, PT); ctx.lineTo(PL, PT + CH); ctx.lineTo(W - PR, PT + CH); ctx.stroke();

    // Legend
    ctx.fillStyle = "#1a5080"; ctx.fillRect(PL, 4, 10, 8);
    ctx.fillStyle = "#50675a"; ctx.font = "9px Noto Sans Devanagari"; ctx.textAlign = "left";
    ctx.fillText("मध्य प्रदेश", PL + 13, 12);
    ctx.fillStyle = "#176b45"; ctx.fillRect(PL + 100, 4, 10, 8);
    ctx.fillText("अन्य फसल", PL + 113, 12);
  }

  /* ── Trend donut ────────────────────────────────────────── */
  function drawTrendChart(records) {
    var canvas = els.trendCanvas;
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var rising  = records.filter(function (r) { return r.trend === "up";   }).length;
    var falling = records.filter(function (r) { return r.trend === "down"; }).length;
    var stable  = records.filter(function (r) { return r.trend === "same"; }).length;
    var total = rising + falling + stable;
    var W = canvas.clientWidth || 300, H = canvas.clientHeight || 300;
    var dpr = window.devicePixelRatio || 1;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (!total) {
      ctx.fillStyle = "#829087"; ctx.font = "13px Noto Sans Devanagari";
      ctx.textAlign = "center"; ctx.fillText("डेटा उपलब्ध नहीं", W / 2, H / 2); return;
    }

    var cx = W / 2, cy = H / 2;
    var outerR = Math.min(W, H) / 2 - 28, innerR = outerR * 0.52;
    var segs = [
      { count: rising,  color: "#1e9155", label: "बढ़त"    },
      { count: falling, color: "#c0392b", label: "गिरावट" },
      { count: stable,  color: "#b0b8b4", label: "स्थिर"  }
    ];
    var angle = -Math.PI / 2;
    segs.forEach(function (seg) {
      if (!seg.count) return;
      var sweep = seg.count / total * 2 * Math.PI;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, outerR, angle, angle + sweep);
      ctx.closePath(); ctx.fillStyle = seg.color; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff"; ctx.fill();
      var midA = angle + sweep / 2;
      var lx = cx + (outerR + 16) * Math.cos(midA), ly = cy + (outerR + 16) * Math.sin(midA);
      var pct = Math.round(seg.count / total * 100);
      if (pct > 4) {
        ctx.fillStyle = seg.color; ctx.font = "bold 11px Karla"; ctx.textAlign = "center";
        ctx.fillText(pct + "%", lx, ly);
        ctx.font = "9px Noto Sans Devanagari"; ctx.fillText(seg.label, lx, ly + 12);
      }
      angle += sweep;
    });
    ctx.fillStyle = "#194530"; ctx.font = "bold 20px Karla"; ctx.textAlign = "center";
    ctx.fillText(total.toLocaleString("hi-IN"), cx, cy + 6);
    ctx.fillStyle = "#7a8c80"; ctx.font = "10px Noto Sans Devanagari";
    ctx.fillText("फसलें", cx, cy + 20);
    var legY = cy + outerR + 22, legX = cx - (segs.length - 1) * 80 / 2;
    segs.forEach(function (seg, i) {
      var lx = legX + i * 80;
      ctx.fillStyle = seg.color; ctx.fillRect(lx - 6, legY - 8, 12, 8);
      ctx.fillStyle = "#50675a"; ctx.font = "9px Noto Sans Devanagari"; ctx.textAlign = "center";
      ctx.fillText(seg.label + " (" + seg.count + ")", lx, legY + 8);
    });
  }

  /* ── Filter + sort ──────────────────────────────────────── */
  function applyFilters() {
    var q  = (els.search.value   || "").trim().toLowerCase();
    var cv = (els.category.value || "");
    var tv = (els.trend.value    || "");
    var sv = (els.sort.value     || "default");

    var result = state.all.filter(function (r) {
      var ms = !q || r.nameHi.toLowerCase().indexOf(q) !== -1 || r.nameEn.toLowerCase().indexOf(q) !== -1;
      var mc = !cv || r.category === cv;
      var mt = !tv || r.trend === tv;
      return ms && mc && mt;
    });

    result = result.slice();
    if      (sv === "default")     result.sort(function (a, b) { return (b.isMP ? 1 : 0) - (a.isMP ? 1 : 0); });
    else if (sv === "price_high")  result.sort(function (a, b) { return (b.modal || 0) - (a.modal || 0); });
    else if (sv === "price_low")   result.sort(function (a, b) { return (a.modal || 0) - (b.modal || 0); });
    else if (sv === "change_high") result.sort(function (a, b) { return (b.change || 0) - (a.change || 0); });
    else if (sv === "name_az")     result.sort(function (a, b) { return a.nameEn.localeCompare(b.nameEn); });

    state.filtered = result;
    renderAll();
  }

  /* ── Render all ─────────────────────────────────────────── */
  function renderAll() {
    var records = state.filtered;
    els.resultMeta.hidden = false;
    els.resultCount.textContent = records.length.toLocaleString("hi-IN");
    if (state.view === "cards") renderCards(records);
    else                        renderTable(records);
    if (records.length) {
      els.chartsSection.hidden = false;
      setTimeout(function () { drawBarChart(records); drawTrendChart(records); }, 0);
    } else {
      els.chartsSection.hidden = true;
    }
  }

  /* ── Source badge ───────────────────────────────────────── */
  function setSourceBadge(isDemo) {
    if (els.liveBadge) {
      els.liveBadge.className = isDemo ? "bhav-live-badge bhav-demo-badge" : "bhav-live-badge";
      els.liveBadge.innerHTML = "<i></i> " + (isDemo ? "डेमो डेटा" : "लाइव डेटा");
    }
    els.demo.hidden = !isDemo;
  }

  function showLoading() {
    els.skeleton.hidden      = false;
    els.error.hidden         = true;
    els.resultMeta.hidden    = true;
    els.chartsSection.hidden = true;
    els.mpSection.hidden     = true;
  }
  function hideLoading() { els.skeleton.hidden = true; }

  /* ── Main load ──────────────────────────────────────────── */
  async function loadData() {
    showLoading();
    try {
      var result = await window.BhavAPI.fetchCrops();
      state.all    = result.records.map(normalise);
      state.isDemo = result.isDemo;
      state.mpOnly = state.all.filter(function (r) { return r.isMP; });
      setSourceBadge(result.isDemo);
      if (els.heroUpdated) {
        els.heroUpdated.textContent = result.updated
          ? new Date(result.updated).toLocaleTimeString("hi-IN", {hour:"2-digit", minute:"2-digit"})
          : (result.isDemo ? "डेमो डेटा" : new Date().toLocaleTimeString("hi-IN", {hour:"2-digit", minute:"2-digit"}));
      }
    } catch (err) {
      hideLoading();
      els.error.hidden = false;
      els.errorText.textContent = "भाव प्राप्त नहीं हो सके: " + err.message;
      return;
    }
    hideLoading();
    buildCategories(state.all);
    updateDashboard(state.all);
    renderMPSection(state.mpOnly);
    applyFilters();
  }

  /* ── View switch ────────────────────────────────────────── */
  function switchView(view) {
    state.view = view;
    els.tabCards.classList.toggle("active", view === "cards");
    els.tabTable.classList.toggle("active", view === "table");
    els.tabCards.setAttribute("aria-selected", String(view === "cards"));
    els.tabTable.setAttribute("aria-selected", String(view === "table"));
    els.cardsView.hidden = view !== "cards";
    els.tableView.hidden = view !== "table";
    renderAll();
  }

  /* ── Events ─────────────────────────────────────────────── */
  els.search.addEventListener("input",    applyFilters);
  els.category.addEventListener("change", applyFilters);
  els.trend.addEventListener("change",    applyFilters);
  els.sort.addEventListener("change",     applyFilters);
  els.refresh.addEventListener("click",   loadData);
  els.retry.addEventListener("click",     loadData);
  els.retryLive.addEventListener("click", loadData);
  els.reset.addEventListener("click", function () {
    els.search.value = ""; els.category.value = ""; els.trend.value = ""; els.sort.value = "default";
    applyFilters();
  });
  els.tabCards.addEventListener("click", function () { switchView("cards"); });
  els.tabTable.addEventListener("click", function () { switchView("table"); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (state.filtered.length) { drawBarChart(state.filtered); drawTrendChart(state.filtered); }
    }, 200);
  });

  loadData();

})();
