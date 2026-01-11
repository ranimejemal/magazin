import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlideshow from '@/components/home/HeroSlideshow';
import CategorySection from '@/components/home/CategorySection';
import PromoSection from '@/components/home/PromoSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import FreshDealsSection from '@/components/home/FreshDealsSection';
import FeaturedBrands from '@/components/home/FeaturedBrands';
import NewsletterSection from '@/components/home/NewsletterSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSlideshow />
        <CategorySection />
        <BestsellersSection />
        <PromoSection />
        <FreshDealsSection />
        <FeaturedBrands />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
