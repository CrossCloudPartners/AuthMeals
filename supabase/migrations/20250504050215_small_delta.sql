/*
  # Initial schema setup for AuthMeals platform
  
  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, matches auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text, either 'consumer' or 'vendor')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `meals`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `images` (text array)
      - `cuisine_type` (text array)
      - `preparation_time` (integer)
      - `min_order_quantity` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `dietary_info`
      - `meal_id` (uuid, references meals)
      - `is_vegetarian` (boolean)
      - `is_vegan` (boolean)
      - `is_gluten_free` (boolean)
      - `is_dairy_free` (boolean)
      - `is_nut_free` (boolean)
      - `is_spicy` (boolean)
      - `allergens` (text array)
      - `calories` (integer)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('consumer', 'vendor')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  images text[] NOT NULL DEFAULT '{}',
  cuisine_type text[] NOT NULL DEFAULT '{}',
  preparation_time integer NOT NULL CHECK (preparation_time > 0),
  min_order_quantity integer NOT NULL DEFAULT 1 CHECK (min_order_quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read meals"
  ON meals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can create their own meals"
  ON meals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = vendor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'vendor'
    )
  );

CREATE POLICY "Vendors can update their own meals"
  ON meals
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = vendor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'vendor'
    )
  );

CREATE POLICY "Vendors can delete their own meals"
  ON meals
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = vendor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'vendor'
    )
  );

-- Create dietary_info table
CREATE TABLE IF NOT EXISTS dietary_info (
  meal_id uuid PRIMARY KEY REFERENCES meals ON DELETE CASCADE,
  is_vegetarian boolean NOT NULL DEFAULT false,
  is_vegan boolean NOT NULL DEFAULT false,
  is_gluten_free boolean NOT NULL DEFAULT false,
  is_dairy_free boolean NOT NULL DEFAULT false,
  is_nut_free boolean NOT NULL DEFAULT false,
  is_spicy boolean NOT NULL DEFAULT false,
  allergens text[] NOT NULL DEFAULT '{}',
  calories integer CHECK (calories > 0)
);

ALTER TABLE dietary_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read dietary info"
  ON dietary_info
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can manage dietary info for their meals"
  ON dietary_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meals m
      JOIN profiles p ON p.id = m.vendor_id
      WHERE m.id = dietary_info.meal_id
      AND p.id = auth.uid()
      AND p.role = 'vendor'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();