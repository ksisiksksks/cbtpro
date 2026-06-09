import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// EXAMS CRUD
export const getExams = async (req: Request, res: Response): Promise<any> => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(exams);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createExam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, durationMinutes, startTime, endTime } = req.body;
    const exam = await prisma.exam.create({
      data: { title, description, durationMinutes, startTime, endTime }
    });
    return res.status(201).json(exam);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const cloneExam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params; // The template exam ID
    const { title, description, durationMinutes, startTime, endTime } = req.body;
    
    // Get the template exam and its questions
    const templateQuestions = await prisma.question.findMany({
      where: { examId: parseInt(id as string) }
    });

    // Create the new exam
    const newExam = await prisma.exam.create({
      data: { title, description, durationMinutes, startTime, endTime }
    });

    // Clone the questions
    if (templateQuestions.length > 0) {
      const newQuestionsData = templateQuestions.map((q: any) => ({
        examId: newExam.id,
        text: q.text,
        options: q.options,
        correctOption: q.correctOption
      }));
      await prisma.question.createMany({
        data: newQuestionsData
      });
    }

    return res.status(201).json(newExam);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateExam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, description, durationMinutes, startTime, endTime } = req.body;
    const exam = await prisma.exam.update({
      where: { id: parseInt(id as string) },
      data: { title, description, durationMinutes, startTime, endTime }
    });
    return res.json(exam);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteExam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.exam.delete({ where: { id: parseInt(id as string) } });
    return res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// QUESTIONS CRUD
export const getQuestions = async (req: Request, res: Response): Promise<any> => {
  try {
    const { examId } = req.params;
    const questions = await prisma.question.findMany({
      where: { examId: parseInt(examId as string) },
      orderBy: { id: 'asc' }
    });
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { examId } = req.params;
    const { text, options, correctOption } = req.body;
    const question = await prisma.question.create({
      data: {
        examId: parseInt(examId as string),
        text,
        options,
        correctOption
      }
    });
    return res.status(201).json(question);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { text, options, correctOption } = req.body;
    const question = await prisma.question.update({
      where: { id: parseInt(id as string) },
      data: { text, options, correctOption }
    });
    return res.json(question);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.question.delete({ where: { id: parseInt(id as string) } });
    return res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
