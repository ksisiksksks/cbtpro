import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';
import fs from 'fs';
const pdfParse = require('pdf-parse');
import { parseQuestionsFromText } from '../utils/groq';

export const createExamWithPdf = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, durationMinutes } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    // Read PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    
    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    const extractedText = pdfData.text;

    // Call Groq API
    const groqResponse = await parseQuestionsFromText(extractedText);
    const questions = groqResponse.questions || [];

    if (questions.length === 0) {
      return res.status(400).json({ message: 'Failed to extract any questions from the PDF' });
    }

    // Save Exam and Questions to DB
    const newExam = await prisma.exam.create({
      data: {
        title: title || 'New Exam',
        description: description || '',
        durationMinutes: parseInt(durationMinutes) || 60,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: q.options,
            correctOption: q.correctOption,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return res.status(201).json({
      message: 'Exam and questions created successfully',
      exam: newExam,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error during PDF parsing' });
  }
};
export const getLatestExam = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const exam = await prisma.exam.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          select: { id: true, text: true, options: true } // Hide correctOption from student
        }
      }
    });
    if (!exam) return res.status(404).json({ message: 'No active exams found' });
    return res.json(exam);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitExam = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const studentId = req.user?.id; // Actually, the JWT token holds user.id which is userId, not studentId. We need to find the student first.
    const { examId, answers } = req.body; // answers: { [questionId]: 'A' }

    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const studentUser = await prisma.user.findUnique({ where: { id: studentId }, include: { student: true } });
    if (!studentUser || !studentUser.student) return res.status(404).json({ message: 'Student not found' });

    const exam = await prisma.exam.findUnique({ where: { id: examId }, include: { questions: true } });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Calculate score
    let correctCount = 0;
    const totalQuestions = exam.questions.length;

    exam.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    // Save result
    const result = await prisma.examResult.create({
      data: {
        studentId: studentUser.student.id,
        examId: exam.id,
        score
      }
    });

    await prisma.examSession.updateMany({
      where: {
        studentId: studentUser.student.id,
        examId: exam.id
      },
      data: {
        status: 'SUBMITTED'
      }
    });

    return res.json({ message: 'Exam submitted successfully', score: result.score });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const startExam = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const studentId = req.user?.id;
    const { examId } = req.body;
    
    const studentUser = await prisma.user.findUnique({ where: { id: studentId }, include: { student: true } });
    if (!studentUser || !studentUser.student) return res.status(404).json({ message: 'Student not found' });

    const session = await prisma.examSession.upsert({
      where: {
        studentId_examId: {
          studentId: studentUser.student.id,
          examId: Number(examId)
        }
      },
      update: {},
      create: {
        studentId: studentUser.student.id,
        examId: Number(examId),
        status: 'ONGOING'
      }
    });

    return res.json({ message: 'Exam started', session });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const recordCheat = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const studentId = req.user?.id;
    const { examId } = req.body;

    const studentUser = await prisma.user.findUnique({ where: { id: studentId }, include: { student: true } });
    if (!studentUser || !studentUser.student) return res.status(404).json({ message: 'Student not found' });

    const session = await prisma.examSession.update({
      where: {
        studentId_examId: {
          studentId: studentUser.student.id,
          examId: Number(examId)
        }
      },
      data: {
        cheatWarnings: { increment: 1 }
      }
    });

    return res.json({ message: 'Cheat recorded', cheatWarnings: session.cheatWarnings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getExamMonitoring = async (req: Request, res: Response): Promise<any> => {
  try {
    const sessions = await prisma.examSession.findMany({
      include: {
        student: { select: { fullName: true, nisn: true } },
        exam: { select: { title: true, durationMinutes: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const results = await prisma.examResult.findMany({
      where: { examId: Number(id) },
      include: {
        student: { select: { fullName: true, nisn: true } }
      },
      orderBy: { score: 'desc' },
      take: 10
    });
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getAllResults = async (req: Request, res: Response): Promise<any> => {
  try {
    const results = await prisma.examResult.findMany({
      include: {
        student: { select: { fullName: true, nisn: true } },
        exam: { select: { title: true } }
      },
      orderBy: { score: 'desc' }
    });
    
    // get sessions for cheat warnings and recordings
    const sessions = await prisma.examSession.findMany({
      where: { status: 'SUBMITTED' },
      select: { studentId: true, examId: true, cheatWarnings: true, updatedAt: true, recordingUrl: true }
    });

    const mapped = results.map((r: any) => {
      const session = sessions.find((s: any) => s.studentId === r.studentId && s.examId === r.examId);
      return {
        ...r,
        cheatWarnings: session?.cheatWarnings || 0,
        updatedAt: session?.updatedAt || r.createdAt,
        recordingUrl: session?.recordingUrl || null
      };
    });

    return res.json(mapped);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
