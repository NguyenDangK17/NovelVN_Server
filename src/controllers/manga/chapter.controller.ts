import { Request, Response } from "express";
import Chapter from "../../models/manga/chapter.model";

export const getAllChapters = async (req: Request, res: Response): Promise<any> => {
  try {
    const chapters = await Chapter.find();
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

// export const addChapters = async (req: Request, res: Response): Promise<any> => {
//   try {

//   } catch (error) {

//   }
// }