import express from 'express';
import {
  createInvestorProfile,
  getInvestorById,
  getMyInvestorProfile,
  updateInvestorProfile,
  getInvestors
} from '../controllers/investorController';
import { protect, restrictTo } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Public routes
router.get('/', getInvestors);
router.get('/:id', getInvestorById);

// Protected routes
router.post('/', protect, restrictTo(UserRole.INVESTOR), createInvestorProfile);
router.get('/me', protect, restrictTo(UserRole.INVESTOR), getMyInvestorProfile);
router.put('/me', protect, restrictTo(UserRole.INVESTOR), updateInvestorProfile);

export default router; 