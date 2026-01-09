-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin_kader', 'kader', 'ibu');
CREATE TYPE community_member_role AS ENUM ('admin', 'kader', 'member');
CREATE TYPE stunting_status AS ENUM ('normal', 'risiko', 'stunting', 'severe_stunting');
CREATE TYPE relation_type AS ENUM ('ibu', 'ayah', 'wali');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'ibu',
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communities (Posyandu/Puskesmas)
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  schedule_json JSONB, -- {day: 'Rabu', time: '08:00-11:00'}
  contact_phone TEXT,
  banner_url TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community members
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_in_community community_member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, profile_id)
);

-- Children
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  child_code TEXT UNIQUE NOT NULL, -- Internal unique code
  name_alias TEXT NOT NULL, -- Bisa inisial
  date_of_birth DATE NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('L', 'P')), -- L=Laki-laki, P=Perempuan
  mother_height_cm NUMERIC(5,2),
  birth_weight_kg NUMERIC(4,2),
  birth_length_cm NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guardians (link children to parent accounts)
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relation_type relation_type NOT NULL DEFAULT 'ibu',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, profile_id)
);

-- Visits (Growth records)
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  age_months NUMERIC(5,2) NOT NULL,
  height_cm NUMERIC(5,2) NOT NULL,
  weight_kg NUMERIC(4,2) NOT NULL,
  head_circumference_cm NUMERIC(5,2),
  arm_circumference_cm NUMERIC(5,2),
  notes TEXT,
  symptoms_text TEXT,
  exclusive_breastfeeding BOOLEAN,
  sick_frequency INTEGER DEFAULT 0, -- Berapa kali sakit dalam 3 bulan terakhir
  haz_score NUMERIC(5,2), -- Height-for-age z-score
  waz_score NUMERIC(5,2), -- Weight-for-age z-score
  whz_score NUMERIC(5,2), -- Weight-for-height z-score
  stunting_status stunting_status,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immunizations
CREATE TABLE immunizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  vaccine_type TEXT NOT NULL, -- BCG, Hepatitis B, Polio, DPT, Campak, dll
  date_administered DATE NOT NULL,
  status TEXT DEFAULT 'completed', -- completed, scheduled, missed
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nutrition logs
CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  meals_per_day INTEGER,
  animal_protein_per_week INTEGER, -- Berapa kali makan protein hewani per minggu
  veg_fruit_freq INTEGER, -- Frekuensi sayur/buah per hari
  iron_sources TEXT[], -- ['telur', 'hati', 'bayam']
  water_intake_ml INTEGER,
  snacks_freq INTEGER,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts (Community feed)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education contents
CREATE TABLE education_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- 'gizi', 'sanitasi', 'imunisasi', 'pola_asuh'
  title TEXT NOT NULL,
  content_md TEXT NOT NULL,
  reading_time INTEGER, -- in minutes
  tags TEXT[],
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress (gamification)
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES education_contents(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, content_id)
);

-- WHO Growth tables
CREATE TABLE who_growth_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator TEXT NOT NULL, -- 'height_for_age', 'weight_for_age', 'weight_for_height'
  sex TEXT NOT NULL CHECK (sex IN ('L', 'P')),
  age_months INTEGER, -- For age-based indicators
  height_cm NUMERIC(5,2), -- For height-based indicators
  z_minus3 NUMERIC(6,2),
  z_minus2 NUMERIC(6,2),
  z_minus1 NUMERIC(6,2),
  z0 NUMERIC(6,2),
  z_plus1 NUMERIC(6,2),
  z_plus2 NUMERIC(6,2),
  z_plus3 NUMERIC(6,2),
  UNIQUE(indicator, sex, age_months, height_cm)
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  entity TEXT NOT NULL, -- 'visit', 'child', 'community'
  entity_id UUID,
  before_json JSONB,
  after_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_community_members_community ON community_members(community_id);
CREATE INDEX idx_community_members_profile ON community_members(profile_id);
CREATE INDEX idx_children_community ON children(community_id);
CREATE INDEX idx_guardians_child ON guardians(child_id);
CREATE INDEX idx_guardians_profile ON guardians(profile_id);
CREATE INDEX idx_visits_child ON visits(child_id);
CREATE INDEX idx_visits_date ON visits(visit_date DESC);
CREATE INDEX idx_posts_community ON posts(community_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_who_growth_lookup ON who_growth_tables(indicator, sex, age_months);

-- Function to generate invite code
CREATE OR REPLACE FUNCTION generate_invite_code() RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM communities WHERE invite_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invite code
CREATE OR REPLACE FUNCTION set_invite_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER communities_invite_code
  BEFORE INSERT ON communities
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_code();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER visits_updated_at BEFORE UPDATE ON visits FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER education_contents_updated_at BEFORE UPDATE ON education_contents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
