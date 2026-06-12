import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

export default function AdminProblems() {
  const [form, setForm] = useState({
    title: "",
    difficulty: "Easy",
    statement: "",
    sampleInput: "",
    sampleOutput: "",
    points: 2,
    testCases: ""
  });

  const [allProblems, setAllProblems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
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

  const getPointsByDifficulty = (difficulty) => {
    if (difficulty === "Easy") return 2;
    if (difficulty === "Medium") return 3;
    if (difficulty === "Hard") return 5;
    return 2;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "difficulty") {
      setForm({ ...form, difficulty: value, points: getPointsByDifficulty(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const createOrUpdateProblem = async () => {
    try {
      setCreating(true);
      setStatusMsg("");

      let testCases;
      try {
        testCases = JSON.parse(form.testCases);
      } catch {
        setStatusMsg("❌ Test cases JSON is invalid.");
        return;
      }

      const formatted = { ...form, testCases, points: Number(form.points) };

      const url = editingId
        ? `${API_URL}/api/problems/${editingId}`
        : `${API_URL}/api/problems/create`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatted)
      });

      if (!res.ok) {
        const err = await res.json();
        setStatusMsg(`❌ ${err.error || "Failed"}`);
        return;
      }

      setStatusMsg(editingId ? "✅ Problem Updated" : "✅ Problem Created");
      resetForm();
      loadProblems();
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Error saving problem");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", difficulty: "Easy", statement: "", sampleInput: "", sampleOutput: "", points: 2, testCases: "" });
    setEditingId(null);
  };

  const editProblem = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/problems/${id}`);
      const p = await res.json();
      setForm({
        title: p.title,
        difficulty: p.difficulty,
        statement: p.statement,
        sampleInput: p.sampleInput || "",
        sampleOutput: p.sampleOutput || "",
        points: getPointsByDifficulty(p.difficulty),
        testCases: JSON.stringify(p.testCases, null, 2)
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProblem = async (id) => {
    if (!confirm("Delete this problem?")) return;
    try {
      await fetch(`${API_URL}/api/problems/${id}`, { method: "DELETE" });
      setStatusMsg("✅ Problem deleted");
      loadProblems();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProblems = allProblems.filter((p) => {
    const matchDiff = filter === "All" || p.difficulty === filter;
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDiff && matchSearch;
  });

  const diffColor = (d) =>
    d === "Easy" ? "text-green-400" : d === "Medium" ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Back Link + Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition">← Back to Admin</Link>
            <h1 className="mt-2 text-3xl font-semibold">
              {editingId ? "Edit Problem" : "Create Problem"}
            </h1>
          </div>
          {editingId && (
            <button onClick={resetForm} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm hover:bg-zinc-600 transition">
              Cancel Edit
            </button>
          )}
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-lg text-sm font-medium ${statusMsg.startsWith("✅") ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"}`}>
            {statusMsg}
          </div>
        )}

        {/* Form */}
        <div className="rounded-2xl border border-[#3e3e3e]/30 bg-[#282828] p-6 space-y-4">
          <input name="title" value={form.title} placeholder="Problem Title" onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50 transition" />

          <div className="grid gap-4 sm:grid-cols-2">
            <select name="difficulty" value={form.difficulty} onChange={handleChange}
              className="bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <input name="points" value={form.points} placeholder="Points" onChange={handleChange} type="number"
              className="bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50" />
          </div>

          <textarea name="statement" value={form.statement} placeholder="Problem Statement" onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg h-32 text-sm resize-none focus:outline-none focus:border-blue-500/50" />

          <div className="grid gap-4 sm:grid-cols-2">
            <input name="sampleInput" value={form.sampleInput} placeholder="Sample Input" onChange={handleChange}
              className="bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50" />
            <input name="sampleOutput" value={form.sampleOutput} placeholder="Sample Output" onChange={handleChange}
              className="bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50" />
          </div>

          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Test Cases (JSON array)</label>
            <textarea name="testCases" value={form.testCases}
              placeholder={`[\n  {\n    "input": "5",\n    "expectedOutput": "25"\n  }\n]`}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-[#3e3e3e]/30 p-3 rounded-lg h-44 text-sm resize-none font-mono focus:outline-none focus:border-blue-500/50" />
          </div>

          <button onClick={createOrUpdateProblem} disabled={creating}
            className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-500 disabled:bg-zinc-700">
            {creating ? "Saving..." : editingId ? "Update Problem" : "Create Problem"}
          </button>
        </div>

        {/* Problems Table */}
        <div className="rounded-2xl border border-[#3e3e3e]/30 bg-[#282828] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold">All Problems ({filteredProblems.length})</h2>
            <div className="flex gap-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-[#1a1a1a] border border-[#3e3e3e]/30 px-3 py-2 rounded-lg text-sm w-48 focus:outline-none focus:border-blue-500/50"
              />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}
                className="bg-[#1a1a1a] border border-[#3e3e3e]/30 px-3 py-2 rounded-lg text-sm focus:outline-none">
                <option>All</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          {filteredProblems.length === 0 ? (
            <p className="text-zinc-500 text-sm">No problems found.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {filteredProblems.map((p) => (
                <div key={p._id} className="flex items-center justify-between gap-3 bg-[#1a1a1a] border border-[#3e3e3e]/20 p-3 rounded-lg group hover:border-[#3e3e3e]/50 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-medium w-14 shrink-0 ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                    <span className="text-sm truncate">{p.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => editProblem(p._id)}
                      className="rounded bg-blue-600/20 px-3 py-1 text-xs text-blue-300 hover:bg-blue-600/40 transition">
                      Edit
                    </button>
                    <button onClick={() => deleteProblem(p._id)}
                      className="rounded bg-red-600/20 px-3 py-1 text-xs text-red-300 hover:bg-red-600/40 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
