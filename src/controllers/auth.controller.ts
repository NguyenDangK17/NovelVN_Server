import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import cloudinary from "../config/cloudinary";
import fs from "fs";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ _id: newUser.id, username: newUser.username, email: newUser.email, token: generateToken(newUser.id) });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ _id: user.id, username: user.username, email: user.email, avatar: user.avatar, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      resource_type: "image"
    });

    fs.unlinkSync(req.file.path);

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
