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
  const [discussion, setDiscussion] = useState([]);
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("username") || "Guest";

  const loadDiscussion = async () => {
    try {
      const res = await fetch(`${API_URL}/api/discussions/${id}`);
      if (!res.ok) {
        setDiscussion([]);
        return;
      }

      const data = await res.json();
      setDiscussion(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadDiscussion error:", err);
      setDiscussion([]);
    }
  };

  const postMessage = async () => {
    try {
      if (!message.trim()) return;

      await fetch(`${API_URL}/api/discussions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: id,
          username,
          message: message.trim()
        })
      });

      setMessage("");
      loadDiscussion();
    } catch (err) {
      console.error("postMessage error:", err);
    }
  };

  useEffect(() => {
    loadProblem();
  }, [id]);

  useEffect(() => {
    if (problem) {
      loadDiscussion();
    }
  }, [problem]);

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
      <div className="text-white p-8 bg-[#1a1a1a] min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">Loading problem...</div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="text-white p-8 bg-[#1a1a1a] min-h-screen flex flex-col items-center justify-center gap-4">
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
    <div className="bg-[#1a1a1a] text-white min-h-screen">
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
          <div className="col-span-12 lg:col-span-5 rounded-xl border border-[#3e3e3e]/30 bg-[#282828] p-5 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${diffColor} bg-white/5`}>{problem.difficulty}</span>
            </div>

            <div className="mt-2 text-sm text-zinc-400">
              {problem.difficulty === "Easy"
                ? 2
                : problem.difficulty === "Medium"
                ? 3
                : 5} points
            </div>

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

          <div className="col-span-12 lg:col-span-7 rounded-xl border border-[#3e3e3e]/30 bg-[#282828] p-5 shadow-xl shadow-black/20">
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

            <div className="bg-[#282828] p-4 mt-4 rounded-xl">
              <h2 className="font-bold mb-3 text-zinc-300">💬 Discussion</h2>

              <div className="max-h-80 overflow-y-auto space-y-3">
                {discussion.length === 0 ? (
                  <div className="text-zinc-500 text-sm">
                    No discussions yet. Ask a question and start the conversation.
                  </div>
                ) : (
                  discussion.map((item) => (
                    <div key={item._id} className="rounded-2xl border border-zinc-800 bg-[#1f1f1f] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-green-400">{item.username}</span>
                        <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{item.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a doubt or share a hint..."
                  className="flex-1 bg-zinc-900 p-3 rounded text-sm resize-none"
                  rows={3}
                />
                <button
                  onClick={postMessage}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded self-end text-sm font-medium"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolver;

