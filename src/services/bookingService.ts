import { supabase } from '../lib/supabase';
import type { BookingInsert, BookingTravelerInsert, BookingRow } from '../lib/supabase';

export interface CreateBookingData {
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

export interface BookingWithDetails extends BookingRow {
  booking_travelers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    birth_date: string;
    id_number: string;
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

class BookingService {
  // Generate a unique booking reference
  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ACE-${timestamp}-${random}`.toUpperCase();
  }

  // Check package capacity - ONLY COUNT PAID BOOKINGS
  async checkPackageCapacity(packageId: number): Promise<PackageCapacityInfo> {
    try {
      // Get package capacity from packages data
      const packageCapacities = {
        1: 100, // Platinum Pack
        2: 300, // Diamond Pack
        3: 30,  // VIP Pack
        4: 200  // Tunis City Tour
      };

      const capacity = packageCapacities[packageId as keyof typeof packageCapacities] || 0;

      // Count total people booked for this package - ONLY PAID BOOKINGS
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('number_of_people')
        .eq('package_id', packageId)
        .eq('payment_status', 'paid'); // ONLY COUNT PAID BOOKINGS

      if (error) {
        throw new Error(`Failed to check package capacity: ${error.message}`);
      }

      const totalBooked = bookings?.reduce((sum, booking) => sum + booking.number_of_people, 0) || 0;
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
      throw error;
    }
  }

  // Check if discount is available (first 100 PAID bookings only)
  async checkDiscountAvailability(): Promise<DiscountInfo> {
    try {
      // Count only PAID bookings with payment_order assigned
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'paid')
        .not('payment_order', 'is', null);

      if (error) {
        console.error('Discount availability error:', error);
        throw new Error(`Failed to check discount availability: ${error.message}`);
      }

      const totalPaidBookings = count || 0;
      
      return {
        available: totalPaidBookings < 100,
        remainingSlots: Math.max(0, 100 - totalPaidBookings),
        totalPaidBookings
      };
    } catch (error) {
      console.error('Error checking discount availability:', error);
      return { available: false, remainingSlots: 0, totalPaidBookings: 0 };
    }
  }

  // Validate booking before creation - CHECK AGAINST PAID BOOKINGS ONLY
  async validateBooking(packageId: number, numberOfPeople: number): Promise<{ valid: boolean; error?: string }> {
    try {
      // Check package capacity (already only counts paid bookings)
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

  // Create a new booking with all related data
  async createBooking(data: CreateBookingData): Promise<{ booking: BookingRow; bookingReference: string }> {
    try {
      // Note: We don't validate capacity here for pending bookings since we only count paid ones
      // This allows multiple people to book simultaneously without blocking each other
      
      const bookingReference = this.generateBookingReference();

      // Check if discount should be applied (based on paid bookings only)
      const discountInfo = await this.checkDiscountAvailability();
      const shouldApplyDiscount = discountInfo.available;

      // Calculate prices with potential discount
      let finalTotalPrice = data.totalPrice;
      let originalPrice = data.totalPrice;
      let discountAmount = 0;

      if (shouldApplyDiscount) {
        discountAmount = Math.round(data.totalPrice * 0.15 * 100) / 100; // 15% discount, rounded to 2 decimals
        finalTotalPrice = Math.round((data.totalPrice - discountAmount) * 100) / 100;
      }

      // Insert the main booking record
      const bookingData: BookingInsert = {
        booking_reference: bookingReference,
        package_id: data.packageId,
        package_title: data.packageTitle,
        base_price: data.basePrice,
        total_price: finalTotalPrice,
        original_price: shouldApplyDiscount ? originalPrice : null,
        discount_applied: shouldApplyDiscount,
        discount_amount: shouldApplyDiscount ? discountAmount : 0,
        selected_options: data.selectedOptions,
        number_of_people: data.numberOfPeople,
        payment_status: 'pending',
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        contact_address: data.contactAddress,
        special_requests: data.specialRequests || null,
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        throw new Error(`Failed to create booking: ${bookingError.message}`);
      }

      // Insert travelers
      const travelersData: BookingTravelerInsert[] = data.travelers.map(traveler => ({
        booking_id: booking.id,
        first_name: traveler.firstName,
        last_name: traveler.lastName,
        email: traveler.email,
        phone: traveler.phone,
        birth_date: traveler.birthDate,
        id_number: traveler.idNumber,
      }));

      const { error: travelersError } = await supabase
        .from('booking_travelers')
        .insert(travelersData);

      if (travelersError) {
        throw new Error(`Failed to create booking travelers: ${travelersError.message}`);
      }

      return { booking, bookingReference };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Get booking by reference with all related data
  async getBookingByReference(bookingReference: string): Promise<BookingWithDetails | null> {
    try {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_travelers (*)
        `)
        .eq('booking_reference', bookingReference)
        .single();

      if (bookingError) {
        if (bookingError.code === 'PGRST116') {
          return null; // Booking not found
        }
        throw new Error(`Failed to fetch booking: ${bookingError.message}`);
      }

      return booking as BookingWithDetails;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  // Update booking payment status
  async updatePaymentStatus(
    bookingReference: string, 
    paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled',
    paymentReference?: string
  ): Promise<BookingRow> {
    try {
      const updateData: any = {
        payment_status: paymentStatus,
      };

      if (paymentReference) {
        updateData.payment_reference = paymentReference;
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('booking_reference', bookingReference)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update payment status: ${error.message}`);
      }

      return booking;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<BookingWithDetails | null> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_travelers (*)
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Booking not found
        }
        throw new Error(`Failed to fetch booking: ${error.message}`);
      }

      return booking as BookingWithDetails;
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  }

  // Get all bookings (for admin purposes)
  async getAllBookings(limit: number = 50, offset: number = 0): Promise<BookingWithDetails[]> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_travelers (*)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
      }

      return bookings as BookingWithDetails[];
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }

  // Get package statistics - ONLY COUNT PAID BOOKINGS
  async getPackageStatistics(): Promise<PackageCapacityInfo[]> {
    try {
      const packageIds = [1, 2, 3];
      const statistics = await Promise.all(
        packageIds.map(id => this.checkPackageCapacity(id))
      );
      return statistics;
    } catch (error) {
      console.error('Error fetching package statistics:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService();