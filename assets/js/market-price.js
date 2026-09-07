document.addEventListener("DOMContentLoaded", function () {
  var apiBase = window.APNA_KISAAN_MARKET_API;
  var apiKey = window.APNA_KISAAN_MARKET_API_KEY || new URLSearchParams(window.location.search).get("apiKey");
  var districtMap = { "दमोह": "Damoh", "पन्ना": "Panna", "छतरपुर": "Chhatarpur", "भोपाल": "Bhopal", "राजगढ़": "Rajgarh", "सागर": "Sagar", "नरसिंहपुर": "Narsimhapur", "जबलपुर": "Jabalpur", "ग्वालियर": "Gwalior", "बालाघाट": "Balaghat", "रीवा": "Rewa", "टीकमगढ़": "Tikamgarh" };
  var vegetableMap = { "टमाटर": ["tomato", "tomatoes"], "प्याज": ["onion", "onions"], "आलू": ["potato", "potatoes"], "बैंगन": ["brinjal", "eggplant"], "फूलगोभी": ["cauliflower"], "भिंडी": ["okra", "lady finger"], "मिर्च": ["chilli", "green chilli"], "गोभी": ["cabbage"], "गाजर": ["carrot"], "लहसुन": ["garlic"] };
  var state = { records: [], filtered: [], demo: false };
  var demoDistricts = ["दमोह", "पन्ना", "छतरपुर", "भोपाल", "राजगढ़", "सागर", "नरसिंहपुर", "जबलपुर", "ग्वालियर", "बालाघाट", "रीवा", "टीकमगढ़"];
  var demoVegetables = [["टमाटर", 1800, 2600], ["प्याज", 2200, 3200], ["आलू", 1400, 2100], ["बैंगन", 1600, 2400], ["फूलगोभी", 2000, 3000], ["भिंडी", 2800, 4200], ["हरी मिर्च", 3500, 5200], ["पत्तागोभी", 1200, 1900], ["गाजर", 2400, 3600], ["लहसुन", 7000, 9800]];
  var select = document.getElementById("districtSelect");
  var search = document.getElementById("vegetableSearch");
  var date = document.getElementById("priceDate");
  var body = document.getElementById("priceTableBody");
  var empty = document.getElementById("marketEmpty");
  var loading = document.getElementById("marketLoading");
  var error = document.getElementById("marketError");
  var errorText = document.getElementById("marketErrorText");
  if (!date.value) date.value = new Date().toISOString().slice(0, 10);

  function formatDate(value) {
    if (!value) return "आज";
    var parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("hi-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  function number(value) {
    var parsed = Number(String(value || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function normalize(record) {
    var district = record.district || record.District || "";
    var commodity = record.commodity || record.Commodity || record.item || "";
    return { district: district, market: record.market || record.Market || "-", commodity: commodity, min: number(record.min_price || record.Min_x0020_Price || record.minPrice), max: number(record.max_price || record.Max_x0020_Price || record.maxPrice), modal: number(record.modal_price || record.Modal_x0020_Price || record.modalPrice), unit: record.unit || "रु./क्विंटल", date: record.arrival_date || record.Arrival_x0020_Date || "" };
  }

  function createDemoRecords() {
    var today = new Date().toISOString().slice(0, 10);
    return demoDistricts.reduce(function (records, district, districtIndex) {
      demoVegetables.forEach(function (vegetable, vegetableIndex) {
        var adjustment = ((districtIndex * 137 + vegetableIndex * 83) % 500) - 250;
        records.push({ district: district, market: district + " सब्जी मंडी", commodity: vegetable[0], min: vegetable[1] + adjustment, max: vegetable[2] + adjustment, modal: Math.round((vegetable[1] + vegetable[2]) / 2) + adjustment, unit: "रु./क्विंटल", date: today });
      });
      return records;
    }, []);
  }

  function setSourceLabel(isDemo) {
    var badge = document.querySelector(".live-badge");
    var notice = document.getElementById("marketDemoNotice");
    var source = document.getElementById("lastUpdated");
    if (badge) badge.innerHTML = '<i></i> ' + (isDemo ? "डेमो डेटा" : "लाइव डेटा");
    if (notice) notice.hidden = !isDemo;
    if (source && isDemo) source.textContent = "डेमो भाव";
  }

  function renderTable() {
    body.innerHTML = state.filtered.map(function (record) {
      return "<tr><td data-label=\"सब्जी\"><strong>" + record.commodity + "</strong></td><td data-label=\"बाजार\">" + record.market + "</td><td data-label=\"जिला\">" + record.district + "</td><td data-label=\"न्यूनतम भाव\">रु. " + (record.min === null ? "-" : record.min.toLocaleString("hi-IN")) + "</td><td data-label=\"अधिकतम भाव\" class=\"price-high\">रु. " + (record.max === null ? "-" : record.max.toLocaleString("hi-IN")) + "</td><td data-label=\"इकाई\">" + record.unit + "</td></tr>";
    }).join("");
    empty.hidden = state.filtered.length !== 0;
    document.getElementById("recordCount").textContent = state.filtered.length.toLocaleString("hi-IN");
    var maximum = state.filtered.map(function (record) { return record.max; }).filter(function (value) { return value !== null; });
    document.getElementById("highestPrice").textContent = maximum.length ? "रु. " + Math.max.apply(null, maximum).toLocaleString("hi-IN") : "-";
    document.getElementById("priceDateLabel").textContent = state.filtered[0] ? formatDate(state.filtered[0].date) : "-";
    drawChart(state.filtered);
  }

  function applyFilters() {
    var selected = districtMap[select.value] || "";
    var query = search.value.trim().toLocaleLowerCase("hi");
    state.filtered = state.records.filter(function (record) {
      var districtMatch = !selected || record.district.toLocaleLowerCase("en").indexOf(selected.toLocaleLowerCase("en")) !== -1 || record.district.indexOf(select.value) !== -1;
      var commodityNames = vegetableMap[query] || [query];
      var commodityMatch = !query || record.commodity.toLocaleLowerCase("hi").indexOf(query) !== -1 || commodityNames.some(function (name) { return record.commodity.toLocaleLowerCase("en").indexOf(name) !== -1; });
      return districtMatch && commodityMatch;
    });
    renderTable();
  }

  function drawChart(records) {
    var canvas = document.getElementById("priceChart");
    var context = canvas.getContext("2d");
    var width = canvas.clientWidth || 420;
    var height = canvas.clientHeight || 320;
    var ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    var chart = records.filter(function (record) { return record.max !== null; }).slice(0, 8);
    if (!chart.length) { context.fillStyle = "#829087"; context.font = "13px Noto Sans Devanagari"; context.textAlign = "center"; context.fillText("डेटा उपलब्ध होने पर चार्ट दिखेगा", width / 2, height / 2); return; }
    var maxValue = Math.max.apply(null, chart.map(function (record) { return record.max; })) || 1;
    var left = 38, bottom = 38, top = 20, barGap = 10, chartWidth = width - left - 15, barWidth = (chartWidth - barGap * (chart.length - 1)) / chart.length;
    context.strokeStyle = "#e5eee2"; context.lineWidth = 1; context.beginPath(); context.moveTo(left, top); context.lineTo(left, height - bottom); context.lineTo(width - 10, height - bottom); context.stroke();
    chart.forEach(function (record, index) {
      var barHeight = ((height - bottom - top) * record.max) / maxValue;
      var x = left + index * (barWidth + barGap); var y = height - bottom - barHeight;
      context.fillStyle = index % 2 ? "#e8753d" : "#176b45"; context.fillRect(x, y, barWidth, barHeight);
      context.fillStyle = "#50675a"; context.font = "10px Noto Sans Devanagari"; context.textAlign = "center"; context.fillText(record.commodity.slice(0, 8), x + barWidth / 2, height - 17);
      context.fillStyle = "#294f3b"; context.font = "bold 10px Karla"; context.fillText(String(record.max), x + barWidth / 2, Math.max(y - 5, 12));
    });
  }

  async function loadPrices() {
    if (!apiBase) { showError("API endpoint configured नहीं है।"); return; }
    loading.hidden = false; error.hidden = true;
    var params = new URLSearchParams({ format: "json", limit: "500" });
    if (apiKey) params.set(apiBase.indexOf("/api/market") === -1 ? "api-key" : "apiKey", apiKey);
    params.set("filters[state]", "Madhya Pradesh");
    if (select.value) params.set(apiBase.indexOf("/api/market") === -1 ? "filters[district]" : "district", districtMap[select.value] || select.value);
    if (date.value) params.set(apiBase.indexOf("/api/market") === -1 ? "filters[arrival_date]" : "date", date.value.split("-").reverse().join("/"));
    try {
      var response = await fetch(apiBase + "?" + params.toString(), { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("API ने " + response.status + " response दिया।");
      var payload = await response.json();
      var records = Array.isArray(payload.records) ? payload.records.map(normalize).filter(function (record) { return record.commodity; }) : [];
      state.demo = false; setSourceLabel(false); state.records = records; applyFilters();
      document.getElementById("lastUpdated").textContent = new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" });
      document.querySelector("#priceDateLabel").title = "API से प्राप्त समय";
    } catch (requestError) {
      state.demo = true;
      setSourceLabel(true);
      state.records = createDemoRecords();
      applyFilters();
      error.hidden = true;
      document.getElementById("lastUpdated").title = "यह fallback उदाहरणात्मक डेटा है: " + requestError.message;
    }
    finally { loading.hidden = true; }
  }

  function showError(message) { loading.hidden = true; error.hidden = false; errorText.textContent = message; state.records = []; state.filtered = []; renderTable(); }
  select.addEventListener("change", loadPrices); search.addEventListener("input", applyFilters); date.addEventListener("change", loadPrices); document.getElementById("refreshPrices").addEventListener("click", loadPrices); document.getElementById("retryPrices").addEventListener("click", loadPrices); document.getElementById("retryLivePrices").addEventListener("click", loadPrices); window.addEventListener("resize", function () { drawChart(state.filtered); });
  loadPrices();
});
