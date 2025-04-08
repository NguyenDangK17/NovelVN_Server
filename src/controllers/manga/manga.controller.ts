import { Request, Response } from "express";
import Manga from "../../models/manga/manga.model";

export const getAllMangas = async (req: Request, res: Response): Promise<any> => {
  try {
    const mangas = await Manga.find();
    res.status(200).json(mangas);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getMangaById = async (req: Request, res: Response): Promise<any> => {
  try {
    const manga = await Manga.findById(req.params.id);
    res.status(200).json(manga);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getMangasByUserId = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.body.user._id) {
      res.status(400).json("No authorization");
    }
    const mangas = await Manga.find({ account_id: req.body.user._id });
    res.status(200).json(mangas);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const createManga = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      group_id,
      title,
      alternative_title,
      language,
      author,
      artist,
      description,
      manga_cover,
      genre,
      status,
    } = req.body;

    // Check if required fields are provided
    // if (!title || !author || !description || !manga_cover) {
    //   return res.status(400).json({ message: "Missing required fields." });
    // }

    const newManga = new Manga({
      account_id: req.body.user._id,
      group_id,
      title,
      alternative_title,
      language,
      author,
      artist,
      description,
      manga_cover,
      genre,
      status,
    });

    await newManga.save();

    res.status(201).json({ message: "Manga created successfully!", manga: newManga });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateViewCount = async (req: Request, res: Response): Promise<any> => {
  try {
    const manga = await Manga.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    if (!manga) return res.status(404).json({ message: "Manga not found" });

    res.status(200).json(manga);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const editManga = async (req: Request, res: Response): Promise<any> => {
  try {
    const manga = await Manga.findById(req.params.id);

    if (!manga) {
      return res.status(404).json({ message: "Manga not found" });
    }

    // Update only the provided fields
    Object.assign(manga, req.body);
    await manga.save();

    res.status(200).json({ message: "Manga updated successfully!", manga });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};


export const deleteManga = async (req: Request, res: Response): Promise<any> => {
  try {
    const deletedManga = await Manga.findByIdAndDelete(req.params.id);

    if (!deletedManga) {
      return res.status(404).json({ message: "Manga not found" });
    }

    res.status(200).json({ message: "Manga deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
