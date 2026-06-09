import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAdminStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const totalStudents = await prisma.student.count();
    const verifiedStudents = await prisma.student.count({ where: { status: 'VERIFIED' } });
    const pendingStudents = await prisma.student.count({ where: { status: 'PENDING' } });
    
    const totalExams = await prisma.exam.count();
    const activeSessions = await prisma.examSession.count({ where: { status: 'ONGOING' } });

    return res.json({
      totalStudents,
      verifiedStudents,
      pendingStudents,
      totalExams,
      activeSessions
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const clearDatabaseTable = async (req: Request, res: Response): Promise<any> => {
  const { table } = req.params;
  try {
    if (table === 'results') {
      await prisma.examResult.deleteMany({});
      await prisma.examSession.deleteMany({});
    } else if (table === 'students') {
      await prisma.user.deleteMany({ where: { role: 'STUDENT' }});
    } else if (table === 'exams') {
      await prisma.exam.deleteMany({});
    } else {
      return res.status(400).json({ message: 'Invalid table' });
    }
    return res.json({ message: 'Successfully cleared' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
