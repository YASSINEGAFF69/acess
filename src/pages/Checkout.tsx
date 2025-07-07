import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, Loader2, AlertCircle, Clock, Gift } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { packages } from '../data/packages';
import { bookingService } from '../services/bookingService';

interface KonnectPaymentRequest {
  receiverWalletId: string;
  token: string;
  amount: number;
  type: string;
  description: string;
  acceptedPaymentMethods: string[];
  lifespan: number;
  checkoutForm: boolean;
  addPaymentFeesToAmount: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  orderId: string;
  webhook: string;
  theme: string;
}

interface KonnectPaymentResponse {
  payUrl: string;
  paymentRef: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, bookingPersonsData, currentBookingReference } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'pending' | 'paid' | 'failed' | 'cancelled'>('pending');
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [discountInfo, setDiscountInfo] = useState<{ available: boolean; remainingSlots: number }>({ available: false, remainingSlots: 0 });
  
  useEffect(() => {
    // Redirect if no booking data is present
    if (!bookingData || !bookingPersonsData || !currentBookingReference) {
      navigate('/');
      return;
    }
    
    // Load booking status and discount info
    loadBookingStatus();
    loadDiscountInfo();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [bookingData, bookingPersonsData, currentBookingReference, navigate]);

  const loadBookingStatus = async () => {
    if (!currentBookingReference) return;

    try {
      setIsLoadingStatus(true);
      const booking = await bookingService.getBookingByReference(currentBookingReference);
      
      if (booking) {
        setBookingStatus(booking.payment_status);
        
        // If already paid, redirect to success page
        if (booking.payment_status === 'paid') {
          navigate('/success');
        }
      }
    } catch (error) {
      console.error('Error loading booking status:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const loadDiscountInfo = async () => {
    try {
      const info = await bookingService.checkDiscountAvailability();
      setDiscountInfo(info);
    } catch (error) {
      console.error('Error loading discount info:', error);
    }
  };
  
  const packageData = bookingData ? packages.find(pkg => pkg.id === bookingData.packageId) : null;
  
  const initializeKonnectPayment = async () => {
    if (!bookingData || !bookingPersonsData || !packageData || !currentBookingReference) {
      setError('Missing booking information');
      return;
    }

    // Check for required environment variables
    const apiKey = import.meta.env.VITE_KONNECT_API_KEY;
    const walletId = import.meta.env.VITE_KONNECT_WALLET_ID;

    if (!apiKey || !walletId) {
      setError('Payment configuration is missing. Please contact support.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Calculate total price in USD cents
      const totalPriceUSD = bookingData.totalPrice * bookingPersonsData.numberOfPeople;
      
      // Apply 15% discount if available (first 100 payments)
      const finalPriceUSD = discountInfo.available ? totalPriceUSD * 0.85 : totalPriceUSD;
      const totalInCents = Math.round(finalPriceUSD * 100);

      // Get primary contact person details
      const primaryContact = bookingPersonsData.people[0];
      
      // Create description with package and features
      const selectedFeatures = bookingData.selectedOptions.length > 0 
        ? bookingData.selectedOptions.map(opt => opt.title).join(', ')
        : 'Standard package features';
      
      const description = `Booking ${currentBookingReference} for ${packageData.title}, Features: ${selectedFeatures}`;

      // Prepare the payment request
      const paymentRequest: KonnectPaymentRequest = {
        receiverWalletId: walletId,
        token: "USD",
        amount: totalInCents,
        type: "immediate",
        description: description,
        acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
        lifespan: 10,
        checkoutForm: true,
        addPaymentFeesToAmount: true,
        firstName: primaryContact.firstName,
        lastName: primaryContact.lastName,
        phoneNumber: primaryContact.phone,
        email: primaryContact.email,
        orderId: currentBookingReference,
        webhook: `${window.location.origin}/api/konnect-webhook`,
        theme: "light"
      };

      // Make the API call to Konnect
      const response = await fetch('https://api.konnect.network/api/v2/payments/init-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(paymentRequest)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Payment initialization failed: ${response.status}`);
      }

      const paymentResponse: KonnectPaymentResponse = await response.json();
      
      if (paymentResponse.payUrl) {
        // Update booking with payment reference
        await bookingService.updatePaymentStatus(
          currentBookingReference,
          'pending',
          paymentResponse.paymentRef
        );

        // Redirect to Konnect payment page
        window.location.href = paymentResponse.payUrl;
      } else {
        throw new Error('No payment URL received from Konnect');
      }

    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize payment. Please try again.');
      
      // Update booking status to failed
      if (currentBookingReference) {
        try {
          await bookingService.updatePaymentStatus(currentBookingReference, 'failed');
        } catch (updateError) {
          console.error('Error updating booking status:', updateError);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!bookingData || !bookingPersonsData || !packageData || !currentBookingReference) {
    return null;
  }

  if (isLoadingStatus) {
    return (
      <div className="pt-24 pb-20 bg-desert-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading booking information...</p>
        </div>
      </div>
    );
  }
  
  // Calculate final total price
  const totalPrice = bookingData.totalPrice * bookingPersonsData.numberOfPeople;
  const finalPrice = discountInfo.available ? totalPrice * 0.85 : totalPrice; // 15% discount for first 100
  
  return (
    <div className="pt-24 pb-20 bg-desert-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-3xl font-bold text-gray-800">Complete Your Payment</h1>
              
              {/* Booking Status Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  bookingStatus === 'pending' ? 'bg-yellow-500' :
                  bookingStatus === 'paid' ? 'bg-green-500' :
                  bookingStatus === 'failed' ? 'bg-red-500' :
                  'bg-gray-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-600">
                  Booking {currentBookingReference} - {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
                </span>
              </div>
            </div>

            {/* Discount Banner */}
            {discountInfo.available && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6"
              >
                <div className="flex items-center gap-3">
                  <Gift className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">🎉 Special Discount Available!</h3>
                    <p className="text-green-100">
                      You're eligible for a 15% discount! Only {discountInfo.remainingSlots} spots left in our first 100 payments promotion.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Booking Summary */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h2 className="font-bold text-xl mb-4 pb-2 border-b border-gray-200 text-gray-800">
                    Booking Summary
                  </h2>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-800">{packageData.title}</h3>
                    <p className="text-sm text-gray-600">Formule {packageData.id}</p>
                    <p className="text-xs text-gray-500 mt-1">Ref: {currentBookingReference}</p>
                  </div>
                  
                  <div className="mb-4 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Package Price:</span>
                      <span>${bookingData.basePrice} USD</span>
                    </div>
                    
                    {bookingData.selectedOptions.length > 0 && (
                      <>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Selected Options:</span>
                          <span>${bookingData.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)} USD</span>
                        </div>
                        
                        <div className="pl-4 text-xs text-gray-500 mb-1">
                          {bookingData.selectedOptions.map((option) => (
                            <div key={option.id} className="flex justify-between">
                              <span>- {option.title}</span>
                              <span>${option.price} USD</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Price per person:</span>
                      <span>${bookingData.totalPrice} USD</span>
                    </div>
                    
                    <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Number of People:</span>
                      <span>x {bookingPersonsData.numberOfPeople}</span>
                    </div>

                    {discountInfo.available && (
                      <>
                        <div className="flex justify-between mb-1 text-gray-500">
                          <span>Subtotal:</span>
                          <span>${totalPrice.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between mb-1 text-green-600">
                          <span>Early Bird Discount (15%):</span>
                          <span>-${(totalPrice * 0.15).toFixed(2)} USD</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span className="text-secondary text-lg">
                        ${finalPrice.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className={`mt-4 p-3 rounded-lg ${
                    bookingStatus === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
                    bookingStatus === 'paid' ? 'bg-green-50 border border-green-200' :
                    bookingStatus === 'failed' ? 'bg-red-50 border border-red-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {bookingStatus === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                      {bookingStatus === 'paid' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {bookingStatus === 'failed' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      <span className={`text-sm font-medium ${
                        bookingStatus === 'pending' ? 'text-yellow-800' :
                        bookingStatus === 'paid' ? 'text-green-800' :
                        bookingStatus === 'failed' ? 'text-red-800' :
                        'text-gray-800'
                      }`}>
                        Payment {bookingStatus === 'pending' ? 'Pending' : bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Section */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h2 className="font-bold text-xl mb-6 flex items-center text-gray-800">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Payment Method
                  </h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Shield className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-800 text-sm">
                        Your payment will be processed securely through Konnect, Tunisia's trusted payment gateway. 
                        All payment information is encrypted and secure. All prices are in USD.
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-800 text-sm font-medium">Payment Error</p>
                          <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show different content based on booking status */}
                  {bookingStatus === 'paid' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-green-800 mb-2">Payment Completed!</h3>
                      <p className="text-green-700 mb-4">Your booking has been confirmed and payment processed successfully.</p>
                      <button 
                        onClick={() => navigate('/success')}
                        className="button-primary"
                      >
                        View Confirmation
                      </button>
                    </div>
                  ) : (
                    /* Payment Form */
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                          <img 
                            src="https://konnect.network/assets/img/logo.png" 
                            alt="Konnect Payment" 
                            className="h-12"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling!.style.display = 'block';
                            }}
                          />
                          <div style={{ display: 'none' }} className="text-2xl font-bold text-primary">
                            Konnect
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                          Secure payment processing with multiple payment options including:
                        </p>
                        
                        <div className="flex justify-center gap-4 mb-6 text-sm text-gray-600">
                          <span className="bg-gray-100 px-3 py-1 rounded-full">💳 Bank Card</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full">💰 e-DINAR</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full">🏦 Wallet</span>
                        </div>
                        
                        <button 
                          onClick={initializeKonnectPayment}
                          disabled={isProcessing || bookingStatus !== 'pending'}
                          className="button-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Pay ${finalPrice.toFixed(2)} USD
                              {discountInfo.available && (
                                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                  15% OFF
                                </span>
                              )}
                            </>
                          )}
                        </button>
                        
                        <p className="text-xs text-gray-500 mt-4">
                          You will be redirected to Konnect's secure payment page to complete your transaction.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="font-bold text-xl mb-4 flex items-center text-gray-800">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    What Happens Next?
                  </h2>
                  
                  <ol className="space-y-4 text-gray-700">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center mr-3 mt-0.5">
                        1
                      </div>
                      <p>You'll be redirected to Konnect's secure payment page to complete your transaction.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center mr-3 mt-0.5">
                        2
                      </div>
                      <p>After successful payment, you'll receive a confirmation email with your booking details.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center mr-3 mt-0.5">
                        3
                      </div>
                      <p>Our team will contact you to confirm all arrangements and provide detailed itinerary information.</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;