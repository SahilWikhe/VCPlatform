import mongoose, { Document, Schema } from 'mongoose';
import { FundingStage } from './Startup';

export enum InvestorType {
  ANGEL = 'angel',
  VC_FIRM = 'vc-firm',
  CORPORATE = 'corporate',
  ACCELERATOR = 'accelerator',
  FAMILY_OFFICE = 'family-office',
  OTHER = 'other'
}

export interface IInvestor extends Document {
  userId: mongoose.Types.ObjectId;
  firmName: string;
  logo?: string;
  website?: string;
  description: string;
  investorType: InvestorType;
  location: string;
  foundedYear?: number;
  teamSize?: number;
  aum?: number; // Assets under management
  investmentThesis?: string;
  investmentRange?: {
    min?: number;
    max?: number;
  };
  preferredStages?: FundingStage[];
  preferredIndustries?: string[];
  portfolio?: {
    companyName: string;
    website?: string;
    description?: string;
    logo?: string;
  }[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const investorSchema = new Schema<IInvestor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    firmName: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String
    },
    website: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    investorType: {
      type: String,
      enum: Object.values(InvestorType),
      required: true
    },
    location: {
      type: String,
      required: true
    },
    foundedYear: {
      type: Number
    },
    teamSize: {
      type: Number
    },
    aum: {
      type: Number
    },
    investmentThesis: {
      type: String
    },
    investmentRange: {
      min: Number,
      max: Number
    },
    preferredStages: {
      type: [String],
      enum: Object.values(FundingStage)
    },
    preferredIndustries: {
      type: [String]
    },
    portfolio: [
      {
        companyName: {
          type: String,
          required: true
        },
        website: String,
        description: String,
        logo: String
      }
    ],
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IInvestor>('Investor', investorSchema); 