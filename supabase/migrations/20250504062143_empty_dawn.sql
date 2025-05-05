/*
  # Create favorites table

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `meal_id` (uuid, references meals)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `favorites` table
    - Add policies for authenticated users to manage their favorites
*/

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  meal_id uuid REFERENCES meals NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, meal_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to add favorites
CREATE POLICY "Users can add favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to remove their own favorites
CREATE POLICY "Users can remove their own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);