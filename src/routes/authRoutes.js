import express from 'express';
import {
  signup,
  login,
  logout,
  session,
  refreshToken,
  getCurrentUser
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/session', session);
router.post('/refresh_token', refreshToken);
router.get('/get_current_user', getCurrentUser);

export default router;
