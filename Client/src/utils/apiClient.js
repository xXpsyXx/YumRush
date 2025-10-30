// Base configuration
const API_URL = import.meta.env.VITE_API_URL;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced fetch with retry logic
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Warm up the backend
export const warmupBackend = async () => {
  try {
    const response = await fetchWithRetry(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.warn("Backend warmup failed:", error);
    return false;
  }
};

// Preload and cache data
export const preloadData = async () => {
  try {
    const response = await fetchWithRetry(`${API_URL}/api/restaurants`);
    const data = await response.json();

    // Store in localStorage cache with timestamp
    localStorage.setItem(
      "restaurantsCache",
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );

    return data;
  } catch (error) {
    console.warn("Data preload failed:", error);
    return null;
  }
};

// Get restaurants with cache support
export const getRestaurants = async () => {
  try {
    // Try to get cached data first
    const cached = localStorage.getItem("restaurantsCache");
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if it's less than 5 minutes old
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }

    // Fetch fresh data
    const response = await fetchWithRetry(`${API_URL}/api/restaurants`);
    const data = await response.json();

    // Update cache
    localStorage.setItem(
      "restaurantsCache",
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );

    return data;
  } catch (error) {
    // If fetch fails, try to use cached data regardless of age
    const cached = localStorage.getItem("restaurantsCache");
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }
    throw error;
  }
};
