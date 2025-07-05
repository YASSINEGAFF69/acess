import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/1718337/pexels-photo-1718337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
        }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2 
            className="font-display text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Experience the Magic of Tunisia?
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Book your adventure now and create memories that will last a lifetime. Limited spots available for our exclusive packages.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/#packages" 
              className="bg-white text-secondary hover:bg-gray-100 button-primary"
            >
              Explore Packages
            </Link>
            
            <Link 
              to="/contact" 
              className="border-2 border-white text-white hover:bg-white/20 font-bold py-3 px-6 rounded-full transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;