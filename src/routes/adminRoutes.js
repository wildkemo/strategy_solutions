import express from 'express';
import multer from 'multer';
import isAdmin from '../middleware/isAdmin.js';
import { 
  getAdmins, 
  addAdmin, 
  addService, 
  updateService, 
  deleteService, 
  upload, 
  getAllUsers, 
  deleteUser 
} from '../controllers/adminController.js';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

// Helper to handle multer errors
const handleMulterError = (handler) => (req, res, next) => {
  handler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image size cannot exceed 5MB' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    next();
  });
};

// Admin Management
router.get('/get_admins', isAdmin, getAdmins);
router.post('/add_admin', isAdmin, addAdmin);

// Service Management (Multipart/Form-Data for images with 5MB limit check)
router.post('/add_service', isAdmin, handleMulterError(upload.single('image')), addService);
router.put('/update_services', isAdmin, handleMulterError(upload.single('image')), updateService);
router.delete('/delete_services', isAdmin, deleteService);

// Order Management
router.get('/get_all_orders', isAdmin, getAllOrders);
router.put('/update_order_status', isAdmin, updateOrderStatus);
router.delete('/delete_order', isAdmin, deleteOrder);

// Customer Management
router.get('/get_all_users', isAdmin, getAllUsers);
router.delete('/delete_user', isAdmin, deleteUser);

export default router;
