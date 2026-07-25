import express from 'express';
import * as ngoController from '../controllers/ngoController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('ngo_admin'), ngoController.registerNGO);
router.get('/', protect, authorize('ngo_admin'), ngoController.getMyNGO);
router.put('/', protect, authorize('ngo_admin'), ngoController.updateMyNGO);
router.post('/verify', protect, authorize('platform_admin'), ngoController.verifyNGO);

export default router;