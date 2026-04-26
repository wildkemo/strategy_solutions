import express from 'express';
import { requestService, verifyOtp, getUserOrders, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/request_service', requestService);
router.post('/verify_otp', verifyOtp);
router.get('/get_user_orders', getUserOrders);
router.delete('/delete_order', deleteOrder); // Note: deleteOrder handles both user and admin logic

export default router;
