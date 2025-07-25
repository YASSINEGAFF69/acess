import React from 'react';
import { motion } from 'framer-motion';
import { berberTents, palmBeachPalace, anantaraSahara } from '../assets/images';

const accommodations = [
  {
    name: "L'ÎLOT PALMIER TOZEUR: BERBER TENTS",
    description: "A unique experience of lodging in the tents of the Berbers.",
    image: berberTents
  },
  {
    name: "PALM BEACH PALACE TOZEUR",
    description: "Set in an oasis of greenery and tranquility, overlooking the splendid Tozeur palm grove.",
    image: palmBeachPalace
  },
  {
    name: "ANANTARA SAHARA TOZEUR RESORT & VILLAS",
    description: "Your luxurious gateway to the majesty of the Sahara.",
    image: anantaraSahara
  }
];

const AccommodationsSection: React.FC = () => {
  return (
    <section className="py-20 bg-desert-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title inline-block">Luxury Accommodations</h2>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Discover the authenticity and luxury of our selections, specially designed for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodations.map((accommodation, index) => (
            <motion.div
              key={accommodation.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={accommodation.image}
                  alt={accommodation.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold mb-3 text-gray-800">
                  {accommodation.name}
                </h3>
                <p className="text-gray-600">
                  {accommodation.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={() => {
              const element = document.getElementById('packages');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="button-primary"
          >
            View Our Packages
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AccommodationsSection;