import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Grid3X3, List, SlidersHorizontal, X, Search as SearchIcon } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { products, categories } from '@/data/products';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/backend/client';
import type { Tables } from '@/integrations/supabase/types';
import { logError } from '@/lib/logger';

type Product = Tables<'products'>;

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from database when there's a search query
  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery) {
        setDbProducts([]);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .eq('is_active', true);
        
        if (!error && data) {
          setDbProducts(data);
        }
      } catch (err) {
        logError('Products.fetch', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery]);

  // Use DB products if searching, otherwise use static products
  const baseProducts = useMemo(() => {
    if (searchQuery && dbProducts.length > 0) {
      return dbProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        image: p.image || '',
        category: '',
        brand: p.brand || '',
        unit: p.unit || 'each',
        rating: Number(p.rating) || 0,
        reviewCount: p.review_count || 0,
        inStock: p.in_stock ?? true,
        badges: (p.badges || []) as ('sale' | 'new' | 'bestseller' | 'organic' | 'local')[],
      }));
    }
    return products;
  }, [searchQuery, dbProducts]);

  const brands = useMemo(() => 
    [...new Set(baseProducts.map(p => p.brand))],
    [baseProducts]
  );

  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by stock
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Filter by sale
    if (onSaleOnly) {
      result = result.filter(p => p.badges?.includes('sale'));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = result.filter(p => p.badges?.includes('new')).concat(
          result.filter(p => !p.badges?.includes('new'))
        );
        break;
      case 'bestseller':
        result = result.filter(p => p.badges?.includes('bestseller')).concat(
          result.filter(p => !p.badges?.includes('bestseller'))
        );
        break;
    }

    return result;
  }, [baseProducts, selectedCategories, priceRange, inStockOnly, onSaleOnly, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50]);
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-display font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.slice(0, 8).map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => handleCategoryToggle(category.name)}
              />
              <span className="text-sm">{category.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">({category.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={50}
          step={1}
          className="mb-3"
        />
        <div className="flex items-center gap-2 text-sm">
          <span>${priceRange[0]}</span>
          <span className="text-muted-foreground">to</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-display font-semibold mb-3">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(!!checked)}
            />
            <span className="text-sm">In Stock Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={onSaleOnly}
              onCheckedChange={(checked) => setOnSaleOnly(!!checked)}
            />
            <span className="text-sm">On Sale</span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );

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
              <span className="text-foreground">All Products</span>
            </nav>
          </div>
        </div>

        <div className="container-wide py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32">
                <h2 className="font-display text-lg font-bold mb-6">Filters</h2>
                <FilterSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="bestseller">Bestsellers</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || inStockOnly || onSaleOnly) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategories.map(cat => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-fresh-light text-primary text-sm"
                    >
                      {cat}
                      <button onClick={() => handleCategoryToggle(cat)}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-fresh-light text-primary text-sm">
                      In Stock
                      <button onClick={() => setInStockOnly(false)}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                  {onSaleOnly && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-coral-light text-accent text-sm">
                      On Sale
                      <button onClick={() => setOnSaleOnly(false)}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6'
                    : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={viewMode === 'list' ? 'horizontal' : 'default'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                  <Button variant="fresh" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
