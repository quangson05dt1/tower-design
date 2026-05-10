# 🚀 Hướng dẫn Deploy Cloudflare Workers Proxy

## 📋 Chuẩn bị

### 1. Cài đặt Wrangler CLI

```bash
npm install -g @cloudflare/wrangler
```

### 2. Đăng nhập Cloudflare

```bash
wrangler login
```

> Điều này sẽ mở trình duyệt để xác thực tài khoản Cloudflare

---

## 🔐 Cấu hình Secrets (API Keys)

### 1. Thêm Google Maps API Key

```bash
wrangler secret put GOOGLE_MAPS_KEY
# Nhập API key của bạn khi được hỏi
```

### 2. Thêm Google Apps Script Auth URL

```bash
wrangler secret put AUTH_URL
# Nhập URL đầy đủ của Google Apps Script, ví dụ:
# https://script.google.com/macros/s/AKfycbyLx31Mr4l_pd2i_K8gG_zSQ1-JtEcZT-Nniz3bUDuWgaaD7RzVaOTCrtyRmC5V1vfS6Q/exec
```

### 3. Xác nhận Secrets đã được lưu

```bash
wrangler secret list
```

---

## 🧪 Test Locally (Optional)

```bash
# Start local development server
wrangler dev

# Test endpoint:
# curl http://localhost:8787/api/health
```

---

## 🚀 Deploy Worker

### Option 1: Deploy Worker riêng biệt

```bash
wrangler deploy
```

Kết quả:

```
✓ Deployed successfully to https://tower-design-api.your-username.workers.dev
```

Ghi nhớ URL này để sử dụng trong frontend.

### Option 2: Deploy cùng Cloudflare Pages (Advanced)

Nếu muốn Worker + Pages cùng domain:

1. Vào Cloudflare Dashboard
2. **Pages** → Project của bạn
3. Settings → **Functions**
4. Kết nối `/api/*` routes tới Workers

---

## 🔗 Cập nhật Frontend

Khi deploy, Frontend cần gọi qua proxy:

### Thay đổi trong `script.js`:

#### Cũ (trực tiếp):

```javascript
const response = await fetch(
  `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_KEY}`,
);
```

#### Mới (qua proxy):

```javascript
const response = await fetch(
  `${CONFIG.GOOGLE_MAPS_PROXY}?lat=${lat}&lng=${lng}`,
);
```

---

## 🌐 Sử dụng API Proxy trong Frontend

### Health Check

```bash
curl https://tower-design-api.your-username.workers.dev/api/health
```

### Lấy Config

```bash
curl https://tower-design-api.your-username.workers.dev/api/config
```

### Auth Login (POST)

```bash
curl -X POST https://tower-design-api.your-username.workers.dev/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user&password=pass"
```

### Maps Geocode (POST)

```bash
curl -X POST https://tower-design-api.your-username.workers.dev/api/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"lat": -25.744104, "lng": 32.671572}'
```

---

## 📌 Cập nhật `config.js`

Cấu hình URL Worker proxy (thay YOUR_USERNAME):

```javascript
const CONFIG = {
  GOOGLE_MAPS_PROXY:
    "https://tower-design-api.YOUR_USERNAME.workers.dev/api/maps/geocode",
  AUTH_PROXY:
    "https://tower-design-api.YOUR_USERNAME.workers.dev/api/auth/login",
};
```

---

## ✅ Kiểm tra Deploy

### 1. Xác nhận Worker đang chạy

```bash
curl https://tower-design-api.your-username.workers.dev/api/health
```

Kết quả:

```json
{ "status": "ok", "timestamp": "2024-05-10T10:30:00.000Z" }
```

### 2. Test Auth Proxy

```bash
curl -X POST https://tower-design-api.your-username.workers.dev/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "myKey=123456"
```

---

## 🔄 Update Secrets sau khi Deploy

Nếu cần thay đổi API key:

```bash
wrangler secret put GOOGLE_MAPS_KEY
# Nhập giá trị mới
```

Secrets được cập nhật ngay lập tức, không cần redeploy.

---

## 🛠️ Troubleshooting

### Error: "Secrets not configured"

- Chạy `wrangler secret put GOOGLE_MAPS_KEY`
- Chạy `wrangler secret put AUTH_URL`

### Error: "Failed to authenticate"

- Chạy `wrangler login` lại
- Kiểm tra tài khoản Cloudflare có quyền Workers không

### Error: "Not found (404)"

- Kiểm tra endpoint URL có đúng không
- Kiểm tra method (GET/POST) có đúng không

---

## 📊 Monitoring

Xem logs của Worker:

```bash
wrangler tail
```

Trên Cloudflare Dashboard:

- Workers → tower-design-api → Analytics
- Xem request/response logs

---

## 🎯 Lợi ích sau khi deploy

✅ API keys hoàn toàn ẩn  
✅ Không lộ Google Apps Script URL  
✅ Có thể log/monitor tất cả API calls  
✅ Có thể implement rate limiting  
✅ CORS được xử lý tự động  
✅ An toàn hơn khi deploy frontend

---

## Cần giúp?

- Cloudflare Docs: https://developers.cloudflare.com/workers/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/commands/
