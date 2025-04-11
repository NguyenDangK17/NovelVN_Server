import { Request, Response } from "express";
import Novel from "../models/novel.model";
import { ApiError } from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import { validateMongoId } from "../utils/validators";

// Types
interface NovelDocument {
  _id: string;
  title: string;
  content: string;
  viewCount: number;
  // Add other novel properties as needed
}

// Get all novels with pagination and filtering
export const getAllNovels = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const query = Novel.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const [novels, total] = await Promise.all([
    query.exec(),
    Novel.countDocuments()
  ]);

  res.status(200).json({
    status: "success",
    results: novels.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: novels
  });
});

// Get novel by ID
export const getNovelById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!validateMongoId(id)) {
    throw new ApiError(400, "Invalid novel ID");
  }

  const novel = await Novel.findById(id);

  if (!novel) {
    throw new ApiError(404, "Novel not found");
  }

  res.status(200).json({
    status: "success",
    data: novel
  });
});

// Update view count
export const updateViewCount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!validateMongoId(id)) {
    throw new ApiError(400, "Invalid novel ID");
  }

  const novel = await Novel.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true, runValidators: true }
  );

  if (!novel) {
    throw new ApiError(404, "Novel not found");
  }

  res.status(200).json({
    status: "success",
    data: novel
  });
});

// Add chapter
export const addChapter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!validateMongoId(id)) {
    throw new ApiError(400, "Invalid novel ID");
  }

  if (!content) {
    throw new ApiError(400, "Chapter content is required");
  }

  const novel = await Novel.findByIdAndUpdate(
    id,
    { $push: { chapters: { content, createdAt: new Date() } } },
    { new: true, runValidators: true }
  );

  if (!novel) {
    throw new ApiError(404, "Novel not found");
  }

  res.status(200).json({
    status: "success",
    data: novel
  });
});