# 🔐 Hướng dẫn cài đặt hệ thống đăng nhập

## Tổng quan
- **Frontend:** index.html (màn hình login + app)
- **Backend:** Google Apps Script (Code.gs) — xác thực
- **Database:** Google Sheets — danh sách 200 user

---

## BƯỚC 1 — Tạo Google Sheet danh sách user

1. Vào [sheets.google.com](https://sheets.google.com) → tạo sheet mới
2. Đặt tên sheet tab là: **Users**
3. Tạo các cột theo thứ tự:

| A | B | C | D |
|---|---|---|---|
| Username | Password | HoTen | Active |
| nguyenvana | matkhau123 | Nguyễn Văn A | true |
| tranthib | pass456 | Trần Thị B | true |
| user_nghi | pass789 | Người dùng C | false |

> ⚠️ Dòng 1 là tiêu đề, dữ liệu bắt đầu từ dòng 2
> - **Active = true** → cho phép đăng nhập
> - **Active = false** → tài khoản bị khóa

4. **Copy ID của Sheet** từ URL:
   `https://docs.google.com/spreadsheets/d/`**`ĐÂY_LÀ_ID`**`/edit`

---

## BƯỚC 2 — Tạo Google Apps Script

1. Vào [script.google.com](https://script.google.com) → **New project**
2. Đặt tên project: **TowerDesign Auth**
3. Xóa code cũ, dán toàn bộ nội dung file `Code.gs` vào
4. Tìm dòng này và thay ID sheet của bạn:
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
   ```
5. **Lưu** (Ctrl+S)

---

## BƯỚC 3 — Deploy Apps Script

1. Nhấn **Deploy** → **New deployment**
2. Chọn type: **Web app**
3. Cấu hình:
   - **Description:** Tower Design Auth v1
   - **Execute as:** Me
   - **Who has access:** Anyone ← bắt buộc để app gọi được
4. Nhấn **Deploy**
5. Lần đầu sẽ yêu cầu cấp quyền → nhấn **Authorize access** → chọn tài khoản Google → Allow
6. **Copy URL** dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## BƯỚC 4 — Cập nhật config.js

Mở file `config.js`, thay URL vào:

```javascript
const CONFIG = {
  MY_KEY: '123456',
  GOOGLE_MAPS_KEY: 'AIzaSy...',
  AUTH_URL: 'https://script.google.com/macros/s/AKfycb.../exec'  // ← Dán vào đây
};
```

---

## BƯỚC 5 — Deploy app lên Netlify

1. Vào [netlify.com/drop](https://app.netlify.com/drop)
2. Kéo thả **thư mục** chứa các file:
   - `index.html`
   - `config.js`
   - `lang.js`
   - `script.js`
   > ⚠️ KHÔNG upload file `Code.gs` và `README_LOGIN.md`
3. Nhận link → chia sẻ cho 200 người dùng

---

## Quản lý user

| Thao tác | Cách làm |
|---|---|
| Thêm user mới | Thêm dòng mới vào Google Sheet |
| Khóa tài khoản | Đổi cột Active thành `false` |
| Đổi mật khẩu | Sửa cột Password trong Sheet |
| Xóa user | Xóa dòng trong Sheet |

> ✅ Thay đổi có hiệu lực **ngay lập tức**, không cần deploy lại app

---

## Lưu ý bảo mật

- Mật khẩu lưu dạng **plain text** trong Sheet → phù hợp nội bộ
- Nếu cần bảo mật cao hơn, có thể hash password bằng MD5
- Sheet chỉ nên share với người quản trị
- Không share file `config.js` ra ngoài (chứa API key)
