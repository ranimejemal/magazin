import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { promoOffers } from '@/data/products';

const PromoSection: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-muted/50">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Special Offers
            </h2>
            <p className="text-muted-foreground mt-1">
              Don't miss out on these amazing deals
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoOffers.map((offer, index) => (
            <Link
              key={offer.id}
              to="/deals"
              className={`relative overflow-hidden rounded-2xl group ${
                index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="aspect-[16/9] relative">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 ${
                  offer.bgColor === 'fresh' 
                    ? 'bg-gradient-to-r from-primary/90 to-primary/50' 
                    : 'bg-gradient-to-r from-accent/90 to-accent/50'
                }`} />
                <div className="absolute inset-0 flex flex-col justify-between p-6 text-primary-foreground">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/20 backdrop-blur-sm text-sm font-medium mb-3">
                      <Tag className="h-3.5 w-3.5" />
                      {offer.discount}
                    </span>
                    <h3 className="font-display text-2xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-primary-foreground/80">{offer.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    {offer.code && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/20 backdrop-blur-sm">
                        <span className="text-sm">Use code:</span>
                        <span className="font-mono font-bold">{offer.code}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="h-4 w-4" />
                      Ends soon
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Flash Sale Banner */}
        <div className="mt-8 bg-gradient-accent rounded-2xl p-6 lg:p-8 text-accent-foreground">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/20 text-sm font-medium mb-3">
                🔥 Flash Sale - Limited Time Only!
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-2">
                Up to 50% Off Fresh Produce
              </h3>
              <p className="text-accent-foreground/80">
                Shop now and save big on seasonal fruits and vegetables
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-4">
                <div className="font-display text-4xl font-bold">12</div>
                <div className="text-sm text-accent-foreground/80">Hours</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center px-4">
                <div className="font-display text-4xl font-bold">34</div>
                <div className="text-sm text-accent-foreground/80">Mins</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center px-4">
                <div className="font-display text-4xl font-bold">56</div>
                <div className="text-sm text-accent-foreground/80">Secs</div>
              </div>
              <Button variant="secondary" size="lg" className="ml-4" asChild>
                <Link to="/deals">
                  Shop Sale
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
