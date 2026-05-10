# Tower Design - An toàn với Cloudflare Workers Proxy

## 📂 Cấu trúc Project

```
towerdes/
├── index.html              ← HTML interface
├── script.js               ← Frontend logic (đã cập nhật dùng proxy)
├── lang.js                 ← Language support
├── config.js               ← Config (chỉ chứa proxy URLs)
├── .env.example            ← Template cho environment variables
├── .gitignore              ← Không commit .env, node_modules
├── package.json            ← Dependencies cho Wrangler
├── wrangler.toml           ← Cloudflare Workers config
├── DEPLOY_WORKERS.md       ← Hướng dẫn deploy chi tiết
├── DEPLOY_README.md        ← File này
└── src/
    └── index.js            ← Cloudflare Workers code (API Proxy)
```

---

## 🚀 Quick Start

### 1. Setup Local
```bash
cd towerdes
npm install
```

### 2. Cấu hình Secrets
```bash
wrangler login
wrangler secret put GOOGLE_MAPS_KEY       # Nhập API key
wrangler secret put AUTH_URL              # Nhập Google Apps Script URL
```

### 3. Deploy
```bash
wrangler deploy
```

### 4. Cập nhật Frontend
Thay URL Worker vào script.js (xem DEPLOY_WORKERS.md)

---

## 🔐 Bảo vệ

### Trước (không an toàn):
- API keys công khai trong `config.js`
- Frontend gọi trực tiếp Google APIs
- Có thể bị abuse/overuse

### Sau (an toàn):
- API keys lưu trong Cloudflare Secrets
- Frontend gọi qua Worker Proxy (`/api/...`)
- Có thể implement rate limiting/monitoring

---

## 📚 Tài liệu

- **[DEPLOY_WORKERS.md](./DEPLOY_WORKERS.md)** - Hướng dẫn deploy chi tiết
- **[src/index.js](./src/index.js)** - Worker code với chi tiết
- **[config.js](./config.js)** - Config proxy URLs
- **[.env.example](./.env.example)** - Template secrets

---

## ✅ Testing

### Test Health Check
```bash
curl https://tower-design-api.YOUR_USERNAME.workers.dev/api/health
```

### Test Config
```bash
curl https://tower-design-api.YOUR_USERNAME.workers.dev/api/config
```

### Test Geocode (Maps)
```bash
curl -X POST https://tower-design-api.YOUR_USERNAME.workers.dev/api/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"lat": -25.744104, "lng": 32.671572}'
```

---

## 🆘 Troubleshooting

### "Secrets not configured"
```bash
wrangler secret list
# Nếu rỗng, chạy:
wrangler secret put GOOGLE_MAPS_KEY
wrangler secret put AUTH_URL
```

### "Worker not responding"
```bash
wrangler tail          # Xem logs
wrangler deploy        # Deploy lại
```

### "CORS error"
- Kiểm tra `corsHeaders` trong `src/index.js`
- Đảm bảo `Access-Control-Allow-Origin` được set

---

## 🎯 Deploy Flow

```
Local Dev
    ↓
git push origin main
    ↓
Cloudflare Pages (Static Site)
    ↓
Frontend calls /api/... (relative URL)
    ↓
Routed to Cloudflare Workers
    ↓
Worker uses Secrets (API keys)
    ↓
Call external APIs (Google Maps, Apps Script)
    ↓
Return response to Frontend
```

---

## 📌 Lưu ý quan trọng

⚠️ **Không commit `.env` file!**
- `.gitignore` đã exclude nó
- Production dùng `wrangler secret put`

⚠️ **Cloudflare Secrets tồn tại ở mỗi environment:**
- Production (custom domain)
- Staging
- Development

✅ **Tất cả requests đều qua Proxy**
- Không có hardcoded API keys
- An toàn hơn khi deploy public

---

## 🔗 Links

- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- Google Cloud Console: https://console.cloud.google.com/

---

**Next steps:** Xem [DEPLOY_WORKERS.md](./DEPLOY_WORKERS.md) để deploy chi tiết.
