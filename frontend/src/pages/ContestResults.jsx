import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const ContestResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [contestRes, leaderboardRes] = await Promise.all([
          fetch(`${API_URL}/api/contests/${id}`),
          fetch(`${API_URL}/api/leaderboard/${id}`),
        ]);

        if (!contestRes.ok) {
          throw new Error("Contest not found");
        }

        const contestData = await contestRes.json();
        const leaderboardData = leaderboardRes.ok ? await leaderboardRes.json() : [];

        setContest(contestData);
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
      } catch (err) {
        console.error("loadContestResults error:", err);
        setError(err.message || "Failed to load contest results");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/contests")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#282828] px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
        >
          ← Back to Contests
        </button>

        {loading ? (
          <div className="rounded-3xl border border-[#3e3e3e]/40 bg-[#282828] p-8 text-center text-slate-300">
            Loading contest results...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-600/40 bg-[#2b121e] p-8 text-center text-red-300">
            {error}
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-[#3e3e3e]/40 bg-[#282828] p-8 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">{contest.title}</h1>
                  <p className="mt-2 text-slate-400">{contest.description}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#1f1f1f] px-4 py-3 text-sm text-slate-300">
                    <strong className="block text-white">Start</strong>
                    {formatDate(contest.startTime)}
                  </div>
                  <div className="rounded-3xl bg-[#1f1f1f] px-4 py-3 text-sm text-slate-300">
                    <strong className="block text-white">End</strong>
                    {formatDate(contest.endTime)}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-[#1f1f1f] p-4 text-sm text-slate-300">
                  <strong className="block text-white">Problems</strong>
                  {contest.problems?.length ?? 0}
                </div>
                <div className="rounded-3xl bg-[#1f1f1f] p-4 text-sm text-slate-300">
                  <strong className="block text-white">Duration</strong>
                  {contest.duration ? `${contest.duration} min` : "—"}
                </div>
                <div className="rounded-3xl bg-[#1f1f1f] p-4 text-sm text-slate-300">
                  <strong className="block text-white">Status</strong>
                  {new Date() > new Date(contest.endTime) ? "Ended" : "Live / Upcoming"}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-[#3e3e3e]/40 bg-[#282828] p-6 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-white">Leaderboard</h2>
                <span className="text-sm text-slate-400">Top performers for this contest</span>
              </div>

              {leaderboard.length === 0 ? (
                <div className="mt-8 text-center text-slate-400">
                  No scores submitted yet.
                </div>
              ) : (
                <div className="mt-6 overflow-hidden rounded-3xl border border-[#3e3e3e]/30 bg-[#1f1f1f]">
                  <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-6 py-4 text-xs uppercase tracking-[0.16em] text-slate-500">
                    <span>Rank</span>
                    <span>Player</span>
                    <span>Score</span>
                    <span>Penalty</span>
                  </div>
                  <div className="divide-y divide-[#2e2e2e]">
                    {leaderboard.map((player, index) => (
                      <div key={player._id ?? index} className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-6 py-4 text-sm text-slate-200">
                        <span className="font-semibold text-blue-300">{index + 1}</span>
                        <span>{player.username}</span>
                        <span className="font-semibold text-white">{player.score}</span>
                        <span>{player.penalty ?? 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContestResults;
