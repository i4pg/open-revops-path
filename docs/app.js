/* The Open Accounting Path — bilingual (ع/EN) single-page app, vanilla JS */
(function () {
  "use strict";
  var D = window.CURRICULUM || {};
  var TRACKS = D.tracks || [];
  var SAUDI = D.saudi || null;
  var SAUDI_MODS = (SAUDI && SAUDI.modules) || [];

  var flatGlobal = [];
  TRACKS.forEach(function (t) { (t.modules || []).forEach(function (m) { flatGlobal.push(m); }); });
  var allMods = flatGlobal.concat(SAUDI_MODS);
  var byId = {};
  allMods.forEach(function (m) { byId[m.id] = m; });

  /* ---------- language ---------- */
  var LKEY = "orp-lang";
  var LANG = localStorage.getItem(LKEY) || "en";
  function rtl() { return LANG === "ar"; }
  var UI = {
    home: { en: "Home", ar: "الرئيسية" },
    curriculum: { en: "Curriculum", ar: "المنهج" },
    jurisdiction: { en: "Jurisdiction", ar: "المسار المحلّي" },
    more: { en: "More", ar: "المزيد" },
    projects: { en: "Projects", ar: "المشاريع" },
    certifications: { en: "Certifications", ar: "الشهادات المهنية" },
    tooling: { en: "Tooling", ar: "الأدوات" },
    career: { en: "Career & FAQ", ar: "المسار المهني والأسئلة" },
    about: { en: "About", ar: "حول المنهج" },
    arabicRes: { en: "Arabic resources", ar: "مصادر عربية" },
    searchPh: { en: "Search modules, topics, resources…", ar: "ابحث في الوحدات والمواضيع والمصادر…" },
    reset: { en: "Reset progress", ar: "إعادة ضبط التقدّم" },
    startAt: { en: "Start at module", ar: "ابدأ من الوحدة" },
    trackOverview: { en: "Track overview", ar: "نظرة عامة على المسار" },
    resources: { en: "Resources", ar: "المصادر" },
    why: { en: "Why it matters", ar: "لماذا تهمّ هذه الوحدة" },
    byEnd: { en: "By the end you'll be able to:", ar: "في نهاية الوحدة ستكون قادرًا على:" },
    project: { en: "Project", ar: "مشروع تطبيقي" },
    buildThis: { en: "Build this", ar: "نفّذ هذا" },
    checkpoint: { en: "Checkpoint", ar: "نقطة تحقّق" },
    doneWhen: { en: "You're done when", ar: "تكون قد أتقنتها عندما" },
    markDone: { en: "Mark this module complete", ar: "علّم هذه الوحدة كمكتملة" },
    prev: { en: "Previous", ar: "السابق" },
    next: { en: "Next", ar: "التالي" },
    prereqs: { en: "Prerequisites", ar: "المتطلبات السابقة" },
    none: { en: "none", ar: "لا يوجد" },
    readFirst: { en: "Saudi overlay — read these global modules first", ar: "إضافة سعودية — ادرس هذه الوحدات الأساسية أولًا" },
    overlayMap: { en: "Overlay map", ar: "خريطة الدمج" },
    regulators: { en: "Who's who — Saudi regulators", ar: "الجهات التنظيمية السعودية" },
    free: { en: "Free", ar: "مجاني" },
    completed: { en: "you've completed", ar: "أنجزت منه" },
    modules: { en: "modules", ar: "وحدة" },
    freeRes: { en: "free resources", ar: "مصدر مجاني" },
    certRoadmaps: { en: "cert roadmaps", ar: "مسار شهادات" },
    projectsCount: { en: "projects", ar: "مشروع" },
    thePath: { en: "The path", ar: "المسار التعليمي" },
    howToUse: { en: "How to use this", ar: "كيف تستخدم هذا المنهج" },
    moreAbout: { en: "More about the philosophy, principles & staying accountable →", ar: "المزيد عن الفلسفة والمبادئ والالتزام ←" },
    faq: { en: "FAQ", ar: "الأسئلة الشائعة" },
    readyWhen: { en: "Ready when", ar: "تكون جاهزًا عندما" },
    focusModules: { en: "Focus modules", ar: "الوحدات المهمّة" },
    credentials: { en: "Credentials", ar: "الشهادات ذات الصلة" },
    deliverable: { en: "Deliverable", ar: "المُسلَّم المطلوب" },
    skills: { en: "Skills", ar: "المهارات" },
    level: { en: "Level", ar: "المستوى" },
    after: { en: "After", ar: "بعد الوحدات" },
    whoFor: { en: "Who it's for", ar: "لمن هذه الشهادة" },
    cost: { en: "Cost", ar: "التكلفة" },
    region: { en: "Region", ar: "المنطقة" },
    mapsTo: { en: "Modules", ar: "الوحدات" },
    curationNotes: { en: "Curation & verification notes", ar: "ملاحظات الإعداد والتحقّق" },
    results: { en: "results for", ar: "نتيجة للبحث عن" },
    searchTitle: { en: "Search", ar: "البحث" },
    engRes: { en: "English resources (optional)", ar: "مصادر بالإنجليزية (اختيارية)" },
    arCoverage: { en: "Arabic coverage", ar: "تغطية المصادر العربية" },
    saudiTrack: { en: "Saudi (SOCPA) Track", ar: "مسار السعودية (SOCPA)" },
    notReplace: { en: "This track does not replace the global core. For each row, finish the listed global module(s) first, then layer the Saudi specifics on top.", ar: "هذا المسار لا يُغني عن المنهج الأساسي. لكل صفّ، أكمل الوحدة الأساسية المذكورة أولًا، ثم أضف التفاصيل السعودية فوقها." },
    howToUseTrack: { en: "How to use this track", ar: "كيف تستخدم هذا المسار" },
    saudiModulesH: { en: "Saudi overlay modules", ar: "وحدات المسار السعودي" },
    overlays: { en: "Overlays", ar: "يُكمّل الوحدات" },
    saudiCol: { en: "Saudi module", ar: "الوحدة السعودية" },
    pairsCol: { en: "Pairs with global", ar: "يُقرن مع الأساسية" },
    changesCol: { en: "What changes", ar: "ما الذي يتغيّر" },
    bodyCol: { en: "Body", ar: "الجهة" },
    roleCol: { en: "Role", ar: "الدور" },
    notForTitle: { en: "What this is not", ar: "ما الذي لا يقدّمه هذا المنهج" },
    philosophy: { en: "Philosophy", ar: "الفلسفة" },
    timeC: { en: "Time commitment", ar: "الوقت المطلوب" },
    principles: { en: "Principles", ar: "المبادئ" },
    accountability: { en: "Staying accountable", ar: "كيف تلتزم وتستمر" },
    jurisdictions: { en: "Why marketplace-first", ar: "الأطر المحلّية" },
    seq: { en: "Recommended sequencing", ar: "الترتيب المقترح" },
    builtH: { en: "How it was built", ar: "كيف أُعدّ هذا المنهج" },
    builtP: { en: "Designed by a panel of independent RevOps curriculum architects, resourced by web-research agents, adversarially link-verified, then stress-tested against real Revenue Operations competency frameworks and gap-filled. Resources can still go stale — if a link has moved, search its title and provider.", ar: "" },
    license: { en: "Curriculum (roadmap, descriptions, projects) under CC BY-SA 4.0. Linked resources belong to their authors.", ar: "المنهج (الخريطة والأوصاف والمشاريع) برخصة CC BY-SA 4.0. المصادر المرتبطة تعود لأصحابها." },
    whoForH: { en: "Who it's for", ar: "لمن هذا المنهج" },
    careerPaths: { en: "Career paths", ar: "المسارات المهنية" },
    kicker: { en: "Free · Self-paced · Project-driven", ar: "مجاني · بإيقاعك · قائم على المشاريع" },
    arResIntroNav: { en: "Best free Arabic resources", ar: "أفضل المصادر العربية المجانية" },
    empty: { en: "Nothing here.", ar: "لا يوجد محتوى." },
    notFound: { en: "Not found.", ar: "غير موجود." },
    confirmReset: { en: "Clear all your progress?", ar: "مسح كل تقدّمك؟" },
    ofN: { en: "of", ar: "من" },
    mandate: { en: "Mandate Mode", ar: "وضع المهمة" },
    reference: { en: "Glossary & cheat-sheets", ar: "المسرد والمراجع" },
    glossaryH: { en: "Glossary", ar: "المسرد" },
    cheatsheetsH: { en: "Cheat-sheets", ar: "بطاقات مرجعية" },
    pairWith: { en: "Soft-skill pairing", ar: "مهارة مقترنة" },
    parallelBadge: { en: "parallel · start Day 1", ar: "" },
    criticalPathH: { en: "Critical path", ar: "المسار الحرج" },
    boardOutputsH: { en: "What the board sees", ar: "" },
    focusMods: { en: "Modules", ar: "الوحدات" },
    pairSkills: { en: "Pair", ar: "اقرن" },
    exportP: { en: "Export", ar: "تصدير" },
    importP: { en: "Import", ar: "استيراد" },
    seeAlso: { en: "See also", ar: "انظر أيضًا" },
    startMandate: { en: "Mandate Mode", ar: "وضع المهمة" },
    interleaveNote: { en: "Run this in parallel from Day 1 — its projects apply your real RevOps work.", ar: "" },
  };
  function t(k) { var e = UI[k] || {}; return e[LANG] || e.en || k; }

  /* localized field pickers (Arabic merged into the same objects) */
  function pk(o, en, ar) { if (!o) return ""; return (rtl() && o[ar]) ? o[ar] : (o[en] || ""); }
  function pkArr(o, en, ar) { if (!o) return []; return (rtl() && o[ar] && o[ar].length) ? o[ar] : (o[en] || []); }
  function mTitle(m) { return pk(m, "title", "titleAr"); }
  function mSum(m) { return pk(m, "summary", "summaryAr"); }
  function mWhy(m) { return pk(m, "whyItMatters", "whyItMattersAr"); }
  function mOut(m) { return pkArr(m, "outcomes", "outcomesAr"); }
  function mProj(m) { return pk(m, "project", "projectAr"); }
  function mCheck(m) { return pk(m, "milestoneCheck", "milestoneCheckAr"); }
  function primaryRes(m) {
    if (rtl() && m.arabicResources && m.arabicResources.length) return m.arabicResources;
    return m.resources || [];
  }
  function secondaryRes(m) {
    if (rtl() && m.arabicResources && m.arabicResources.length) return m.resources || [];
    return [];
  }

  /* ---------- progress ---------- */
  var PKEY = "orp-progress-v1";
  function loadP() { try { return new Set(JSON.parse(localStorage.getItem(PKEY) || "[]")); } catch (e) { return new Set(); } }
  function saveP(s) { try { localStorage.setItem(PKEY, JSON.stringify(Array.from(s))); } catch (e) {} }
  var done = loadP();
  function isDone(id) { return done.has(id); }
  function toggleDone(id, v) { if (v) done.add(id); else done.delete(id); saveP(done); refreshUI(); }

  /* ---------- theme ---------- */
  var TKEY = "orp-theme";
  function applyTheme(x) { if (x === "dark") document.documentElement.setAttribute("data-theme", "dark"); else document.documentElement.removeAttribute("data-theme"); }
  applyTheme(localStorage.getItem(TKEY) || "light");
  document.getElementById("themeBtn").addEventListener("click", function () {
    var c = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(TKEY, c); applyTheme(c);
  });

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function bdi(s) { return "<bdi>" + esc(s) + "</bdi>"; }
  function costInfo(c) {
    var k = String(c || "").toLowerCase();
    if (k.indexOf("free-to-audit") >= 0 || k.indexOf("free to audit") >= 0) return ["audit", rtl() ? "مجاني بالاستماع" : "Free to audit"];
    if (k.indexOf("freemium") >= 0) return ["freemium", rtl() ? "مجاني جزئيًا" : "Freemium"];
    if (k.indexOf("paid") >= 0) return ["paid", rtl() ? "مدفوع (اختياري)" : "Paid (optional)"];
    if (k.indexOf("free") >= 0 || k.indexOf("مجاني") >= 0) return ["free", t("free")];
    return ["free", c || t("free")];
  }
  function roleClass(r) { var k = String(r || "").toLowerCase(); if (k.indexOf("supp") >= 0 || k.indexOf("ساند") >= 0) return "supplement"; if (k.indexOf("practice") >= 0 || k.indexOf("تدريب") >= 0) return "practice"; if (k.indexOf("refer") >= 0 || k.indexOf("مرجع") >= 0) return "reference"; return "primary"; }
  function roleRank(r) { var k = String(r || "").toLowerCase(); if (k.indexOf("primary") >= 0 || k.indexOf("anchor") >= 0 || k.indexOf("أساس") >= 0 || k.indexOf("مرتكز") >= 0) return 0; if (k.indexOf("supp") >= 0 || k.indexOf("ساند") >= 0) return 1; if (k.indexOf("practice") >= 0 || k.indexOf("تدريب") >= 0) return 2; return 3; }
  function go(h) { location.hash = h; }
  function modLink(id) { var m = byId[id]; if (!m) return bdi(id); return '<a href="#/module/' + encodeURIComponent(id) + '">' + bdi(id) + " · " + esc(mTitle(m)) + "</a>"; }

  function trackPct(t2) { var ms = t2.modules || []; if (!ms.length) return 0; return Math.round(ms.filter(function (m) { return isDone(m.id); }).length / ms.length * 100); }
  function overallPct() { if (!allMods.length) return 0; return Math.round(allMods.filter(function (m) { return isDone(m.id); }).length / allMods.length * 100); }

  /* ---------- sidebar ---------- */
  var navEl = document.getElementById("nav");
  var openTracks = {};
  function buildNav() {
    var h = "";
    h += '<div class="nav-link" data-go="#/"><span class="ic">🏠</span> ' + t("home") + "</div>";
    if (D.mandate) h += '<div class="nav-link" data-go="#/mandate"><span class="ic">🎯</span> ' + t("mandate") + "</div>";
    h += '<div class="nav-section">' + t("curriculum") + "</div>";
    TRACKS.forEach(function (tr, i) {
      var tid = "t" + i, pct = trackPct(tr), open = openTracks[tid];
      h += '<div class="nav-track ' + (open ? "open" : "") + '" data-track="' + tid + '">';
      h += '<div class="nav-track-head" data-toggle="' + tid + '">' + esc(trackName(tr)) + (tr.parallel ? ' <span class="pbadge" title="' + t("parallelBadge") + '">⟳</span>' : '') + '<span class="chev">▸</span></div>';
      h += '<div class="nav-track-bar"><i style="width:' + pct + '%"></i></div><div class="nav-modules">';
      (tr.modules || []).forEach(function (m) { h += navMod(m); });
      h += "</div></div>";
    });
    if (SAUDI) {
      h += '<div class="nav-section">' + t("jurisdiction") + "</div>";
      var sp = SAUDI_MODS.length ? Math.round(SAUDI_MODS.filter(function (m) { return isDone(m.id); }).length / SAUDI_MODS.length * 100) : 0;
      h += '<div class="nav-track ' + (openTracks.ksa ? "open" : "") + '" data-track="ksa">';
      h += '<div class="nav-track-head" data-toggle="ksa">🇸🇦 ' + t("saudiTrack") + '<span class="chev">▸</span></div>';
      h += '<div class="nav-track-bar"><i style="width:' + sp + '%"></i></div><div class="nav-modules">';
      h += '<a class="nav-mod" href="#/saudi"><span class="dot">★</span><span>' + t("trackOverview") + "</span></a>";
      SAUDI_MODS.forEach(function (m) { h += navMod(m); });
      h += "</div></div>";
    }
    h += '<div class="nav-section">' + t("more") + "</div>";
    if (D.landscape) h += '<div class="nav-link" data-go="#/arabic"><span class="ic">📺</span> ' + t("arabicRes") + "</div>";
    if ((D.glossary && D.glossary.length) || (D.cheatsheets && D.cheatsheets.length)) h += '<div class="nav-link" data-go="#/reference"><span class="ic">📖</span> ' + t("reference") + "</div>";
    h += '<div class="nav-link" data-go="#/projects"><span class="ic">🛠️</span> ' + t("projects") + "</div>";
    h += '<div class="nav-link" data-go="#/certs"><span class="ic">🎓</span> ' + t("certifications") + "</div>";
    h += '<div class="nav-link" data-go="#/tooling"><span class="ic">🧰</span> ' + t("tooling") + "</div>";
    h += '<div class="nav-link" data-go="#/career"><span class="ic">💼</span> ' + t("career") + "</div>";
    h += '<div class="nav-link" data-go="#/about"><span class="ic">ℹ️</span> ' + t("about") + "</div>";
    navEl.innerHTML = h;
    highlightNav();
  }
  function navMod(m) {
    return '<a class="nav-mod ' + (isDone(m.id) ? "done" : "") + '" href="#/module/' + encodeURIComponent(m.id) + '" data-mid="' + esc(m.id) + '">' +
      '<span class="dot">' + (isDone(m.id) ? "✓" : "○") + "</span>" + '<span class="mid">' + bdi(m.id) + "</span><span>" + esc(mTitle(m)) + "</span></a>";
  }
  function trackName(tr) { return rtl() && tr.nameAr ? tr.nameAr : tr.name; }
  navEl.addEventListener("click", function (e) {
    var tog = e.target.closest("[data-toggle]");
    if (tog) { var id = tog.getAttribute("data-toggle"); openTracks[id] = !openTracks[id]; buildNav(); return; }
    var g = e.target.closest("[data-go]"); if (g) { go(g.getAttribute("data-go")); closeSidebar(); return; }
    if (e.target.closest("a")) closeSidebar();
  });
  function highlightNav() {
    var hash = location.hash || "#/";
    navEl.querySelectorAll(".nav-link").forEach(function (n) { n.classList.toggle("active", n.getAttribute("data-go") === hash); });
    navEl.querySelectorAll(".nav-mod").forEach(function (n) { var mid = n.getAttribute("data-mid"); n.classList.toggle("active", mid && hash === "#/module/" + encodeURIComponent(mid)); });
  }
  function refreshUI() { document.getElementById("progressChip").textContent = overallPct() + "%"; buildNav(); }

  /* ---------- render ---------- */
  var main = document.getElementById("main");
  function set(html) { main.innerHTML = html; window.scrollTo(0, 0); main.focus(); highlightNav(); }

  function resourceHTML(r) {
    var ci = costInfo(r.cost);
    var url = r.url && /^https?:/i.test(r.url) ? r.url : "";
    var title = url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(r.title) + " ↗</a>" : esc(r.title);
    var meta = []; if (r.provider) meta.push(esc(r.provider)); if (r.type) meta.push(esc(r.type));
    return '<div class="res"><div class="role ' + roleClass(r.role) + '"></div><div class="body">' +
      '<div class="rtitle">' + title + "</div><div class=\"rmeta\">" + meta.join(" · ") +
      ' <span class="badge ' + ci[0] + '">' + esc(ci[1]) + "</span>" + (r.role ? ' <span class="badge role">' + esc(r.role) + "</span>" : "") + "</div>" +
      (r.notes ? '<div class="notes">' + esc(r.notes) + "</div>" : "") + "</div></div>";
  }

  function renderModule(id) {
    var m = byId[id];
    if (!m) { set('<div class="empty">' + t("notFound") + "</div>"); return; }
    var saudi = !!(m.overlaysGlobalModules && m.overlaysGlobalModules.length);
    var flat = saudi ? SAUDI_MODS : flatGlobal;
    var idx = flat.indexOf(m), prev = idx > 0 ? flat[idx - 1] : null, next = (idx >= 0 && idx < flat.length - 1) ? flat[idx + 1] : null;
    var h = "";
    h += '<div class="crumb"><a href="#/">' + t("home") + "</a> › " +
      (saudi ? '<a href="#/saudi">' + t("saudiTrack") + "</a>" : '<a href="#/track/' + encodeURIComponent(m.track) + '">' + esc(trackNameById(m.track)) + "</a>") + " › " + bdi(m.id) + "</div>";
    h += '<div class="mod-head"><span class="id">' + bdi(m.id) + '</span><h1 style="flex:1;min-width:240px">' + esc(mTitle(m)) + "</h1></div>";
    var pills = [];
    if (m.estimatedHours) pills.push('<span class="pill">⏱️ <b>' + bdi(m.estimatedHours) + "</b></span>");
    pills.push('<span class="pill">' + esc(trackNameById(m.track)) + "</span>");
    if (m.prerequisites && m.prerequisites.length) pills.push('<span class="pill">' + t("prereqs") + ": " + m.prerequisites.map(modLink).join("، ") + "</span>");
    else pills.push('<span class="pill">' + t("prereqs") + ": <b>" + t("none") + "</b></span>");
    h += '<div class="metarow">' + pills.join("") + "</div>";
    if (saudi) h += '<div class="callout gold"><span class="lab">🇸🇦 ' + t("readFirst") + "</span>" + m.overlaysGlobalModules.map(modLink).join(" &nbsp;·&nbsp; ") + "</div>";
    if (mSum(m)) h += '<p class="lede">' + esc(mSum(m)) + "</p>";
    if (mWhy(m)) h += '<div class="callout why"><span class="lab">' + t("why") + "</span>" + esc(mWhy(m)) + "</div>";
    var outs = mOut(m);
    if (outs.length) { h += "<h2>" + t("byEnd") + "</h2><ul class=\"clean\">"; outs.forEach(function (o) { h += "<li>" + esc(o) + "</li>"; }); h += "</ul>"; }
    if (m.pair && m.pair.length) { h += '<div class="callout pair"><span class="lab">⟳ ' + t("pairWith") + "</span>" + m.pair.map(function (p) { return modLink(p.id) + (p.why ? " — " + esc(p.why) : ""); }).join("<br>") + "</div>"; }
    if (rtl() && m.arabicCoverageNote) h += '<div class="section-note"><b>' + t("arCoverage") + ":</b> " + esc(m.arabicCoverageNote) + "</div>";
    var pr = primaryRes(m);
    if (pr.length) { h += "<h2>" + t("resources") + "</h2>"; pr.slice().sort(function (a, b) { return roleRank(a.role) - roleRank(b.role); }).forEach(function (r) { h += resourceHTML(r); }); }
    var sr = secondaryRes(m);
    if (sr.length) { h += '<details class="flags"><summary>' + t("engRes") + " (" + sr.length + ")</summary>"; sr.slice().sort(function (a, b) { return roleRank(a.role) - roleRank(b.role); }).forEach(function (r) { h += resourceHTML(r); }); h += "</details>"; }
    if (mProj(m)) h += "<h2>🛠️ " + t("project") + '</h2><div class="callout gold"><span class="lab">' + t("buildThis") + "</span>" + esc(mProj(m)) + "</div>";
    if (mCheck(m)) h += "<h2>✅ " + t("checkpoint") + '</h2><div class="callout"><span class="lab">' + t("doneWhen") + "</span>" + esc(mCheck(m)) + "</div>";
    if (m.flags && m.flags.length) { h += '<details class="flags"><summary>' + t("curationNotes") + " (" + m.flags.length + ")</summary><ul>"; m.flags.forEach(function (f) { h += "<li>" + esc(f) + "</li>"; }); h += "</ul></details>"; }
    h += '<div class="complete-bar"><label class="chk"><input type="checkbox" id="doneChk" ' + (isDone(m.id) ? "checked" : "") + "> " + t("markDone") + "</label>" +
      '<span class="muted" style="margin-inline-start:auto;font-size:13px">' + bdi((idx + 1) + " " + t("ofN") + " " + flat.length) + "</span></div>";
    var aPrev = rtl() ? "→" : "←", aNext = rtl() ? "←" : "→";
    h += '<div class="prevnext">';
    h += prev ? '<a href="#/module/' + encodeURIComponent(prev.id) + '"><div class="dir">' + aPrev + " " + t("prev") + "</div><div class=\"t\">" + bdi(prev.id) + " " + esc(mTitle(prev)) + "</div></a>" : "<span></span>";
    h += next ? '<a class="next" href="#/module/' + encodeURIComponent(next.id) + '"><div class="dir">' + t("next") + " " + aNext + "</div><div class=\"t\">" + bdi(next.id) + " " + esc(mTitle(next)) + "</div></a>" : "<span></span>";
    h += "</div>";
    set(h);
    var chk = document.getElementById("doneChk"); if (chk) chk.addEventListener("change", function () { toggleDone(m.id, chk.checked); });
  }
  function trackNameById(name) { var tr = TRACKS.filter(function (x) { return x.name === name; })[0]; return tr ? trackName(tr) : name; }

  function renderTrack(name) {
    var tr = TRACKS.filter(function (x) { return x.name === name; })[0];
    if (!tr) { set('<div class="empty">' + t("notFound") + "</div>"); return; }
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + esc(trackName(tr)) + "</div><h1>" + esc(trackName(tr)) + "</h1>";
    h += '<p class="lede">' + bdi((tr.modules || []).length) + " " + t("modules") + " · " + trackPct(tr) + "% " + t("completed") + "</p><div class=\"grid\">";
    (tr.modules || []).forEach(function (m) { h += card(m); });
    h += "</div>"; set(h);
  }
  function card(m) {
    return '<a class="card" href="#/module/' + encodeURIComponent(m.id) + '"><div class="eyebrow">' + bdi(m.id) + (isDone(m.id) ? " · ✓" : "") + "</div><h3>" + esc(mTitle(m)) + "</h3>" +
      "<p>" + esc((mSum(m) || "").slice(0, 120)) + "…</p>" +
      '<div class="meta">⏱️ ' + bdi(m.estimatedHours || "—") + " · " + ((primaryRes(m) || []).length) + " " + t("resources") + "</div>" +
      '<div class="meter"><i style="width:' + (isDone(m.id) ? 100 : 0) + '%"></i></div></a>';
  }

  function renderHome() {
    var st = D.stats || {}, intro = D.intro || {};
    var ded = 'Your mandate: turn the revenue engine you already operate into decisions the C-suite acts on. Start with one clean pipeline report; finish owning the forecast. This path is yours — free forever. Go build the number. 📈';
    var h = '<div class="dedication"><span class="seal">📈</span><div>' + ded + "</div></div>";
    h += '<div class="hero"><div class="kicker">' + t("kicker") + "</div>";
    h += "<h1>" + esc(pk(intro, "title", "titleAr")) + "</h1>";
    if (pk(intro, "tagline", "taglineAr")) h += '<div class="tagline">' + esc(pk(intro, "tagline", "taglineAr")) + "</div>";
    var phil = (pk(intro, "philosophy", "philosophyAr") || "").split("\n")[0];
    h += '<p class="lede">' + esc(phil) + "</p>";
    h += '<div class="stats">' + stat(st.modules, t("modules")) + stat(st.resources, t("freeRes")) + stat(st.projects, t("projectsCount")) + stat(st.certs, t("certRoadmaps")) + stat(overallPct() + "%", t("completed")) + "</div>";
    var first = flatGlobal[0];
    h += '<div class="btn-row">';
    if (first) h += '<a class="btn" href="#/module/' + encodeURIComponent(first.id) + '">' + t("startAt") + " " + bdi(first.id) + " " + (rtl() ? "←" : "→") + "</a>";
    if (D.mandate) h += '<a class="btn ghost" href="#/mandate">🎯 ' + t("startMandate") + "</a>";
    if (SAUDI) h += '<a class="btn ghost" href="#/saudi">🇸🇦 ' + t("saudiTrack") + "</a>";
    h += "</div></div>";
    h += "<h2>" + t("thePath") + "</h2><div class=\"grid\">";
    TRACKS.forEach(function (tr) {
      h += '<a class="card" href="#/track/' + encodeURIComponent(tr.name) + '"><div class="eyebrow">' + bdi((tr.modules || []).length) + " " + t("modules") + " · " + trackPct(tr) + "%</div><h3>" + esc(trackName(tr)) + "</h3><div class=\"meter\"><i style=\"width:" + trackPct(tr) + "%\"></i></div></a>";
    });
    h += "</div>";
    if (SAUDI) h += '<a class="card" style="display:block;margin-top:16px;border-color:var(--green)" href="#/saudi"><div class="eyebrow">🇸🇦 ' + t("jurisdiction") + '</div><h3>' + esc(pk(SAUDI, "title", "titleAr")) + "</h3><p>" + esc((pk(SAUDI, "tagline", "taglineAr") || pk(SAUDI, "intro", "introAr") || "").slice(0, 150)) + "…</p></a>";
    var htu = pkArr(intro, "howToUse", "howToUseAr");
    if (htu.length) { h += "<h2>" + t("howToUse") + "</h2><ul class=\"clean\">"; htu.slice(0, 6).forEach(function (s) { h += "<li>" + esc(s) + "</li>"; }); h += '</ul><p class="muted"><a href="#/about">' + t("moreAbout") + "</a></p>"; }
    set(h);
  }
  function stat(v, l) { return '<div class="stat"><b>' + bdi(v == null ? "—" : v) + "</b><span>" + esc(l) + "</span></div>"; }

  function renderSaudi() {
    if (!SAUDI) { set('<div class="empty">' + t("empty") + "</div>"); return; }
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("saudiTrack") + "</div>";
    h += '<div class="ksa"><h1>' + esc(pk(SAUDI, "title", "titleAr")) + "</h1>";
    if (pk(SAUDI, "tagline", "taglineAr")) h += '<div class="tagline">' + esc(pk(SAUDI, "tagline", "taglineAr")) + "</div>";
    if (pk(SAUDI, "intro", "introAr")) h += "<p>" + esc(pk(SAUDI, "intro", "introAr")) + "</p>";
    var kf = pkArr(SAUDI, "keyFacts", "keyFactsAr");
    if (kf.length) { h += '<div class="facts">'; kf.forEach(function (f) { h += '<div class="f">' + esc(f) + "</div>"; }); h += "</div>"; }
    h += "</div>";
    h += '<div class="section-note">' + t("notReplace") + "</div>";
    var htu = pkArr(SAUDI, "howToUse", "howToUseAr");
    if (htu.length) { h += "<h2>" + t("howToUseTrack") + "</h2><ul class=\"clean\">"; htu.forEach(function (s) { h += "<li>" + esc(s) + "</li>"; }); h += "</ul>"; }
    h += "<h2>" + t("saudiModulesH") + "</h2><div class=\"grid\">";
    SAUDI_MODS.forEach(function (m) {
      h += '<a class="card" href="#/module/' + encodeURIComponent(m.id) + '"><div class="eyebrow">' + bdi(m.id) + (isDone(m.id) ? " · ✓" : "") + "</div><h3>" + esc(mTitle(m)) + "</h3><p>" + esc((mSum(m) || "").slice(0, 110)) + "…</p>" + (m.overlaysGlobalModules ? '<div class="meta">' + t("overlays") + ": " + bdi(m.overlaysGlobalModules.join(", ")) + "</div>" : "") + "</a>";
    });
    h += "</div>";
    if (SAUDI.overlayMap && SAUDI.overlayMap.length) {
      h += "<h2>" + t("overlayMap") + "</h2><table class=\"tbl\"><tr><th>" + t("saudiCol") + "</th><th>" + t("pairsCol") + "</th><th>" + t("changesCol") + "</th></tr>";
      SAUDI.overlayMap.forEach(function (o) { h += "<tr><td><b>" + bdi(o.saudiModule) + "</b></td><td>" + bdi((o.pairsWithGlobal || []).join(", ")) + "</td><td>" + esc(rtl() && o.whatChangesAr ? o.whatChangesAr : o.whatChanges) + "</td></tr>"; });
      h += "</table>";
    }
    if (SAUDI.regulators && SAUDI.regulators.length) {
      h += "<h2>" + t("regulators") + "</h2><table class=\"tbl\"><tr><th>" + t("bodyCol") + "</th><th>" + t("roleCol") + "</th></tr>";
      SAUDI.regulators.forEach(function (r) { var nm = r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.name) + " ↗</a>" : esc(r.name); h += "<tr><td><b>" + nm + "</b></td><td>" + esc(rtl() && r.roleAr ? r.roleAr : r.role) + "</td></tr>"; });
      h += "</table>";
    }
    set(h);
  }

  function renderArabic() {
    var L = D.landscape; if (!L) { set('<div class="empty">' + t("empty") + "</div>"); return; }
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("arabicRes") + "</div><h1>" + t("arResIntroNav") + "</h1>";
    if (L.introAr || L.intro) h += '<p class="lede">' + esc(L.introAr || L.intro) + "</p>";
    (L.channels || []).forEach(function (c) {
      var url = c.url && /^https?:/i.test(c.url) ? c.url : "";
      var title = url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(c.name) + " ↗</a>" : esc(c.name);
      h += '<div class="res"><div class="role primary"></div><div class="body"><div class="rtitle">' + title + "</div>" +
        '<div class="rmeta">' + (c.type ? esc(c.type) : "") + ' <span class="badge free">' + t("free") + "</span></div>" +
        (c.focusAr || c.focus ? '<div class="notes"><b>' + esc(c.focusAr || c.focus) + "</b></div>" : "") +
        (c.notesAr || c.notes ? '<div class="notes">' + esc(c.notesAr || c.notes) + "</div>" : "") + "</div></div>";
    });
    set(h);
  }

  function renderProjects() {
    var ps = D.projects || [];
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("projects") + "</div><h1>" + t("projects") + "</h1>";
    ps.forEach(function (p) {
      h += "<h2>" + esc(pk(p, "title", "titleAr")) + "</h2>";
      var meta = []; if (p.level) meta.push('<span class="pill"><b>' + esc(p.level) + "</b></span>"); if (p.afterModules && p.afterModules.length) meta.push('<span class="pill">' + t("after") + ": " + bdi(p.afterModules.join(", ")) + "</span>");
      if (meta.length) h += '<div class="metarow">' + meta.join("") + "</div>";
      if (pk(p, "description", "descriptionAr")) h += "<p>" + esc(pk(p, "description", "descriptionAr")) + "</p>";
      if (pk(p, "deliverable", "deliverableAr")) h += '<div class="callout"><span class="lab">' + t("deliverable") + "</span>" + esc(pk(p, "deliverable", "deliverableAr")) + "</div>";
      if (p.skills && p.skills.length) h += '<p class="muted"><b>' + t("skills") + ":</b> " + esc(p.skills.join("، ")) + "</p>";
      (p.resources || []).forEach(function (r) { h += resourceHTML(r); });
    });
    set(h);
  }

  function renderCerts() {
    var cs = D.certifications || [];
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("certifications") + "</div><h1>" + t("certifications") + "</h1>";
    if (SAUDI) h += '<div class="section-note">' + (rtl() ? "تستهدف السعودية؟ راجع مسار زمالة SOCPA في " : "Targeting Saudi Arabia? See the SOCPA Fellowship roadmap in ") + '<a href="#/module/SA.9">' + (rtl() ? "المسار السعودي" : "the Saudi track") + ".</a></div>";
    cs.forEach(function (c) {
      h += "<h2>" + esc(c.name) + (c.body ? ' <span class="muted" style="font-size:15px">· ' + esc(c.body) + "</span>" : "") + "</h2>";
      var meta = []; if (c.region) meta.push('<span class="pill">' + esc(c.region) + "</span>"); if (c.costRange) meta.push('<span class="pill">' + t("cost") + ": <b>" + esc(c.costRange) + "</b></span>"); if (c.mapsToModules && c.mapsToModules.length) meta.push('<span class="pill">' + t("mapsTo") + ": " + bdi(c.mapsToModules.join(", ")) + "</span>");
      if (meta.length) h += '<div class="metarow">' + meta.join("") + "</div>";
      if (pk(c, "whoItsFor", "whoItsForAr")) h += "<p><b>" + t("whoFor") + ":</b> " + esc(pk(c, "whoItsFor", "whoItsForAr")) + "</p>";
      if (pk(c, "prereqs", "prereqsAr")) h += '<p class="muted"><b>' + t("prereqs") + ":</b> " + esc(pk(c, "prereqs", "prereqsAr")) + "</p>";
      if (pk(c, "notes", "notesAr")) h += "<p>" + esc(pk(c, "notes", "notesAr")) + "</p>";
      (c.freePrep || []).forEach(function (r) { h += resourceHTML(r); });
    });
    set(h);
  }

  function renderTooling() {
    var ts = D.tooling || [];
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("tooling") + "</div><h1>" + t("tooling") + "</h1>";
    ts.forEach(function (tr) {
      h += "<h2>" + esc(tr.name) + "</h2>";
      if (pk(tr, "why", "whyAr")) h += '<div class="callout why"><span class="lab">' + t("why") + "</span>" + esc(pk(tr, "why", "whyAr")) + "</div>";
      (tr.resources || []).forEach(function (r) { h += resourceHTML(r); });
    });
    set(h);
  }

  function renderCareer() {
    var c = D.career || {};
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("career") + "</div><h1>" + t("career") + "</h1><h2>" + t("careerPaths") + "</h2>";
    (c.paths || []).forEach(function (p) {
      h += "<h3>" + esc(p.role) + "</h3>";
      if (pk(p, "description", "descriptionAr")) h += "<p>" + esc(pk(p, "description", "descriptionAr")) + "</p>";
      if (p.modulesNeeded && p.modulesNeeded.length) h += '<p class="muted"><b>' + t("focusModules") + ":</b> " + bdi(p.modulesNeeded.join(", ")) + "</p>";
      if (p.certs && p.certs.length) h += '<p class="muted"><b>' + t("credentials") + ":</b> " + esc(p.certs.join("، ")) + "</p>";
      if (pk(p, "startingSignal", "startingSignalAr")) h += '<div class="callout"><span class="lab">' + t("readyWhen") + "</span>" + esc(pk(p, "startingSignal", "startingSignalAr")) + "</div>";
    });
    if (c.faq && c.faq.length) { h += "<h2>" + t("faq") + "</h2>"; c.faq.forEach(function (q) { h += '<div class="faq-q">' + esc(pk(q, "q", "qAr")) + "</div><p>" + esc(pk(q, "a", "aAr")) + "</p>"; }); }
    set(h);
  }

  function renderAbout() {
    var i = D.intro || {};
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("about") + "</div><h1>" + t("about") + "</h1>";
    if (pk(i, "whoIsThisFor", "whoIsThisForAr")) h += "<h2>" + t("whoForH") + "</h2><p>" + esc(pk(i, "whoIsThisFor", "whoIsThisForAr")) + "</p>";
    if (pk(i, "whatYouWontGet", "whatYouWontGetAr")) h += "<h2>" + t("notForTitle") + "</h2><p>" + esc(pk(i, "whatYouWontGet", "whatYouWontGetAr")) + "</p>";
    if (pk(i, "philosophy", "philosophyAr")) { h += "<h2>" + t("philosophy") + "</h2>"; pk(i, "philosophy", "philosophyAr").split("\n").forEach(function (p) { if (p.trim()) h += "<p>" + esc(p) + "</p>"; }); }
    if (pk(i, "timeCommitment", "timeCommitmentAr")) h += "<h2>" + t("timeC") + "</h2><p>" + esc(pk(i, "timeCommitment", "timeCommitmentAr")) + "</p>";
    var pr = pkArr(i, "principles", "principlesAr");
    if (pr.length) { h += "<h2>" + t("principles") + "</h2><ul class=\"clean\">"; pr.forEach(function (p) { h += "<li>" + esc(p) + "</li>"; }); h += "</ul>"; }
    var ac = pkArr(i, "accountability", "accountabilityAr");
    if (ac.length) { h += "<h2>" + t("accountability") + "</h2><ul class=\"clean\">"; ac.forEach(function (p) { h += "<li>" + esc(p) + "</li>"; }); h += "</ul>"; }
    if (pk(i, "jurisdictionNote", "jurisdictionNoteAr")) h += "<h2>" + t("jurisdictions") + "</h2><p>" + esc(pk(i, "jurisdictionNote", "jurisdictionNoteAr")) + "</p>";
    h += "<h2>" + t("builtH") + '</h2><p class="muted">' + t("builtP") + "</p>";
    h += '<p class="muted">' + t("license") + "</p>";
    set(h);
  }

  function renderMandate() {
    var M = D.mandate; if (!M) { set('<div class="empty">' + t("empty") + "</div>"); return; }
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("mandate") + "</div>";
    h += '<div class="ksa"><h1>🎯 ' + esc(M.title || t("mandate")) + "</h1>";
    if (M.intro) h += '<div class="tagline">' + esc(M.intro) + "</div>";
    h += "</div>";
    var pr = M.principles || [];
    if (pr.length) { h += '<div class="section-note"><b>' + t("principles") + ':</b><ul class="clean">'; pr.forEach(function (p) { h += "<li>" + esc(p) + "</li>"; }); h += "</ul></div>"; }
    if (M.criticalPath && M.criticalPath.length) { h += "<h2>" + t("criticalPathH") + '</h2><p class="chips">' + M.criticalPath.map(modLink).join(" ") + "</p>"; }
    (M.phases || []).forEach(function (ph, i) {
      h += '<div class="phase"><div class="mod-head"><span class="id">' + esc(ph.timeframe || ("#" + (i + 1))) + '</span><h2 style="flex:1;min-width:200px">' + esc(ph.name) + "</h2></div>";
      if (ph.goal) h += '<p class="lede">' + esc(ph.goal) + "</p>";
      if (ph.modules && ph.modules.length) h += '<p class="muted"><b>' + t("focusMods") + ":</b> " + ph.modules.map(modLink).join(" · ") + "</p>";
      if (ph.softSkills && ph.softSkills.length) h += '<p class="muted"><b>⟳ ' + t("pairSkills") + ":</b> " + ph.softSkills.map(modLink).join(" · ") + "</p>";
      if (ph.deliverable) h += '<div class="callout gold"><span class="lab">' + t("deliverable") + "</span>" + esc(ph.deliverable) + "</div>";
      h += "</div>";
    });
    if (M.boardOutputs && M.boardOutputs.length) { h += "<h2>" + t("boardOutputsH") + '</h2><ul class="clean">'; M.boardOutputs.forEach(function (b) { h += "<li>" + esc(b) + "</li>"; }); h += "</ul>"; }
    set(h);
  }

  function renderReference() {
    var gl = D.glossary || [], cs = D.cheatsheets || [];
    var h = '<div class="crumb"><a href="#/">' + t("home") + "</a> › " + t("reference") + "</div><h1>" + t("reference") + "</h1>";
    if (cs.length) {
      h += "<h2>" + t("cheatsheetsH") + "</h2>";
      cs.forEach(function (s) {
        h += '<details class="flags" open><summary>' + esc(s.title) + (s.category ? " · " + esc(s.category) : "") + "</summary>";
        (s.entries || []).forEach(function (e) { h += '<div class="cheat"><div class="rtitle">' + esc(e.name) + '</div><pre class="cheatc">' + esc(e.content) + "</pre></div>"; });
        h += "</details>";
      });
    }
    if (gl.length) {
      h += "<h2>" + t("glossaryH") + ' <span class="muted">(' + bdi(gl.length) + ")</span></h2>";
      var cats = {}, order = [];
      gl.forEach(function (g) { var c = g.category || "—"; if (!cats[c]) { cats[c] = []; order.push(c); } cats[c].push(g); });
      order.forEach(function (c) {
        h += "<h3>" + esc(c) + "</h3>";
        cats[c].forEach(function (g) { h += '<div class="gterm"><b>' + esc(g.term) + "</b> — " + esc(g.definition) + (g.seeAlso && g.seeAlso.length ? ' <span class="muted">(' + t("seeAlso") + ": " + esc(g.seeAlso.join(", ")) + ")</span>" : "") + "</div>"; });
      });
    }
    set(h);
  }

  /* ---------- search ---------- */
  var searchEl = document.getElementById("search");
  var searchActive = false;
  function renderSearch(q) {
    var ql = q.toLowerCase();
    var hits = allMods.filter(function (m) {
      var hay = [m.id, m.title, m.titleAr, m.summary, m.summaryAr, m.whyItMatters, m.whyItMattersAr,
        (m.outcomes || []).join(" "), (m.outcomesAr || []).join(" "),
        (primaryRes(m) || []).map(function (r) { return r.title + " " + r.provider + " " + r.notes; }).join(" ")].join(" ").toLowerCase();
      return hay.indexOf(ql) >= 0;
    });
    var h = "<h1>" + t("searchTitle") + '</h1><p class="lede">' + bdi(hits.length) + " " + t("results") + " «" + esc(q) + "»</p><div class=\"grid\">";
    hits.forEach(function (m) { h += '<a class="card" href="#/module/' + encodeURIComponent(m.id) + '"><div class="eyebrow">' + bdi(m.id) + " · " + esc(trackNameById(m.track)) + "</div><h3>" + esc(mTitle(m)) + "</h3><p>" + esc((mSum(m) || "").slice(0, 110)) + "…</p></a>"; });
    h += "</div>"; main.innerHTML = h; window.scrollTo(0, 0);
  }
  searchEl.addEventListener("input", function () {
    var q = searchEl.value.trim();
    if (q.length >= 2) { searchActive = true; renderSearch(q); }
    else if (searchActive) { searchActive = false; router(); }
  });

  /* ---------- router ---------- */
  function router() {
    if (searchActive && searchEl.value.trim().length >= 2) { renderSearch(searchEl.value.trim()); return; }
    var hash = location.hash || "#/";
    var parts = hash.replace(/^#\//, "").split("/"), route = parts[0] || "";
    if (route === "") return renderHome();
    if (route === "module") return renderModule(decodeURIComponent(parts.slice(1).join("/")));
    if (route === "track") return renderTrack(decodeURIComponent(parts.slice(1).join("/")));
    if (route === "saudi") return renderSaudi();
    if (route === "mandate") return renderMandate();
    if (route === "reference") return renderReference();
    if (route === "arabic") return renderArabic();
    if (route === "projects") return renderProjects();
    if (route === "certs") return renderCerts();
    if (route === "tooling") return renderTooling();
    if (route === "career") return renderCareer();
    if (route === "about") return renderAbout();
    return renderHome();
  }
  window.addEventListener("hashchange", router);

  /* ---------- language application ---------- */
  function applyLang() {
    document.documentElement.setAttribute("lang", LANG);
    document.documentElement.setAttribute("dir", rtl() ? "rtl" : "ltr");
    document.getElementById("langBtn").textContent = rtl() ? "EN" : "ع";
    searchEl.setAttribute("placeholder", t("searchPh"));
    document.getElementById("progressChip").setAttribute("title", rtl() ? "تقدّمك الكلّي" : "Your overall progress");
    document.getElementById("resetProgress").textContent = t("reset");
    var foot = document.getElementById("siteFoot");
    foot.innerHTML = '<span class="heart">♦</span> Built for operators who own the systems and now own the number — from your first clean pipeline report to running the forecast. <span class="sep">·</span> Free forever <span class="sep">·</span> CC BY-SA 4.0';
  }
  document.getElementById("langBtn").addEventListener("click", function () {
    LANG = rtl() ? "en" : "ar"; localStorage.setItem(LKEY, LANG);
    applyLang(); buildNav(); router();
  });

  /* ---------- mobile sidebar ---------- */
  var sidebar = document.getElementById("sidebar"), scrim = document.getElementById("scrim");
  function closeSidebar() { sidebar.classList.remove("open"); scrim.classList.remove("show"); }
  document.getElementById("menuBtn").addEventListener("click", function () { sidebar.classList.toggle("open"); scrim.classList.toggle("show"); });
  scrim.addEventListener("click", closeSidebar);
  document.getElementById("resetProgress").addEventListener("click", function () { if (confirm(t("confirmReset"))) { done = new Set(); saveP(done); refreshUI(); router(); } });
  document.getElementById("exportProgress").addEventListener("click", function () {
    var payload = JSON.stringify({ v: 1, app: "open-revops-path", done: Array.from(done) }, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "revops-progress.json";
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  });
  var impFile = document.getElementById("importFile");
  document.getElementById("importProgress").addEventListener("click", function () { impFile.click(); });
  impFile.addEventListener("change", function () {
    var f = impFile.files && impFile.files[0]; if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try { var o = JSON.parse(rd.result); var arr = (o && o.done) || (Array.isArray(o) ? o : []); arr.forEach(function (id) { done.add(id); }); saveP(done); refreshUI(); router(); }
      catch (e) { alert("Could not read that progress file."); }
      impFile.value = "";
    };
    rd.readAsText(f);
  });

  /* ---------- boot ---------- */
  (function preopen() {
    var hash = location.hash || "";
    if (hash.indexOf("#/module/") === 0) {
      var id = decodeURIComponent(hash.replace("#/module/", ""));
      TRACKS.forEach(function (tr, i) { if ((tr.modules || []).some(function (m) { return m.id === id; })) openTracks["t" + i] = true; });
      if (SAUDI_MODS.some(function (m) { return m.id === id; })) openTracks.ksa = true;
    }
  })();
  applyLang();
  buildNav();
  document.getElementById("progressChip").textContent = overallPct() + "%";
  router();
})();
