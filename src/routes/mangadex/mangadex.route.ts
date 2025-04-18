import express from "express";
import { getChapterById, getChapterDetailById, getChaptersByMangaId, getCoverArtByMangaId, getMangaById, getTrendingManga } from "../../controllers/mangadex/mangadex.controller";

const router = express.Router();

router.get("/trending", getTrendingManga);
router.get("/:id", getMangaById);
router.get("/:id/cover", getCoverArtByMangaId);
router.get("/:id/chapters", getChaptersByMangaId);
router.get("/at-home/server/:chapterId", getChapterDetailById);
router.get("/chapter/:chapterId", getChapterById);

export default router;
