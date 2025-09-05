import { Gig, SkillGuide, PitchTemplate } from './types';

export const mockGigs: Gig[] = [
  {
    gigId: '1',
    title: 'Content Writer for Tech Blog',
    description: 'Looking for experienced content writers to create engaging blog posts about emerging technologies. Must have strong research skills and ability to explain complex topics simply.',
    url: 'https://example.com/gig1',
    source: 'Upwork',
    category: 'Writing & Content',
    payRate: '$25-35/hour',
    vetted: true,
    postedDate: '2024-01-15',
    skills: ['Content Writing', 'SEO', 'Research']
  },
  {
    gigId: '2',
    title: 'Social Media Manager - E-commerce',
    description: 'Manage social media accounts for growing e-commerce brand. Create content calendars, engage with followers, and track analytics.',
    url: 'https://example.com/gig2',
    source: 'Freelancer',
    category: 'Digital Marketing',
    payRate: '$20-30/hour',
    vetted: true,
    postedDate: '2024-01-14',
    skills: ['Social Media', 'Content Creation', 'Analytics']
  },
  {
    gigId: '3',
    title: 'React Developer - Dashboard Project',
    description: 'Build responsive dashboard using React and TypeScript. Experience with data visualization libraries preferred.',
    url: 'https://example.com/gig3',
    source: 'Fiverr',
    category: 'Programming & Tech',
    payRate: '$40-60/hour',
    vetted: true,
    postedDate: '2024-01-13',
    skills: ['JavaScript', 'React', 'TypeScript']
  },
  {
    gigId: '4',
    title: 'Virtual Assistant - Administrative Tasks',
    description: 'Help with email management, scheduling, and basic administrative tasks. Must be detail-oriented and reliable.',
    url: 'https://example.com/gig4',
    source: 'Remote.co',
    category: 'Virtual Assistant',
    payRate: '$15-20/hour',
    vetted: true,
    postedDate: '2024-01-12',
    skills: ['Virtual Assistance', 'Email Management', 'Scheduling']
  },
  {
    gigId: '5',
    title: 'Logo Design for Startup',
    description: 'Create modern, minimalist logo for tech startup. Must provide multiple concepts and revisions.',
    url: 'https://example.com/gig5',
    source: '99designs',
    category: 'Design & Creative',
    payRate: '$200-500 fixed',
    vetted: true,
    postedDate: '2024-01-11',
    skills: ['Graphic Design', 'Logo Design', 'Branding']
  }
];

export const mockSkillGuides: SkillGuide[] = [
  {
    guideId: '1',
    title: 'Freelance Writing Fundamentals',
    content: 'Learn the basics of freelance writing, from finding clients to pricing your services.',
    skillTag: 'Content Writing',
    price: 0,
    isPremium: false,
    estimatedTime: '30 min',
    difficulty: 'Beginner'
  },
  {
    guideId: '2',
    title: 'Advanced SEO Content Strategy',
    content: 'Master SEO content creation with advanced techniques for ranking and engagement.',
    skillTag: 'SEO',
    price: 1.99,
    isPremium: true,
    estimatedTime: '45 min',
    difficulty: 'Advanced'
  },
  {
    guideId: '3',
    title: 'Social Media Growth Hacks',
    content: 'Proven strategies to grow social media accounts and increase engagement rates.',
    skillTag: 'Social Media',
    price: 0.99,
    isPremium: true,
    estimatedTime: '25 min',
    difficulty: 'Intermediate'
  },
  {
    guideId: '4',
    title: 'JavaScript for Beginners',
    content: 'Start your programming journey with JavaScript fundamentals and practical projects.',
    skillTag: 'JavaScript',
    price: 0,
    isPremium: false,
    estimatedTime: '60 min',
    difficulty: 'Beginner'
  },
  {
    guideId: '5',
    title: 'Virtual Assistant Mastery',
    content: 'Complete guide to becoming a successful virtual assistant and landing high-paying clients.',
    skillTag: 'Virtual Assistance',
    price: 1.50,
    isPremium: true,
    estimatedTime: '40 min',
    difficulty: 'Intermediate'
  }
];

export const mockPitchTemplates: PitchTemplate[] = [
  {
    templateId: '1',
    title: 'Content Writer Pitch',
    content: 'Hi! I\'m a professional content writer with [X] years of experience in [industry]. I specialize in creating engaging, SEO-optimized content that drives traffic and conversions. I\'d love to help you with [specific project details].',
    skillTag: 'Content Writing',
    category: 'Writing & Content'
  },
  {
    templateId: '2',
    title: 'Web Developer Pitch',
    content: 'Hello! I\'m a full-stack developer with expertise in [technologies]. I\'ve successfully completed [number] similar projects and can deliver high-quality, responsive websites. Let me help bring your vision to life.',
    skillTag: 'Web Development',
    category: 'Programming & Tech'
  },
  {
    templateId: '3',
    title: 'Social Media Manager Pitch',
    content: 'Hi there! I\'m a social media strategist who has helped [number] businesses grow their online presence. I can create engaging content, manage your accounts, and provide detailed analytics to track growth.',
    skillTag: 'Social Media',
    category: 'Digital Marketing'
  }
];
