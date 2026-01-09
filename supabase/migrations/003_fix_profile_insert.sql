-- Fix profile insert policy for registration
-- Drop existing policy if exists
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policy that allows authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile during registration"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also ensure users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Ensure users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
