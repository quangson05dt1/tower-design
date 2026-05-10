/**
 * ============================================================
 * Cloudflare Workers - API Proxy
 * ============================================================
 * Bảo vệ API keys bằng cách proxy qua Cloudflare Workers
 *
 * Environment Variables (Secrets):
 * - GOOGLE_MAPS_KEY: Google Maps API Key
 * - AUTH_URL: Google Apps Script URL
 * ============================================================
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // ============================================================
    // CORS Headers - Cho phép frontend gọi
    // ============================================================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };

    // Xử lý preflight requests
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================================================
    // API Routes
    // ============================================================

    // GET /api/config - Trả về Google Maps API key cho frontend load script
    // (Maps JS API bắt buộc phải có key ở client; secret giữ trên Worker)
    if (url.pathname === "/api/config" && method === "GET") {
      return new Response(
        JSON.stringify({
          GOOGLE_MAPS_KEY: env.GOOGLE_MAPS_KEY || "",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    // POST /api/auth/login - Proxy Google Apps Script Auth
    if (url.pathname === "/api/auth/login" && method === "POST") {
      try {
        const authUrl = env.AUTH_URL;

        if (!authUrl) {
          return new Response(
            JSON.stringify({ error: "AUTH_URL not configured" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const body = await request.text();

        const response = await fetch(authUrl, {
          method: "POST",
          body: body,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const data = await response.text();

        return new Response(data, {
          status: response.status,
          headers: {
            "Content-Type":
              response.headers.get("Content-Type") || "application/json",
            ...corsHeaders,
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // POST /api/maps/geocode - Reverse geocoding (protected)
    if (url.pathname === "/api/maps/geocode" && method === "POST") {
      try {
        const mapsKey = env.GOOGLE_MAPS_KEY;

        if (!mapsKey) {
          return new Response(
            JSON.stringify({ error: "GOOGLE_MAPS_KEY not configured" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const body = await request.json();
        const { lat, lng } = body;

        if (!lat || !lng) {
          return new Response(
            JSON.stringify({ error: "Missing lat or lng parameters" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const mapsUrl = new URL(
          "https://maps.googleapis.com/maps/api/geocode/json",
        );
        mapsUrl.searchParams.append("latlng", `${lat},${lng}`);
        mapsUrl.searchParams.append("key", mapsKey);

        const response = await fetch(mapsUrl);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // Health check
    if (url.pathname === "/api/health" && method === "GET") {
      return new Response(
        JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // /api/* không khớp route → 404 JSON
    if (url.pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({
          error: "Not found",
          message: `Route ${url.pathname} does not exist`,
          available: [
            "/api/health",
            "/api/config",
            "/api/auth/login",
            "/api/maps/geocode",
          ],
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Fall-through: phục vụ static assets (index.html, script.js, ...) qua binding ASSETS
    return env.ASSETS.fetch(request);
  },
};
