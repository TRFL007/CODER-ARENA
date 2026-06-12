import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-xl w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-white text-center">Register</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input
          className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-400"
          type="text" placeholder="Name"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
        />
        <input
          className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-400"
          type="email" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
        />
        <input
          className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-400"
          type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
        />
        <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold">
          Register
        </button>
        <p className="text-gray-400 text-center text-sm">
          Have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

