# Tower Design — Tổng quan triển khai

Web app thiết kế vị trí cột & anten, có đăng nhập. Toàn bộ chạy trên **một
Cloudflare Worker** vừa phục vụ giao diện vừa làm API proxy để ẩn API key.

## Cấu trúc

```
towerdesign/                 ← thư mục gốc — chạy `wrangler deploy` tại đây
├── wrangler.jsonc           ← cấu hình Worker
├── towerdes/
│   ├── public/              ← file tĩnh (Worker đưa lên Cloudflare)
│   │   ├── index.html
│   │   ├── config.js        ← chỉ chứa URL proxy, KHÔNG có API key
│   │   ├── lang.js
│   │   └── script.js
│   └── src/
│       └── index.js         ← code Worker: API proxy + xác thực token
└── login/
    ├── Code.gs              ← backend Google Apps Script (auth + dữ liệu)
    └── README_LOGIN.md      ← hướng dẫn tạo Google Sheet + Apps Script
```

## Kiến trúc

```
Trình duyệt
   │  (cùng tên miền — không vướng CORS)
   ▼
Cloudflare Worker  towerdesign.soncatech.workers.dev
   ├─ /api/*       → proxy, dùng Secrets (API key được ẩn)
   └─ còn lại      → phục vụ file tĩnh trong public/
   │
   ▼
Google Apps Script (Code.gs)  ──►  Google Sheet (Users, Stations)
```

- **API key không nằm trong source** — lưu ở Cloudflare Secrets.
- **Đăng nhập** trả về token ký HMAC; các API dữ liệu trạm yêu cầu token.

## Triển khai nhanh

```bash
npx wrangler login                       # lần đầu
npx wrangler secret put GOOGLE_MAPS_KEY
npx wrangler secret put AUTH_URL
npx wrangler secret put APP_SECRET
npx wrangler deploy
```

- Chi tiết từng bước: xem **[DEPLOY_WORKERS.md](./DEPLOY_WORKERS.md)**.
- Cài đặt backend đăng nhập (Sheet + Apps Script): xem **[../login/README_LOGIN.md](../login/README_LOGIN.md)**.
