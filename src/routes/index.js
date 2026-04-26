import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import orderRoutes from './orderRoutes.js';
import otpRoutes from './otpRoutes.js';

const router = express.Router();

router.use('/api', authRoutes);
router.use('/api', userRoutes);
router.use('/api', adminRoutes);
router.use('/api', serviceRoutes);
router.use('/api', orderRoutes);
router.use('/api', otpRoutes);

export default router;
