const CONFIG = {
  MY_KEY: "123456",

  // ✅ BẢO VỆ: Gọi qua Cloudflare Workers Proxy
  // API keys được lưu trữ ở Cloudflare Secrets, không lộ trong source
  CONFIG_PROXY: "https://tower-design.soncatech.workers.dev/api/config",
  GOOGLE_MAPS_PROXY: "https://tower-design.soncatech.workers.dev/api/maps/geocode",
  AUTH_PROXY: "https://tower-design.soncatech.workers.dev/api/auth/login",
};
