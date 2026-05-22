// ============================================================
//  TOWER DESIGN - Auth + Stations Backend (Google Apps Script)
//  Sheet "Users":    Username | Password | HoTen | Active
//  Sheet "Stations": Code | LatDesign | LngDesign | MaxDeviationM
//                  | LatActual | LngActual
//                  | DienTich | BiTrung | CoDien | AnToan
//                  | UpdatedAt | UpdatedBy | HeightDesign
// ============================================================

const SHEET_ID = '1V0n56d9JvGTZ_QYr04gbvZE3O6VtrvV07vbIK41kAvU';
const SHEET_USERS = 'Users';
const SHEET_STATIONS = 'Stations';

function doGet(e) {
  const params = e.parameter || {};
  const action = params.action || '';
  try {
    if (action === 'login')    return jsonResp(handleLogin(params));
    if (action === 'stations') return jsonResp(handleStations());
    if (action === 'update')   return jsonResp(handleUpdate(params));
    return jsonResp({ status: 'ok', message: 'Tower Design Server' });
  } catch (err) {
    return jsonResp({ success: false, message: 'Lỗi hệ thống: ' + err.message });
  }
}

// ============================================================
function handleLogin(params) {
  const username = (params.u || '').trim().toLowerCase();
  const password = (params.p || '').trim();
  if (!username || !password)
    return { success: false, message: 'Vui lòng nhập đầy đủ thông tin.' };

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const u = (rows[i][0] || '').toString().trim().toLowerCase();
    const p = (rows[i][1] || '').toString().trim();
    const name = (rows[i][2] || '').toString().trim();
    const active = (rows[i][3] || '').toString().trim().toLowerCase();
    if (u === username && p === password) {
      if (active !== 'true' && active !== '1' && active !== 'yes')
        return { success: false, message: 'Tài khoản chưa được kích hoạt.' };
      return { success: true, name: name || username };
    }
  }
  return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
}

// ============================================================
function handleStations() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_STATIONS);
  if (!sheet) return { success: false, message: 'Sheet "Stations" chưa tồn tại.' };
  const rows = sheet.getDataRange().getValues();
  const stations = [];
  for (let i = 1; i < rows.length; i++) {
    const code = (rows[i][0] || '').toString().trim();
    if (!code) continue;
    stations.push({
      code: code,
      latDesign: toNum(rows[i][1]),
      lngDesign: toNum(rows[i][2]),
      maxDeviationM: parseFloat(rows[i][3]) || 0,
      latActual: toNum(rows[i][4]),
      lngActual: toNum(rows[i][5]),
      dienTich: (rows[i][6] || '').toString(),
      biTrung: (rows[i][7] || '').toString(),
      coDien: (rows[i][8] || '').toString(),
      anToan: (rows[i][9] || '').toString(),
      updatedAt: rows[i][10] ? new Date(rows[i][10]).toISOString() : '',
      updatedBy: (rows[i][11] || '').toString(),
      heightDesign: toNum(rows[i][12])
    });
  }
  return { success: true, stations: stations };
}

// ============================================================
function handleUpdate(params) {
  const code = (params.code || '').trim();
  if (!code) return { success: false, message: 'Thiếu mã trạm.' };

  // Khóa script: tránh 2 lần cập nhật đồng thời ghi đè lên nhau
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    return { success: false, message: 'Hệ thống đang bận, vui lòng thử lại.' };
  }
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_STATIONS);
    if (!sheet) return { success: false, message: 'Sheet "Stations" chưa tồn tại.' };
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if ((rows[i][0] || '').toString().trim() === code) {
        const rowNum = i + 1;
        sheet.getRange(rowNum, 5).setValue(toCell(params.lat));
        sheet.getRange(rowNum, 6).setValue(toCell(params.lng));
        sheet.getRange(rowNum, 7).setValue(params.dienTich || '');
        sheet.getRange(rowNum, 8).setValue(params.biTrung || '');
        sheet.getRange(rowNum, 9).setValue(params.coDien || '');
        sheet.getRange(rowNum, 10).setValue(params.anToan || '');
        sheet.getRange(rowNum, 11).setValue(new Date());
        sheet.getRange(rowNum, 12).setValue(params.user || '');
        return { success: true, message: 'Đã cập nhật trạm ' + code + '.' };
      }
    }
    return { success: false, message: 'Không tìm thấy mã trạm: ' + code };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// Ép kiểu số an toàn — chuỗi rỗng/không hợp lệ → null
// (giữ được giá trị 0, vd tọa độ ở xích đạo / kinh tuyến gốc)
function toNum(v) {
  if (v === '' || v === null || v === undefined) return null;
  var n = parseFloat(v);
  return isNaN(n) ? null : n;
}

// Giá trị ghi vào ô Sheet: số hợp lệ → số, ngược lại → '' (ô trống)
function toCell(v) {
  var n = toNum(v);
  return n === null ? '' : n;
}

// ============================================================
function jsonResp(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
