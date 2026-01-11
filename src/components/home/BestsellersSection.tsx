import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getBestsellers } from '@/data/products';

const BestsellersSection: React.FC = () => {
  const bestsellers = getBestsellers();

  return (
    <section className="py-12 lg:py-16">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Bestsellers
            </h2>
            <p className="text-muted-foreground mt-1">
              Our most popular products loved by customers
            </p>
          </div>
          <Link
            to="/products?sort=bestseller"
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {bestsellers.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            to="/products?sort=bestseller"
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            View All Bestsellers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;
