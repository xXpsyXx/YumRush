import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { asset } from "../../lib/api";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [locating, setLocating] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [locationLabel, setLocationLabel] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("location"))?.label || "";
    } catch {
      return "";
    }
  });
  const [isAuthed, setIsAuthed] = useState(() => {
    try {
      return Boolean(JSON.parse(localStorage.getItem("auth"))?.token);
    } catch {
      return false;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      const q = searchTerm.trim();
      navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    function updateCartCount() {
      try {
        const c = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItemCount(c.length);
      } catch {
        setCartItemCount(0);
      }
    }
    function updateAuth() {
      try {
        setIsAuthed(Boolean(JSON.parse(localStorage.getItem("auth"))?.token));
      } catch {
        setIsAuthed(false);
      }
    }
    updateCartCount();
    updateAuth();
    const interval = setInterval(() => {
      updateCartCount();
      updateAuth();
    }, 500);
    if (location.pathname === "/checkout") setCartItemCount(0);
    setMenuOpen(false);
    window.addEventListener("storage", () => {
      updateCartCount();
      updateAuth();
    });
    return () => {
      window.removeEventListener("storage", () => {
        updateCartCount();
        updateAuth();
      });
      clearInterval(interval);
    };
  }, [location]);

  const handleSetLocation = () => {
    if (locating) return;
    if (!("geolocation" in navigator)) {
      setManualLocation(locationLabel || "");
      setShowLocationModal(true);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          let label = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
          try {
            // Use configured geocoder base URL if provided, otherwise default to
            // OpenStreetMap Nominatim reverse endpoint.
            const geocoderBase =
              (import.meta &&
                import.meta.env &&
                import.meta.env.VITE_GEOCODER_URL) ||
              "https://nominatim.openstreetmap.org/reverse?format=jsonv2";
            // Append lat/lon correctly whether the base already contains query params
            const separator = geocoderBase.includes("?") ? "&" : "?";
            const url = `${geocoderBase}${separator}lat=${latitude}&lon=${longitude}`;
            const res = await fetch(url, {
              headers: { Accept: "application/json" },
            });
            if (res.ok) {
              const json = await res.json();
              const city =
                json.address?.city ||
                json.address?.town ||
                json.address?.village ||
                json.address?.suburb;
              const state = json.address?.state;
              if (city || state)
                label = [city, state].filter(Boolean).join(", ");
            }
          } catch (e) {
            // ignore geocoding errors silently
          }
          const data = { lat: latitude, lon: longitude, label };
          localStorage.setItem("location", JSON.stringify(data));
          setLocationLabel(label);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setManualLocation(locationLabel || "");
        setShowLocationModal(true);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  };

  const applyManualLocation = () => {
    const value = manualLocation.trim();
    if (!value) {
      setShowLocationModal(false);
      return;
    }
    const data = { label: value };
    localStorage.setItem("location", JSON.stringify(data));
    setLocationLabel(data.label);
    setShowLocationModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuthed(false);
    navigate("/");
  };

  useEffect(() => {
    function onClickAway(e) {
      if (!menuOpen) return;
      const target = e.target;
      if (target && target.closest && target.closest("#profile-menu")) return;
      setMenuOpen(false);
    }
    document.addEventListener("click", onClickAway);
    return () => document.removeEventListener("click", onClickAway);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 sm:hidden"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              </svg>
            </button>

            <a href="/" className="group inline-flex items-center gap-2">
              <img
                src={asset("/images/YumRush.webp")}
                alt="YumRush"
                className="h-9 w-9 object-contain"
                loading="eager"
                decoding="async"
              />
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                YumRush
              </span>
            </a>
          </div>

          {/* Center: Search + Location (hidden on xs) */}
          <div className="hidden flex-1 items-center justify-center gap-3 sm:flex">
            <div className="relative w-full max-w-xl">
              <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M15.75 10.5a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKey}
                placeholder="Search for restaurants"
                className="w-full rounded-md border border-gray-200 bg:white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none ring-0 transition focus:border-emerald-500"
              />
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={handleSetLocation}
              aria-busy={locating ? "true" : undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-emerald-500"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <span>
                {locating ? "Locating..." : locationLabel || "Set location"}
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h9.75m-9.75 0L6 6.75m1.5 7.5 9.162-.001c.51 0 .955-.343 1.087-.835l1.2-4.5a1.125 1.125 0 0 0-1.087-1.415H6.486m0 0L5.106 3.835A1.125 1.125 0 0 0 4.02 3H2.25"
                />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-orange-500 text-xs font-bold text-white shadow z-10">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthed ? (
              <div className="relative" id="profile-menu">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen ? "true" : "false"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75Z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Profile</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-gray-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.72 8.72a.75.75 0 0 1 1.06 0L12 12.94l4.22-4.22a.75.75 0 1 1 1.06 1.06l-4.75 4.75a.75.75 0 0 1-1.06 0L6.72 9.78a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-md z-50">
                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Order History
                    </Link>
                    <Link
                      to="/account"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75Z"
                  />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search and quick actions */}
        <div className="space-y-2 px-4 pb-3 sm:hidden">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M15.75 10.5a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Search restaurants"
              className="w-full rounded-md border border-gray-200 bg:white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none ring-0 transition focus:border-emerald-500"
            />
          </div>

          {isMobileMenuOpen && (
            <nav className="grid grid-cols-2 gap-2">
              <button className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Home
              </button>
              <button className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Offers
              </button>
              <Link
                to={isAuthed ? "/orders" : "/login"}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-center"
              >
                Orders
              </Link>
              <button className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Help
              </button>
            </nav>
          )}
        </div>
      </header>

      {showLocationModal && (
        <div className="fixed inset-0 z-1000 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="mb-3 text-base font-semibold text-gray-900">
              Enter your location
            </div>
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="City, area, or landmark"
              className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowLocationModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                onClick={applyManualLocation}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
