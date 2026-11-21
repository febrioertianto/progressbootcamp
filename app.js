/* ============================================================
   POWER INSPECT — SINGLE-SCREEN EXECUTIVE PROGRESS DASHBOARD
   ============================================================ */

(function () {
  "use strict";

  const SCHEMA_VERSION = 3;
  const STORAGE_KEY = "power_inspect_dashboard_data_v3";
  const LEGACY_STORAGE_KEYS = [
    "power_inspect_dashboard_data_v2",
    "power_inspect_dashboard_data_v1"
  ];
  const CUSTOM_API_KEY = "power_inspect_custom_api_url";
  const ADMIN_SESSION_KEY = "power_inspect_admin_unlocked";

  const CATEGORIES = [
    {
      name: "Power Swift - ERS",
      cardTitle: "Total Progress Power Swift",
      eyebrow: "⚡ Power Swift",
      short: "ers",
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.9)",
      goal: "Kamis Siaap UAT !!"
    },
    {
      name: "Migrasi Fasop",
      cardTitle: "Total Progress Migrasi Fasop",
      eyebrow: "🔄 Migrasi Fasop",
      short: "mig",
      color: "#0284c7",
      bg: "rgba(2, 132, 199, 0.9)",
      goal: "Data Fasop Kal In Production"
    },
    {
      name: "Stress Test",
      cardTitle: "Total Progress Stress Test",
      eyebrow: "🔥 Stress Test",
      short: "stress",
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.9)",
      goal: "Rekomendasi Jumlah POD standby"
    }
  ];

  function createDefaultData() {
    const nowIso = new Date().toISOString();
    return {
      schemaVersion: SCHEMA_VERSION,
      updatedAt: nowIso,
      reportTimestamp: nowIso,
      resumeReport:
        "## Reporting Resume\n" +
        "Fokus percepatan tim saat ini diarahkan pada penyelesaian seluruh fitur prioritas Power Swift menuju UAT hari Kamis, penyelesaian migrasi data Fasop Kal ke Production, serta eksekusi stress test untuk rekomendasi jumlah POD standby.\n\n" +
        "• **Power Swift**: Penyelesaian 6 fitur utama berjalan paralel untuk kesiapan UAT.\n" +
        "• **Migrasi Fasop**: Service Migrasi & Migrasi Data Fasop Kal terus divalidasi.\n" +
        "• **Stress Test**: Pengujian per modul berjalan bertahap (Fasop, Transmisi, ERS, FFE, Mantaps).",
      tasks: [
        // Power Swift (Hijau)
        { id: 1, category: "Power Swift - ERS", name: "Dashboard Mobile", progress: 0, status: "Not Started" },
        { id: 2, category: "Power Swift - ERS", name: "Verifikasi Karantina", progress: 0, status: "Not Started" },
        { id: 3, category: "Power Swift - ERS", name: "Karantina Mobile", progress: 0, status: "Not Started" },
        { id: 4, category: "Power Swift - ERS", name: "Tindak Lanjut", progress: 0, status: "Not Started" },
        { id: 5, category: "Power Swift - ERS", name: "Monitoring Stock", progress: 0, status: "Not Started" },
        { id: 6, category: "Power Swift - ERS", name: "Dok Skenario Test", progress: 0, status: "Not Started" },
        // Migrasi Fasop (Biru)
        { id: 7, category: "Migrasi Fasop", name: "Service Migrasi", progress: 0, status: "Not Started" },
        { id: 8, category: "Migrasi Fasop", name: "Migrasi (Data, Photo & File)", progress: 0, status: "Not Started" },
        // Stress Test (Oranye)
        { id: 9, category: "Stress Test", name: "Stress Test", progress: 0, status: "Not Started" }
      ],
      dailyLogs: []
    };
  }

  /**
   * Migrasi aman dari skema lama (14/15 task) ke skema v3 (9 task ringkas)
   * sambil mempertahankan angka progress yang sudah pernah diinput user.
   */
  function normalizeData(raw) {
    if (!raw || !Array.isArray(raw.tasks)) return createDefaultData();

    let resumeText = typeof raw.resumeReport === "string" ? raw.resumeReport : "";
    if (!resumeText && Array.isArray(raw.dailyLogs) && raw.dailyLogs.length > 0) {
      const sorted = [...raw.dailyLogs].sort((a, b) =>
        String(b.date || "").localeCompare(String(a.date || ""))
      );
      const latest = sorted[0];
      resumeText = [latest.title, latest.narrative].filter(Boolean).join("\n\n");
    }

    // Jika sudah schemaVersion >= 3, pertahankan seluruh task & terapkan rename terbaru
    if (Number(raw.schemaVersion) >= SCHEMA_VERSION) {
      const renamedTasks = raw.tasks.map((t) => {
        if (String(t.name || "").trim().toLowerCase() === "migrasi data fasop") {
          return { ...t, name: "Migrasi (Data, Photo & File)" };
        }
        return t;
      });
      return {
        ...raw,
        tasks: renamedTasks,
        schemaVersion: SCHEMA_VERSION,
        resumeReport: resumeText,
        reportTimestamp: raw.reportTimestamp || raw.updatedAt || new Date().toISOString(),
        updatedAt: raw.updatedAt || new Date().toISOString(),
        dailyLogs: Array.isArray(raw.dailyLogs) ? raw.dailyLogs : []
      };
    }

    // Migrasi dari versi lama (< 3) ke 9 task ringkas
    const findOldPct = (keywords) => {
      const found = raw.tasks.find((t) => {
        const lower = String(t.name || "").toLowerCase();
        return keywords.some((kw) => lower.includes(kw));
      });
      return found ? Math.max(0, Math.min(100, Number(found.progress) || 0)) : 0;
    };

    const oldStressTasks = raw.tasks.filter((t) => t.category === "Stress Test");
    const stressAvg = oldStressTasks.length
      ? Math.round(
          oldStressTasks.reduce((acc, t) => acc + (Number(t.progress) || 0), 0) /
            oldStressTasks.length
        )
      : 0;

    const toStatus = (pct) => (pct >= 100 ? "Done" : pct === 0 ? "Not Started" : "In Progress");

    const migratedTasks = [
      { id: 1, category: "Power Swift - ERS", name: "Dashboard Mobile", progress: findOldPct(["dashboard mobile"]) },
      { id: 2, category: "Power Swift - ERS", name: "Verifikasi Karantina", progress: findOldPct(["verifikasi karantina"]) },
      { id: 3, category: "Power Swift - ERS", name: "Karantina Mobile", progress: findOldPct(["karantina mobile"]) },
      { id: 4, category: "Power Swift - ERS", name: "Tindak Lanjut", progress: findOldPct(["tindak lanjut"]) },
      { id: 5, category: "Power Swift - ERS", name: "Monitoring Stock", progress: findOldPct(["monitoring stock"]) },
      { id: 6, category: "Power Swift - ERS", name: "Dok Skenario Test", progress: findOldPct(["skenario test"]) },
      { id: 7, category: "Migrasi Fasop", name: "Service Migrasi", progress: findOldPct(["service migrasi"]) },
      { id: 8, category: "Migrasi Fasop", name: "Migrasi (Data, Photo & File)", progress: findOldPct(["migrasi data", "migrasi (data"]) },
      { id: 9, category: "Stress Test", name: "Stress Test", progress: stressAvg }
    ].map((t) => ({ ...t, status: toStatus(t.progress) }));

    return {
      schemaVersion: SCHEMA_VERSION,
      updatedAt: raw.updatedAt || new Date().toISOString(),
      reportTimestamp: raw.reportTimestamp || raw.updatedAt || new Date().toISOString(),
      resumeReport: resumeText || createDefaultData().resumeReport,
      tasks: migratedTasks,
      dailyLogs: Array.isArray(raw.dailyLogs) ? raw.dailyLogs : []
    };
  }

  // ==================== STATE ====================
  let appData = null;
  let activeView = "dashboard";
  let chartCategoryFilter = "ALL";
  let adminCategoryFilter = "ALL";
  let isInlineEditing = false;
  let taskChartInstance = null;
  let pendingPinAction = null;

  // ==================== HELPERS ====================
  function getConfig() {
    return window.APP_CONFIG || {
      API_URL: "",
      ADMIN_PIN: "2026",
      PROJECT_TITLE: "Progress Report Percepatan Penyelesaian Power Inspect",
      TARGET_UAT_DATE: "2026-11-26",
      TARGET_UAT_LABEL: "Kamis, 26 Nov 2026 (UAT)"
    };
  }

  function getActiveApiUrl() {
    const custom = (localStorage.getItem(CUSTOM_API_KEY) || "").trim();
    if (custom) return custom;
    return (getConfig().API_URL || "").trim();
  }

  function getTodayISO() {
    try {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).formatToParts(new Date());
      const y = parts.find((p) => p.type === "year").value;
      const m = parts.find((p) => p.type === "month").value;
      const d = parts.find((p) => p.type === "day").value;
      return `${y}-${m}-${d}`;
    } catch {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
  }

  function formatTimestampID(isoString) {
    if (!isoString) return "-";
    const dt = new Date(isoString);
    if (isNaN(dt.getTime())) return isoString;
    return dt.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) + " WIB";
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getCategoryMeta(catName) {
    return CATEGORIES.find((c) => c.name === catName) || CATEGORIES[0];
  }

  function calculateMetrics(tasks) {
    const list = Array.isArray(tasks) ? tasks : [];
    const totalCount = list.length;
    const sumAll = list.reduce((acc, t) => acc + (Number(t.progress) || 0), 0);
    const overallAvg = totalCount > 0 ? Math.round(sumAll / totalCount) : 0;
    const doneCount = list.filter((t) => Number(t.progress) >= 100 || t.status === "Done").length;

    const byCategory = {};
    CATEGORIES.forEach((cat) => {
      const catTasks = list.filter((t) => t.category === cat.name);
      const count = catTasks.length;
      const avg = count > 0
        ? Math.round(catTasks.reduce((a, t) => a + (Number(t.progress) || 0), 0) / count)
        : 0;
      const done = catTasks.filter((t) => Number(t.progress) >= 100 || t.status === "Done").length;
      byCategory[cat.name] = { count, avg, done, meta: cat };
    });

    return { overallAvg, totalCount, doneCount, byCategory };
  }

  let toastTimer = null;
  function showToast(message, type = "info") {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.className = "toast show " + (type === "success" ? "success" : type === "error" ? "error" : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 4200);
  }

  function parseIsoDateToUtcMs(isoYmd) {
    const match = String(isoYmd || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return NaN;
    return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  function updateCountdownBadge() {
    const cfg = getConfig();
    const badge = document.getElementById("uatCountdownBadge");
    if (!badge || !cfg.TARGET_UAT_DATE) return;

    const todayUtc = parseIsoDateToUtcMs(getTodayISO());
    const targetUtc = parseIsoDateToUtcMs(cfg.TARGET_UAT_DATE);
    if (isNaN(todayUtc) || isNaN(targetUtc)) return;

    const diffDays = Math.round((targetUtc - todayUtc) / 86400000);

    let suffix = "";
    if (diffDays > 0) suffix = ` • H-${diffDays}`;
    else if (diffDays === 0) suffix = " • HARI INI!";
    else suffix = ` • H+${Math.abs(diffDays)}`;

    badge.textContent = `📅 Target UAT: ${cfg.TARGET_UAT_LABEL || cfg.TARGET_UAT_DATE}${suffix}`;
  }

  // ==================== STORAGE & CLOUD SYNC ====================
  function saveLocal(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Gagal menyimpan localStorage:", e);
    }
  }

  function loadLocal() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        for (const key of LEGACY_STORAGE_KEYS) {
          raw = localStorage.getItem(key);
          if (raw) break;
        }
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tasks)) {
          return normalizeData(parsed);
        }
      }
    } catch (e) {
      console.warn("Gagal membaca localStorage:", e);
    }
    return null;
  }

  async function safeParseAppsScriptResponse(res) {
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        "Akses Google Apps Script ditolak (401). Pastikan pengaturan Deploy 'Who has access' = 'Anyone (Siapa saja)'."
      );
    }
    const text = await res.text();
    const trimmed = text.trim();
    if (trimmed.startsWith("<") || trimmed.toLowerCase().includes("accounts.google.com")) {
      throw new Error(
        "Apps Script meminta login Google. Ubah Deploy 'Who has access' menjadi 'Anyone (Siapa saja)'."
      );
    }
    try {
      return JSON.parse(trimmed);
    } catch {
      throw new Error("Respons Google Apps Script bukan JSON valid.");
    }
  }

  async function fetchCloudData() {
    const url = getActiveApiUrl();
    if (!url) return null;

    try {
      const res = await fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), {
        method: "GET",
        redirect: "follow",
        cache: "no-store"
      });
      const json = await safeParseAppsScriptResponse(res);
      if (!json.ok) throw new Error(json.error || "Respons API tidak valid");
      if (json.empty || !json.data) return { empty: true };
      return { empty: false, data: normalizeData(json.data) };
    } catch (err) {
      console.warn("Cloud fetch gagal:", err.message);
      return null;
    }
  }

  async function pushCloudData(data) {
    const url = getActiveApiUrl();
    data.schemaVersion = SCHEMA_VERSION;

    if (!url) {
      saveLocal(data);
      return { ok: true, localOnly: true };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "save",
          pin: getConfig().API_PIN || getConfig().ADMIN_PIN || "2026",
          data: data
        })
      });
      const json = await safeParseAppsScriptResponse(res);
      if (!json.ok) throw new Error(json.error || "Gagal menyimpan ke Google Sheets");
      if (json.updatedAt) data.updatedAt = json.updatedAt;
      saveLocal(data);
      return { ok: true, localOnly: false, historyRow: json.historyRow };
    } catch (err) {
      console.error("Gagal push ke cloud:", err);
      saveLocal(data);
      return { ok: false, error: err.message };
    }
  }

  async function initializeData() {
    const cfg = getConfig();
    document.getElementById("headerTitle").textContent = cfg.PROJECT_TITLE;
    updateCountdownBadge();

    const localData = loadLocal();
    appData = localData || createDefaultData();
    saveLocal(appData);
    renderAll();

    const apiUrl = getActiveApiUrl();
    if (apiUrl) {
      const cloudRes = await fetchCloudData();
      if (cloudRes && !cloudRes.empty && cloudRes.data) {
        appData = cloudRes.data;
        saveLocal(appData);
        renderAll();
      }
    }
  }

  // ==================== RENDER SINGLE-SCREEN DASHBOARD ====================
  function renderAll() {
    if (!appData) return;
    updateCountdownBadge();
    const metrics = calculateMetrics(appData.tasks);
    const tsFormatted = formatTimestampID(appData.reportTimestamp || appData.updatedAt);

    document.getElementById("headerOverallBadge").textContent =
      `📊 Overall: ${metrics.overallAvg}% (${metrics.doneCount}/${metrics.totalCount} Selesai)`;
    document.getElementById("headerTimestampBadge").textContent = `🕒 Report: ${tsFormatted}`;
    document.getElementById("reportTimestampText").textContent = tsFormatted;

    renderHeroCards(metrics);
    renderTaskChart();
    renderResumePanel(metrics);

    if (activeView === "admin") {
      renderAdminPanel();
    }
  }

  function renderHeroCards(metrics) {
    const grid = document.getElementById("heroCardsGrid");
    const radius = 33;
    const circumference = 2 * Math.PI * radius;

    grid.innerHTML = CATEGORIES.map((cat) => {
      const info = metrics.byCategory[cat.name];
      const pct = Math.max(0, Math.min(100, info.avg));
      const dashOffset = circumference - (pct / 100) * circumference;

      return `
        <div class="hero-card ${cat.short}">
          <div class="hero-card-left">
            <div class="hero-card-eyebrow">${escapeHtml(cat.eyebrow)}</div>
            <div class="hero-card-title">${escapeHtml(cat.cardTitle)}</div>
            <div class="hero-card-goal" title="${escapeHtml(cat.goal)}">Goal: ${escapeHtml(cat.goal)}</div>
            <div class="hero-bar-track">
              <div class="hero-bar-fill" style="width:${pct}%"></div>
            </div>
            <div class="hero-card-meta">
              <span>${info.done} dari ${info.count} Task Selesai</span>
              <span>${pct}%</span>
            </div>
          </div>

          <div class="hero-ring" aria-label="${pct}%">
            <svg viewBox="0 0 82 82">
              <circle class="hero-ring-bg" cx="41" cy="41" r="${radius}"></circle>
              <circle
                class="hero-ring-progress"
                cx="41"
                cy="41"
                r="${radius}"
                stroke-dasharray="${circumference.toFixed(2)}"
                stroke-dashoffset="${dashOffset.toFixed(2)}"
              ></circle>
            </svg>
            <div class="hero-ring-label">
              ${pct}%
              <span>Done</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderTaskChart() {
    if (typeof Chart === "undefined") return;
    Chart.defaults.font.family = '"Calibri", "Carlito", "Segoe UI", Arial, sans-serif';
    const filtered = appData.tasks.filter(
      (t) => chartCategoryFilter === "ALL" || t.category === chartCategoryFilter
    );

    const wrapper = document.getElementById("taskChartWrapper");
    const dynamicHeight = Math.max(265, filtered.length * 29 + 24);
    wrapper.style.height = dynamicHeight + "px";

    const ctx = document.getElementById("taskChart").getContext("2d");

    const labels = filtered.map((t) => t.name);
    const values = filtered.map((t) => Number(t.progress) || 0);
    const colors = filtered.map((t) => getCategoryMeta(t.category).bg);

    if (taskChartInstance) taskChartInstance.destroy();

    const plugins = typeof ChartDataLabels !== "undefined" ? [ChartDataLabels] : [];

    taskChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Progress (%)",
            data: values,
            backgroundColor: colors,
            borderRadius: 6,
            barThickness: filtered.length <= 10 ? 16 : 13
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { right: 16, top: 2, bottom: 2 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` Progress: ${context.parsed.x}%`,
              afterLabel: (context) => {
                const task = filtered[context.dataIndex];
                if (!task) return "";
                const label = task.category === "Power Swift - ERS" ? "Power Swift" : task.category;
                return ` Group: ${label}`;
              }
            }
          },
          datalabels: {
            anchor: "end",
            align: "right",
            offset: 5,
            color: "#0f172a",
            font: { weight: "800", size: 11 },
            formatter: (v) => v + "%"
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 112,
            ticks: {
              stepSize: 20,
              font: { size: 10.5 },
              callback: (v) => (v <= 100 ? v + "%" : "")
            },
            grid: { color: "#eef2f6" }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 11.5, weight: "700" },
              color: "#1e293b"
            }
          }
        }
      },
      plugins
    });

    const allBtn = document.querySelector('#chartFilterPills .filter-pill[data-cat="ALL"]');
    if (allBtn) allBtn.textContent = `Semua (${appData.tasks.length})`;
  }

  function formatInlineMarkdown(escapedLine) {
    return escapedLine
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, "$1<em>$2</em>");
  }

  /**
   * Mengubah teks narasi menjadi HTML terstruktur (Subjudul, Paragraf, Bullet Point, & Daftar Bernomor)
   */
  function formatResumeToHtml(rawText) {
    const lines = String(rawText || "").replace(/\r\n/g, "\n").split("\n");
    const htmlParts = [];
    let listType = null; // "ul" | "ol" | null
    let paragraphLines = [];

    const flushParagraph = () => {
      if (paragraphLines.length) {
        htmlParts.push(`<p>${paragraphLines.join("<br>")}</p>`);
        paragraphLines = [];
      }
    };

    const closeList = () => {
      if (listType) {
        htmlParts.push(`</${listType}>`);
        listType = null;
      }
    };

    lines.forEach((rawLine) => {
      const trimmed = rawLine.trim();

      if (!trimmed) {
        flushParagraph();
        closeList();
        return;
      }

      // Heading: "## Judul" atau "### Judul"
      const headingMatch = trimmed.match(/^#{1,3}\s+(.+)$/);
      if (headingMatch) {
        flushParagraph();
        closeList();
        htmlParts.push(`<h4>${formatInlineMarkdown(escapeHtml(headingMatch[1]))}</h4>`);
        return;
      }

      // Bullet point: "• ", "- ", "* "
      const bulletMatch = trimmed.match(/^(?:[•\-\*])\s+(.+)$/);
      if (bulletMatch) {
        flushParagraph();
        if (listType !== "ul") {
          closeList();
          htmlParts.push("<ul>");
          listType = "ul";
        }
        htmlParts.push(`<li>${formatInlineMarkdown(escapeHtml(bulletMatch[1]))}</li>`);
        return;
      }

      // Numbered list: "1. ", "2) "
      const numMatch = trimmed.match(/^\d+[\.\)]\s+(.+)$/);
      if (numMatch) {
        flushParagraph();
        if (listType !== "ol") {
          closeList();
          htmlParts.push("<ol>");
          listType = "ol";
        }
        htmlParts.push(`<li>${formatInlineMarkdown(escapeHtml(numMatch[1]))}</li>`);
        return;
      }

      // Normal paragraph line
      closeList();
      paragraphLines.push(formatInlineMarkdown(escapeHtml(trimmed)));
    });

    flushParagraph();
    closeList();
    return htmlParts.join("");
  }

  function renderResumePanel(metrics) {
    const displayBox = document.getElementById("resumeDisplayBox");
    const text = (appData.resumeReport || "").trim();

    if (text) {
      displayBox.innerHTML = formatResumeToHtml(text);
    } else {
      displayBox.innerHTML =
        `<span class="resume-empty">Belum ada narasi / resume report. Klik tombol "✏️ Edit Narasi" di bagian bawah halaman untuk menuliskan ringkasan laporan hari ini.</span>`;
    }

    const inProgressCount = appData.tasks.filter(
      (t) => Number(t.progress) > 0 && Number(t.progress) < 100
    ).length;

    document.getElementById("resumeFooterStats").innerHTML = `
      <div class="mini-stat">
        <div class="mini-stat-label">Overall</div>
        <div class="mini-stat-val" style="color:var(--primary);">${metrics.overallAvg}%</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-label">Selesai</div>
        <div class="mini-stat-val" style="color:var(--cat-ers);">${metrics.doneCount} / ${metrics.totalCount}</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-label">On Progress</div>
        <div class="mini-stat-val" style="color:var(--cat-stress);">${inProgressCount} Task</div>
      </div>
    `;
  }

  function toggleInlineResumeEditor(show) {
    isInlineEditing = show;
    const displayBox = document.getElementById("resumeDisplayBox");
    const editor = document.getElementById("resumeInlineEditor");
    const textarea = document.getElementById("inlineResumeTextarea");

    displayBox.classList.toggle("hidden", show);
    editor.classList.toggle("hidden", !show);

    if (show) {
      textarea.value = appData.resumeReport || "";
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => textarea.focus(), 120);
    }
  }

  // ==================== RENDER ADMIN PANEL ====================
  function renderAdminPanel() {
    document.getElementById("adminResumeTextarea").value = appData.resumeReport || "";
    document.getElementById("adminTimestampPreview").textContent = formatTimestampID(
      appData.reportTimestamp || appData.updatedAt
    );
    document.getElementById("inputApiUrl").value = getActiveApiUrl();
    renderAdminTasks();
  }

  function renderAdminTasks() {
    const container = document.getElementById("adminTaskList");
    const filtered = appData.tasks.filter(
      (t) => adminCategoryFilter === "ALL" || t.category === adminCategoryFilter
    );

    container.innerHTML = filtered
      .map((t) => {
        const idx = appData.tasks.indexOf(t);
        const catMeta = getCategoryMeta(t.category);
        const catDisplay = t.category === "Power Swift - ERS" ? "Power Swift" : t.category;
        const pct = Math.max(0, Math.min(100, Number(t.progress) || 0));

        return `
          <div class="admin-task-card" data-task-id="${t.id}">
            <div class="admin-task-top">
              <div class="admin-task-title">
                <span class="admin-task-num">${idx + 1}</span>
                <strong style="font-size:13.5px;">${escapeHtml(t.name)}</strong>
                <span class="cat-badge ${catMeta.short}">${escapeHtml(catDisplay)}</span>
              </div>
              <button type="button" class="btn btn-danger-outline btn-sm btn-delete-task" data-id="${t.id}" title="Hapus task ini">
                🗑️
              </button>
            </div>

            <div class="slider-row">
              <input type="range" min="0" max="100" step="1" value="${pct}" class="task-range" data-id="${t.id}" />
              <input type="number" min="0" max="100" value="${pct}" class="pct-input task-number" data-id="${t.id}" />
            </div>
            <div class="preset-btns">
              ${[0, 25, 50, 75, 100]
                .map(
                  (val) =>
                    `<button type="button" class="preset-btn" data-id="${t.id}" data-val="${val}">${val}%</button>`
                )
                .join("")}
            </div>
          </div>
        `;
      })
      .join("");

    updateLiveAvgPreview();
  }

  function updateLiveAvgPreview() {
    const metrics = calculateMetrics(appData.tasks);
    const el = document.getElementById("liveAvgPreview");
    if (el) {
      el.textContent =
        `Overall: ${metrics.overallAvg}% | Power Swift: ${metrics.byCategory["Power Swift - ERS"].avg}% | ` +
        `Migrasi Fasop: ${metrics.byCategory["Migrasi Fasop"].avg}% | Stress Test: ${metrics.byCategory["Stress Test"].avg}%`;
    }
  }

  function syncTaskProgressInState(taskId, rawVal) {
    const val = Math.max(0, Math.min(100, parseInt(rawVal, 10) || 0));
    const task = appData.tasks.find((t) => String(t.id) === String(taskId));
    if (!task) return;

    task.progress = val;
    task.status = val >= 100 ? "Done" : val === 0 ? "Not Started" : "In Progress";

    const card = document.querySelector(`.admin-task-card[data-task-id="${taskId}"]`);
    if (card) {
      const range = card.querySelector(".task-range");
      const num = card.querySelector(".task-number");
      if (range) range.value = val;
      if (num) num.value = val;
    }

    updateLiveAvgPreview();
  }

  // ==================== VIEW & PIN LOGIC ====================
  function isAdminUnlocked() {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  }

  function requirePinThen(callback) {
    if (isAdminUnlocked()) {
      callback();
      return;
    }
    pendingPinAction = callback;
    document.getElementById("pinInput").value = "";
    document.getElementById("pinError").classList.add("hidden");
    document.getElementById("pinModal").classList.remove("hidden");
    setTimeout(() => document.getElementById("pinInput").focus(), 50);
  }

  function closePinModal() {
    document.getElementById("pinModal").classList.add("hidden");
    pendingPinAction = null;
  }

  function openView(viewName) {
    if (viewName === "admin" && !isAdminUnlocked()) {
      requirePinThen(() => openView("admin"));
      return;
    }

    activeView = viewName;
    document.getElementById("dashboardView").classList.toggle("hidden", viewName !== "dashboard");
    document.getElementById("adminView").classList.toggle("hidden", viewName !== "admin");

    if (viewName === "admin") {
      toggleInlineResumeEditor(false);
      renderAdminPanel();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function switchAdminSubtab(subtabName) {
    document.querySelectorAll(".admin-subtab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.subtab === subtabName);
    });
    ["update", "sync"].forEach((name) => {
      document.getElementById("subtab-" + name).classList.toggle("hidden", name !== subtabName);
    });
  }

  // ==================== PERSISTENCE ====================
  async function persistChanges(switchToDashboard = false) {
    const nowIso = new Date().toISOString();
    appData.updatedAt = nowIso;
    appData.reportTimestamp = nowIso;

    const res = await pushCloudData(appData);
    renderAll();

    if (res.ok) {
      showToast(
        res.localOnly
          ? "✅ Tersimpan di browser (Mode Lokal)."
          : "✅ Progress tersimpan ke Google Sheets (baris riwayat baru tercatat)!",
        "success"
      );
      if (switchToDashboard) openView("dashboard");
    } else {
      showToast("⚠️ Tersimpan lokal, gagal sync Cloud: " + res.error, "error");
    }
  }

  // ==================== FORMATTING TOOLBAR HELPERS ====================
  const RESUME_TEMPLATE =
    "## Reporting Resume\n" +
    "Tuliskan paragraf ringkasan utama di sini, misalnya fokus percepatan tim atau kendala yang menjadi perhatian utama saat ini.\n\n" +
    "• Poin pertama: progres fitur atau hasil uji coba terbaru.\n" +
    "• Poin kedua: status tahapan yang masih berjalan (on progress).\n" +
    "• Poin ketiga: tindak lanjut / target berikutnya.";

  function applyToolbarCommand(textarea, cmd) {
    if (!textarea) return;
    textarea.focus();

    const value = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);

    const replaceRange = (replacement, cursorOffsetFromStart) => {
      textarea.value = value.slice(0, start) + replacement + value.slice(end);
      const pos = start + (cursorOffsetFromStart !== undefined ? cursorOffsetFromStart : replacement.length);
      textarea.setSelectionRange(pos, pos);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    };

    if (cmd === "template") {
      if (value.trim() && !confirm("Ganti isi teks saat ini dengan contoh format Paragraf & Point?")) {
        return;
      }
      textarea.value = RESUME_TEMPLATE;
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    if (cmd === "bold") {
      const inner = selected || "teks tebal";
      replaceRange(`**${inner}**`, selected ? inner.length + 4 : inner.length + 2);
      return;
    }

    if (cmd === "italic") {
      const inner = selected || "teks miring";
      replaceRange(`*${inner}*`, selected ? inner.length + 2 : inner.length + 1);
      return;
    }

    // Line-based commands: heading, bullet, number
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndIdx = value.indexOf("\n", end);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
    const block = value.slice(lineStart, lineEnd);
    const lines = block.split("\n");

    let transformed;
    if (cmd === "heading") {
      transformed = lines.map((line) => {
        const clean = line.replace(/^#{1,3}\s+/, "");
        return clean.trim() ? `## ${clean}` : "## Judul Bagian";
      }).join("\n");
    } else if (cmd === "bullet") {
      transformed = lines.map((line) => {
        const clean = line.replace(/^(?:[•\-\*]|\d+[\.\)])\s+/, "");
        return clean.trim() ? `• ${clean}` : "• ";
      }).join("\n");
    } else if (cmd === "number") {
      transformed = lines.map((line, i) => {
        const clean = line.replace(/^(?:[•\-\*]|\d+[\.\)])\s+/, "");
        return clean.trim() ? `${i + 1}. ${clean}` : `${i + 1}. `;
      }).join("\n");
    } else {
      return;
    }

    textarea.value = value.slice(0, lineStart) + transformed + value.slice(lineEnd);
    const newPos = lineStart + transformed.length;
    textarea.setSelectionRange(newPos, newPos);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function handleSmartListEnter(e) {
    if (e.key !== "Enter" || e.shiftKey) return;
    const ta = e.target;
    const val = ta.value;
    const pos = ta.selectionStart;
    if (pos !== ta.selectionEnd) return;

    const lineStart = val.lastIndexOf("\n", pos - 1) + 1;
    const currentLine = val.slice(lineStart, pos);

    // Bullet auto-continue
    const bulletMatch = currentLine.match(/^([•\-\*]\s+)(.*)$/);
    if (bulletMatch) {
      e.preventDefault();
      if (!bulletMatch[2].trim()) {
        // Exit empty bullet cleanly
        ta.value = val.slice(0, lineStart) + val.slice(pos);
        ta.setSelectionRange(lineStart, lineStart);
      } else {
        const insert = "\n" + bulletMatch[1];
        ta.value = val.slice(0, pos) + insert + val.slice(pos);
        const nextPos = pos + insert.length;
        ta.setSelectionRange(nextPos, nextPos);
      }
      ta.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    // Numbered list auto-continue
    const numMatch = currentLine.match(/^(\d+)([\.\)]\s+)(.*)$/);
    if (numMatch) {
      e.preventDefault();
      if (!numMatch[3].trim()) {
        ta.value = val.slice(0, lineStart) + val.slice(pos);
        ta.setSelectionRange(lineStart, lineStart);
      } else {
        const nextNum = parseInt(numMatch[1], 10) + 1;
        const insert = `\n${nextNum}${numMatch[2]}`;
        ta.value = val.slice(0, pos) + insert + val.slice(pos);
        const nextPos = pos + insert.length;
        ta.setSelectionRange(nextPos, nextPos);
      }
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  // ==================== EVENT LISTENERS ====================
  function bindEvents() {
    // Formatting Toolbars & Smart List Enter
    document.querySelectorAll(".editor-toolbar").forEach((toolbar) => {
      toolbar.addEventListener("click", (e) => {
        const btn = e.target.closest(".toolbar-btn");
        if (!btn) return;
        const targetId = toolbar.dataset.target;
        const textarea = document.getElementById(targetId);
        applyToolbarCommand(textarea, btn.dataset.cmd);
      });
    });

    ["inlineResumeTextarea", "adminResumeTextarea"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("keydown", handleSmartListEnter);
    });

    // Bottom buttons
    document.getElementById("btnToggleAdmin").addEventListener("click", () => openView("admin"));
    document.getElementById("btnBackToDashboard").addEventListener("click", () => openView("dashboard"));

    // Inline Resume Editor
    document.getElementById("btnInlineEditResume").addEventListener("click", () => {
      requirePinThen(() => toggleInlineResumeEditor(true));
    });

    document.getElementById("btnCancelInlineResume").addEventListener("click", () => {
      toggleInlineResumeEditor(false);
    });

    document.getElementById("btnSaveInlineResume").addEventListener("click", async () => {
      appData.resumeReport = document.getElementById("inlineResumeTextarea").value.trim();
      toggleInlineResumeEditor(false);
      await persistChanges(false);
    });

    // PIN Modal
    document.getElementById("btnCancelPin").addEventListener("click", closePinModal);
    document.getElementById("pinModal").addEventListener("click", (e) => {
      if (e.target.id === "pinModal") closePinModal();
    });
    document.getElementById("pinForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const inputPin = document.getElementById("pinInput").value.trim();
      const validPin = String(getConfig().ADMIN_PIN || "2026");
      if (inputPin === validPin) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
        const action = pendingPinAction;
        closePinModal();
        showToast("🔓 Akses Update terbuka.", "success");
        if (typeof action === "function") action();
      } else {
        document.getElementById("pinError").classList.remove("hidden");
      }
    });

    // Chart Category Filter
    document.getElementById("chartFilterPills").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      chartCategoryFilter = btn.dataset.cat;
      document.querySelectorAll("#chartFilterPills .filter-pill").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      renderTaskChart();
    });

    // Admin Subtabs
    document.querySelectorAll(".admin-subtab").forEach((btn) => {
      btn.addEventListener("click", () => switchAdminSubtab(btn.dataset.subtab));
    });

    // Admin Resume & Timestamp
    document.getElementById("adminResumeTextarea").addEventListener("input", (e) => {
      appData.resumeReport = e.target.value;
    });

    document.getElementById("btnStampNow").addEventListener("click", () => {
      appData.reportTimestamp = new Date().toISOString();
      document.getElementById("adminTimestampPreview").textContent = formatTimestampID(appData.reportTimestamp);
      showToast("🕒 Timestamp diatur ke waktu sekarang.", "info");
    });

    // Admin Task Filter
    document.getElementById("adminFilterPills").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      adminCategoryFilter = btn.dataset.cat;
      document.querySelectorAll("#adminFilterPills .filter-pill").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      renderAdminTasks();
    });

    // Admin Task Delegation
    const adminTaskList = document.getElementById("adminTaskList");
    adminTaskList.addEventListener("input", (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      if (e.target.classList.contains("task-range") || e.target.classList.contains("task-number")) {
        syncTaskProgressInState(id, e.target.value);
      }
    });

    adminTaskList.addEventListener("click", (e) => {
      const preset = e.target.closest(".preset-btn");
      if (preset) {
        syncTaskProgressInState(preset.dataset.id, preset.dataset.val);
        return;
      }
      const delBtn = e.target.closest(".btn-delete-task");
      if (delBtn) {
        const id = delBtn.dataset.id;
        const task = appData.tasks.find((t) => String(t.id) === String(id));
        if (task && confirm(`Hapus task "${task.name}"?`)) {
          appData.tasks = appData.tasks.filter((t) => String(t.id) !== String(id));
          renderAdminTasks();
          showToast("Task dihapus. Klik Simpan untuk menyimpan perubahan.", "info");
        }
      }
    });

    // Save Buttons
    document.getElementById("btnSaveOnly").addEventListener("click", () => {
      appData.resumeReport = document.getElementById("adminResumeTextarea").value.trim();
      persistChanges(false);
    });
    document.getElementById("btnSaveAndView").addEventListener("click", () => {
      appData.resumeReport = document.getElementById("adminResumeTextarea").value.trim();
      persistChanges(true);
    });

    // Reset 0%
    document.getElementById("btnResetAllZero").addEventListener("click", () => {
      if (!confirm("Reset semua progress task menjadi 0%?")) return;
      appData.tasks.forEach((t) => {
        t.progress = 0;
        t.status = "Not Started";
      });
      renderAdminTasks();
      showToast("Semua progress direset ke 0%. Klik Simpan untuk menerapkan.", "info");
    });

    // Add Task Modal
    document.getElementById("btnOpenAddTask").addEventListener("click", () => {
      document.getElementById("addTaskForm").reset();
      document.getElementById("addTaskModal").classList.remove("hidden");
    });
    document.getElementById("btnCancelAddTask").addEventListener("click", () => {
      document.getElementById("addTaskModal").classList.add("hidden");
    });
    document.getElementById("addTaskModal").addEventListener("click", (e) => {
      if (e.target.id === "addTaskModal") document.getElementById("addTaskModal").classList.add("hidden");
    });
    document.getElementById("addTaskForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const cat = document.getElementById("newTaskCategory").value;
      const name = document.getElementById("newTaskName").value.trim();
      const nextId = appData.tasks.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0) + 1;

      appData.tasks.push({
        id: nextId,
        category: cat,
        name,
        progress: 0,
        status: "Not Started"
      });

      document.getElementById("addTaskModal").classList.add("hidden");
      renderAdminTasks();
      showToast(`Task "${name}" ditambahkan. Klik Simpan untuk menyimpan.`, "success");
    });

    // Sync & Backup Settings
    document.getElementById("btnSaveApiUrl").addEventListener("click", async () => {
      const url = document.getElementById("inputApiUrl").value.trim();
      const resultEl = document.getElementById("syncTestResult");
      if (!url) {
        resultEl.innerHTML = `<span style="color:var(--status-blocked);">Masukkan URL Google Apps Script terlebih dahulu.</span>`;
        return;
      }
      localStorage.setItem(CUSTOM_API_KEY, url);
      resultEl.innerHTML = `<span style="color:var(--primary);">Menguji koneksi...</span>`;
      try {
        const res = await fetch(url, {
          method: "POST",
          redirect: "follow",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "ping", pin: getConfig().API_PIN || getConfig().ADMIN_PIN || "2026" })
        });
        const json = await safeParseAppsScriptResponse(res);
        if (!json.ok) throw new Error(json.error || "PIN tidak cocok.");
        resultEl.innerHTML = `<span style="color:var(--cat-ers); font-weight:700;">✅ ${escapeHtml(json.message)}</span>`;
        showToast("Koneksi Google Sheets berhasil!", "success");
      } catch (err) {
        resultEl.innerHTML = `<span style="color:var(--status-blocked);">❌ ${escapeHtml(err.message)}</span>`;
      }
    });

    document.getElementById("btnForcePushCloud").addEventListener("click", async () => {
      if (!getActiveApiUrl()) {
        showToast("Isi URL Google Apps Script terlebih dahulu.", "error");
        return;
      }
      await persistChanges(false);
    });

    document.getElementById("btnClearApiUrl").addEventListener("click", () => {
      localStorage.removeItem(CUSTOM_API_KEY);
      document.getElementById("inputApiUrl").value = getConfig().API_URL || "";
      document.getElementById("syncTestResult").textContent = "Beralih ke konfigurasi default / Mode Lokal.";
    });

    document.getElementById("btnExportJson").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(appData, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `progress-power-inspect-${getTodayISO()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      showToast("Backup JSON berhasil diunduh.", "success");
    });

    document.getElementById("inputImportJson").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (!parsed || !Array.isArray(parsed.tasks)) throw new Error("Format JSON tidak valid");
          appData = normalizeData(parsed);
          await persistChanges(false);
          showToast("✅ Backup JSON berhasil di-restore.", "success");
        } catch (err) {
          showToast("❌ Gagal import JSON: " + err.message, "error");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    document.getElementById("btnRestoreDemo").addEventListener("click", async () => {
      if (!confirm("Reset ke 9 task bawaan?")) return;
      appData = createDefaultData();
      await persistChanges(false);
    });
  }

  // ==================== BOOTSTRAP ====================
  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    initializeData();
    // Perbarui countdown H-X otomatis setiap 1 menit & saat tab kembali aktif
    setInterval(updateCountdownBadge, 60000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) updateCountdownBadge();
    });
  });
})();
