import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../../lib/api";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Use regular fetch for POST requests to avoid cache issues
      const url = API_BASE ? `${API_BASE}/api/auth/login` : "/api/auth/login";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        // If response isn't JSON, use status text
        throw new Error(res.statusText || "Login failed");
      }

      if (!res.ok) {
        // Use the error message from the server
        console.log("Login failed:", {
          status: res.status,
          statusText: res.statusText,
          serverMessage: data.message,
        });
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("auth", JSON.stringify(data));
      // Redirect to the original destination or home
      const redirectTo = searchParams.get("redirect") || "/";
      navigate(redirectTo);
    } catch (err) {
      // Display the error message from the server
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-emerald-600">
          Create one
        </Link>
      </p>
    </main>
  );
}

export default Login;
