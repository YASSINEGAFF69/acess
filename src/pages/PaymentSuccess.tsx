import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';
import { CheckCircle, ArrowLeft, Calendar, Users, Mail, Phone } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { bookingData } = useBooking();

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Booking Data Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your booking information.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your booking has been successfully submitted. We'll contact you soon to confirm details and arrange payment.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Details</h2>
            <p className="text-sm text-gray-500">Reference: {bookingData.bookingReference}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Package Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Package Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Package:</span> {bookingData.packageTitle}</p>
                <p><span className="font-medium">Total Price:</span> ${bookingData.totalPrice}</p>
                <p><span className="font-medium">Number of People:</span> {bookingData.numberOfPeople}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {bookingData.contactEmail}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {bookingData.contactPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {bookingData.specialRequests && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Special Requests</h3>
              <p className="text-sm text-gray-600">{bookingData.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Our team will contact you within 24 hours to confirm your booking</li>
            <li>• We'll discuss payment options and finalize all details</li>
            <li>• Once everything is confirmed, you'll receive your complete travel itinerary</li>
            <li>• Keep your booking reference handy: <strong>{bookingData.bookingReference}</strong></li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return Home
          </button>
          <button
            onClick={() => navigate('/packages')}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
          >
            Browse More Packages
          </button>
        </div>
      </div>
    </div>
  );
}