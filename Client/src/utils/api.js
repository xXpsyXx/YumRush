const API_URL = import.meta.env.VITE_API_URL;

export const getRestaurants = async () => {
  const response = await fetch(`${API_URL}/api/restaurants`);
  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  return response.json();
};

export const warmupBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.warn('Backend warmup failed:', error);
    return false;
  }
};

export const preloadData = async () => {
  try {
    return await getRestaurants();
  } catch (error) {
    console.warn('Data preload failed:', error);
    return null;
  }
};
