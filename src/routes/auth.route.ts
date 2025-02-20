import express from "express";
import multer from "multer";
import { loginUser, registerUser, uploadAvatar } from "../controllers/auth.controller";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;