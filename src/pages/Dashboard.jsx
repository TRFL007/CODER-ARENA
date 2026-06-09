import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [problemCount, setProblemCount] = useState(0);
  const [contestCount, setContestCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const guest = !token;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function loadStats() {
      try {
        const [problemRes, contestRes] = await Promise.all([
          fetch(`${API_URL}/api/problems`),
          fetch(`${API_URL}/api/contests`),
        ]);

        const problems = problemRes.ok ? await problemRes.json() : [];
        const contests = contestRes.ok ? await contestRes.json() : [];
        setProblemCount(Array.isArray(problems) ? problems.length : 0);
        setContestCount(Array.isArray(contests) ? contests.length : 0);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-800 bg-[#161b22]/95 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold">
                {guest ? "Guest Preview" : `Welcome back, ${user.name || "Developer"}`}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {!guest ? (
                <button onClick={logout} className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                  Login to unlock features
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Challenges available</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? "..." : problemCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Contests live</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? "..." : contestCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Progress</p>
              <p className="mt-3 text-3xl font-semibold text-white">{guest ? `Preview` : `Tracking active`}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Problems", path: "/problems", description: "Explore coding challenges." },
            { label: "Contests", path: "/contests", description: "Join timed competitions." },
            { label: "Multiplayer", path: "/multiplayer", description: "Compete in real-time battles." },
            { label: "Interview", path: "/interview", description: "Use AI to practice interviews." },
            { label: "Profile", path: "/setup", description: guest ? "Create your profile." : "Manage your account." },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="rounded-3xl border border-slate-800 bg-[#161b22] p-6 text-white transition hover:-translate-y-1 hover:border-blue-500/50"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              <p className="mt-3 text-lg font-semibold">{item.description}</p>
            </Link>
          ))}
        </div>

        {guest && (
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 text-amber-100">
            <h2 className="text-xl font-semibold">Guest Access</h2>
            <p className="mt-2 text-sm leading-6 text-amber-200">
              You can browse problems, contests, discussions, and leaderboards. Login to compile, submit, join multiplayer games, and track your progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
