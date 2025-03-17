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

// Protected routes
router.post('/', protect, restrictTo(UserRole.STARTUP), createStartupProfile);
router.get('/me', protect, restrictTo(UserRole.STARTUP), getMyStartupProfile);
router.put('/me', protect, restrictTo(UserRole.STARTUP), updateStartupProfile);

// This route must come after the /me routes to prevent "me" from being treated as an ID
router.get('/:id', getStartupById);

export default router; 