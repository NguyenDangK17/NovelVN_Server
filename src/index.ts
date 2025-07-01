import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
// import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.route";
import novelRoutes from "./routes/novel.route";
import mangaRoutes from "./routes/manga/manga.route";
import volumeRoutes from "./routes/manga/volume.route";
import historyRoutes from "./routes/history.route";
import mangadexRoutes from "./routes/mangadex/mangadex.route";
import userRoutes from './routes/user.route';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

connectDB();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100
// });

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
// app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/novels", novelRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/mangas", mangaRoutes);
app.use("/api/volumes", volumeRoutes);
app.use("/api/mangadex", mangadexRoutes);
app.use("/api/users", userRoutes);

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

// In-memory chat storage (for demo)
const chatHistory: Record<string, { from: string; to: string; message: string; timestamp: number }[]> = {};
const onlineUsers: Record<string, string> = {}; // userId -> socketId

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token provided'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'access-secret') as any;
    // Attach userId to socket
    (socket as any).userId = payload.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = (socket as any).userId;
  onlineUsers[userId] = socket.id;
  socket.emit('online', { userId });

  socket.on('join', ({ toUserId }) => {
    // Optionally join a room for 1-1 chat
    const room = [userId, toUserId].sort().join('-');
    socket.join(room);
    // Send chat history
    socket.emit('chat_history', chatHistory[room] || []);
  });

  socket.on('send_message', ({ toUserId, message }) => {
    const room = [userId, toUserId].sort().join('-');
    const chatMsg = { from: userId, to: toUserId, message, timestamp: Date.now() };
    if (!chatHistory[room]) chatHistory[room] = [];
    chatHistory[room].push(chatMsg);
    io.to(room).emit('receive_message', chatMsg);
  });

  socket.on('disconnect', () => {
    delete onlineUsers[userId];
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
