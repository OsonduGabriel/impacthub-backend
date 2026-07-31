import express from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, authorize('volunteer'), applicationController.applyForOpportunity);
router.get('/', protect, authorize('NGO-admin'), applicationController.listApplications);
router.patch('/:id/accept', protect, authorize('NGO-admin'), applicationController.acceptApplication);
router.patch('/:id/reject', protect, authorize('NGO-admin'), applicationController.rejectApplication);
router.patch('/:id/withdraw', protect, authorize('volunteer'), applicationController.withdrawApplication);
export default router;