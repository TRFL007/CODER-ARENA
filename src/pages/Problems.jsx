import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/problems`);

      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      setProblems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadProblems error:", err);
    } finally {
      setLoading(false);
    }
  };

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filtered =
    filter === "All"
      ? problems
      : problems.filter((p) => p.difficulty === filter);

  const diffColor = (d) =>
    d === "Easy"
      ? "text-green-400"
      : d === "Medium"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="p-8 text-white bg-[#0d1117] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Problems</h1>

        <div className="flex gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filter === d
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-zinc-400 text-center py-16">
          Loading problems...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-zinc-400 text-center py-16">
          No problems found.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((problem, index) => (
          <Link key={problem._id} to={`/problems/${problem._id}`}>
            <div className="bg-[#161b22] border border-zinc-800 p-4 rounded-lg hover:border-zinc-600 transition-colors flex items-center gap-4">
              <span className="text-zinc-500 w-8 text-sm">{index + 1}</span>

              <div className="flex-1">
                <div className="font-medium">{problem.title}</div>
              </div>

              <div className={`text-sm font-medium ${diffColor(problem.difficulty)}`}>
                {problem.difficulty}
              </div>

              <div className="text-zinc-500 text-sm">
                {problem.points ?? 100} pts
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Problems;
