import express from "express";
import multer from "multer";
import { loginUser, registerUser, uploadAvatar, refreshToken, logout } from "../controllers/auth.controller";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
// Protect first, then parse file; prevents unnecessary file handling
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

// Test endpoint to verify authentication
router.get("/test", protect, (req, res) => {
  res.json({
    message: "Authentication working!",
    user: req.body.user,
    redisAvailable: require("../services/tokenService").default.isRedisAvailable()
  });
});

// Simple test endpoint without authentication
router.get("/ping", (req, res) => {
  res.json({ message: "Server is running!" });
});

export default router;