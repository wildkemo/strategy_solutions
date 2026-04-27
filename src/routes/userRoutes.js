import express from 'express';
import { updateUserInfo, deleteAccount } from '../controllers/userController.js';

const router = express.Router();

router.patch('/update_user_info', updateUserInfo);
router.delete('/delete_account', deleteAccount);

export default router;
