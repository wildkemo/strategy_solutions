import express from 'express';
import { getServices, getCategories, getImage } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/get_services', getServices);
router.get('/get_categories', getCategories);
router.get('/image/:filename', getImage);

export default router;
