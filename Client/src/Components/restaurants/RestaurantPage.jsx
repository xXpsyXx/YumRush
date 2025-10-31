import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import apiFetch, { asset } from "../../lib/api";

function RestaurantPage() {
  const location = useLocation();
  const { id } = useParams();

  const [menus, setMenus] = useState(null);
  const [restaurants, setRestaurants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [feedback, setFeedback] = useState({});
  const [removedFeedback, setRemovedFeedback] = useState({});
  const [cart, setCart] = useState(() => {
    const fromLS = localStorage.getItem("cart");
    return fromLS ? JSON.parse(fromLS) : [];
  });
  const [cartCount, setCartCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart"))?.length || 0;
    } catch {
      return 0;
    }
  });

  // Helpers: quantity lookup and mutators using the existing array-based cart
  const getItemQuantity = (itemId) => {
    try {
      return cart.filter((ci) => ci.id === itemId).length;
    } catch {
      return 0;
    }
  };

  const addOne = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartCount(newCart.length);
  };

  const removeOne = (itemId) => {
    const currentQuantity = getItemQuantity(itemId);
    const index = cart.findIndex((ci) => ci.id === itemId);
    if (index === -1) return;

    // If it's the last quantity (1), show "Removed" feedback in red
    if (currentQuantity === 1) {
      // Set feedback first to show "Removed"
      setRemovedFeedback((f) => ({ ...f, [itemId]: true }));
      // Remove the item immediately
      const newCart = [...cart.slice(0, index), ...cart.slice(index + 1)];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      setCartCount(newCart.length);
      // Clear the feedback after 1.1 seconds
      setTimeout(() => {
        setRemovedFeedback((f) => ({ ...f, [itemId]: false }));
      }, 1100);
    } else {
      // If quantity > 1, just remove normally
      const newCart = [...cart.slice(0, index), ...cart.slice(index + 1)];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      setCartCount(newCart.length);
    }
  };

  const totalPrice = useMemo(
    () => cart.reduce((sum, it) => sum + (Number(it.price) || 0), 0),
    [cart]
  );

  useEffect(() => {
    // SCROLL TO TOP after restaurant navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    // Always keep cartCount in sync with cart/localStorage/route
    function updateCount() {
      try {
        setCartCount(JSON.parse(localStorage.getItem("cart"))?.length || 0);
      } catch {
        setCartCount(0);
      }
    }
    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, [location.pathname]);

  // Fetch menu data from backend API with cache support
  useEffect(() => {
    // Check cache first for instant loading
    try {
      const cached = JSON.parse(
        localStorage.getItem("api_cache_/api/menus") || "null"
      );
      if (cached && cached.data) {
        setMenus(cached.data);
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (e) {
      setLoading(true);
    }

    setError(null);
    // Fetch both menus and restaurants in parallel
    Promise.all([
      apiFetch("/api/menus").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu data");
        return res.json();
      }),
      apiFetch("/api/restaurants").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        return res.json();
      }),
    ])
      .then(([menuData, restaurantData]) => {
        setMenus(menuData);
        setRestaurants(Array.isArray(restaurantData) ? restaurantData : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setFeedback((f) => ({ ...f, [item.id]: true }));
    setCartCount(newCart.length); // immediate update for sticky bar
    setTimeout(() => {
      setFeedback((f) => ({ ...f, [item.id]: false }));
    }, 1100);
  };

  // If loading or error
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-xl">
        Loading menus…
      </main>
    );
  }
  if (error || !menus) {
    return (
      <main className="min-h-screen flex items-center justify-center text-xl text-red-600">
        {error || "Failed to load menus"}
      </main>
    );
  }

  const restaurant =
    restaurants?.find((r) => r.id === Number(id)) || restaurants?.[0];
  const menuData = menus?.[id] || menus?.[1];
  const sampleMenu = menuData?.menu || [];

  if (!restaurant || !menuData) {
    return (
      <main className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Restaurant not found
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 min-h-screen flex flex-col pb-36">
      {/* Restaurant Info */}
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">{restaurant.title}</h1>
        <p className="text-gray-500 mt-1">{restaurant.info}</p>
      </div>
      {/* Menu List */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Menu</h2>
        <div className="flex flex-col gap-6">
          {sampleMenu.map((d) => (
            <div
              key={d.id}
              className="flex flex-row gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:items-center "
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{d.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">{d.description}</p>
                  <div className="flex items-center gap-3 text-sm mb-2">
                    <span className="text-emerald-600 font-medium">
                      ₹{d.price}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <span>★</span>
                      {d.rating}
                    </span>
                    {d.label && (
                      <span className="bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded text-xs ml-1">
                        {d.label}
                      </span>
                    )}
                  </div>
                </div>
                {removedFeedback[d.id] ? (
                  <button
                    className="mt-2 w-max px-5 py-1.5 rounded-md font-semibold text-sm text-red-500 bg-white border border-red-500 cursor-not-allowed"
                    disabled
                  >
                    Removed
                  </button>
                ) : getItemQuantity(d.id) > 0 ? (
                  <div className="mt-2 inline-flex items-center gap-3">
                    <div className="inline-flex items-center rounded-md border border-gray-200 overflow-hidden">
                      <button
                        className="px-3 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600"
                        onClick={() => removeOne(d.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-[2ch] text-center">
                        {getItemQuantity(d.id)}
                      </span>
                      <button
                        className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => addOne(d)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(d)}
                    className={`mt-2 w-max px-5 py-1.5 rounded-md font-semibold text-sm relative transition 
                    ${
                      feedback[d.id]
                        ? "bg-emerald-500/80 text-white cursor-not-allowed"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                    disabled={feedback[d.id]}
                  >
                    {feedback[d.id] ? (
                      <span className="flex items-center gap-1">Added</span>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                )}
              </div>
              <img
                src={asset(d.image)}
                alt={d.title}
                className="h-24 w-28 object-cover rounded-md shadow-sm ml-2"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Add to Cart Bar - Swiggy mobile style */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 border-t shadow p-3 flex items-center justify-between gap-4">
          <span className="font-medium text-gray-900 text-base flex items-center">
            <span className="h-5 w-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center mr-2">
              {cartCount}
            </span>
            ₹{totalPrice} • Item{cartCount > 1 ? "s" : ""}
          </span>
          <a
            href="/cart"
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-6 py-2 font-semibold text-base transition shrink-0"
          >
            View Cart
          </a>
        </div>
      )}
    </main>
  );
}

export default RestaurantPage;
