export const packages = [
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
  },
  {
    id: 5,
    name: "CARTHAGE & SIDI BOU SAID",
    description: "One-day coastal heritage tour",
    subtitle: "Ancient Carthage & Blue Village",
    badge: "Historical Journey",
    pricingTiers: {
      group: { original: 128, discounted: 109 },
      private: { original: 234, discounted: 199 },
      bicycle: { original: 173, discounted: 147 }
    },
    features: [
      "HOTEL PICKUP & DROP-OFF",
      "LUNCH AT SIDI BOU SAID",
      "BOTTLED WATER",
      "PRIVATE TRANSPORTATION",
      "CARTHAGE RUINS ENTRY",
      "SIDI BOU SAID ENTRY",
      "ENGLISH-SPEAKING GUIDE",
      "ALL HISTORICAL SITES"
    ],
    note: "The Carthage & Sidi Bou Said tour offers three options: Group tour, Private tour (max 9 people), or Bicycle tour for an eco-friendly coastal experience",
    color: "bg-gradient-to-br from-cyan-400 to-blue-600"
  }
  },
  {
    id: 6,
    title: "Sajnene Pottery Master Class",
    description: "Traditional pottery workshop in northwestern Tunisia where women perpetuate a unique craft tradition of modelled pottery, handed down from generation to generation.",
    image: "https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageLarge: "https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 101,
    originalPrice: 119,
    duration: "1 Day",
    location: "Sajnene, Tunisia",
    groupSize: "Up to 15 people",
    departureTime: "08:00 AM",
    accommodation: "Day trip with traditional lunch included",
    fullDescription: "The Sajnene pottery workshop, located in northwestern Tunisia, is a place where women perpetuate a unique craft tradition of modelled pottery, handed down from generation to generation. Renowned for their organic shapes and Berber decorations, these potteries offer a testament to the region's history and culture, and have been designated as intangible heritage by UNESCO.",
    included: [
      "Hotel pickup and drop-off",
      "Traditional lunch",
      "Bottled water",
      "Private transportation in air-conditioned vehicle",
      "Pottery Master Class participation",
      "Trekking to the Water Barrage of Sajnene",
      "Tour guide (English-speaking)",
      "All workshop materials"
    ],
    itinerary: [
      {
        title: "Morning Workshop & Cultural Immersion",
        description: "Start your day with hotel pickup at 08:00 AM and journey to the traditional pottery village of Sajnene.",
        activities: [
          "08:00 AM - Hotel pickup",
          "09:30 AM - Arrival at Sajnene pottery workshop",
          "10:00 AM - Pottery Master Class begins",
          "11:30 AM - Learn traditional Berber decoration techniques",
          "12:30 PM - Traditional lunch break"
        ]
      },
      {
        title: "Afternoon Exploration & Nature",
        description: "After lunch, explore the natural beauty of the region with a scenic trek.",
        activities: [
          "02:00 PM - Trekking to the Water Barrage of Sajnene",
          "03:30 PM - Photography and nature appreciation",
          "04:30 PM - Return journey begins",
          "06:00 PM - Drop-off at hotel"
        ]
      }
    ],
    gallery: [
      "https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1094766/pexels-photo-1094766.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1094768/pexels-photo-1094768.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1094769/pexels-photo-1094769.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    options: [
      {
        id: 1,
        title: "Private Workshop Experience",
        description: "Exclusive pottery session with master artisan (max 9 people)",
        price: 98
      },
      {
        id: 2,
        title: "Extended Cultural Tour",
        description: "Additional visit to local Berber heritage sites",
        price: 45
      },
      {
        id: 3,
        title: "Take Home Your Creation",
        description: "Professional firing and shipping of your pottery piece",
        price: 35
      },
      {
        id: 4,
        title: "Traditional Costume Experience",
        description: "Dress in traditional Berber attire during the workshop",
        price: 25
      }
    ],
    pricingTiers: {
      group: { original: 119, discounted: 101 },
      private: { original: 234, discounted: 199 }
    }
];