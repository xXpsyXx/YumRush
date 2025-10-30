import React, { useEffect, useState } from "react";
import apiFetch from "../../lib/api";
import { useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const a = JSON.parse(localStorage.getItem("auth") || "null");
      if (!a?.token) {
        navigate("/login");
        return;
      }
      setAuth(a);
      setName(a.user?.name || "");
      setEmail(a.user?.email || "");
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.token) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await apiFetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ name, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      const updated = { ...auth, user: data.user };
      localStorage.setItem("auth", JSON.stringify(updated));
      setAuth(updated);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Profile updated");
    } catch (e1) {
      setError(e1.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Account Settings
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 text-gray-600"
          />
        </div>
        <div className="pt-2">
          <div className="text-sm font-medium text-gray-900 mb-2">
            Change password (optional)
          </div>
          <div className="grid gap-3">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              minLength={6}
            />
          </div>
        </div>
        {message && <div className="text-emerald-600 text-sm">{message}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </main>
  );
}

export default Account;
