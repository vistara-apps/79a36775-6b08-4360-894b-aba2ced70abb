-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farcaster_id TEXT UNIQUE,
  wallet_address TEXT,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gigs table
CREATE TABLE gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  pay_rate TEXT NOT NULL,
  vetted BOOLEAN DEFAULT false,
  posted_date DATE NOT NULL,
  skills TEXT[] DEFAULT '{}',
  embedding VECTOR(1536), -- OpenAI embedding dimension
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skill_guides table
CREATE TABLE skill_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  skill_tag TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  estimated_time TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pitch_templates table
CREATE TABLE pitch_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  skill_tag TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_gigs table (many-to-many relationship)
CREATE TABLE saved_gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, gig_id)
);

-- Create purchased_content table
CREATE TABLE purchased_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES skill_guides(id) ON DELETE CASCADE,
  payment_method TEXT CHECK (payment_method IN ('crypto', 'fiat')) NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

-- Create completed_modules table
CREATE TABLE completed_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES skill_guides(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('gig_match', 'achievement', 'system')) NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_farcaster_id ON users(farcaster_id);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_gigs_category ON gigs(category);
CREATE INDEX idx_gigs_vetted ON gigs(vetted);
CREATE INDEX idx_gigs_posted_date ON gigs(posted_date DESC);
CREATE INDEX idx_gigs_skills ON gigs USING GIN(skills);
CREATE INDEX idx_skill_guides_skill_tag ON skill_guides(skill_tag);
CREATE INDEX idx_skill_guides_is_premium ON skill_guides(is_premium);
CREATE INDEX idx_skill_guides_difficulty ON skill_guides(difficulty);
CREATE INDEX idx_saved_gigs_user_id ON saved_gigs(user_id);
CREATE INDEX idx_purchased_content_user_id ON purchased_content(user_id);
CREATE INDEX idx_completed_modules_user_id ON completed_modules(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create vector similarity search functions
CREATE OR REPLACE FUNCTION match_gigs(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.78,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    gigs.id,
    gigs.title,
    gigs.description,
    1 - (gigs.embedding <=> query_embedding) AS similarity
  FROM gigs
  WHERE gigs.embedding IS NOT NULL
    AND 1 - (gigs.embedding <=> query_embedding) > match_threshold
  ORDER BY gigs.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

CREATE OR REPLACE FUNCTION match_guides(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.78,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    skill_guides.id,
    skill_guides.title,
    skill_guides.content,
    1 - (skill_guides.embedding <=> query_embedding) AS similarity
  FROM skill_guides
  WHERE skill_guides.embedding IS NOT NULL
    AND 1 - (skill_guides.embedding <=> query_embedding) > match_threshold
  ORDER BY skill_guides.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON gigs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_guides_updated_at BEFORE UPDATE ON skill_guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pitch_templates_updated_at BEFORE UPDATE ON pitch_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Gigs and guides are publicly readable
CREATE POLICY "Gigs are publicly readable" ON gigs
  FOR SELECT USING (true);

CREATE POLICY "Skill guides are publicly readable" ON skill_guides
  FOR SELECT USING (true);

CREATE POLICY "Pitch templates are publicly readable" ON pitch_templates
  FOR SELECT USING (true);

-- Users can manage their own saved gigs
CREATE POLICY "Users can manage own saved gigs" ON saved_gigs
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON purchased_content
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can view their own completed modules
CREATE POLICY "Users can view own completed modules" ON completed_modules
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can manage their own notifications
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (auth.uid()::text = user_id::text);
