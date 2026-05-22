# Hướng dẫn Deploy Cloudflare Worker

Worker `towerdesign` vừa phục vụ giao diện vừa làm API proxy. Chạy mọi lệnh
ở **thư mục gốc** (`towerdesign/`, nơi có `wrangler.jsonc`).

## 1. Chuẩn bị

Cài Node.js, rồi đăng nhập Cloudflare (lệnh sẽ mở trình duyệt để xác thực):

```bash
npx wrangler login
```

## 2. Cấu hình Secrets

API key và URL nhạy cảm lưu ở Cloudflare Secrets, không nằm trong source.

```bash
# Khóa Google Maps API
npx wrangler secret put GOOGLE_MAPS_KEY

# URL Web App của Google Apps Script (dạng .../exec)
npx wrangler secret put AUTH_URL

# Khóa ký token đăng nhập — chuỗi ngẫu nhiên, tự sinh rồi dán vào:
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
npx wrangler secret put APP_SECRET
```

Kiểm tra đã có đủ: `npx wrangler secret list`

| Secret | Dùng để |
|---|---|
| `GOOGLE_MAPS_KEY` | Gọi Google Maps API (key ẩn khỏi client) |
| `AUTH_URL` | Địa chỉ Apps Script backend |
| `APP_SECRET` | Ký & xác minh token đăng nhập (HMAC) |

## 3. Deploy Worker

```bash
npx wrangler deploy
```

Kết quả: `https://towerdesign.soncatech.workers.dev`

Wrangler chỉ đưa lên Cloudflare thư mục `towerdes/public/` và code Worker —
`src/`, tài liệu `.md`, `package.json`... không bị publish ra ngoài.

## 4. Deploy backend (Google Apps Script)

Code Worker và backend Apps Script triển khai **riêng biệt**.

1. Mở project Apps Script, dán đè toàn bộ `login/Code.gs`, lưu lại.
2. **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
   Dùng "New version" để **giữ nguyên** URL `/exec`.
3. Nếu URL `/exec` thay đổi → cập nhật lại secret:
   `npx wrangler secret put AUTH_URL`

Hướng dẫn tạo Sheet + Apps Script lần đầu: xem `../login/README_LOGIN.md`.

## 5. Kiểm tra sau khi deploy

```bash
# Worker còn sống
curl https://towerdesign.soncatech.workers.dev/api/health

# Phiên bản Code.gs đang chạy (có trường "version" là đã deploy bản mới)
curl https://towerdesign.soncatech.workers.dev/api/backend

# API dữ liệu phải chặn truy cập không token → trả HTTP 401
curl -i https://towerdesign.soncatech.workers.dev/api/stations
```

## Các endpoint

| Endpoint | Method | Cần token | Mô tả |
|---|---|---|---|
| `/api/config` | GET | – | Trả Google Maps key cho client |
| `/api/auth/login` | POST | – | Đăng nhập, phát token |
| `/api/stations` | GET | ✔ | Danh sách trạm |
| `/api/stations/update` | POST | ✔ | Ghi tọa độ thực + checklist |
| `/api/maps/geocode` | POST | – | Reverse geocoding |
| `/api/backend` | GET | – | Phiên bản Apps Script |
| `/api/health` | GET | – | Kiểm tra Worker |

## Bảo mật

- Khóa `GOOGLE_MAPS_KEY` theo HTTP referrer trong Google Cloud Console
  (`towerdesign.soncatech.workers.dev/*`) — key Maps bắt buộc lộ ở client.
- Không commit giá trị secret thật vào repo.

## Xử lý sự cố

- **Đăng nhập báo "Server chưa cấu hình APP_SECRET"** → chạy `npx wrangler secret put APP_SECRET`.
- **`/api/backend` không có trường `version`** → Code.gs chưa deploy bản mới (xem mục 4).
- **Xem log Worker theo thời gian thực**: `npx wrangler tail`
