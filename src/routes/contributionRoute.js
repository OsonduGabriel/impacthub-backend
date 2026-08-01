import express from 'express';
import * as contributionController from '../controllers/contributionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, authorize('volunteer'), contributionController.logContribution);
router.get('/', protect, authorize('NGO-admin'), contributionController.listContributions);
router.patch('/:id/verify', protect, authorize('NGO-admin'), contributionController.verifyContribution);
router.patch('/:id/reject', protect, authorize('NGO-admin'), contributionController.rejectContribution);

export default router;