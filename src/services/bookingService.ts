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

class BookingService {
  // Generate a unique booking reference
  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ACE-${timestamp}-${random}`.toUpperCase();
  }

  // Check if discount is available (first 100 payments)
  async checkDiscountAvailability(): Promise<{ available: boolean; remainingSlots: number }> {
    try {
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'paid')
        .not('payment_order', 'is', null)
        .lte('payment_order', 100);

      if (error) {
        throw new Error(`Failed to check discount availability: ${error.message}`);
      }

      const paidCount = count || 0;
      return {
        available: paidCount < 100,
        remainingSlots: Math.max(0, 100 - paidCount)
      };
    } catch (error) {
      console.error('Error checking discount availability:', error);
      return { available: false, remainingSlots: 0 };
    }
  }

  // Create a new booking with all related data
  async createBooking(data: CreateBookingData): Promise<{ booking: BookingRow; bookingReference: string }> {
    try {
      const bookingReference = this.generateBookingReference();

      // Insert the main booking record
      const bookingData: BookingInsert = {
        booking_reference: bookingReference,
        package_id: data.packageId,
        package_title: data.packageTitle,
        base_price: data.basePrice,
        total_price: data.totalPrice,
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
}

export const bookingService = new BookingService();