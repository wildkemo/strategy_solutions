import express from 'express';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Protect all routes in this router with isAdmin middleware
router.use(isAdmin);

/**
 * Admin Routes (To be implemented)
 * - GET /api/get_admins
 * - POST /api/add_admin
 */

export default router;
