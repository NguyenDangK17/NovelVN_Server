import { Request, Response } from "express";
import Novel from "../models/novel.model";

export const getAllNovels = async (req: Request, res: Response): Promise<any> => {
  try {
    const novels = await Novel.find();
    res.status(200).json(novels);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getNovelById = async (req: Request, res: Response): Promise<any> => {
  try {
    const novel = await Novel.findById(req.params.id);
    res.status(200).json(novel);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateViewCount = async (req: Request, res: Response): Promise<any> => {
  try {
    const novel = await Novel.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    if (!novel) return res.status(404).json({ message: "Novel not found" });

    res.status(200).json(novel);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const addChapter = async (req: Request, res: Response): Promise<any> => {
  try {
    const novel = await Novel.findByIdAndUpdate(req.params.id, { $set: { content: req.body.content } }, { new: true });
    if (!novel) return res.status(404).json({ message: "Novel not found" });

    res.status(200).json(novel);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};