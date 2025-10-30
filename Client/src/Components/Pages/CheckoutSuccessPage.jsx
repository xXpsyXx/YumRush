import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function CheckoutSuccessPage() {
  useEffect(() => {
    // Attempt to persist the order to backend if user is authed
    (async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "null");
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        // Prevent duplicate submissions (e.g., React StrictMode dev double-effects)
        if (sessionStorage.getItem("order_submitted") === "1") {
          return;
        }
        if (auth?.token && Array.isArray(cart) && cart.length) {
          sessionStorage.setItem("order_submitted", "1");
          // group items by id with qty
          const map = new Map();
          for (const it of cart) {
            const cur = map.get(it.id);
            if (cur) cur.qty += 1;
            else
              map.set(it.id, {
                itemId: String(it.id),
                title: it.title,
                image: it.image,
                price: Number(it.price) || 0,
                qty: 1,
              });
          }
          const items = Array.from(map.values());
          const total = items.reduce((s, x) => s + x.price * x.qty, 0);
          await fetch("/api/auth/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ items, total }),
          });
        }
      } catch {}
      localStorage.removeItem("cart");
    })();
  }, []);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6">
        <span className="inline-block p-4 rounded-full bg-emerald-100">
          <svg
            width="60"
            height="60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-emerald-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Order placed successfully!
      </h1>
      <p className="mb-6 text-gray-600">
        Thanks for ordering from us. Your food is on its way!
      </p>
      <Link
        to="/"
        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-md px-6 py-2 font-medium transition"
      >
        Back to Home
      </Link>
    </main>
  );
}

export default CheckoutSuccessPage;
