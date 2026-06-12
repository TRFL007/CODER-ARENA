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

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [contest, setContest] = useState(null);
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
    loadContest();
  }, []);

  useEffect(() => {
    if (!contest) return;

    const updateTime = () => {
      const endTime = new Date(contest.endTime).getTime();
      const diffSeconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(diffSeconds);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [contest]);

  const loadContest = async () => {
    try {
      const res = await fetch(`${API_URL}/api/contests/${contestId}`);

      if (!res.ok) {
        console.error("Failed to load contest");
        return;
      }

      const contestData = await res.json();
      const contestProblems = contestData.problems || [];

      setContest(contestData);
      setProblems(contestProblems);
      setContestLoaded(true);

      if (contestProblems.length > 0) {
        setSelectedProblem(contestProblems[0]);
      }
    } catch (err) {
      console.error("loadContest error:", err);
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

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const contestStatus = () => {
    if (!contest) return "Loading...";
    const now = Date.now();
    const start = new Date(contest.startTime).getTime();
    const end = new Date(contest.endTime).getTime();
    if (now < start) return "Upcoming";
    if (now <= end) return "Live";
    return "Ended";
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white p-4">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {contest?.title || "🏆 Contest Arena"}
          </h1>
          <p className="mt-2 text-zinc-400">
            {contest?.description || "Join a contest and solve problems to earn points."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-3xl bg-[#282828] px-4 py-3 text-center text-sm text-slate-200">
            <div className="text-xs text-slate-400">Status</div>
            <div className="font-semibold">{contestStatus()}</div>
          </div>
          <div className="rounded-3xl bg-[#282828] px-4 py-3 text-center text-sm text-slate-200">
            <div className="text-xs text-slate-400">Time Remaining</div>
            <div className="font-semibold">{formatTime(timeLeft)}</div>
          </div>
          <div className="rounded-3xl bg-[#282828] px-4 py-3 text-center text-sm text-slate-200">
            <div className="text-xs text-slate-400">Score</div>
            <div className="font-semibold text-green-400">{score}</div>
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
          <div className="col-span-2 bg-[#282828] p-4 rounded-xl">
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
            <div className="bg-[#282828] p-4 rounded-xl mb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedProblem?.title || "Select a problem"}
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  {selectedProblem?.difficulty || "Difficulty"} • {selectedProblem?.points ?? 0} pts
                </p>
              </div>
              <div className="text-sm text-slate-300">
                Contest Start: {formatDate(contest?.startTime)}
                <br />
                Contest End: {formatDate(contest?.endTime)}
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed">
              {selectedProblem?.statement}
            </p>
          </div>

            <div className="bg-[#282828] p-4 rounded-xl">
              <SharedCodeEditor
                problemId={selectedProblem?._id}
                onAccepted={onAccepted}
              />
            </div>

          </div>

          {/* SIDEBAR */}
          <div className="col-span-3">
            <div className="bg-[#282828] p-4 rounded-xl mb-4 flex justify-center">
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

            <div className="bg-[#282828] p-4 rounded-xl">
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

