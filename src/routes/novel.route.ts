import express from "express";
import { getAllNovels, getNovelById, updateViewCount, addChapter } from "../controllers/novel.controller";

const router = express.Router();

router.get("/", getAllNovels);
router.get("/:id", getNovelById);
router.post("/:id/view", updateViewCount);
router.patch("/:id/chapter", addChapter);

export default router;
