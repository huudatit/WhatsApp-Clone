import express from 'express';
import { logout, refreshToken, sendOtp, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);

router.post('/verify-otp', verifyOtp);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

export default router;