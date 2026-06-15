import express from "express";
import MultiplayerRoom from "../models/MultiplayerRoom.js";

const router = express.Router();

/*
=================================
CREATE ROOM
=================================
*/
router.post("/create", async (req, res) => {
  try {
    const { host, selectedProblems } = req.body;

    if (!host) {
      return res.status(400).json({ error: "Host required" });
    }

    if (!selectedProblems || selectedProblems.length === 0) {
      return res.status(400).json({ error: "Select at least one problem" });
    }

    /*
    Prevent a player from having two active rooms as host
    */
    const existingRoom = await MultiplayerRoom.findOne({
      host,
      status: "waiting"
    });

    if (existingRoom) {
      return res.status(400).json({
        error: "You already have an open battle room",
        roomId: existingRoom._id
      });
    }

    const room = await MultiplayerRoom.create({
      host,
      players: [host],
      selectedProblems,
      status: "waiting",
      battleTime: 300,
      startedAt: null,
      winner: ""
    });

    const io = req.app.get("io");

    /*
    Global broadcast so lobby lists refresh
    */
    io.emit("roomsUpdated");

    res.json(room);
  } catch (err) {
    console.error("CREATE ROOM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
GET WAITING ROOMS
=================================
*/
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await MultiplayerRoom.find({ status: "waiting" }).sort({
      createdAt: -1
    });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
JOIN ROOM
=================================
*/
router.post("/join", async (req, res) => {
  try {
    const { roomId, username } = req.body;

    if (!roomId || !username) {
      return res.status(400).json({ error: "roomId and username required" });
    }

    const room = await MultiplayerRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.status === "finished") {
      return res.status(400).json({ error: "Battle already finished" });
    }

    /*
    Duplicate player prevention — already in room, return current state
    */
    if (room.players.includes(username)) {
      return res.json(room);
    }

    /*
    Room full check
    */
    if (room.players.length >= 2) {
      return res.status(400).json({ error: "Battle Full" });
    }

    room.players.push(username);

    /*
    Auto-start when 2 players are in
    */
    if (room.players.length === 2 && room.status !== "started") {
      room.status = "started";
      room.startedAt = new Date();
    }

    await room.save();

    const io = req.app.get("io");

    /*
    Refresh lobby list for everyone
    */
    io.emit("roomsUpdated");

    /*
    Room-scoped events — only players in that battle room receive these
    */
    io.to(roomId).emit("battleUpdated", room);

    if (room.status === "started") {
      io.to(roomId).emit("battleStarted", room);
    }

    res.json(room);
  } catch (err) {
    console.error("JOIN ROOM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
GET SINGLE ROOM
=================================
*/
router.get("/room/:id", async (req, res) => {
  try {
    const room = await MultiplayerRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
DECLARE WINNER
=================================
*/
router.post("/winner", async (req, res) => {
  try {
    const { roomId, winner } = req.body;

    if (!roomId || !winner) {
      return res.status(400).json({ error: "roomId and winner required" });
    }

    const room = await MultiplayerRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    /*
    First-accepted-wins: only set winner once
    */
    if (!room.winner) {
      room.winner = winner;
      room.status = "finished";
      if (room.startedAt) {
        const timeTaken = Math.max(1, Math.floor((Date.now() - new Date(room.startedAt).getTime()) / 1000));
        room.battleTime = timeTaken;
      }
      await room.save();

      const io = req.app.get("io");

      /*
      Room-scoped broadcast so only battle participants see the result
      */
      io.to(roomId).emit("winnerDeclared", { roomId, winner });
      io.to(roomId).emit("battleUpdated", room);

      /*
      Also refresh lobby so the room disappears from waiting list
      */
      io.emit("roomsUpdated");
    }

    res.json({ success: true, winner: room.winner });
  } catch (err) {
    console.error("WINNER ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=================================
DELETE / CLEANUP ROOM
=================================
*/
router.delete("/:roomId", async (req, res) => {
  try {
    await MultiplayerRoom.findByIdAndDelete(req.params.roomId);

    const io = req.app.get("io");
    io.emit("roomsUpdated");

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
