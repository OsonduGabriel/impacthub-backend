import express from 'express';
import * as opportunityController from '../controllers/opportunityController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('ngo_admin'), opportunityController.createOpportunity);
router.get('/', opportunityController.listOpportunities);       // public
router.get('/:id', opportunityController.getOpportunity);       // public
router.put('/:id', protect, authorize('ngo_admin'), opportunityController.updateOpportunity);
router.delete('/:id', protect, authorize('ngo_admin'), opportunityController.deleteOpportunity);
router.patch('/:id/publish', protect, authorize('ngo_admin'), opportunityController.publishOpportunity);
router.patch('/:id/close', protect, authorize('ngo_admin'), opportunityController.closeOpportunity);

export default router;