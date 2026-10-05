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
    var num = C.whatsappNumber || "85261791102";
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

  /* 2. 表格直接喺新分頁開（唔再內嵌，避免手機碌唔落） */
  document.querySelectorAll("[data-open-form]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var el = document.getElementById("form-" + a.getAttribute("data-open-form"));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
