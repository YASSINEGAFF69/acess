/*
  # Create booking management schema

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `booking_reference` (text, unique)
      - `package_id` (integer)
      - `package_title` (text)
      - `base_price` (decimal)
      - `total_price` (decimal)
      - `number_of_people` (integer)
      - `payment_status` (text, enum: pending, paid, failed, cancelled)
      - `payment_reference` (text, nullable)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `contact_address` (text)
      - `special_requests` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `booking_options`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key)
      - `option_id` (integer)
      - `option_title` (text)
      - `option_price` (decimal)
      - `created_at` (timestamp)
    
    - `booking_travelers`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `birth_date` (date)
      - `id_number` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to bookings (for status checking)
    - Add policies for creating new bookings
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL,
  package_id integer NOT NULL,
  package_title text NOT NULL,
  base_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  number_of_people integer NOT NULL DEFAULT 1,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_reference text,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  contact_address text NOT NULL,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create booking_options table
CREATE TABLE IF NOT EXISTS booking_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  option_id integer NOT NULL,
  option_title text NOT NULL,
  option_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create booking_travelers table
CREATE TABLE IF NOT EXISTS booking_travelers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  birth_date date NOT NULL,
  id_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(contact_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_booking_options_booking_id ON booking_options(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_travelers_booking_id ON booking_travelers(booking_id);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_travelers ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings table
CREATE POLICY "Allow public to create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to read bookings by reference"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public to update payment status"
  ON bookings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create policies for booking_options table
CREATE POLICY "Allow public to create booking options"
  ON booking_options
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to read booking options"
  ON booking_options
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for booking_travelers table
CREATE POLICY "Allow public to create booking travelers"
  ON booking_travelers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to read booking travelers"
  ON booking_travelers
  FOR SELECT
  TO anon
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();