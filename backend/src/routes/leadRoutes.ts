import express from 'express';
import { body } from 'express-validator';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/leadController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router
  .route('/')
  .post(
    protect,
    [
      body('name').notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Please include a valid email'),
      body('source')
        .isIn(['Website', 'Instagram', 'Referral'])
        .withMessage('Invalid source'),
      body('status')
        .optional()
        .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
        .withMessage('Invalid status'),
    ],
    createLead
  )
  .get(protect, getLeads);

router
  .route('/:id')
  .get(protect, getLeadById)
  .put(
    protect,
    [
      body('email').optional().isEmail().withMessage('Please include a valid email'),
      body('source')
        .optional()
        .isIn(['Website', 'Instagram', 'Referral'])
        .withMessage('Invalid source'),
      body('status')
        .optional()
        .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
        .withMessage('Invalid status'),
    ],
    updateLead
  )
  .delete(protect, admin, deleteLead);

export default router;
