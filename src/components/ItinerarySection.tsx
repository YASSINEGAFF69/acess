import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const ItinerarySection: React.FC = () => {
  const [activeDay, setActiveDay] = useState(1);
  
  const days = [
    {
      day: 1,
      activities: [
        { time: '09:00 AM', title: 'Departure from Tunis' },
        { time: '11:00 AM', title: 'Visit to the Great Mosque Okba Ibn Nafaa and the Aghlabids Basins' },
        { time: '01:00 PM', title: 'Lunch' },
        { time: '07:30 PM', title: 'Arrival at Tozeur' },
        { time: '08:30 PM', title: 'Check-in and Dinner at the hotel' },
        { time: '10:00 PM', title: 'Fountain-side cocktails' },
      ]
    },
    {
      day: 2,
      activities: [
        { time: '08:00 AM', title: 'Breakfast' },
        { time: '09:30 AM', title: 'Departure to the trail Tamaghza, Chbika, Chott el Djérid, and Star Wars iconic scenes' },
        { time: '01:00 PM', title: 'Lunch' },
        { time: '05:30 PM', title: 'Cocktail in the desert with the sunset' },
        { time: '08:00 PM', title: 'Traditional dinner served to the accompaniment of folkloric music' },
        { time: '10:00 PM', title: 'Fountain-side cocktails and Astronomic observation' },
      ]
    },
    {
      day: 3,
      activities: [
        { time: '08:00 AM', title: 'Breakfast' },
        { time: '09:30 AM', title: 'Departure for the excursion to the Tozeur Medina, the Desert Zoo, and the Tozeur Oases by horse-drawn carriage' },
        { time: '01:00 PM', title: 'Lunch' },
        { time: '03:00 PM', title: 'Visit of The Chak Wak Park and The Dar Chrait Museum' },
        { time: '08:00 PM', title: 'Dinner at the Hotel' },
        { time: '09:30 PM', title: 'Fountain-side cocktails' },
        { time: '10:00 PM', title: 'DJ party at l\'Ilot des palmiers' },
      ]
    },
    {
      day: 4,
      activities: [
        { time: '08:00 AM', title: 'Breakfast' },
        { time: '11:00 AM', title: 'Check-out' },
        { time: '12:00 PM', title: 'Departure for Tunis' },
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="section-title mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Journey Itinerary
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            {days.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`w-full text-left mb-2 p-4 rounded-lg transition-all duration-300 ${
                  activeDay === day.day
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Day {day.day}</h3>
                  {activeDay === day.day && (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
                {/* Mobile-only content */}
                <AnimatePresence>
                  {activeDay === day.day && (
                    <motion.div 
                      className="mt-4 lg:hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {day.activities.map((activity, index) => (
                        <motion.div 
                          key={index}
                          className="mb-4 pl-4 relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-white"></div>
                          <p className="font-medium text-white/90">{activity.time}</p>
                          <p className="text-white/80">{activity.title}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* Desktop timeline view */}
          <div className="hidden lg:block lg:w-3/4 bg-desert-50 rounded-xl p-6">
            <h3 className="font-display text-2xl font-bold mb-6 text-secondary">
              Day {activeDay}
            </h3>

            <div className="relative">
              <AnimatePresence mode="wait">
                {days.find(day => day.day === activeDay)?.activities.map((activity, index) => (
                  <motion.div 
                    key={`${activeDay}-${index}`}
                    className="mb-6 pl-8 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    
                    {/* Timeline line */}
                    {index < days.find(day => day.day === activeDay)!.activities.length - 1 && (
                      <div className="absolute left-3 top-6 w-0.5 h-full bg-gray-300"></div>
                    )}
                    
                    <h4 className="font-bold text-primary">{activity.time}</h4>
                    <p className="text-gray-800">{activity.title}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;