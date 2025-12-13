import express from 'express';
import {
  register,
  login,
  logout,
  requestPasswordReset,
  resetPassword,

  // PHONE CONTROLLERS (MISSING IMPORT FIXED)
  requestPasswordResetByPhone,
  verifyPhoneOtp,
  resetPasswordByPhone

} from '../controllers/authControllers.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.post('/logout', verifyToken, logout);

/* ================= PHONE OTP ROUTES ================= */

router.post('/forgot-password-phone', requestPasswordResetByPhone);
router.post('/verify-phone-otp', verifyPhoneOtp);
router.post('/reset-password-phone', resetPasswordByPhone);

export default router;
