import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== id).slice(0, 4);
  const inCart = product ? isInCart(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold mb-4">Product Not Found</h1>
            <Button variant="fresh" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // Mock multiple images
  const images = [
    product.image,
    product.image.replace('fit=crop', 'fit=crop&sat=-100'),
    product.image.replace('fit=crop', 'fit=crop&blur=2'),
  ];

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
              <Link to="/products" className="hover:text-primary">Products</Link>
              <span className="mx-2">/</span>
              <Link to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">
                {product.category}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container-wide py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount && <span className="badge-sale text-sm">-{discount}%</span>}
                  {product.badges?.includes('organic') && (
                    <span className="bg-fresh-light text-fresh font-semibold text-sm px-3 py-1 rounded-full">
                      Organic
                    </span>
                  )}
                  {product.badges?.includes('bestseller') && (
                    <span className="badge-bestseller text-sm">Bestseller</span>
                  )}
                </div>
                
                {/* Navigation */}
                <button
                  onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-golden text-golden'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-sm">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Unit */}
              <p className="text-muted-foreground mb-6">{product.unit}</p>

              {/* Description */}
              <p className="text-foreground/80 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              {product.inStock ? (
                <div className="flex items-center gap-2 text-primary mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="font-medium">In Stock</span>
                  {product.stockCount && product.stockCount < 20 && (
                    <span className="text-accent">- Only {product.stockCount} left!</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(q => q + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="fresh"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {inCart ? 'Add More' : 'Add to Cart'}
                </Button>

                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-xs font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Orders $50+</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-xs font-medium">Fresh Guarantee</p>
                  <p className="text-xs text-muted-foreground">100% Quality</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30 Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="nutrition"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Nutrition Facts
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Reviews ({product.reviewCount})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <h4>Key Features</h4>
                  <ul>
                    <li>Premium quality from trusted suppliers</li>
                    <li>Carefully selected for freshness</li>
                    <li>Sustainably sourced whenever possible</li>
                    <li>Perfect for everyday cooking and special occasions</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="nutrition" className="mt-6">
                <div className="max-w-md">
                  <h4 className="font-display font-semibold mb-4">Nutrition Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span>Serving Size</span>
                      <span className="font-medium">{product.unit}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span>Calories</span>
                      <span className="font-medium">{product.nutrition?.calories || 120}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span>Protein</span>
                      <span className="font-medium">{product.nutrition?.protein || 3}g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span>Carbohydrates</span>
                      <span className="font-medium">{product.nutrition?.carbs || 15}g</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Fat</span>
                      <span className="font-medium">{product.nutrition?.fat || 5}g</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-display text-5xl font-bold text-primary">{product.rating}</div>
                      <div className="flex justify-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-golden text-golden'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{product.reviewCount} reviews</p>
                    </div>
                  </div>
                  <Button variant="fresh-outline">Write a Review</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
