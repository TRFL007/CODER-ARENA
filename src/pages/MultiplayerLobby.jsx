import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_URL } from "../config/api";

const MultiplayerLobby = () => {
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    socketRef.current = io(API_URL, { autoConnect: true });
    const socket = socketRef.current;

    fetchRooms();

    socket.on("roomsUpdated", fetchRooms);

    return () => {
      socket.off("roomsUpdated", fetchRooms);
      socket.disconnect();
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/multiplayer/rooms`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchRooms error:", err);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId) => {
    try {
      const res = await fetch(`${API_URL}/api/multiplayer/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, username })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Unable to join room");
        return;
      }

      navigate(`/battle/${data._id}`);
    } catch (err) {
      console.error(err);
      alert("Unable to join room");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">⚔ Battle Lobby</h1>

        <button
          onClick={() => navigate("/multiplayer/create")}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium"
        >
          + Create Battle
        </button>
      </div>

      {loading && (
        <div className="text-center text-zinc-400">Loading rooms...</div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="text-center text-zinc-400 mt-16">
          <div className="text-5xl mb-4">⚔</div>
          <div className="text-xl">No battle rooms available</div>
          <div className="text-sm mt-2">Create one to challenge others!</div>
        </div>
      )}

      <div className="grid gap-4 max-w-3xl mx-auto">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-[#161b22] border border-zinc-700 rounded-xl p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-green-400">
                  {room.host}'s Battle
                </h2>

                <p className="text-zinc-400 text-sm mt-1">
                  Players: {room.players?.length || 0}/2
                </p>

                <p className="text-zinc-400 text-sm">
                  Problems: {room.selectedProblems?.length || 0}
                </p>

                <p className="text-zinc-400 text-sm">
                  Status:{" "}
                  <span
                    className={
                      room.status === "waiting"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }
                  >
                    {room.status}
                  </span>
                </p>
              </div>

              <button
                onClick={() => joinRoom(room._id)}
                disabled={room.players?.length >= 2}
                className="bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium"
              >
                {room.players?.length >= 2 ? "Full" : "Join Battle"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiplayerLobby;
