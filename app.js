/* ============================================================
   POWER INSPECT — SINGLE-SCREEN EXECUTIVE PROGRESS DASHBOARD
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "power_inspect_dashboard_data_v2";
  const LEGACY_STORAGE_KEY = "power_inspect_dashboard_data_v1";
  const CUSTOM_API_KEY = "power_inspect_custom_api_url";
  const ADMIN_SESSION_KEY = "power_inspect_admin_unlocked";

  const REMOVED_TASK_NAMES = ["recheck flow all fitur"];

  const CATEGORIES = [
    {
      name: "Power Swift - ERS",
      cardTitle: "Total Progress Power Swift",
      eyebrow: "⚡ Power Swift - ERS",
      short: "ers",
      color: "#0284c7",
      bg: "rgba(2, 132, 199, 0.88)",
      goal: "Penyelesaian All Fitur UAT — Kamis, 26 Nov 2026"
    },
    {
      name: "Migrasi Fasop",
      cardTitle: "Total Progress Migrasi Fasop",
      eyebrow: "🔄 Migrasi Fasop",
      short: "mig",
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.88)",
      goal: "Data Fasop in Production"
    },
    {
      name: "Stress Test",
      cardTitle: "Total Progress Stress Test",
      eyebrow: "🔥 Stress Test",
      short: "stress",
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.88)",
      goal: "Rekomendasi jumlah POD pada env Stag PLN"
    }
  ];

  function createDefaultData() {
    const nowIso = new Date().toISOString();
    return {
      updatedAt: nowIso,
      reportTimestamp: nowIso,
      resumeReport:
        "Ringkasan Progress Harian Power Inspect:\n" +
        "• Power Swift - ERS: Pengembangan 6 fitur utama terus berjalan paralel menuju target UAT Kamis, 26 Nov 2026.\n" +
        "• Migrasi Fasop: Service migrasi sudah masuk tahap verifikasi dan uji sampel data inspeksi Fasop Kal.\n" +
        "• Stress Test: Baseline pengujian beban modul Fasop & Transmisi mulai dieksekusi di env Staging PLN untuk rekomendasi jumlah POD.\n\n" +
        "*(Klik tombol 'Edit Narasi' atau 'Update Progress' untuk mengganti narasi & angka sesuai kondisi terbaru.)*",
      tasks: [
        // 1 - 6: Power Swift - ERS (ReCheck Flow All Fitur removed)
        { id: 1, category: "Power Swift - ERS", name: "Dashboard Mobile", progress: 65, status: "In Progress", notes: "", goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)" },
        { id: 2, category: "Power Swift - ERS", name: "Verifikasi Karantina", progress: 55, status: "In Progress", notes: "", goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)" },
        { id: 3, category: "Power Swift - ERS", name: "Karantina Mobile", progress: 50, status: "In Progress", notes: "", goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)" },
        { id: 4, category: "Power Swift - ERS", name: "Tindak Lanjut Hasil Karantina Peminjaman", progress: 40, status: "In Progress", notes: "", goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)" },
        { id: 5, category: "Power Swift - ERS", name: "Monitoring Stock Material", progress: 45, status: "In Progress", notes: "", goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)" },
        { id: 7, category: "Power Swift - ERS", name: "Pembuatan Doc Skenario Test", progress: 60, status: "In Progress", notes: "", goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)" },

        // 7 - 8: Migrasi Fasop
        { id: 8, category: "Migrasi Fasop", name: "Pembuatan Service Migrasi", progress: 75, status: "Review", notes: "", goal: "Data Fasop in Production" },
        { id: 9, category: "Migrasi Fasop", name: "Proses Migrasi Data Inspeksi Fasop Kal", progress: 35, status: "In Progress", notes: "", goal: "Data Fasop in Production" },

        // 9 - 14: Stress Test
        { id: 10, category: "Stress Test", name: "Stress Test Fasop", progress: 50, status: "In Progress", notes: "", goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN" },
        { id: 11, category: "Stress Test", name: "Stress Test Transmisi", progress: 40, status: "In Progress", notes: "", goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN" },
        { id: 12, category: "Stress Test", name: "Stress Test ERS", progress: 30, status: "In Progress", notes: "", goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN" },
        { id: 13, category: "Stress Test", name: "Stress Test FFE", progress: 25, status: "In Progress", notes: "", goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN" },
        { id: 14, category: "Stress Test", name: "Stress Test Mantaps", progress: 25, status: "In Progress", notes: "", goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN" },
        { id: 15, category: "Stress Test", name: "Stress Test All Modul", progress: 10, status: "Not Started", notes: "", goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN" }
      ],
      dailyLogs: []
    };
  }

  /**
   * Membersihkan data lama (termasuk takeout "ReCheck Flow All Fitur" dari
   * localStorage maupun Google Sheets yang sudah tersimpan sebelumnya)
   */
  function normalizeData(raw) {
    if (!raw || !Array.isArray(raw.tasks)) return createDefaultData();

    const cleanedTasks = raw.tasks.filter((t) => {
      const n = String(t.name || "").trim().toLowerCase();
      return !REMOVED_TASK_NAMES.includes(n);
    });

    let resumeText = typeof raw.resumeReport === "string" ? raw.resumeReport : "";
    if (!resumeText && Array.isArray(raw.dailyLogs) && raw.dailyLogs.length > 0) {
      const sorted = [...raw.dailyLogs].sort((a, b) =>
        String(b.date || "").localeCompare(String(a.date || ""))
      );
      const latest = sorted[0];
      const parts = [];
      if (latest.title) parts.push(latest.title);
      if (latest.narrative) parts.push(latest.narrative);
      if (latest.blockers) parts.push("Kendala / Blocker:\n" + latest.blockers);
      if (latest.nextPlan) parts.push("Rencana Besok:\n" + latest.nextPlan);
      resumeText = parts.join("\n\n");
    }

    return {
      ...raw,
      tasks: cleanedTasks,
      resumeReport: resumeText,
      reportTimestamp: raw.reportTimestamp || raw.updatedAt || new Date().toISOString(),
      updatedAt: raw.updatedAt || new Date().toISOString(),
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
      PROJECT_TITLE: "PENYELESAIAN MODUL POWER SWIFT, MIGRASI FASOP & STRESS TEST",
      PROJECT_SUBTITLE: "APLIKASI POWER INSPECT",
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
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatTimestampID(isoString) {
    if (!isoString) return "-";
    const dt = new Date(isoString);
    if (isNaN(dt.getTime())) return isoString;
    return dt.toLocaleString("id-ID", {
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
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  function setSyncPill(state, text) {
    const pill = document.getElementById("syncPill");
    const label = document.getElementById("syncLabel");
    pill.className = "sync-pill " + state;
    label.textContent = text;
  }

  function updateCountdownBadge() {
    const cfg = getConfig();
    const badge = document.getElementById("uatCountdownBadge");
    if (!cfg.TARGET_UAT_DATE) return;

    const today = new Date(getTodayISO() + "T00:00:00");
    const target = new Date(cfg.TARGET_UAT_DATE + "T00:00:00");
    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

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
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
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

  async function fetchCloudData() {
    const url = getActiveApiUrl();
    if (!url) {
      setSyncPill("", "Mode Lokal");
      return null;
    }

    setSyncPill("syncing", "Sync...");
    try {
      const res = await fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), {
        method: "GET",
        cache: "no-store"
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Respons API tidak valid");
      setSyncPill("online", "Online • Cloud");
      if (json.empty || !json.data) return { empty: true };
      return { empty: false, data: normalizeData(json.data) };
    } catch (err) {
      console.error("Gagal memuat data cloud:", err);
      setSyncPill("error", "Offline (Lokal)");
      showToast("Gagal terhubung ke Google Sheets, menampilkan data lokal.", "error");
      return null;
    }
  }

  async function pushCloudData(data) {
    const url = getActiveApiUrl();
    // Sinkronkan ringkasan ke dailyLogs agar tab DailyLogs_Readable di Google Sheets ikut rapi
    const metrics = calculateMetrics(data.tasks);
    const today = getTodayISO();
    const logEntry = {
      id: "resume-" + today,
      date: today,
      overallProgress: metrics.overallAvg,
      categorySnapshots: {
        "Power Swift - ERS": metrics.byCategory["Power Swift - ERS"].avg,
        "Migrasi Fasop": metrics.byCategory["Migrasi Fasop"].avg,
        "Stress Test": metrics.byCategory["Stress Test"].avg
      },
      title: "Resume Report (" + formatTimestampID(data.reportTimestamp) + ")",
      narrative: data.resumeReport || "",
      blockers: "",
      nextPlan: ""
    };
    const otherLogs = (data.dailyLogs || []).filter((l) => l.id !== logEntry.id);
    data.dailyLogs = [logEntry, ...otherLogs.slice(0, 29)];

    if (!url) {
      saveLocal(data);
      setSyncPill("", "Mode Lokal");
      return { ok: true, localOnly: true };
    }

    setSyncPill("syncing", "Menyimpan...");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "save",
          pin: getConfig().ADMIN_PIN,
          data: data
        })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Gagal menyimpan ke Google Sheets");
      if (json.updatedAt) data.updatedAt = json.updatedAt;
      saveLocal(data);
      setSyncPill("online", "Online • Tersimpan");
      return { ok: true, localOnly: false };
    } catch (err) {
      console.error("Gagal push ke cloud:", err);
      saveLocal(data);
      setSyncPill("error", "Gagal Sync (Lokal)");
      return { ok: false, error: err.message };
    }
  }

  async function initializeData() {
    const cfg = getConfig();
    document.getElementById("headerTitle").textContent =
      cfg.PROJECT_TITLE + " — APLIKASI POWER INSPECT";
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
    const filtered = appData.tasks.filter(
      (t) => chartCategoryFilter === "ALL" || t.category === chartCategoryFilter
    );

    const wrapper = document.getElementById("taskChartWrapper");
    // Tuned tightly so 14 tasks fit comfortably in 1 viewport without scrolling
    const dynamicHeight = chartCategoryFilter === "ALL"
      ? Math.max(395, filtered.length * 29 + 24)
      : Math.max(240, filtered.length * 42 + 40);
    wrapper.style.height = dynamicHeight + "px";

    const ctx = document.getElementById("taskChart").getContext("2d");

    const labels = filtered.map((t, idx) => `${idx + 1}. ${t.name}`);
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
            barThickness: chartCategoryFilter === "ALL" ? 17 : 22
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
                return task ? ` Kategori: ${task.category}` : "";
              }
            }
          },
          datalabels: {
            anchor: "end",
            align: "right",
            offset: 6,
            color: "#0f172a",
            font: { weight: "700", size: 11.5 },
            formatter: (v) => v + "%"
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 112,
            ticks: {
              stepSize: 20,
              font: { size: 11 },
              callback: (v) => (v <= 100 ? v + "%" : "")
            },
            grid: { color: "#eef2f6" }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 11.5, weight: "600" },
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

  function renderResumePanel(metrics) {
    const displayBox = document.getElementById("resumeDisplayBox");
    const text = (appData.resumeReport || "").trim();

    if (text) {
      displayBox.innerHTML = escapeHtml(text);
    } else {
      displayBox.innerHTML =
        `<span class="resume-empty">Belum ada narasi / resume report. Klik tombol "✏️ Edit Narasi" di kanan atas untuk menuliskan ringkasan laporan hari ini.</span>`;
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
        <div class="mini-stat-val" style="color:var(--cat-mig);">${metrics.doneCount} / ${metrics.totalCount}</div>
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
    const btnEdit = document.getElementById("btnInlineEditResume");
    const textarea = document.getElementById("inlineResumeTextarea");

    displayBox.classList.toggle("hidden", show);
    editor.classList.toggle("hidden", !show);
    btnEdit.classList.toggle("hidden", show);

    if (show) {
      textarea.value = appData.resumeReport || "";
      setTimeout(() => textarea.focus(), 40);
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
        const pct = Math.max(0, Math.min(100, Number(t.progress) || 0));

        return `
          <div class="admin-task-card" data-task-id="${t.id}">
            <div class="admin-task-top">
              <div class="admin-task-title">
                <span class="admin-task-num">${idx + 1}</span>
                <strong style="font-size:13.5px;">${escapeHtml(t.name)}</strong>
                <span class="cat-badge ${catMeta.short}">${escapeHtml(t.category)}</span>
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
    document.getElementById("btnToggleAdmin").textContent =
      viewName === "admin" ? "📊 Lihat Dashboard" : "🔐 Update Progress";

    if (viewName === "admin") {
      toggleInlineResumeEditor(false);
      renderAdminPanel();
    } else {
      renderAll();
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
          : "✅ Progress & Narasi tersimpan ke Google Sheets!",
        "success"
      );
      if (switchToDashboard) openView("dashboard");
    } else {
      showToast("⚠️ Tersimpan lokal, gagal sync Cloud: " + res.error, "error");
    }
  }

  // ==================== EVENT LISTENERS ====================
  function bindEvents() {
    // Topbar
    document.getElementById("btnRefresh").addEventListener("click", async () => {
      const apiUrl = getActiveApiUrl();
      if (!apiUrl) {
        renderAll();
        showToast("Data lokal dimuat ulang.", "info");
        return;
      }
      const res = await fetchCloudData();
      if (res && !res.empty && res.data) {
        appData = res.data;
        saveLocal(appData);
        renderAll();
        showToast("✅ Data terbaru dimuat dari Google Sheets.", "success");
      }
    });

    document.getElementById("btnPrint").addEventListener("click", () => {
      if (activeView !== "dashboard") openView("dashboard");
      if (isInlineEditing) toggleInlineResumeEditor(false);
      setTimeout(() => window.print(), 200);
    });

    document.getElementById("btnToggleAdmin").addEventListener("click", () => {
      openView(activeView === "admin" ? "dashboard" : "admin");
    });

    document.getElementById("btnBackToDashboard").addEventListener("click", () => openView("dashboard"));

    // Inline Resume Editor on Dashboard
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
        status: "Not Started",
        notes: "",
        goal: getCategoryMeta(cat).goal
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
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "ping", pin: getConfig().ADMIN_PIN })
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "PIN tidak cocok.");
        setSyncPill("online", "Online • Cloud");
        resultEl.innerHTML = `<span style="color:var(--cat-mig); font-weight:700;">✅ ${escapeHtml(json.message)}</span>`;
        showToast("Koneksi Google Sheets berhasil!", "success");
      } catch (err) {
        setSyncPill("error", "Gagal Sync");
        resultEl.innerHTML = `<span style="color:var(--status-blocked);">❌ Gagal: ${escapeHtml(err.message)}</span>`;
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
      setSyncPill("", "Mode Lokal");
      document.getElementById("syncTestResult").textContent = "Beralih ke Mode Lokal.";
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
      if (!confirm("Reset ke 14 task & contoh data awal?")) return;
      appData = createDefaultData();
      await persistChanges(false);
    });
  }

  // ==================== BOOTSTRAP ====================
  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    initializeData();
  });
})();
