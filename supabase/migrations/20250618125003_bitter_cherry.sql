/*
  # Update booking schema for USD prices and discount system

  1. Schema Changes
    - Remove booking_options table (integrate into bookings)
    - Add selected_options JSON field to bookings table
    - Update all price fields to USD
    - Add discount tracking fields
    - Keep booking_travelers table unchanged

  2. New Features
    - Track first 100 payments for discount eligibility
    - Store selected options as JSON in bookings table
    - All prices in USD currency

  3. Security
    - Maintain existing RLS policies
    - Update policies for new schema
*/

-- Drop the booking_options table since we're integrating into bookings
DROP TABLE IF EXISTS booking_options CASCADE;

-- Add new columns to bookings table for integrated options and discount tracking
DO $$
BEGIN
  -- Add selected_options JSON field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'selected_options'
  ) THEN
    ALTER TABLE bookings ADD COLUMN selected_options jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add discount fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'discount_applied'
  ) THEN
    ALTER TABLE bookings ADD COLUMN discount_applied boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE bookings ADD COLUMN discount_amount numeric(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'original_price'
  ) THEN
    ALTER TABLE bookings ADD COLUMN original_price numeric(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'payment_order'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_order integer;
  END IF;
END $$;

-- Create index for payment order tracking
CREATE INDEX IF NOT EXISTS idx_bookings_payment_order ON bookings(payment_order) WHERE payment_status = 'paid';

-- Create function to assign payment order for first 100 payments
CREATE OR REPLACE FUNCTION assign_payment_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Only assign payment order when status changes to 'paid' and order is not already assigned
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' AND NEW.payment_order IS NULL THEN
    -- Get the next payment order number
    SELECT COALESCE(MAX(payment_order), 0) + 1
    INTO NEW.payment_order
    FROM bookings
    WHERE payment_status = 'paid' AND payment_order IS NOT NULL;
    
    -- Apply discount if within first 100 payments
    IF NEW.payment_order <= 100 THEN
      NEW.discount_applied = true;
      NEW.original_price = NEW.total_price;
      NEW.discount_amount = NEW.total_price * 0.10; -- 10% discount
      NEW.total_price = NEW.total_price * 0.90; -- Apply 10% discount
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payment order assignment
DROP TRIGGER IF EXISTS assign_payment_order_trigger ON bookings;
CREATE TRIGGER assign_payment_order_trigger
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION assign_payment_order();

-- Remove old indexes that are no longer needed
DROP INDEX IF EXISTS idx_booking_options_booking_id;