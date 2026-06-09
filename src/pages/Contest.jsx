import { useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import SharedCodeEditor from "../components/SharedCodeEditor";
import { API_URL } from "../config/api";

const Contest = () => {
  const { id } = useParams();
  const contestId = id;

  const socketRef = useRef(null);

  const username = localStorage.getItem("username") || "Guest";

  const [discussion, setDiscussion] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [leaderboard, setLeaderboard] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [contestLoaded, setContestLoaded] = useState(false);

  /*
  =========================
  SOCKET — join the contest room
  =========================
  */
  useEffect(() => {
    socketRef.current = io(API_URL, { autoConnect: true });
    const socket = socketRef.current;

    /*
    Join contest-specific socket room so leaderboard
    updates are scoped to this contest's participants
    */
    socket.emit("joinRoom", contestId);

    socket.on("leaderboardUpdate", (data) => {
      if (Array.isArray(data)) {
        setLeaderboard(data);
      }
    });

    return () => {
      socket.emit("leaveRoom", contestId);
      socket.off("leaderboardUpdate");
      socket.disconnect();
    };
  }, [contestId]);

  useEffect(() => {
    loadLeaderboard();
    loadProblems();
  }, []);

  useEffect(() => {
    if (selectedProblem) {
      loadDiscussion();
    }
  }, [selectedProblem]);

  /*
  =========================
  CONTEST TIMER (counts down from 3600s / 1h)
  =========================
  */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/contests/${contestId}`);

      if (!res.ok) {
        console.error("Failed to load contest");
        return;
      }

      const contest = await res.json();
      const data = contest.problems || [];

      setProblems(data);
      setContestLoaded(true);

      if (data.length > 0) {
        setSelectedProblem(data[0]);
      }
    } catch (err) {
      console.error("loadProblems error:", err);
    }
  };

  const loadDiscussion = async () => {
    try {
      if (!selectedProblem?._id) return;

      const res = await fetch(
        `${API_URL}/api/discussions/${selectedProblem._id}`
      );
      const data = await res.json();
      setDiscussion(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadDiscussion error:", err);
    }
  };

  const postMessage = async () => {
    try {
      if (!message.trim() || !selectedProblem?._id) return;

      await fetch(`${API_URL}/api/discussions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: selectedProblem._id,
          username,
          message
        })
      });

      setMessage("");
      loadDiscussion();
    } catch (err) {
      console.error("postMessage error:", err);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/leaderboard/${contestId}`);
      const data = await res.json();
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadLeaderboard error:", err);
    }
  };

  const saveScore = async (updatedScore) => {
    try {
      await fetch(`${API_URL}/api/leaderboard/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          contestId,
          score: updatedScore
        })
      });
    } catch (err) {
      console.error("saveScore error:", err);
    }
  };

  const onAccepted = async () => {
    const points = selectedProblem?.points || 100;
    const newScore = score + points;
    setScore(newScore);
    await saveScore(newScore);
    loadLeaderboard();
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">🏆 Contest Arena</h1>

        <div className="flex items-center gap-4">
          <div className="text-yellow-400 font-bold text-xl">
            ⏰ {formatTime(timeLeft)}
          </div>
          <div className="text-green-400 font-bold">
            Score: {score}
          </div>
        </div>
      </div>

      {!contestLoaded && (
        <div className="text-zinc-400 text-center py-16">
          Loading contest...
        </div>
      )}

      {contestLoaded && (
        <div className="grid grid-cols-12 gap-4">
          {/* PROBLEM LIST */}
          <div className="col-span-2 bg-[#161b22] p-4 rounded-xl">
            <h2 className="mb-4 font-bold text-zinc-300">Problems</h2>

            {problems.map((p, idx) => (
              <div
                key={p._id}
                onClick={() => setSelectedProblem(p)}
                className={`mb-3 p-3 rounded cursor-pointer transition-colors ${
                  selectedProblem?._id === p._id
                    ? "bg-green-700"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                <div className="font-medium text-sm">
                  {String.fromCharCode(65 + idx)}. {p.title}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    p.difficulty === "Easy"
                      ? "text-green-400"
                      : p.difficulty === "Medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {p.difficulty}
                </div>
              </div>
            ))}
          </div>

          {/* EDITOR PANEL */}
          <div className="col-span-7">
            <div className="bg-[#161b22] p-4 rounded-xl mb-4">
              <h2 className="text-2xl font-bold">
                {selectedProblem?.title || "Select a problem"}
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed">
                {selectedProblem?.statement}
              </p>
            </div>

            <div className="bg-[#161b22] p-4 rounded-xl">
              <SharedCodeEditor
                problemId={selectedProblem?._id}
                onAccepted={onAccepted}
              />
            </div>

            {/* DISCUSSION */}
            <div className="bg-[#161b22] p-4 mt-4 rounded-xl">
              <h2 className="font-bold mb-3 text-zinc-300">
                💬 Discussion
              </h2>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {discussion.length === 0 && (
                  <div className="text-zinc-500 text-sm">
                    No discussions yet. Ask the first question!
                  </div>
                )}

                {discussion.map((item) => (
                  <div
                    key={item._id}
                    className="border-b border-zinc-800 py-2"
                  >
                    <span className="font-bold text-green-400 text-sm">
                      {item.username}
                    </span>
                    <div className="text-sm text-zinc-300 mt-1">
                      {item.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a doubt or share a hint..."
                  className="flex-1 bg-zinc-900 p-2 rounded text-sm resize-none"
                  rows={2}
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

          {/* SIDEBAR */}
          <div className="col-span-3">
            <div className="bg-[#161b22] p-4 rounded-xl mb-4 flex justify-center">
              <div className="w-36 h-36">
                <CircularProgressbar
                  value={score}
                  maxValue={1000}
                  text={`${score}`}
                  styles={{
                    path: { stroke: "#22c55e" },
                    trail: { stroke: "#27272a" },
                    text: { fill: "#f4f4f5", fontSize: "20px" }
                  }}
                />
              </div>
            </div>

            <div className="bg-[#161b22] p-4 rounded-xl">
              <h2 className="font-bold mb-3 text-zinc-300">
                🏅 Leaderboard
              </h2>

              {leaderboard.length === 0 && (
                <div className="text-zinc-500 text-sm">
                  No scores yet
                </div>
              )}

              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  className={`flex justify-between border-b border-zinc-800 py-2 text-sm ${
                    player.username === username ? "text-green-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 w-4">
                      {index + 1}.
                    </span>
                    <span>{player.username}</span>
                  </div>
                  <div className="font-bold">{player.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contest;
