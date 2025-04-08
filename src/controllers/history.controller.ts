import { Request, Response } from "express";
import History from "../models/history.model";

export const getAllHistories = async (req: Request, res: Response): Promise<any> => {
  try {
    const histories = await History.find();
    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getHistoryById = async (req: Request, res: Response): Promise<any> => {
  try {
    const history = await History.find({ user: req.body.user._id })
      .populate({
        path: 'chapter_id',
        populate: {
          path: 'volume_id',
          populate: {
            path: 'manga_id'
          }
        }
      })
      .sort({ updatedAt: -1 }); // Sort by last read

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const addHistory = async (req: Request, res: Response): Promise<any> => {
  const { novelId, lastReadChapter } = req.body;

  try {
    let history = await History.findOne({ user: req.body.user._id, novel: novelId });

    if (history) {
      history.chapter_id = lastReadChapter;
    } else {
      history = new History({
        user: req.body.user._id,
        novel: novelId,
        lastReadChapter,
      });
    }

    await history.save();
    res.json({ message: "History updated", history });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};