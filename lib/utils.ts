import { Gig, SkillGuide, User, FilterOptions } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Business Logic Functions

/**
 * Filter gigs based on search query and filter options
 */
export function filterGigs(gigs: Gig[], searchQuery: string, filters: FilterOptions): Gig[] {
  return gigs.filter((gig) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    const matchesCategory = filters.category === 'All' || gig.category === filters.category;

    // Skills filter
    const matchesSkills = filters.skills.length === 0 || 
      filters.skills.some(skill => gig.skills.includes(skill));

    // Pay range filter (if implemented)
    const matchesPayRange = filters.payRange === 'All' || matchesPayRangeLogic(gig.payRate, filters.payRange);

    return matchesSearch && matchesCategory && matchesSkills && matchesPayRange;
  });
}

/**
 * Filter skill guides based on search query and filters
 */
export function filterSkillGuides(guides: SkillGuide[], searchQuery: string, filters?: Partial<FilterOptions>): SkillGuide[] {
  return guides.filter((guide) => {
    const matchesSearch = !searchQuery ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.skillTag.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });
}

/**
 * Check if a gig's pay rate matches the selected pay range filter
 */
function matchesPayRangeLogic(payRate: string, payRangeFilter: string): boolean {
  if (payRangeFilter === 'All') return true;
  
  // Extract numeric values from pay rate string (e.g., "$25-35/hour" -> [25, 35])
  const payNumbers = payRate.match(/\d+/g)?.map(Number) || [];
  if (payNumbers.length === 0) return true;
  
  const minPay = Math.min(...payNumbers);
  const maxPay = Math.max(...payNumbers);
  
  switch (payRangeFilter) {
    case 'Under $20':
      return maxPay < 20;
    case '$20-$40':
      return minPay >= 20 && maxPay <= 40;
    case '$40-$60':
      return minPay >= 40 && maxPay <= 60;
    case 'Over $60':
      return minPay > 60;
    default:
      return true;
  }
}

/**
 * Calculate user engagement score based on activity
 */
export function calculateEngagementScore(user: User): number {
  const savedGigsWeight = 2;
  const completedModulesWeight = 5;
  const purchasedContentWeight = 10;
  
  const score = 
    (user.savedGigs?.length || 0) * savedGigsWeight +
    (user.completedModules?.length || 0) * completedModulesWeight +
    (user.purchasedContent?.length || 0) * purchasedContentWeight;
    
  return Math.min(score, 100); // Cap at 100
}

/**
 * Get recommended gigs for a user based on their activity
 */
export function getRecommendedGigs(gigs: Gig[], user: User, limit: number = 5): Gig[] {
  // Sort gigs by relevance (vetted first, then by date)
  const sortedGigs = gigs
    .filter(gig => gig.vetted)
    .sort((a, b) => {
      // Prioritize vetted gigs
      if (a.vetted && !b.vetted) return -1;
      if (!a.vetted && b.vetted) return 1;
      
      // Then by date (newest first)
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
    
  return sortedGigs.slice(0, limit);
}

/**
 * Get recommended skill guides for a user
 */
export function getRecommendedGuides(guides: SkillGuide[], user: User, limit: number = 3): SkillGuide[] {
  // Filter out already purchased guides
  const availableGuides = guides.filter(guide => 
    !user.purchasedContent?.includes(guide.guideId)
  );
  
  // Prioritize free guides for new users, premium for engaged users
  const engagementScore = calculateEngagementScore(user);
  
  if (engagementScore < 20) {
    // New users - show free guides first
    return availableGuides
      .filter(guide => !guide.isPremium)
      .slice(0, limit);
  } else {
    // Engaged users - mix of free and premium
    const freeGuides = availableGuides.filter(guide => !guide.isPremium);
    const premiumGuides = availableGuides.filter(guide => guide.isPremium);
    
    return [
      ...freeGuides.slice(0, Math.ceil(limit / 2)),
      ...premiumGuides.slice(0, Math.floor(limit / 2))
    ].slice(0, limit);
  }
}

/**
 * Validate payment amount against guide price
 */
export function validatePaymentAmount(guide: SkillGuide, amount: number): boolean {
  return Math.abs(guide.price - amount) < 0.01; // Allow for floating point precision
}

/**
 * Generate user-friendly error messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a unique ID for client-side operations
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Format skill tags for display
 */
export function formatSkillTag(skillTag: string): string {
  return skillTag
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Calculate estimated reading time for content
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  if (minutes < 1) return '< 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

/**
 * Check if a user has access to premium content
 */
export function hasAccessToGuide(guide: SkillGuide, user: User): boolean {
  if (!guide.isPremium) return true;
  return user.purchasedContent?.includes(guide.guideId) || false;
}

/**
 * Get difficulty color for UI display
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-green-600 bg-green-100';
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100';
    case 'advanced':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Sort gigs by relevance score
 */
export function sortGigsByRelevance(gigs: Gig[], userSkills: string[] = []): Gig[] {
  return gigs.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Boost score for vetted gigs
    if (a.vetted) scoreA += 10;
    if (b.vetted) scoreB += 10;
    
    // Boost score for matching skills
    const aMatches = a.skills.filter(skill => userSkills.includes(skill)).length;
    const bMatches = b.skills.filter(skill => userSkills.includes(skill)).length;
    scoreA += aMatches * 5;
    scoreB += bMatches * 5;
    
    // Boost score for recent posts
    const aAge = Date.now() - new Date(a.postedDate).getTime();
    const bAge = Date.now() - new Date(b.postedDate).getTime();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (aAge < dayInMs) scoreA += 3;
    if (bAge < dayInMs) scoreB += 3;
    
    return scoreB - scoreA;
  });
}
