/**
 * ============================================================
 * GOOGLE APPS SCRIPT BACKEND - POWER INSPECT PROGRESS DASHBOARD
 * ============================================================
 * Cara Pakai:
 * 1. Buka https://sheets.google.com dan buat Spreadsheet baru
 *    (misal beri nama: "DB Progress Power Inspect").
 * 2. Klik menu Ekstensi (Extensions) > Apps Script.
 * 3. Hapus semua kode bawaan, lalu copy-paste seluruh isi file ini.
 * 4. Ubah ADMIN_PIN di bawah jika ingin mengganti PIN (harus sama dengan config.js).
 * 5. Klik Simpan (Ctrl+S).
 * 6. Klik Terapkan (Deploy) > Deployment baru (New deployment):
 *    - Jenis (Type): Aplikasi web (Web app)
 *    - Jalankan sebagai (Execute as): Saya (Me)
 *    - Yang memiliki akses (Who has access): Siapa saja (Anyone)
 * 7. Klik Terapkan (Deploy), izinkan akses jika diminta, lalu copy URL Web App.
 * 8. Tempelkan URL tersebut ke API_URL di file config.js.
 */

const ADMIN_PIN = "2026";
const SHEET_STORE = "DashboardJSON";
const SHEET_TASKS = "Tasks_Readable";
const SHEET_LOGS = "DailyLogs_Readable";

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET: Mengambil data terbaru untuk ditampilkan di Dashboard Atasan
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const store = getOrCreateSheet(ss, SHEET_STORE);
    const raw = store.getRange("A1").getValue();

    if (!raw) {
      return jsonResponse({
        ok: true,
        empty: true,
        data: null,
        message: "Database siap. Belum ada data tersimpan."
      });
    }

    const parsed = JSON.parse(raw);
    return jsonResponse({
      ok: true,
      empty: false,
      data: parsed
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: String(err)
    });
  }
}

/**
 * POST: Menyimpan update Progress Task & Narasi Harian dari Menu Admin
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "Payload kosong." });
    }

    const payload = JSON.parse(e.postData.contents);

    // Validasi PIN keamanan
    if (String(payload.pin || "") !== String(ADMIN_PIN)) {
      return jsonResponse({ ok: false, error: "PIN Admin salah. Perubahan ditolak." });
    }

    if (payload.action === "ping") {
      return jsonResponse({ ok: true, message: "Koneksi Google Sheets berhasil!" });
    }

    const data = payload.data;
    if (!data || !Array.isArray(data.tasks)) {
      return jsonResponse({ ok: false, error: "Format data tidak valid." });
    }

    data.updatedAt = new Date().toISOString();

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Simpan raw JSON (cepat & akurat untuk web dashboard)
    const store = getOrCreateSheet(ss, SHEET_STORE);
    store.getRange("A1").setValue(JSON.stringify(data));
    store.getRange("A2").setValue("Last Updated: " + data.updatedAt);

    // 2. Sinkronisasi ke tab Tasks_Readable agar mudah dibaca langsung di Spreadsheet
    const tasksSheet = getOrCreateSheet(ss, SHEET_TASKS);
    tasksSheet.clearContents();
    const taskRows = [
      ["NO", "KATEGORI", "TASK", "PROGRESS (%)", "STATUS", "DESKRIPSI / CATATAN", "GOALS", "PIC - ROLE", "UPDATED AT"]
    ];
    data.tasks.forEach(function (t, idx) {
      taskRows.push([
        idx + 1,
        t.category || "",
        t.name || "",
        Number(t.progress) || 0,
        t.status || "",
        t.notes || "",
        t.goal || "",
        Array.isArray(t.pics) ? t.pics.join("\n") : (t.pics || ""),
        t.updatedAt || data.updatedAt
      ]);
    });
    tasksSheet.getRange(1, 1, taskRows.length, taskRows[0].length).setValues(taskRows);
    tasksSheet.getRange(1, 1, 1, taskRows[0].length).setFontWeight("bold");

    // 3. Sinkronisasi ke tab DailyLogs_Readable untuk rekap laporan harian
    const logsSheet = getOrCreateSheet(ss, SHEET_LOGS);
    logsSheet.clearContents();
    const logRows = [
      ["TANGGAL", "OVERALL (%)", "POWER SWIFT - ERS (%)", "MIGRASI FASOP (%)", "STRESS TEST (%)", "JUDUL MILESTONE", "NARASI PROGRESS", "KENDALA / BLOCKER", "RENCANA BESOK"]
    ];
    const logs = Array.isArray(data.dailyLogs) ? data.dailyLogs : [];
    logs.forEach(function (l) {
      const catSnap = l.categorySnapshots || {};
      logRows.push([
        l.date || "",
        Number(l.overallProgress) || 0,
        Number(catSnap["Power Swift - ERS"]) || 0,
        Number(catSnap["Migrasi Fasop"]) || 0,
        Number(catSnap["Stress Test"]) || 0,
        l.title || "",
        l.narrative || "",
        l.blockers || "",
        l.nextPlan || ""
      ]);
    });
    logsSheet.getRange(1, 1, logRows.length, logRows[0].length).setValues(logRows);
    logsSheet.getRange(1, 1, 1, logRows[0].length).setFontWeight("bold");

    return jsonResponse({
      ok: true,
      updatedAt: data.updatedAt,
      message: "Data berhasil disimpan ke Google Sheets."
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: String(err)
    });
  }
}
