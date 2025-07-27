import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import PackagesSection from '../components/PackagesSection';
import DestinationsSection from '../components/DestinationsSection';
import ActivitiesSection from '../components/ActivitiesSection';
import ExperiencesSection from '../components/ExperiencesSection';
import ItinerarySection from '../components/ItinerarySection';
import AccommodationsSection from '../components/AccommodationsSection';
import TravelLogisticsSection from '../components/TravelLogisticsSection';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

const Home: React.FC = () => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
      
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div>
      <Hero />
      <PackagesSection />
      <PricingSection />
      <DestinationsSection />
      <ActivitiesSection />
      <ItinerarySection />
      <AccommodationsSection />
      <TravelLogisticsSection />
      <ExperiencesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Home;