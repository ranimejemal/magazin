import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-fresh">
      <div className="container-wide py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fresh-light text-primary text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              Fresh & Organic Groceries
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Fresh Food,{' '}
              <span className="text-gradient-primary">Delivered</span> to Your Door
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Shop from over 5,000+ products including fresh produce, dairy, meat, and pantry essentials. 
              Same-day delivery available in your area.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button variant="fresh" size="xl" asChild>
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="fresh-outline" size="xl" asChild>
                <Link to="/deals">View Deals</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Orders $50+</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Same Day</p>
                  <p className="text-xs text-muted-foreground">Fast delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">100% Fresh</p>
                  <p className="text-xs text-muted-foreground">Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop"
                  alt="Fresh groceries"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -left-4 top-1/4 bg-card p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100&h=100&fit=crop"
                    alt="Strawberries"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">Fresh Strawberries</p>
                    <p className="text-primary font-bold">$5.99</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-card p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-fresh-light flex items-center justify-center">
                    <span className="text-2xl">🥑</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Organic Avocados</p>
                    <p className="text-accent font-bold">25% OFF</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
