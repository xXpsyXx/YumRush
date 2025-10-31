import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CartPage() {
  // Read cart from localStorage into state
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "null");
        setIsAuthenticated(Boolean(auth?.token));
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
    // Listen for auth changes
    const interval = setInterval(checkAuth, 500);
    window.addEventListener("storage", checkAuth);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const totalPrice = useMemo(
    () => cart.reduce((sum, it) => sum + (Number(it.price) || 0), 0),
    [cart]
  );

  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of cart) {
      const key = it.id;
      const cur = map.get(key);
      if (cur) {
        cur.qty += 1;
      } else {
        map.set(key, { item: it, qty: 1 });
      }
    }
    return Array.from(map.values());
  }, [cart]);

  const addOne = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeOne = (itemId) => {
    const index = cart.findIndex((ci) => ci.id === itemId);
    if (index === -1) return;
    const newCart = [...cart.slice(0, index), ...cart.slice(index + 1)];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  if (!cart.length) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Your cart is empty.
        </h1>
        <p className="text-gray-600 mb-6">Start adding delicious food!</p>
        <Link
          to="/"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white rounded-md px-6 py-2 font-medium transition"
        >
          Browse Restaurants
        </Link>
      </main>
    );
  }
  // Render cart items
  return (
    <main className="max-w-lg mx-auto py-10 px-4 min-h-[70vh] flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Your Cart</h1>
      <div className="flex flex-col gap-5 mb-8">
        {grouped.map(({ item, qty }) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 shadow border"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-20 w-20 object-cover rounded-md"
              loading="lazy"
              decoding="async"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{item.title}</div>
              <div className="text-gray-500 text-sm">₹{item.price} each</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-md border border-gray-200 overflow-hidden">
                <button
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600"
                  onClick={() => removeOne(item.id)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-[2ch] text-center">
                  {qty}
                </span>
                <button
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => addOne(item)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="w-20 text-right font-semibold text-gray-900">
                ₹{qty * (Number(item.price) || 0)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto bg-white border rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between text-gray-700 mb-2">
          <span>Items total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>
      {isAuthenticated ? (
        <Link
          to="/checkout"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 font-semibold text-lg rounded-md transition block text-center"
        >
          Pay ₹{totalPrice}
        </Link>
      ) : (
        <div className="space-y-3">
          <div className="w-full bg-gray-400 text-white px-6 py-3 font-semibold text-lg rounded-md text-center cursor-not-allowed">
            Pay ₹{totalPrice}
          </div>
          <p className="text-center text-sm text-red-600 mb-2">
            Please login to proceed with checkout
          </p>
          <Link
            to="/login?redirect=/cart"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 font-semibold text-lg rounded-md transition block text-center"
          >
            Login to Checkout
          </Link>
        </div>
      )}
      <Link
        to="/"
        className="block mt-4 bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-md px-6 py-2 font-medium text-center transition"
      >
        Continue Shopping
      </Link>
    </main>
  );
}

export default CartPage;
