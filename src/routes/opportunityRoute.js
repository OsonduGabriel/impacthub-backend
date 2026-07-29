import express from 'express';
import * as opportunityController from '../controllers/opportunityController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('NGO-admin'), opportunityController.createOpportunity);
router.get('/', opportunityController.listOpportunities);       // public
router.get('/:id', opportunityController.getOpportunity);       // public
router.put('/:id', protect, authorize('NGO-admin'), opportunityController.updateOpportunity);
router.delete('/:id', protect, authorize('NGO-admin'), opportunityController.deleteOpportunity);
router.patch('/:id/publish', protect, authorize('NGO-admin'), opportunityController.publishOpportunity);
router.patch('/:id/close', protect, authorize('NGO-admin'), opportunityController.closeOpportunity);
router.patch('/:id/archive', protect, authorize('NGO-admin'), opportunityController.archiveOpportunity);
export default router;