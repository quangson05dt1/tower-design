/**
 * ============================================================
 * Cloudflare Workers - API Proxy + Auth
 * ============================================================
 * Bảo vệ API keys và kiểm soát truy cập dữ liệu trạm.
 *
 * Secrets (wrangler secret put <NAME>):
 * - GOOGLE_MAPS_KEY : Google Maps API Key
 * - AUTH_URL        : URL Google Apps Script (.../exec)
 * - APP_SECRET      : chuỗi ngẫu nhiên dùng để ký token đăng nhập
 * ============================================================
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const enc = new TextEncoder();
const TOKEN_TTL_SECONDS = 12 * 3600; // token sống 12 giờ

// Trả JSON kèm CORS
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// ===== Base64URL (an toàn UTF-8) =====
function b64urlFromBytes(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function bytesFromB64url(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

// ===== Token = base64url(payload) + "." + base64url(HMAC-SHA256) =====
function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signToken(payloadObj, secret) {
  const key = await hmacKey(secret);
  const payload = b64urlFromBytes(enc.encode(JSON.stringify(payloadObj)));
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${b64urlFromBytes(new Uint8Array(sig))}`;
}

// Trả payload nếu token hợp lệ & chưa hết hạn, ngược lại trả null
async function verifyToken(token, secret) {
  if (!token || typeof token !== "string" || token.indexOf(".") < 0)
    return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      bytesFromB64url(sig),
      enc.encode(payload),
    );
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(bytesFromB64url(payload)));
    if (!data || typeof data.exp !== "number") return null;
    if (data.exp < Date.now() / 1000) return null; // hết hạn
    return data;
  } catch {
    return null;
  }
}

// Yêu cầu header "Authorization: Bearer <token>" hợp lệ
async function requireAuth(request, env) {
  if (!env.APP_SECRET) {
    return {
      ok: false,
      response: json(
        { success: false, message: "Server chưa cấu hình APP_SECRET." },
        500,
      ),
    };
  }
  const header = request.headers.get("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const payload = await verifyToken(token, env.APP_SECRET);
  if (!payload) {
    return {
      ok: false,
      response: json(
        {
          success: false,
          message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
        },
        401,
      ),
    };
  }
  return { ok: true, payload };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // Preflight CORS
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================================================
    // GET /api/config - Google Maps API key cho frontend load script.
    // Maps JS bắt buộc cần key ở client → nên KHÓA key theo HTTP
    // referrer trong Google Cloud Console để tránh bị dùng chùa.
    // ============================================================
    if (url.pathname === "/api/config" && method === "GET") {
      return json({ GOOGLE_MAPS_KEY: env.GOOGLE_MAPS_KEY || "" });
    }

    // ============================================================
    // POST /api/auth/login - Xác thực qua Apps Script, phát token HMAC
    // ============================================================
    if (url.pathname === "/api/auth/login" && method === "POST") {
      try {
        if (!env.AUTH_URL) {
          return json(
            { success: false, message: "AUTH_URL not configured" },
            500,
          );
        }
        const { username, password } = await request.json();

        const gsUrl = new URL(env.AUTH_URL);
        gsUrl.searchParams.set("action", "login");
        gsUrl.searchParams.set("u", username || "");
        gsUrl.searchParams.set("p", password || "");

        // Apps Script redirect 302 sang googleusercontent.com → fetch tự follow
        const response = await fetch(gsUrl.toString());
        const result = await response.json();

        // Đăng nhập OK → phát token ký HMAC (stateless, hết hạn sau 12h)
        if (result && result.success) {
          if (!env.APP_SECRET) {
            return json(
              { success: false, message: "Server chưa cấu hình APP_SECRET." },
              500,
            );
          }
          const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
          result.token = await signToken(
            { name: result.name || "", exp },
            env.APP_SECRET,
          );
        }
        return json(result);
      } catch {
        return json({ success: false, message: "Lỗi đăng nhập." }, 500);
      }
    }

    // ============================================================
    // GET /api/stations - Danh sách trạm từ Google Sheet (CẦN token)
    // ============================================================
    if (url.pathname === "/api/stations" && method === "GET") {
      const auth = await requireAuth(request, env);
      if (!auth.ok) return auth.response;
      try {
        if (!env.AUTH_URL) {
          return json(
            { success: false, message: "AUTH_URL not configured" },
            500,
          );
        }
        const gsUrl = new URL(env.AUTH_URL);
        gsUrl.searchParams.set("action", "stations");
        const response = await fetch(gsUrl.toString());
        return new Response(await response.text(), {
          status: response.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch {
        return json(
          { success: false, message: "Lỗi tải danh sách trạm." },
          500,
        );
      }
    }

    // ============================================================
    // POST /api/stations/update - Ghi tọa độ thực + checklist (CẦN token)
    // ============================================================
    if (url.pathname === "/api/stations/update" && method === "POST") {
      const auth = await requireAuth(request, env);
      if (!auth.ok) return auth.response;
      try {
        if (!env.AUTH_URL) {
          return json(
            { success: false, message: "AUTH_URL not configured" },
            500,
          );
        }
        const body = await request.json();
        const gsUrl = new URL(env.AUTH_URL);
        gsUrl.searchParams.set("action", "update");
        gsUrl.searchParams.set("code", body.code || "");
        gsUrl.searchParams.set("lat", body.lat ?? "");
        gsUrl.searchParams.set("lng", body.lng ?? "");
        gsUrl.searchParams.set("dienTich", body.dienTich || "");
        gsUrl.searchParams.set("biTrung", body.biTrung || "");
        gsUrl.searchParams.set("coDien", body.coDien || "");
        gsUrl.searchParams.set("anToan", body.anToan || "");
        // Người cập nhật lấy TỪ TOKEN — không tin giá trị client gửi lên
        gsUrl.searchParams.set("user", auth.payload.name || "");

        const response = await fetch(gsUrl.toString());
        return new Response(await response.text(), {
          status: response.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch {
        return json({ success: false, message: "Lỗi cập nhật trạm." }, 500);
      }
    }

    // ============================================================
    // POST /api/maps/geocode - Reverse geocoding (key giữ ở server)
    // ============================================================
    if (url.pathname === "/api/maps/geocode" && method === "POST") {
      try {
        if (!env.GOOGLE_MAPS_KEY) {
          return json({ error: "GOOGLE_MAPS_KEY not configured" }, 500);
        }
        const { lat, lng } = await request.json();
        if (lat == null || lng == null || lat === "" || lng === "") {
          return json({ error: "Missing lat or lng parameters" }, 400);
        }
        const mapsUrl = new URL(
          "https://maps.googleapis.com/maps/api/geocode/json",
        );
        mapsUrl.searchParams.append("latlng", `${lat},${lng}`);
        mapsUrl.searchParams.append("key", env.GOOGLE_MAPS_KEY);

        const response = await fetch(mapsUrl);
        return json(await response.json(), response.status);
      } catch {
        return json({ error: "Lỗi geocode." }, 500);
      }
    }

    // Health check
    if (url.pathname === "/api/health" && method === "GET") {
      return json({ status: "ok", timestamp: new Date().toISOString() });
    }

    // /api/* không khớp route → 404 JSON
    if (url.pathname.startsWith("/api/")) {
      return json(
        { error: "Not found", message: `Route ${url.pathname} does not exist` },
        404,
      );
    }

    // Fall-through: phục vụ static assets (towerdes/public) qua binding ASSETS
    return env.ASSETS.fetch(request);
  },
};
