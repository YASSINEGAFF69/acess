import React from 'react';
import { motion } from 'framer-motion';
import { Check, Timer, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    id: 1,
    name: "PLATINUM PACK",
    description: "Berber tent at îlot Palmier Tozeur",
    badge: "Most Popular",
    pricingTiers: {
      single: { original: 1275, discounted: 1084 },
      double: { original: 1056, discounted: 898 },
      triple: { original: 984, discounted: 836 },
      quadruple: { original: 947, discounted: 805 }
    },
    features: [
      "ACCOMMODATION",
      "TRANSPORT",
      "MEALS MENTIONED",
      "VISITS",
      "PARTIES",
      "ACTIVITIES MENTIONED",
      "TOUR GUIDE",
      "AND COCKTAILS"
    ],
    note: "The accommodation of the platinum pack is a Berber tent at îlot Palmier Tozeur",
    color: "bg-gradient-to-br from-gray-400 to-gray-600"
  },
  {
    id: 2,
    name: "DIAMOND PACK",
    description: "5 stars hotel Palm Beach Tozeur",
    badge: "Luxury",
    pricingTiers: {
      single: { original: 1150, discounted: 977 },
      double: { original: 1078, discounted: 916 },
      triple: { original: 1054, discounted: 896 }
    },
    features: [
      "ACCOMMODATION",
      "TRANSPORT",
      "MEALS MENTIONED",
      "VISITS",
      "PARTIES",
      "ACTIVITIES MENTIONED",
      "TOUR GUIDE",
      "AND COCKTAILS"
    ],
    note: "The accommodation of the diamond pack is at the 5 stars hotel Palm Beach Tozeur",
    color: "bg-gradient-to-br from-blue-400 to-blue-600"
  },
  {
    id: 3,
    name: "VIP PACK",
    description: "Deluxe Garden view Suite",
    subtitle: "at Anantara Sahara Tozeur Resort & Villas",
    badge: "Ultimate Luxury",
    pricingTiers: {
      single: { original: 2284, discounted: 1939 },
      double: { original: 1387, discounted: 1632 }
    },
    features: [
      "ACCOMMODATION",
      "TRANSPORT",
      "MEALS MENTIONED",
      "VISITS",
      "PARTIES",
      "ACTIVITIES MENTIONED",
      "TOUR GUIDE",
      "AND COCKTAILS"
    ],
    note: "The accommodation of the VIP pack is at Anantara Sahara Tozeur Resort & Villas",
    color: "bg-gradient-to-br from-yellow-400 to-yellow-600"
  },
  {
    id: 4,
    name: "TUNIS CITY TOUR",
    description: "One-day cultural immersion",
    subtitle: "Medina of Tunis & Bardo Museum",
    badge: "Cultural Experience",
    pricingTiers: {
      group: { original: 107, discounted: 91 },
      private: { original: 222, discounted: 189 },
      bicycle: { original: 151, discounted: 128 }
    },
    features: [
      "HOTEL PICKUP & DROP-OFF",
      "TRADITIONAL LUNCH",
      "BOTTLED WATER",
      "PRIVATE TRANSPORTATION",
      "MEDINA ENTRY",
      "BARDO MUSEUM ENTRY",
      "ENGLISH-SPEAKING GUIDE",
      "ALL ACTIVITIES"
    ],
    note: "The Tunis City Tour offers three options: Group tour, Private tour, or Bicycle tour for an eco-friendly experience",
    color: "bg-gradient-to-br from-green-400 to-green-600"
  }
];

const PricingSection: React.FC = () => {
  return (
    <section className="py-20 bg-desert-50">
      <div className="container mx-auto px-4">
        {/* Early Bird Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-secondary text-white rounded-xl p-6 mb-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-primary opacity-10 transform rotate-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Timer className="h-6 w-6" />
              <h3 className="text-2xl font-bold">Early Birds Special Offer!</h3>
            </div>
            <p className="text-xl mb-2">Save 15% on all packages</p>
            <p className="text-sm">Limited time offer for the first 100 bookings</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title inline-block">Choose Your Adventure</h2>
          <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto">
            Select from our three carefully crafted packages, each offering unique accommodations and experiences. 
            All prices are in USD and include early bird discount.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden relative ${
                plan.id === 2 ? 'ring-4 ring-secondary ring-opacity-50 transform scale-105' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-4 right-4 ${plan.color} text-white text-xs font-bold px-3 py-1 rounded-full z-10`}>
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="bg-gradient-to-r from-secondary to-primary text-white p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-orange-100 mb-1">{plan.description}</p>
                {plan.subtitle && (
                  <p className="text-orange-100 text-sm">{plan.subtitle}</p>
                )}
              </div>

              {/* Pricing Tiers */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {Object.entries(plan.pricingTiers).map(([type, pricing]) => (
                    <div key={type} className="bg-desert-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="uppercase font-bold text-sm text-gray-600 mb-2">
                          {type}
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-gray-500 line-through text-lg">
                            ${pricing.original}
                          </span>
                          <span className="text-2xl font-bold text-secondary">
                            ${pricing.discounted}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Save ${pricing.original - pricing.discounted}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>NB:</strong> {plan.note}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => window.location.href = `/package/${plan.id}`}
                  className="w-full button-primary text-center block"
                >
                  Book {plan.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <h3 className="text-2xl font-bold text-gray-800">All Packages Include</h3>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center p-3">
                <div className="font-semibold">Transportation</div>
                <div>Round-trip from Tunis</div>
              </div>
              <div className="flex flex-col items-center p-3">
                <div className="font-semibold">Meals</div>
                <div>All mentioned meals</div>
              </div>
              <div className="flex flex-col items-center p-3">
                <div className="font-semibold">Activities</div>
                <div>All tours & experiences</div>
              </div>
              <div className="flex flex-col items-center p-3">
                <div className="font-semibold">Guide</div>
                <div>Professional tour guide</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;