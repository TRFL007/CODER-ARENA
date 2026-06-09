import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SharedCodeEditor from "../components/SharedCodeEditor";
import AuthModal from "../components/AuthModal";
import { API_URL } from "../config/api";

const ProblemSolver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const guest = !token;

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/problems/${id}`);

      if (!res.ok) {
        setError("Problem not found");
        return;
      }

      const data = await res.json();
      setProblem(data);
    } catch (err) {
      console.error("loadProblem error:", err);
      setError("Failed to load problem");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthRequest = () => {
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="text-white p-8 bg-[#0d1117] min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">Loading problem...</div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="text-white p-8 bg-[#0d1117] min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-400">{error || "Problem not found"}</div>
        <button
          onClick={() => navigate("/problems")}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Back to Problems
        </button>
      </div>
    );
  }

  const diffColor =
    problem.difficulty === "Easy"
      ? "text-green-400"
      : problem.difficulty === "Medium"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="bg-[#0d1117] text-white min-h-screen">
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <div className="max-w-7xl mx-auto p-6">
        {/* BACK */}
        <button
          onClick={() => navigate("/problems")}
          className="text-zinc-400 hover:text-white mb-4 text-sm flex items-center gap-1"
        >
          ← Problems
        </button>

        {guest && (
          <div className="mb-6 rounded-3xl border border-amber-600/20 bg-amber-600/10 p-4 text-amber-100">
            You are viewing the problem as a guest. You can read and edit code, but you need to login to compile or submit.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* PROBLEM STATEMENT */}
          <div className="col-span-12 lg:col-span-5 rounded-xl border border-slate-800 bg-[#161b22] p-5 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${diffColor} bg-white/5`}>{problem.difficulty}</span>
            </div>

            <div className="mt-2 text-sm text-zinc-400">{problem.points ?? 100} points</div>

            <div className="mt-5 whitespace-pre-wrap text-zinc-200 text-sm leading-relaxed">
              {problem.statement}
            </div>

            {problem.sampleInput && (
              <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="font-semibold text-slate-200">Sample Input</h3>
                <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{problem.sampleInput}</pre>
              </div>
            )}

            {problem.sampleOutput && (
              <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="font-semibold text-slate-200">Sample Output</h3>
                <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{problem.sampleOutput}</pre>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-7 rounded-xl border border-slate-800 bg-[#161b22] p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Code Workspace</p>
                <p className="mt-1 text-sm text-slate-500">Choose language and submit your solution.</p>
              </div>
            </div>

            <SharedCodeEditor
              problemId={problem._id}
              guest={guest}
              onAuthRequest={handleAuthRequest}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolver;
