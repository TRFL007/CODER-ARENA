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
      setRoom(data);

      if (data?.selectedProblems?.length > 0) {
        setSelectedProblem((prev) => prev ?? data.selectedProblems[0]);
      }
    } catch (err) {
      console.error("loadRoom error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  /*
  =========================
  TIMER — synced from server startedAt timestamp
  =========================
  */
  useEffect(() => {
    if (!room?.startedAt) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - new Date(room.startedAt).getTime()) / 1000
      );

      const remaining = Math.max((room.battleTime || 300) - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [room?.startedAt, room?.battleTime]);

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
      <div className="bg-[#0d1117] text-white min-h-screen flex items-center justify-center text-3xl">
        Loading Battle...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="bg-[#0d1117] text-red-400 min-h-screen flex flex-col items-center justify-center gap-4">
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
    <div className="bg-[#0d1117] min-h-screen text-white p-6">
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
        <div className="col-span-12 lg:col-span-3 bg-[#161b22] rounded-xl p-4">
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
        <div className="col-span-12 lg:col-span-9 bg-[#161b22] rounded-xl p-4">
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
    </div>
  );
};

export default BattleRoom;
