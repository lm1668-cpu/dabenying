/**
 * 最新請人／搵工公開板
 * - 有 board.feeds URL：JSONP 載入 Apps Script doGet
 * - 否則若 useSampleWhenEmpty：載入 assets/board/sample_feed.json（本地預覽）
 */
(function () {
  "use strict";
  var C = (window.SITE_CONFIG && window.SITE_CONFIG.board) || {};
  var root = document.getElementById("board");
  if (!root) return;

  var listEl = document.getElementById("board-list");
  var statusEl = document.getElementById("board-status");
  var emptyEl = document.getElementById("board-empty");
  var filtersEl = document.getElementById("board-filters");
  if (!listEl || !statusEl) return;

  var LABEL = { find_job: "搵工", hire: "請人" };
  var FIELD_LABEL = {
    "稱呼【刊登】": "稱呼",
    "公司／判頭名稱【刊登】": "公司／判頭",
    "聯絡人稱呼【刊登】": "聯絡人",
    "工種【刊登】": "工種",
    "需要工種【刊登】": "需要工種",
    "入行年資【刊登】": "年資",
    "持有證件（自行申報）【刊登】": "證件（自行申報）",
    "最快可開工日期【刊登】": "最快開工",
    "可接受工作地區【刊登】": "地區",
    "工作地區【刊登】": "地區",
    "工作形式【刊登】": "形式",
    "期望人工【刊登】": "期望人工",
    "需要人數【刊登】": "人數",
    "工程類別【刊登】": "類別",
    "開工日期【刊登】": "開工",
    "預計工期【刊登】": "工期",
    "人工方式【刊登】": "人工方式",
    "人工金額【刊登】": "人工金額",
    "證件要求【刊登】": "證件要求",
    "補充資料【刊登】": "補充",
    "其他要求或備註【刊登】": "備註",
    "公開聯絡方法【刊登】": "聯絡"
  };
  var SKIP_IN_BODY = {
    "公開聯絡方法【刊登】": true,
    "工種【刊登】": true,
    "需要工種【刊登】": true,
    "稱呼【刊登】": true,
    "公司／判頭名稱【刊登】": true,
    "聯絡人稱呼【刊登】": true
  };

  var TRADE_CHIPS = [
    "全部", "搵工", "請人",
    "清拆", "泥水", "木工", "木地板", "雲石", "油漆", "玻璃",
    "電工", "水喉", "冷氣", "鋁窗", "雜工", "搬運", "清潔", "家居維修"
  ];

  var allPosts = [];
  var activeFilter = "全部";

  function setStatus(msg, isError) {
    statusEl.textContent = msg || "";
    statusEl.hidden = !msg;
    statusEl.classList.toggle("board-status--err", !!isError);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatWhen(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    try {
      return new Intl.DateTimeFormat("zh-HK", {
        timeZone: "Asia/Hong_Kong",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(d) + "（HKT）";
    } catch (e) {
      return String(iso);
    }
  }

  function titleOf(p) {
    var f = p.fields || {};
    if (p.form_type === "hire") {
      return (f["公司／判頭名稱【刊登】"] || f["聯絡人稱呼【刊登】"] || "請人") +
        (p.trades && p.trades.length ? " · " + p.trades.join("、") : "");
    }
    return (f["稱呼【刊登】"] || "搵工") +
      (p.trades && p.trades.length ? " · " + p.trades.join("、") : "");
  }

  function matchesFilter(p, filter) {
    if (!filter || filter === "全部") return true;
    if (filter === "搵工") return p.form_type === "find_job";
    if (filter === "請人") return p.form_type === "hire";
    var trades = (p.trades || []).join(" ");
    var raw = ((p.fields && (p.fields["工種【刊登】"] || p.fields["需要工種【刊登】"])) || "") + " " + trades;
    return raw.indexOf(filter) !== -1;
  }

  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML = "";
    TRADE_CHIPS.forEach(function (name) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = name;
      btn.setAttribute("data-board-filter", name);
      btn.setAttribute("aria-pressed", String(name === activeFilter));
      btn.addEventListener("click", function () {
        activeFilter = name;
        filtersEl.querySelectorAll("[data-board-filter]").forEach(function (c) {
          c.setAttribute("aria-pressed", String(c.getAttribute("data-board-filter") === activeFilter));
        });
        renderList();
      });
      filtersEl.appendChild(btn);
    });
  }

  function renderList() {
    var shown = allPosts.filter(function (p) { return matchesFilter(p, activeFilter); });
    listEl.innerHTML = "";
    if (emptyEl) emptyEl.hidden = shown.length > 0;
    shown.forEach(function (p) {
      var f = p.fields || {};
      var li = document.createElement("li");
      li.className = "board-card";
      li.setAttribute("data-form-type", p.form_type || "");
      var bodyBits = [];
      Object.keys(f).forEach(function (k) {
        if (SKIP_IN_BODY[k]) return;
        var label = FIELD_LABEL[k] || k.replace("【刊登】", "");
        bodyBits.push(
          "<div class=\"board-row\"><span class=\"board-k\">" + esc(label) + "</span><span class=\"board-v\">" + esc(f[k]) + "</span></div>"
        );
      });
      li.innerHTML =
        "<div class=\"board-card-top\">" +
          "<span class=\"board-badge board-badge--" + esc(p.form_type || "") + "\">" +
            esc(LABEL[p.form_type] || p.form_type || "") +
          "</span>" +
          "<time class=\"board-time\" datetime=\"" + esc(p.published_at || "") + "\">" +
            esc(formatWhen(p.published_at)) +
          "</time>" +
        "</div>" +
        "<h3 class=\"board-title\">" + esc(titleOf(p)) + "</h3>" +
        (p.trades && p.trades.length
          ? "<p class=\"board-trades\">" + p.trades.map(function (t) {
              return "<span class=\"board-trade-pill\">" + esc(t) + "</span>";
            }).join("") + "</p>"
          : "") +
        (bodyBits.length ? "<div class=\"board-dl\">" + bodyBits.join("") + "</div>" : "") +
        "<p class=\"board-contact\"><span class=\"board-contact-label\">聯絡</span> " +
          esc(p.contact || f["公開聯絡方法【刊登】"] || "聯絡方法未提供") + "</p>";
      listEl.appendChild(li);
    });
  }

  function mergeFeeds(results) {
    var posts = [];
    results.forEach(function (r) {
      if (!r || !r.posts) return;
      r.posts.forEach(function (p) { posts.push(p); });
    });
    posts.sort(function (a, b) {
      return String(b.published_at || "").localeCompare(String(a.published_at || ""));
    });
    return posts;
  }

  function jsonp(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var cbName = "_boardCb" + String(Math.random()).slice(2);
      var timer = setTimeout(function () {
        cleanup();
        reject(new Error("timeout"));
      }, timeoutMs || 12000);
      function cleanup() {
        clearTimeout(timer);
        try { delete window[cbName]; } catch (e) { window[cbName] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }
      window[cbName] = function (data) {
        cleanup();
        resolve(data);
      };
      var script = document.createElement("script");
      script.async = true;
      script.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + cbName;
      script.onerror = function () {
        cleanup();
        reject(new Error("script error"));
      };
      document.head.appendChild(script);
    });
  }

  function fetchJson(url) {
    return fetch(url, { credentials: "omit" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  function load() {
    if (C.enabled === false) {
      setStatus("公開板暫時關閉。");
      if (filtersEl) {
        filtersEl.innerHTML = "";
        filtersEl.hidden = true;
      }
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    var feeds = C.feeds || {};
    var urls = [];
    if (feeds.find_job) urls.push({ key: "find_job", url: feeds.find_job });
    if (feeds.hire) urls.push({ key: "hire", url: feeds.hire });

    if (!urls.length) {
      if (C.useSampleWhenEmpty !== false) {
        setStatus("示範資料（尚未接上正式 feed；部署 Web App 後填 config.js）");
        fetchJson(C.sampleUrl || "assets/board/sample_feed.json")
          .then(function (data) {
            allPosts = (data && data.posts) || [];
            renderFilters();
            renderList();
          })
          .catch(function () {
            setStatus("未能載入示範資料。", true);
            if (emptyEl) emptyEl.hidden = false;
          });
      } else {
        setStatus("暫時未有公開帖文——歡迎你率先出帖。");
        if (filtersEl) {
          filtersEl.innerHTML = "";
          filtersEl.hidden = true;
        }
        if (emptyEl) emptyEl.hidden = false;
      }
      return;
    }

    setStatus("載入最新帖文…");
    var jobs = urls.map(function (u) {
      return jsonp(u.url).catch(function () {
        // 後備：偶發可 fetch（多數 Apps Script 會 CORS 失敗）
        return fetchJson(u.url).catch(function () { return { posts: [] }; });
      });
    });

    Promise.all(jobs).then(function (results) {
      allPosts = mergeFeeds(results);
      if (!allPosts.length) {
        setStatus("");
        if (filtersEl) {
          filtersEl.innerHTML = "";
          filtersEl.hidden = true;
        }
        if (emptyEl) emptyEl.hidden = false;
        renderList();
        return;
      }
      if (filtersEl) filtersEl.hidden = false;
      setStatus("共 " + allPosts.length + " 則（只顯示標【刊登】嘅公開欄位）");
      renderFilters();
      renderList();
    }).catch(function () {
      setStatus("載入失敗，請稍後再試。你仍可喺上面自行刊登。", true);
      if (emptyEl) emptyEl.hidden = false;
    });
  }

  load();
})();
