import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import bcrypt from 'bcryptjs';

export const registerStudent = async (req: Request, res: Response): Promise<any> => {
  const { fullName, email, password, phone, nisn, address } = req.body;
  try {
    // Basic validation
    if (!fullName || !email || !password || !nisn) {
      return res.status(400).json({ message: 'Full name, email, password, and NISN are required' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check if NISN already exists
    const existingNisn = await prisma.student.findUnique({ where: { nisn } });
    if (existingNisn) {
      return res.status(400).json({ message: 'NISN is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User and Student together
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'STUDENT',
        student: {
          create: {
            fullName,
            nisn,
            phone,
            address,
            status: 'PENDING'
          }
        }
      },
      include: {
        student: true
      }
    });

    return res.status(201).json({
      message: 'Student registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        student: newUser.student
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getAllStudents = async (req: Request, res: Response): Promise<any> => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: { select: { loginToken: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const generateStudentToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const { studentId } = req.params;
    
    // Generate a random 6 char token
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const student = await prisma.student.findUnique({ where: { id: Number(studentId) } });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    await prisma.user.update({
      where: { id: student.userId },
      data: { loginToken: token }
    });
    
    return res.json({ message: 'Token generated successfully', token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateStudentStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { studentId } = req.params;
    const { status } = req.body; // PENDING, VERIFIED, REJECTED
    
    if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const student = await prisma.student.update({
      where: { id: Number(studentId) },
      data: { status }
    });

    return res.json({ message: 'Status updated successfully', student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getStudentMe = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user?.id },
      include: {
        results: {
          include: { exam: { select: { title: true } } }
        }
      }
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    return res.json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
