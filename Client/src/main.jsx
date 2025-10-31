import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Components/Layout/Layout.jsx";
import LandingPage from "./Components/Pages/LandingPage.jsx";
import RestaurantPage from "./Components/restaurants/RestaurantPage";
import CartPage from "./Components/Pages/CartPage";
import CheckoutSuccessPage from "./Components/Pages/CheckoutSuccessPage";
import SearchResults from "./Components/Pages/SearchResults.jsx";
import Login from "./Components/Pages/Login.jsx";
import Signup from "./Components/Pages/Signup.jsx";
import Orders from "./Components/Pages/Orders.jsx";
import Account from "./Components/Pages/Account.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<LandingPage />} />
      <Route path="restaurants/:id" element={<RestaurantPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutSuccessPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/account" element={<Account />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
