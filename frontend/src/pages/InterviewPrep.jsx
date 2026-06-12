import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchInterviewQuestions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/problems/interview`);
        const data = await res.json();
        setProblems(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching interview questions:", err);
        setLoading(false);
      }
    };

    fetchInterviewQuestions();
  }, []);

  const filtered = problems.filter(
    (p) => filter === "All" || p.difficulty === filter
  );

  const stats = {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
    Total: problems.length
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-[#00af9b] to-[#006d32] p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-white mb-2">Top 150 Interview Questions</h1>
          <p className="text-[#e0e0e0] text-lg">Master the most asked coding interview problems</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total", value: stats.Total, color: "from-blue-500 to-blue-600" },
            { label: "Easy", value: stats.Easy, color: "from-green-500 to-green-600" },
            { label: "Medium", value: stats.Medium, color: "from-yellow-500 to-yellow-600" },
            { label: "Hard", value: stats.Hard, color: "from-red-500 to-red-600" }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-lg bg-gradient-to-br ${stat.color} p-6 shadow-md`}>
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">{stat.label}</p>
              <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 flex-wrap">
          {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setFilter(difficulty)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === difficulty
                  ? "bg-[#00af9b] text-white shadow-lg"
                  : "bg-[#282828] text-[#8a8a8a] border border-[#3e3e3e] hover:border-[#00af9b]"
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>

        {/* Problems List */}
        <div className="space-y-2">
          {loading ? (
            <div className="rounded-xl bg-[#282828] p-8 text-center text-[#8a8a8a]">
              Loading interview questions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl bg-[#282828] p-8 text-center text-[#8a8a8a]">
              No problems found
            </div>
          ) : (
            filtered.map((problem, idx) => (
              <div
                key={problem._id}
                onClick={() => navigate(`/problem/${problem._id}`)}
                className="group cursor-pointer rounded-lg bg-[#282828] p-4 border border-[#3e3e3e]/30 hover:border-[#00af9b] transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-[#8a8a8a] font-semibold text-sm w-8 text-right">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold group-hover:text-[#00af9b] transition">
                      {problem.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      problem.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-400"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {problem.difficulty}
                  </div>
                  <div className="text-[#ffb800] font-semibold text-sm">
                    {problem.points} pts
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
