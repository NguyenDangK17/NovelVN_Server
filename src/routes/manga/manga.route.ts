import express from "express";
import { createManga, deleteManga, editManga, getAllMangas, getMangaById, getMangasByUserId, updateViewCount } from "../../controllers/manga/manga.controller";
import { protect } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/", getAllMangas);
router.get("/work", protect, getMangasByUserId);
router.get("/:id", getMangaById);
router.post("/", protect, createManga);
router.post("/:id/view", updateViewCount);
router.patch("/:id", editManga);
router.delete("/:id", deleteManga);

export default router;
