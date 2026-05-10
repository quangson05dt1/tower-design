const CONFIG = {
  MY_KEY: "123456",

  // ✅ BẢO VỆ: Gọi qua Cloudflare Workers Proxy
  // API keys được lưu trữ ở Cloudflare Secrets, không lộ công khai
  GOOGLE_MAPS_PROXY: "/api/maps/geocode",
  AUTH_PROXY: "/api/auth/login",

  // URL gốc cho script tag (nếu cần)
  // GOOGLE_MAPS_SCRIPT: "https://maps.googleapis.com/maps/api/js?callback=initMap"
};
