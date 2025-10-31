import React, { useEffect, useMemo, useState } from "react";
import apiFetch, { asset } from "../../lib/api";
import { Link, useSearchParams } from "react-router-dom";

function LandingPage() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  // Initialize with cached data if available for instant loading
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const cached = JSON.parse(
        localStorage.getItem("api_cache_/api/restaurants") || "null"
      );
      if (cached && cached.data) {
        return Array.isArray(cached.data) ? cached.data : [];
      }
    } catch (e) {
      // Ignore errors
    }
    return [];
  });
  const [loading, setLoading] = useState(restaurants.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only show loading if we don't have cached data
    if (restaurants.length === 0) {
      setLoading(true);
    }
    setError(null);
    apiFetch("/api/restaurants")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        return res.json();
      })
      .then((data) => {
        setRestaurants(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!q) return restaurants.slice(0, 6);
    const term = q.toLowerCase();
    const matches = restaurants.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        r.info.toLowerCase().includes(term) ||
        (Array.isArray(r.cuisine) &&
          r.cuisine.join(" ").toLowerCase().includes(term))
    );
    return matches.slice(0, 6);
  }, [restaurants, q]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Crave it. Tap it. Get it.
              </h1>
              <p className="mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
                Discover nearby restaurants and order your favorites with
                lightning-fast delivery.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#restaurants"
                  className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
                >
                  Browse restaurants
                </a>
                <a
                  href="#categories"
                  className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                >
                  Explore cuisines
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="mx-auto aspect-4/3 w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm hidden sm:block">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_45%)]" />
                <div className="relative z-10 flex h-full items-center justify-center p-6">
                  <div className="grid w-full grid-cols-3 gap-3">
                    <div className="rounded-xl bg-emerald-50 p-4 text-center">
                      <div className="text-2xl">🍕</div>
                      <div className="mt-2 text-sm font-medium text-gray-800">
                        Pizza
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4 text-center">
                      <div className="text-2xl">🍔</div>
                      <div className="mt-2 text-sm font-medium text-gray-800">
                        Burgers
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4 text-center">
                      <div className="text-2xl">🍣</div>
                      <div className="mt-2 text-sm font-medium text-gray-800">
                        Sushi
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4 text-center">
                      <div className="text-2xl">🥗</div>
                      <div className="mt-2 text-sm font-medium text-gray-800">
                        Healthy
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4 text-center">
                      <div className="text-2xl">🌮</div>
                      <div className="mt-2 text-sm font-medium text-gray-800">
                        Tacos
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4 text-center">
                      <div className="text-2xl">🍝</div>
                      <div className="mt-2 text-sm font-medium text-gray-800">
                        Pasta
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Popular categories
            </h2>
            <a
              href="#"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              See all
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {[
              { emoji: "🍕", label: "Pizza" },
              { emoji: "🍔", label: "Burgers" },
              { emoji: "🍣", label: "Sushi" },
              { emoji: "🥗", label: "Salads" },
              { emoji: "🌮", label: "Mexican" },
              { emoji: "🍜", label: "Asian" },
            ].map((c) => (
              <button
                key={c.label}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center transition hover:border-emerald-300 hover:shadow-sm"
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="mt-2 text-sm font-medium text-gray-800">
                  {c.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured restaurants */}
      <section id="restaurants" className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Featured restaurants
            </h2>
            <a
              href="#"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all
            </a>
          </div>

          {loading ? (
            <div className="text-gray-600">Loading restaurants…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <Link
                  key={r.id}
                  to={`/restaurants/${r.id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md outline-none focus:ring-2 focus:ring-emerald-400"
                  style={{ display: "block" }}
                >
                  <div className="aspect-video w-full bg-gray-100">
                    {r.image ? (
                      <img
                        src={asset(r.image)}
                        alt={r.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {r.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{r.info}</p>
                      </div>
                      <div className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        ★ {r.rating}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <div className="text-gray-600">No restaurants match "{q}"</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Ready to order?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-600">
            Sign in to see personalized recommendations and reorder your
            favorites in seconds.
          </p>
          <div className="mt-6">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
            >
              Get started
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
