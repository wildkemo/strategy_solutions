import express from 'express';
import { createOtp, validateOtp } from '../controllers/otpController.js';

const router = express.Router();

/**
 * OTP Routes
 * Prefix: /api/otp
 */

router.post('/create', createOtp);
router.post('/validate', validateOtp);

export default router;
