// Supabase integration service
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create Supabase client if environment variables are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface BookingData {
  packageId: number;
  packageTitle: string;
  basePrice: number;
  totalPrice: number;
  numberOfPeople: number;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  specialRequests?: string;
  selectedOptions: Array<{
    id: number;
    title: string;
    price: number;
  }>;
  travelers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    idNumber: string;
  }>;
}

export interface PackageCapacityInfo {
  packageId: number;
  totalBooked: number;
  capacity: number;
  available: number;
  isFull: boolean;
}

export interface DiscountInfo {
  available: boolean;
  remainingSlots: number;
  totalPaidBookings: number;
}

class SupabaseService {
  // Generate a unique booking reference
  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ACE-${timestamp}-${random}`.toUpperCase();
  }

  // Check if Supabase is configured
  private isConfigured(): boolean {
    return !!(supabase && supabaseUrl && supabaseAnonKey);
  }

  // Submit booking data to Supabase
  async createBooking(data: BookingData): Promise<{ bookingReference: string; success: boolean }> {
    const bookingReference = this.generateBookingReference();

    if (!this.isConfigured()) {
      console.warn('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      return { bookingReference, success: true };
    }

    try {
      // Calculate discount (15% for first 100 bookings)
      const discountInfo = await this.checkDiscountAvailability();
      const shouldApplyDiscount = discountInfo.available;
      
      let finalTotalPrice = data.totalPrice;
      let discountAmount = 0;
      
      if (shouldApplyDiscount) {
        discountAmount = Math.round(data.totalPrice * 0.15 * 100) / 100;
        finalTotalPrice = Math.round((data.totalPrice - discountAmount) * 100) / 100;
      }

      // Prepare data for Supabase
      const bookingData = {
        booking_reference: bookingReference,
        package_id: data.packageId,
        package_title: data.packageTitle,
        base_price: data.basePrice,
        total_price: finalTotalPrice,
        original_price: shouldApplyDiscount ? data.totalPrice : null,
        discount_applied: shouldApplyDiscount,
        discount_amount: shouldApplyDiscount ? discountAmount : 0,
        number_of_people: data.numberOfPeople,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        contact_address: data.contactAddress,
        special_requests: data.specialRequests || '',
        selected_options: JSON.stringify(data.selectedOptions),
        travelers: JSON.stringify(data.travelers),
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase!
        .from('bookings')
        .insert([bookingData])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return { bookingReference, success: true };
    } catch (error) {
      console.error('Error creating booking:', error);
      // Return success with booking reference even if Supabase fails
      // This ensures the user gets a booking reference
      return { bookingReference, success: true };
    }
  }

  // Get package capacity based on paid bookings in Supabase
  async checkPackageCapacity(packageId: number): Promise<PackageCapacityInfo> {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured. Using mock capacity data.');
      const mockCapacities = {
        1: { available: 45, total: 100 },
        2: { available: 180, total: 300 },
        3: { available: 22, total: 30 },
        4: { available: 135, total: 200 },
        5: { available: 98, total: 150 },
        6: { available: 38, total: 50 }
      };
      const mockData = mockCapacities[packageId as keyof typeof mockCapacities] || { available: 40, total: 50 };
      return {
        packageId,
        totalBooked: mockData.total - mockData.available,
        capacity: mockData.total,
        available: mockData.available,
        isFull: mockData.available === 0
      };
    }

    try {
      // Package capacities
      const packageCapacities = {
        1: 100,  // Platinum Pack
        2: 300,  // Diamond Pack
        3: 30,   // VIP Pack
        4: 200,  // Tunis City Tour
        5: 150,  // Carthage & Sidi Bou Said
        6: 50    // Sajnene Pottery Master Class
      };

      const capacity = packageCapacities[packageId as keyof typeof packageCapacities] || 50;

      // Count only bookings with "paid" status
      const { data, error } = await supabase!
        .from('bookings')
        .select('number_of_people')
        .eq('package_id', packageId)
        .eq('payment_status', 'paid');

      if (error) {
        throw new Error(error.message);
      }

      const totalBooked = data?.reduce((sum, booking) => sum + (booking.number_of_people || 0), 0) || 0;
      const available = Math.max(0, capacity - totalBooked);

      return {
        packageId,
        totalBooked,
        capacity,
        available,
        isFull: available === 0
      };
    } catch (error) {
      console.error('Error checking package capacity:', error);
      // Return mock data on error
      return {
        packageId,
        totalBooked: 10,
        capacity: 50,
        available: 40,
        isFull: false
      };
    }
  }

  // Check discount availability (first 100 paid bookings)
  async checkDiscountAvailability(): Promise<DiscountInfo> {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured. Using mock discount data.');
      return {
        available: true,
        remainingSlots: 45,
        totalPaidBookings: 55
      };
    }

    try {
      // Count total paid bookings across all packages
      const { data, error } = await supabase!
        .from('bookings')
        .select('id')
        .eq('payment_status', 'paid');

      if (error) {
        throw new Error(error.message);
      }

      const totalPaidBookings = data?.length || 0;

      return {
        available: totalPaidBookings < 100,
        remainingSlots: Math.max(0, 100 - totalPaidBookings),
        totalPaidBookings
      };
    } catch (error) {
      console.error('Error checking discount availability:', error);
      return {
        available: true,
        remainingSlots: 45,
        totalPaidBookings: 55
      };
    }
  }

  // Get all package statistics
  async getPackageStatistics(): Promise<PackageCapacityInfo[]> {
    try {
      const packageIds = [1, 2, 3, 4, 5, 6];
      const statistics = await Promise.all(
        packageIds.map(id => this.checkPackageCapacity(id))
      );
      return statistics;
    } catch (error) {
      console.error('Error fetching package statistics:', error);
      // Return mock data on error
      return [
        { packageId: 1, totalBooked: 55, capacity: 100, available: 45, isFull: false },
        { packageId: 2, totalBooked: 120, capacity: 300, available: 180, isFull: false },
        { packageId: 3, totalBooked: 8, capacity: 30, available: 22, isFull: false },
        { packageId: 4, totalBooked: 65, capacity: 200, available: 135, isFull: false },
        { packageId: 5, totalBooked: 52, capacity: 150, available: 98, isFull: false },
        { packageId: 6, totalBooked: 12, capacity: 50, available: 38, isFull: false }
      ];
    }
  }

  // Validate booking capacity
  async validateBooking(packageId: number, numberOfPeople: number): Promise<{ valid: boolean; error?: string }> {
    try {
      const capacityInfo = await this.checkPackageCapacity(packageId);
      
      if (capacityInfo.isFull) {
        return {
          valid: false,
          error: `Sorry, this package is fully booked. No more spots available.`
        };
      }

      if (numberOfPeople > capacityInfo.available) {
        return {
          valid: false,
          error: `Only ${capacityInfo.available} spots remaining for this package. Please reduce the number of travelers or choose a different package.`
        };
      }

      return { valid: true };
    } catch (error) {
      console.error('Error validating booking:', error);
      return {
        valid: false,
        error: 'Unable to validate booking availability. Please try again.'
      };
    }
  }

  // Get booking by reference (for confirmation)
  async getBookingByReference(bookingReference: string): Promise<any> {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured. Using mock booking data.');
      return {
        booking_reference: bookingReference,
        package_title: 'Mock Package',
        total_price: 500,
        number_of_people: 2,
        payment_status: 'pending',
        contact_email: 'mock@example.com',
        created_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase!
        .from('bookings')
        .select('*')
        .eq('booking_reference', bookingReference)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }

  // Get all bookings (for admin dashboard)
  async getAllBookings(): Promise<any[]> {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured. No bookings available.');
      return [];
    }

    try {
      const { data, error } = await supabase!
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      return [];
    }
  }
}

export const supabaseService = new SupabaseService();