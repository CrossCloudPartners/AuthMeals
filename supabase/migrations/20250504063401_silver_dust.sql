/*
  # Create orders and related tables

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `status` (order_status enum)
      - `total_amount` (numeric)
      - `delivery_address` (jsonb)
      - `delivery_option` (text)
      - `delivery_fee` (numeric)
      - `requested_delivery_time` (timestamptz)
      - `special_instructions` (text)
      - `payment_status` (payment_status enum)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `meal_id` (uuid, references meals)
      - `quantity` (integer)
      - `price` (numeric)
      - `total_price` (numeric)
      - `created_at` (timestamptz)

  2. Enums
    - `order_status`
    - `payment_status`

  3. Security
    - Enable RLS on all tables
    - Add policies for order access
    - Add policies for order items access

  4. Triggers
    - Add updated_at trigger for orders table
*/

-- Create enums
CREATE TYPE order_status AS ENUM (
  'pending',
  'accepted',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
  'rejected'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'refunded',
  'failed'
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  delivery_address jsonb,
  delivery_option text NOT NULL,
  delivery_fee numeric NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  requested_delivery_time timestamptz,
  special_instructions text,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  meal_id uuid REFERENCES meals(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Create policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create items for their own orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

-- Create updated_at trigger
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();