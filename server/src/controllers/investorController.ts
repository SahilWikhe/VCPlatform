import { Request, Response } from 'express';
import Investor, { IInvestor } from '../models/Investor';
import { UserRole } from '../models/User';

// @desc    Create an investor profile
// @route   POST /api/investors
// @access  Private (Investor role)
export const createInvestorProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if user already has an investor profile
    const existingInvestor = await Investor.findOne({ userId: req.user._id });

    if (existingInvestor) {
      return res.status(400).json({ message: 'Investor profile already exists for this user' });
    }

    // Create investor profile
    const investor = await Investor.create({
      userId: req.user._id,
      ...req.body
    });

    res.status(201).json(investor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get investor profile by ID
// @route   GET /api/investors/:id
// @access  Public
export const getInvestorById = async (req: Request, res: Response) => {
  try {
    const investor = await Investor.findById(req.params.id);

    if (investor) {
      res.json(investor);
    } else {
      res.status(404).json({ message: 'Investor not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's investor profile
// @route   GET /api/investors/me
// @access  Private (Investor role)
export const getMyInvestorProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const investor = await Investor.findOne({ userId: req.user._id });

    if (investor) {
      res.json(investor);
    } else {
      res.status(404).json({ message: 'Investor profile not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update investor profile
// @route   PUT /api/investors/me
// @access  Private (Investor role)
export const updateInvestorProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const investor = await Investor.findOne({ userId: req.user._id });

    if (!investor) {
      return res.status(404).json({ message: 'Investor profile not found' });
    }

    // Update investor profile
    const updatedInvestor = await Investor.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedInvestor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all investors with filtering
// @route   GET /api/investors
// @access  Public
export const getInvestors = async (req: Request, res: Response) => {
  try {
    const {
      investorType,
      preferredIndustries,
      preferredStages,
      location,
      page = 1,
      limit = 10
    } = req.query;

    const queryFilter: any = {};

    // Apply filters if provided
    if (investorType) {
      queryFilter.investorType = investorType;
    }

    if (preferredIndustries) {
      queryFilter.preferredIndustries = { 
        $in: Array.isArray(preferredIndustries) ? preferredIndustries : [preferredIndustries] 
      };
    }

    if (preferredStages) {
      queryFilter.preferredStages = { 
        $in: Array.isArray(preferredStages) ? preferredStages : [preferredStages] 
      };
    }

    if (location) {
      queryFilter.location = { $regex: location, $options: 'i' };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const investors = await Investor.find(queryFilter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Investor.countDocuments(queryFilter);

    res.json({
      investors,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 