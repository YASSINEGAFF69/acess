import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Globe, Mail, MapPin } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title inline-block">Contact Us</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Phone,
              title: "Phone",
              content: "+216 20603070",
              href: "tel:+21620603070"
            },
            {
              icon: Globe,
              title: "Website",
              content: "www.aces-event.com",
              href: "https://www.aces-event.com"
            },
            {
              icon: Mail,
              title: "Email",
              content: "aces.sarl.contact@gmail.com",
              href: "mailto:aces.sarl.contact@gmail.com"
            },
            {
              icon: MapPin,
              title: "Location",
              content: "Tunis, Tunisia",
              href: "https://goo.gl/maps/Tunisia"
            }
          ].map((item, index) => (
            <motion.a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center p-6 bg-desert-50 rounded-xl hover:bg-desert-100 transition-colors"
            >
              <item.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-center">{item.content}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;