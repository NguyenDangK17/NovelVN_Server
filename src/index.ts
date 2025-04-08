import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.route";
import novelRoutes from "./routes/novel.route";
import mangaRoutes from "./routes/manga/manga.route";
import volumeRoutes from "./routes/manga/volume.route";
import historyRoutes from "./routes/history.route";

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: 'https://novel-vn-client.vercel.app',
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/novels", novelRoutes);
app.use("/api/history", historyRoutes);

app.use("/api/mangas", mangaRoutes);
app.use("/api/volumes", volumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
