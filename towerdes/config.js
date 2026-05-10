/* ============================================================
   ⚠️  BẢO VỆ API KEYS
   ============================================================
   ❌ KHÔNG nên để API keys công khai trực tiếp trong code
   
   ✅ GIẢI PHÁP KHUYẾN NGHỊ:
   1. Sử dụng Backend Proxy (TỐT NHẤT):
      - Tạo endpoint backend để gọi Google Maps API
      - Client gọi /api/maps thay vì gọi trực tiếp
      - Lưu API keys trên server (.env file)
   
   2. Sử dụng Environment Variables:
      - Lưu API keys trong .env file (không commit lên git)
      - Build time: nhúng vào HTML/JS
      - Thêm vào .gitignore: .env, .env.local
   
   3. Hạn chế bằng CORS (Tạm thời):
      - Google Cloud Console → Credentials
      - API Restrictions → Chỉ cho Google Maps API
      - HTTP Referrers → Chỉ cho domain của bạn
   
   4. Giới hạn Rate Limiting:
      - Đặt quota thấp để phát hiện abuse
      - Bật monitoring và alerts
   ============================================================ */

const CONFIG = {
  MY_KEY: "123456",
  // 🔒 ĐỪNG commit API key trực tiếp! Sử dụng backend proxy
  GOOGLE_MAPS_KEY: process.env.REACT_APP_GOOGLE_MAPS_KEY || "",

  // 🔧 Thay URL Google Apps Script của bạn vào đây (sau khi deploy)
  AUTH_URL: process.env.REACT_APP_AUTH_URL || "",
};
