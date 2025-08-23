import React, { createContext, useContext, useState } from 'react';

interface BookingOption {
  id: number;
  title: string;
  price: number;
}

interface BookingData {
  packageId: number;
  packageTitle: string;
  selectedOptions: BookingOption[];
  basePrice: number;
  totalPrice: number;
}

interface Person {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  idNumber: string;
}

interface ContactDetails {
  email: string;
  phone: string;
  address: string;
}

interface BookingPersonsData {
  numberOfPeople: number;
  contactDetails: ContactDetails;
  specialRequests: string;
  people: Person[];
}

interface BookingContextType {
  bookingData: BookingData | null;
  bookingPersonsData: BookingPersonsData | null;
  currentBookingReference: string | null;
  bookingSuccess: boolean;
  setBookingData: (data: BookingData) => void;
  setBookingPersonsData: (data: BookingPersonsData) => void;
  setCurrentBookingReference: (reference: string | null) => void;
  setBookingSuccess: (success: boolean) => void;
  resetBookingData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingPersonsData, setBookingPersonsData] = useState<BookingPersonsData | null>(null);
  const [currentBookingReference, setCurrentBookingReference] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  
  const resetBookingData = () => {
    setBookingData(null);
    setBookingPersonsData(null);
    setCurrentBookingReference(null);
    setBookingSuccess(false);
  };
  
  return (
    <BookingContext.Provider value={{ 
      bookingData, 
      bookingPersonsData,
      currentBookingReference,
      bookingSuccess,
      setBookingData,
      setBookingPersonsData,
      setCurrentBookingReference,
      setBookingSuccess,
      resetBookingData
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};