import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import tokenService from "../services/tokenService";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.body.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const payload = tokenService.verifyAccessToken(token);
      if (payload) {
        const user = await User.findById(payload.id).select("-password");
        if (user) {
          req.body.user = user;
        }
      }
    } catch (error) {
      // Continue without authentication
    }
  }

  next();
};
