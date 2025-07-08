import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl,
    key: supabaseAnonKey ? 'Present' : 'Missing'
  });
  throw new Error(`Missing Supabase environment variables. URL: ${supabaseUrl ? 'Present' : 'Missing'}, Key: ${supabaseAnonKey ? 'Present' : 'Missing'}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          booking_reference: string;
          package_id: number;
          package_title: string;
          base_price: number;
          total_price: number;
          original_price: number | null;
          discount_applied: boolean;
          discount_amount: number;
          selected_options: any[]; // JSON array of selected options
          number_of_people: number;
          payment_status: 'pending' | 'paid' | 'failed' | 'cancelled';
          payment_reference: string | null;
          payment_order: number | null;
          contact_email: string;
          contact_phone: string;
          contact_address: string;
          special_requests: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_reference: string;
          package_id: number;
          package_title: string;
          base_price: number;
          total_price: number;
          original_price?: number | null;
          discount_applied?: boolean;
          discount_amount?: number;
          selected_options?: any[];
          number_of_people: number;
          payment_status?: 'pending' | 'paid' | 'failed' | 'cancelled';
          payment_reference?: string | null;
          payment_order?: number | null;
          contact_email: string;
          contact_phone: string;
          contact_address: string;
          special_requests?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_reference?: string;
          package_id?: number;
          package_title?: string;
          base_price?: number;
          total_price?: number;
          original_price?: number | null;
          discount_applied?: boolean;
          discount_amount?: number;
          selected_options?: any[];
          number_of_people?: number;
          payment_status?: 'pending' | 'paid' | 'failed' | 'cancelled';
          payment_reference?: string | null;
          payment_order?: number | null;
          contact_email?: string;
          contact_phone?: string;
          contact_address?: string;
          special_requests?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      booking_travelers: {
        Row: {
          id: string;
          booking_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          birth_date: string;
          id_number: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          birth_date: string;
          id_number: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          birth_date?: string;
          id_number?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export type BookingTravelerRow = Database['public']['Tables']['booking_travelers']['Row'];
export type BookingTravelerInsert = Database['public']['Tables']['booking_travelers']['Insert'];