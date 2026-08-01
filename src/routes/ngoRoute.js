import express from 'express';
import * as ngoController from '../controllers/ngoController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('NGO-admin'), ngoController.registerNGO);
router.get('/', protect, authorize('NGO-admin'), ngoController.getMyNGO);
router.put('/', protect, authorize('NGO-admin'), ngoController.updateMyNGO);
router.post('/verify', protect, authorize('platform-admin'), ngoController.verifyNGO);

export default router;