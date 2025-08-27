export const packages = [
  // Package 1: Platinum Pack
  {
    id: 1,
    title: "Southern Tunisia Adventure",
    name: "PLATINUM PACK",
    description: "Berber tent at îlot Palmier Tozeur",
    subtitle: "Desert adventure with authentic accommodation",
    badge: "Adventure",
    image: "https://images.pexels.com/photos/3889928/pexels-photo-3889928.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageLarge: "https://images.pexels.com/photos/3889928/pexels-photo-3889928.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 805,
    originalPrice: 947,
    duration: "4 Days / 3 Nights",
    location: "Tozeur, Tunisia",
    groupSize: "Up to 100 people",
    departureTime: "09:00 AM",
    accommodation: "Berber tent at îlot Palmier Tozeur - authentic desert experience",
    fullDescription: "Experience the magic of Southern Tunisia with our Platinum Pack. Stay in traditional Berber tents at îlot Palmier Tozeur and immerse yourself in the authentic desert lifestyle. This adventure includes visits to iconic locations, traditional activities, and unforgettable experiences under the desert stars.",
    included: [
      "Accommodation in Berber tents",
      "Private transportation",
      "All mentioned meals",
      "Guided visits and tours",
      "Desert parties and entertainment",
      "Traditional activities",
      "Professional tour guide",
      "Welcome and farewell cocktails"
    ],
    itinerary: [
      {
        title: "Arrival and Kairouan Discovery",
        description: "Journey from Tunis to Tozeur with a cultural stop in Kairouan",
        activities: [
          "09:00 AM - Departure from Tunis",
          "11:00 AM - Visit Great Mosque Okba Ibn Nafaa",
          "01:00 PM - Traditional lunch",
          "07:30 PM - Arrival at Tozeur",
          "08:30 PM - Check-in and dinner",
          "10:00 PM - Fountain-side cocktails"
        ]
      },
      {
        title: "Desert Exploration",
        description: "Full day exploring the Sahara and Star Wars filming locations",
        activities: [
          "08:00 AM - Breakfast",
          "09:30 AM - Tamaghza and Chbika trail",
          "01:00 PM - Lunch",
          "05:30 PM - Desert sunset cocktail",
          "08:00 PM - Traditional dinner with music",
          "10:00 PM - Astronomical observation"
        ]
      }
    ],
    gallery: [
      "https://images.pexels.com/photos/3889928/pexels-photo-3889928.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/7130538/pexels-photo-7130538.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3889929/pexels-photo-3889929.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3889930/pexels-photo-3889930.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    options: [
      {
        id: 1,
        title: "quad biking experience",
        description: "",
        price: 50
      },
      {
        id: 2,
        title: "Camel Trekking Adventure",
        description: "Extended camel ride through the dunes",
        price: 50
      },
      {
        id: 3,
        title: "Traditional Cooking Class",
        description: "Learn to prepare authentic Tunisian dishes",
        price: 50
      }
    ],
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

  // Package 2: Diamond Pack
  {
    id: 2,
    title: "Desert Discovery Tour",
    name: "DIAMOND PACK", 
    description: "5 stars hotel Palm Beach Tozeur",
    subtitle: "Luxury desert experience",
    badge: "Most Popular",
    image: "https://images.pexels.com/photos/3889931/pexels-photo-3889931.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageLarge: "https://images.pexels.com/photos/3889931/pexels-photo-3889931.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 896,
    originalPrice: 1054,
    duration: "4 Days / 3 Nights",
    location: "Tozeur, Tunisia",
    groupSize: "Up to 300 people",
    departureTime: "09:00 AM",
    accommodation: "5-star Palm Beach Hotel Tozeur with luxury amenities and desert views",
    fullDescription: "Discover the wonders of the Sahara Desert while enjoying luxury accommodations at the 5-star Palm Beach Hotel. This premium package combines adventure with comfort, offering the perfect balance of cultural immersion and modern amenities.",
    included: [
      "5-star hotel accommodation",
      "Private transportation",
      "All mentioned meals",
      "Guided visits and tours", 
      "Desert parties and entertainment",
      "Traditional activities",
      "Professional tour guide",
      "Welcome and farewell cocktails"
    ],
    itinerary: [
      {
        title: "Arrival and Cultural Introduction",
        description: "Luxury arrival and introduction to Tunisian culture",
        activities: [
          "09:00 AM - VIP departure from Tunis",
          "11:00 AM - Kairouan cultural tour",
          "01:00 PM - Gourmet lunch",
          "07:30 PM - Luxury hotel check-in",
          "08:30 PM - Welcome dinner",
          "10:00 PM - Rooftop cocktails"
        ]
      }
    ],
    gallery: [
      "https://images.pexels.com/photos/3889931/pexels-photo-3889931.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/7130539/pexels-photo-7130539.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    options: [
      {
        id: 1,
        title: "quad biking experience",
        description: "",
        price: 50
      },
      {
        id: 2,
        title: "Camel Trekking Adventure",
        description: "Extended camel ride through the dunes",
        price: 50
      },
      {
        id: 3,
        title: "Traditional Cooking Class",
        description: "Learn to prepare authentic Tunisian dishes",
        price: 50
      }
    ],
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

  // Package 3: VIP Pack
  {
    id: 3,
    title: "Cultural Experience",
    name: "VIP PACK",
    description: "Deluxe Garden view Suite",
    subtitle: "at Anantara Sahara Tozeur Resort & Villas",
    badge: "Ultimate Luxury",
    image: "https://images.pexels.com/photos/3889932/pexels-photo-3889932.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageLarge: "https://images.pexels.com/photos/3889932/pexels-photo-3889932.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 1632,
    originalPrice: 1920,
    duration: "4 Days / 3 Nights",
    location: "Tozeur, Tunisia",
    groupSize: "Up to 30 people",
    departureTime: "09:00 AM",
    accommodation: "Deluxe Garden view Suite at Anantara Sahara Tozeur Resort & Villas - ultimate luxury experience",
    fullDescription: "Experience the pinnacle of luxury with our VIP package at the prestigious Anantara Sahara Tozeur Resort & Villas. Enjoy exclusive access to premium amenities, personalized service, and unforgettable cultural experiences in the heart of the Sahara.",
    included: [
      "Deluxe suite accommodation",
      "Private transportation",
      "All gourmet meals",
      "Private guided tours",
      "Exclusive desert experiences",
      "Traditional activities",
      "Personal concierge service",
      "Premium cocktails and beverages"
    ],
    itinerary: [
      {
        title: "VIP Arrival Experience",
        description: "Exclusive arrival with premium services",
        activities: [
          "09:00 AM - Private jet/car departure",
          "11:00 AM - Private Kairouan tour",
          "01:00 PM - Michelin-style lunch",
          "07:30 PM - Resort arrival with welcome ceremony",
          "08:30 PM - Private chef dinner",
          "10:00 PM - Exclusive desert cocktails"
        ]
      }
    ],
    gallery: [
      "https://images.pexels.com/photos/3889932/pexels-photo-3889932.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/7130540/pexels-photo-7130540.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    options: [
      {
        id: 1,
        title: "Skydiving Experience",
        description: "",
        price: 750
      },
      {
        id: 2,
        title: "Profesional shooting session",
        description: "Professional photographer for your journey",
        price: 750
      }
    ],
    pricingTiers: {
      single: { original: 2284, discounted: 1939 },
      double: { original: 1920, discounted: 1632 }
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

  // Package 4: Tunis City Tour
  {
    id: 4,
    title: "Exciting Journey to Tunis",
    name: "TUNIS CITY TOUR",
    description: "One-day cultural immersion",
    subtitle: "Medina of Tunis & Bardo Museum",
    badge: "Cultural Experience",
    image: "https://images.pexels.com/photos/3889933/pexels-photo-3889933.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageLarge: "https://images.pexels.com/photos/3889933/pexels-photo-3889933.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 91,
    originalPrice: 107,
    duration: "1 Day",
    location: "Tunis, Tunisia",
    groupSize: "Up to 200 people",
    departureTime: "09:00 AM",
    accommodation: "Day trip with traditional lunch included",
    fullDescription: "One-day trip to the Medina of Tunis and the Bardo Museum. An immersion in Tunisian tradition and a glimpse of the history of Tunis. A dive into the Tunisian lifestyle and the culinary habits.",
    included: [
      "Hotel pickup and drop-off",
      "Traditional lunch",
      "Bottled water",
      "Private transportation in air-conditioned vehicle",
      "Medina entry",
      "Bardo Museum entry",
      "English-speaking guide",
      "All activities"
    ],
    itinerary: [
      {
        title: "Morning Cultural Exploration",
        description: "Discover the heart of Tunis and its rich history",
        activities: [
          "09:00 AM - Hotel pickup",
          "09:30 AM - Half-hour tour in Tunis Downtown",
          "10:00 AM - Visit Bab Bhar (The gate of the sea)",
          "10:15 AM - Explore the Medina and sights",
          "12:00 PM - Lunch at Fondouk El Attarine"
        ]
      },
      {
        title: "Afternoon Museum Experience",
        description: "Explore Tunisia's archaeological treasures",
        activities: [
          "02:00 PM - International Museum of Bardo visit",
          "04:00 PM - Museum exploration and guided tour",
          "05:30 PM - Return journey begins",
          "06:00 PM - Drop-off at hotel"
        ]
      }
    ],
    gallery: [
      "https://images.pexels.com/photos/3889933/pexels-photo-3889933.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/7130541/pexels-photo-7130541.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3889934/pexels-photo-3889934.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/7130542/pexels-photo-7130542.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    options: [
      {
        id: 1,
        title: "Private Tour Experience",
        description: "Exclusive tour with personal guide (max 9 people)",
        price: 98
      },
      {
        id: 2,
        title: "Bicycle Tour Option",
        description: "Eco-friendly exploration of Tunis by bicycle",
        price: 37
      },
      {
        id: 3,
        title: "Traditional Cooking Class",
        description: "Learn to prepare authentic Tunisian dishes",
        price: 45
      },
      {
        id: 4,
        title: "Extended Museum Tour",
        description: "In-depth guided tour with archaeological expert",
        price: 25
      }
    ],
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

  // Package 5: Carthage & Sidi Bou Said
  {
    id: 5,
    title: "Carthage & Sidi Bou Said",
    name: "CARTHAGE & SIDI BOU SAID",
    description: "One-day coastal heritage tour",
    subtitle: "Ancient Carthage & Blue Village",
    badge: "Historical Journey",
    image: "https://images.pexels.com/photos/3889935/pexels-photo-3889935.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageLarge: "https://images.pexels.com/photos/3889935/pexels-photo-3889935.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 109,
    originalPrice: 128,
    duration: "1 Day",
    location: "Carthage & Sidi Bou Said, Tunisia",
    groupSize: "Up to 150 people",
    departureTime: "09:00 AM",
    accommodation: "Day trip with lunch at Sidi Bou Said included",
    fullDescription: "One-day trip to Carthage and Sidi Bou Said, a hub of Tunis. An immersion in the history of Carthage and a brief glimpse of 3,000 years. Sunset break at the highest viewpoint, Sidi Bou Said.",
    included: [
      "Hotel pickup and drop-off",
      "Lunch at Sidi Bou Said",
      "Bottled water",
      "Private transportation in air-conditioned vehicle",
      "Carthage ruins entry",
      "Sidi Bou Said entry",
      "English-speaking guide",
      "All historical sites"
    ],
    itinerary: [
      {
        title: "Morning Ancient Carthage Exploration",
        description: "Discover the ruins of the ancient Carthaginian civilization",
        activities: [
          "09:00 AM - Hotel pickup",
          "09:30 AM - Visit to the Byrsa Hill & Carthage Museum (90 minutes)",
          "11:00 AM - Second stop: Visit to Punic Ports (Ancient Harbor of Carthage, 30 minutes)",
          "11:30 AM - Third stop: Visit to Antonine Baths (Thermes d'Antonin, 45 minutes)"
        ]
      },
      {
        title: "Afternoon Sidi Bou Said Experience",
        description: "Explore the iconic blue and white village",
        activities: [
          "01:00 PM - Lunch at Sidi Bou Said (1:00 PM – 3:00 PM)",
          "03:00 PM - Walk tour in Sidi Bou Said",
          "04:00 PM - Coffee time and sunset viewpoint",
          "05:30 PM - Return journey",
          "06:00 PM - Drop-off at hotel"
        ]
      }
    ],
    gallery: [
      "https://images.pexels.com/photos/3889935/pexels-photo-3889935.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/7130543/pexels-photo-7130543.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3889936/pexels-photo-3889936.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/7130544/pexels-photo-7130544.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    options: [
      {
        id: 1,
        title: "Private Tour Experience",
        description: "Exclusive tour with personal guide (max 9 people)",
        price: 90
      },
      {
        id: 2,
        title: "Bicycle Tour Option",
        description: "Eco-friendly coastal exploration by bicycle",
        price: 38
      },
      {
        id: 3,
        title: "Sunset Photography Session",
        description: "Professional photography at golden hour",
        price: 65
      },
      {
        id: 4,
        title: "Traditional Craft Workshop",
        description: "Learn traditional Sidi Bou Said crafts",
        price: 45
      }
    ],
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
  },

  // Package 6: Sajnene Pottery Master Class
  {
    id: 6,
    title: "Sajnene Pottery Master Class",
    name: "SAJNENE POTTERY MASTER CLASS",
    description: "Traditional pottery workshop in northwestern Tunisia",
    subtitle: "UNESCO Intangible Heritage Experience",
    badge: "Cultural Workshop",
    image: "https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageLarge: "https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 101,
    originalPrice: 119,
    duration: "1 Day",
    location: "Sajnene, Tunisia",
    groupSize: "Up to 50 people",
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
    },
    features: [
      "HOTEL PICKUP & DROP-OFF",
      "TRADITIONAL LUNCH",
      "BOTTLED WATER",
      "PRIVATE TRANSPORTATION",
      "POTTERY MASTER CLASS",
      "TREKKING EXPERIENCE",
      "ENGLISH-SPEAKING GUIDE",
      "ALL WORKSHOP MATERIALS"
    ],
    note: "Private tours are only for a group of under 9 people. This workshop is designated as UNESCO intangible heritage.",
    color: "bg-gradient-to-br from-amber-400 to-amber-600"
  }
];