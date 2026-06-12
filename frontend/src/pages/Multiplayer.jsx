import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_URL } from "../config/api";

const Multiplayer = () => {
  const navigate = useNavigate();

  const socketRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const username = localStorage.getItem("username") || "Guest";

  /*
  =========================
  SOCKET LIFECYCLE
  Module-level sockets cause stale closures and
  prevent reconnection after HMR. Always create inside useEffect.
  =========================
  */
  useEffect(() => {
    socketRef.current = io(API_URL, { autoConnect: true });

    const socket = socketRef.current;

    loadRooms();
    loadProblems();

    socket.on("roomsUpdated", loadRooms);

    return () => {
      socket.off("roomsUpdated", loadRooms);
      socket.disconnect();
    };
  }, []);

  const loadRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/multiplayer/rooms`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadRooms error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/problems`);
      const data = await res.json();
      setProblems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadProblems error:", err);
    }
  };

  const toggleProblem = (problem) => {
    const exists = selectedProblems.some((p) => p._id === problem._id);

    if (exists) {
      setSelectedProblems((prev) =>
        prev.filter((p) => p._id !== problem._id)
      );
    } else {
      setSelectedProblems((prev) => [...prev, problem]);
    }
  };

  const createRoom = async () => {
    if (selectedProblems.length === 0) {
      alert("Select at least one problem");
      return;
    }

    try {
      setCreating(true);

      const res = await fetch(`${API_URL}/api/multiplayer/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host: username, selectedProblems })
      });

      const room = await res.json();

      if (!res.ok) {
        alert(room.error || "Failed to create room");
        return;
      }

      navigate(`/battle/${room._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async (roomId) => {
    try {
      const res = await fetch(`${API_URL}/api/multiplayer/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, username })
      });

      const room = await res.json();

      if (!res.ok) {
        alert(room.error || "Failed to join room");
        return;
      }

      navigate(`/battle/${room._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to join room");
    }
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">⚔ Multiplayer Arena</h1>

        <button
          onClick={() => navigate("/multiplayer")}
          className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
        >
          ← Back to Lobby
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CREATE ROOM */}
        <div className="bg-[#282828] rounded-xl p-5">
          <h2 className="text-2xl font-bold mb-4">Create Battle</h2>

          <p className="mb-4 text-zinc-400">
            Logged in as:{" "}
            <span className="text-green-400">{username}</span>
          </p>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="flex justify-between items-center bg-zinc-800 p-3 rounded"
              >
                <div>
                  <div className="font-medium">{problem.title}</div>
                  <div className="text-xs text-gray-400">
                    {problem.difficulty}
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={selectedProblems.some(
                    (p) => p._id === problem._id
                  )}
                  onChange={() => toggleProblem(problem)}
                  className="w-4 h-4 accent-green-500"
                />
              </div>
            ))}

            {problems.length === 0 && !loading && (
              <div className="text-zinc-400 text-sm">
                No problems available. Create some in Admin panel.
              </div>
            )}
          </div>

          <div className="mt-4 text-green-400 text-sm">
            Selected: {selectedProblems.length}
          </div>

          <button
            onClick={createRoom}
            disabled={creating || selectedProblems.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed mt-4 p-3 rounded font-bold"
          >
            {creating ? "Creating..." : "Create Battle"}
          </button>
        </div>

        {/* AVAILABLE ROOMS */}
        <div className="bg-[#282828] rounded-xl p-5">
          <h2 className="text-2xl font-bold mb-4">Available Battles</h2>

          {loading && <div className="text-zinc-400">Loading rooms...</div>}

          {!loading && rooms.length === 0 && (
            <div className="text-zinc-400">No active battles</div>
          )}

          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room._id} className="bg-zinc-800 rounded p-4">
                <div className="font-bold text-green-400">
                  Host: {room.host}
                </div>

                <div className="text-sm text-gray-400 mt-1">
                  Players: {room.players?.length || 1}/2
                </div>

                <div className="text-sm text-gray-400">
                  Problems: {room.selectedProblems?.length || 0}
                </div>

                <button
                  onClick={() => joinRoom(room._id)}
                  disabled={room.players?.length >= 2}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed px-4 py-2 rounded mt-3 text-sm font-medium"
                >
                  {room.players?.length >= 2 ? "Full" : "Join Battle"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Multiplayer;

