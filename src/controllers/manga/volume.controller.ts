import { Request, Response } from "express";
import Volume from "../../models/manga/volume.model";
import Manga from "../../models/manga/manga.model";

/**
 * @desc Create a new volume
 * @route POST /api/mangas/:mangaId/volumes
 * @access Private (Admin only)
 */
export const createVolume = async (req: Request, res: Response): Promise<any> => {
  const { mangaId } = req.params;
  const { volume_title, volume_cover } = req.body;

  try {
    // Check if manga exists
    const mangaExists = await Manga.findById(mangaId);
    if (!mangaExists) {
      return res.status(404).json({ message: "Manga not found" });
    }

    // Create new volume
    const newVolume = new Volume({
      manga_id: mangaId,
      volume_title,
      volume_cover,
    });

    await newVolume.save();
    res.status(201).json(newVolume);
  } catch (error) {
    console.error("Error creating volume:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all volumes for a specific manga
 * @route GET /api/mangas/:mangaId/volumes
 * @access Public
 */
export const getVolumesByManga = async (req: Request, res: Response): Promise<any> => {
  const { mangaId } = req.params;

  try {
    const volumes = await Volume.find({ manga_id: mangaId });
    res.status(200).json(volumes);
  } catch (error) {
    console.error("Error fetching volumes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get a single volume by ID
 * @route GET /api/volumes/:id
 * @access Public
 */
export const getVolumeById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const volume = await Volume.findById(id);
    if (!volume) {
      return res.status(404).json({ message: "Volume not found" });
    }

    res.status(200).json(volume);
  } catch (error) {
    console.error("Error fetching volume:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update a volume by ID
 * @route PATCH /api/volumes/:id
 * @access Private (Admin only)
 */
export const updateVolume = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { volume_title, volume_cover } = req.body;

  try {
    const volume = await Volume.findById(id);
    if (!volume) {
      return res.status(404).json({ message: "Volume not found" });
    }

    if (volume_title) volume.volume_title = volume_title;
    if (volume_cover !== undefined) volume.volume_cover = volume_cover;

    await volume.save();
    res.status(200).json(volume);
  } catch (error) {
    console.error("Error updating volume:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete a volume by ID
 * @route DELETE /api/volumes/:id
 * @access Private (Admin only)
 */
export const deleteVolume = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const volume = await Volume.findById(id);
    if (!volume) {
      return res.status(404).json({ message: "Volume not found" });
    }

    await volume.deleteOne();
    res.status(200).json({ message: "Volume deleted successfully" });
  } catch (error) {
    console.error("Error deleting volume:", error);
    res.status(500).json({ message: "Server error" });
  }
};
