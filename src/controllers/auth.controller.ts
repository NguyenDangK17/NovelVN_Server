import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import tokenService from "../services/tokenService";

// Cookie options for refresh token
const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      } else if (userExists.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    // Generate token pair
    const tokenPair = tokenService.generateTokenPair({
      id: newUser.id,
      email: newUser.email
    });

    // Store refresh token in Redis
    await tokenService.storeRefreshToken(newUser.id, tokenPair.refreshToken);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokenPair.refreshToken, refreshTokenCookieOptions);

    res.status(201).json({
      _id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      accessToken: tokenPair.accessToken
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token pair
    const tokenPair = tokenService.generateTokenPair({
      id: user.id,
      email: user.email
    });

    // Store refresh token in Redis
    await tokenService.storeRefreshToken(user.id, tokenPair.refreshToken);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokenPair.refreshToken, refreshTokenCookieOptions);

    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      accessToken: tokenPair.accessToken
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    // Verify refresh token
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if refresh token exists in Redis (only if Redis is available)
    if (tokenService.isRedisAvailable()) {
      const storedToken = await tokenService.getRefreshToken(payload.id);
      if (!storedToken || storedToken !== refreshToken) {
        return res.status(401).json({ message: "Refresh token not found or invalid" });
      }
    }

    // Get user
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate new token pair
    const newTokenPair = tokenService.generateTokenPair({
      id: user.id,
      email: user.email
    });

    // Update refresh token in Redis (only if Redis is available)
    await tokenService.storeRefreshToken(user.id, newTokenPair.refreshToken);

    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', newTokenPair.refreshToken, refreshTokenCookieOptions);

    res.json({
      accessToken: newTokenPair.accessToken
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const payload = tokenService.verifyRefreshToken(refreshToken);
      if (payload) {
        // Remove refresh token from Redis
        await tokenService.removeRefreshToken(payload.id);
      }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', { path: '/' });

    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
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

    const updatedUser = await User.findByIdAndUpdate(
      req.body.user._id,
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
