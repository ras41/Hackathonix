import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hackathonix Backend Running");
});

app.get("/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    database: dbConnected ? "connected" : "disconnected"
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

io.on("connection", () => {
  console.log("Client connected");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
