// Lightweight API helper to resolve the correct backend base URL in dev and prod.
// Use import.meta.env.VITE_API_URL (Vite) or process.env.VITE_API_URL (if defined)
const VITE_API_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env && process.env.VITE_API_URL) ||
  "";

function normalizeBase(base) {
  return base ? base.replace(/\/$/, "") : "";
}

export const API_BASE = normalizeBase(VITE_API_URL);

// Enhanced apiFetch with caching support
export default async function apiFetch(path, options = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;

  // Only cache GET requests
  const isGetRequest = !options.method || options.method === "GET";

  // Import cache dynamically to avoid circular dependencies
  const { cache } = await import("./cache.js");

  // Check cache first for GET requests (skip cache if options.skipCache is true)
  if (isGetRequest && !options.skipCache) {
    const cached = cache.get(url);
    if (cached) {
      // Return cached response immediately, then fetch fresh data in background
      setTimeout(() => {
        fetch(url, options)
          .then((freshRes) => {
            if (freshRes.ok) {
              return freshRes.json();
            }
            return null;
          })
          .then((freshData) => {
            if (freshData) {
              cache.set(url, freshData);
            }
          })
          .catch(() => {
            // Ignore background fetch errors
          });
      }, 0);

      // Return cached data immediately
      return Promise.resolve(
        new Response(JSON.stringify(cached), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    }
  }

  // No cache, fetch normally
  const res = await fetch(url, options);

  // Cache successful GET responses (skip caching if options.skipCache is true)
  if (isGetRequest && res.ok && !options.skipCache) {
    const clonedRes = res.clone();
    try {
      const data = await clonedRes.json();
      cache.set(url, data);
    } catch (e) {
      // Not JSON, don't cache
    }
  }

  return res;
}

// Resolve asset URLs (images, static files). If the path is absolute (starts with http)
// or already a protocol-relative URL, return as-is. Otherwise prefix with API_BASE
// when set so client served from Vercel can fetch assets from Railway.
export function asset(path) {
  if (!path) return path;
  if (typeof path !== "string") return path;
  if (/^(https?:)?\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
}
