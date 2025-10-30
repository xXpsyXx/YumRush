import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { warmupBackend, preloadData } from "./utils/api.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorBoundary from "./Components/ErrorBoundary";
import { RestaurantListSkeleton } from "./Components/UI/RestaurantCardSkeleton";
import { RestaurantDetailsSkeleton } from "./Components/UI/RestaurantDetailsSkeleton";

// Lazy load components
const Layout = lazy(() => import("./Components/Layout/Layout.jsx"));
const LandingPage = lazy(() => import("./Components/Pages/LandingPage.jsx"));
const RestaurantPage = lazy(() =>
  import("./Components/restaurants/RestaurantPage")
);
const CartPage = lazy(() => import("./Components/Pages/CartPage"));
const CheckoutSuccessPage = lazy(() =>
  import("./Components/Pages/CheckoutSuccessPage")
);
const SearchResults = lazy(() =>
  import("./Components/Pages/SearchResults.jsx")
);
const Login = lazy(() => import("./Components/Pages/Login.jsx"));
const Signup = lazy(() => import("./Components/Pages/Signup.jsx"));
const Orders = lazy(() => import("./Components/Pages/Orders.jsx"));
const Account = lazy(() => import("./Components/Pages/Account.jsx"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <ErrorBoundary>
          <Suspense
            fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}
          >
            <Layout />
          </Suspense>
        </ErrorBoundary>
      }
    >
      <Route
        path=""
        element={
          <Suspense fallback={<RestaurantListSkeleton />}>
            <LandingPage />
          </Suspense>
        }
      />
      <Route
        path="restaurants/:id"
        element={
          <Suspense fallback={<RestaurantDetailsSkeleton />}>
            <RestaurantPage />
          </Suspense>
        }
      />
      <Route
        path="/cart"
        element={
          <Suspense
            fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}
          >
            <CartPage />
          </Suspense>
        }
      />
      <Route
        path="/checkout"
        element={
          <Suspense
            fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}
          >
            <CheckoutSuccessPage />
          </Suspense>
        }
      />
      <Route
        path="/search"
        element={
          <Suspense fallback={<RestaurantListSkeleton />}>
            <SearchResults />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense
            fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}
          >
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense
            fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}
          >
            <Signup />
          </Suspense>
        }
      />
      <Route
        path="/orders"
        element={
          <Suspense
            fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}
          >
            <Orders />
          </Suspense>
        }
      />
      <Route
        path="/account"
        element={
          <Suspense
            fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}
          >
            <Account />
          </Suspense>
        }
      />
    </Route>
  )
);

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful");
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed:", error);
      });
  });
}

// Initialize the app
async function initializeApp() {
  try {
    // First warm up the backend
    await warmupBackend();

    // Then start preloading data
    await preloadData();
  } catch (error) {
    console.warn("Initialization error:", error);
  }
}

// Start initialization immediately
initializeApp();

// Add performance monitoring
const reportWebVitals = ({ id, name, value }) => {
  // You can send to your analytics service here
  console.log("Web Vital:", { id, name, value });
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
);
