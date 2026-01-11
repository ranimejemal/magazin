import React from 'react';

const brands = [
  { name: 'Green Valley Farms', logo: '🌿' },
  { name: 'Berry Best', logo: '🍓' },
  { name: 'Ocean Harvest', logo: '🐟' },
  { name: 'Happy Cow Dairy', logo: '🐄' },
  { name: 'Stone Mill Bakery', logo: '🥖' },
  { name: 'Mountain Roast', logo: '☕' },
];

const FeaturedBrands: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="container-wide">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Trusted by Top Brands
          </h2>
          <p className="text-muted-foreground">
            We partner with the best to bring you quality products
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-3xl">{brand.logo}</span>
              <span className="font-medium text-muted-foreground">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
