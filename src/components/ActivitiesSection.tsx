import React from 'react';
import { motion } from 'framer-motion';
import { activities } from '../data/activities';

const ActivitiesSection: React.FC = () => {
  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="section-title mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Activities Highlights
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity}
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ActivityCardProps {
  activity: typeof activities[0];
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index }) => {
  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 border-4 border-desert-300 rounded-2xl" style={{ 
          clipPath: "polygon(0% 20%, 20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%)"
        }}></div>
        <img 
          src={activity.image} 
          alt={activity.name}
          className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-110"
        />
      </div>
      
      <h3 className="font-display text-xl md:text-2xl font-bold text-center mb-3">
        {activity.name}
      </h3>
      
      <p className="text-gray-700 text-center text-sm">
        {activity.description}
      </p>
    </motion.div>
  );
};

export default ActivitiesSection;