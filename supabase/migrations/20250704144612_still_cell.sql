/*
  # Update booking schema for USD prices and discount system

  1. Schema Changes
    - Add selected_options JSON field to bookings table
    - Add discount tracking fields
    - Add payment order tracking for first 100 payments
    - All prices stored in USD

  2. New Features
    - Track first 100 payments for discount eligibility
    - Store selected options as JSON in bookings table
    - Automatic discount application for early birds

  3. Security
    - Maintain existing RLS policies
*/

-- Add new columns to bookings table for integrated options and discount tracking
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS selected_options jsonb DEFAULT '[]'::jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_applied boolean DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS original_price numeric(10,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_order integer;

-- Create index for payment order tracking
CREATE INDEX IF NOT EXISTS idx_bookings_payment_order ON bookings(payment_order) WHERE payment_status = 'paid';

-- Create function to assign payment order for first 100 payments
CREATE OR REPLACE FUNCTION assign_payment_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Only assign payment order when status changes to 'paid' and order is not already assigned
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') AND NEW.payment_order IS NULL THEN
    -- Get the next payment order number
    SELECT COALESCE(MAX(payment_order), 0) + 1
    INTO NEW.payment_order
    FROM bookings
    WHERE payment_status = 'paid' AND payment_order IS NOT NULL;
    
    -- Apply discount if within first 100 payments
    IF NEW.payment_order <= 100 THEN
      NEW.discount_applied = true;
      NEW.original_price = NEW.total_price;
      NEW.discount_amount = NEW.total_price * NEW.number_of_people * 0.10; -- 10% discount on total
      NEW.total_price = NEW.total_price * 0.90; -- Apply 10% discount to per-person price
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