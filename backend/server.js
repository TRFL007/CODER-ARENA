import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/*
=========================
LOAD ENV VARIABLES
=========================
*/
dotenv.config({ path: "./.env" });

/*
=========================
ENV DEBUG
=========================
*/
console.log("Current Directory:", process.cwd());
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");
console.log("PORT:", process.env.PORT || 5000);

/*
=========================
ROUTES
=========================
*/
import multiplayerRoutes from "./routes/multiplayerRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testCaseRoutes from "./routes/testCaseRoutes.js";

const app = express();
const server = http.createServer(app);

/*
=========================
SOCKET IO
=========================
*/
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  }
});

/*
=========================
MAKE IO AVAILABLE
INSIDE ROUTES
=========================
*/
app.set("io", io);

/*
=========================
MIDDLEWARE
=========================
*/
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());

/*
=========================
MONGODB CONNECTION
=========================
*/
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error(`
❌ MONGO_URI is not defined.

Create a .env file inside the server folder:

MONGO_URI=mongodb://127.0.0.1:27017/leetcode
PORT=5000
FRONTEND_URL=http://localhost:5173
`);
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err.message);
    process.exit(1);
  });

/*
=========================
SOCKET EVENTS
=========================
*/
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // JOIN A SPECIFIC BATTLE ROOM
  socket.on("joinRoom", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.emit("joinedRoom", { roomId });
  });

  // LEAVE A ROOM EXPLICITLY
  socket.on("leaveRoom", (roomId) => {
    if (!roomId) return;
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("User Disconnected:", socket.id, "Reason:", reason);
  });
});

/*
=========================
API ROUTES
=========================
*/
app.use("/api/multiplayer", multiplayerRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/testcases", testCaseRoutes);

/*
=========================
SERVE FRONTEND STATIC ASSETS & HEALTH CHECK
=========================
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendDistPath));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server Running 🚀",
    timestamp: new Date().toISOString()
  });
});

// For any other route, serve the React app's index.html
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/socket.io")) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
    if (err) {
      res.status(404).send("Frontend assets not built. Run 'npm run build' first.");
    }
  });
});

/*
=========================
GLOBAL ERROR HANDLER
=========================
*/
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/*
=========================
PORT
=========================
*/
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});

export { io };