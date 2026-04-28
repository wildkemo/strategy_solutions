import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import orderRoutes from './orderRoutes.js';
import otpRoutes from './otpRoutes.js';

const router = express.Router();

/**
 * Route Mounting Strategy:
 * 1. Public Routes: Accessible by anyone, no authentication middleware.
 * 2. Auth Routes: Login/Signup, also public.
 * 3. checkAuth Middleware: Protects everything below it.
 * 4. Protected Routes: Requires a valid access_token.
 * 5. Admin Routes: Inside adminRoutes, specific routes use the isAdmin middleware.
 */

// --- 1. Public Routes ---
// serviceRoutes contains get_services, get_categories, and image/:filename
router.use('/api', serviceRoutes);

// --- 2. Authentication Routes ---
router.use('/api', authRoutes);

// --- 3. Authentication Middleware ---
// From this point down, a valid access_token is required.
router.use(checkAuth);

// --- 4. Protected Routes ---
router.use('/api', userRoutes);
router.use('/api', orderRoutes);
router.use('/api', adminRoutes);
router.use('/api/otp', otpRoutes);

export default router;
