
/**
 * ============================================================
 * KONFIGURASI DASHBOARD PROGRESS - POWER INSPECT
 * ============================================================
 * Petunjuk Singkat:
 * 1. Untuk mode OFFLINE / TESTING LOKAL: biarkan API_URL kosong ("").
 *    Data akan tersimpan otomatis di browser Anda (localStorage).
 * 2. Untuk mode ONLINE / REAL-TIME (Atasan buka via link):
 *    Ikuti langkah di PANDUAN_DEPLOY.md untuk mendapatkan URL
 *    Google Apps Script, lalu tempelkan pada API_URL di bawah ini.
 */
window.APP_CONFIG = {
  // URL Web App Google Apps Script Anda
  API_URL: "https://script.google.com/macros/s/AKfycbzwy-rjvsqivKNE49LXIJpiJXmWWPe2SFob8bo_fUgv6ewuqB8KRbgesl4d8UKNzfei9w/exec",

  // PIN untuk membuka Menu Admin / Update Progress
  // Pastikan sama dengan ADMIN_PIN di file google-apps-script.gs
  ADMIN_PIN: "2026",

  // Informasi Proyek
  PROJECT_TITLE: "PENYELESAIAN MODUL POWER SWIFT, MIGRASI FASOP & STRESS TEST",
  PROJECT_SUBTITLE: "APLIKASI POWER INSPECT — DAILY PROGRESS REPORT",
  TARGET_UAT_DATE: "2026-11-26",
  TARGET_UAT_LABEL: "Kamis, 26 Nov 2026 (UAT)"
};
