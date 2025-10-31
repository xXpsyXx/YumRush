import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiFetch, { API_BASE } from "../../lib/api";

function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (!auth?.token) {
      // Redirect to login if not authenticated, then redirect to cart page
      navigate("/login?redirect=/cart");
      return;
    }
    setIsAuthenticated(true);

    // Attempt to persist the order to backend if user is authed
    (async () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        // Prevent duplicate submissions (e.g., React StrictMode dev double-effects)
        const orderSubmitted = sessionStorage.getItem("order_submitted");
        if (orderSubmitted === "1") {
          // Already submitted, just ensure cart is cleared if it exists
          if (cart.length > 0) {
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("storage"));
          }
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

          // Submit order and only clear cart if successful
          console.log("Submitting order:", {
            items,
            total,
            itemsCount: items.length,
          });

          // Use regular fetch for POST requests to avoid cache issues
          const url = API_BASE
            ? `${API_BASE}/api/auth/orders`
            : "/api/auth/orders";
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ items, total }),
          });

          console.log("Order submission response:", {
            ok: res.ok,
            status: res.status,
            statusText: res.statusText,
          });

          if (res.ok) {
            const orderData = await res.json().catch(() => null);
            console.log("Order created successfully:", orderData);

            // Order successful - clear cart and trigger update
            localStorage.removeItem("cart");

            // Invalidate orders cache so Orders page shows new order
            try {
              const { cache } = await import("../../lib/cache.js");
              const ordersUrl = API_BASE
                ? `${API_BASE}/api/auth/orders`
                : "/api/auth/orders";
              cache.clearUrl(ordersUrl);
            } catch (e) {
              // Ignore cache invalidation errors
            }

            // Dispatch storage event to update header cart count
            window.dispatchEvent(new Event("storage"));
            // Clear submission flag after delay
            setTimeout(() => {
              sessionStorage.removeItem("order_submitted");
            }, 2000);
          } else {
            // Order failed - allow retry
            sessionStorage.removeItem("order_submitted");
            let errorData;
            try {
              errorData = await res.json();
            } catch (e) {
              errorData = {
                message: `Failed to place order (${res.status} ${res.statusText})`,
              };
            }
            console.error("Order submission failed:", {
              status: res.status,
              statusText: res.statusText,
              error: errorData,
            });
            // Show error to user (you might want to add a state for this)
            alert(
              `Failed to place order: ${errorData.message || "Unknown error"}`
            );
          }
        }
      } catch (err) {
        // Error occurred - allow retry
        sessionStorage.removeItem("order_submitted");
        console.error("Error submitting order:", err);
      }
    })();
  }, [navigate]);

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

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
