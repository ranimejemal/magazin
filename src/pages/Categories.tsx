import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';

const Categories: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="container-wide py-4">
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">All Categories</span>
            </nav>
          </div>
        </div>

        <div className="container-wide py-8 lg:py-12">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Shop by Category
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our wide selection of fresh groceries across all categories
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="font-display font-bold text-xl text-background mb-1">
                      {category.name}
                    </h2>
                    <p className="text-background/70 text-sm">
                      {category.productCount} products
                    </p>
                  </div>
                </div>
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.subcategories.slice(0, 4).map((sub) => (
                        <span
                          key={sub.id}
                          className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      <span>Browse Category</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
