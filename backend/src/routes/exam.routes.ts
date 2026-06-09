import { Router } from 'express';
import multer from 'multer';
import { createExamWithPdf, getLatestExam, submitExam, startExam, recordCheat, getExamMonitoring, getLeaderboard, getAllResults } from '../controllers/exam.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const upload = multer({ dest: 'uploads/' });

import { uploadRecording, upload as videoUpload } from '../controllers/monitoring.controller';

// Student Routes
router.get('/latest', authenticateToken, getLatestExam);
router.post('/start', authenticateToken, startExam);
router.post('/cheat', authenticateToken, recordCheat);
router.post('/submit', authenticateToken, submitExam);
router.post('/upload-recording', authenticateToken, videoUpload.single('video'), uploadRecording);

// Public/Student Routes
router.get('/:id/leaderboard', getLeaderboard);

// Protected Admin Routes
router.post('/upload-pdf', authenticateToken, requireAdmin, upload.single('file'), createExamWithPdf);
router.get('/monitoring', authenticateToken, requireAdmin, getExamMonitoring);
router.get('/all-results', authenticateToken, requireAdmin, getAllResults);

export default router;
