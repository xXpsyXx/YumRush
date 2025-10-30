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

export default function apiFetch(path, options) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
  return fetch(url, options);
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
