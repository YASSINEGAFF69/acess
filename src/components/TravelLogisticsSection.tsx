import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Beef as Jeep } from 'lucide-react';
import { luxuryCoach, desertVehicles } from '../assets/images';

const TravelLogisticsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title inline-block">Travel Logistics</h2>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Experience comfortable and safe travel with our modern fleet of vehicles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-desert-50 rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <Bus className="h-8 w-8 text-primary mr-3" />
              <h3 className="font-display text-xl font-bold">Luxury Coaches</h3>
            </div>
            <p className="text-gray-700">
              Travel in comfort with our modern, air-conditioned coaches equipped with all amenities for long-distance journeys.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-desert-50 rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <Jeep className="h-8 w-8 text-primary mr-3" />
              <h3 className="font-display text-xl font-bold">4x4 Desert Vehicles</h3>
            </div>
            <p className="text-gray-700">
              Experience thrilling desert adventures in our fleet of well-maintained 4x4 vehicles, perfect for off-road exploration.
            </p>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            src={desertVehicles}
            alt="Desert 4x4 vehicles"
            className="rounded-xl w-full h-64 object-cover"
          />
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src={luxuryCoach}
            alt="Luxury coach"
            className="rounded-xl w-full h-64 object-cover"
          />
        </div>
        
        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const element = document.getElementById('packages');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="button-primary"
            >
              Book Your Journey
            </button>
            <button
              onClick={() => window.open('mailto:aces.sarl.contact@gmail.com')}
              className="button-secondary"
            >
              Ask About Transport
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelLogisticsSection;