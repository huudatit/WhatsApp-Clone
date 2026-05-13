import express from 'express';
import { logout, refreshToken, sendOtp, verifyOtp, getMe } from '../controllers/authController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp);

router.post('/verify-otp', verifyOtp);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

router.get('/me', protectedRoute, getMe);

export default router;