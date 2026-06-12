import { useState, useEffect } from "react";
import { API_URL } from "../config/api";

const AdminContest = () => {
  const [form, setForm] = useState({
    title: "",
    difficulty: "Easy",
    statement: "",
    sampleInput: "",
    sampleOutput: "",
    points: 100,
    testCases: ""
  });

  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [contestTitle, setContestTitle] = useState("Weekly Contest");
  const [creating, setCreating] = useState(false);
  const [creatingContest, setCreatingContest] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createProblem = async () => {
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

      const res = await fetch(`${API_URL}/api/problems/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatted)
      });

      if (!res.ok) {
        const err = await res.json();
        setStatusMsg(`❌ ${err.error || "Failed to create problem"}`);
        return;
      }

      setStatusMsg("✅ Problem Created");
      setForm({
        title: "",
        difficulty: "Easy",
        statement: "",
        sampleInput: "",
        sampleOutput: "",
        points: 100,
        testCases: ""
      });
      loadProblems();
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Error creating problem");
    } finally {
      setCreating(false);
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
          description: "AlgoTracker Contest",
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          problems: selectedProblems
        })
      });

      if (!res.ok) {
        setStatusMsg("❌ Failed to create contest");
        return;
      }

      setStatusMsg("✅ Contest Created");
      setSelectedProblems([]);
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Error creating contest");
    } finally {
      setCreatingContest(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🛠 Admin Panel</h1>

      {statusMsg && (
        <div
          className={`mb-6 p-3 rounded text-sm font-medium ${
            statusMsg.startsWith("✅")
              ? "bg-green-900/50 text-green-300"
              : "bg-red-900/50 text-red-300"
          }`}
        >
          {statusMsg}
        </div>
      )}

      {/* CREATE PROBLEM */}
      <div className="bg-[#282828] p-6 rounded-xl max-w-3xl mb-8">
        <h2 className="text-2xl font-bold mb-4">Create Problem</h2>

        <div className="flex flex-col gap-4">
          <input
            name="title"
            value={form.title}
            placeholder="Problem Title"
            onChange={handleChange}
            className="bg-zinc-900 p-3 rounded text-sm"
          />

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="bg-zinc-900 p-3 rounded text-sm"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <textarea
            name="statement"
            value={form.statement}
            placeholder="Problem Statement"
            onChange={handleChange}
            className="bg-zinc-900 p-3 rounded h-32 text-sm resize-none"
          />

          <input
            name="sampleInput"
            value={form.sampleInput}
            placeholder="Sample Input"
            onChange={handleChange}
            className="bg-zinc-900 p-3 rounded text-sm"
          />

          <input
            name="sampleOutput"
            value={form.sampleOutput}
            placeholder="Sample Output"
            onChange={handleChange}
            className="bg-zinc-900 p-3 rounded text-sm"
          />

          <input
            name="points"
            value={form.points}
            placeholder="Points (e.g. 100)"
            onChange={handleChange}
            type="number"
            className="bg-zinc-900 p-3 rounded text-sm"
          />

          <div>
            <label className="text-zinc-400 text-xs mb-1 block">
              Test Cases (JSON array)
            </label>
            <textarea
              name="testCases"
              value={form.testCases}
              placeholder={`[\n  {\n    "input": "5",\n    "expectedOutput": "25"\n  }\n]`}
              onChange={handleChange}
              className="bg-zinc-900 p-3 rounded h-52 w-full text-sm resize-none font-mono"
            />
          </div>

          <button
            onClick={createProblem}
            disabled={creating}
            className="bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 p-3 rounded font-medium"
          >
            {creating ? "Creating..." : "Create Problem"}
          </button>
        </div>
      </div>

      {/* CREATE CONTEST */}
      <div className="bg-[#282828] p-6 rounded-xl max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Create Contest</h2>

        <input
          value={contestTitle}
          onChange={(e) => setContestTitle(e.target.value)}
          placeholder="Contest Title"
          className="bg-zinc-900 p-3 rounded text-sm w-full mb-4"
        />

        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {allProblems.length === 0 && (
            <div className="text-zinc-500 text-sm">
              No problems yet. Create some above.
            </div>
          )}

          {allProblems.map((p) => (
            <div
              key={p._id}
              className="flex gap-3 items-center bg-zinc-900 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedProblems.includes(p._id)}
                onChange={(e) => toggleProblem(p._id, e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <span className="text-sm">{p.title}</span>
                <span
                  className={`ml-2 text-xs ${
                    p.difficulty === "Easy"
                      ? "text-green-400"
                      : p.difficulty === "Medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {p.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={createContest}
          disabled={creatingContest}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 p-3 rounded w-full font-medium"
        >
          {creatingContest ? "Creating..." : "Create Contest"}
        </button>
      </div>
    </div>
  );
};

export default AdminContest;

