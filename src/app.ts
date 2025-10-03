import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.route";
import novelRoutes from "./routes/novel.route";
import mangaRoutes from "./routes/manga/manga.route";
import volumeRoutes from "./routes/manga/volume.route";
import historyRoutes from "./routes/history.route";
import mangadexRoutes from "./routes/mangadex/mangadex.route";
import userRoutes from "./routes/user.route";

dotenv.config();

// Initialize Express app
const app: Express = express();

// Connect database (safe for serverless; underlying driver handles reuse)
connectDB();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/novels", novelRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/mangas", mangaRoutes);
app.use("/api/volumes", volumeRoutes);
app.use("/api/mangadex", mangadexRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

export default app;
