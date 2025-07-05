import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Check, ChevronRight, User, Mail, Phone, Calendar, MapPin, Users, AlertCircle, Loader2 } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { packages } from '../data/packages';
import { bookingService } from '../services/bookingService';

interface PersonForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  idNumber: string;
}

interface BookingFormData {
  numberOfPeople: number;
  contactDetails: {
    email: string;
    phone: string;
    address: string;
  };
  specialRequests: string;
  people: PersonForm[];
}

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, setBookingPersonsData, setCurrentBookingReference } = useBooking();
  const [currentStep, setCurrentStep] = useState(1);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<BookingFormData>({
    defaultValues: {
      numberOfPeople: 1,
      people: [{ firstName: '', lastName: '', email: '', phone: '', birthDate: '', idNumber: '' }],
      contactDetails: { email: '', phone: '', address: '' },
      specialRequests: ''
    }
  });
  
  // Redirect if no booking data is present
  useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [bookingData, navigate]);
  
  const packageData = bookingData ? packages.find(pkg => pkg.id === bookingData.packageId) : null;

  // Watch the form values
  const watchNumberOfPeople = watch('numberOfPeople');
  // Update people array when number of people changes
  useEffect(() => {
    if (watchNumberOfPeople !== numberOfPeople) {
      setNumberOfPeople(watchNumberOfPeople || 1);
    }
  }, [watchNumberOfPeople, numberOfPeople]);

  const handleNextStep = async () => {
    // Validate current step
    let fieldsToValidate: string[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['numberOfPeople', 'contactDetails.email', 'contactDetails.phone', 'contactDetails.address'];
    } else if (currentStep === 2) {
      // Validate fields for all people
      for (let i = 0; i < numberOfPeople; i++) {
        fieldsToValidate.push(
          `people.${i}.firstName`,
          `people.${i}.lastName`,
          `people.${i}.email`,
          `people.${i}.phone`,
          `people.${i}.birthDate`,
          `people.${i}.idNumber`
        );
      }
    }
    
    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!bookingData || !packageData) {
      setSubmitError('Booking data is missing. Please start over.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create booking in Supabase
      const bookingCreateData = {
        packageId: bookingData.packageId,
        packageTitle: bookingData.packageTitle,
        basePrice: bookingData.basePrice,
        totalPrice: bookingData.totalPrice,
        numberOfPeople: data.numberOfPeople,
        contactEmail: data.contactDetails.email,
        contactPhone: data.contactDetails.phone,
        contactAddress: data.contactDetails.address,
        specialRequests: data.specialRequests,
        selectedOptions: bookingData.selectedOptions,
        travelers: data.people.slice(0, data.numberOfPeople)
      };

      const { booking, bookingReference } = await bookingService.createBooking(bookingCreateData);

      // Set booking persons data in context
      setBookingPersonsData({
        numberOfPeople: data.numberOfPeople,
        contactDetails: data.contactDetails,
        specialRequests: data.specialRequests,
        people: data.people.slice(0, data.numberOfPeople)
      });

      // Set current booking reference
      setCurrentBookingReference(bookingReference);

      // Navigate to payment page
      navigate('/checkout');
    } catch (error) {
      console.error('Error creating booking:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData || !packageData) {
    return null;
  }

  // Calculate total price with number of people
  const totalPrice = bookingData.totalPrice * numberOfPeople;

  return (
    <div className="pt-24 pb-20 bg-desert-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Steps Progress */}
          <div className="mb-12">
            <div className="step-indicator">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step} 
                  className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                >
                  <div className="step-circle">
                    {currentStep > step ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step
                    )}
                  </div>
                  <div className="step-text">
                    {step === 1 && 'Contact Information'}
                    {step === 2 && 'Traveler Details'}
                    {step === 3 && 'Review & Confirm'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 text-sm font-medium">Booking Error</p>
                  <p className="text-red-700 text-sm mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}
          
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h1 className="font-display text-3xl font-bold mb-6 text-gray-800">Contact Information</h1>
                  
                  <div className="mb-6">
                    <h2 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Number of Travelers
                    </h2>
                    
                    <div className="flex items-center border border-gray-300 rounded-lg p-1 w-40">
                      <button 
                        type="button"
                        onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="flex-1 text-center border-none p-2 focus:outline-none focus:ring-0"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
                        {...register('numberOfPeople', { 
                          required: 'Required',
                          min: { value: 1, message: 'At least 1 traveler required' },
                          max: { value: 10, message: 'Maximum 10 travelers allowed' }
                        })}
                      />
                      <button 
                        type="button"
                        onClick={() => setNumberOfPeople(Math.min(10, numberOfPeople + 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        +
                      </button>
                    </div>
                    {errors.numberOfPeople && (
                      <p className="text-red-500 text-sm mt-1">{errors.numberOfPeople.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                      <Mail className="h-5 w-5 mr-2 text-primary" />
                      Contact Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className={`input-field ${errors.contactDetails?.email ? 'border-red-500' : ''}`}
                          placeholder="your@email.com"
                          {...register('contactDetails.email', { 
                            required: 'Email is required',
                            pattern: { 
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                        />
                        {errors.contactDetails?.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactDetails.email.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          className={`input-field ${errors.contactDetails?.phone ? 'border-red-500' : ''}`}
                          placeholder="+216 XX XXX XXX"
                          {...register('contactDetails.phone', { 
                            required: 'Phone number is required'
                          })}
                        />
                        {errors.contactDetails?.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactDetails.phone.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input
                        type="text"
                        id="address"
                        className={`input-field ${errors.contactDetails?.address ? 'border-red-500' : ''}`}
                        placeholder="Your address"
                        {...register('contactDetails.address', { 
                          required: 'Address is required'
                        })}
                      />
                      {errors.contactDetails?.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactDetails.address.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                      <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                      Special Requests (Optional)
                    </h2>
                    
                    <textarea
                      id="specialRequests"
                      rows={4}
                      className="input-field"
                      placeholder="Any special requirements or requests?"
                      {...register('specialRequests')}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={handleNextStep}
                      className="button-primary flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Traveler Details */}
              {currentStep === 2 && (
                <div>
                  <h1 className="font-display text-3xl font-bold mb-6 text-gray-800">Traveler Details</h1>
                  
                  {Array.from({ length: numberOfPeople }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-8 mb-6">
                      <h2 className="font-bold text-xl mb-6 flex items-center text-gray-800">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        Traveler {index + 1}
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`firstName-${index}`} className="form-label">First Name</label>
                          <input
                            type="text"
                            id={`firstName-${index}`}
                            className={`input-field ${errors.people?.[index]?.firstName ? 'border-red-500' : ''}`}
                            {...register(`people.${index}.firstName` as const, { 
                              required: 'First name is required'
                            })}
                          />
                          {errors.people?.[index]?.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.people[index]?.firstName?.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor={`lastName-${index}`} className="form-label">Last Name</label>
                          <input
                            type="text"
                            id={`lastName-${index}`}
                            className={`input-field ${errors.people?.[index]?.lastName ? 'border-red-500' : ''}`}
                            {...register(`people.${index}.lastName` as const, { 
                              required: 'Last name is required'
                            })}
                          />
                          {errors.people?.[index]?.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.people[index]?.lastName?.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor={`email-${index}`} className="form-label">Email</label>
                          <input
                            type="email"
                            id={`email-${index}`}
                            className={`input-field ${errors.people?.[index]?.email ? 'border-red-500' : ''}`}
                            {...register(`people.${index}.email` as const, { 
                              required: 'Email is required',
                              pattern: { 
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                          />
                          {errors.people?.[index]?.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.people[index]?.email?.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor={`phone-${index}`} className="form-label">Phone</label>
                          <input
                            type="tel"
                            id={`phone-${index}`}
                            className={`input-field ${errors.people?.[index]?.phone ? 'border-red-500' : ''}`}
                            {...register(`people.${index}.phone` as const, { 
                              required: 'Phone number is required'
                            })}
                          />
                          {errors.people?.[index]?.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.people[index]?.phone?.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor={`birthDate-${index}`} className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            id={`birthDate-${index}`}
                            className={`input-field ${errors.people?.[index]?.birthDate ? 'border-red-500' : ''}`}
                            {...register(`people.${index}.birthDate` as const, { 
                              required: 'Date of birth is required'
                            })}
                          />
                          {errors.people?.[index]?.birthDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.people[index]?.birthDate?.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor={`idNumber-${index}`} className="form-label">ID/Passport Number</label>
                          <input
                            type="text"
                            id={`idNumber-${index}`}
                            className={`input-field ${errors.people?.[index]?.idNumber ? 'border-red-500' : ''}`}
                            {...register(`people.${index}.idNumber` as const, { 
                              required: 'ID/Passport number is required'
                            })}
                          />
                          {errors.people?.[index]?.idNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.people[index]?.idNumber?.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={handlePreviousStep}
                      className="button-secondary"
                    >
                      Back
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextStep}
                      className="button-primary flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <div>
                  <h1 className="font-display text-3xl font-bold mb-6 text-gray-800">Review Your Booking</h1>
                  
                  <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="font-bold text-xl mb-6 border-b pb-4 text-gray-800">Package Details</h2>
                    
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="md:w-1/3">
                        <img 
                          src={packageData.image} 
                          alt={packageData.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="md:w-2/3">
                        <h3 className="font-bold text-xl mb-2 text-gray-800">{packageData.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{packageData.accommodation}</p>
                        
                        <div className="mb-4 flex flex-wrap gap-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-primary" />
                            <span>{packageData.duration}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1 text-primary" />
                            <span>{watchNumberOfPeople} {watchNumberOfPeople === 1 ? 'person' : 'people'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1 text-primary" />
                            <span>{packageData.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Selected Options</h3>
                    {bookingData.selectedOptions.length > 0 ? (
                      <ul className="mb-6">
                        {bookingData.selectedOptions.map((option) => (
                          <li key={option.id} className="flex justify-between py-2 border-b border-gray-100">
                            <span>{option.title}</span>
                            <span className="font-medium">${option.price} USD</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 mb-6">No additional options selected.</p>
                    )}
                    
                    <div className="bg-desert-50 rounded-lg p-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Base Price per person:</span>
                        <span>${bookingData.basePrice} USD</span>
                      </div>
                      
                      {bookingData.selectedOptions.length > 0 && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Options per person:</span>
                          <span>
                            ${bookingData.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)} USD
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per person:</span>
                        <span>${bookingData.totalPrice} USD</span>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Number of People:</span>
                        <span>x {watchNumberOfPeople}</span>
                      </div>
                      
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                        <span>Total:</span>
                        <span className="text-secondary">${totalPrice} USD</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="font-bold text-xl mb-6 border-b pb-4 text-gray-800">Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="font-medium text-gray-600 mb-1">Email:</h3>
                        <p>{watch('contactDetails.email')}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-600 mb-1">Phone:</h3>
                        <p>{watch('contactDetails.phone')}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h3 className="font-medium text-gray-600 mb-1">Address:</h3>
                        <p>{watch('contactDetails.address')}</p>
                      </div>
                    </div>
                    
                    {watch('specialRequests') && (
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-600 mb-1">Special Requests:</h3>
                        <p>{watch('specialRequests')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="font-bold text-xl mb-6 border-b pb-4 text-gray-800">Terms & Conditions</h2>
                    
                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">
                        By proceeding to payment, you agree to our terms and conditions, including our cancellation policy
                        and privacy policy. All prices are in USD.
                      </p>
                      
                      <div className="flex items-start mb-2">
                        <input
                          type="checkbox"
                          id="termsAccepted"
                          className="w-4 h-4 mt-1 accent-secondary mr-3"
                          required
                        />
                        <label htmlFor="termsAccepted" className="text-gray-700">
                          I accept the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and 
                          <a href="#" className="text-primary hover:underline"> Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={handlePreviousStep}
                      className="button-secondary"
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Creating Booking...
                        </>
                      ) : (
                        <>
                          Proceed to Payment
                          <ChevronRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;