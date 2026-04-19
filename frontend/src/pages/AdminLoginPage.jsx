import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate("/admin");
    } catch (submitError) {
      setError(submitError.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#302313_0%,#09090b_40%)] px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-black/40 p-8 shadow-halo backdrop-blur"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-bronze">Admin access</p>
        <h1 className="mt-4 font-display text-5xl text-white">Sholoana</h1>
        <p className="mt-4 text-sm leading-7 text-stone-400">
          Sign in to manage categories, slider images, gallery uploads, and content.
        </p>
        <div className="mt-8 space-y-4">
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-bronze"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Password"
            className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-bronze"
          />
        </div>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-bronze px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Enter dashboard"}
        </button>
      </form>
    </main>
  );
}
