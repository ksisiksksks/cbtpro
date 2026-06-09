import { Router } from 'express';
import { getAdminStats, clearDatabaseTable } from '../controllers/admin.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

import { getExams, createExam, updateExam, deleteExam, getQuestions, createQuestion, updateQuestion, deleteQuestion, cloneExam } from '../controllers/admin.exam.controller';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, getAdminStats);
router.delete('/database/clear/:table', authenticateToken, requireAdmin, clearDatabaseTable);

// Exams CRUD
router.get('/exams', authenticateToken, requireAdmin, getExams);
router.post('/exams', authenticateToken, requireAdmin, createExam);
router.post('/exams/clone/:id', authenticateToken, requireAdmin, cloneExam);
router.put('/exams/:id', authenticateToken, requireAdmin, updateExam);
router.delete('/exams/:id', authenticateToken, requireAdmin, deleteExam);

// Questions CRUD
router.get('/exams/:examId/questions', authenticateToken, requireAdmin, getQuestions);
router.post('/exams/:examId/questions', authenticateToken, requireAdmin, createQuestion);
router.put('/questions/:id', authenticateToken, requireAdmin, updateQuestion);
router.delete('/questions/:id', authenticateToken, requireAdmin, deleteQuestion);

export default router;
