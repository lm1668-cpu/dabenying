(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};

  /* 1. 設定字眼／連結 */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var v = C[el.getAttribute("data-cfg")];
    if (typeof v === "string" && v) el.textContent = v;
  });
  document.querySelectorAll("[data-cfg-href]").forEach(function (el) {
    var v = C[el.getAttribute("data-cfg-href")];
    if (typeof v === "string" && v) el.href = v;
  });
  function waUrl(kind) {
    var num = C.whatsappNumber || "85255304100";
    var t = (C.whatsappText && C.whatsappText[kind]) || "";
    return "https://wa.me/" + num + (t ? "?text=" + encodeURIComponent(t) : "");
  }
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = waUrl(el.getAttribute("data-wa"));
  });
  document.querySelectorAll("[data-form-link]").forEach(function (el) {
    var f = C.forms && C.forms[el.getAttribute("data-form-link")];
    if (f && f.view) el.href = f.view;
  });

  /* 2. 內嵌 Google 表格（撳先載入，唔拖慢首頁） */
  function openEmbed(kind, scroll) {
    var btn = document.querySelector('[data-embed="' + kind + '"]');
    var box = document.getElementById("embed-" + kind);
    var f = C.forms && C.forms[kind];
    if (!btn || !box || !f) return;
    if (!box.firstChild) {
      var ifr = document.createElement("iframe");
      ifr.src = f.view + (f.view.indexOf("?") > -1 ? "&" : "?") + "embedded=true";
      ifr.height = f.embedHeight || 2400;
      ifr.loading = "lazy";
      ifr.title = kind === "job" ? "搵工帖刊登表格" : "請人帖刊登表格";
      ifr.textContent = "載入緊…";
      box.appendChild(ifr);
    }
    var show = scroll ? true : box.hidden;
    box.hidden = !show;
    btn.setAttribute("aria-expanded", String(show));
    btn.textContent = show ? "收埋表格" : (kind === "job" ? "喺呢度填搵工帖" : "喺呢度填請人帖");
    if (scroll) document.getElementById("form-" + kind).scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.querySelectorAll("[data-embed]").forEach(function (btn) {
    btn.addEventListener("click", function () { openEmbed(btn.getAttribute("data-embed"), false); });
  });
  document.querySelectorAll("[data-open-form]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      openEmbed(a.getAttribute("data-open-form"), true);
      history.replaceState(null, "", a.getAttribute("href"));
    });
  });

  /* 3. 工種分類篩選 */
  var chips = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("#trade-grid li");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var lane = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      items.forEach(function (li) {
        li.hidden = !(lane === "all" || li.getAttribute("data-lane") === lane);
      });
    });
  });

  /* 4. 睇大圖 */
  var dlg = document.getElementById("lightbox");
  if (dlg && typeof dlg.showModal === "function") {
    var img = document.getElementById("lb-img");
    var title = document.getElementById("lb-title");
    var cap = document.getElementById("lb-cap");
    document.querySelectorAll("[data-full]").forEach(function (b) {
      b.addEventListener("click", function () {
        title.textContent = b.getAttribute("data-title") || "";
        cap.textContent = b.getAttribute("data-caption") || "";
        img.src = b.getAttribute("data-full");
        img.alt = b.getAttribute("data-title") || "";
        dlg.classList.toggle("is-round", b.getAttribute("data-round") === "1");
        dlg.showModal();
      });
    });
    dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }
})();
