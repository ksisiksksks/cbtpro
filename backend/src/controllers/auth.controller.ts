import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Admin Login
export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }

    const isValid = await bcrypt.compare(password, user.password || '');
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Student SPMB Login (Email & Password)
export const studentLoginSpmb = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email }, include: { student: true } });
    if (!user || user.role !== 'STUDENT') {
      return res.status(401).json({ message: 'Email tidak ditemukan' });
    }

    const isValid = await bcrypt.compare(password, user.password || '');
    if (!isValid) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, student: user.student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Student Token Login
export const studentTokenLogin = async (req: Request, res: Response): Promise<any> => {
  const { loginToken } = req.body;
  try {
    if (!loginToken) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const user = await prisma.user.findUnique({
      where: { loginToken },
      include: { student: true }
    });

    if (!user || user.role !== 'STUDENT') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (user.tokenUsed) {
      return res.status(401).json({ message: 'Token has already been used' });
    }

    if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    // Mark token as used
    await prisma.user.update({
      where: { id: user.id },
      data: { tokenUsed: true }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '4h' }); // 4 hours for CBT
    return res.json({ token, student: user.student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin generates token for a student
export const generateStudentToken = async (req: Request, res: Response): Promise<any> => {
  const { studentUserId } = req.body; // ID from User table for that student
  try {
    // Generate a random 6 character alphanumeric token
    const rawToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Valid for 1 day

    const updatedUser = await prisma.user.update({
      where: { id: studentUserId },
      data: {
        loginToken: rawToken,
        tokenUsed: false,
        tokenExpiresAt: expiresAt
      }
    });

    return res.json({ message: 'Token generated', loginToken: updatedUser.loginToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
