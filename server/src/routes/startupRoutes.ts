import express from 'express';
import {
  createStartupProfile,
  getStartupById,
  getMyStartupProfile,
  updateStartupProfile,
  getStartups
} from '../controllers/startupController';
import { protect, restrictTo } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Public routes
router.get('/', getStartups);
router.get('/:id', getStartupById);

// Protected routes
router.post('/', protect, restrictTo(UserRole.STARTUP), createStartupProfile);
router.get('/me', protect, restrictTo(UserRole.STARTUP), getMyStartupProfile);
router.put('/me', protect, restrictTo(UserRole.STARTUP), updateStartupProfile);

export default router; 