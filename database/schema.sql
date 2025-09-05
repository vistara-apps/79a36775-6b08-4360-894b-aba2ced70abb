-- GigFlow Database Schema for Supabase
-- This file contains all the necessary tables and configurations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    userId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farcasterId TEXT UNIQUE,
    walletAddress TEXT UNIQUE,
    savedGigs TEXT[] DEFAULT '{}',
    completedModules TEXT[] DEFAULT '{}',
    purchasedContent TEXT[] DEFAULT '{}',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gigs table
CREATE TABLE gigs (
    gigId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL,
    payRate TEXT NOT NULL,
    vetted BOOLEAN DEFAULT FALSE,
    postedDate TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    skills TEXT[] DEFAULT '{}',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Guides table
CREATE TABLE skill_guides (
    guideId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    skillTag TEXT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    isPremium BOOLEAN DEFAULT FALSE,
    estimatedTime TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pitch Templates table
CREATE TABLE pitch_templates (
    templateId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    skillTag TEXT NOT NULL,
    category TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table (for tracking premium content purchases)
CREATE TABLE purchases (
    purchaseId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(userId) ON DELETE CASCADE,
    guideId UUID REFERENCES skill_guides(guideId) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    paymentMethod TEXT CHECK (paymentMethod IN ('crypto', 'fiat')) NOT NULL,
    transactionId TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    purchaseDate TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity table (for tracking user engagement)
CREATE TABLE user_activity (
    activityId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(userId) ON DELETE CASCADE,
    activityType TEXT NOT NULL, -- 'gig_viewed', 'gig_saved', 'guide_viewed', 'guide_purchased', 'pitch_generated'
    entityId UUID, -- ID of the gig, guide, etc.
    metadata JSONB, -- Additional data about the activity
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_farcaster_id ON users(farcasterId);
CREATE INDEX idx_users_wallet_address ON users(walletAddress);
CREATE INDEX idx_gigs_category ON gigs(category);
CREATE INDEX idx_gigs_vetted ON gigs(vetted);
CREATE INDEX idx_gigs_posted_date ON gigs(postedDate DESC);
CREATE INDEX idx_gigs_skills ON gigs USING GIN(skills);
CREATE INDEX idx_skill_guides_skill_tag ON skill_guides(skillTag);
CREATE INDEX idx_skill_guides_premium ON skill_guides(isPremium);
CREATE INDEX idx_skill_guides_difficulty ON skill_guides(difficulty);
CREATE INDEX idx_pitch_templates_skill_tag ON pitch_templates(skillTag);
CREATE INDEX idx_pitch_templates_category ON pitch_templates(category);
CREATE INDEX idx_purchases_user_id ON purchases(userId);
CREATE INDEX idx_purchases_guide_id ON purchases(guideId);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_user_activity_user_id ON user_activity(userId);
CREATE INDEX idx_user_activity_type ON user_activity(activityType);
CREATE INDEX idx_user_activity_created_at ON user_activity(createdAt DESC);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = userId::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = userId::text);

-- Gigs are publicly readable, but only admins can modify
CREATE POLICY "Gigs are publicly readable" ON gigs
    FOR SELECT USING (true);

-- Skill guides are publicly readable, but only admins can modify
CREATE POLICY "Skill guides are publicly readable" ON skill_guides
    FOR SELECT USING (true);

-- Pitch templates are publicly readable, but only admins can modify
CREATE POLICY "Pitch templates are publicly readable" ON pitch_templates
    FOR SELECT USING (true);

-- Users can only access their own purchases
CREATE POLICY "Users can view own purchases" ON purchases
    FOR SELECT USING (auth.uid()::text = userId::text);

-- Users can only access their own activity
CREATE POLICY "Users can view own activity" ON user_activity
    FOR SELECT USING (auth.uid()::text = userId::text);

CREATE POLICY "Users can insert own activity" ON user_activity
    FOR INSERT WITH CHECK (auth.uid()::text = userId::text);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON gigs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_guides_updated_at BEFORE UPDATE ON skill_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pitch_templates_updated_at BEFORE UPDATE ON pitch_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO gigs (title, description, url, source, category, payRate, vetted, skills) VALUES
('Content Writer for Tech Blog', 'Looking for experienced content writers to create engaging blog posts about emerging technologies. Must have strong research skills and ability to explain complex topics simply.', 'https://example.com/gig1', 'Upwork', 'Writing & Content', '$25-35/hour', true, ARRAY['Content Writing', 'SEO', 'Research']),
('Social Media Manager - E-commerce', 'Manage social media accounts for growing e-commerce brand. Create content calendars, engage with followers, and track analytics.', 'https://example.com/gig2', 'Freelancer', 'Digital Marketing', '$20-30/hour', true, ARRAY['Social Media', 'Content Creation', 'Analytics']),
('React Developer - Dashboard Project', 'Build responsive dashboard using React and TypeScript. Experience with data visualization libraries preferred.', 'https://example.com/gig3', 'Fiverr', 'Programming & Tech', '$40-60/hour', true, ARRAY['JavaScript', 'React', 'TypeScript']),
('Virtual Assistant - Administrative Tasks', 'Help with email management, scheduling, and basic administrative tasks. Must be detail-oriented and reliable.', 'https://example.com/gig4', 'Remote.co', 'Virtual Assistant', '$15-20/hour', true, ARRAY['Virtual Assistance', 'Email Management', 'Scheduling']);

INSERT INTO skill_guides (title, content, skillTag, price, isPremium, estimatedTime, difficulty) VALUES
('Getting Started with Content Writing', 'Learn the fundamentals of content writing including research, structure, and SEO optimization. This guide covers everything you need to know to start your content writing journey.', 'Content Writing', 0, false, '2 hours', 'Beginner'),
('Advanced SEO Strategies', 'Master advanced SEO techniques including keyword research, on-page optimization, and link building strategies that actually work in 2024.', 'SEO', 1.99, true, '3 hours', 'Advanced'),
('Social Media Marketing Mastery', 'Complete guide to building and managing successful social media campaigns across all major platforms.', 'Social Media', 2.99, true, '4 hours', 'Intermediate'),
('React Development Fundamentals', 'Learn React from scratch with practical examples and real-world projects. Perfect for beginners looking to break into web development.', 'React', 0, false, '6 hours', 'Beginner');

INSERT INTO pitch_templates (title, content, skillTag, category) VALUES
('Content Writer Pitch', 'Hi! I''m a professional content writer with [X years] of experience creating engaging, SEO-optimized content for [industry/niche]. I specialize in [specific areas] and have helped clients increase their organic traffic by an average of [percentage]. I''d love to discuss how I can help with your content needs.', 'Content Writing', 'Writing & Content'),
('Social Media Manager Pitch', 'Hello! I''m a social media strategist who has managed accounts with [follower count] followers and achieved [specific results]. I create data-driven content strategies that engage audiences and drive conversions. Let''s chat about growing your social media presence!', 'Social Media', 'Digital Marketing'),
('React Developer Pitch', 'Hi there! I''m a React developer with [X years] of experience building scalable web applications. I''ve worked with [technologies] and delivered [types of projects]. I focus on clean code, performance optimization, and user experience. I''d be excited to contribute to your project!', 'React', 'Programming & Tech'),
('Virtual Assistant Pitch', 'Hello! I''m a detail-oriented virtual assistant with expertise in [specific skills]. I''ve helped [number] of clients streamline their operations and save [time/money]. I''m reliable, proactive, and committed to helping you focus on what matters most in your business.', 'Virtual Assistance', 'Virtual Assistant');
