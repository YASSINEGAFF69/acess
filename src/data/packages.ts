import { desertAdventure, adventureScene, desertExperience, starWarsScene } from '../assets/images';

export const packages = [
  {
    id: 1,
    title: "Southern Tunisia Adventure - Platinum Pack",
    description: "Experience the ultimate desert adventure with authentic Berber tent accommodation at îlot Palmier Tozeur. This 4-day journey combines luxury with traditional desert living.",
    fullDescription: "Embark on an unforgettable 4-day journey through the breathtaking landscapes of Southern Tunisia with our Platinum Pack. Stay in authentic Berber tents at the exclusive îlot Palmier Tozeur, offering a unique blend of traditional desert living and modern comfort. Experience the magic of the Sahara Desert, visit the famous Chott el Djerid salt lake, explore ancient oases, and immerse yourself in the rich cultural heritage of the region.",
    image: desertAdventure,
    imageLarge: adventureScene,
    price: 1084, // Base price for single occupancy after discount
    originalPrice: 1275, // Original price before discount
    duration: "4 Days / 3 Nights",
    departureTime: "09:00 AM from Tunis",
    location: "Southern Tunisia, Tozeur",
    groupSize: "Limited to 100 People",
    accommodation: "Berber tent at îlot Palmier Tozeur",
    capacity: 100,
    pricingTiers: {
      single: { original: 1275, discounted: 1084 },
      double: { original: 1056, discounted: 898 },
      triple: { original: 984, discounted: 836 },
      quadruple: { original: 947, discounted: 805 }
    },
    included: [
      "Accommodation in authentic Berber tents",
      "Round-trip transportation from Tunis",
      "All meals mentioned in itinerary",
      "Desert excursions and visits",
      "Professional guides and entrance fees",
      "Traditional dinners with folkloric music",
      "Astronomical observation session",
      "Desert cocktail experience",
      "All parties and activities mentioned",
      "Tour guide services"
    ],
    options: [
      {
        id: 101,
        title: "Premium Accommodation Upgrade",
        description: "Upgrade to a 5-star hotel with luxury amenities and exclusive access to spa facilities.",
        price: 150
      },
      {
        id: 102,
        title: "Private Photography Tour",
        description: "A specialized guide will take you to the best photography spots and help capture stunning desert photos.",
        price: 120
      },
      {
        id: 103,
        title: "Hot Air Balloon Experience",
        description: "Soar above the desert at sunrise in a hot air balloon for breathtaking views of the landscape.",
        price: 200
      },
      {
        id: 104,
        title: "Traditional Costume Experience",
        description: "Rent traditional Tunisian costumes for a photoshoot in iconic desert settings.",
        price: 80
      }
    ],
    gallery: [
      desertAdventure,
      adventureScene,
      desertExperience,
      starWarsScene,
      desertAdventure,
      adventureScene
    ],
    itinerary: [
      {
        title: "Departure from Tunis to Tozeur",
        description: "Begin your journey with a morning departure from Tunis, visiting cultural highlights along the way before arriving in Tozeur in the evening.",
        activities: [
          "Departure from Tunis at 09:00 AM",
          "Visit to the Great Mosque Okba Ibn Nafaa and the Aghlabids Basins",
          "Lunch break",
          "Arrival at Tozeur between 07:30 and 08:00 PM",
          "Check-in and dinner at the Berber tent camp",
          "Welcome fountain-side cocktails"
        ]
      },
      {
        title: "Desert Expedition",
        description: "Experience a full day exploring the magnificent desert landscapes, including the famous Chott el Djerid salt lake and Star Wars filming locations.",
        activities: [
          "Breakfast at the camp",
          "Departure to Tamaghza, Chbika, and Chott el Djérid trails",
          "Visit to Star Wars iconic scenes",
          "Lunch in a traditional setting",
          "Sunset cocktail in the desert",
          "Traditional dinner with folkloric music",
          "Astronomical observation under the stars"
        ]
      },
      {
        title: "Tozeur Cultural Experience",
        description: "Discover the cultural treasures of Tozeur, from the historic Medina to beautiful oases, museums, and evening entertainment.",
        activities: [
          "Breakfast at the camp",
          "Visit the Tozeur Medina and the Desert Zoo",
          "Horse-drawn carriage tour of Tozeur Oases",
          "Lunch at a local restaurant",
          "Afternoon visit to Chak Wak Park and Dar Chrait Museum",
          "Dinner at the camp",
          "DJ party at l'Ilot des palmiers starting at 10 PM"
        ]
      },
      {
        title: "Return to Tunis",
        description: "Enjoy a relaxed morning before checking out and returning to Tunis with memories to last a lifetime.",
        activities: [
          "Breakfast at the camp",
          "Free time for last-minute shopping or relaxation",
          "Check-out at 11 AM",
          "Departure for Tunis"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Desert Discovery Tour - Diamond Pack",
    description: "Enjoy luxury accommodation at the 5-star Palm Beach Tozeur hotel while exploring Tunisia's desert landscapes and cultural heritage.",
    image: desertExperience,
    price: 977, // Base price for single occupancy after discount
    originalPrice: 1150, // Original price before discount
    duration: "4 Days / 3 Nights",
    departureTime: "08:30 AM from Tunis",
    location: "Tozeur, Southern Tunisia",
    groupSize: "Limited to 300 People",
    accommodation: "5 stars hotel Palm Beach Tozeur",
    capacity: 300,
    pricingTiers: {
      single: { original: 1150, discounted: 977 },
      double: { original: 1078, discounted: 916 },
      triple: { original: 1054, discounted: 896 }
    },
    included: [
      "Accommodation at 5-star Palm Beach Tozeur",
      "Transportation from Tunis",
      "All meals mentioned in itinerary",
      "Desert excursions and visits",
      "Professional guides and entrance fees",
      "Traditional dinners with folkloric music",
      "All parties and activities mentioned",
      "Tour guide services",
      "Desert camping under the stars",
      "Traditional Bedouin-style dinner"
    ],
    options: [
      {
        id: 201,
        title: "Quad Bike Desert Adventure",
        description: "Experience the thrill of riding quad bikes through desert dunes with expert instructors.",
        price: 180
      },
      {
        id: 202,
        title: "Desert Wellness Package",
        description: "Enjoy a sand bath therapy session and traditional hammam experience.",
        price: 120
      },
      {
        id: 203,
        title: "Private Stargazing Session",
        description: "Private astronomical session with an expert using professional equipment.",
        price: 90
      }
    ]
  },
  {
    id: 3,
    title: "Cultural Experience Package - VIP Pack",
    description: "Ultimate luxury experience at Anantara Sahara Tozeur Resort & Villas with Deluxe Garden view Suite accommodation.",
    image: adventureScene,
    price: 1939, // Base price for single occupancy after discount
    originalPrice: 2284, // Original price before discount
    duration: "4 Days / 3 Nights",
    departureTime: "09:30 AM from Tunis",
    location: "Anantara Sahara Tozeur Resort",
    groupSize: "Limited to 30 People",
    accommodation: "Deluxe Garden view Suite at Anantara Sahara Tozeur Resort & Villas",
    capacity: 30,
    pricingTiers: {
      single: { original: 2284, discounted: 1939 },
      double: { original: 1387, discounted: 1632 }
    },
    included: [
      "Deluxe Garden view Suite accommodation",
      "Transportation throughout the tour",
      "All meals mentioned with authentic cuisine",
      "Desert excursions and visits",
      "Professional guides and entrance fees",
      "Traditional dinners with folkloric music",
      "All parties and activities mentioned",
      "Tour guide services",
      "Local artisan workshops",
      "Museum and historical site entrance fees",
      "Traditional music performance",
      "Cooking class with local chef",
      "Souvenir gift package"
    ],
    options: [
      {
        id: 301,
        title: "Traditional Craft Workshop",
        description: "Hands-on workshop to learn traditional Tunisian crafts like ceramics or carpet weaving.",
        price: 85
      },
      {
        id: 302,
        title: "Private Cultural Guide",
        description: "Personal guide with expertise in Tunisia's cultural history and traditions.",
        price: 120
      },
      {
        id: 303,
        title: "Spa & Wellness Package",
        description: "Full spa treatment package at the resort's luxury wellness center.",
        price: 250
      }
    ]
  }
  },
  {
    id: 4,
    title: "Exciting Journey to Tunis - City Tour",
    description: "One-day trip to the Medina of Tunis and the Bardo Museum. An immersion in Tunisian tradition and a glimpse of the history of Tunis. A dive into the Tunisian lifestyle and the culinary habits.",
    fullDescription: "Discover the heart of Tunisia's capital with our comprehensive Tunis City Tour. This one-day cultural immersion takes you through the historic Medina of Tunis, a UNESCO World Heritage site, and the renowned Bardo Museum, home to one of the world's finest collections of Roman mosaics. Experience authentic Tunisian culture, traditional architecture, and local culinary delights in this unforgettable journey through Tunisia's rich history.",
    image: "https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg",
    imageLarge: "https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg",
    price: 91, // Base price for group tour
    originalPrice: 107, // Original price before discount
    duration: "1 Day",
    departureTime: "09:00 AM from hotel",
    location: "Tunis, Tunisia",
    groupSize: "Flexible group sizes",
    accommodation: "Day tour - no accommodation included",
    capacity: 200,
    pricingTiers: {
      group: { original: 107, discounted: 91 },
      private: { original: 222, discounted: 189 },
      bicycle: { original: 151, discounted: 128 }
    },
    included: [
      "Hotel pickup and drop-off",
      "Lunch at traditional restaurant",
      "Bottled water throughout the tour",
      "Private transportation in air-conditioned vehicle",
      "Entry to the Medina of Tunis",
      "Entry to the International Museum of Bardo",
      "Professional English-speaking tour guide",
      "All mentioned activities and visits"
    ],
    options: [
      {
        id: 401,
        title: "Private Tour Upgrade",
        description: "Upgrade to a private tour with dedicated guide and vehicle for your group only.",
        price: 98
      },
      {
        id: 402,
        title: "Bicycle Tour Experience",
        description: "Explore Tunis by bicycle for an eco-friendly and active tour experience.",
        price: 37
      },
      {
        id: 403,
        title: "Traditional Cooking Class",
        description: "Learn to prepare traditional Tunisian dishes with a local chef.",
        price: 45
      },
      {
        id: 404,
        title: "Extended Museum Tour",
        description: "Extended guided tour of the Bardo Museum with expert art historian.",
        price: 25
      }
    ],
    gallery: [
      "https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg",
      "https://images.pexels.com/photos/4353618/pexels-photo-4353618.jpeg",
      "https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg",
      "https://images.pexels.com/photos/3889928/pexels-photo-3889928.jpeg",
      "https://images.pexels.com/photos/5490777/pexels-photo-5490777.jpeg",
      "https://images.pexels.com/photos/4353617/pexels-photo-4353617.jpeg"
    ],
    itinerary: [
      {
        title: "Morning Departure and Medina Exploration",
        description: "Begin your cultural journey with hotel pickup and explore the historic Medina of Tunis, a UNESCO World Heritage site.",
        activities: [
          "Hotel pickup at 09:00 AM",
          "Half-hour tour in Tunis Downtown",
          "Visit Bab Bhar ('The gate of the sea' of the Medina) - 15 minutes",
          "Explore the Medina and its historic sights",
          "Discover traditional crafts and local markets",
          "Learn about Tunisian architecture and culture"
        ]
      },
      {
        title: "Lunch and Museum Visit",
        description: "Enjoy traditional Tunisian cuisine followed by a comprehensive visit to the world-renowned Bardo Museum.",
        activities: [
          "Lunch at Fondouk El Attarine (12:00 PM - 2:00 PM)",
          "Taste authentic Tunisian dishes and local specialties",
          "Visit to the International Museum of Bardo",
          "Explore the world's finest collection of Roman mosaics",
          "Discover Tunisia's rich archaeological heritage",
          "Guided tour with expert commentary"
        ]
      },
      {
        title: "Return Journey",
        description: "Complete your cultural immersion and return to your hotel with unforgettable memories of Tunis.",
        activities: [
          "Final exploration of any remaining sites",
          "Shopping opportunity for souvenirs",
          "Drop-off at the hotel at 06:00 PM",
          "Optional: Bicycle tour available for eco-friendly exploration"
        ]
      }
    ]
];