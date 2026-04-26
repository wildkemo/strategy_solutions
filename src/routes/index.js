import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import orderRoutes from './orderRoutes.js';
import otpRoutes from './otpRoutes.js';

const router = express.Router();

// Apply global authentication check for all routes in this router
router.use(checkAuth);

router.use('/api', authRoutes);
router.use('/api', userRoutes);
router.use('/api', adminRoutes);
router.use('/api', serviceRoutes);
router.use('/api', orderRoutes);
router.use('/api/otp', otpRoutes);

export default router;
