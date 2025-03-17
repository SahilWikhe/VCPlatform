import mongoose, { Document, Schema } from 'mongoose';

export enum FundingStage {
  IDEA = 'idea',
  PRE_SEED = 'pre-seed',
  SEED = 'seed',
  SERIES_A = 'series-a',
  SERIES_B = 'series-b',
  SERIES_C = 'series-c',
  LATER_STAGE = 'later-stage'
}

export interface IStartup extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  logo?: string;
  website?: string;
  description: string;
  industry: string[];
  location: string;
  foundedYear: number;
  teamSize: number;
  fundingStage: FundingStage;
  fundingGoal?: number;
  pitchDeck?: string;
  video?: string;
  traction: {
    revenue?: number;
    users?: number;
    growth?: number;
    customMetrics?: Record<string, any>;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const startupSchema = new Schema<IStartup>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    companyName: {
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
    industry: {
      type: [String],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    foundedYear: {
      type: Number,
      required: true
    },
    teamSize: {
      type: Number,
      required: true
    },
    fundingStage: {
      type: String,
      enum: Object.values(FundingStage),
      required: true
    },
    fundingGoal: {
      type: Number
    },
    pitchDeck: {
      type: String
    },
    video: {
      type: String
    },
    traction: {
      revenue: Number,
      users: Number,
      growth: Number,
      customMetrics: {
        type: Map,
        of: Schema.Types.Mixed
      }
    },
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

export default mongoose.model<IStartup>('Startup', startupSchema); 