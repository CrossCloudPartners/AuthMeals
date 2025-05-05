/*
  # Add communications table

  1. New Types
    - `communication_type` enum: 'email', 'chat', 'support'
    - `communication_status` enum: 'open', 'closed'

  2. New Tables
    - `communications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `type` (communication_type)
      - `subject` (text)
      - `content` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `status` (communication_status)

  3. Security
    - Enable RLS on communications table
    - Add policies for users to read their own communications
*/

-- Create communication type enum
CREATE TYPE communication_type AS ENUM ('email', 'chat', 'support');

-- Create communication status enum
CREATE TYPE communication_status AS ENUM ('open', 'closed');

-- Create communications table
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type communication_type NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status communication_status DEFAULT 'open' NOT NULL
);

-- Enable RLS
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_communications_updated_at
  BEFORE UPDATE ON communications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
CREATE POLICY "Users can read their own communications"
  ON communications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own communications"
  ON communications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own communications"
  ON communications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX communications_user_id_idx ON communications(user_id);
CREATE INDEX communications_created_at_idx ON communications(created_at DESC);