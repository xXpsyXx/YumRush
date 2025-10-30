import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "null");
        if (!auth?.token) {
          setError("Please login to view your orders.");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/auth/orders", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <main className="max-w-2xl mx-auto py-10 px-4">Loading…</main>;

  if (error)
    return (
      <main className="max-w-2xl mx-auto py-10 px-4 text-red-600">{error}</main>
    );

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-gray-600">No orders yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">
                  Order #{o._id.slice(-6)}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                Status: {o.status}
              </div>
              <div className="flex flex-col gap-2">
                {o.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.title}
                          className="h-10 w-12 object-cover rounded"
                        />
                      ) : null}
                      <span>{it.title}</span>
                      <span className="text-gray-500">x{it.qty}</span>
                    </div>
                    <div className="font-medium">₹{it.price * it.qty}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-right font-semibold">
                Total: ₹{o.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Orders;
