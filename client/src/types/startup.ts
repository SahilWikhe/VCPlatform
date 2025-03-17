export enum FundingStage {
  IDEA = 'idea',
  PRE_SEED = 'pre-seed',
  SEED = 'seed',
  SERIES_A = 'series-a',
  SERIES_B = 'series-b',
  SERIES_C = 'series-c',
  LATER_STAGE = 'later-stage'
}

export interface Startup {
  _id: string;
  userId: string;
  companyName: string;
  name?: string;
  logo?: string;
  logoUrl?: string;
  website?: string;
  description: string;
  industry: string[] | string;
  location: string;
  foundedYear: number;
  teamSize: number;
  fundingStage: FundingStage;
  fundingAmount?: number;
  fundingGoal?: number;
  pitchDeck?: string;
  pitchDeckUrl?: string;
  video?: string;
  tagline?: string;
  problem?: string;
  solution?: string;
  businessModel?: string;
  stage?: string;
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
  linkedIn?: string;
  twitter?: string;
  createdAt: string;
  updatedAt: string;
} 