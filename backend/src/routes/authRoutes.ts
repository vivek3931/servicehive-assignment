import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be 6 or more characters'),
    body('role')
      .optional()
      .isIn(['Admin', 'Sales User'])
      .withMessage('Invalid role'),
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  loginUser
);

router.get('/profile', protect, getUserProfile);

export default router;
