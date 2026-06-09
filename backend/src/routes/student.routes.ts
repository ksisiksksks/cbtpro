import { Router } from 'express';
import { registerStudent, getAllStudents, generateStudentToken, updateStudentStatus, getStudentMe } from '../controllers/student.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerStudent);

// Student routes
router.get('/me', authenticateToken, getStudentMe);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllStudents);
router.post('/:studentId/token', authenticateToken, requireAdmin, generateStudentToken);
router.put('/:studentId/status', authenticateToken, requireAdmin, updateStudentStatus);

export default router;
