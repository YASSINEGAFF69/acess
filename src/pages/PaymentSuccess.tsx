import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../contexts/BookingContext';
import { packages } from '../data/packages';
import { CheckCircle, ArrowLeft, Calendar, Users, Mail, Phone, MapPin, Star, Package, CreditCard, Clock, AlertCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, bookingPersonsData, currentBookingReference, resetBookingData } = useBooking();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // If no booking data, redirect to home
  if (!bookingData || !bookingPersonsData || !currentBookingReference) {
    return (
      <div className="min-h-screen bg-desert-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Booking Data Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your booking information. Please try booking again.</p>
          <button
            onClick={() => navigate('/')}
            className="button-primary"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const packageData = packages.find(pkg => pkg.id === bookingData.packageId);
  const totalPrice = bookingData.totalPrice * bookingPersonsData.numberOfPeople;

  return (
    <div className="min-h-screen bg-desert-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for choosing ACES Tunisia! Your booking has been successfully submitted. 
              We'll contact you within 24 hours to confirm details and arrange payment.
            </p>
          </motion.div>

          {/* Booking Reference */}
          <motion.div 
            className="bg-secondary text-white rounded-xl p-6 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-lg font-medium mb-2">Your Booking Reference</h2>
            <div className="text-3xl font-bold font-mono tracking-wider">{currentBookingReference}</div>
            <p className="text-orange-100 text-sm mt-2">Please save this reference number for your records</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Package Details */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Package Details</h2>
              </div>

              {packageData && (
                <div className="mb-6">
                  <img 
                    src={packageData.image} 
                    alt={packageData.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{packageData.title}</h3>
                  <p className="text-gray-600 mb-4">{packageData.accommodation}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      <span>{packageData.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      <span>{packageData.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      <span>{bookingPersonsData.numberOfPeople} {bookingPersonsData.numberOfPeople === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      <span>{packageData.departureTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Options */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-3">Selected Options</h4>
                {bookingData.selectedOptions.length > 0 ? (
                  <ul className="space-y-2">
                    {bookingData.selectedOptions.map((option) => (
                      <li key={option.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-700">{option.title}</span>
                        <span className="font-medium text-secondary">${option.price} USD</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No additional options selected</p>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-desert-50 rounded-lg p-4">
                <h4 className="font-bold text-lg mb-3">Pricing Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base price per person:</span>
                    <span>${bookingData.basePrice} USD</span>
                  </div>
                  {bookingData.selectedOptions.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Options per person:</span>
                      <span>${bookingData.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person:</span>
                    <span>${bookingData.totalPrice} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of people:</span>
                    <span>× {bookingPersonsData.numberOfPeople}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                    <span>Total Amount:</span>
                    <span className="text-secondary">${totalPrice} USD</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact & Traveler Information */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Mail className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{bookingPersonsData.contactDetails.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{bookingPersonsData.contactDetails.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{bookingPersonsData.contactDetails.address}</p>
                    </div>
                  </div>

                  {bookingPersonsData.specialRequests && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                      <p className="font-medium">{bookingPersonsData.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Traveler Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Users className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Traveler Information</h2>
                </div>

                <div className="space-y-4">
                  {bookingPersonsData.people.map((person, index) => (
                    <div key={index} className="p-4 bg-desert-50 rounded-lg">
                      <h4 className="font-bold text-lg mb-2">Traveler {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Name: </span>
                          <span className="font-medium">{person.firstName} {person.lastName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email: </span>
                          <span className="font-medium">{person.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone: </span>
                          <span className="font-medium">{person.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Birth Date: </span>
                          <span className="font-medium">{person.birthDate}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-500">ID/Passport: </span>
                          <span className="font-medium">{person.idNumber}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Next Steps */}
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-xl p-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-blue-900">What Happens Next?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5">1</div>
                  <p className="text-blue-800">Our team will contact you within 24 hours via email or phone</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5">2</div>
                  <p className="text-blue-800">We'll confirm all booking details and discuss payment options</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5">3</div>
                  <p className="text-blue-800">Once payment is arranged, you'll receive your complete travel itinerary</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5">4</div>
                  <p className="text-blue-800">Get ready for an unforgettable adventure in Tunisia!</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-blue-900 font-medium">
                <strong>Important:</strong> Keep your booking reference <span className="font-mono bg-white px-2 py-1 rounded">{currentBookingReference}</span> handy for all communications.
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={() => {
                resetBookingData();
                navigate('/');
              }}
              className="flex items-center justify-center gap-2 button-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
              Return Home
            </button>
            
            <button
              onClick={() => {
                resetBookingData();
                navigate('/#packages');
              }}
              className="button-primary"
            >
              Browse More Packages
            </button>
            
            <button
              onClick={() => window.open('mailto:aces.sarl.contact@gmail.com?subject=Booking Inquiry - ' + currentBookingReference)}
              className="flex items-center justify-center gap-2 button-secondary"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;