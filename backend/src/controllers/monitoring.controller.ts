import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../utils/prisma';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/recordings');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: examId_studentId_timestamp.webm
    const { examId, studentId } = req.body;
    const timestamp = Date.now();
    cb(null, `${examId}_${studentId}_${timestamp}${path.extname(file.originalname || '.webm')}`);
  }
});

export const upload = multer({ storage });

export const uploadRecording = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No recording file uploaded' });
    }

    const { examId, studentId } = req.body;

    if (!examId || !studentId) {
      return res.status(400).json({ message: 'examId and studentId are required' });
    }

    const recordingUrl = `/uploads/recordings/${req.file.filename}`;

    // Update the ExamSession with the recording URL
    await prisma.examSession.update({
      where: {
        studentId_examId: {
          studentId: parseInt(studentId),
          examId: parseInt(examId)
        }
      },
      data: {
        recordingUrl
      }
    });

    return res.json({ message: 'Recording uploaded successfully', recordingUrl });
  } catch (error) {
    console.error('Error uploading recording:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
