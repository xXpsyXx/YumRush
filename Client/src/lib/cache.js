// Client-side cache with in-memory and localStorage fallback
// Provides instant loading for cached data while fetching fresh data in background

const MEMORY_CACHE = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const STORAGE_PREFIX = "api_cache_";

class Cache {
  constructor() {
    // Load cache from localStorage on init
    this.loadFromStorage();
  }

  // Get cached data
  get(url) {
    const key = typeof url === "string" ? url : url.toString();
    const cached = MEMORY_CACHE.get(key);

    if (!cached) {
      // Try localStorage as fallback
      const stored = this.getFromStorage(key);
      if (stored && this.isValid(stored)) {
        // Restore to memory cache
        MEMORY_CACHE.set(key, stored);
        return stored.data;
      }
      return null;
    }

    if (this.isValid(cached)) {
      return cached.data;
    }

    // Cache expired, remove it
    MEMORY_CACHE.delete(key);
    this.removeFromStorage(key);
    return null;
  }

  // Set cached data
  set(url, data) {
    const key = typeof url === "string" ? url : url.toString();
    const cached = {
      data,
      timestamp: Date.now(),
    };
    MEMORY_CACHE.set(key, cached);
    // Also save to localStorage
    this.saveToStorage(key, cached);
  }

  // Check if cache is still valid
  isValid(cached) {
    if (!cached || !cached.timestamp) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  }

  // localStorage methods
  saveToStorage(key, cached) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(cached));
    } catch (e) {
      // localStorage might be full or disabled - silently fail
    }
  }

  getFromStorage(key) {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  removeFromStorage(key) {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (e) {
      // Ignore errors
    }
  }

  loadFromStorage() {
    try {
      // Load all cache entries from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const cached = this.getFromStorage(key.replace(STORAGE_PREFIX, ""));
          if (cached && this.isValid(cached)) {
            MEMORY_CACHE.set(key.replace(STORAGE_PREFIX, ""), cached);
          } else {
            // Clean up expired entries
            localStorage.removeItem(key);
          }
        }
      }
    } catch (e) {
      // Ignore errors
    }
  }

  // Clear specific URL from cache
  clearUrl(url) {
    const key = typeof url === "string" ? url : url.toString();
    MEMORY_CACHE.delete(key);
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (e) {
      // Ignore errors
    }
  }

  // Clear all cache
  clear() {
    MEMORY_CACHE.clear();
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      // Ignore errors
    }
  }
}

export const cache = new Cache();
