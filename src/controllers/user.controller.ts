import User from '../models/user.model';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, avatar, role, tag, status } = req.body;
    const user = new User({ username, email, password, avatar, role, tag, status });
    await user.save();
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // Don't allow password update here
    const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted', user });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
}; 