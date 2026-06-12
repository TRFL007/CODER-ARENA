import { useState } from "react";
import { API_URL } from "../config/api";

export default function Interview() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/interview/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || "No response");
    } catch (err) {
      setAnswer("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Interview Practice</h1>
      <textarea
        className="w-full p-4 bg-white/10 rounded-xl text-white placeholder-gray-400 mb-4 min-h-[100px]"
        placeholder="Ask an interview question..."
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />
      <button
        onClick={ask}
        disabled={loading}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded font-semibold disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {answer && (
        <div className="mt-6 p-4 bg-white/10 rounded-xl whitespace-pre-wrap">{answer}</div>
      )}
    </div>
  );
}

