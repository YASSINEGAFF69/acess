import React from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '../data/testimonials';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-desert-50 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-desert-100 opacity-50"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-desert-100 opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title inline-block text-center after:left-1/2 after:-translate-x-1/2">
            What Our Travelers Say
          </h2>
          <p className="max-w-2xl mx-auto mt-8 text-lg text-gray-700">
            Don't just take our word for it. Here's what travelers have to say about their experiences with ACES Tunisia.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Quote mark */}
      <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center text-xl font-bold">
        "
      </div>
      
      {/* Rating */}
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
      
      {/* Author */}
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold">{testimonial.name}</h4>
          <p className="text-gray-500 text-sm">{testimonial.location}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;