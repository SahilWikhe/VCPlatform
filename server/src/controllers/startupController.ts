import { Request, Response } from 'express';
import Startup, { IStartup } from '../models/Startup';
import { UserRole } from '../models/User';

// @desc    Create a startup profile
// @route   POST /api/startups
// @access  Private (Startup role)
export const createStartupProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if user already has a startup profile
    const existingStartup = await Startup.findOne({ userId: req.user._id });

    if (existingStartup) {
      return res.status(400).json({ message: 'Startup profile already exists for this user' });
    }

    // Create startup profile
    const startup = await Startup.create({
      userId: req.user._id,
      ...req.body
    });

    res.status(201).json(startup);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get startup profile by ID
// @route   GET /api/startups/:id
// @access  Public
export const getStartupById = async (req: Request, res: Response) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (startup) {
      res.json(startup);
    } else {
      res.status(404).json({ message: 'Startup not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's startup profile
// @route   GET /api/startups/me
// @access  Private (Startup role)
export const getMyStartupProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const startup = await Startup.findOne({ userId: req.user._id });

    if (startup) {
      res.json(startup);
    } else {
      res.status(404).json({ message: 'Startup profile not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update startup profile
// @route   PUT /api/startups/me
// @access  Private (Startup role)
export const updateStartupProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const startup = await Startup.findOne({ userId: req.user._id });

    if (!startup) {
      return res.status(404).json({ message: 'Startup profile not found' });
    }

    // Update startup profile
    const updatedStartup = await Startup.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedStartup);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all startups with filtering
// @route   GET /api/startups
// @access  Public
export const getStartups = async (req: Request, res: Response) => {
  try {
    const {
      industry,
      location,
      fundingStage,
      page = 1,
      limit = 10
    } = req.query;

    const queryFilter: any = {};

    // Apply filters if provided
    if (industry) {
      queryFilter.industry = { $in: Array.isArray(industry) ? industry : [industry] };
    }

    if (location) {
      queryFilter.location = { $regex: location, $options: 'i' };
    }

    if (fundingStage) {
      queryFilter.fundingStage = fundingStage;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const startups = await Startup.find(queryFilter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Startup.countDocuments(queryFilter);

    res.json({
      startups,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 