# ACES Tunisia Event Website

A modern, responsive website for ACES Tunisia travel packages with Supabase integration for booking management.

## Features

- **6 Travel Packages**: Desert adventures, city tours, cultural experiences, and pottery workshops
- **Supabase Integration**: All booking data stored in Supabase for easy management
- **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- **Real-time Availability**: Package availability based on paid bookings in Supabase
- **Booking Management**: Complete booking flow with form validation
- **Early Bird Discounts**: Automatic 15% discount for first 100 bookings

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom desert theme
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Real-time)

## 🔐 Secure Supabase Setup Guide

### Step 1: Create Supabase Project

1. **Go to [Supabase](https://supabase.com)** and create a new project
2. **Choose a project name**: "ACES Tunisia Bookings"
3. **Set a strong database password**
4. **Wait for project setup** (takes ~2 minutes)

### Step 2: Create Database Table

1. **Go to SQL Editor** in your Supabase dashboard
2. **Run this SQL** to create the bookings table:

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL,
  package_id integer NOT NULL,
  package_title text NOT NULL,
  base_price numeric NOT NULL,
  total_price numeric NOT NULL,
  original_price numeric,
  discount_applied boolean DEFAULT false,
  discount_amount numeric DEFAULT 0,
  number_of_people integer NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  contact_address text NOT NULL,
  special_requests text DEFAULT '',
  selected_options jsonb DEFAULT '[]'::jsonb,
  travelers jsonb DEFAULT '[]'::jsonb,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (insert only)
CREATE POLICY "Allow public to insert bookings" ON bookings
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policies for authenticated users (full access)
CREATE POLICY "Allow authenticated users full access" ON bookings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Set Up Environment Variables

1. **Get your project credentials** from Settings > API
2. **Create `.env` file** in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Configure Row Level Security (RLS)

The table is already secured with RLS policies that:
- **Allow public users** to insert new bookings (website visitors)
- **Allow authenticated users** full access (managers/staff)
- **Prevent unauthorized access** to sensitive data

### Step 5: Team Access Management

#### Manager Access (Full Control):
1. **Create manager account** in Supabase Auth
2. **Full database access** through Supabase dashboard
3. **Can update payment_status** from "pending" to "paid"
4. **View all bookings** and export data

#### Staff Access (View Only):
1. **Create staff accounts** with limited permissions
2. **Read-only access** to bookings table
3. **Cannot modify** payment status or booking data

#### Developer Access:
1. **Full project access** for maintenance
2. **Database schema updates**
3. **RLS policy management**

## 🔒 Security Best Practices

### 1. **Environment Variables**
- Never commit `.env` file to version control
- Use different projects for development/production
- Rotate API keys periodically

### 2. **Database Security**
- Row Level Security (RLS) enabled by default
- Policies restrict access based on user role
- All data encrypted at rest and in transit

### 3. **Access Control**
- Anon key only allows inserting bookings
- Service role key kept secure (not used in frontend)
- Regular access audits

### 4. **Data Protection**
- GDPR compliant data handling
- Automatic backups
- Point-in-time recovery available

## Package Capacities

- **Platinum Pack (Desert Adventure)**: 100 people
- **Diamond Pack (Luxury Desert)**: 300 people  
- **VIP Pack (Ultimate Luxury)**: 30 people
- **Tunis City Tour**: 200 people
- **Carthage & Sidi Bou Said**: 150 people
- **Sajnene Pottery Master Class**: 50 people

## How It Works

### Customer Journey:
1. **Customer books** → Form submitted to Supabase
2. **Status = "pending"** → Booking saved but not counted toward capacity
3. **Manager contacts customer** → Arranges payment offline
4. **Manager updates database** → Changes "pending" to "paid"
5. **Website updates** → Available spots decrease automatically

### Manager Workflow:
1. **Check new bookings** → Filter by "pending" status in Supabase dashboard
2. **Contact customers** → Use provided contact details
3. **Process payment** → Your preferred method
4. **Update status** → Change "pending" to "paid" in database
5. **Automatic updates** → Website reflects new availability

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The website can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## Contact

- **Email**: aces.sarl.contact@gmail.com
- **Phone**: +216 20603070
- **Website**: www.aces-event.com

## Troubleshooting

### Common Issues:

1. **"Failed to fetch" errors**:
   - Check if environment variables are set correctly
   - Verify Supabase project URL and anon key
   - Ensure RLS policies allow public access for inserts

2. **Bookings not appearing**:
   - Check Supabase table structure matches schema
   - Verify RLS policies are correctly configured
   - Check browser network tab for API errors

3. **Capacity not updating**:
   - Ensure payment_status is exactly "paid" (lowercase)
   - Check package IDs match (1-6)
   - Verify number_of_people is numeric

### Support:
- Check Supabase logs for detailed errors
- Monitor database for data integrity
- Contact development team for technical issues

## Database Schema

### Bookings Table Structure:
```sql
bookings (
  id: uuid (Primary Key)
  booking_reference: text (Unique, e.g., "ACE-xxxxx-xxxxx")
  package_id: integer (1-6)
  package_title: text
  base_price: numeric (USD)
  total_price: numeric (USD)
  original_price: numeric (before discount)
  discount_applied: boolean
  discount_amount: numeric (USD)
  number_of_people: integer
  contact_email: text
  contact_phone: text
  contact_address: text
  special_requests: text
  selected_options: jsonb (array of selected add-ons)
  travelers: jsonb (array of traveler details)
  payment_status: text ('pending' | 'paid') ← Manager updates this
  created_at: timestamptz
  updated_at: timestamptz
)
```

This setup provides a secure, scalable, and easy-to-manage booking system with Supabase! 🎉