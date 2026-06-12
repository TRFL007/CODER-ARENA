import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

export default function AdminContests() {
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [contestTitle, setContestTitle] = useState("Weekly Contest");
  const [duration, setDuration] = useState(60);
  const [creatingContest, setCreatingContest] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/problems`);
      const data = await res.json();
      setAllProblems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadProblems error:", err);
    }
  };

  const toggleProblem = (id, checked) => {
    if (checked) {
      setSelectedProblems((prev) => [...prev, id]);
    } else {
      setSelectedProblems((prev) => prev.filter((p) => p !== id));
    }
  };

  const createContest = async () => {
    if (selectedProblems.length === 0) {
      setStatusMsg("❌ Select at least one problem for the contest");
      return;
    }

    try {
      setCreatingContest(true);
      setStatusMsg("");

      const res = await fetch(`${API_URL}/api/contests/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: contestTitle || "Weekly Contest",
          description: "Coder Arena Contest",
          startTime: new Date(),
          endTime: new Date(Date.now() + duration * 60 * 1000),
          problems: selectedProblems
        })
      });

      if (!res.ok) {
        setStatusMsg("❌ Failed to create contest");
        return;
      }

      setStatusMsg("✅ Contest Created Successfully");
      setSelectedProblems([]);
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Error creating contest");
    } finally {
      setCreatingContest(false);
    }
  };

  const filteredProblems = allProblems.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const diffColor = (d) =>
    d === "Easy" ? "text-green-400" : d === "Medium" ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition">← Back to Admin</Link>
          <h1 className="mt-2 text-3xl font-semibold">Create Contest</h1>
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-lg text-sm font-medium ${statusMsg.startsWith("✅") ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"}`}>
            {statusMsg}
          </div>
        )}

        {/* Contest Form */}
        <div className="rounded-2xl border border-[#3e3e3e]/30 bg-[#282828] p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-zinc-400 text-xs mb-1 block">Contest Title</label>
              <input
                value={contestTitle}
                onChange={(e) => setContestTitle(e.target.value)}
                placeholder="Contest Title"
                className="w-full bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs mb-1 block">Duration (minutes)</label>
              <input
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                type="number"
                min="5"
                className="w-full bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>
          </div>

          {/* Problem Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-zinc-400 text-xs">
                Select Problems ({selectedProblems.length} selected)
              </label>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problems..."
                className="bg-[#1a1a1a] border border-[#3e3e3e]/30 px-3 py-1.5 rounded-lg text-xs w-48 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2">
              {filteredProblems.length === 0 && (
                <div className="text-zinc-500 text-sm py-4 text-center">No problems found. Create or seed problems first.</div>
              )}
              {filteredProblems.map((p) => (
                <label
                  key={p._id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                    selectedProblems.includes(p._id)
                      ? "bg-emerald-600/10 border border-emerald-500/30"
                      : "bg-[#1a1a1a] border border-[#3e3e3e]/20 hover:border-[#3e3e3e]/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProblems.includes(p._id)}
                    onChange={(e) => toggleProblem(p._id, e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 shrink-0"
                  />
                  <span className="text-sm flex-1 truncate">{p.title}</span>
                  <span className={`text-xs font-medium shrink-0 ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                  <span className="text-xs text-zinc-500 shrink-0">{p.points} pts</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={createContest}
            disabled={creatingContest}
            className="w-full rounded-lg bg-emerald-600 p-3 font-medium text-white transition hover:bg-emerald-500 disabled:bg-zinc-700"
          >
            {creatingContest ? "Creating..." : "Create Contest"}
          </button>
        </div>
      </div>
    </div>
  );
}
