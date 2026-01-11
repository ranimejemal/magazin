import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';

const CategorySection: React.FC = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-1">
              Browse our wide selection of fresh groceries
            </p>
          </div>
          <Link
            to="/categories"
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="category-card group"
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="font-display font-semibold text-background text-lg">
                    {category.name}
                  </h3>
                  <p className="text-background/70 text-sm">
                    {category.productCount} products
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            View All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
