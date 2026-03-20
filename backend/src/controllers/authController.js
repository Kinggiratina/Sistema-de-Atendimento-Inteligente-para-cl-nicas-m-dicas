import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { JWT_SECRET } from '../config/env.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'patient' } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'E-mail já cadastrado' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  const token = signToken(user);

  return res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = signToken(user);
  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ user: req.user });
});
