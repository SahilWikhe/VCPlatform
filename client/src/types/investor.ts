import { FundingStage } from './startup';

export enum InvestorType {
  ANGEL = 'angel',
  VC_FIRM = 'vc-firm',
  CORPORATE = 'corporate',
  ACCELERATOR = 'accelerator',
  FAMILY_OFFICE = 'family-office',
  OTHER = 'other'
}

export interface Investor {
  _id: string;
  userId: string;
  firmName: string;
  logo?: string;
  logoUrl?: string;
  website?: string;
  description: string;
  investorType: InvestorType;
  location: string;
  foundedYear?: number;
  teamSize?: number;
  aum?: number; // Assets under management
  investmentThesis?: string;
  tagline?: string;
  investmentSize?: {
    min: number;
    max: number;
  };
  preferredStages?: FundingStage[];
  industryFocus?: string[];
  industries?: string[];
  investmentStages?: string[];
  investmentSizes?: number[];
  preferredIndustries?: string[];
  portfolio?: {
    name: string;
    website?: string;
    description?: string;
    logo?: string;
  }[];
  team?: {
    name: string;
    role: string;
    title?: string;
    bio?: string;
    photo?: string;
    photoUrl?: string;
  }[];
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