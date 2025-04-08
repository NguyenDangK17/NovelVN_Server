import express from "express";
import { protect } from "../middleware/authMiddleware";
import { addHistory, getAllHistories, getHistoryById } from "../controllers/history.controller";

const router = express.Router();

router.get("/", getAllHistories);
router.get("/:id", protect, getHistoryById);
router.post("/", protect, addHistory);

export default router;
