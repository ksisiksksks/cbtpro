import { Router } from 'express';
import { adminLogin, studentTokenLogin, studentLoginSpmb, generateStudentToken } from '../controllers/auth.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/admin/login', adminLogin);
router.post('/student/login-spmb', studentLoginSpmb);
router.post('/student/login-cbt', studentTokenLogin);

// Protected Admin Routes
router.post('/admin/generate-token', authenticateToken, requireAdmin, generateStudentToken);

export default router;
