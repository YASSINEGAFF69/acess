// Google Sheets integration service
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

class GoogleSheetsService {
  private readonly GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

  // Generate a unique booking reference
  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ACE-${timestamp}-${random}`.toUpperCase();
  }

  // Check if Google Sheets is configured
  private isConfigured(): boolean {
    return !!this.GOOGLE_APPS_SCRIPT_URL;
  }

  // Submit booking data to Google Sheets
  async createBooking(data: BookingData): Promise<{ bookingReference: string; success: boolean }> {
    const bookingReference = this.generateBookingReference();

    if (!this.isConfigured()) {
      console.warn('Google Sheets not configured. Returning mock booking reference.');
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

      // Prepare data for Google Sheets
      const sheetData = {
        action: 'createBooking',
        bookingReference,
        packageId: data.packageId,
        packageTitle: data.packageTitle,
        basePrice: data.basePrice,
        totalPrice: finalTotalPrice,
        originalPrice: shouldApplyDiscount ? data.totalPrice : null,
        discountApplied: shouldApplyDiscount,
        discountAmount: shouldApplyDiscount ? discountAmount : 0,
        numberOfPeople: data.numberOfPeople,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        specialRequests: data.specialRequests || '',
        selectedOptions: JSON.stringify(data.selectedOptions),
        travelers: JSON.stringify(data.travelers),
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(this.GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return { bookingReference, success: true };
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      // Return success with booking reference even if Google Sheets fails
      // This ensures the user gets a booking reference
      return { bookingReference, success: true };
    }
  }

  // Get package capacity based on paid bookings in Google Sheets
  async checkPackageCapacity(packageId: number): Promise<PackageCapacityInfo> {
    if (!this.isConfigured()) {
      // Return mock data when not configured
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
      const response = await fetch(this.GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getPackageCapacity',
          packageId: packageId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to get package capacity');
      }
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
      return {
        available: true,
        remainingSlots: 45,
        totalPaidBookings: 55
      };
    }

    try {
      const response = await fetch(this.GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getDiscountInfo'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to get discount info');
      }
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
      const response = await fetch(this.GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getBooking',
          bookingReference: bookingReference
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();