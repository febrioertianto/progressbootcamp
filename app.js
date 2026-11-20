/* ============================================================
   POWER INSPECT — DAILY PROGRESS DASHBOARD APPLICATION LOGIC
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "power_inspect_dashboard_data_v1";
  const CUSTOM_API_KEY = "power_inspect_custom_api_url";
  const ADMIN_SESSION_KEY = "power_inspect_admin_unlocked";

  const CATEGORIES = [
    {
      name: "Power Swift - ERS",
      short: "ers",
      color: "#0284c7",
      bg: "rgba(2, 132, 199, 0.85)",
      goal: "Penyelesaian All Fitur UAT — Kamis, 26 Nov 2026 UAT"
    },
    {
      name: "Migrasi Fasop",
      short: "mig",
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.85)",
      goal: "Data Fasop in Production"
    },
    {
      name: "Stress Test",
      short: "stress",
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.85)",
      goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN"
    }
  ];

  const ERS_PICS = [
    "Muhammad Fariz [BE]",
    "Ibnu Ali Badar [BE]",
    "Muhammad Abiyyu [FE]",
    "Arif Fadilah [FE]",
    "Faidatul Hikmah [QA]",
    "Bagus Dwi Romadhon [QA]"
  ];

  const MIG_PICS = [
    "Muhammad Fariz [BE]",
    "Ridwan Al Aziz [Mig]"
  ];

  const STRESS_PICS = [
    "Muhammad Fariz [BE] [Trans & Fasop]",
    "Muhammad Ardan [QA] [Trans]",
    "Bagus Dwi Romadhon [QA] [Fasop]",
    "Ibnu Ali Badar [BE] [ERS]",
    "Muhammad Ardan [QA] [ERS]",
    "Faidatul Hikmah [QA] [FFE]",
    "Ridwan Al Aziz [QA] [Mantaps]"
  ];

  function createDefaultData() {
    const nowIso = new Date().toISOString();
    const todayStr = getTodayISO();

    return {
      updatedAt: nowIso,
      tasks: [
        // 1 - 7: Power Swift - ERS
        {
          id: 1,
          category: "Power Swift - ERS",
          name: "Dashboard Mobile",
          progress: 65,
          status: "In Progress",
          notes: "Integrasi API ringkasan dashboard selesai, penyesuaian tampilan chart mobile sedang berlangsung.",
          goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)",
          pics: [...ERS_PICS],
          updatedAt: nowIso
        },
        {
          id: 2,
          category: "Power Swift - ERS",
          name: "Verifikasi Karantina",
          progress: 55,
          status: "In Progress",
          notes: "Endpoint approval verifikasi sudah siap, lanjut integrasi form FE dan validasi role.",
          goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)",
          pics: [...ERS_PICS],
          updatedAt: nowIso
        },
        {
          id: 3,
          category: "Power Swift - ERS",
          name: "Karantina Mobile",
          progress: 50,
          status: "In Progress",
          notes: "Form input karantina di mobile sudah jalan, masih penyempurnaan upload foto & sinkronisasi offline.",
          goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)",
          pics: [...ERS_PICS],
          updatedAt: nowIso
        },
        {
          id: 4,
          category: "Power Swift - ERS",
          name: "Tindak Lanjut Hasil Karantina Peminjaman",
          progress: 40,
          status: "In Progress",
          notes: "Pengembangan backend alur tindak lanjut peminjaman sedang dikerjakan.",
          goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)",
          pics: [...ERS_PICS],
          updatedAt: nowIso
        },
        {
          id: 5,
          category: "Power Swift - ERS",
          name: "Monitoring Stock Material",
          progress: 45,
          status: "In Progress",
          notes: "Query rekap stok material selesai, lanjut UI filter & export tabel di FE.",
          goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)",
          pics: [...ERS_PICS],
          updatedAt: nowIso
        },
        {
          id: 6,
          category: "Power Swift - ERS",
          name: "ReCheck Flow All Fitur",
          progress: 20,
          status: "In Progress",
          notes: "Pengecekan bertahap dilakukan paralel oleh QA pada modul yang sudah selesai.",
          goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)",
          pics: [...ERS_PICS],
          updatedAt: nowIso
        },
        {
          id: 7,
          category: "Power Swift - ERS",
          name: "Pembuatan Doc Skenario Test",
          progress: 60,
          status: "In Progress",
          notes: "Draft skenario UAT untuk Dashboard & Karantina sudah disusun, lanjut skenario Stock Material.",
          goal: "Penyelesaian All Fitur UAT (Kamis, 26 Nov 2026 UAT)",
          pics: [...ERS_PICS],
          updatedAt: nowIso
        },

        // 8 - 9: Migrasi Fasop
        {
          id: 8,
          category: "Migrasi Fasop",
          name: "Pembuatan Service Migrasi",
          progress: 75,
          status: "Review",
          notes: "Service batch migrasi selesai dibuat, sedang tahap verifikasi mapping field & error handling.",
          goal: "Data Fasop in Production",
          pics: [...MIG_PICS],
          updatedAt: nowIso
        },
        {
          id: 9,
          category: "Migrasi Fasop",
          name: "Proses Migrasi Data Inspeksi Fasop Kal",
          progress: 35,
          status: "In Progress",
          notes: "Uji coba migrasi sampel data Kalimantan berjalan lancar, persiapan eksekusi data penuh.",
          goal: "Data Fasop in Production",
          pics: [...MIG_PICS],
          updatedAt: nowIso
        },

        // 10 - 15: Stress Test
        {
          id: 10,
          category: "Stress Test",
          name: "Stress Test Fasop",
          progress: 50,
          status: "In Progress",
          notes: "Script k6/JMeter skenario Fasop selesai, sedang menjalankan baseline load test di Staging PLN.",
          goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN",
          pics: ["Muhammad Fariz [BE] [Trans & Fasop]", "Bagus Dwi Romadhon [QA] [Fasop]"],
          updatedAt: nowIso
        },
        {
          id: 11,
          category: "Stress Test",
          name: "Stress Test Transmisi",
          progress: 40,
          status: "In Progress",
          notes: "Penyusunan skenario payload & concurrency untuk endpoint utama Transmisi.",
          goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN",
          pics: ["Muhammad Fariz [BE] [Trans & Fasop]", "Muhammad Ardan [QA] [Trans]"],
          updatedAt: nowIso
        },
        {
          id: 12,
          category: "Stress Test",
          name: "Stress Test ERS",
          progress: 30,
          status: "In Progress",
          notes: "Menyiapkan data dummy & token autentikasi untuk skenario beban modul ERS.",
          goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN",
          pics: ["Ibnu Ali Badar [BE] [ERS]", "Muhammad Ardan [QA] [ERS]"],
          updatedAt: nowIso
        },
        {
          id: 13,
          category: "Stress Test",
          name: "Stress Test FFE",
          progress: 25,
          status: "In Progress",
          notes: "Identifikasi API prioritas tinggi pada modul FFE untuk dimasukkan ke skenario stress test.",
          goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN",
          pics: ["Faidatul Hikmah [QA] [FFE]"],
          updatedAt: nowIso
        },
        {
          id: 14,
          category: "Stress Test",
          name: "Stress Test Mantaps",
          progress: 25,
          status: "In Progress",
          notes: "Setup environment & skrip pengujian awal modul Mantaps.",
          goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN",
          pics: ["Ridwan Al Aziz [QA] [Mantaps]"],
          updatedAt: nowIso
        },
        {
          id: 15,
          category: "Stress Test",
          name: "Stress Test All Modul",
          progress: 10,
          status: "Not Started",
          notes: "Akan dieksekusi setelah seluruh pengujian per modul selesai untuk rekomendasi akhir jumlah POD.",
          goal: "Mendapatkan rekomendasi jumlah POD pada env Stag PLN",
          pics: [...STRESS_PICS],
          updatedAt: nowIso
        }
      ],
      dailyLogs: [
        {
          id: "log-init-1",
          date: shiftDate(todayStr, -2),
          overallProgress: 22,
          categorySnapshots: {
            "Power Swift - ERS": 28,
            "Migrasi Fasop": 30,
            "Stress Test": 12
          },
          title: "Kick-off Bootcamp & Pemetaan Task Power Swift, Migrasi Fasop, dan Stress Test",
          narrative:
            "• Finalisasi pembagian PIC untuk 15 item pekerjaan lintas tim BE, FE, QA, dan Migrasi.\n• Setup repository, environment staging PLN, dan baseline skenario pengujian.",
          blockers: "Penyelarasan akses kredensial env Staging PLN untuk beberapa akun QA.",
          nextPlan: "Mulai pengembangan paralel fitur inti ERS dan pembuatan service migrasi Fasop."
        },
        {
          id: "log-init-2",
          date: shiftDate(todayStr, -1),
          overallProgress: 34,
          categorySnapshots: {
            "Power Swift - ERS": 41,
            "Migrasi Fasop": 45,
            "Stress Test": 22
          },
          title: "Penyelesaian API Dasar ERS & Uji Sampel Service Migrasi Fasop",
          narrative:
            "• Modul Dashboard Mobile dan Verifikasi Karantina sudah terhubung dengan API development.\n• Service Migrasi Fasop berhasil memproses batch sampel awal tanpa error validasi.\n• Draft skrip stress test Fasop dan Transmisi mulai diuji lokal.",
          blockers: "Beberapa data historis inspeksi Fasop Kal memiliki format tanggal tidak seragam (sedang ditangani di parser migrasi).",
          nextPlan: "Lanjut integrasi FE Karantina Mobile, Monitoring Stock Material, dan dry-run Stress Test Fasop di Staging."
        },
        {
          id: "log-init-3",
          date: todayStr,
          overallProgress: 42,
          categorySnapshots: {
            "Power Swift - ERS": 48,
            "Migrasi Fasop": 55,
            "Stress Test": 30
          },
          title: "Update Progress Harian — Akselerasi Fitur UAT & Baseline Stress Test",
          narrative:
            "• (Contoh data awal — silakan ubah lewat Menu Update & Narasi sesuai progres riil Anda hari ini.)\n• Progress Power Swift - ERS mencapai 48% menuju target UAT Kamis, 26 Nov 2026.\n• Service Migrasi Fasop masuk tahap review (75%) dan pengujian data Inspeksi Fasop Kal terus berjalan.\n• Baseline Stress Test Fasop sudah mulai dijalankan di environment Staging PLN.",
          blockers: "Monitoring utilisasi CPU/RAM pod saat concurrent user tinggi masih menunggu akses dashboard metrics.",
          nextPlan: "Menyelesaikan fitur Tindak Lanjut Karantina & mempercepat eksekusi Stress Test Transmisi dan ERS."
        }
      ]
    };
  }

  // ==================== STATE ====================
  let appData = null;
  let activeView = "dashboard";
  let activeSubtab = "tasks";
  let chartCategoryFilter = "ALL";
  let tableCategoryFilter = "ALL";
  let adminCategoryFilter = "ALL";
  let tableSearchQuery = "";

  let categoryChartInstance = null;
  let taskChartInstance = null;
  let trendChartInstance = null;

  // ==================== HELPERS ====================
  function getConfig() {
    return window.APP_CONFIG || {
      API_URL: "",
      ADMIN_PIN: "2026",
      PROJECT_TITLE: "PENYELESAIAN MODUL POWER SWIFT, MIGRASI FASOP & STRESS TEST",
      PROJECT_SUBTITLE: "APLIKASI POWER INSPECT — DAILY PROGRESS REPORT",
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

  function shiftDate(isoDate, deltaDays) {
    const dt = new Date(isoDate + "T00:00:00");
    dt.setDate(dt.getDate() + deltaDays);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatDateID(isoDate) {
    if (!isoDate) return "-";
    const dt = new Date(isoDate + "T00:00:00");
    if (isNaN(dt.getTime())) return isoDate;
    return dt.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function formatDateShortID(isoDate) {
    if (!isoDate) return "-";
    const dt = new Date(isoDate + "T00:00:00");
    if (isNaN(dt.getTime())) return isoDate;
    return dt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short"
    });
  }

  function formatTimestampID(isoString) {
    if (!isoString) return "-";
    const dt = new Date(isoString);
    if (isNaN(dt.getTime())) return isoString;
    return dt.toLocaleString("id-ID", {
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

  function statusToClass(status) {
    const s = String(status || "").toLowerCase();
    if (s === "done" || s === "selesai") return "done";
    if (s === "review") return "review";
    if (s === "blocked" || s === "kendala") return "blocked";
    if (s === "not started" || s === "belum mulai") return "not-started";
    return "in-progress";
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
    toastTimer = setTimeout(() => {
      el.classList.remove("show");
    }, 3200);
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

  // ==================== DATA STORAGE & CLOUD SYNC ====================
  function saveLocal(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
    }
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tasks)) return parsed;
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

    setSyncPill("syncing", "Menyinkronkan...");
    try {
      const res = await fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), {
        method: "GET",
        cache: "no-store"
      });
      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || "Respons API tidak valid");
      }
      setSyncPill("online", "Online • Google Sheets");
      if (json.empty || !json.data) {
        return { empty: true };
      }
      return { empty: false, data: json.data };
    } catch (err) {
      console.error("Gagal memuat data cloud:", err);
      setSyncPill("error", "Gagal Sync (Lokal)");
      showToast("Gagal terhubung ke Google Sheets, menampilkan data lokal.", "error");
      return null;
    }
  }

  async function pushCloudData(data) {
    const url = getActiveApiUrl();
    if (!url) {
      saveLocal(data);
      setSyncPill("", "Mode Lokal");
      return { ok: true, localOnly: true };
    }

    setSyncPill("syncing", "Menyimpan ke Cloud...");
    try {
      const res = await fetch(url, {
        method: "POST",
        // text/plain menghindari CORS preflight OPTIONS pada Google Apps Script
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "save",
          pin: getConfig().ADMIN_PIN,
          data: data
        })
      });
      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || "Gagal menyimpan ke Google Sheets");
      }
      if (json.updatedAt) data.updatedAt = json.updatedAt;
      saveLocal(data);
      setSyncPill("online", "Online • Tersimpan");
      return { ok: true, localOnly: false };
    } catch (err) {
      console.error("Gagal push ke cloud:", err);
      saveLocal(data);
      setSyncPill("error", "Sync Gagal (Disimpan Lokal)");
      return { ok: false, error: err.message };
    }
  }

  async function initializeData() {
    const cfg = getConfig();
    document.getElementById("headerTitle").textContent = cfg.PROJECT_TITLE;
    document.getElementById("headerSubtitle").textContent = cfg.PROJECT_SUBTITLE;
    updateCountdownBadge();

    // Load local data immediately for instant paint
    const localData = loadLocal();
    appData = localData || createDefaultData();
    if (!localData) saveLocal(appData);

    renderAll();

    // If online API URL configured, fetch latest cloud snapshot
    const apiUrl = getActiveApiUrl();
    if (apiUrl) {
      const cloudRes = await fetchCloudData();
      if (cloudRes && !cloudRes.empty && cloudRes.data) {
        appData = cloudRes.data;
        saveLocal(appData);
        renderAll();
      } else if (cloudRes && cloudRes.empty) {
        // Cloud sheet is fresh/empty; keep local starter data ready to push
        showToast("Google Sheets terhubung (masih kosong). Simpan di Menu Admin untuk mengirim data awal.", "info");
      }
    }
  }

  // ==================== RENDER DASHBOARD ====================
  function renderAll() {
    if (!appData) return;
    document.getElementById("lastUpdatedText").textContent = formatTimestampID(appData.updatedAt);

    renderKpiCards();
    renderCategoryChart();
    renderTaskChart();
    renderTrendChart();
    renderNarratives();
    renderTaskTable();

    if (activeView === "admin") {
      renderAdminTasks();
      renderAdminLogList();
      syncSettingsUI();
    }
  }

  function renderKpiCards() {
    const metrics = calculateMetrics(appData.tasks);
    const grid = document.getElementById("kpiGrid");

    const cardsHtml = [
      `
      <div class="kpi-card">
        <div>
          <div class="kpi-top">
            <span class="kpi-label">Total Overall Progress</span>
            <span class="kpi-count">${metrics.doneCount}/${metrics.totalCount} Selesai</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${metrics.overallAvg}%</span>
            <span class="kpi-sub">dari ${metrics.totalCount} task</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${metrics.overallAvg}%"></div>
          </div>
        </div>
        <div class="kpi-goal"><strong>Status:</strong> Gabungan seluruh modul Power Swift, Migrasi &amp; Stress Test</div>
      </div>
      `
    ];

    CATEGORIES.forEach((cat) => {
      const info = metrics.byCategory[cat.name];
      cardsHtml.push(`
        <div class="kpi-card ${cat.short}">
          <div>
            <div class="kpi-top">
              <span class="kpi-label">${escapeHtml(cat.name)}</span>
              <span class="kpi-count">${info.done}/${info.count} Task</span>
            </div>
            <div class="kpi-value-row">
              <span class="kpi-value">${info.avg}%</span>
              <span class="kpi-sub">rata-rata kategori</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${cat.short}" style="width:${info.avg}%"></div>
            </div>
          </div>
          <div class="kpi-goal"><strong>Goal:</strong> ${escapeHtml(cat.goal)}</div>
        </div>
      `);
    });

    grid.innerHTML = cardsHtml.join("");
  }

  function renderCategoryChart() {
    if (typeof Chart === "undefined") return;
    const metrics = calculateMetrics(appData.tasks);
    const ctx = document.getElementById("categoryChart").getContext("2d");

    const labels = CATEGORIES.map((c) => c.name);
    const values = CATEGORIES.map((c) => metrics.byCategory[c.name].avg);
    const colors = CATEGORIES.map((c) => c.bg);

    if (categoryChartInstance) categoryChartInstance.destroy();

    const plugins = typeof ChartDataLabels !== "undefined" ? [ChartDataLabels] : [];

    categoryChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Progress (%)",
            data: values,
            backgroundColor: colors,
            borderRadius: 8,
            maxBarThickness: 56
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` Progress: ${context.parsed.y}%`
            }
          },
          datalabels: {
            anchor: "end",
            align: "top",
            offset: 2,
            color: "#0f172a",
            font: { weight: "700", size: 12 },
            formatter: (v) => v + "%"
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 112,
            ticks: {
              stepSize: 20,
              callback: (v) => (v <= 100 ? v + "%" : "")
            },
            grid: { color: "#eef2f6" }
          },
          x: {
            grid: { display: false },
            ticks: { font: { weight: "600", size: 12 } }
          }
        }
      },
      plugins
    });
  }

  function renderTrendChart() {
    if (typeof Chart === "undefined") return;
    const ctx = document.getElementById("trendChart").getContext("2d");

    const logs = [...(appData.dailyLogs || [])].sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    );

    const labels = logs.length
      ? logs.map((l) => formatDateShortID(l.date))
      : [formatDateShortID(getTodayISO())];

    const overallSeries = logs.length
      ? logs.map((l) => Number(l.overallProgress) || 0)
      : [calculateMetrics(appData.tasks).overallAvg];

    const ersSeries = logs.length
      ? logs.map((l) => Number(l.categorySnapshots?.["Power Swift - ERS"]) || 0)
      : [calculateMetrics(appData.tasks).byCategory["Power Swift - ERS"].avg];

    const migSeries = logs.length
      ? logs.map((l) => Number(l.categorySnapshots?.["Migrasi Fasop"]) || 0)
      : [calculateMetrics(appData.tasks).byCategory["Migrasi Fasop"].avg];

    const stressSeries = logs.length
      ? logs.map((l) => Number(l.categorySnapshots?.["Stress Test"]) || 0)
      : [calculateMetrics(appData.tasks).byCategory["Stress Test"].avg];

    if (trendChartInstance) trendChartInstance.destroy();

    trendChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Overall",
            data: overallSeries,
            borderColor: "#0b4f8a",
            backgroundColor: "rgba(11, 79, 138, 0.12)",
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: "#0b4f8a"
          },
          {
            label: "Power Swift - ERS",
            data: ersSeries,
            borderColor: "#0284c7",
            borderWidth: 2,
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            pointRadius: 3
          },
          {
            label: "Migrasi Fasop",
            data: migSeries,
            borderColor: "#059669",
            borderWidth: 2,
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            pointRadius: 3
          },
          {
            label: "Stress Test",
            data: stressSeries,
            borderColor: "#d97706",
            borderWidth: 2,
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 12, font: { size: 11, weight: "600" } }
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (c) => ` ${c.dataset.label}: ${c.parsed.y}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20, callback: (v) => v + "%" },
            grid: { color: "#eef2f6" }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderTaskChart() {
    if (typeof Chart === "undefined") return;
    const filtered = appData.tasks.filter(
      (t) => chartCategoryFilter === "ALL" || t.category === chartCategoryFilter
    );

    const wrapper = document.getElementById("taskChartWrapper");
    const dynamicHeight = Math.max(240, filtered.length * 36 + 56);
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
            barThickness: 20
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const task = filtered[context.dataIndex];
                if (!task) return "";
                const lines = [` Kategori: ${task.category}`, ` Status: ${task.status}`];
                if (task.notes) lines.push(` Catatan: ${task.notes.slice(0, 90)}${task.notes.length > 90 ? "..." : ""}`);
                return lines;
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
            max: 110,
            ticks: {
              stepSize: 20,
              callback: (v) => (v <= 100 ? v + "%" : "")
            },
            grid: { color: "#eef2f6" }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 12, weight: "600" },
              color: "#1e293b"
            }
          }
        }
      },
      plugins
    });

    // Update All count button label
    const allBtn = document.querySelector('#chartFilterPills .filter-pill[data-cat="ALL"]');
    if (allBtn) allBtn.textContent = `Semua (${appData.tasks.length})`;
  }

  function renderNarratives() {
    const logs = [...(appData.dailyLogs || [])].sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
    );

    const latestEl = document.getElementById("latestNarrativeContainer");
    const timelineEl = document.getElementById("timelineContainer");

    if (!logs.length) {
      latestEl.innerHTML = `<div class="empty-state">Belum ada narasi laporan harian. Klik <strong>"+ Input Narasi Hari Ini"</strong> untuk mulai menulis milestone harian.</div>`;
      timelineEl.innerHTML = `<div class="empty-state">Riwayat laporan harian akan muncul di sini.</div>`;
      return;
    }

    const latest = logs[0];
    latestEl.innerHTML = `
      <div class="highlight-box">
        <div class="highlight-header">
          <span class="highlight-date">📅 ${escapeHtml(formatDateID(latest.date))}</span>
          <span class="highlight-score">Overall Progress: ${Number(latest.overallProgress) || 0}%</span>
        </div>
        <div class="highlight-title">${escapeHtml(latest.title)}</div>
        <div class="narrative-text">${escapeHtml(latest.narrative)}</div>
        ${
          latest.blockers || latest.nextPlan
            ? `
          <div class="narrative-subblocks">
            <div class="subblock blocker">
              <div class="subblock-title">⚠️ Kendala / Blocker</div>
              <div>${escapeHtml(latest.blockers || "Tidak ada kendala signifikan.")}</div>
            </div>
            <div class="subblock nextplan">
              <div class="subblock-title">🚀 Rencana Kerja Besok</div>
              <div>${escapeHtml(latest.nextPlan || "-")}</div>
            </div>
          </div>
          `
            : ""
        }
      </div>
    `;

    timelineEl.innerHTML = logs
      .map(
        (item) => `
        <div class="timeline-item">
          <div class="timeline-item-top">
            <span class="timeline-date">📅 ${escapeHtml(formatDateID(item.date))}</span>
            <span class="timeline-pct">Overall ${Number(item.overallProgress) || 0}%</span>
          </div>
          <div class="timeline-title">${escapeHtml(item.title)}</div>
          <div class="timeline-body">${escapeHtml(item.narrative)}</div>
        </div>
      `
      )
      .join("");
  }

  function renderTaskTable() {
    const tbody = document.getElementById("taskTableBody");
    const q = tableSearchQuery.trim().toLowerCase();

    const filtered = appData.tasks.filter((t) => {
      const matchCat = tableCategoryFilter === "ALL" || t.category === tableCategoryFilter;
      if (!matchCat) return false;
      if (!q) return true;
      const haystack = [
        t.name,
        t.category,
        t.status,
        t.notes,
        t.goal,
        ...(Array.isArray(t.pics) ? t.pics : [])
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="empty-state">Tidak ada task yang cocok dengan filter pencarian.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered
      .map((t) => {
        const catMeta = getCategoryMeta(t.category);
        const pct = Math.max(0, Math.min(100, Number(t.progress) || 0));
        const picsHtml = (Array.isArray(t.pics) ? t.pics : [])
          .map((p) => `<span class="pic-chip">${escapeHtml(p)}</span>`)
          .join("");

        return `
          <tr>
            <td><strong>${appData.tasks.indexOf(t) + 1}</strong></td>
            <td><span class="cat-badge ${catMeta.short}">${escapeHtml(t.category)}</span></td>
            <td class="task-name-cell">${escapeHtml(t.name)}</td>
            <td class="table-progress">
              <div class="table-progress-top">
                <span>${pct}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill ${catMeta.short}" style="width:${pct}%"></div>
              </div>
            </td>
            <td><span class="status-badge ${statusToClass(t.status)}">${escapeHtml(t.status)}</span></td>
            <td class="task-note-cell">
              ${
                t.notes
                  ? escapeHtml(t.notes)
                  : `<span class="task-note-empty">Belum ada catatan progress</span>`
              }
            </td>
            <td style="min-width:165px; font-size:12px; color:var(--text-secondary);">${escapeHtml(t.goal || catMeta.goal)}</td>
            <td><div class="pic-list">${picsHtml}</div></td>
          </tr>
        `;
      })
      .join("");
  }

  // ==================== RENDER ADMIN PANEL ====================
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
                <strong style="font-size:14.5px;">${escapeHtml(t.name)}</strong>
                <span class="cat-badge ${catMeta.short}">${escapeHtml(t.category)}</span>
              </div>
              <button type="button" class="btn btn-danger-outline btn-sm btn-delete-task" data-id="${t.id}" title="Hapus task ini">
                🗑️ Hapus
              </button>
            </div>

            <div class="admin-task-controls">
              <div>
                <label class="form-label">Progress Penyelesaian (%)</label>
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

              <div>
                <label class="form-label">Status</label>
                <select class="form-control task-status" data-id="${t.id}">
                  ${["Not Started", "In Progress", "Review", "Done", "Blocked"]
                    .map(
                      (st) =>
                        `<option value="${st}" ${t.status === st ? "selected" : ""}>${st}</option>`
                    )
                    .join("")}
                </select>
              </div>

              <div>
                <label class="form-label">Deskripsi / Catatan Progress Task (tampil di Dashboard)</label>
                <textarea class="form-control task-notes" data-id="${t.id}" placeholder="Tuliskan progres spesifik, hasil uji coba, atau kendala task ini...">${escapeHtml(t.notes || "")}</textarea>
              </div>
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
        `Overall: ${metrics.overallAvg}% | ERS: ${metrics.byCategory["Power Swift - ERS"].avg}% | ` +
        `Migrasi: ${metrics.byCategory["Migrasi Fasop"].avg}% | Stress Test: ${metrics.byCategory["Stress Test"].avg}%`;
    }
  }

  function syncTaskProgressInState(taskId, rawVal) {
    const val = Math.max(0, Math.min(100, parseInt(rawVal, 10) || 0));
    const task = appData.tasks.find((t) => String(t.id) === String(taskId));
    if (!task) return;

    task.progress = val;
    if (val === 100) {
      task.status = "Done";
    } else if (val === 0 && task.status !== "Blocked") {
      task.status = "Not Started";
    } else if (val > 0 && val < 100 && (task.status === "Done" || task.status === "Not Started")) {
      task.status = "In Progress";
    }

    // Sync UI controls inside the same card
    const card = document.querySelector(`.admin-task-card[data-task-id="${taskId}"]`);
    if (card) {
      const range = card.querySelector(".task-range");
      const num = card.querySelector(".task-number");
      const sel = card.querySelector(".task-status");
      if (range) range.value = val;
      if (num) num.value = val;
      if (sel) sel.value = task.status;
    }

    updateLiveAvgPreview();
  }

  function renderAdminLogList() {
    const container = document.getElementById("adminLogList");
    const logs = [...(appData.dailyLogs || [])].sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
    );

    if (!logs.length) {
      container.innerHTML = `<div class="empty-state">Belum ada laporan harian. Silakan isi form di samping.</div>`;
      return;
    }

    container.innerHTML = logs
      .map(
        (item) => `
        <div class="timeline-item">
          <div class="timeline-item-top">
            <span class="timeline-date">📅 ${escapeHtml(formatDateID(item.date))}</span>
            <span class="timeline-pct">Overall ${Number(item.overallProgress) || 0}%</span>
          </div>
          <div class="timeline-title">${escapeHtml(item.title)}</div>
          <div class="timeline-body" style="margin-bottom:8px;">${escapeHtml(item.narrative)}</div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn btn-outline btn-sm btn-edit-log" data-id="${escapeHtml(item.id)}">✏️ Edit</button>
            <button type="button" class="btn btn-danger-outline btn-sm btn-delete-log" data-id="${escapeHtml(item.id)}">🗑️ Hapus</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  function resetNarrativeForm() {
    document.getElementById("logEditId").value = "";
    document.getElementById("logDate").value = getTodayISO();
    document.getElementById("logOverallPct").value = calculateMetrics(appData.tasks).overallAvg;
    document.getElementById("logTitle").value = "";
    document.getElementById("logNarrative").value = "";
    document.getElementById("logBlockers").value = "";
    document.getElementById("logNextPlan").value = "";
    document.getElementById("narrativeFormHeading").textContent = "✍️ Tulis Laporan Narasi Harian";
    document.getElementById("btnSubmitLog").textContent = "💾 Simpan Laporan Harian";
    document.getElementById("btnCancelLogEdit").classList.add("hidden");
  }

  function syncSettingsUI() {
    const input = document.getElementById("inputApiUrl");
    if (input) input.value = getActiveApiUrl();
  }

  // ==================== VIEW & ADMIN SWITCHING ====================
  function isAdminUnlocked() {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  }

  function openView(viewName, targetSubtab = null) {
    if (viewName === "admin" && !isAdminUnlocked()) {
      openPinModal(targetSubtab);
      return;
    }

    activeView = viewName;
    document.getElementById("dashboardView").classList.toggle("hidden", viewName !== "dashboard");
    document.getElementById("adminView").classList.toggle("hidden", viewName !== "admin");
    document.getElementById("tabDashboard").classList.toggle("active", viewName === "dashboard");
    document.getElementById("tabAdmin").classList.toggle("active", viewName === "admin");

    if (viewName === "admin") {
      renderAdminTasks();
      renderAdminLogList();
      resetNarrativeForm();
      syncSettingsUI();
      if (targetSubtab) switchAdminSubtab(targetSubtab);
    } else {
      renderAll();
    }
  }

  function switchAdminSubtab(subtabName) {
    activeSubtab = subtabName;
    document.querySelectorAll(".admin-subtab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.subtab === subtabName);
    });
    ["tasks", "narrative", "sync"].forEach((name) => {
      document.getElementById("subtab-" + name).classList.toggle("hidden", name !== subtabName);
    });
    if (subtabName === "narrative" && !document.getElementById("logEditId").value) {
      document.getElementById("logOverallPct").value = calculateMetrics(appData.tasks).overallAvg;
    }
  }

  let pendingAdminSubtab = null;
  function openPinModal(targetSubtab = null) {
    pendingAdminSubtab = targetSubtab;
    document.getElementById("pinInput").value = "";
    document.getElementById("pinError").classList.add("hidden");
    document.getElementById("pinModal").classList.remove("hidden");
    setTimeout(() => document.getElementById("pinInput").focus(), 50);
  }

  function closePinModal() {
    document.getElementById("pinModal").classList.add("hidden");
  }

  // ==================== SAVE ACTIONS ====================
  async function persistChanges(switchToDashboard = false) {
    appData.updatedAt = new Date().toISOString();
    const res = await pushCloudData(appData);
    renderAll();

    if (res.ok) {
      showToast(
        res.localOnly
          ? "✅ Perubahan tersimpan di browser (Mode Lokal)."
          : "✅ Perubahan tersimpan & tersinkronisasi ke Google Sheets!",
        "success"
      );
      if (switchToDashboard) openView("dashboard");
    } else {
      showToast("⚠️ Tersimpan lokal, tapi gagal sync ke Cloud: " + res.error, "error");
    }
  }

  // ==================== EVENT LISTENERS ====================
  function bindEvents() {
    // Topbar buttons
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
        showToast("✅ Data terbaru berhasil dimuat dari Google Sheets.", "success");
      }
    });

    document.getElementById("btnPrint").addEventListener("click", () => {
      if (activeView !== "dashboard") openView("dashboard");
      setTimeout(() => window.print(), 200);
    });

    document.getElementById("btnToggleAdmin").addEventListener("click", () => {
      openView(activeView === "admin" ? "dashboard" : "admin");
    });

    document.getElementById("tabDashboard").addEventListener("click", () => openView("dashboard"));
    document.getElementById("tabAdmin").addEventListener("click", () => openView("admin"));
    document.getElementById("btnBackToDashboard").addEventListener("click", () => openView("dashboard"));
    document.getElementById("btnQuickAddNarrative").addEventListener("click", () => openView("admin", "narrative"));

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
        closePinModal();
        openView("admin", pendingAdminSubtab);
        showToast("🔓 Menu Update berhasil dibuka.", "success");
      } else {
        document.getElementById("pinError").classList.remove("hidden");
      }
    });

    // Dashboard Chart Category Filter
    document.getElementById("chartFilterPills").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      chartCategoryFilter = btn.dataset.cat;
      document.querySelectorAll("#chartFilterPills .filter-pill").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      renderTaskChart();
    });

    // Dashboard Table Filter & Search
    document.getElementById("tableFilterPills").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      tableCategoryFilter = btn.dataset.cat;
      document.querySelectorAll("#tableFilterPills .filter-pill").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      renderTaskTable();
    });

    document.getElementById("tableSearchInput").addEventListener("input", (e) => {
      tableSearchQuery = e.target.value;
      renderTaskTable();
    });

    // Admin Subtabs
    document.querySelectorAll(".admin-subtab").forEach((btn) => {
      btn.addEventListener("click", () => switchAdminSubtab(btn.dataset.subtab));
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

    // Admin Task Inputs Delegation
    const adminTaskList = document.getElementById("adminTaskList");
    adminTaskList.addEventListener("input", (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      if (e.target.classList.contains("task-range") || e.target.classList.contains("task-number")) {
        syncTaskProgressInState(id, e.target.value);
      } else if (e.target.classList.contains("task-notes")) {
        const task = appData.tasks.find((t) => String(t.id) === String(id));
        if (task) task.notes = e.target.value;
      }
    });

    adminTaskList.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      if (e.target.classList.contains("task-status")) {
        const task = appData.tasks.find((t) => String(t.id) === String(id));
        if (task) task.status = e.target.value;
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
        if (task && confirm(`Hapus task "${task.name}" dari daftar?`)) {
          appData.tasks = appData.tasks.filter((t) => String(t.id) !== String(id));
          renderAdminTasks();
          showToast("Task dihapus. Jangan lupa klik Simpan Perubahan.", "info");
        }
      }
    });

    // Save tasks buttons
    document.getElementById("btnSaveTasks").addEventListener("click", () => persistChanges(false));
    document.getElementById("btnSaveAndView").addEventListener("click", () => persistChanges(true));

    // Reset all tasks to 0%
    document.getElementById("btnResetAllZero").addEventListener("click", () => {
      if (!confirm("Reset semua angka progress task menjadi 0% dan status 'Not Started'?")) return;
      appData.tasks.forEach((t) => {
        t.progress = 0;
        t.status = "Not Started";
        t.notes = "";
      });
      renderAdminTasks();
      showToast("Semua progress direset ke 0%. Klik Simpan Perubahan untuk menyimpan.", "info");
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
      const goal = document.getElementById("newTaskGoal").value.trim() || getCategoryMeta(cat).goal;
      const picsRaw = document.getElementById("newTaskPics").value.trim();
      const pics = picsRaw ? picsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const nextId = appData.tasks.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0) + 1;

      appData.tasks.push({
        id: nextId,
        category: cat,
        name,
        progress: 0,
        status: "Not Started",
        notes: "",
        goal,
        pics,
        updatedAt: new Date().toISOString()
      });

      document.getElementById("addTaskModal").classList.add("hidden");
      renderAdminTasks();
      showToast(`Task "${name}" ditambahkan. Klik Simpan Perubahan untuk menyimpan.`, "success");
    });

    // Daily Narrative Form
    document.getElementById("narrativeForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const editId = document.getElementById("logEditId").value;
      const date = document.getElementById("logDate").value;
      const overallProgress = Math.max(0, Math.min(100, parseInt(document.getElementById("logOverallPct").value, 10) || 0));
      const title = document.getElementById("logTitle").value.trim();
      const narrative = document.getElementById("logNarrative").value.trim();
      const blockers = document.getElementById("logBlockers").value.trim();
      const nextPlan = document.getElementById("logNextPlan").value.trim();

      const metrics = calculateMetrics(appData.tasks);
      const categorySnapshots = {
        "Power Swift - ERS": metrics.byCategory["Power Swift - ERS"].avg,
        "Migrasi Fasop": metrics.byCategory["Migrasi Fasop"].avg,
        "Stress Test": metrics.byCategory["Stress Test"].avg
      };

      if (!Array.isArray(appData.dailyLogs)) appData.dailyLogs = [];

      if (editId) {
        const idx = appData.dailyLogs.findIndex((l) => l.id === editId);
        if (idx !== -1) {
          appData.dailyLogs[idx] = {
            ...appData.dailyLogs[idx],
            date,
            overallProgress,
            title,
            narrative,
            blockers,
            nextPlan
          };
        }
      } else {
        appData.dailyLogs.push({
          id: "log-" + Date.now(),
          date,
          overallProgress,
          categorySnapshots,
          title,
          narrative,
          blockers,
          nextPlan
        });
      }

      resetNarrativeForm();
      await persistChanges(false);
      renderAdminLogList();
    });

    document.getElementById("btnCancelLogEdit").addEventListener("click", resetNarrativeForm);

    document.getElementById("adminLogList").addEventListener("click", async (e) => {
      const editBtn = e.target.closest(".btn-edit-log");
      if (editBtn) {
        const log = appData.dailyLogs.find((l) => l.id === editBtn.dataset.id);
        if (!log) return;
        document.getElementById("logEditId").value = log.id;
        document.getElementById("logDate").value = log.date;
        document.getElementById("logOverallPct").value = log.overallProgress;
        document.getElementById("logTitle").value = log.title;
        document.getElementById("logNarrative").value = log.narrative;
        document.getElementById("logBlockers").value = log.blockers || "";
        document.getElementById("logNextPlan").value = log.nextPlan || "";
        document.getElementById("narrativeFormHeading").textContent = "✏️ Edit Laporan Harian";
        document.getElementById("btnSubmitLog").textContent = "💾 Update Laporan";
        document.getElementById("btnCancelLogEdit").classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const delBtn = e.target.closest(".btn-delete-log");
      if (delBtn) {
        if (!confirm("Hapus catatan laporan harian ini?")) return;
        appData.dailyLogs = appData.dailyLogs.filter((l) => l.id !== delBtn.dataset.id);
        await persistChanges(false);
        renderAdminLogList();
      }
    });

    // Cloud Sync Settings & Backup
    document.getElementById("btnSaveApiUrl").addEventListener("click", async () => {
      const url = document.getElementById("inputApiUrl").value.trim();
      const resultEl = document.getElementById("syncTestResult");
      if (!url) {
        resultEl.innerHTML = `<span style="color:var(--status-blocked);">Masukkan URL Google Apps Script terlebih dahulu.</span>`;
        return;
      }
      localStorage.setItem(CUSTOM_API_KEY, url);
      resultEl.innerHTML = `<span style="color:var(--primary);">Menguji koneksi ke Google Sheets...</span>`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "ping", pin: getConfig().ADMIN_PIN })
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "Gagal autentikasi PIN.");
        setSyncPill("online", "Online • Google Sheets");
        resultEl.innerHTML = `<span style="color:var(--cat-mig); font-weight:700;">✅ ${escapeHtml(json.message)}</span>`;
        showToast("Koneksi Google Sheets berhasil!", "success");
      } catch (err) {
        setSyncPill("error", "Gagal Sync");
        resultEl.innerHTML = `<span style="color:var(--status-blocked);">❌ Gagal terhubung: ${escapeHtml(err.message)}</span>`;
      }
    });

    document.getElementById("btnForcePushCloud").addEventListener("click", async () => {
      if (!getActiveApiUrl()) {
        showToast("Isi & simpan URL Google Apps Script terlebih dahulu.", "error");
        return;
      }
      await persistChanges(false);
    });

    document.getElementById("btnClearApiUrl").addEventListener("click", () => {
      localStorage.removeItem(CUSTOM_API_KEY);
      document.getElementById("inputApiUrl").value = getConfig().API_URL || "";
      setSyncPill("", "Mode Lokal");
      document.getElementById("syncTestResult").textContent = "Beralih ke Mode Lokal (browser).";
    });

    document.getElementById("btnExportJson").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(appData, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `progress-power-inspect-${getTodayISO()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      showToast("File backup JSON berhasil diunduh.", "success");
    });

    document.getElementById("inputImportJson").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (!parsed || !Array.isArray(parsed.tasks)) throw new Error("Format JSON tidak valid");
          appData = parsed;
          await persistChanges(false);
          showToast("✅ Data backup JSON berhasil di-restore.", "success");
        } catch (err) {
          showToast("❌ Gagal import JSON: " + err.message, "error");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    document.getElementById("btnRestoreDemo").addEventListener("click", async () => {
      if (!confirm("Kembalikan ke daftar 15 task & contoh data awal?")) return;
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
