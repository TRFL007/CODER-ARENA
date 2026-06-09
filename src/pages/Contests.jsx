import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contests`);

      if (!response.ok) {
        throw new Error("Failed to fetch contests");
      }

      const data = await response.json();
      setContests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadContests error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🏆 Available Contests</h1>

      {loading && (
        <div className="text-zinc-400 text-center py-12">
          Loading contests...
        </div>
      )}

      {!loading && contests.length === 0 && (
        <div className="text-zinc-400 text-center py-12">
          No contests available yet.
        </div>
      )}

      <div className="grid gap-5 max-w-3xl">
        {contests.map((c) => {
          const now = new Date();
          const start = new Date(c.startTime);
          const end = new Date(c.endTime);
          const isLive = now >= start && now <= end;
          const isEnded = now > end;

          return (
            <div
              key={c._id}
              className="bg-[#161b22] border border-zinc-800 p-5 rounded-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{c.title}</h2>
                  <p className="text-zinc-400 text-sm mt-1">{c.description}</p>

                  <div className="text-xs text-zinc-500 mt-2 space-y-1">
                    <div>Start: {formatDate(c.startTime)}</div>
                    <div>End: {formatDate(c.endTime)}</div>
                    <div>Problems: {c.problems?.length ?? 0}</div>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    isLive
                      ? "bg-green-800 text-green-300"
                      : isEnded
                      ? "bg-zinc-700 text-zinc-400"
                      : "bg-yellow-900 text-yellow-300"
                  }`}
                >
                  {isLive ? "🟢 Live" : isEnded ? "Ended" : "⏳ Upcoming"}
                </span>
              </div>

              <button
                onClick={() => navigate(`/contest/${c._id}`)}
                disabled={isEnded}
                className="bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed px-4 py-2 rounded mt-4 text-sm font-medium"
              >
                {isEnded ? "View Results" : "Join Contest"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Contests;
