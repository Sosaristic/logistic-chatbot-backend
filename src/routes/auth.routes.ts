import { Router } from 'express';
import {
  adminLogin,
  forgotPassword,
  getAdminSession,
  getSession,
  login,
  logout,
  register,
  resetPassword,
  seedDatabase,
  verifyEmail,
} from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/get-session', getSession);
router.post('/admin-login', adminLogin);
router.get('/admin-session', getAdminSession);
router.post('/seed', seedDatabase);

export default router;
