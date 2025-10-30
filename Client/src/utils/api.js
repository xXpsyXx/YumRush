const API_URL = import.meta.env.VITE_API_URL;

export const warmupBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.warn("Backend warmup failed:", error);
    return false;
  }
};

// Preload common data
export const preloadData = async () => {
  try {
    // Start fetching restaurants data early
    const restaurantsPromise = fetch(`${API_URL}/api/restaurants`).then((r) =>
      r.json()
    );

    // You can add more preloading here if needed

    // Wait for all preloads to complete
    const [restaurants] = await Promise.all([restaurantsPromise]);

    // Store in localStorage cache with timestamp
    localStorage.setItem(
      "restaurantsCache",
      JSON.stringify({
        data: restaurants,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Data preload failed:", error);
  }
};
