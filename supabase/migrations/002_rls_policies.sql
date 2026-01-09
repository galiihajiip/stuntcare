-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE who_growth_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Communities policies
CREATE POLICY "Anyone can view communities they are member of"
  ON communities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = communities.id
      AND community_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Kader can create communities"
  ON communities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('kader', 'admin_kader')
    )
  );

CREATE POLICY "Community admins can update their community"
  ON communities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = communities.id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community = 'admin'
    )
  );

-- Community members policies
CREATE POLICY "Members can view members in their communities"
  ON community_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.community_id = community_members.community_id
      AND cm.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can join communities"
  ON community_members FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins can manage community members"
  ON community_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.community_id = community_members.community_id
      AND cm.profile_id = auth.uid()
      AND cm.role_in_community = 'admin'
    )
  );

-- Children policies
CREATE POLICY "Community members can view children in their community"
  ON children FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = children.community_id
      AND community_members.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM guardians
      WHERE guardians.child_id = children.id
      AND guardians.profile_id = auth.uid()
    )
  );

CREATE POLICY "Kader can create children in their community"
  ON children FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = children.community_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

CREATE POLICY "Kader can update children in their community"
  ON children FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = children.community_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

-- Guardians policies
CREATE POLICY "Users can view guardians of children they have access to"
  ON guardians FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = guardians.child_id
      AND community_members.profile_id = auth.uid()
    )
    OR guardians.profile_id = auth.uid()
  );

CREATE POLICY "Kader can create guardian relationships"
  ON guardians FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = guardians.child_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

-- Visits policies
CREATE POLICY "Users can view visits of children they have access to"
  ON visits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = visits.child_id
      AND community_members.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM guardians
      WHERE guardians.child_id = visits.child_id
      AND guardians.profile_id = auth.uid()
    )
  );

CREATE POLICY "Kader can create visits"
  ON visits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = visits.child_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

CREATE POLICY "Kader can update visits"
  ON visits FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = visits.child_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

-- Immunizations policies (similar to visits)
CREATE POLICY "Users can view immunizations of children they have access to"
  ON immunizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = immunizations.child_id
      AND community_members.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM guardians
      WHERE guardians.child_id = immunizations.child_id
      AND guardians.profile_id = auth.uid()
    )
  );

CREATE POLICY "Kader can manage immunizations"
  ON immunizations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = immunizations.child_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

-- Nutrition logs policies
CREATE POLICY "Users can view nutrition logs of children they have access to"
  ON nutrition_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = nutrition_logs.child_id
      AND community_members.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM guardians
      WHERE guardians.child_id = nutrition_logs.child_id
      AND guardians.profile_id = auth.uid()
    )
  );

CREATE POLICY "Guardians and kader can create nutrition logs"
  ON nutrition_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM guardians
      WHERE guardians.child_id = nutrition_logs.child_id
      AND guardians.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM children
      JOIN community_members ON community_members.community_id = children.community_id
      WHERE children.id = nutrition_logs.child_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

-- Posts policies
CREATE POLICY "Community members can view posts in their communities"
  ON posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = posts.community_id
      AND community_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Community members can create posts"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = posts.community_id
      AND community_members.profile_id = auth.uid()
    )
    AND author_id = auth.uid()
  );

CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors and admins can delete posts"
  ON posts FOR DELETE
  USING (
    author_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = posts.community_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community = 'admin'
    )
  );

-- Comments policies
CREATE POLICY "Users can view comments on posts they can see"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      JOIN community_members ON community_members.community_id = posts.community_id
      WHERE posts.id = comments.post_id
      AND community_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Community members can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      JOIN community_members ON community_members.community_id = posts.community_id
      WHERE posts.id = comments.post_id
      AND community_members.profile_id = auth.uid()
    )
    AND author_id = auth.uid()
  );

CREATE POLICY "Authors can update own comments"
  ON comments FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete own comments"
  ON comments FOR DELETE
  USING (author_id = auth.uid());

-- Announcements policies
CREATE POLICY "Community members can view announcements"
  ON announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = announcements.community_id
      AND community_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Kader can manage announcements"
  ON announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = announcements.community_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

-- Events policies (similar to announcements)
CREATE POLICY "Community members can view events"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = events.community_id
      AND community_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Kader can manage events"
  ON events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = events.community_id
      AND community_members.profile_id = auth.uid()
      AND community_members.role_in_community IN ('admin', 'kader')
    )
  );

-- Education contents policies
CREATE POLICY "Anyone authenticated can view education contents"
  ON education_contents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kader can manage education contents"
  ON education_contents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin_kader', 'kader')
    )
  );

-- User progress policies
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- WHO growth tables policies
CREATE POLICY "Anyone authenticated can view WHO tables"
  ON who_growth_tables FOR SELECT
  TO authenticated
  USING (true);

-- Audit logs policies
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin_kader'
    )
  );
