import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [rRes, mRes] = await Promise.all([
          fetch("/api/restaurants"),
          fetch("/api/menus"),
        ]);
        if (!rRes.ok || !mRes.ok) throw new Error("Failed to fetch data");
        const [rData, mData] = await Promise.all([rRes.json(), mRes.json()]);
        if (!cancelled) {
          setRestaurants(Array.isArray(rData) ? rData : []);
          setMenus(mData || {});
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!q) return restaurants;
    const term = q.toLowerCase();
    const matchesRestaurant = (r) =>
      r.title.toLowerCase().includes(term) ||
      r.info.toLowerCase().includes(term) ||
      (Array.isArray(r.cuisine) &&
        r.cuisine.join(" ").toLowerCase().includes(term));
    const matchesMenu = (r) => {
      const m = menus[r.id];
      if (!m || !Array.isArray(m.menu)) return false;
      return m.menu.some(
        (d) =>
          (d.title && d.title.toLowerCase().includes(term)) ||
          (d.description && d.description.toLowerCase().includes(term))
      );
    };
    return restaurants.filter((r) => matchesRestaurant(r) || matchesMenu(r));
  }, [restaurants, menus, q]);

  const matchedDishes = (r) => {
    const term = q.toLowerCase();
    const m = menus[r.id];
    if (!m || !Array.isArray(m.menu)) return [];
    return m.menu
      .filter(
        (d) =>
          (d.title && d.title.toLowerCase().includes(term)) ||
          (d.description && d.description.toLowerCase().includes(term))
      )
      .slice(0, 3)
      .map((d) => d.title);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Search results</h1>
      {q && (
        <p className="text-gray-600 mb-6">
          Showing matches for:{" "}
          <span className="font-medium text-gray-800">{q}</span>
        </p>
      )}

      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-gray-600">No restaurants found for "{q}"</div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((r) => {
            const dishes = q ? matchedDishes(r) : [];
            return (
              <Link
                key={r.id}
                to={`/restaurants/${r.id}`}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow transition"
              >
                <div className="h-24 w-32 bg-gray-100 rounded overflow-hidden">
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={r.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {r.title}
                      </h2>
                      <p className="text-sm text-gray-500">{r.info}</p>
                      {Array.isArray(r.cuisine) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {r.cuisine.join(" • ")}
                        </p>
                      )}
                    </div>
                    <div className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      ★ {r.rating}
                    </div>
                  </div>
                  {dishes.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      Matches: {dishes.join(", ")}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default SearchResults;
