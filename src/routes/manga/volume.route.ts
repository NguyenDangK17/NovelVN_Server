import express from "express";
import {
  createVolume,
  getVolumesByManga,
  getVolumeById,
  updateVolume,
  deleteVolume,
} from "../../controllers/manga/volume.controller";

const router = express.Router();

// Routes
router.post("/:mangaId/create-volume", createVolume);
router.get("/:mangaId/get-volumes", getVolumesByManga);
router.get("/:id", getVolumeById);
router.patch("/:id", updateVolume);
router.delete("/:id", deleteVolume);

export default router;
