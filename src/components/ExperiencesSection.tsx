import React from 'react';
import { motion } from 'framer-motion';
import { experiences } from '../data/experiences';
import { Star, Music, Utensils, Camera } from 'lucide-react';

const ExperiencesSection: React.FC = () => {
  const icons = [Star, Music, Utensils, Camera];
  
  return (
    <section id="experiences" className="py-20 bg-desert-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-desert-300 rounded-full opacity-20 -translate-x-20 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-desert-300 rounded-full opacity-20 translate-x-12 translate-y-16"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start gap-12">
          <div className="md:w-2/5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title mb-6">Unmatched Experiences</h2>
              <p className="text-xl mb-8">Live with us a unique experience of desert nightlife:</p>
              
              <ul className="space-y-4">
                {experiences.map((experience, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center mr-3 mt-1">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{experience.title}</h3>
                      <p className="text-gray-700">{experience.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <div className="md:w-3/5 grid grid-cols-2 gap-4">
            <motion.div
              className="aspect-w-4 aspect-h-3 mb-4 col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.pexels.com/photos/3278939/pexels-photo-3278939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Stargazing in the desert"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
            
            <motion.div
              className="aspect-w-1 aspect-h-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://images.pexels.com/photos/2526128/pexels-photo-2526128.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Oasis experience"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
            
            <motion.div
              className="aspect-w-1 aspect-h-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img 
                src="https://images.pexels.com/photos/2272854/pexels-photo-2272854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Desert party"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;