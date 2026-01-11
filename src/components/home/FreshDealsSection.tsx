import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Percent } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getOnSale } from '@/data/products';

const FreshDealsSection: React.FC = () => {
  const saleProducts = getOnSale();

  return (
    <section className="py-12 lg:py-16 bg-coral-light">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Percent className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                Fresh Deals
              </h2>
              <p className="text-muted-foreground mt-1">
                Save big on quality products
              </p>
            </div>
          </div>
          <Link
            to="/deals"
            className="hidden sm:flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
          >
            View All Deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {saleProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 text-accent font-medium"
          >
            View All Deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreshDealsSection;
