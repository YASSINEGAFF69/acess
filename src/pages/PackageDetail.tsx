import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin, Check, ChevronsRight, Star, Percent, AlertTriangle, Loader2 } from 'lucide-react';
import { packages } from '../data/packages';
import { useBooking } from '../contexts/BookingContext';
import { googleSheetsService, type PackageCapacityInfo } from '../services/googleSheetsService';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const packageId = Number(id);
  
  const packageData = packages.find(pkg => pkg.id === packageId);
  
  const { setBookingData } = useBooking();
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('single');
  const [totalPrice, setTotalPrice] = useState(packageData?.price || 0);
  const [capacityInfo, setCapacityInfo] = useState<PackageCapacityInfo | null>(null);
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(true);
  const [capacityError, setCapacityError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Load package capacity info
    if (packageData) {
      loadCapacityInfo();
    }
  }, [packageData]);
  
  useEffect(() => {
    // Calculate total price based on selected tier and options
    if (packageData) {
      let basePrice = packageData.price; // Default to single price
      
      // Get price for selected tier
      if (packageData.pricingTiers && packageData.pricingTiers[selectedTier as keyof typeof packageData.pricingTiers]) {
        basePrice = packageData.pricingTiers[selectedTier as keyof typeof packageData.pricingTiers].discounted;
      }
      
      let total = basePrice;
      selectedOptions.forEach(optionId => {
        const option = packageData.options?.find(opt => opt.id === optionId);
        if (option) {
          total += option.price;
        }
      });
      setTotalPrice(total);
    }
  }, [packageData, selectedOptions, selectedTier]);

  const loadCapacityInfo = async () => {
    if (!packageData) return;
    
    try {
      setIsLoadingCapacity(true);
      setCapacityError(null);
      const info = await googleSheetsService.checkPackageCapacity(packageData.id);
      setCapacityInfo(info);
    } catch (error) {
      console.error('Error loading capacity info:', error);
      setCapacityError('Unable to load availability information');
    } finally {
      setIsLoadingCapacity(false);
    }
  };
  
  if (!packageData) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Package not found</h2>
        <p className="mb-8">The package you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="button-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  const handleOptionToggle = (optionId: number) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };
  
  const handleBookNow = () => {
    // Check if package is available
    if (capacityInfo?.isFull) {
      alert('Sorry, this package is fully booked. Please choose a different package.');
      return;
    }

    // Get the base price for selected tier
    let basePrice = packageData.price;
    if (packageData.pricingTiers && packageData.pricingTiers[selectedTier as keyof typeof packageData.pricingTiers]) {
      basePrice = packageData.pricingTiers[selectedTier as keyof typeof packageData.pricingTiers].discounted;
    }

    // Set booking data in context
    setBookingData({
      packageId: packageData.id,
      packageTitle: packageData.title,
      selectedOptions: selectedOptions.map(optionId => {
        const option = packageData.options?.find(opt => opt.id === optionId);
        return {
          id: optionId,
          title: option?.title || '',
          price: option?.price || 0
        };
      }),
      basePrice,
      totalPrice
    });
    
    // Navigate to booking form
    navigate('/booking');
  };

  const getPackageType = (id: number) => {
    switch (id) {
      case 1: return { name: "PLATINUM PACK", color: "bg-gray-600", description: "Berber tent experience" };
      case 2: return { name: "DIAMOND PACK", color: "bg-blue-600", description: "5-star hotel luxury" };
      case 3: return { name: "VIP PACK", color: "bg-yellow-600", description: "Ultimate resort experience" };
      case 4: return { name: "CITY TOUR", color: "bg-green-600", description: "Cultural immersion experience" };
      default: return { name: "PACKAGE", color: "bg-gray-600", description: "Travel package" };
    }
  };

  const packageType = getPackageType(packageData.id);
  const savings = packageData.originalPrice ? packageData.originalPrice - packageData.price : 0;
  const discountPercent = packageData.originalPrice ? Math.round((savings / packageData.originalPrice) * 100) : 0;
  
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${packageData.imageLarge || packageData.image})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <div className="text-center text-white">
            <motion.div 
              className={`inline-flex items-center gap-2 ${packageType.color} text-white px-4 py-2 rounded-full mb-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Star className="h-5 w-5" />
              <span className="font-bold">{packageType.name}</span>
            </motion.div>
            
            <motion.h1 
              className="font-display text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {packageData.title}
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-200 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {packageType.description}
            </motion.p>

            {discountPercent > 0 && (
              <motion.div 
                className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Percent className="h-4 w-4" />
                <span className="font-bold">{discountPercent}% Early Bird Discount</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Package Info */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="md:w-8/12">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="font-display text-3xl font-bold mb-6 text-gray-800">Overview</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex flex-col items-center justify-center p-4 bg-desert-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <div className="text-gray-600 font-medium">{packageData.duration}</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-desert-50 rounded-lg">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <div className="text-gray-600 font-medium text-center">{packageData.groupSize}</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-desert-50 rounded-lg">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <div className="text-gray-600 font-medium text-center">{packageData.departureTime}</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-desert-50 rounded-lg">
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <div className="text-gray-600 font-medium text-center">{packageData.location}</div>
                </div>
              </div>

              {/* Accommodation Highlight */}
              <div className="mb-8 p-6 bg-gradient-to-r from-desert-100 to-desert-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <h3 className="font-bold text-xl text-gray-800">Accommodation</h3>
                </div>
                <p className="text-gray-700 text-lg">{packageData.accommodation}</p>
              </div>
              
              <h3 className="font-bold text-xl mb-4 text-gray-800">Description</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{packageData.fullDescription || packageData.description}</p>
              
              <h3 className="font-bold text-xl mb-4 text-gray-800">What's Included</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
                {packageData.included.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Itinerary</h3>
                  <div className="mb-8">
                    {packageData.itinerary?.map((day, index) => (
                      <div key={index} className="mb-6">
                        <h4 className="font-bold text-lg text-primary mb-2">Day {index + 1}: {day.title}</h4>
                        <p className="text-gray-700 mb-4">{day.description}</p>
                        
                        {day.activities && day.activities.length > 0 && (
                          <ul className="ml-6 space-y-2">
                            {day.activities?.map((activity, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0"></div>
                                <span className="text-gray-600">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Gallery */}
            {packageData.gallery && packageData.gallery.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="font-display text-3xl font-bold mb-6 text-gray-800">Gallery</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {packageData.gallery.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${packageData.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Booking Sidebar */}
          <div className="md:w-4/12">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-display text-2xl font-bold mb-4 text-gray-800">Book This Package</h3>
              
              {/* Availability Status */}
              {isLoadingCapacity ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-gray-600">Checking availability...</span>
                  </div>
                </div>
              ) : capacityError ? (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-red-700 text-sm">{capacityError}</span>
                  </div>
                </div>
              ) : capacityInfo ? (
                <div className={`mb-6 p-4 rounded-lg ${
                  capacityInfo.isFull 
                    ? 'bg-red-50 border border-red-200' 
                    : capacityInfo.available <= 10 
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {capacityInfo.isFull ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Users className="h-5 w-5 text-primary" />
                    )}
                    <span className={`font-medium ${
                      capacityInfo.isFull 
                        ? 'text-red-700' 
                        : capacityInfo.available <= 10 
                          ? 'text-yellow-700'
                          : 'text-green-700'
                    }`}>
                      {capacityInfo.isFull ? 'Fully Booked' : 'Available Spots'}
                    </span>
                  </div>
                  
                  {!capacityInfo.isFull && (
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between mb-1">
                        <span>Available:</span>
                        <span className="font-medium">{capacityInfo.available} spots</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Capacity:</span>
                        <span className="font-medium">{capacityInfo.capacity} spots</span>
                      </div>
                    </div>
                  )}
                  
                  {capacityInfo.isFull && (
                    <p className="text-red-700 text-sm">
                      This package is currently sold out. Please check back later or choose a different package.
                    </p>
                  )}
                  
                  {capacityInfo.available <= 10 && !capacityInfo.isFull && (
                    <p className="text-yellow-700 text-sm mt-2">
                      ⚡ Only {capacityInfo.available} spots left! Book now to secure your place.
                    </p>
                  )}
                </div>
              ) : null}
              
              {/* Pricing Tiers */}
              {packageData.pricingTiers && !capacityInfo?.isFull && (
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-3 text-gray-800">Select Occupancy</h4>
                  <div className="space-y-2">
                    {Object.entries(packageData.pricingTiers).map(([tier, pricing]) => (
                      <label key={tier} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="tier"
                            value={tier}
                            checked={selectedTier === tier}
                            onChange={(e) => setSelectedTier(e.target.value)}
                            className="mr-3 accent-secondary"
                          />
                          <div>
                            <div className="font-medium capitalize">{tier}</div>
                            <div className="text-sm text-gray-500">
                              <span className="line-through">${pricing.original}</span>
                              <span className="ml-2 text-green-600">Save ${pricing.original - pricing.discounted}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-secondary">${pricing.discounted}</div>
                          <div className="text-xs text-gray-500">USD per person</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Options Selection */}
              {packageData.options && packageData.options.length > 0 && !capacityInfo?.isFull && (
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-3 text-gray-800">Add-on Options</h4>
                  
                  {packageData.options.map(option => (
                    <div key={option.id} className="mb-4 py-3 px-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`option-${option.id}`}
                            checked={selectedOptions.includes(option.id)}
                            onChange={() => handleOptionToggle(option.id)}
                            className="w-4 h-4 rounded accent-secondary mr-3"
                          />
                          <label htmlFor={`option-${option.id}`} className="font-medium cursor-pointer">{option.title}</label>
                        </div>
                        <div className="font-bold text-primary">+${option.price} USD</div>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">{option.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Total Price */}
              {!capacityInfo?.isFull && (
                <div className="mb-6 pb-4 border-t border-b border-gray-200 py-4">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Total Price:</div>
                    <div className="text-2xl font-bold text-secondary">${totalPrice} USD</div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">Per person</div>
                </div>
              )}
              
              <button 
                onClick={handleBookNow}
                disabled={capacityInfo?.isFull}
                className={`w-full flex items-center justify-center gap-2 ${
                  capacityInfo?.isFull 
                    ? 'bg-gray-400 cursor-not-allowed text-white py-3 px-6 rounded-full'
                    : 'button-primary'
                }`}
              >
                {capacityInfo?.isFull ? (
                  <>
                    <AlertTriangle className="h-5 w-5" />
                    <span>Fully Booked</span>
                  </>
                ) : (
                  <>
                    <span>Book Now</span>
                    <ChevronsRight className="h-5 w-5" />
                  </>
                )}
              </button>
              
              {!capacityInfo?.isFull && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  No payment required now. You'll complete payment after reservation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;