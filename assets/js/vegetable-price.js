/* =============================================================
   vegetable-price.js  v2
   Uses BhavAPI.fetchVegetables() from bhav-api.js for the
   proxy → direct → demo fallback chain.
   Drives: dashboard, card grid, table, bar chart, trend donut.
   Search: Hindi + English. Filters: category, trend, sort.
   ============================================================= */

(function () {
  "use strict";

  /* ── DOM refs ───────────────────────────────────────────── */
  var els = {
    search:        document.getElementById("vegSearch"),
    category:      document.getElementById("vegCategory"),
    trend:         document.getElementById("vegTrend"),
    sort:          document.getElementById("vegSort"),
    refresh:       document.getElementById("vegRefresh"),
    reset:         document.getElementById("vegReset"),
    error:         document.getElementById("vegError"),
    errorText:     document.getElementById("vegErrorText"),
    retry:         document.getElementById("vegRetry"),
    demo:          document.getElementById("vegDemo"),
    retryLive:     document.getElementById("vegRetryLive"),
    skeleton:      document.getElementById("vegSkeleton"),
    resultMeta:    document.getElementById("vegResultMeta"),
    resultCount:   document.getElementById("vegResultCount"),
    tabCards:      document.getElementById("tabCards"),
    tabTable:      document.getElementById("tabTable"),
    cardsView:     document.getElementById("vegCardsView"),
    cards:         document.getElementById("vegCards"),
    cardsEmpty:    document.getElementById("vegCardsEmpty"),
    tableView:     document.getElementById("vegTableView"),
    tableBody:     document.getElementById("vegTableBody"),
    tableEmpty:    document.getElementById("vegTableEmpty"),
    liveBadge:     document.getElementById("vegLiveBadge"),
    chartsSection: document.getElementById("vegChartsSection"),
    priceCanvas:   document.getElementById("vegPriceChart"),
    trendCanvas:   document.getElementById("vegTrendChart"),
    heroUpdated:   document.getElementById("heroLastUpdated"),
    dashTotal:     document.getElementById("dashTotal"),
    dashRising:    document.getElementById("dashRising"),
    dashFalling:   document.getElementById("dashFalling"),
    dashStable:    document.getElementById("dashStable"),
    dashHighest:   document.getElementById("dashHighest"),
    dashLowest:    document.getElementById("dashLowest")
  };

  /* ── State ──────────────────────────────────────────────── */
  var state = { all: [], filtered: [], isDemo: false, view: "cards" };

  /* ── Icon map ───────────────────────────────────────────── */
  var VEG_ICONS = {
    tomato:"fa-solid fa-circle", onion:"fa-solid fa-circle-half-stroke",
    potato:"fa-solid fa-egg", brinjal:"fa-solid fa-egg", eggplant:"fa-solid fa-egg",
    cauliflower:"fa-solid fa-cloud", cabbage:"fa-solid fa-leaf",
    okra:"fa-solid fa-seedling", carrot:"fa-solid fa-carrot",
    radish:"fa-solid fa-seedling", spinach:"fa-solid fa-leaf",
    peas:"fa-solid fa-circle-dot", beans:"fa-solid fa-seedling",
    cucumber:"fa-solid fa-seedling", gourd:"fa-solid fa-seedling",
    capsicum:"fa-solid fa-pepper-hot", chilli:"fa-solid fa-pepper-hot",
    coriander:"fa-solid fa-leaf", ginger:"fa-solid fa-seedling",
    garlic:"fa-solid fa-circle-dot", mushroom:"fa-solid fa-circle",
    "default":"fa-solid fa-leaf"
  };

  function getIcon(nameEn) {
    if (!nameEn) return VEG_ICONS["default"];
    var key = nameEn.toLowerCase();
    for (var k in VEG_ICONS) {
      if (k !== "default" && key.indexOf(k) !== -1) return VEG_ICONS[k];
    }
    return VEG_ICONS["default"];
  }

  /* ── Normalise a record coming from bhav-api.js ─────────── */
  function normalise(raw) {
    function num(v) {
      if (v === null || v === undefined) return null;
      var n = Number(String(v).replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? n : null;
    }
    return {
      nameHi:   raw.commodity      || raw.commodity_en || "—",
      nameEn:   raw.commodity_en   || raw.commodity    || "—",
      category: raw.category       || "सब्जियां",
      min:      num(raw.min_price),
      max:      num(raw.max_price),
      modal:    num(raw.modal_price),
      change:   num(raw.change),
      trend:    (raw.trend || "same").toLowerCase(),
      unit:     raw.unit           || "रु./क्विंटल",
      date:     raw.arrival_date   || raw.updated || ""
    };
  }

  /* ── Format helpers ─────────────────────────────────────── */
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

  /* ── Populate category dropdown ─────────────────────────── */
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
  function updateDashboard(records) {
    var rising  = records.filter(function (r) { return r.trend === "up";   }).length;
    var falling = records.filter(function (r) { return r.trend === "down"; }).length;
    var stable  = records.filter(function (r) { return r.trend === "same"; }).length;
    var prices  = records.map(function (r) { return r.modal; }).filter(function (v) { return v !== null; });
    els.dashTotal.textContent   = records.length.toLocaleString("hi-IN");
    els.dashRising.textContent  = rising.toLocaleString("hi-IN");
    els.dashFalling.textContent = falling.toLocaleString("hi-IN");
    els.dashStable.textContent  = stable.toLocaleString("hi-IN");
    els.dashHighest.textContent = prices.length ? "रु.\u00A0" + Math.max.apply(null, prices).toLocaleString("hi-IN") : "—";
    els.dashLowest.textContent  = prices.length ? "रु.\u00A0" + Math.min.apply(null, prices).toLocaleString("hi-IN") : "—";
    if (els.heroUpdated && records.length)
      els.heroUpdated.textContent = formatDate(records[0].date) || new Date().toLocaleTimeString("hi-IN", {hour:"2-digit", minute:"2-digit"});
  }

  /* ── Render cards ───────────────────────────────────────── */
  function renderCards(records) {
    if (!records.length) {
      els.cards.innerHTML = "";
      els.cardsEmpty.hidden = false;
      return;
    }
    els.cardsEmpty.hidden = true;
    els.cards.innerHTML = records.map(function (r) {
      var icon = getIcon(r.nameEn);
      var tc   = trendClass(r.trend);
      var chg  = r.change === null ? "—" : fmtChange(r.change);
      return [
        '<article class="bhav-card">',
          '<div class="bhav-card-head">',
            '<div class="bhav-card-icon veg"><i class="' + icon + '"></i></div>',
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
            '<div class="bhav-card-range-item bhav-range-min">',
              '<span>' + (r.min !== null ? r.min.toLocaleString("hi-IN") : "—") + '</span>',
              '<span>न्यूनतम</span>',
            '</div>',
            '<div class="bhav-card-range-item bhav-range-max">',
              '<span>' + (r.max !== null ? r.max.toLocaleString("hi-IN") : "—") + '</span>',
              '<span>अधिकतम</span>',
            '</div>',
            '<div class="bhav-card-range-item bhav-range-change">',
              '<span>' + chg + '</span>',
              '<span>बदलाव</span>',
            '</div>',
          '</div>',
          '<div class="bhav-card-meta">',
            '<span><i class="fa-solid fa-tag"></i>' + r.category + '</span>',
            r.date ? '<span><i class="fa-regular fa-calendar"></i>' + formatDate(r.date) + '</span>' : '',
          '</div>',
        '</article>'
      ].join("");
    }).join("");
  }

  /* ── Render table ───────────────────────────────────────── */
  function renderTable(records) {
    if (!records.length) {
      els.tableBody.innerHTML = "";
      els.tableEmpty.hidden = false;
      return;
    }
    els.tableEmpty.hidden = true;
    els.tableBody.innerHTML = records.map(function (r) {
      var chgStr = fmtChange(r.change);
      var chgCls = r.change > 0 ? "bhav-td-up" : r.change < 0 ? "bhav-td-down" : "bhav-td-same";
      return [
        "<tr>",
          '<td data-label="सब्जी" class="bhav-td-name"><strong>' + r.nameHi + '</strong><small>' + r.nameEn + '</small></td>',
          '<td data-label="श्रेणी">' + r.category + '</td>',
          '<td data-label="न्यूनतम" class="bhav-td-min">' + fmt(r.min) + '</td>',
          '<td data-label="मोडल" class="bhav-td-modal">' + fmt(r.modal) + '</td>',
          '<td data-label="अधिकतम" class="bhav-td-max">' + fmt(r.max) + '</td>',
          '<td data-label="बदलाव" class="' + chgCls + '">' + chgStr + '</td>',
          '<td data-label="रुझान">' + trendHTML(r.trend) + '</td>',
          '<td data-label="इकाई">' + r.unit + '</td>',
          '<td data-label="अपडेट">' + formatDate(r.date) + '</td>',
        "</tr>"
      ].join("");
    }).join("");
  }

  /* ── Bar chart (top-10 max prices) ─────────────────────── */
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
      ctx.textAlign = "center";
      ctx.fillText("डेटा उपलब्ध होने पर चार्ट दिखेगा", W / 2, H / 2);
      return;
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

    var COLORS = ["#176b45","#e8753d","#3a7cbf","#8aa832","#c47a1a","#1a7f6e","#9b59b6","#c0392b","#2980b9","#27ae60"];
    top10.forEach(function (r, i) {
      var bH = CH * r.max / maxVal;
      var x  = PL + i * (bw + gap), y = PT + CH - bH;
      var rad = Math.min(4, bw / 2);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.beginPath();
      ctx.moveTo(x + rad, y);
      ctx.lineTo(x + bw - rad, y);
      ctx.quadraticCurveTo(x + bw, y, x + bw, y + rad);
      ctx.lineTo(x + bw, y + bH); ctx.lineTo(x, y + bH);
      ctx.lineTo(x, y + rad);
      ctx.quadraticCurveTo(x, y, x + rad, y);
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = "#294f3b"; ctx.font = "bold 9px Karla"; ctx.textAlign = "center";
      ctx.fillText(r.max.toLocaleString("hi-IN"), x + bw / 2, Math.max(y - 4, 12));

      ctx.fillStyle = "#50675a"; ctx.font = "9px Noto Sans Devanagari";
      var lbl = r.nameHi.length > 6 ? r.nameHi.slice(0, 5) + "…" : r.nameHi;
      ctx.fillText(lbl, x + bw / 2, H - 6);
    });

    ctx.strokeStyle = "#c4d8c0"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, PT); ctx.lineTo(PL, PT + CH); ctx.lineTo(W - PR, PT + CH); ctx.stroke();
  }

  /* ── Trend donut chart ──────────────────────────────────── */
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
    ctx.fillText("कुल", cx, cy + 20);

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
    if      (sv === "price_high")  result.sort(function (a, b) { return (b.modal || 0) - (a.modal || 0); });
    else if (sv === "price_low")   result.sort(function (a, b) { return (a.modal || 0) - (b.modal || 0); });
    else if (sv === "change_high") result.sort(function (a, b) { return (b.change || 0) - (a.change || 0); });
    else if (sv === "change_low")  result.sort(function (a, b) { return (a.change || 0) - (b.change || 0); });
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

  /* ── Show/hide states ───────────────────────────────────── */
  function showLoading() {
    els.skeleton.hidden   = false;
    els.error.hidden      = true;
    els.resultMeta.hidden = true;
    els.chartsSection.hidden = true;
  }
  function hideLoading() { els.skeleton.hidden = true; }

  /* ── Main load ──────────────────────────────────────────── */
  async function loadData() {
    showLoading();
    try {
      var result = await window.BhavAPI.fetchVegetables();
      state.all    = result.records.map(normalise);
      state.isDemo = result.isDemo;
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

  /* ── Event listeners ────────────────────────────────────── */
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

  /* ── Bootstrap ──────────────────────────────────────────── */
  loadData();

})();
