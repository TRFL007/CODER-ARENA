import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SharedCodeEditor from "../components/SharedCodeEditor";
import { API_URL } from "../config/api";

const BattleRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300);

  const username = localStorage.getItem("username") || "Guest";

  /*
  =========================
  LOAD ROOM
  =========================
  */
  const loadRoom = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/multiplayer/room/${id}`);

      if (!res.ok) {
        setRoom(null);
        return;
      }

      const data = await res.json();

      // Auto-join if room is waiting, has space, user is logged in, and not already in players list
      if (
        data &&
        data.status === "waiting" &&
        data.players &&
        data.players.length < 2 &&
        username &&
        username !== "Guest" &&
        !data.players.includes(username)
      ) {
        const joinRes = await fetch(`${API_URL}/api/multiplayer/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId: id, username })
        });
        if (joinRes.ok) {
          const joinedData = await joinRes.json();
          setRoom(joinedData);
          if (joinedData?.selectedProblems?.length > 0) {
            setSelectedProblem((prev) => prev ?? joinedData.selectedProblems[0]);
          }
          return;
        }
      }

      setRoom(data);

      if (data?.selectedProblems?.length > 0) {
        setSelectedProblem((prev) => prev ?? data.selectedProblems[0]);
      }
    } catch (err) {
      console.error("loadRoom error:", err);
    } finally {
      setLoading(false);
    }
  }, [id, username]);

  /*
  =========================
  SOCKET LIFECYCLE
  Must be in useEffect, not module-level.
  Joins the specific battle room so events are scoped.
  =========================
  */
  useEffect(() => {
    socketRef.current = io(API_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const socket = socketRef.current;

    loadRoom();

    /*
    Join the Socket.IO room for this battle — required so
    room-scoped emits from the server reach this client
    */
    socket.emit("joinRoom", id);

    socket.on("joinedRoom", ({ roomId }) => {
      console.log("Confirmed joined room:", roomId);
    });

    socket.on("battleUpdated", (updatedRoom) => {
      /*
      BUG FIX: updatedRoom._id is an ObjectId string,
      compare with string cast to handle both types safely
      */
      if (String(updatedRoom._id) === String(id)) {
        setRoom(updatedRoom);
      }
    });

    socket.on("battleStarted", (startedRoom) => {
      if (String(startedRoom._id) === String(id)) {
        setRoom(startedRoom);
      }
    });

    socket.on("winnerDeclared", ({ roomId, winner }) => {
      if (String(roomId) === String(id)) {
        setRoom((prev) => {
          if (!prev) return prev;
          return { ...prev, winner, status: "finished" };
        });
      }
    });

    /*
    On reconnect, re-join the room and re-fetch state
    */
    socket.on("connect", () => {
      socket.emit("joinRoom", id);
      loadRoom();
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("battleUpdated");
      socket.off("battleStarted");
      socket.off("winnerDeclared");
      socket.off("joinedRoom");
      socket.off("connect");
      socket.disconnect();
    };
  }, [id, loadRoom]);

  const declareDraw = useCallback(async () => {
    if (!room?._id || room.status !== "started" || room.winner) return;
    try {
      await fetch(`${API_URL}/api/multiplayer/winner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room._id, winner: "Draw" })
      });
    } catch (err) {
      console.error("declareDraw error:", err);
    }
  }, [room?._id, room?.status, room?.winner]);

  /*
  =========================
  TIMER — synced from server startedAt timestamp
  =========================
  */
  useEffect(() => {
    if (!room?.startedAt || room.status !== "started") return;

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - new Date(room.startedAt).getTime()) / 1000
      );

      const remaining = Math.max((room.battleTime || 300) - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        declareDraw();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [room?.startedAt, room?.battleTime, room?.status, declareDraw]);

  /*
  =========================
  HANDLE ACCEPTED — declare winner
  =========================
  */
  const handleAccepted = async () => {
    if (!room?._id || room?.winner) return;

    try {
      await fetch(`${API_URL}/api/multiplayer/winner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room._id, winner: username })
      });
    } catch (err) {
      console.error("handleAccepted error:", err);
    }
  };

  const startBattle = async () => {
    try {
      const res = await fetch(`${API_URL}/api/multiplayer/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: id, username })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to start battle");
      }
    } catch (err) {
      console.error("startBattle error:", err);
    }
  };

  const handleRematch = async () => {
    try {
      const res = await fetch(`${API_URL}/api/multiplayer/rematch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: id })
      });
      if (!res.ok) {
        alert("Failed to request rematch");
      }
    } catch (err) {
      console.error("handleRematch error:", err);
    }
  };

  /*
  =========================
  FORMAT TIMER
  =========================
  */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  /*
  =========================
  STATES
  =========================
  */
  if (loading) {
    return (
      <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center text-3xl">
        Loading Battle...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="bg-[#1a1a1a] text-red-400 min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-3xl">Room Not Found</div>
        <button
          onClick={() => navigate("/multiplayer")}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  const isWaiting = room.status === "waiting";

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">⚔ Multiplayer Battle</h1>

        <div
          className={`text-2xl font-bold ${
            timeLeft <= 60 ? "text-red-400 animate-pulse" : "text-yellow-400"
          }`}
        >
          ⏰ {formatTime(timeLeft)}
        </div>
      </div>

      {/* PLAYERS */}
      <div className="text-center mb-6">
        {isWaiting ? (
          room.players?.length === 1 ? (
            <div className="bg-yellow-900/40 border border-yellow-600 rounded-xl p-4">
              <div className="text-yellow-300 text-xl font-bold">
                ⏳ Waiting for opponent...
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                Share this URL with a friend to start the battle
              </div>
              <div className="mt-2 text-xs text-zinc-500 font-mono break-all">
                {window.location.href}
              </div>
            </div>
          ) : (
            <div className="bg-blue-900/40 border border-blue-600 rounded-xl p-5 max-w-md mx-auto">
              <div className="text-blue-300 text-xl font-bold mb-2">
                👥 Opponent Joined!
              </div>
              <div className="text-sm text-zinc-300 mb-4">
                <strong>{room.players[0]}</strong> vs <strong>{room.players[1]}</strong>
              </div>
              {username === room.host ? (
                <button
                  onClick={startBattle}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02]"
                >
                  🚀 Start Battle
                </button>
              ) : (
                <div className="text-zinc-400 text-sm animate-pulse">
                  Waiting for host ({room.host}) to start the match...
                </div>
              )}
            </div>
          )
        ) : (
          <div className="text-2xl font-bold">
            <span className="text-green-400">{room.players?.[0]}</span>
            <span className="mx-6 text-red-500">VS</span>
            <span className="text-blue-400">
              {room.players?.[1] || "Waiting..."}
            </span>
          </div>
        )}

        {room.winner && (
          <div className="mt-4 text-green-400 text-3xl font-bold">
            🏆 Winner: {room.winner}
          </div>
        )}
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-12 gap-4">
        {/* PROBLEM LIST */}
        <div className="col-span-12 lg:col-span-3 bg-[#282828] border border-[#3e3e3e]/30 rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 text-zinc-300">Problems</h2>

          {room.selectedProblems?.map((problem, index) => (
            <div
              key={problem._id || index}
              onClick={() => setSelectedProblem(problem)}
              className={`p-3 mb-3 rounded cursor-pointer transition-colors ${
                selectedProblem?._id === problem._id
                  ? "bg-green-700"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              <div className="text-sm font-medium">Problem {index + 1}</div>
              <div className="text-xs text-zinc-400 mt-1">{problem.title}</div>
              <div
                className={`text-xs mt-1 ${
                  problem.difficulty === "Easy"
                    ? "text-green-400"
                    : problem.difficulty === "Medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {problem.difficulty}
              </div>
            </div>
          ))}
        </div>

        {/* PROBLEM + EDITOR */}
        <div className="col-span-12 lg:col-span-9 bg-[#282828] border border-[#3e3e3e]/30 rounded-xl p-4">
          {selectedProblem ? (
            <>
              <h2 className="text-2xl font-bold">{selectedProblem.title}</h2>

              <div className="text-yellow-400 mt-1 text-sm">
                {selectedProblem.difficulty}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed">
                {selectedProblem.statement || selectedProblem.description}
              </p>

              {selectedProblem.sampleInput && (
                <div className="mt-4">
                  <h3 className="font-bold text-sm mb-1">Sample Input</h3>
                  <pre className="bg-zinc-900 p-2 rounded text-xs">
                    {selectedProblem.sampleInput}
                  </pre>
                </div>
              )}

              {selectedProblem.sampleOutput && (
                <div className="mt-3">
                  <h3 className="font-bold text-sm mb-1">Sample Output</h3>
                  <pre className="bg-zinc-900 p-2 rounded text-xs">
                    {selectedProblem.sampleOutput}
                  </pre>
                </div>
              )}

              <div className="mt-6">
                <SharedCodeEditor
                  problemId={selectedProblem._id}
                  onAccepted={handleAccepted}
                  disabled={!!room.winner || isWaiting}
                />
              </div>
            </>
          ) : (
            <div className="text-zinc-400 flex items-center justify-center h-64">
              Select a problem from the left panel
            </div>
          )}
        </div>
      </div>

      {/* BATTLE FINISHED MODAL */}
      {room.winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#282828] border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Decorative blurs */}
            {room.winner === "Draw" ? (
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            ) : room.winner === username ? (
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
            ) : (
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" />
            )}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            
            {room.winner === "Draw" ? (
              <>
                <div className="text-6xl mb-4">🤝</div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Match Draw!
                </h2>
                <p className="text-zinc-400 text-sm mt-2">
                  Time ran out with no correct submission.
                </p>
              </>
            ) : room.winner === username ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Victory!
                </h2>
                <p className="text-zinc-400 text-sm mt-2">
                  Congratulations! You won the battle!
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                  Better Luck Next Time
                </h2>
                <p className="text-zinc-400 text-sm mt-2">
                  <strong>{room.winner}</strong> won the battle.
                </p>
              </>
            )}

            <div className="my-6 p-4 rounded-xl bg-[#1d1d1d] border border-zinc-800">
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Time Taken</p>
              <p className="text-xl font-semibold text-white">
                {room.battleTime ? formatTime(room.battleTime) : "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleRematch}
                className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all"
              >
                Rematch
              </button>
              <button
                onClick={() => navigate("/")}
                className="py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-750 text-white rounded-xl font-bold transition-all"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleRoom;

