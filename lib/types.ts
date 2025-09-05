// User types
export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  savedGigs: string[];
  completedModules: string[];
  purchasedContent: string[];
}

// Gig types
export interface Gig {
  gigId: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  payRate: string;
  vetted: boolean;
  postedDate: string;
  skills: string[];
}

// Skill Guide types
export interface SkillGuide {
  guideId: string;
  title: string;
  content: string;
  skillTag: string;
  price: number;
  isPremium: boolean;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Pitch Template types
export interface PitchTemplate {
  templateId: string;
  title: string;
  content: string;
  skillTag: string;
  category: string;
}

// Component prop types
export interface GigCardProps {
  gig: Gig;
  onSave?: (gigId: string) => void;
  isSaved?: boolean;
}

export interface SkillCardProps {
  guide: SkillGuide;
  onPurchase?: (guideId: string) => void;
  isPurchased?: boolean;
}

export interface FilterOptions {
  category: string;
  payRange: string;
  skills: string[];
}
