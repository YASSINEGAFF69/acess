import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Mail, Download, Home, AlertCircle, Loader2, Gift } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { bookingService } from '../services/bookingService';
import type { BookingWithDetails } from '../services/bookingService';

const PaymentSuccess: React.FC = () => {
  const { resetBookingData } = useBooking();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get payment reference from URL parameters (Konnect will add this)
  const paymentRef = searchParams.get('payment_ref');
  const status = searchParams.get('status');
  const orderId = searchParams.get('order_id'); // This should be our booking reference
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Load booking details and update payment status
    loadBookingDetails();
  }, []);

  const loadBookingDetails = async () => {
    try {
      setIsLoading(true);
      
      // If we have an order ID (booking reference), load the booking
      if (orderId) {
        const bookingData = await bookingService.getBookingByReference(orderId);
        
        if (bookingData) {
          setBooking(bookingData);
          
          // Update payment status based on URL parameters
          if (status === 'completed' && paymentRef) {
            await bookingService.updatePaymentStatus(orderId, 'paid', paymentRef);
            setBooking(prev => prev ? { ...prev, payment_status: 'paid', payment_reference: paymentRef } : null);
          } else if (status === 'failed') {
            await bookingService.updatePaymentStatus(orderId, 'failed', paymentRef || undefined);
            setBooking(prev => prev ? { ...prev, payment_status: 'failed' } : null);
          } else if (status === 'cancelled') {
            await bookingService.updatePaymentStatus(orderId, 'cancelled', paymentRef || undefined);
            setBooking(prev => prev ? { ...prev, payment_status: 'cancelled' } : null);
          }
        } else {
          setError('Booking not found');
        }
      } else {
        setError('No booking reference provided');
      }
    } catch (err) {
      console.error('Error loading booking details:', err);
      setError('Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset booking data when component unmounts (only on successful payment)
  useEffect(() => {
    if (status === 'completed') {
      return () => {
        resetBookingData();
      };
    }
  }, [resetBookingData, status]);

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-32 pb-20 bg-desert-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="pt-32 pb-20 bg-red-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Error Loading Payment Details
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {error || 'Unable to load booking information.'}
              </p>
              
              <Link to="/" className="button-primary inline-flex items-center gap-2">
                <Home className="h-5 w-5" />
                Return to Home
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle payment failure
  if (status === 'failed' || status === 'cancelled') {
    return (
      <div className="pt-32 pb-20 bg-red-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Payment {status === 'failed' ? 'Failed' : 'Cancelled'}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {status === 'failed' 
                  ? 'There was an issue processing your payment. Your booking is still reserved.'
                  : 'Your payment was cancelled. Your booking is still reserved and you can try again.'
                }
              </p>

              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
                <h3 className="font-bold text-lg mb-4">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-sm">Booking Reference</span>
                    <p className="font-bold">{booking.booking_reference}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Package</span>
                    <p className="font-bold">{booking.package_title}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Total Amount</span>
                    <p className="font-bold text-secondary">${(booking.total_price * booking.number_of_people).toFixed(2)} USD</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Status</span>
                    <p className="font-bold text-red-600">Payment {status === 'failed' ? 'Failed' : 'Cancelled'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/checkout" className="button-primary inline-flex items-center gap-2">
                  Try Payment Again
                </Link>
                <Link to="/" className="button-secondary inline-flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Return to Home
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  
  const bookingDate = new Date(booking.created_at).toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric' 
  });

  // Calculate if discount was applied
  const discountApplied = booking.discount_applied;
  const originalPrice = booking.original_price || booking.total_price;
  const finalPrice = booking.total_price * booking.number_of_people;
  
  return (
    <div className="pt-32 pb-20 bg-desert-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Payment Successful!
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              Thank you for booking with ACES Tunisia. Your adventure awaits!
            </p>

            {/* Discount Success Message */}
            {discountApplied && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-2">
                  <Gift className="h-6 w-6" />
                  <span className="font-bold">
                    🎉 Congratulations! You saved ${booking.discount_amount} USD with our early bird discount!
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-bold text-xl mb-6 text-center text-gray-800">
              Booking Confirmation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Booking Reference</span>
                <span className="font-bold text-lg">{booking.booking_reference}</span>
              </div>
              
              {booking.payment_reference && (
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Payment Reference</span>
                  <span className="font-bold">{booking.payment_reference}</span>
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Date of Booking</span>
                <span className="font-bold">{bookingDate}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Package</span>
                <span className="font-bold">{booking.package_title}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Number of Travelers</span>
                <span className="font-bold">{booking.number_of_people}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Primary Contact</span>
                <span className="font-bold">
                  {booking.booking_travelers[0]?.first_name} {booking.booking_travelers[0]?.last_name}
                </span>
              </div>

              {booking.payment_order && (
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Payment Order</span>
                  <span className="font-bold text-green-600">#{booking.payment_order} of first 100</span>
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Payment Status</span>
                <span className="font-bold text-green-600">Paid</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="mb-6 border-t pt-6">
              <h3 className="font-bold text-lg mb-3">Payment Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {discountApplied ? (
                  <>
                    <div className="flex justify-between mb-2 text-gray-600">
                      <span>Original Price:</span>
                      <span className="line-through">${(originalPrice * booking.number_of_people).toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Early Bird Discount (15%):</span>
                      <span>-${booking.discount_amount} USD</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                      <span>Total Paid:</span>
                      <span className="text-secondary">${finalPrice.toFixed(2)} USD</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Paid:</span>
                    <span className="text-secondary">${finalPrice.toFixed(2)} USD</span>
                  </div>
                )}
              </div>
            </div>

            {/* Show selected options if any */}
            {booking.selected_options && booking.selected_options.length > 0 && (
              <div className="mb-6 border-t pt-6">
                <h3 className="font-bold text-lg mb-3">Selected Options</h3>
                <ul className="space-y-2">
                  {booking.selected_options.map((option: any, index: number) => (
                    <li key={index} className="flex justify-between">
                      <span>{option.title}</span>
                      <span className="font-medium">${option.price} USD</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show travelers */}
            <div className="mb-6 border-t pt-6">
              <h3 className="font-bold text-lg mb-3">Travelers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.booking_travelers.map((traveler, index) => (
                  <div key={traveler.id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium">Traveler {index + 1}</h4>
                    <p className="text-sm text-gray-600">
                      {traveler.first_name} {traveler.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{traveler.email}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 mb-6">
                A confirmation email has been sent to <strong>{booking.contact_email}</strong> with all your booking details.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="button-secondary flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Receipt
                </button>
                
                <button className="button-secondary flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  Resend Email
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="bg-primary/10 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <Calendar className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">What's Next?</h3>
                <p className="text-gray-700 mb-4">
                  Our team will be in touch shortly to confirm all the details of your booking and answer any questions you might have.
                </p>
                <p className="text-gray-700">
                  We recommend adding <strong>aces.sarl.contact@gmail.com</strong> to your contacts to ensure you receive all important communications about your upcoming adventure.
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="text-center mt-12">
            <Link to="/" className="button-primary inline-flex items-center gap-2">
              <Home className="h-5 w-5" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;