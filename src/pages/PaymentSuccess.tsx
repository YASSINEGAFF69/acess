import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Mail, Download, Home, AlertCircle, Clock } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { packages } from '../data/packages';

const PaymentSuccess: React.FC = () => {
  const { bookingData, bookingPersonsData, currentBookingReference, bookingSuccess, resetBookingData } = useBooking();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Reset booking data when component unmounts
  useEffect(() => {
    return () => {
      resetBookingData();
    };
  }, [resetBookingData]);

  // Redirect if no booking data
  if (!bookingData || !bookingPersonsData || !currentBookingReference) {
    return (
      <div className="pt-32 pb-20 bg-desert-50 min-h-screen">
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
                No Booking Found
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                No booking information available. Please start a new booking.
              </p>
              
              <Link to="/" className="button-primary inline-flex items-center gap-2">
                <Home className="h-5 w-5" />
                Return to Home
              </Link>
            </motion.div>
          </div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const packageData = packages.find(pkg => pkg.id === bookingData.packageId);
  const bookingDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric' 
  });

  const totalPrice = bookingData.totalPrice * bookingPersonsData.numberOfPeople;
  
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
              Booking Submitted Successfully!
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              Thank you for booking with ACES Tunisia. We will contact you shortly to confirm payment details.
            </p>

            {/* Payment Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-bold text-blue-800">Next Steps</h3>
              </div>
              <p className="text-blue-700">
                Our team will contact you within 24 hours to arrange payment and confirm all booking details. 
                Your spot is reserved until then.
              </p>
            </motion.div>
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
                <span className="font-bold text-lg">{currentBookingReference}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Date of Booking</span>
                <span className="font-bold">{bookingDate}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Package</span>
                <span className="font-bold">{packageData?.title}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Number of Travelers</span>
                <span className="font-bold">{bookingPersonsData.numberOfPeople}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Primary Contact</span>
                <span className="font-bold">
                  {bookingPersonsData.people[0]?.firstName} {bookingPersonsData.people[0]?.lastName}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Status</span>
                <span className="font-bold text-yellow-600">Pending Payment</span>
              </div>
            </div>

            {/* Price summary */}
            <div className="mb-6 border-t pt-6">
              <h3 className="font-bold text-lg mb-3">Booking Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-secondary">${totalPrice.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            {/* Show selected options if any */}
            {bookingData.selectedOptions && bookingData.selectedOptions.length > 0 && (
              <div className="mb-6 border-t pt-6">
                <h3 className="font-bold text-lg mb-3">Selected Options</h3>
                <ul className="space-y-2">
                  {bookingData.selectedOptions.map((option, index) => (
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
                {bookingPersonsData.people.map((traveler, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium">Traveler {index + 1}</h4>
                    <p className="text-sm text-gray-600">
                      {traveler.firstName} {traveler.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{traveler.email}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 mb-6">
                A confirmation email will be sent to <strong>{bookingPersonsData.contactDetails.email}</strong> once payment is confirmed.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => {
                    // Generate and download a simple receipt
                    const receiptContent = `
ACES Tunisia - Booking Confirmation
==============================

Booking Reference: ${currentBookingReference}
Package: ${packageData?.title}
Total Amount: $${totalPrice.toFixed(2)} USD
Status: Pending Payment
Date: ${bookingDate}

Thank you for choosing ACES Tunisia!
                    `;
                    
                    const blob = new Blob([receiptContent], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ACES-Booking-${currentBookingReference}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                  className="button-secondary flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Receipt
                </button>
                
                <button 
                  onClick={() => {
                    window.open(`mailto:${bookingPersonsData.contactDetails.email}?subject=ACES Tunisia Booking Confirmation - ${currentBookingReference}&body=Your booking has been submitted. Reference: ${currentBookingReference}`);
                  }}
                  className="button-secondary flex items-center justify-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Email Confirmation
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
                  Our team will contact you within 24 hours to arrange payment and confirm all the details of your booking.
                </p>
                <p className="text-gray-700">
                  Please keep your booking reference <strong>{currentBookingReference}</strong> for future correspondence.
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