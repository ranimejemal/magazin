import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop',
    title: 'Fresh Organic Produce',
    subtitle: 'Farm to Table Freshness',
    description: 'Discover the finest selection of organic fruits and vegetables delivered straight to your door.',
    cta: 'Shop Produce',
    link: '/category/fruits-vegetables',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1920&h=1080&fit=crop',
    title: 'Premium Dairy & Eggs',
    subtitle: 'Quality You Can Taste',
    description: 'From farm-fresh milk to free-range eggs, experience the difference quality makes.',
    cta: 'Shop Dairy',
    link: '/category/dairy-eggs',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1920&h=1080&fit=crop',
    title: 'Artisan Bakery',
    subtitle: 'Baked Fresh Daily',
    description: 'Crusty breads, fluffy pastries, and sweet treats made with love every morning.',
    cta: 'Shop Bakery',
    link: '/category/bakery',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1920&h=1080&fit=crop',
    title: 'Butcher\'s Selection',
    subtitle: 'Premium Cuts',
    description: 'Hand-selected meats from trusted local farms. Quality you can trust.',
    cta: 'Shop Meat',
    link: '/category/meat-seafood',
  },
];

const HeroSlideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="container-wide">
              <div className="max-w-2xl">
                <span
                  className={`inline-block px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium mb-6 transform transition-all duration-700 delay-200 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {slide.subtitle}
                </span>

                <h1
                  className={`font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 transform transition-all duration-700 delay-300 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {slide.title}
                </h1>

                <p
                  className={`text-xl text-white/90 mb-8 max-w-lg transform transition-all duration-700 delay-400 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {slide.description}
                </p>

                <div
                  className={`flex gap-4 transform transition-all duration-700 delay-500 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  <Button variant="fresh" size="xl" asChild>
                    <Link to={slide.link}>
                      {slide.cta}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    asChild
                  >
                    <Link to="/products">View All Products</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-primary' : 'w-3 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/20">
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
};

export default HeroSlideshow;
